from __future__ import annotations

import queue
import threading
from dataclasses import dataclass
from pathlib import Path

from ..gitrepo.shadow import GitError, GitShadow
from ..logging import get_logger
from ..settings import Settings, SettingsProvider, current_settings
from ..store.db import Database
from ..store.repositories import ReadStore, WriteStore

LOGGER = get_logger("snapshots")
MIN_INTERVAL_SECONDS = 1.5
QUEUE_SIZE = 1000


@dataclass(frozen=True, slots=True)
class SnapshotRequest:
    session_id: str
    ts: float
    event_id: int | None


class SnapshotService:
    def __init__(
        self,
        database: Database,
        settings: Settings,
        shadow: GitShadow | None = None,
        settings_provider: SettingsProvider | None = None,
    ) -> None:
        self._database = database
        self._settings = settings
        self._settings_provider = settings_provider
        self._shadow = shadow or GitShadow()
        self._queue: queue.Queue[SnapshotRequest] = queue.Queue(maxsize=QUEUE_SIZE)
        self._closing = threading.Event()
        self._close_lock = threading.Lock()
        self._started = False
        self._closed = False
        self._last: dict[str, tuple[float, str]] = {}
        self._thread = threading.Thread(
            target=self._run,
            name="session-rewind-snapshots",
            daemon=True,
        )

    def start(self) -> None:
        if self._started:
            return
        self._started = True
        self._thread.start()

    def request(self, session_id: str, ts: float, event_id: int | None) -> None:
        settings = current_settings(self._settings, self._settings_provider)
        if not settings.snapshot_enabled or settings.record_paused:
            return
        try:
            self._queue.put_nowait(SnapshotRequest(session_id, ts, event_id))
        except queue.Full:
            LOGGER.debug("snapshot queue full")

    def close(self) -> None:
        with self._close_lock:
            if self._closed:
                return
            self._closed = True
        self._closing.set()
        if self._started:
            self._thread.join(timeout=15.0)

    def _run(self) -> None:
        store: WriteStore | None = None
        try:
            store = WriteStore(self._database.connect())
            while not (self._closing.is_set() and self._queue.empty()):
                try:
                    request = self._queue.get(timeout=0.5)
                except queue.Empty:
                    continue
                self._snapshot(store, request)
            self._drain(store)
        except Exception:
            LOGGER.exception("snapshot worker stopped")
        finally:
            if store is not None:
                store.close()

    def _drain(self, store: WriteStore) -> None:
        while True:
            try:
                request = self._queue.get_nowait()
            except queue.Empty:
                break
            self._snapshot(store, request)

    def _snapshot(self, store: WriteStore, request: SnapshotRequest) -> None:
        repo_root = self._repo_root(request.session_id)
        if repo_root is None:
            return
        last = self._last.get(request.session_id)
        if last is not None and request.ts - last[0] < MIN_INTERVAL_SECONDS:
            return
        sequence = request.event_id if request.event_id is not None else int(request.ts * 1000)
        try:
            snapshot = self._shadow.snapshot(repo_root, request.session_id, sequence)
        except GitError:
            LOGGER.exception("git snapshot failed")
            return
        if snapshot is None:
            return
        if last is not None and last[1] == snapshot.tree_sha:
            return
        try:
            store.add_snapshot(
                request.session_id,
                request.ts,
                str(snapshot.repo_root),
                snapshot.commit_sha,
                snapshot.ref_name,
                snapshot.fidelity,
                snapshot.file_count,
                request.event_id,
            )
        except Exception:
            LOGGER.exception("snapshot persistence failed")
            return
        self._last[request.session_id] = (request.ts, snapshot.tree_sha)

    def _repo_root(self, session_id: str) -> Path | None:
        settings = current_settings(self._settings, self._settings_provider)
        if settings.workspace_root:
            path = Path(settings.workspace_root).expanduser()
            return path if self._shadow.is_repo(path) else None
        try:
            session = ReadStore(self._database).get_session(session_id)
        except Exception:
            return None
        if session is None:
            return None
        cwd = session.get("cwd")
        if not isinstance(cwd, str) or not cwd:
            return None
        path = Path(cwd).expanduser()
        return path if self._shadow.is_repo(path) else None

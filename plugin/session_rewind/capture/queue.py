from __future__ import annotations

import queue
import threading
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

from ..logging import get_logger
from ..settings import Settings
from ..store.db import Database, EventRecord
from ..store.repositories import WriteStore
from .normalize import PayloadNormalizer, Redactor

LOGGER = get_logger("capture")
BATCH_SIZE = 100
QUEUE_SIZE = 10000


@dataclass(frozen=True, slots=True)
class CaptureItem:
    session_id: str
    ts: float
    kind: str
    payload: dict[str, Any] = field(default_factory=dict)
    turn_id: str | None = None
    task_id: str | None = None
    tool_call_id: str | None = None
    api_request_id: str | None = None
    name: str | None = None
    status: str | None = None
    duration_ms: float | None = None


class CaptureService:
    def __init__(
        self,
        database: Database,
        settings: Settings,
        event_sink: Callable[[EventRecord, int], None] | None = None,
    ) -> None:
        self._database = database
        self._settings = settings
        self._event_sink = event_sink
        self._queue: queue.Queue[CaptureItem] = queue.Queue(maxsize=QUEUE_SIZE)
        self._closing = threading.Event()
        self._close_lock = threading.Lock()
        self._dropped_lock = threading.Lock()
        self._dropped = 0
        self._started = False
        self._closed = False
        self._thread = threading.Thread(
            target=self._run,
            name="session-rewind-writer",
            daemon=True,
        )

    def start(self) -> None:
        if self._started:
            return
        self._started = True
        self._thread.start()

    def submit(self, item: CaptureItem) -> None:
        if self._settings.record_paused:
            return
        try:
            self._queue.put_nowait(item)
        except queue.Full:
            with self._dropped_lock:
                self._dropped += 1

    def close(self) -> None:
        with self._close_lock:
            if self._closed:
                return
            self._closed = True
        self._closing.set()
        if self._started:
            self._thread.join(timeout=5.0)

    def _take_dropped(self) -> int:
        with self._dropped_lock:
            value = self._dropped
            self._dropped = 0
        return value

    def _run(self) -> None:
        store: WriteStore | None = None
        try:
            store = WriteStore(self._database.connect())
            normalizer = PayloadNormalizer(
                self._settings.max_payload_bytes,
                Redactor(self._settings.redact_secrets),
            )
            while not (self._closing.is_set() and self._queue.empty()):
                try:
                    first = self._queue.get(timeout=0.25)
                except queue.Empty:
                    continue
                batch = [first]
                while len(batch) < BATCH_SIZE:
                    try:
                        batch.append(self._queue.get_nowait())
                    except queue.Empty:
                        break
                self._write_batch(store, normalizer, batch)
            self._drain(store, normalizer)
        except Exception:
            LOGGER.exception("capture writer stopped")
        finally:
            if store is not None:
                store.close()

    def _drain(self, store: WriteStore, normalizer: PayloadNormalizer) -> None:
        batch: list[CaptureItem] = []
        while True:
            try:
                batch.append(self._queue.get_nowait())
            except queue.Empty:
                break
        if batch:
            self._write_batch(store, normalizer, batch)

    def _write_batch(
        self,
        store: WriteStore,
        normalizer: PayloadNormalizer,
        batch: list[CaptureItem],
    ) -> None:
        records: list[EventRecord] = []
        sessions: dict[str, dict[str, Any]] = {}
        started: dict[str, float] = {}
        endings: list[tuple[str, float, str]] = []
        for item in batch:
            payload_json = normalizer.normalize(item.payload)
            records.append(
                EventRecord(
                    session_id=item.session_id,
                    ts=item.ts,
                    kind=item.kind,
                    payload_json=payload_json,
                    turn_id=item.turn_id,
                    task_id=item.task_id,
                    tool_call_id=item.tool_call_id,
                    api_request_id=item.api_request_id,
                    name=item.name,
                    status=item.status,
                    duration_ms=item.duration_ms,
                )
            )
            meta = sessions.setdefault(item.session_id, {})
            started[item.session_id] = min(started.get(item.session_id, item.ts), item.ts)
            for key in (
                "stored_session_id",
                "parent_session_id",
                "title",
                "cwd",
                "model",
                "provider",
                "platform",
            ):
                value = _optional_text(item.payload.get(key))
                if value is not None and meta.get(key) is None:
                    meta[key] = value
            if item.kind == "session_end":
                endings.append((item.session_id, item.ts, _outcome(item.payload)))
        dropped = self._take_dropped()
        if dropped and records:
            first = records[0]
            records.append(
                EventRecord(
                    session_id=first.session_id,
                    ts=time.time(),
                    kind="capture_dropped",
                    payload_json=normalizer.normalize({"count": dropped}),
                )
            )
        for session_id, meta in sessions.items():
            store.upsert_session(session_id, started.get(session_id, time.time()), **meta)
        inserted = store.append_events(records)
        for session_id, ts, outcome in endings:
            store.end_session(session_id, ts, outcome)
        if self._event_sink is None:
            return
        for record, event_id in zip(records, inserted, strict=False):
            try:
                self._event_sink(record, event_id)
            except Exception:
                LOGGER.exception("capture event sink failed")


def _optional_text(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        return value or None
    if isinstance(value, (int, float, bool)):
        return str(value)
    return None


def _outcome(payload: dict[str, Any]) -> str:
    if payload.get("completed"):
        return "completed"
    if payload.get("failed"):
        return "failed"
    if payload.get("interrupted"):
        return "interrupted"
    reason = payload.get("turn_exit_reason")
    if isinstance(reason, str) and reason:
        return reason
    return "ended"

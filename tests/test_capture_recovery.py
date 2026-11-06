from __future__ import annotations

import sqlite3
import time
from pathlib import Path

from session_rewind.capture.queue import CaptureItem, CaptureService
from session_rewind.settings import Settings
from session_rewind.store.db import Database
from session_rewind.store.repositories import ReadStore, WriteStore


class _FlakyService(CaptureService):
    def __init__(self, database: Database, failures: int) -> None:
        super().__init__(database=database, settings=Settings())
        self._failures = failures

    def allow_writes(self) -> None:
        self._failures = 0

    def _write_batch(
        self,
        store: WriteStore,
        batch: list[CaptureItem],
    ) -> None:
        if self._failures > 0:
            self._failures -= 1
            raise sqlite3.OperationalError("database is locked")
        super()._write_batch(store, batch)


def _wait_for_events(database: Database, session_id: str, seconds: float) -> int:
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        rows = ReadStore(database).list_events(session_id, limit=10)
        if rows:
            return len(rows)
        time.sleep(0.05)
    return 0


def test_capture_recovers_from_a_transient_store_error(database: Database) -> None:
    service = _FlakyService(database, failures=1)
    service.start()
    try:
        service.submit(
            CaptureItem(
                session_id="s_recovery",
                ts=time.time(),
                kind="user_turn",
                payload={"user_message": "hello after a lock"},
            )
        )
        assert _wait_for_events(database, "s_recovery", 5.0) >= 1
    finally:
        service.close()


def test_capture_stops_requeuing_after_repeated_failures(database: Database) -> None:
    service = _FlakyService(database, failures=99)
    service.start()
    try:
        for index in range(5):
            service.submit(
                CaptureItem(
                    session_id="s_broken",
                    ts=time.time(),
                    kind="user_turn",
                    payload={"user_message": f"attempt {index}"},
                )
            )
        deadline = time.monotonic() + 5.0
        while time.monotonic() < deadline and service.pending() > 0:
            time.sleep(0.05)
        assert service.pending() == 0
        assert _wait_for_events(database, "s_broken", 0.2) == 0
    finally:
        service.close()


def test_dropped_captures_are_reported_once_writes_resume(database: Database) -> None:
    service = _FlakyService(database, failures=99)
    service.start()
    try:
        for index in range(4):
            service.submit(
                CaptureItem(
                    session_id="s_dropped",
                    ts=time.time(),
                    kind="user_turn",
                    payload={"user_message": f"lost {index}"},
                )
            )
        deadline = time.monotonic() + 5.0
        while time.monotonic() < deadline and service.pending() > 0:
            time.sleep(0.05)
        service.allow_writes()
        service.submit(
            CaptureItem(
                session_id="s_dropped",
                ts=time.time(),
                kind="user_turn",
                payload={"user_message": "the survivor"},
            )
        )
        assert _wait_for_kind(database, "s_dropped", "capture_dropped", 5.0)
    finally:
        service.close()


def _wait_for_kind(database: Database, session_id: str, kind: str, seconds: float) -> bool:
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        rows = ReadStore(database).list_events(session_id, limit=50, kind=kind)
        if rows:
            return True
        time.sleep(0.05)
    return False


def test_capture_survives_a_failing_event_sink(database: Database, git_repo: Path) -> None:
    seen: list[int] = []

    def sink(record: object, event_id: int) -> None:
        seen.append(event_id)
        raise RuntimeError("snapshot service exploded")

    service = CaptureService(database=database, settings=Settings(), event_sink=sink)
    service.start()
    try:
        service.submit(
            CaptureItem(
                session_id="s_sink",
                ts=time.time(),
                kind="user_turn",
                payload={"user_message": "keep recording"},
            )
        )
        assert _wait_for_events(database, "s_sink", 5.0) >= 1
        service.submit(
            CaptureItem(
                session_id="s_sink",
                ts=time.time(),
                kind="assistant_response",
                payload={"assistant_response": "second still recorded"},
            )
        )
        deadline = time.monotonic() + 5.0
        while time.monotonic() < deadline and len(seen) < 2:
            time.sleep(0.05)
        assert len(seen) >= 2
    finally:
        service.close()

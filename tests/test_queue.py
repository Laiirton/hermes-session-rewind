from __future__ import annotations

import time

from session_rewind.capture.queue import CaptureItem, CaptureService
from session_rewind.settings import Settings
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import ReadStore


def test_capture_service_writes_and_closes(database: Database) -> None:
    service = CaptureService(database, Settings())
    service.start()
    service.start()
    now = time.time()
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=now,
            kind="session_start",
            payload={"model": "model-a", "platform": "desktop"},
        )
    )
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=now + 1,
            kind="user_turn",
            payload={"user_message": "hello"},
            turn_id="turn-1",
        )
    )
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=now + 2,
            kind="tool_result",
            payload={"result": "ok"},
            name="terminal",
            status="ok",
        )
    )
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=now + 3,
            kind="session_finalize",
            payload={"reason": "shutdown"},
        )
    )
    service.close()
    service.close()

    read = ReadStore(database)
    sessions = read.list_sessions(limit=10, offset=0)
    assert len(sessions) == 1
    assert sessions[0]["session_id"] == "s1"
    assert sessions[0]["outcome"] == "shutdown"
    events = read.list_events("s1", limit=10)
    assert [event["kind"] for event in events] == [
        "session_start",
        "user_turn",
        "tool_result",
        "session_finalize",
    ]


def test_nested_tool_call_is_recorded_under_the_session_of_its_task(
    database: Database,
) -> None:
    service = CaptureService(database, Settings())
    service.start()
    now = time.time()
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=now,
            kind="session_start",
            payload={"model": "model-a", "platform": "gateway"},
        )
    )
    service.submit(
        CaptureItem(
            session_id="",
            ts=now + 1,
            kind="tool_call",
            payload={"args": {"command": "ls"}},
            task_id="s1",
            name="terminal",
            status="pending",
        )
    )
    service.close()

    read = ReadStore(database)
    assert [session["session_id"] for session in read.list_sessions(10, 0)] == ["s1"]
    assert [event["kind"] for event in read.list_events("s1", limit=10)] == [
        "session_start",
        "tool_call",
    ]


def test_event_without_a_session_and_without_a_known_task_is_dropped(
    database: Database,
) -> None:
    service = CaptureService(database, Settings())
    service.start()
    service.submit(
        CaptureItem(
            session_id="",
            ts=time.time(),
            kind="tool_call",
            payload={"args": {"command": "ls"}},
            task_id="20b4ec42-4f31-4b0a-9e1c-1f2d3e4a5b6c",
            name="terminal",
            status="pending",
        )
    )
    service.submit(
        CaptureItem(
            session_id="",
            ts=time.time(),
            kind="tool_call",
            payload={"args": {"command": "ls"}},
            name="terminal",
            status="pending",
        )
    )
    service.close()

    read = ReadStore(database)
    assert read.counts()["events"] == 0
    assert read.counts()["sessions"] == 0


def test_capture_service_paused(database: Database) -> None:
    service = CaptureService(database, Settings(record_paused=True))
    service.start()
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=time.time(),
            kind="session_start",
            payload={},
        )
    )
    service.close()
    assert ReadStore(database).counts()["events"] == 0


def test_capture_service_close_before_start(database: Database) -> None:
    service = CaptureService(database, Settings())
    service.close()


def test_capture_service_calls_event_sink(database: Database) -> None:
    seen: list[tuple[str, int]] = []

    def sink(record: EventRecord, event_id: int) -> None:
        seen.append((record.kind, event_id))

    service = CaptureService(database, Settings(), event_sink=sink)
    service.start()
    service.submit(
        CaptureItem(
            session_id="s1",
            ts=time.time(),
            kind="user_turn",
            payload={"user_message": "hello"},
        )
    )
    service.close()
    assert seen == [("user_turn", 1)]

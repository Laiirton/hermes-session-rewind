from __future__ import annotations

import json
from typing import Any

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from session_rewind.dashboard.api import create_router
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import ReadStore, WriteStore

PREFIX = "/api/plugins/session-rewind"
SESSION = "sess_timeline"


def _records(turns: int) -> list[EventRecord]:
    items: list[EventRecord] = []
    for index in range(turns):
        base = 100.0 + (index * 10.0)
        items.append(
            EventRecord(
                session_id=SESSION,
                ts=base,
                kind="user_turn",
                payload_json=json.dumps({"user_message": f"turn {index}"}),
                turn_id=f"turn-{index}",
            )
        )
        items.append(
            EventRecord(
                session_id=SESSION,
                ts=base + 1.0,
                kind="tool_call",
                name="terminal",
                payload_json=json.dumps({"args": {"command": "ls"}}),
                turn_id=f"turn-{index}",
                duration_ms=1000.0,
            )
        )
        items.append(
            EventRecord(
                session_id=SESSION,
                ts=base + 2.0,
                kind="tool_result",
                name="terminal",
                status="error" if index == turns - 1 else "ok",
                payload_json=json.dumps({"result": "done"}),
                turn_id=f"turn-{index}",
                duration_ms=2000.0,
            )
        )
    return items


@pytest.fixture
def timeline(database: Database) -> Database:
    store = WriteStore(database.connect())
    try:
        store.upsert_session(SESSION, 100.0, model="model-a")
        store.append_events(_records(3))
    finally:
        store.close()
    return database


def _client(database: Database) -> TestClient:
    app = FastAPI()
    app.include_router(create_router(database), prefix=PREFIX)
    return TestClient(app)


def test_turns_group_events_and_order_newest_first(timeline: Database) -> None:
    turns = ReadStore(timeline).list_turns(SESSION, limit=2)

    assert [int(turn["seq"]) for turn in turns] == [7, 4]
    newest = turns[0]
    assert int(newest["event_count"]) == 3
    assert int(newest["tool_calls"]) == 1
    assert int(newest["tool_errors"]) == 1
    assert int(newest["seq_to"]) == 9
    assert float(newest["last_ts"]) == 122.0
    assert json.loads(str(newest["payload_json"]))["user_message"] == "turn 2"

    previous = turns[1]
    assert int(previous["event_count"]) == 3
    assert int(previous["tool_errors"]) == 0
    assert int(previous["seq_to"]) == 6


def test_turn_work_span_stops_at_the_turn_end(timeline: Database) -> None:
    store = WriteStore(timeline.connect())
    try:
        store.append_events(
            [
                EventRecord(
                    session_id=SESSION,
                    ts=200.0,
                    kind="turn_end",
                    payload_json="{}",
                    turn_id="turn-2",
                ),
                EventRecord(
                    session_id=SESSION,
                    ts=900.0,
                    kind="session_finalize",
                    payload_json="{}",
                ),
            ]
        )
    finally:
        store.close()

    turns = ReadStore(timeline).list_turns(SESSION, limit=2)
    newest = turns[0]

    assert float(newest["last_ts"]) == 900.0
    assert float(newest["work_ts"]) == 200.0

    without_marker = turns[1]
    assert float(without_marker["work_ts"]) == float(without_marker["last_ts"])


def test_turn_cursor_walks_back_to_the_start(timeline: Database) -> None:
    read = ReadStore(timeline)
    first = read.list_turns(SESSION, limit=2)
    oldest_seq = int(first[-1]["seq"])
    second = read.list_turns(SESSION, before_seq=oldest_seq, limit=2)

    assert [int(turn["seq"]) for turn in second] == [1]
    assert int(second[0]["seq_to"]) == 3


def test_events_before_seq_bounds_the_range(timeline: Database) -> None:
    events = ReadStore(timeline).list_events(SESSION, after_seq=3, before_seq=7, limit=50)

    assert [int(event["seq"]) for event in events] == [4, 5, 6]


def test_turns_endpoint_pages_with_cursor(timeline: Database) -> None:
    client = _client(timeline)
    page = client.get(f"{PREFIX}/sessions/{SESSION}/turns?limit=2")

    assert page.status_code == 200
    body = page.json()
    assert body["has_more"] is True
    assert body["before_seq"] == 4
    assert [turn["seq"] for turn in body["items"]] == [7, 4]
    assert body["items"][0]["preview"] == "turn 2"

    older = client.get(f"{PREFIX}/sessions/{SESSION}/turns?limit=2&before_seq=4")
    assert older.json()["has_more"] is False
    assert [turn["seq"] for turn in older.json()["items"]] == [1]


def test_events_endpoint_reports_has_more_without_a_false_negative(timeline: Database) -> None:
    client = _client(timeline)
    page: dict[str, Any] = client.get(f"{PREFIX}/sessions/{SESSION}/events?limit=9").json()

    assert len(page["items"]) == 9
    assert page["has_more"] is False
    assert page["after_seq"] is None

from __future__ import annotations

import json

from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import ReadStore, WriteStore


def test_sessions_events_and_search(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("sess_1", 10.0, model="model-a", provider="local")
        store.append_events(
            [
                EventRecord(
                    session_id="sess_1",
                    ts=10.0,
                    kind="session_start",
                    payload_json=json.dumps({"model": "model-a"}),
                ),
                EventRecord(
                    session_id="sess_1",
                    ts=11.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "run pytest"}),
                ),
            ]
        )
        store.end_session("sess_1", 12.0, "completed")
    finally:
        store.close()

    read = ReadStore(database)
    sessions = read.list_sessions(limit=10, offset=0)
    assert len(sessions) == 1
    assert sessions[0]["session_id"] == "sess_1"
    assert sessions[0]["event_count"] == 2
    assert sessions[0]["outcome"] == "completed"

    events = read.list_events("sess_1", limit=10)
    assert [event["seq"] for event in events] == [1, 2]
    assert read.get_event(int(events[0]["id"])) is not None

    results = read.search_events("pytest", session_id="sess_1", limit=10)
    assert len(results) == 1
    assert results[0]["kind"] == "user_turn"

    assert read.get_session("missing") is None


def test_snapshots_branches_runs_and_bookmarks(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("sess_1", 10.0)
        snapshot_id = store.add_snapshot(
            "sess_1",
            10.0,
            "C:/repo",
            "a" * 40,
            "refs/hermes-rewind/sess_1/1",
            "full",
            3,
        )
        store.create_branch(
            "branch_1",
            "sess_1",
            10.0,
            2,
            snapshot_id,
            "C:/wt",
            "model-b",
            "local",
            "continue",
            "pytest -q",
            "prepared",
            10.0,
        )
        store.set_branch_child("branch_1", "child_1", "stored_1", "C:/wt", 11.0)
        store.upsert_run(
            "branch_1",
            12.0,
            tokens_in=5,
            tokens_out=6,
            tool_calls=1,
            verify_exit=0,
            verify_out="ok",
        )
        bookmark_id = store.add_bookmark("sess_1", None, "checkpoint", "note", 13.0)
    finally:
        store.close()
    assert bookmark_id == 1

    read = ReadStore(database)
    snapshots = read.list_snapshots("sess_1")
    assert snapshots[0]["commit_sha"] == "a" * 40
    branch = read.get_branch("branch_1")
    assert branch is not None
    assert branch["state"] == "running"
    run = read.get_run("branch_1")
    assert run is not None
    assert run["verify_exit"] == 0
    assert read.list_branches("sess_1")[0]["id"] == "branch_1"

    store = WriteStore(database.connect())
    try:
        store.complete_child_branch("child_1", "done", 14.0)
    finally:
        store.close()
    branch_after = read.get_branch("branch_1")
    assert branch_after is not None
    assert branch_after["state"] == "done"


def test_metrics_use_last_turn_outcome(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("sess_turn", 1.0)
        store.append_events(
            [
                EventRecord(
                    session_id="sess_turn",
                    ts=2.0,
                    kind="turn_end",
                    payload_json=json.dumps({"completed": True}),
                )
            ]
        )
    finally:
        store.close()
    metrics = ReadStore(database).session_metrics("sess_turn")
    assert metrics is not None
    assert metrics["outcome"] == "completed"


def test_compare_sessions(seeded_database: Database) -> None:
    comparison = ReadStore(seeded_database).compare_sessions("sess_baseline", "sess_branch")
    left = comparison["left"]
    right = comparison["right"]
    assert left is not None
    assert right is not None
    assert left["tokens_in"] == 10
    assert right["tokens_in"] == 5
    assert left["tool_errors"] == 1
    assert right["tool_errors"] == 0
    assert left["outcome"] == "failed"
    assert right["outcome"] == "completed"
    assert comparison["right"] is not None


def test_duplicate_snapshot_returns_existing_id(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("sess_1", 1.0)
        first = store.add_snapshot(
            "sess_1",
            1.0,
            "C:/repo",
            "b" * 40,
            "refs/hermes-rewind/sess_1/1",
            "full",
            1,
        )
        second = store.add_snapshot(
            "sess_1",
            2.0,
            "C:/repo",
            "b" * 40,
            "refs/hermes-rewind/sess_1/2",
            "full",
            1,
        )
    finally:
        store.close()
    assert first == second


def test_delete_older_than(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("old", 10.0)
        store.upsert_session("new", 1000.0)
    finally:
        store.close()
    store = WriteStore(database.connect())
    try:
        assert store.delete_older_than(100.0) == 1
    finally:
        store.close()
    sessions = ReadStore(database).list_sessions(limit=10, offset=0)
    assert [session["session_id"] for session in sessions] == ["new"]


def test_search_without_session_and_missing_rows(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("sess_1", 10.0)
        store.append_events(
            [
                EventRecord(
                    session_id="sess_1",
                    ts=10.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "needle"}),
                )
            ]
        )
    finally:
        store.close()
    read = ReadStore(database)
    assert len(read.search_events("needle", limit=10)) == 1
    assert read.get_branch("missing") is None
    assert read.get_run("missing") is None
    comparison = read.compare_sessions("sess_1", "missing")
    assert comparison["right"] is None

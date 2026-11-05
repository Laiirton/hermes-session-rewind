from __future__ import annotations

import json
from pathlib import Path

from session_rewind.store.db import Database
from session_rewind.tools import RewindTools


def test_tools_round_trip(seeded_database: Database) -> None:
    tools = RewindTools(seeded_database)

    search = json.loads(tools.search({"query": "pytest", "limit": 5}))
    assert len(search["events"]) >= 2
    event_id = search["events"][0]["id"]

    detail = json.loads(tools.inspect({"event_id": event_id}))
    assert detail["id"] == event_id
    assert "payload" in detail

    session_events = json.loads(tools.inspect({"session_id": "sess_baseline", "limit": 3}))
    assert session_events["session"]["session_id"] == "sess_baseline"
    assert len(session_events["events"]) == 3
    assert session_events["has_more"] is True

    comparison = json.loads(
        tools.compare(
            {
                "left_session_id": "sess_baseline",
                "right_session_id": "sess_branch",
            }
        )
    )
    assert comparison["verdict"] == "right has fewer tool errors"
    assert comparison["right"]["tokens_in"] == 5

    bookmark = json.loads(
        tools.bookmark(
            {
                "session_id": "sess_baseline",
                "label": "checkpoint",
                "note": "before the bad fix",
            }
        )
    )
    assert bookmark["label"] == "checkpoint"
    assert bookmark["note"] == "before the bad fix"


def test_tools_reject_invalid_input(seeded_database: Database) -> None:
    tools = RewindTools(seeded_database)
    assert json.loads(tools.search({})) == {"error": "query is required"}
    assert json.loads(tools.inspect({})) == {"error": "event_id or session_id is required"}
    assert json.loads(tools.compare({})) == {"error": "left_session_id is required"}
    assert json.loads(tools.bookmark({"label": "checkpoint"})) == {
        "error": "session_id is required"
    }
    assert json.loads(tools.bookmark({"session_id": "missing", "label": "checkpoint"})) == {
        "error": "session or event not found"
    }
    assert json.loads(tools.inspect({"event_id": 99999})) == {"error": "event not found"}

    unknown_side = json.loads(
        tools.compare({"left_session_id": "sess_baseline", "right_session_id": "missing"})
    )
    assert unknown_side["right"] is None
    assert unknown_side["verdict"] == "missing session"


def test_bookmark_refuses_an_event_from_another_session(seeded_database: Database) -> None:
    tools = RewindTools(seeded_database)
    foreign = json.loads(tools.inspect({"session_id": "sess_branch", "limit": 1}))
    event_id = foreign["events"][0]["id"]

    result = json.loads(
        tools.bookmark({"session_id": "sess_baseline", "event_id": event_id, "label": "checkpoint"})
    )

    assert result == {"error": "that event belongs to another session"}
    connection = seeded_database.connect()
    try:
        assert connection.execute("SELECT COUNT(*) FROM bookmarks").fetchone()[0] == 0
    finally:
        connection.close()


def test_tools_reject_an_integer_out_of_sqlite_range(seeded_database: Database) -> None:
    tools = RewindTools(seeded_database)

    assert json.loads(tools.inspect({"event_id": 10**20})) == {"error": "event_id is out of range"}
    assert json.loads(
        tools.bookmark({"session_id": "sess_baseline", "label": "x", "event_id": -1})
    ) == {"error": "event_id is out of range"}


def test_tool_errors_never_leak_store_internals(seeded_database: Database, tmp_path: Path) -> None:
    tools = RewindTools(seeded_database)
    missing = json.loads(tools.bookmark({"session_id": "missing", "label": "checkpoint"}))
    assert missing == {"error": "session or event not found"}

    broken = RewindTools(Database(tmp_path))
    unavailable = json.loads(broken.search({"query": "anything"}))
    assert unavailable == {"error": "the rewind store is unavailable"}

    assert "sqlite" not in json.dumps(missing).lower()
    assert str(tmp_path) not in json.dumps(unavailable)

from __future__ import annotations

import json

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
    assert "error" in json.loads(tools.search({}))
    assert "error" in json.loads(tools.inspect({}))
    assert "error" in json.loads(tools.compare({}))
    assert "error" in json.loads(tools.bookmark({"session_id": "missing", "label": "checkpoint"}))
    missing_event = json.loads(tools.inspect({"event_id": 99999}))
    assert missing_event["error"] == "event not found"

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient
from session_rewind.dashboard.api import create_router
from session_rewind.store.db import Database

PREFIX = "/api/plugins/session-rewind"


def _client(database: Database) -> TestClient:
    app = FastAPI()
    app.include_router(create_router(database), prefix=PREFIX)
    return TestClient(app)


def test_health_and_sessions(seeded_database: Database) -> None:
    client = _client(seeded_database)
    health = client.get(f"{PREFIX}/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ok"
    assert health.json()["sessions"] == 2
    assert health.json()["events"] > 0

    sessions = client.get(f"{PREFIX}/sessions")
    assert sessions.status_code == 200
    assert len(sessions.json()["items"]) == 2

    session = client.get(f"{PREFIX}/sessions/sess_baseline")
    assert session.status_code == 200
    assert session.json()["session_id"] == "sess_baseline"
    assert session.json()["model"] == "model-a"

    assert client.get(f"{PREFIX}/sessions/missing").status_code == 404


def test_events_search_and_detail(seeded_database: Database) -> None:
    client = _client(seeded_database)
    events = client.get(f"{PREFIX}/sessions/sess_baseline/events")
    assert events.status_code == 200
    body = events.json()
    assert len(body["items"]) == 7
    assert body["items"][0]["kind"] == "session_start"
    event_id = body["items"][1]["id"]

    detail = client.get(f"{PREFIX}/events/{event_id}")
    assert detail.status_code == 200
    assert detail.json()["payload"]["user_message"].startswith("Fix")
    assert client.get(f"{PREFIX}/events/99999").status_code == 404

    search = client.get(f"{PREFIX}/search", params={"q": "pytest"})
    assert search.status_code == 200
    items = search.json()["items"]
    assert len(items) >= 2
    assert {item["session_id"] for item in items} == {"sess_baseline", "sess_branch"}

    snapshots = client.get(f"{PREFIX}/sessions/sess_baseline/snapshots")
    assert snapshots.status_code == 200
    assert snapshots.json() == []


def test_compare_and_bookmarks(seeded_database: Database) -> None:
    client = _client(seeded_database)
    compare = client.get(
        f"{PREFIX}/compare",
        params={"left": "sess_baseline", "right": "sess_branch"},
    )
    assert compare.status_code == 200
    body = compare.json()
    assert body["left"]["tool_errors"] == 1
    assert body["right"]["tool_errors"] == 0
    assert "fewer tool errors" in body["verdict"]

    bookmark = client.post(
        f"{PREFIX}/bookmarks",
        json={"session_id": "sess_baseline", "label": "checkpoint"},
    )
    assert bookmark.status_code == 200
    assert bookmark.json()["label"] == "checkpoint"

    missing = client.post(
        f"{PREFIX}/bookmarks",
        json={"session_id": "missing", "label": "checkpoint"},
    )
    assert missing.status_code == 404

    branch = client.get(f"{PREFIX}/branches/missing")
    assert branch.status_code == 404


def test_get_branch_does_not_mutate_state(seeded_database: Database) -> None:
    from session_rewind.store.repositories import WriteStore

    store = WriteStore(seeded_database.connect())
    try:
        store.create_branch(
            "branch-read",
            "sess_child",
            20.0,
            1,
            None,
            None,
            None,
            None,
            "rerun",
            None,
            "running",
            30.0,
        )
        store.set_branch_child("branch-read", "sess_child", "sess_child", None, 30.0)
    finally:
        store.close()
    client = _client(seeded_database)

    read = client.get(f"{PREFIX}/branches/branch-read")
    assert read.status_code == 200
    assert read.json()["branch"]["state"] == "running"

    reconciled = client.post(f"{PREFIX}/branches/branch-read/reconcile")
    assert reconciled.status_code == 200
    assert reconciled.json()["branch"]["state"] in ("done", "failed")

    assert client.post(f"{PREFIX}/branches/missing/reconcile").status_code == 404


def test_verify_resolve_reports_the_command_being_edited(
    seeded_database: Database, tmp_path: Path
) -> None:
    from session_rewind.store.repositories import WriteStore

    worktree = tmp_path / "worktree"
    (worktree / "bin").mkdir(parents=True)
    tool = worktree / "bin" / "check"
    tool.write_text("", encoding="utf-8")
    store = WriteStore(seeded_database.connect())
    try:
        store.create_branch(
            "branch-resolve",
            "sess_baseline",
            20.0,
            1,
            None,
            str(worktree),
            None,
            None,
            "rerun",
            None,
            "prepared",
            30.0,
        )
    finally:
        store.close()
    client = _client(seeded_database)

    resolved = client.get(
        f"{PREFIX}/branches/branch-resolve/verify-resolve",
        params={"cmd": "bin/check --quiet"},
    )
    assert resolved.status_code == 200
    assert resolved.json() == {
        "command": "bin/check --quiet",
        "resolved": str(tool) + " --quiet",
    }

    missing = client.get(
        f"{PREFIX}/branches/branch-resolve/verify-resolve",
        params={"cmd": "definitely-not-a-real-program-xyz"},
    )
    assert missing.json()["resolved"] is None

    assert (
        client.get(
            f"{PREFIX}/branches/missing/verify-resolve",
            params={"cmd": "bin/check"},
        ).status_code
        == 404
    )
    assert (
        client.get(
            f"{PREFIX}/branches/branch-resolve/verify-resolve",
            params={"cmd": "bin/check\nrm -rf /"},
        ).status_code
        == 422
    )
    assert (
        client.get(
            f"{PREFIX}/branches/branch-resolve/verify-resolve",
            params={"cmd": "  "},
        ).status_code
        == 422
    )

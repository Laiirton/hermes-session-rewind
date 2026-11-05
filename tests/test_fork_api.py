from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient
from session_rewind.dashboard.api import create_router
from session_rewind.gitrepo.shadow import GitShadow
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import WriteStore

PREFIX = "/api/plugins/session-rewind"


def _client(database: Database) -> TestClient:
    app = FastAPI()
    app.include_router(create_router(database), prefix=PREFIX)
    return TestClient(app)


def _seed(database: Database, git_repo: Path) -> int:
    shadow = GitShadow()
    snapshot = shadow.snapshot(git_repo, "s1", 1)
    assert snapshot is not None
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s1", 1.0, cwd=str(git_repo), model="model-a")
        ids = store.append_events(
            [
                EventRecord(
                    session_id="s1",
                    ts=10.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "Fix the failing test"}),
                )
            ]
        )
        store.add_snapshot(
            "s1",
            9.0,
            str(git_repo),
            snapshot.commit_sha,
            snapshot.ref_name,
            "full",
            snapshot.file_count,
            None,
        )
    finally:
        store.close()
    return ids[0]


def test_fork_api_flow(database: Database, git_repo: Path) -> None:
    event_id = _seed(database, git_repo)
    client = _client(database)
    prepared = client.post(
        f"{PREFIX}/forks/prepare",
        json={
            "session_id": "s1",
            "event_id": event_id,
            "model": "model-b",
            "provider": "local",
            "verify_cmd": 'python -c "print(1)"',
        },
    )
    assert prepared.status_code == 200
    plan = prepared.json()
    assert plan["fidelity"] == "full"
    assert plan["worktree_path"] is not None
    assert "Fix the failing test" in plan["prompt"]
    branch_id = plan["branch_id"]

    committed = client.post(
        f"{PREFIX}/forks/{branch_id}/commit",
        json={
            "child_session_id": "child-1",
            "child_stored_session_id": "stored-child-1",
            "prompt": "edited prompt",
        },
    )
    assert committed.status_code == 200
    assert committed.json()["branch"]["state"] == "running"
    assert committed.json()["prompt"] == "edited prompt"

    verified = client.post(f"{PREFIX}/forks/{branch_id}/verify")
    assert verified.status_code == 200
    assert verified.json()["exit_code"] == 0

    detail = client.get(f"{PREFIX}/branches/{branch_id}")
    assert detail.status_code == 200
    assert detail.json()["run"]["verify_exit"] == 0

    cleaned = client.post(f"{PREFIX}/forks/{branch_id}/cleanup")
    assert cleaned.status_code == 200
    assert cleaned.json()["branch"]["state"] == "cleaned"
    assert not Path(plan["worktree_path"]).exists()

    missing = client.get(f"{PREFIX}/branches/missing")
    assert missing.status_code == 404


def test_fork_api_rejects_non_user_turn(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s1", 1.0)
        ids = store.append_events(
            [
                EventRecord(
                    session_id="s1",
                    ts=1.0,
                    kind="session_start",
                    payload_json=json.dumps({}),
                )
            ]
        )
    finally:
        store.close()
    client = _client(database)
    response = client.post(
        f"{PREFIX}/forks/prepare",
        json={"session_id": "s1", "event_id": ids[0]},
    )
    assert response.status_code == 400

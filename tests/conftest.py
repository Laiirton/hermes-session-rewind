from __future__ import annotations

import json
import subprocess
from pathlib import Path

import pytest
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import WriteStore


@pytest.fixture
def database(tmp_path: Path) -> Database:
    db = Database(tmp_path / "rewind.sqlite3")
    db.migrate()
    return db


@pytest.fixture
def git_repo(tmp_path: Path) -> Path:
    repo = tmp_path / "repo"
    repo.mkdir()
    subprocess.run(["git", "-C", str(repo), "init"], check=True, capture_output=True)
    subprocess.run(
        ["git", "-C", str(repo), "config", "user.name", "Test"],
        check=True,
        capture_output=True,
    )
    subprocess.run(
        ["git", "-C", str(repo), "config", "user.email", "test@example.com"],
        check=True,
        capture_output=True,
    )
    (repo / "app.py").write_text("print('hello')\n", encoding="utf-8")
    return repo


@pytest.fixture
def seeded_database(database: Database) -> Database:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("sess_baseline", 100.0, model="model-a", provider="local")
        store.append_events(
            [
                EventRecord(
                    session_id="sess_baseline",
                    ts=100.0,
                    kind="session_start",
                    payload_json=json.dumps({"model": "model-a"}),
                ),
                EventRecord(
                    session_id="sess_baseline",
                    ts=101.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "Fix the failing pytest suite"}),
                    turn_id="turn-1",
                ),
                EventRecord(
                    session_id="sess_baseline",
                    ts=102.0,
                    kind="llm_call",
                    payload_json=json.dumps({"prompt_tokens": 10, "completion_tokens": 20}),
                    turn_id="turn-1",
                ),
                EventRecord(
                    session_id="sess_baseline",
                    ts=103.0,
                    kind="tool_call",
                    payload_json=json.dumps({"args": {"command": "pytest -q"}}),
                    name="terminal",
                    tool_call_id="call-1",
                ),
                EventRecord(
                    session_id="sess_baseline",
                    ts=104.0,
                    kind="tool_result",
                    payload_json=json.dumps({"error_message": "pytest failed"}),
                    name="terminal",
                    status="error",
                    tool_call_id="call-1",
                    duration_ms=1200.0,
                ),
                EventRecord(
                    session_id="sess_baseline",
                    ts=105.0,
                    kind="assistant_response",
                    payload_json=json.dumps({"assistant_response": "I could not fix it"}),
                    turn_id="turn-1",
                ),
                EventRecord(
                    session_id="sess_baseline",
                    ts=106.0,
                    kind="session_end",
                    payload_json=json.dumps({"failed": True}),
                ),
            ]
        )
        store.end_session("sess_baseline", 106.0, "failed")
        store.upsert_session("sess_branch", 200.0, model="model-b", provider="local")
        store.append_events(
            [
                EventRecord(
                    session_id="sess_branch",
                    ts=200.0,
                    kind="session_start",
                    payload_json=json.dumps({"model": "model-b"}),
                ),
                EventRecord(
                    session_id="sess_branch",
                    ts=201.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "Fix the failing pytest suite"}),
                    turn_id="turn-1",
                ),
                EventRecord(
                    session_id="sess_branch",
                    ts=202.0,
                    kind="llm_call",
                    payload_json=json.dumps({"prompt_tokens": 5, "completion_tokens": 5}),
                    turn_id="turn-1",
                ),
                EventRecord(
                    session_id="sess_branch",
                    ts=203.0,
                    kind="tool_result",
                    payload_json=json.dumps({"result": "pytest passed"}),
                    name="terminal",
                    status="ok",
                    tool_call_id="call-1",
                ),
                EventRecord(
                    session_id="sess_branch",
                    ts=204.0,
                    kind="session_end",
                    payload_json=json.dumps({"completed": True}),
                ),
            ]
        )
        store.end_session("sess_branch", 204.0, "completed")
    finally:
        store.close()
    return database

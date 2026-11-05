from __future__ import annotations

import json
from typing import Any

from session_rewind.fork.planner import ForkPlanner
from session_rewind.fork.service import ForkService
from session_rewind.fork.verify import VerifyRunner
from session_rewind.gitrepo.shadow import GitShadow
from session_rewind.gitrepo.worktree import WorktreeManager
from session_rewind.metrics import compare_verdict
from session_rewind.sessiondb.transcript import SessionDBTranscriptReader
from session_rewind.settings import Settings
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import ReadStore, WriteStore


class _NoTranscript:
    def row_count_before(self, stored_session_id: str, ts: float) -> int | None:
        return None


def _seed_parent(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, model="model-a")
        store.append_events(
            [
                EventRecord(
                    session_id="s_parent",
                    ts=10.0,
                    kind="llm_call",
                    payload_json=json.dumps({"prompt_tokens": 100, "completion_tokens": 10}),
                ),
                EventRecord(
                    session_id="s_parent",
                    ts=20.0,
                    kind="tool_result",
                    name="terminal",
                    status="error",
                    payload_json=json.dumps({"error_message": "boom"}),
                ),
                EventRecord(
                    session_id="s_parent",
                    ts=30.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "keep going"}),
                ),
                EventRecord(
                    session_id="s_parent",
                    ts=40.0,
                    kind="llm_call",
                    payload_json=json.dumps({"prompt_tokens": 500, "completion_tokens": 50}),
                ),
            ]
        )
        store.end_session("s_parent", 45.0, "completed")
    finally:
        store.close()


def _seed_child(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_child", 50.0, model="model-b")
        store.append_events(
            [
                EventRecord(
                    session_id="s_child",
                    ts=51.0,
                    kind="llm_call",
                    payload_json=json.dumps({"prompt_tokens": 10, "completion_tokens": 1}),
                )
            ]
        )
        store.end_session("s_child", 52.0, "completed")
    finally:
        store.close()


def _service(database: Database) -> ForkService:
    shadow = GitShadow()
    worktrees = WorktreeManager(shadow)
    planner = ForkPlanner(database, Settings(), shadow, worktrees, SessionDBTranscriptReader())
    return ForkService(database, Settings(), planner, VerifyRunner(), worktrees)


def _running_branch(database: Database, verify_exit: int) -> str:
    branch_id = "branch-verify"
    store = WriteStore(database.connect())
    try:
        store.create_branch(
            branch_id,
            "s_parent",
            30.0,
            1,
            None,
            None,
            "model-b",
            None,
            "rerun the turn",
            "python -m pytest -q",
            "running",
            50.0,
        )
        store.set_branch_child(branch_id, "s_child", "s_child", None, 50.0)
        store.set_run_verify(branch_id, verify_exit, "1 failed", 51.0)
    finally:
        store.close()
    return branch_id


def test_baseline_is_frozen_at_the_requested_cutoff(database: Database) -> None:
    _seed_parent(database)
    _seed_child(database)
    read = ReadStore(database)

    frozen = read.compare_sessions("s_parent", "s_child", left_before_ts=35.0)["left"]
    assert isinstance(frozen, dict)
    assert frozen["tokens_in"] == 100
    assert frozen["tokens_out"] == 10
    assert frozen["tool_errors"] == 1
    assert frozen["frozen_at"] == 35.0
    assert frozen["ended_at"] == 30.0

    live = read.compare_sessions("s_parent", "s_child")["left"]
    assert isinstance(live, dict)
    assert live["tokens_in"] == 600
    assert live["ended_at"] == 45.0


def test_verdict_reports_a_failed_verification_before_other_metrics() -> None:
    left: dict[str, Any] = {
        "tool_errors": 0,
        "tokens_in": 1,
        "tokens_out": 1,
        "outcome": "completed",
    }
    right: dict[str, Any] = {
        "tool_errors": 5,
        "tokens_in": 9,
        "tokens_out": 9,
        "outcome": "completed",
        "verify_exit": 2,
    }

    assert compare_verdict(left, right) == "right failed verification (exit 2)"
    assert compare_verdict(left, {**right, "verify_exit": 0}) == "left has fewer tool errors"
    assert compare_verdict(left, {**right, "verify_exit": None}) == "left has fewer tool errors"


def test_verdict_calls_a_matching_verified_rerun_a_pass() -> None:
    metrics: dict[str, Any] = {
        "tool_errors": 0,
        "tokens_in": 10,
        "tokens_out": 10,
        "outcome": "completed",
    }

    assert (
        compare_verdict(metrics, {**metrics, "verify_exit": 0})
        == "right matches the original and passes verification"
    )
    assert compare_verdict(metrics, metrics) == "no measurable difference"


def test_reconcile_marks_a_branch_failed_when_verification_fails(database: Database) -> None:
    _seed_parent(database)
    _seed_child(database)
    branch_id = _running_branch(database, verify_exit=1)

    _service(database).reconcile(branch_id)

    branch = ReadStore(database).get_branch(branch_id)
    assert branch is not None
    assert branch["state"] == "failed"


def test_reconcile_marks_a_branch_done_when_verification_passes(database: Database) -> None:
    _seed_parent(database)
    _seed_child(database)
    branch_id = _running_branch(database, verify_exit=0)

    _service(database).reconcile(branch_id)

    branch = ReadStore(database).get_branch(branch_id)
    assert branch is not None
    assert branch["state"] == "done"

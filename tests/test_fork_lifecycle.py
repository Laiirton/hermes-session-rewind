from __future__ import annotations

import json
import time
from pathlib import Path

import pytest
from session_rewind.fork.planner import ForkError, ForkPlanner, ForkRequest
from session_rewind.fork.service import ForkService
from session_rewind.fork.verify import VerifyRunner
from session_rewind.gitrepo.shadow import GitShadow
from session_rewind.gitrepo.worktree import WorktreeManager
from session_rewind.settings import Settings
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import ReadStore, WriteStore


class _NoTranscript:
    def row_count_before(self, stored_session_id: str, ts: float) -> int | None:
        return None


def _service(database: Database) -> ForkService:
    shadow = GitShadow()
    worktrees = WorktreeManager(shadow)
    planner = ForkPlanner(database, Settings(), shadow, worktrees, _NoTranscript())
    return ForkService(database, Settings(), planner, VerifyRunner(), worktrees)


def _branch(database: Database, branch_id: str, child: str, updated_at: float) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, model="model-a")
        store.create_branch(
            branch_id,
            "s_parent",
            10.0,
            1,
            None,
            None,
            None,
            None,
            "rerun the turn",
            None,
            "running",
            updated_at,
        )
        store.set_branch_child(branch_id, child, child, None, updated_at)
    finally:
        store.close()


def test_reconcile_waits_for_a_child_the_store_has_not_recorded_yet(
    database: Database,
) -> None:
    _branch(database, "branch-ghost", "s_missing", time.time())

    _service(database).reconcile("branch-ghost")

    branch = ReadStore(database).get_branch("branch-ghost")
    assert branch is not None
    assert branch["state"] == "running"


def test_reconcile_fails_a_child_that_was_never_recorded_after_the_grace(
    database: Database,
) -> None:
    _branch(database, "branch-ghost-old", "s_missing", time.time() - 4000.0)

    _service(database).reconcile("branch-ghost-old")

    branch = ReadStore(database).get_branch("branch-ghost-old")
    assert branch is not None
    assert branch["state"] == "failed"
    run = ReadStore(database).get_run("branch-ghost-old")
    assert run is not None
    assert run["outcome_summary"] == "not recorded"


def test_reconcile_fails_a_run_that_never_finished(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_child", 20.0, model="model-b")
        store.append_events(
            [
                EventRecord(
                    session_id="s_child",
                    ts=21.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "go"}),
                )
            ]
        )
    finally:
        store.close()
    _branch(database, "branch-stalled", "s_child", time.time() - 4000.0)

    _service(database).reconcile("branch-stalled")

    branch = ReadStore(database).get_branch("branch-stalled")
    assert branch is not None
    assert branch["state"] == "failed"
    run = ReadStore(database).get_run("branch-stalled")
    assert run is not None
    assert run["outcome_summary"] == "stale"


def test_reconcile_leaves_a_recent_unfinished_run_alone(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_child", 20.0, model="model-b")
    finally:
        store.close()
    _branch(database, "branch-live", "s_child", time.time())

    _service(database).reconcile("branch-live")

    branch = ReadStore(database).get_branch("branch-live")
    assert branch is not None
    assert branch["state"] == "running"


def test_snapshot_taken_after_the_turn_is_not_restored(database: Database, git_repo: Path) -> None:
    shadow = GitShadow()
    snapshot = shadow.snapshot(git_repo, "s_late", 1)
    assert snapshot is not None
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_late", 1.0, cwd=str(git_repo), model="model-a")
        ids = store.append_events(
            [
                EventRecord(
                    session_id="s_late",
                    ts=10.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "rewind me"}),
                )
            ]
        )
        store.add_snapshot(
            "s_late",
            11.0,
            str(git_repo),
            snapshot.commit_sha,
            snapshot.ref_name,
            "full",
            snapshot.file_count,
            None,
        )
    finally:
        store.close()

    worktrees = WorktreeManager(shadow)
    planner = ForkPlanner(database, Settings(), shadow, worktrees, _NoTranscript())
    plan = planner.prepare(
        ForkRequest(
            session_id="s_late",
            stored_session_id=None,
            event_id=ids[0],
            model=None,
            provider=None,
            prompt=None,
            verify_cmd=None,
        )
    )

    assert plan.fidelity == "context"
    assert plan.worktree_path is None
    assert plan.snapshot_id is None


def test_commit_refuses_a_child_that_is_the_parent_itself(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, stored_session_id="s_parent", model="model-a")
        store.create_branch(
            "branch-self",
            "s_parent",
            1.0,
            0,
            None,
            None,
            None,
            None,
            "rerun the turn",
            None,
            "prepared",
            1.0,
        )
    finally:
        store.close()

    with pytest.raises(ForkError, match="did not produce a new session"):
        _service(database).commit("branch-self", "s_parent", "s_parent", None, None, None, None)


def test_commit_refuses_a_child_already_claimed_by_another_branch(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, stored_session_id="s_parent", model="model-a")
        store.upsert_session("s_child_used", 2.0, stored_session_id="s_child_used")
        store.create_branch(
            "branch-claim-a",
            "s_parent",
            1.0,
            0,
            None,
            None,
            None,
            None,
            "rerun the turn",
            None,
            "prepared",
            1.0,
        )
        store.set_branch_child("branch-claim-a", "s_child_used", "s_child_used", None, 1.5)
        store.create_branch(
            "branch-claim-b",
            "s_parent",
            1.0,
            0,
            None,
            None,
            None,
            None,
            "rerun the turn",
            None,
            "prepared",
            2.0,
        )
    finally:
        store.close()

    with pytest.raises(ForkError, match="already the rerun of another branch") as exc_info:
        _service(database).commit(
            "branch-claim-b", "s_child_used", "s_child_used", None, None, None, None
        )
    assert exc_info.value.reason == "child_already_claimed"
    assert exc_info.value.claimed_branch_id == "branch-claim-a"


def test_verify_refuses_a_workspace_that_was_cleaned(
    database: Database, git_repo: Path, tmp_path: Path
) -> None:
    missing = tmp_path / "gone"
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, stored_session_id="s_parent", model="model-a")
        store.create_branch(
            "branch-gone",
            "s_parent",
            1.0,
            0,
            None,
            str(missing),
            None,
            None,
            "rerun the turn",
            "python -m pytest -q",
            "done",
            1.0,
        )
    finally:
        store.close()

    with pytest.raises(ForkError, match="workspace of this branch was cleaned"):
        _service(database).verify("branch-gone")

    run = ReadStore(database).get_run("branch-gone")
    assert run is None

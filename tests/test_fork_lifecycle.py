from __future__ import annotations

import json
import time
from pathlib import Path

from session_rewind.fork.planner import ForkPlanner, ForkRequest
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

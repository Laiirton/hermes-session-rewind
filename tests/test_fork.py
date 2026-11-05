from __future__ import annotations

import json
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


class FakeTranscript:
    def row_count_before(self, stored_session_id: str, ts: float) -> int | None:
        return 5


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
                    turn_id="turn-1",
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


def _planner(database: Database) -> tuple[GitShadow, WorktreeManager, ForkPlanner]:
    shadow = GitShadow()
    worktrees = WorktreeManager(shadow)
    planner = ForkPlanner(database, Settings(), shadow, worktrees, FakeTranscript())
    return shadow, worktrees, planner


def test_planner_prepares_worktree(database: Database, git_repo: Path) -> None:
    event_id = _seed(database, git_repo)
    _, worktrees, planner = _planner(database)
    plan = planner.prepare(
        ForkRequest(
            session_id="s1",
            stored_session_id="stored-1",
            event_id=event_id,
            model="model-b",
            provider="local",
            prompt=None,
            verify_cmd='python -c "print(1)"',
        )
    )
    assert plan.fork_row_count == 5
    assert plan.context_rows == 5
    assert plan.fidelity == "full"
    assert plan.worktree_path is not None
    assert Path(plan.worktree_path).exists()
    assert "Fix the failing test" in plan.prompt
    branch = ReadStore(database).get_branch(plan.branch_id)
    assert branch is not None
    assert branch["state"] == "prepared"
    assert branch["model"] == "model-b"
    worktrees.remove(git_repo, Path(plan.worktree_path))


def test_planner_rejects_non_user_turn(database: Database) -> None:
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
    _, _, planner = _planner(database)
    with pytest.raises(ForkError):
        planner.prepare(
            ForkRequest(
                session_id="s1",
                stored_session_id=None,
                event_id=ids[0],
                model=None,
                provider=None,
                prompt=None,
                verify_cmd=None,
            )
        )


def test_planner_refuses_an_event_from_another_session(database: Database, git_repo: Path) -> None:
    event_id = _seed(database, git_repo)
    _, _, planner = _planner(database)
    with pytest.raises(ForkError, match="different session"):
        planner.prepare(
            ForkRequest(
                session_id="s_other",
                stored_session_id=None,
                event_id=event_id,
                model=None,
                provider=None,
                prompt=None,
                verify_cmd=None,
            )
        )
    assert ReadStore(database).list_branches("s1") == []


def test_service_commit_verify_cleanup(database: Database, git_repo: Path) -> None:
    event_id = _seed(database, git_repo)
    _, worktrees, planner = _planner(database)
    service = ForkService(database, Settings(), planner, VerifyRunner(), worktrees)
    plan = service.prepare(
        ForkRequest(
            session_id="s1",
            stored_session_id="stored-1",
            event_id=event_id,
            model="model-b",
            provider="local",
            prompt=None,
            verify_cmd='python -c "print(1)"',
        )
    )
    assert plan.worktree_path is not None
    service.commit(
        plan.branch_id,
        "child-1",
        "stored-child-1",
        "model-b",
        "local",
        "edited prompt",
    )
    detail = service.detail(plan.branch_id)
    assert detail is not None
    assert detail[0]["state"] == "running"
    assert detail[0]["child_session_id"] == "child-1"
    assert detail[0]["prompt"] == "edited prompt"

    result = service.verify(plan.branch_id)
    assert result.exit_code == 0
    assert "1" in result.output
    run = ReadStore(database).get_run(plan.branch_id)
    assert run is not None
    assert run["verify_exit"] == 0

    service.cleanup(plan.branch_id)
    assert not Path(plan.worktree_path).exists()
    branch = ReadStore(database).get_branch(plan.branch_id)
    assert branch is not None
    assert branch["state"] == "cleaned"


def test_planner_without_snapshot_uses_context(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s1", 1.0)
        ids = store.append_events(
            [
                EventRecord(
                    session_id="s1",
                    ts=1.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "First task"}),
                ),
                EventRecord(
                    session_id="s1",
                    ts=2.0,
                    kind="tool_call",
                    payload_json=json.dumps({"args": {"file_path": "app.py"}}),
                    name="patch",
                ),
                EventRecord(
                    session_id="s1",
                    ts=3.0,
                    kind="tool_result",
                    payload_json=json.dumps({"error_message": "boom"}),
                    status="error",
                ),
                EventRecord(
                    session_id="s1",
                    ts=4.0,
                    kind="assistant_response",
                    payload_json=json.dumps({"assistant_response": "I tried"}),
                ),
                EventRecord(
                    session_id="s1",
                    ts=5.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "Second task"}),
                ),
            ]
        )
    finally:
        store.close()
    _, _, planner = _planner(database)
    plan = planner.prepare(
        ForkRequest(
            session_id="s1",
            stored_session_id="stored-1",
            event_id=ids[4],
            model=None,
            provider=None,
            prompt=None,
            verify_cmd=None,
        )
    )
    assert plan.worktree_path is None
    assert plan.fidelity == "context"
    assert plan.snapshot_id is None
    assert "could not be restored" in plan.prompt
    assert "Second task" in plan.prompt
    assert "I tried" in plan.prompt
    assert "boom" in plan.prompt
    assert "app.py" in plan.prompt


def test_service_rejects_invalid_branch(database: Database) -> None:
    shadow = GitShadow()
    worktrees = WorktreeManager(shadow)
    planner = ForkPlanner(database, Settings(), shadow, worktrees, FakeTranscript())
    service = ForkService(database, Settings(), planner, VerifyRunner(), worktrees)
    with pytest.raises(ForkError):
        service.verify("missing")
    with pytest.raises(ForkError):
        service.cleanup("missing")
    assert service.detail("missing") is None


def test_service_verify_requires_command(database: Database, git_repo: Path) -> None:
    event_id = _seed(database, git_repo)
    _, worktrees, planner = _planner(database)
    service = ForkService(database, Settings(), planner, VerifyRunner(), worktrees)
    plan = service.prepare(
        ForkRequest(
            session_id="s1",
            stored_session_id="stored-1",
            event_id=event_id,
            model=None,
            provider=None,
            prompt=None,
            verify_cmd=None,
        )
    )
    service.commit(plan.branch_id, "child-1", None, None, None, None)
    with pytest.raises(ForkError):
        service.verify(plan.branch_id)
    service.cleanup(plan.branch_id)


def test_service_reconcile_completed_child(database: Database, git_repo: Path) -> None:
    event_id = _seed(database, git_repo)
    _, worktrees, planner = _planner(database)
    service = ForkService(database, Settings(), planner, VerifyRunner(), worktrees)
    plan = service.prepare(
        ForkRequest(
            session_id="s1",
            stored_session_id="stored-1",
            event_id=event_id,
            model=None,
            provider=None,
            prompt=None,
            verify_cmd=None,
        )
    )
    assert plan.worktree_path is not None
    service.commit(plan.branch_id, "child-1", "stored-child-1", None, None, None)
    store = WriteStore(database.connect())
    try:
        store.upsert_session("child-1", 20.0, model="model-b")
        store.append_events(
            [
                EventRecord(
                    session_id="child-1",
                    ts=20.0,
                    kind="llm_call",
                    payload_json=json.dumps({"prompt_tokens": 4, "completion_tokens": 6}),
                ),
                EventRecord(
                    session_id="child-1",
                    ts=21.0,
                    kind="session_end",
                    payload_json=json.dumps({"completed": True}),
                ),
            ]
        )
        store.end_session("child-1", 21.0, "completed")
    finally:
        store.close()
    service.reconcile(plan.branch_id)
    branch = ReadStore(database).get_branch(plan.branch_id)
    assert branch is not None
    assert branch["state"] == "done"
    run = ReadStore(database).get_run(plan.branch_id)
    assert run is not None
    assert run["tokens_in"] == 4
    assert run["tokens_out"] == 6
    service.cleanup(plan.branch_id)

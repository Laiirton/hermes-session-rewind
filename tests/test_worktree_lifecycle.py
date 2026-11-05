from __future__ import annotations

import sys
import time
from pathlib import Path

import pytest
from session_rewind.fork.planner import ForkError, ForkPlanner
from session_rewind.fork.service import ForkService
from session_rewind.fork.verify import VerifyRunner, resolve_argv, resolved_command
from session_rewind.gitrepo.shadow import GitShadow
from session_rewind.gitrepo.worktree import WorktreeManager
from session_rewind.settings import Settings
from session_rewind.store.db import Database
from session_rewind.store.repositories import ReadStore, WriteStore


class _NoTranscript:
    def row_count_before(self, stored_session_id: str, ts: float) -> int | None:
        return None


def _service(database: Database, worktrees: WorktreeManager) -> ForkService:
    shadow = GitShadow()
    planner = ForkPlanner(database, Settings(), shadow, worktrees, _NoTranscript())
    return ForkService(database, Settings(), planner, VerifyRunner(), worktrees)


def _prepared_branch(
    database: Database,
    git_repo: Path,
    branch_id: str,
    created_at: float,
) -> Path:
    shadow = GitShadow()
    snapshot = shadow.snapshot(git_repo, "s_parent", 1)
    assert snapshot is not None
    worktrees = WorktreeManager(shadow)
    target = worktrees.create(git_repo, snapshot.commit_sha, branch_id)
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, cwd=str(git_repo), model="model-a")
        store.create_branch(
            branch_id,
            "s_parent",
            1.0,
            0,
            None,
            str(target),
            None,
            None,
            "rerun the turn",
            None,
            "prepared",
            created_at,
        )
    finally:
        store.close()
    return target


def test_workspace_venv_interpreter_wins_over_the_gateway_path(tmp_path: Path) -> None:
    interpreter = tmp_path / ".venv" / "Scripts" / "python.exe"
    interpreter.parent.mkdir(parents=True)
    interpreter.write_text("", encoding="utf-8")

    argv = resolve_argv("python -m pytest -q", tmp_path)

    assert argv[0] == str(interpreter)
    assert resolved_command("python -m pytest -q", tmp_path) == str(interpreter) + " -m pytest -q"


def test_posix_venv_layout_is_found(tmp_path: Path) -> None:
    interpreter = tmp_path / ".venv" / "bin" / "python"
    interpreter.parent.mkdir(parents=True)
    interpreter.write_text("", encoding="utf-8")

    assert resolve_argv("python3 -m pytest -q", tmp_path)[0] == str(interpreter)


def test_non_python_programs_still_resolve_from_path(tmp_path: Path) -> None:
    venv = tmp_path / ".venv" / "bin"
    venv.mkdir(parents=True)
    (tmp_path / ".venv" / "python").write_text("", encoding="utf-8")

    assert resolve_argv("npm test", tmp_path)[0] != str(venv / "python")
    assert Path(resolve_argv(sys.executable + " --version", tmp_path)[0]).name.startswith("python")


def test_cleanup_removes_a_worktree_even_without_a_snapshot_row(
    database: Database, git_repo: Path
) -> None:
    target = _prepared_branch(database, git_repo, "branch-no-snapshot", 1.0)
    worktrees = WorktreeManager(GitShadow())
    service = ForkService(
        database,
        Settings(),
        ForkPlanner(database, Settings(), GitShadow(), worktrees, _NoTranscript()),
        VerifyRunner(),
        worktrees,
    )

    service.cleanup("branch-no-snapshot")

    assert not target.exists()
    branch = ReadStore(database).get_branch("branch-no-snapshot")
    assert branch is not None
    assert branch["state"] == "cleaned"


def test_cleanup_refuses_while_the_rerun_still_uses_the_workspace(
    database: Database, git_repo: Path
) -> None:
    target = _prepared_branch(database, git_repo, "branch-live-wt", 1.0)
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_child_live", 2.0, model="model-b")
        store.set_branch_child("branch-live-wt", "s_child_live", "s_child_live", str(target), 2.0)
    finally:
        store.close()
    service = _service(database, WorktreeManager(GitShadow()))

    with pytest.raises(ForkError, match="still using this workspace"):
        service.cleanup("branch-live-wt")

    assert target.exists()
    branch = ReadStore(database).get_branch("branch-live-wt")
    assert branch is not None
    assert branch["state"] == "running"


def test_cleanup_proceeds_once_the_rerun_has_ended(database: Database, git_repo: Path) -> None:
    target = _prepared_branch(database, git_repo, "branch-ended-wt", 1.0)
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_child_done", 2.0, model="model-b")
        store.end_session("s_child_done", 30.0, "completed")
        store.set_branch_child("branch-ended-wt", "s_child_done", "s_child_done", str(target), 2.0)
    finally:
        store.close()
    service = _service(database, WorktreeManager(GitShadow()))

    service.cleanup("branch-ended-wt")

    assert not target.exists()
    branch = ReadStore(database).get_branch("branch-ended-wt")
    assert branch is not None
    assert branch["state"] == "cleaned"


def test_sweep_discards_abandoned_prepared_branches(database: Database, git_repo: Path) -> None:
    target = _prepared_branch(database, git_repo, "branch-abandoned", 1.0)
    worktrees = WorktreeManager(GitShadow())
    service = _service(database, worktrees)

    assert service.sweep("s_parent") == 1

    assert not target.exists()
    branch = ReadStore(database).get_branch("branch-abandoned")
    assert branch is not None
    assert branch["state"] == "discarded"


def test_sweep_keeps_a_recently_prepared_branch(database: Database, git_repo: Path) -> None:
    target = _prepared_branch(database, git_repo, "branch-fresh", time.time())
    service = _service(database, WorktreeManager(GitShadow()))

    assert service.sweep("s_parent") == 0

    assert target.exists()
    branch = ReadStore(database).get_branch("branch-fresh")
    assert branch is not None
    assert branch["state"] == "prepared"


def test_resolve_verify_falls_back_to_the_repository_without_a_workspace(
    database: Database, git_repo: Path
) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s_parent", 1.0, cwd=str(git_repo), model="model-a")
        store.create_branch(
            "branch-no-worktree",
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
    tool = git_repo / "bin" / "check"
    tool.parent.mkdir(parents=True)
    tool.write_text("", encoding="utf-8")
    service = _service(database, WorktreeManager(GitShadow()))

    assert (
        service.resolve_verify("branch-no-worktree", "bin/check --quiet") == str(tool) + " --quiet"
    )
    assert service.resolve_verify("branch-no-worktree", "python -m pytest -q") is not None


def test_resolve_verify_rejects_an_unknown_branch(database: Database) -> None:
    service = _service(database, WorktreeManager(GitShadow()))

    with pytest.raises(ForkError, match="branch not found"):
        service.resolve_verify("branch-ghost", "pytest")

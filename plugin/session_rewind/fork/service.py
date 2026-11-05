from __future__ import annotations

import time
from pathlib import Path
from typing import Any

from ..gitrepo.shadow import GitError
from ..gitrepo.worktree import WorktreeManager
from ..settings import Settings
from ..store.db import Database
from ..store.repositories import ReadStore, WriteStore
from .planner import ForkError, ForkPlan, ForkPlanner, ForkRequest
from .verify import VerifyResult, VerifyRunner

PREPARED_TTL_SECONDS = 900.0


class ForkService:
    def __init__(
        self,
        database: Database,
        settings: Settings,
        planner: ForkPlanner,
        verifier: VerifyRunner,
        worktrees: WorktreeManager,
    ) -> None:
        self._database = database
        self._settings = settings
        self._planner = planner
        self._verifier = verifier
        self._worktrees = worktrees

    def prepare(self, request: ForkRequest) -> ForkPlan:
        self.sweep(request.session_id)
        return self._planner.prepare(request)

    def sweep(self, parent_session_id: str) -> int:
        abandoned = ReadStore(self._database).list_abandoned_prepared(
            parent_session_id,
            time.time() - PREPARED_TTL_SECONDS,
        )
        discarded = 0
        store = WriteStore(self._database.connect())
        try:
            for branch in abandoned:
                worktree = branch.get("worktree_path")
                if isinstance(worktree, str) and worktree and Path(worktree).exists():
                    try:
                        self._remove_worktree(branch)
                    except ForkError:
                        continue
                store.set_branch_state(str(branch["id"]), "discarded", time.time())
                discarded += 1
        finally:
            store.close()
        return discarded

    def commit(
        self,
        branch_id: str,
        child_session_id: str,
        child_stored_session_id: str | None,
        model: str | None,
        provider: str | None,
        prompt: str | None,
        verify_cmd: str | None = None,
    ) -> None:
        branch = ReadStore(self._database).get_branch(branch_id)
        if branch is None:
            raise ForkError("branch not found")
        now = time.time()
        store = WriteStore(self._database.connect())
        try:
            store.update_branch_launch(
                branch_id,
                model=model,
                provider=provider,
                prompt=prompt,
                verify_cmd=verify_cmd,
                updated_at=now,
            )
            store.set_branch_child(
                branch_id,
                child_session_id,
                child_stored_session_id,
                _text_or_none(branch.get("worktree_path")),
                now,
            )
        finally:
            store.close()

    def verify(self, branch_id: str) -> VerifyResult:
        branch = ReadStore(self._database).get_branch(branch_id)
        if branch is None:
            raise ForkError("branch not found")
        worktree = branch.get("worktree_path")
        command = branch.get("verify_cmd")
        if not isinstance(worktree, str) or not worktree:
            raise ForkError("branch has no restored workspace")
        if not isinstance(command, str) or not command:
            raise ForkError("branch has no verify command")
        result = self._verifier.run(
            command,
            Path(worktree),
            self._settings.verify_timeout_seconds,
        )
        store = WriteStore(self._database.connect())
        try:
            store.set_run_verify(branch_id, result.exit_code, result.output, time.time())
        finally:
            store.close()
        return result

    def reconcile(self, branch_id: str) -> None:
        branch = ReadStore(self._database).get_branch(branch_id)
        if branch is None:
            return
        if branch.get("state") in ("cleaned", "done", "failed"):
            return
        child = branch.get("child_session_id")
        if not isinstance(child, str) or not child:
            return
        metrics = ReadStore(self._database).session_metrics(child)
        if metrics is None or metrics.get("ended_at") is None:
            return
        outcome = metrics.get("outcome")
        run = ReadStore(self._database).get_run(branch_id)
        verify_exit = run.get("verify_exit") if run is not None else None
        passed = outcome == "completed" and (not isinstance(verify_exit, int) or verify_exit == 0)
        state = "done" if passed else "failed"
        now = time.time()
        store = WriteStore(self._database.connect())
        try:
            store.upsert_run(
                branch_id,
                now,
                tokens_in=int(metrics.get("tokens_in", 0)),
                tokens_out=int(metrics.get("tokens_out", 0)),
                cost_usd=float(metrics.get("cost_usd", 0.0)),
                tool_calls=int(metrics.get("tool_calls", 0)),
                tool_errors=int(metrics.get("tool_errors", 0)),
                duration_ms=float(metrics.get("duration_ms", 0.0)),
                outcome_summary=str(outcome) if outcome is not None else None,
            )
            store.set_branch_state(branch_id, state, now)
        finally:
            store.close()

    def cleanup(self, branch_id: str) -> None:
        branch = ReadStore(self._database).get_branch(branch_id)
        if branch is None:
            raise ForkError("branch not found")
        self._remove_worktree(branch)
        store = WriteStore(self._database.connect())
        try:
            store.set_branch_state(branch_id, "cleaned", time.time())
        finally:
            store.close()

    def _remove_worktree(self, branch: dict[str, Any]) -> None:
        worktree = branch.get("worktree_path")
        if not isinstance(worktree, str) or not worktree:
            return
        root = self._repo_root(branch)
        if root is None:
            return
        try:
            self._worktrees.remove(root, Path(worktree))
        except GitError as exc:
            raise ForkError(f"could not remove the workspace: {exc}") from exc

    def _repo_root(self, branch: dict[str, Any]) -> Path | None:
        read = ReadStore(self._database)
        snapshot_id = branch.get("snapshot_id")
        if isinstance(snapshot_id, int):
            snapshot = read.get_snapshot(snapshot_id)
            if snapshot is not None:
                return Path(str(snapshot["repo_root"]))
        parent = read.get_session(str(branch.get("parent_session_id", "")))
        cwd = parent.get("cwd") if parent is not None else None
        return Path(str(cwd)) if isinstance(cwd, str) and cwd else None

    def detail(self, branch_id: str) -> tuple[dict[str, Any], dict[str, Any] | None] | None:
        read = ReadStore(self._database)
        branch = read.get_branch(branch_id)
        if branch is None:
            return None
        return branch, read.get_run(branch_id)


def _text_or_none(value: Any) -> str | None:
    return value if isinstance(value, str) and value else None

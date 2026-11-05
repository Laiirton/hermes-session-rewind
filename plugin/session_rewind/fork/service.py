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
        return self._planner.prepare(request)

    def commit(
        self,
        branch_id: str,
        child_session_id: str,
        child_stored_session_id: str | None,
        model: str | None,
        provider: str | None,
        prompt: str | None,
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
        state = "done" if outcome == "completed" else "failed"
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
        worktree = branch.get("worktree_path")
        snapshot_id = branch.get("snapshot_id")
        if isinstance(worktree, str) and worktree and isinstance(snapshot_id, int):
            snapshot = ReadStore(self._database).get_snapshot(snapshot_id)
            if snapshot is not None:
                try:
                    self._worktrees.remove(Path(snapshot["repo_root"]), Path(worktree))
                except GitError as exc:
                    raise ForkError(f"could not remove the workspace: {exc}") from exc
        store = WriteStore(self._database.connect())
        try:
            store.set_branch_state(branch_id, "cleaned", time.time())
        finally:
            store.close()

    def detail(self, branch_id: str) -> tuple[dict[str, Any], dict[str, Any] | None] | None:
        read = ReadStore(self._database)
        branch = read.get_branch(branch_id)
        if branch is None:
            return None
        return branch, read.get_run(branch_id)


def _text_or_none(value: Any) -> str | None:
    return value if isinstance(value, str) and value else None

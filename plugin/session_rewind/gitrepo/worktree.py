from __future__ import annotations

import re
import shutil
from pathlib import Path

from .shadow import GitError, GitShadow

SAFE_NAME = re.compile(r"[^A-Za-z0-9._-]+")


class WorktreeManager:
    def __init__(self, shadow: GitShadow) -> None:
        self._shadow = shadow

    def create(self, repo_root: Path, commit_sha: str, name: str) -> Path:
        root = self._shadow.repo_root(repo_root)
        if root is None:
            raise GitError("not a git repository")
        base = root.parent / ".hermes-rewind"
        base.mkdir(parents=True, exist_ok=True)
        target = base / _safe_name(name)
        if target.exists():
            raise GitError("worktree target already exists")
        result = self._shadow.run(
            root,
            ["worktree", "add", "--detach", str(target), commit_sha],
            timeout=30.0,
        )
        if result.returncode != 0:
            shutil.rmtree(target, ignore_errors=True)
            raise GitError(result.stderr.strip() or "git worktree add failed")
        return target

    def uncommitted(self, target: Path) -> int | None:
        try:
            result = self._shadow.run(
                target,
                ["status", "--porcelain", "--untracked-files=all"],
                timeout=15.0,
            )
        except GitError:
            return None
        if result.returncode != 0:
            return None
        return len([line for line in result.stdout.splitlines() if line.strip()])

    def remove(self, repo_root: Path, target: Path) -> None:
        root = self._shadow.repo_root(repo_root)
        if root is None:
            raise GitError("not a git repository")
        result = self._shadow.run(
            root,
            ["worktree", "remove", "--force", str(target)],
            timeout=30.0,
        )
        if result.returncode != 0 and target.exists():
            shutil.rmtree(target, ignore_errors=True)
        self._shadow.run(root, ["worktree", "prune"], timeout=10.0)


def _safe_name(value: str) -> str:
    cleaned = SAFE_NAME.sub("_", value).strip("._")
    return (cleaned or "branch")[:32]

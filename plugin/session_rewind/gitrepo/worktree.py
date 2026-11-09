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

    def orphan_commits(self, target: Path) -> int | None:
        """Count commits reachable only from this worktree's HEAD.

        ``git status`` is clean for a worktree where the rerun committed its
        work — the commit then lives on a detached HEAD that no branch or ref
        points at, and ``git worktree remove --force`` would make it
        unreachable. Those commits are exactly what cleanup would lose, so the
        probe reports their count alongside the dirty-file count.

        Everything the repo's branch, tag, remote, and shadow-ref namespaces
        — plus the HEAD of every linked worktree other than this one — is
        excluded. What remains is precisely the commits a rerun made inside
        this worktree since its checkout. A timeout or an unreadable
        answer returns None: a slow or broken probe must not mistake
        itself for a safe one.
        """
        try:
            head = self._shadow.run(target, ["rev-parse", "HEAD"], timeout=5.0)
            if head.returncode != 0:
                return None
            start = head.stdout.strip()
            if not start:
                return None
            exclusions: list[str] = []
            refs = self._shadow.run(
                target,
                [
                    "for-each-ref",
                    "--format=%(objectname)",
                    "refs/heads",
                    "refs/tags",
                    "refs/remotes",
                    "refs/hermes-rewind",
                ],
                timeout=5.0,
            )
            if refs.returncode != 0:
                return None
            exclusions.extend(
                line.strip() for line in refs.stdout.splitlines() if line.strip()
            )
            listing = self._shadow.run(
                target, ["worktree", "list", "--porcelain"], timeout=5.0
            )
            if listing.returncode != 0:
                return None
            for line in listing.stdout.splitlines():
                if line.startswith("HEAD "):
                    value = line[5:].strip()
                    if value and value != start and set(value) != {"0"}:
                        exclusions.append(value)
            args = ["rev-list", start, "--not", *exclusions] if exclusions else ["rev-list", start]
            result = self._shadow.run(target, args, timeout=5.0)
        except GitError:
            return None
        if result.returncode != 0:
            return None
        return len([line for line in result.stdout.splitlines() if line.strip()])

    def diff_stat(self, target: Path) -> str:
        try:
            result = self._shadow.run(target, ["diff", "--stat", "HEAD"], timeout=10.0)
        except GitError:
            return ""
        return result.stdout.strip() if result.returncode == 0 else ""

    def diff_entries(self, target: Path) -> list[dict[str, object]]:
        entries: list[dict[str, object]] = []
        try:
            result = self._shadow.run(target, ["diff", "--numstat", "HEAD"], timeout=10.0)
        except GitError:
            return entries
        if result.returncode != 0:
            return entries
        for line in result.stdout.splitlines():
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            added, deleted, path = parts
            entries.append(
                {
                    "path": path,
                    "status": "M",
                    "additions": int(added) if added.isdigit() else 0,
                    "deletions": int(deleted) if deleted.isdigit() else 0,
                }
            )
        return entries

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

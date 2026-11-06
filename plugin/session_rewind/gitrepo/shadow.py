from __future__ import annotations

import os
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

from ..logging import get_logger

LOGGER = get_logger("git")
MAX_TRACKED_FILES = 50000
MAX_SNAPSHOT_SECONDS = 8.0
SAFE_REF = re.compile(r"[^A-Za-z0-9._-]+")


class GitError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class ShadowSnapshot:
    repo_root: Path
    commit_sha: str
    tree_sha: str
    ref_name: str
    fidelity: str
    file_count: int


class GitShadow:
    def __init__(self, git_executable: str = "git") -> None:
        self._git = git_executable

    def is_repo(self, path: Path) -> bool:
        return self.repo_root(path) is not None

    def repo_root(self, path: Path) -> Path | None:
        try:
            result = self.run(path, ["rev-parse", "--show-toplevel"], timeout=5.0)
        except GitError:
            return None
        if result.returncode != 0:
            return None
        value = result.stdout.strip()
        return Path(value) if value else None

    def snapshot(
        self,
        repo_root: Path,
        session_id: str,
        sequence: int,
    ) -> ShadowSnapshot | None:
        root = self.repo_root(repo_root)
        if root is None:
            return None
        temp_dir = Path(tempfile.mkdtemp(prefix="hermes-rewind-index-"))
        index_path = temp_dir / "index"
        env = os.environ.copy()
        env["GIT_INDEX_FILE"] = str(index_path)
        env["GIT_WORK_TREE"] = str(root)
        env["GIT_AUTHOR_NAME"] = "Hermes Rewind"
        env["GIT_AUTHOR_EMAIL"] = "rewind@localhost"
        env["GIT_COMMITTER_NAME"] = "Hermes Rewind"
        env["GIT_COMMITTER_EMAIL"] = "rewind@localhost"
        try:
            added = self.run(root, ["add", "-A"], env=env, timeout=MAX_SNAPSHOT_SECONDS)
            if added.returncode != 0:
                raise GitError(added.stderr.strip() or "git add failed")
            tree = self.run(root, ["write-tree"], env=env, timeout=MAX_SNAPSHOT_SECONDS)
            if tree.returncode != 0:
                raise GitError(tree.stderr.strip() or "git write-tree failed")
            tree_sha = tree.stdout.strip()
            if not tree_sha:
                raise GitError("empty tree")
            files = self.run(
                root,
                ["ls-tree", "-r", "--name-only", tree_sha],
                timeout=MAX_SNAPSHOT_SECONDS,
            )
            if files.returncode != 0:
                raise GitError(files.stderr.strip() or "git ls-tree failed")
            file_count = len([line for line in files.stdout.splitlines() if line])
            if file_count > MAX_TRACKED_FILES:
                raise GitError("repository has too many tracked files")
            parent = self.run(root, ["rev-parse", "--verify", "HEAD"], timeout=5.0)
            args = [
                "-c",
                "user.name=Hermes Rewind",
                "-c",
                "user.email=rewind@localhost",
                "commit-tree",
                tree_sha,
                "-m",
                "session-rewind snapshot",
            ]
            if parent.returncode == 0 and parent.stdout.strip():
                args.extend(["-p", parent.stdout.strip()])
            commit = self.run(root, args, timeout=MAX_SNAPSHOT_SECONDS)
            if commit.returncode != 0:
                raise GitError(commit.stderr.strip() or "git commit-tree failed")
            commit_sha = commit.stdout.strip()
            if not commit_sha:
                raise GitError("empty commit")
            ref_name = f"refs/hermes-rewind/{_safe_ref(session_id)}/{sequence}"
            update = self.run(root, ["update-ref", ref_name, commit_sha], timeout=5.0)
            if update.returncode != 0:
                raise GitError(update.stderr.strip() or "git update-ref failed")
            return ShadowSnapshot(
                repo_root=root,
                commit_sha=commit_sha,
                tree_sha=tree_sha,
                ref_name=ref_name,
                fidelity="full",
                file_count=file_count,
            )
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

    def drop_ref(self, repo_root: Path, ref_name: str) -> None:
        result = self.run(repo_root, ["update-ref", "-d", ref_name], timeout=5.0)
        if result.returncode != 0:
            raise GitError(result.stderr.strip() or "git update-ref -d failed")

    def run(
        self,
        cwd: Path,
        args: list[str],
        *,
        env: dict[str, str] | None = None,
        timeout: float = 10.0,
    ) -> subprocess.CompletedProcess[str]:
        try:
            return subprocess.run(
                [self._git, "-C", str(cwd), *args],
                capture_output=True,
                text=True,
                errors="replace",
                timeout=timeout,
                check=False,
                env=env,
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise GitError(str(exc)) from exc


def _safe_ref(value: str) -> str:
    cleaned = SAFE_REF.sub("_", value).strip("._")
    return (cleaned or "session")[:80]

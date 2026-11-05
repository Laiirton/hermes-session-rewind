from __future__ import annotations

import subprocess
from pathlib import Path

import pytest
from session_rewind.fork.verify import VerifyRunner
from session_rewind.gitrepo.diff import diff_patch, diff_summary
from session_rewind.gitrepo.shadow import GitError, GitShadow
from session_rewind.gitrepo.worktree import WorktreeManager


def _git(repo: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(repo), *args],
        capture_output=True,
        text=True,
        check=False,
    )


@pytest.fixture
def repo(tmp_path: Path) -> Path:
    path = tmp_path / "repo"
    path.mkdir()
    assert _git(path, "init").returncode == 0
    assert _git(path, "config", "user.name", "Test").returncode == 0
    assert _git(path, "config", "user.email", "test@example.com").returncode == 0
    (path / "app.py").write_text("print('hello')\n", encoding="utf-8")
    return path


def test_snapshot_does_not_touch_index_or_worktree(repo: Path) -> None:
    shadow = GitShadow()
    first = shadow.snapshot(repo, "sess/1", 1)
    assert first is not None
    assert len(first.commit_sha) == 40
    assert first.file_count == 1
    assert "app.py" in _git(repo, "status", "--porcelain").stdout

    (repo / "app.py").write_text("print('bye')\n", encoding="utf-8")
    second = shadow.snapshot(repo, "sess/1", 2)
    assert second is not None
    assert second.commit_sha != first.commit_sha

    ref = _git(repo, "rev-parse", "--verify", "refs/hermes-rewind/sess_1/1")
    assert ref.returncode == 0
    assert ref.stdout.strip() == first.commit_sha


def test_snapshot_outside_repository_returns_none(tmp_path: Path) -> None:
    shadow = GitShadow()
    assert shadow.repo_root(tmp_path / "missing") is None
    assert shadow.snapshot(tmp_path / "missing", "sess", 1) is None


def test_worktree_round_trip(repo: Path) -> None:
    shadow = GitShadow()
    snapshot = shadow.snapshot(repo, "sess_1", 1)
    assert snapshot is not None
    manager = WorktreeManager(shadow)
    target = manager.create(repo, snapshot.commit_sha, "branch-1")
    assert (target / "app.py").read_text(encoding="utf-8") == "print('hello')\n"
    (target / "app.py").write_text("print('changed')\n", encoding="utf-8")
    manager.remove(repo, target)
    assert not target.exists()
    assert (repo / "app.py").read_text(encoding="utf-8") == "print('hello')\n"


def test_diff_summary(repo: Path) -> None:
    shadow = GitShadow()
    first = shadow.snapshot(repo, "sess_1", 1)
    assert first is not None
    (repo / "app.py").write_text("print('hello')\nprint('world')\n", encoding="utf-8")
    second = shadow.snapshot(repo, "sess_1", 2)
    assert second is not None
    summary = diff_summary(shadow, repo, first.tree_sha, second.tree_sha)
    assert summary["files"] == 1
    assert summary["additions"] == 1
    patch = diff_patch(shadow, repo, first.tree_sha, second.tree_sha)
    assert "print('world')" in patch


def test_worktree_duplicate_target(repo: Path) -> None:
    shadow = GitShadow()
    snapshot = shadow.snapshot(repo, "sess_1", 1)
    assert snapshot is not None
    manager = WorktreeManager(shadow)
    target = manager.create(repo, snapshot.commit_sha, "duplicate")
    with pytest.raises(GitError):
        manager.create(repo, snapshot.commit_sha, "duplicate")
    manager.remove(repo, target)


def test_verify_runner(tmp_path: Path) -> None:
    runner = VerifyRunner()
    ok = runner.run('python -c "print(1)"', tmp_path, 10)
    assert ok.exit_code == 0
    assert "1" in ok.output
    failed = runner.run('python -c "import sys; sys.exit(3)"', tmp_path, 10)
    assert failed.exit_code == 3
    empty = runner.run("   ", tmp_path, 10)
    assert empty.exit_code is None
    missing = runner.run("python --version", tmp_path / "missing", 10)
    assert missing.exit_code is None
    invalid = runner.run('python "unclosed', tmp_path, 10)
    assert invalid.exit_code is None
    unavailable = runner.run("command-that-does-not-exist-rewind", tmp_path, 10)
    assert unavailable.exit_code is None
    timed = runner.run('python -c "import time; time.sleep(2)"', tmp_path, 0.1)
    assert timed.timed_out is True


def test_verify_runner_drops_coverage_environment(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("COVERAGE_PROCESS_START", "coverage.rc")
    monkeypatch.setenv("COV_CORE_SOURCE", "session_rewind")
    runner = VerifyRunner()
    result = runner.run(
        "python -c \"import os; print(os.environ.get('COVERAGE_PROCESS_START'), "
        "os.environ.get('COV_CORE_SOURCE'))\"",
        tmp_path,
        10,
    )
    assert result.exit_code == 0
    assert result.output.strip() == "None None"

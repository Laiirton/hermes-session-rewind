from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from session_rewind.dashboard.api import create_router
from session_rewind.fork.verify import VerifyRunner, resolve_argv, resolved_command, split_command
from session_rewind.store.db import Database

PREFIX = "/api/plugins/session-rewind"


def test_windows_splitting_keeps_backslash_paths(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(sys, "platform", "win32")

    assert split_command(r"python C:\Users\me\proj\verify.py -q") == [
        "python",
        r"C:\Users\me\proj\verify.py",
        "-q",
    ]
    assert split_command('python -c "import sys; sys.exit(2)"') == [
        "python",
        "-c",
        "import sys; sys.exit(2)",
    ]


def test_batch_shims_run_through_the_shell(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(sys, "platform", "win32")
    monkeypatch.setitem(os.environ, "COMSPEC", "C:\\Windows\\System32\\cmd.exe")
    monkeypatch.setattr(shutil, "which", lambda _: "C:\\tools\\pytest.CMD")

    assert resolve_argv("pytest -q") == [
        "C:\\Windows\\System32\\cmd.exe",
        "/c",
        "C:\\tools\\pytest.CMD",
        "-q",
    ]


def test_relative_programs_resolve_against_the_worktree(tmp_path: Path) -> None:
    interpreter = tmp_path / "bin" / "probe.py"
    interpreter.parent.mkdir()
    interpreter.write_text("", encoding="utf-8")

    argv = resolve_argv(f"bin/{interpreter.name} --version", tmp_path)

    assert argv == [str(interpreter), "--version"]


def test_parent_repo_venv_is_used_when_the_worktree_has_none(tmp_path: Path) -> None:
    repo = tmp_path / "demo-repo"
    interpreter = repo / ".venv" / "Scripts" / "python.exe"
    interpreter.parent.mkdir(parents=True)
    interpreter.write_text("", encoding="utf-8")
    worktree = tmp_path / ".hermes-rewind" / "abc12345"
    worktree.mkdir(parents=True)

    argv = resolve_argv("python -m pytest -q", worktree, (repo,))

    assert argv[0] == str(interpreter)
    assert (
        resolved_command("python -m pytest -q", worktree, (repo,))
        == str(interpreter) + " -m pytest -q"
    )


def test_missing_program_is_reported_instead_of_failing_silently() -> None:
    with pytest.raises(LookupError, match="not on the gateway PATH"):
        resolve_argv("definitely-not-a-real-program-xyz --version")

    assert resolved_command("definitely-not-a-real-program-xyz --version") is None
    assert resolved_command(sys.executable) is not None


def test_verify_runner_returns_the_resolution_message(tmp_path: Path) -> None:
    result = VerifyRunner().run("definitely-not-a-real-program-xyz", tmp_path, 10)

    assert result.exit_code is None
    assert result.timed_out is False
    assert "not on the gateway PATH" in result.output


def test_verify_runner_still_runs_a_resolved_interpreter(tmp_path: Path) -> None:
    result = VerifyRunner().run(f'{sys.executable} -c "print(42)"', tmp_path, 20)

    assert result.exit_code == 0
    assert result.output.strip().endswith("42")


def _client(database: Database) -> TestClient:
    app = FastAPI()
    app.include_router(create_router(database), prefix=PREFIX)
    return TestClient(app)


def test_prepare_rejects_multiline_and_oversized_verify_commands(database: Database) -> None:
    client = _client(database)
    payload = {
        "session_id": "s1",
        "event_id": 1,
        "verify_cmd": "pytest -q\nrm -rf /",
    }

    assert client.post(f"{PREFIX}/forks/prepare", json=payload).status_code == 422

    payload["verify_cmd"] = "a" * 501
    assert client.post(f"{PREFIX}/forks/prepare", json=payload).status_code == 422

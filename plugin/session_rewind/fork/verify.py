from __future__ import annotations

import os
import re
import shlex
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path

MAX_OUTPUT_CHARS = 20000
_BATCH_SUFFIXES = (".cmd", ".bat")
_PYTHON_NAME = re.compile(r"^python3?(\.\d+)?(\.exe)?$", re.IGNORECASE)
_VENV_LAYOUTS = ("Scripts/python.exe", "bin/python")


@dataclass(frozen=True, slots=True)
class VerifyResult:
    exit_code: int | None
    output: str
    duration_ms: float
    timed_out: bool


def split_command(command: str) -> list[str]:
    if sys.platform == "win32":
        return [token.strip('"') for token in shlex.split(command, posix=False)]
    return shlex.split(command, posix=True)


def _workspace_python(directory: Path) -> Path | None:
    for layout in _VENV_LAYOUTS:
        candidate = directory / ".venv" / layout
        if candidate.exists():
            return candidate
    return None


def _locate(
    program: str,
    cwd: Path | None,
    fallback_dirs: tuple[Path, ...] = (),
) -> str | None:
    if cwd is not None:
        if _PYTHON_NAME.match(Path(program).name):
            for directory in (cwd, *fallback_dirs):
                interpreter = _workspace_python(directory)
                if interpreter is not None:
                    return str(interpreter)
        if "\\" in program or "/" in program:
            candidate = cwd / program
            if candidate.exists():
                return str(candidate)
    return shutil.which(program)


def resolve_argv(
    command: str,
    cwd: Path | None = None,
    fallback_dirs: tuple[Path, ...] = (),
) -> list[str]:
    args = split_command(command)
    if not args:
        raise LookupError("empty verify command")
    program = _locate(args[0], cwd, fallback_dirs)
    if program is None:
        raise LookupError(f"verify command is not on the gateway PATH: {args[0]}")
    if sys.platform == "win32" and program.lower().endswith(_BATCH_SUFFIXES):
        shell = os.environ.get("COMSPEC", "cmd.exe")
        return [shell, "/c", program, *args[1:]]
    return [program, *args[1:]]


def resolved_command(
    command: str,
    cwd: Path | None = None,
    fallback_dirs: tuple[Path, ...] = (),
) -> str | None:
    try:
        return " ".join(resolve_argv(command, cwd, fallback_dirs))
    except (LookupError, ValueError):
        return None


class VerifyRunner:
    def run(
        self,
        command: str,
        cwd: Path,
        timeout_seconds: float,
        fallback_dirs: tuple[Path, ...] = (),
    ) -> VerifyResult:
        started = time.monotonic()
        if not cwd.exists():
            return VerifyResult(None, "worktree does not exist", _elapsed_ms(started), False)
        try:
            argv = resolve_argv(command, cwd, fallback_dirs)
        except LookupError as exc:
            return VerifyResult(None, str(exc), _elapsed_ms(started), False)
        except ValueError as exc:
            message = f"could not parse the verify command: {exc}"
            return VerifyResult(None, message, _elapsed_ms(started), False)
        try:
            result = subprocess.run(
                argv,
                cwd=str(cwd),
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                check=False,
                env=_verify_env(),
            )
        except subprocess.TimeoutExpired:
            return VerifyResult(None, "verify command timed out", _elapsed_ms(started), True)
        except OSError as exc:
            return VerifyResult(None, str(exc), _elapsed_ms(started), False)
        output = (result.stdout + result.stderr)[:MAX_OUTPUT_CHARS]
        return VerifyResult(result.returncode, output, _elapsed_ms(started), False)


def _verify_env() -> dict[str, str]:
    return {
        key: value
        for key, value in os.environ.items()
        if not key.startswith(("COVERAGE_", "COV_CORE_"))
    }


def _elapsed_ms(started: float) -> float:
    return (time.monotonic() - started) * 1000.0

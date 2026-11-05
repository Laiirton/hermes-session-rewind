from __future__ import annotations

import os
import shlex
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path

MAX_OUTPUT_CHARS = 20000


@dataclass(frozen=True, slots=True)
class VerifyResult:
    exit_code: int | None
    output: str
    duration_ms: float
    timed_out: bool


class VerifyRunner:
    def run(self, command: str, cwd: Path, timeout_seconds: float) -> VerifyResult:
        started = time.monotonic()
        try:
            args = shlex.split(command, posix=True)
        except ValueError as exc:
            return VerifyResult(None, str(exc), _elapsed_ms(started), False)
        if not args:
            return VerifyResult(None, "empty verify command", _elapsed_ms(started), False)
        if not cwd.exists():
            return VerifyResult(None, "worktree does not exist", _elapsed_ms(started), False)
        try:
            result = subprocess.run(
                args,
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

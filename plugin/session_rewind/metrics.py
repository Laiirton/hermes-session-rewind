from __future__ import annotations

from typing import Any


def compare_verdict(left: dict[str, Any] | None, right: dict[str, Any] | None) -> str:
    if left is None or right is None:
        return "missing session"
    verify_exit = right.get("verify_exit")
    if verify_exit is not None and int(verify_exit) != 0:
        return f"right failed verification (exit {int(verify_exit)})"
    left_errors = int(left.get("tool_errors", 0))
    right_errors = int(right.get("tool_errors", 0))
    if left_errors != right_errors:
        return (
            "right has fewer tool errors"
            if right_errors < left_errors
            else "left has fewer tool errors"
        )
    left_tokens = int(left.get("tokens_in", 0)) + int(left.get("tokens_out", 0))
    right_tokens = int(right.get("tokens_in", 0)) + int(right.get("tokens_out", 0))
    if left_tokens != right_tokens:
        return "right uses fewer tokens" if right_tokens < left_tokens else "left uses fewer tokens"
    left_outcome = left.get("outcome")
    right_outcome = right.get("outcome")
    if left_outcome != right_outcome:
        return f"outcomes differ: {left_outcome} vs {right_outcome}"
    if verify_exit is not None:
        return "right matches the original and passes verification"
    return "no measurable difference"

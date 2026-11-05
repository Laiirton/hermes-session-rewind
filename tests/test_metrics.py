from __future__ import annotations

from session_rewind.metrics import compare_verdict


def test_compare_verdict_cases() -> None:
    assert compare_verdict(None, {}) == "missing session"
    assert compare_verdict({}, None) == "missing session"
    assert compare_verdict({"tool_errors": 1}, {"tool_errors": 0}) == "right has fewer tool errors"
    assert compare_verdict({"tool_errors": 0}, {"tool_errors": 1}) == "left has fewer tool errors"
    assert (
        compare_verdict(
            {"tool_errors": 0, "tokens_in": 10, "tokens_out": 10},
            {"tool_errors": 0, "tokens_in": 5, "tokens_out": 5},
        )
        == "right uses fewer tokens"
    )
    assert (
        compare_verdict(
            {"tool_errors": 0, "tokens_in": 5, "tokens_out": 5},
            {"tool_errors": 0, "tokens_in": 10, "tokens_out": 10},
        )
        == "left uses fewer tokens"
    )
    assert (
        compare_verdict(
            {"tool_errors": 0, "tokens_in": 1, "tokens_out": 1, "outcome": "failed"},
            {"tool_errors": 0, "tokens_in": 1, "tokens_out": 1, "outcome": "completed"},
        )
        == "outcomes differ: failed vs completed"
    )
    assert (
        compare_verdict(
            {"tool_errors": 0, "tokens_in": 1, "tokens_out": 1, "outcome": "completed"},
            {"tool_errors": 0, "tokens_in": 1, "tokens_out": 1, "outcome": "completed"},
        )
        == "no measurable difference"
    )

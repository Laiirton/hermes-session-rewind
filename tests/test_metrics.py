from __future__ import annotations

from session_rewind.metrics import compare_verdict


def test_compare_verdict_cases() -> None:
    assert compare_verdict(None, {}) == "missing session"
    assert compare_verdict({}, None) == "missing session"
    assert compare_verdict({"tool_errors": 1}, {"tool_errors": 0}) == "right has fewer tool errors"
    recorded_left = {
        "tool_errors": 0,
        "tool_calls": 5,
        "duration_ms": 90000.0,
        "tokens_in": 800,
        "tokens_out": 200,
    }
    assert compare_verdict(recorded_left, {"tool_errors": 1}) == "left has fewer tool errors"
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


def test_verdict_refuses_to_score_an_empty_baseline() -> None:
    assert (
        compare_verdict(
            {
                "tool_errors": 0,
                "tool_calls": 0,
                "duration_ms": 6.79,
                "event_count": 15,
                "tokens_in": 0,
                "tokens_out": 0,
            },
            {
                "tool_errors": 1,
                "tool_calls": 4,
                "duration_ms": 30000.0,
                "tokens_in": 40000,
                "tokens_out": 48000,
            },
        )
        == "nothing was recorded before the fork, so the rerun has no baseline"
    )

    assert (
        compare_verdict(
            {
                "tool_errors": 2,
                "tool_calls": 9,
                "duration_ms": 150000.0,
                "tokens_in": 900,
                "tokens_out": 100,
            },
            {
                "tool_errors": 1,
                "tool_calls": 4,
                "duration_ms": 30000.0,
                "tokens_in": 40000,
                "tokens_out": 48000,
            },
        )
        == "right has fewer tool errors"
    )

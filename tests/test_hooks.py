from __future__ import annotations

from session_rewind.capture.hooks import HookRecorder
from session_rewind.capture.queue import CaptureItem
from session_rewind.settings import Settings


class FakeSink:
    def __init__(self) -> None:
        self.items: list[CaptureItem] = []

    def submit(self, item: CaptureItem) -> None:
        self.items.append(item)


class BrokenSink:
    def __init__(self) -> None:
        self.calls = 0

    def submit(self, item: CaptureItem) -> None:
        self.calls += 1
        raise RuntimeError(f"cannot accept {item.kind}")


def _recorder(capture_results: bool = True) -> tuple[HookRecorder, FakeSink]:
    sink = FakeSink()
    return HookRecorder(sink, Settings(capture_results=capture_results)), sink


def test_session_and_model_hooks() -> None:
    recorder, sink = _recorder()
    recorder.on_session_start(session_id="s1", model="model-a", platform="desktop")
    recorder.pre_llm_call(
        session_id="s1",
        user_message="hello",
        conversation_history=[{"role": "user"}],
        model="model-a",
        turn_id="turn-1",
    )
    recorder.post_llm_call(
        session_id="s1",
        assistant_response="hi",
        model="model-a",
        turn_id="turn-1",
    )
    recorder.post_api_request(
        session_id="s1",
        usage={"prompt_tokens": 3, "completion_tokens": 4, "total_tokens": 7},
        api_duration=1.5,
        turn_id="turn-1",
    )
    recorder.on_session_end(session_id="s1", completed=True)
    recorder.on_session_finalize(session_id="s1", reason="shutdown")
    assert [item.kind for item in sink.items] == [
        "session_start",
        "user_turn",
        "assistant_response",
        "llm_call",
        "turn_end",
        "session_finalize",
    ]
    assert sink.items[1].payload["history_messages"] == 1
    assert sink.items[3].payload["prompt_tokens"] == 3
    assert sink.items[3].payload["completion_tokens"] == 4
    assert sink.items[3].duration_ms == 1500.0
    assert sink.items[4].payload["completed"] is True
    assert sink.items[5].payload["reason"] == "shutdown"


def test_tool_hooks_and_result_omission() -> None:
    recorder, sink = _recorder(capture_results=False)
    recorder.pre_tool_call(
        session_id="s1",
        tool_name="terminal",
        args={"command": "ls"},
        tool_call_id="call-1",
    )
    recorder.post_tool_call(
        session_id="s1",
        tool_name="terminal",
        args={"command": "ls"},
        result="a" * 10000,
        status="error",
        error_type="ToolError",
        error_message="boom",
        duration_ms=12.5,
        tool_call_id="call-1",
    )
    assert sink.items[0].kind == "tool_call"
    assert sink.items[0].status == "pending"
    assert sink.items[1].kind == "tool_result"
    assert sink.items[1].payload["result_omitted"] is True
    assert sink.items[1].payload["error_type"] == "ToolError"
    assert sink.items[1].status == "error"
    assert sink.items[1].duration_ms == 12.5


def test_session_without_an_id_reaches_the_writer_unnamed() -> None:
    recorder, sink = _recorder()
    recorder.on_session_start()
    assert [item.session_id for item in sink.items] == [""]

    broken = BrokenSink()
    recorder = HookRecorder(broken, Settings())
    recorder.on_session_start(session_id="s1")
    recorder.pre_tool_call(session_id="s1", tool_name="patch", args={"path": "app.py"})
    recorder.post_tool_call(session_id="s1", tool_name="patch", result="ok", duration_ms=4.0)
    recorder.on_session_end(session_id="s1")
    recorder.on_session_finalize(session_id="s1")

    assert broken.calls == 5


def test_api_request_and_compaction_hooks() -> None:
    recorder, sink = _recorder()
    recorder.pre_api_request(
        session_id="s1",
        model="model-a",
        provider="local",
        api_call_count=1,
        message_count=2,
        tool_count=3,
        approx_input_tokens=4,
        max_tokens=5,
        api_request_id="req-1",
    )
    recorder.post_compaction(
        session_id="s1",
        old_session_id="s0",
        kind="auto",
        reason="threshold",
        before_tokens=100,
        after_tokens=20,
        messages_removed=3,
    )
    assert sink.items[0].kind == "api_request"
    assert sink.items[0].payload["message_count"] == 2
    assert sink.items[0].api_request_id == "req-1"
    assert sink.items[1].kind == "compaction"
    assert sink.items[1].payload["messages_removed"] == 3


def test_post_api_request_accepts_usage_object() -> None:
    class Usage:
        prompt_tokens = 1
        completion_tokens = 2
        total_tokens = 3
        cost_usd = 0.25

    recorder, sink = _recorder()
    recorder.post_api_request(session_id="s1", usage=Usage(), api_duration=0.5)
    assert sink.items[0].payload["prompt_tokens"] == 1
    assert sink.items[0].payload["completion_tokens"] == 2
    assert sink.items[0].payload["cost_usd"] == 0.25
    assert sink.items[0].duration_ms == 500.0


def test_tool_result_capture_enabled() -> None:
    recorder, sink = _recorder(capture_results=True)
    recorder.post_tool_call(session_id="s1", tool_name="terminal", result="ok")
    assert sink.items[0].payload["result"] == "ok"
    assert sink.items[0].status == "ok"


def test_hooks_keep_the_task_id_of_an_event_without_a_session_id() -> None:
    recorder, sink = _recorder()
    recorder.pre_tool_call(
        tool_name="terminal",
        args={"command": "ls"},
        task_id="s1",
    )
    recorder.post_tool_call(
        tool_name="terminal",
        args={"command": "ls"},
        result="ok",
        task_id="s1",
    )
    assert [item.session_id for item in sink.items] == ["", ""]
    assert [item.task_id for item in sink.items] == ["s1", "s1"]

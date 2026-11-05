from __future__ import annotations

import time
from typing import Any, Protocol

from ..logging import get_logger
from ..settings import Settings
from .queue import CaptureItem

LOGGER = get_logger("hooks")


class CaptureSink(Protocol):
    def submit(self, item: CaptureItem) -> None: ...


class HookRecorder:
    def __init__(self, service: CaptureSink, settings: Settings) -> None:
        self._service = service
        self._settings = settings

    def on_session_start(
        self,
        session_id: str | None = None,
        model: str | None = None,
        platform: str | None = None,
        **kwargs: Any,
    ) -> None:
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="session_start",
                payload=_compact({"model": model, "platform": platform}),
            )
        )

    def on_session_end(
        self,
        session_id: str | None = None,
        completed: bool | None = None,
        failed: bool | None = None,
        interrupted: bool | None = None,
        turn_exit_reason: str | None = None,
        model: str | None = None,
        platform: str | None = None,
        **kwargs: Any,
    ) -> None:
        payload = _compact(
            {
                "completed": completed,
                "failed": failed,
                "interrupted": interrupted,
                "turn_exit_reason": turn_exit_reason,
                "model": model,
                "platform": platform,
            }
        )
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="turn_end",
                payload=payload,
            )
        )

    def on_session_finalize(
        self,
        session_id: str | None = None,
        platform: str | None = None,
        reason: str | None = None,
        **kwargs: Any,
    ) -> None:
        payload = _compact({"reason": reason, "platform": platform})
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="session_finalize",
                payload=payload,
            )
        )

    def pre_llm_call(
        self,
        session_id: str | None = None,
        user_message: Any = None,
        conversation_history: Any = None,
        is_first_turn: bool | None = None,
        model: str | None = None,
        platform: str | None = None,
        parent_session_id: str | None = None,
        task_id: str | None = None,
        turn_id: str | None = None,
        **kwargs: Any,
    ) -> None:
        payload = _compact(
            {
                "user_message": user_message,
                "is_first_turn": is_first_turn,
                "model": model,
                "platform": platform,
                "parent_session_id": parent_session_id,
                "history_messages": (
                    len(conversation_history) if isinstance(conversation_history, list) else None
                ),
            }
        )
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="user_turn",
                payload=payload,
                task_id=task_id,
                turn_id=turn_id,
            )
        )

    def post_llm_call(
        self,
        session_id: str | None = None,
        user_message: Any = None,
        assistant_response: Any = None,
        conversation_history: Any = None,
        model: str | None = None,
        platform: str | None = None,
        task_id: str | None = None,
        turn_id: str | None = None,
        **kwargs: Any,
    ) -> None:
        payload = _compact(
            {
                "assistant_response": assistant_response,
                "model": model,
                "platform": platform,
                "response_chars": (
                    len(assistant_response) if isinstance(assistant_response, str) else None
                ),
            }
        )
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="assistant_response",
                payload=payload,
                task_id=task_id,
                turn_id=turn_id,
            )
        )

    def pre_api_request(
        self,
        session_id: str | None = None,
        model: str | None = None,
        provider: str | None = None,
        api_mode: str | None = None,
        api_call_count: int | None = None,
        message_count: int | None = None,
        tool_count: int | None = None,
        approx_input_tokens: int | None = None,
        max_tokens: int | None = None,
        task_id: str | None = None,
        turn_id: str | None = None,
        api_request_id: str | None = None,
        **kwargs: Any,
    ) -> None:
        payload = _compact(
            {
                "model": model,
                "provider": provider,
                "api_mode": api_mode,
                "api_call_count": api_call_count,
                "message_count": message_count,
                "tool_count": tool_count,
                "approx_input_tokens": approx_input_tokens,
                "max_tokens": max_tokens,
            }
        )
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="api_request",
                payload=payload,
                task_id=task_id,
                turn_id=turn_id,
                api_request_id=api_request_id,
            )
        )

    def post_api_request(
        self,
        session_id: str | None = None,
        model: str | None = None,
        provider: str | None = None,
        api_duration: float | None = None,
        finish_reason: str | None = None,
        response_model: str | None = None,
        usage: Any = None,
        assistant_content_chars: int | None = None,
        assistant_tool_call_count: int | None = None,
        task_id: str | None = None,
        turn_id: str | None = None,
        api_request_id: str | None = None,
        **kwargs: Any,
    ) -> None:
        usage_payload = _usage_payload(usage)
        payload = _compact(
            {
                "model": model or response_model,
                "provider": provider,
                "prompt_tokens": usage_payload.get("prompt_tokens"),
                "completion_tokens": usage_payload.get("completion_tokens"),
                "total_tokens": usage_payload.get("total_tokens"),
                "cost_usd": usage_payload.get("cost_usd"),
                "finish_reason": finish_reason,
                "response_model": response_model,
                "assistant_content_chars": assistant_content_chars,
                "assistant_tool_call_count": assistant_tool_call_count,
            }
        )
        duration_ms = api_duration * 1000.0 if isinstance(api_duration, (int, float)) else None
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="llm_call",
                payload=payload,
                task_id=task_id,
                turn_id=turn_id,
                api_request_id=api_request_id,
                duration_ms=duration_ms,
            )
        )

    def pre_tool_call(
        self,
        tool_name: str = "",
        args: Any = None,
        session_id: str | None = None,
        task_id: str | None = None,
        turn_id: str | None = None,
        tool_call_id: str | None = None,
        **kwargs: Any,
    ) -> None:
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="tool_call",
                payload={"args": _mapping(args)},
                task_id=task_id,
                turn_id=turn_id,
                tool_call_id=tool_call_id,
                name=tool_name or None,
                status="pending",
            )
        )

    def post_tool_call(
        self,
        tool_name: str = "",
        args: Any = None,
        result: Any = None,
        duration_ms: float | None = None,
        status: str | None = None,
        error_type: str | None = None,
        error_message: str | None = None,
        session_id: str | None = None,
        task_id: str | None = None,
        turn_id: str | None = None,
        tool_call_id: str | None = None,
        **kwargs: Any,
    ) -> None:
        payload: dict[str, Any] = {"args": _mapping(args)}
        if self._settings.capture_results:
            payload["result"] = result
        else:
            payload["result_omitted"] = True
        if error_type is not None:
            payload["error_type"] = error_type
        if error_message is not None:
            payload["error_message"] = error_message
        resolved_status = status or ("error" if error_type else "ok")
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="tool_result",
                payload=payload,
                task_id=task_id,
                turn_id=turn_id,
                tool_call_id=tool_call_id,
                name=tool_name or None,
                status=resolved_status,
                duration_ms=duration_ms,
            )
        )

    def post_compaction(
        self,
        session_id: str | None = None,
        old_session_id: str | None = None,
        kind: str | None = None,
        reason: str | None = None,
        before_tokens: int | None = None,
        after_tokens: int | None = None,
        messages_removed: int | None = None,
        **kwargs: Any,
    ) -> None:
        payload = _compact(
            {
                "old_session_id": old_session_id,
                "kind": kind,
                "reason": reason,
                "before_tokens": before_tokens,
                "after_tokens": after_tokens,
                "messages_removed": messages_removed,
            }
        )
        self._submit(
            CaptureItem(
                session_id=_session_id(session_id),
                ts=time.time(),
                kind="compaction",
                payload=payload,
            )
        )

    def _submit(self, item: CaptureItem) -> None:
        try:
            self._service.submit(item)
        except Exception:
            LOGGER.exception("capture hook failed")


def _session_id(value: str | None) -> str:
    return value if isinstance(value, str) else ""


def _compact(payload: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in payload.items() if value is not None}


def _mapping(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return dict(value)
    return {"value": value}


def _usage_payload(usage: Any) -> dict[str, Any]:
    prompt = _usage_value(usage, "prompt_tokens")
    if prompt is None:
        prompt = _usage_value(usage, "input_tokens")
    completion = _usage_value(usage, "completion_tokens")
    if completion is None:
        completion = _usage_value(usage, "output_tokens")
    return {
        "prompt_tokens": prompt,
        "completion_tokens": completion,
        "total_tokens": _usage_value(usage, "total_tokens"),
        "cost_usd": _usage_value(usage, "cost_usd"),
    }


def _usage_value(usage: Any, key: str) -> Any:
    if isinstance(usage, dict):
        return usage.get(key)
    return getattr(usage, key, None)

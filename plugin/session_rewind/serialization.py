from __future__ import annotations

import json
from typing import Any


def parse_payload(event: dict[str, Any]) -> dict[str, Any]:
    raw = event.get("payload_json")
    if not isinstance(raw, str):
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {"raw": raw}
    return parsed if isinstance(parsed, dict) else {"value": parsed}


def preview(payload: dict[str, Any]) -> str:
    for key in (
        "user_message",
        "assistant_response",
        "result",
        "args",
        "error_message",
        "reason",
    ):
        value = payload.get(key)
        if value is None:
            continue
        text = (
            value if isinstance(value, str) else json.dumps(value, ensure_ascii=False, default=str)
        )
        return text[:300]
    return ""


def event_summary(event: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": event.get("id"),
        "session_id": event.get("session_id"),
        "seq": event.get("seq"),
        "ts": event.get("ts"),
        "kind": event.get("kind"),
        "name": event.get("name"),
        "status": event.get("status"),
        "duration_ms": event.get("duration_ms"),
        "turn_id": event.get("turn_id"),
        "tool_call_id": event.get("tool_call_id"),
        "api_request_id": event.get("api_request_id"),
        "preview": preview(parse_payload(event)),
    }


def event_detail(event: dict[str, Any]) -> dict[str, Any]:
    detail = event_summary(event)
    detail["task_id"] = event.get("task_id")
    detail["payload"] = parse_payload(event)
    return detail

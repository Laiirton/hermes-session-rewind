from __future__ import annotations

from typing import Any

TOLERANCE_SECONDS = 0.5


class SessionDBTranscriptReader:
    def row_count_before(self, stored_session_id: str, ts: float) -> int | None:
        if not stored_session_id:
            return None
        try:
            from hermes_state import SessionDB
        except Exception:
            return None
        database: Any = None
        messages: Any = None
        try:
            database = SessionDB(read_only=True)
            messages = database.get_messages(stored_session_id)
        except Exception:
            return None
        finally:
            close = getattr(database, "close", None)
            if callable(close):
                close()
        if not isinstance(messages, list):
            return None
        best: int | None = None
        for count, message in enumerate(messages):
            role = _role(message)
            timestamp = _timestamp(message)
            if role == "user" and timestamp is not None and timestamp <= ts + TOLERANCE_SECONDS:
                best = count
        return best


def _role(message: Any) -> str:
    value = message.get("role") if isinstance(message, dict) else getattr(message, "role", None)
    return value.lower() if isinstance(value, str) else ""


def _timestamp(message: Any) -> float | None:
    value = (
        message.get("timestamp")
        if isinstance(message, dict)
        else getattr(message, "timestamp", None)
    )
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return None
    return None

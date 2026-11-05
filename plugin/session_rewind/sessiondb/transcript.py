from __future__ import annotations

from typing import Any

TOLERANCE_SECONDS = 0.5


class SessionDBTranscriptReader:
    def row_count_before(self, stored_session_id: str, ts: float) -> int | None:
        if not stored_session_id:
            return None
        database = _open()
        if database is None:
            return None
        try:
            rows = _display_rows(database, stored_session_id)
        finally:
            _close(database)
        if rows is None:
            return None
        target: int | None = None
        limit = ts + TOLERANCE_SECONDS
        for index, message in enumerate(rows):
            timestamp = _timestamp(message)
            if _role(message) == "user" and timestamp is not None and timestamp <= limit:
                target = index
        return target


def _open() -> Any:
    try:
        from hermes_state import SessionDB
    except Exception:
        return None
    try:
        return SessionDB(read_only=True)
    except Exception:
        return None


def _close(database: Any) -> None:
    close = getattr(database, "close", None)
    if callable(close):
        close()


def _display_rows(database: Any, stored_session_id: str) -> list[Any] | None:
    resume = getattr(database, "get_resume_conversations", None)
    if callable(resume):
        try:
            _, display = resume(stored_session_id)
        except Exception:
            return None
        if not isinstance(display, list):
            return None
        return [message for message in display if _visible(message)]
    try:
        messages = database.get_messages(stored_session_id)
    except Exception:
        return None
    if not isinstance(messages, list):
        return None
    return [message for message in messages if _visible(message)]


def _visible(message: Any) -> bool:
    return _role(message) in {"user", "assistant"} and bool(_content_text(message))


def _role(message: Any) -> str:
    value = message.get("role") if isinstance(message, dict) else getattr(message, "role", None)
    return value.lower() if isinstance(value, str) else ""


def _content_text(message: Any) -> str:
    value = (
        message.get("content") if isinstance(message, dict) else getattr(message, "content", None)
    )
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, list):
        parts: list[str] = []
        for part in value:
            if isinstance(part, dict):
                text = part.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "".join(parts).strip()
    return ""


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

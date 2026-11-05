from __future__ import annotations

import json
import time
from collections.abc import Callable
from typing import Any

from .logging import get_logger
from .metrics import compare_verdict
from .serialization import event_detail, event_summary
from .store.db import Database
from .store.repositories import ReadStore, WriteStore

LOGGER = get_logger("tools")

SEARCH_SCHEMA: dict[str, Any] = {
    "name": "rewind_search",
    "description": (
        "Search the local Session Rewind index of recorded prompts, tool calls, "
        "tool results, model responses and errors. Use this to recover what happened "
        "earlier in a session or across recorded sessions."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Words to find in captured events.",
            },
            "session_id": {
                "type": "string",
                "description": "Restrict the search to one recorded session.",
            },
            "limit": {
                "type": "integer",
                "minimum": 1,
                "maximum": 50,
                "default": 20,
            },
        },
        "required": ["query"],
    },
}

INSPECT_SCHEMA: dict[str, Any] = {
    "name": "rewind_inspect",
    "description": (
        "Inspect one recorded event in full, or list the events of a recorded session "
        "in order. Payloads are local, redacted and truncated at capture time."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "event_id": {
                "type": "integer",
                "minimum": 1,
                "description": "Inspect a single event by id.",
            },
            "session_id": {
                "type": "string",
                "description": "List events for this recorded session.",
            },
            "after_seq": {
                "type": "integer",
                "minimum": 0,
                "description": "Return events with a sequence number greater than this value.",
            },
            "limit": {
                "type": "integer",
                "minimum": 1,
                "maximum": 200,
                "default": 50,
            },
        },
    },
}

COMPARE_SCHEMA: dict[str, Any] = {
    "name": "rewind_compare",
    "description": (
        "Compare two recorded sessions by outcome, tool errors, tokens, cost and wall time. "
        "Use this after a rerun to report which branch performed better."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "left_session_id": {
                "type": "string",
                "description": "Baseline recorded session.",
            },
            "right_session_id": {
                "type": "string",
                "description": "Rerun or branch recorded session.",
            },
        },
        "required": ["left_session_id", "right_session_id"],
    },
}

BOOKMARK_SCHEMA: dict[str, Any] = {
    "name": "rewind_bookmark",
    "description": (
        "Attach a short bookmark to a recorded session or event so the user can find "
        "the important moment in the Rewind timeline."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "session_id": {
                "type": "string",
                "description": "Recorded session to bookmark.",
            },
            "event_id": {
                "type": "integer",
                "minimum": 1,
                "description": "Optional event to bookmark.",
            },
            "label": {
                "type": "string",
                "description": "Short bookmark label.",
            },
            "note": {
                "type": "string",
                "description": "Optional longer note.",
            },
        },
        "required": ["session_id", "label"],
    },
}


class RewindTools:
    def __init__(self, database: Database) -> None:
        self._database = database

    def search(self, args: dict[str, Any], **kwargs: Any) -> str:
        try:
            query = _required_text(args, "query")
            session_id = _optional_text(args, "session_id")
            limit = _bounded_int(args, "limit", 20, 1, 50)
            events = ReadStore(self._database).search_events(
                query,
                session_id=session_id,
                limit=limit,
            )
            return _json(
                {
                    "query": query,
                    "session_id": session_id,
                    "events": [event_summary(event) for event in events],
                }
            )
        except Exception as exc:
            LOGGER.exception("rewind_search failed")
            return _error(exc)

    def inspect(self, args: dict[str, Any], **kwargs: Any) -> str:
        try:
            event_id = _optional_int(args, "event_id")
            session_id = _optional_text(args, "session_id")
            store = ReadStore(self._database)
            if event_id is not None:
                event = store.get_event(event_id)
                if event is None:
                    return _json({"error": "event not found"})
                return _json(event_detail(event))
            if session_id is None:
                return _json({"error": "event_id or session_id is required"})
            after_seq = _optional_int(args, "after_seq")
            limit = _bounded_int(args, "limit", 50, 1, 200)
            session = store.get_session(session_id)
            events = store.list_events(
                session_id,
                after_seq=after_seq,
                limit=limit,
            )
            return _json(
                {
                    "session": session,
                    "events": [event_summary(event) for event in events],
                    "has_more": len(events) == limit,
                }
            )
        except Exception as exc:
            LOGGER.exception("rewind_inspect failed")
            return _error(exc)

    def compare(self, args: dict[str, Any], **kwargs: Any) -> str:
        try:
            left = _required_text(args, "left_session_id")
            right = _required_text(args, "right_session_id")
            comparison = ReadStore(self._database).compare_sessions(left, right)
            comparison["verdict"] = compare_verdict(comparison.get("left"), comparison.get("right"))
            return _json(comparison)
        except Exception as exc:
            LOGGER.exception("rewind_compare failed")
            return _error(exc)

    def bookmark(self, args: dict[str, Any], **kwargs: Any) -> str:
        try:
            session_id = _required_text(args, "session_id")
            label = _required_text(args, "label")
            event_id = _optional_int(args, "event_id")
            note = _optional_text(args, "note")
            created_at = time.time()
            store = WriteStore(self._database.connect())
            try:
                bookmark_id = store.add_bookmark(session_id, event_id, label, note, created_at)
            finally:
                store.close()
            return _json(
                {
                    "id": bookmark_id,
                    "session_id": session_id,
                    "event_id": event_id,
                    "label": label,
                    "note": note,
                    "created_at": created_at,
                }
            )
        except Exception as exc:
            LOGGER.exception("rewind_bookmark failed")
            return _error(exc)


def registrations(
    tools: RewindTools,
) -> list[tuple[str, dict[str, Any], Callable[..., str]]]:
    return [
        ("rewind_search", SEARCH_SCHEMA, tools.search),
        ("rewind_inspect", INSPECT_SCHEMA, tools.inspect),
        ("rewind_compare", COMPARE_SCHEMA, tools.compare),
        ("rewind_bookmark", BOOKMARK_SCHEMA, tools.bookmark),
    ]


def _json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, default=str, separators=(",", ":"))


def _error(exc: Exception) -> str:
    return _json({"error": str(exc)})


def _required_text(args: dict[str, Any], key: str) -> str:
    value = args.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{key} is required")
    return value.strip()


def _optional_text(args: dict[str, Any], key: str) -> str | None:
    value = args.get(key)
    if value is None:
        return None
    if not isinstance(value, str):
        raise ValueError(f"{key} must be a string")
    return value.strip() or None


def _optional_int(args: dict[str, Any], key: str) -> int | None:
    value = args.get(key)
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, int):
        raise ValueError(f"{key} must be an integer")
    return int(value)


def _bounded_int(args: dict[str, Any], key: str, default: int, minimum: int, maximum: int) -> int:
    value = _optional_int(args, key)
    if value is None:
        return default
    return max(minimum, min(maximum, value))

from __future__ import annotations

import json
import re


def last_turn_outcome(payload_json: str) -> str | None:
    try:
        payload = json.loads(payload_json)
    except ValueError:
        return None
    if not isinstance(payload, dict):
        return None
    if payload.get("completed"):
        return "completed"
    if payload.get("failed") or payload.get("interrupted"):
        return "failed"
    return None


def _safe_fts_query(query: str) -> str:
    tokens = [token for token in re.split(r"\s+", query.strip()) if token]
    cleaned = [token.replace('"', "") for token in tokens]
    return " AND ".join(f'"{token}"' for token in cleaned if token)


# Backwards-compatible private alias used by older imports.
_last_turn_outcome = last_turn_outcome

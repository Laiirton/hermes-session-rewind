from __future__ import annotations

import sqlite3
from typing import Any

from .helpers import _safe_fts_query

__all__ = ["_safe_fts_query", "safe_fts_query"]


def safe_fts_query(query: str) -> str:
    return _safe_fts_query(query)


def search_events(
    connection: sqlite3.Connection,
    query: str,
    *,
    session_id: str | None = None,
    limit: int = 50,
    kind: str | None = None,
    tool_name: str | None = None,
) -> list[dict[str, Any]]:
    fts_query = _safe_fts_query(query)
    if not fts_query:
        return []
    sql = (
        "SELECT e.* FROM events_fts f "
        "JOIN events e ON e.id = f.rowid "
        "WHERE events_fts MATCH ?"
    )
    params: list[Any] = [fts_query]
    if session_id is not None:
        sql += " AND e.session_id = ?"
        params.append(session_id)
    if kind:
        sql += " AND e.kind = ?"
        params.append(kind)
    if tool_name:
        sql += " AND e.name = ?"
        params.append(tool_name)
    sql += " ORDER BY e.ts DESC LIMIT ?"
    params.append(limit)
    rows = connection.execute(sql, params).fetchall()
    return [dict(row) for row in rows]

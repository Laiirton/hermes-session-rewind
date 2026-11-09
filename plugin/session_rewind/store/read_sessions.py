from __future__ import annotations

import sqlite3
from collections.abc import Sequence
from typing import Any

from .db import Database
from .helpers import last_turn_outcome
from .search import search_events as _search_events


class ReadStore:
    def __init__(self, database: Database) -> None:
        self._database = database

    def _connect(self) -> sqlite3.Connection:
        return self._database.connect(read_only=True)

    def counts(self) -> dict[str, int]:
        connection = self._connect()
        try:
            sessions = connection.execute("SELECT COUNT(*) AS count FROM sessions").fetchone()
            events = connection.execute("SELECT COUNT(*) AS count FROM events").fetchone()
            branches = connection.execute("SELECT COUNT(*) AS count FROM branches").fetchone()
            snapshots = connection.execute("SELECT COUNT(*) AS count FROM snapshots").fetchone()
            return {
                "sessions": int(sessions["count"]) if sessions is not None else 0,
                "events": int(events["count"]) if events is not None else 0,
                "branches": int(branches["count"]) if branches is not None else 0,
                "snapshots": int(snapshots["count"]) if snapshots is not None else 0,
            }
        finally:
            connection.close()

    def list_sessions(self, limit: int, offset: int) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            rows = connection.execute(
                """
                SELECT
                    s.session_id,
                    s.stored_session_id,
                    s.parent_session_id,
                    s.title,
                    s.cwd,
                    s.model,
                    s.provider,
                    s.platform,
                    s.started_at,
                    s.ended_at,
                    s.outcome,
                    COUNT(e.id) AS event_count,
                    COALESCE(MAX(e.ts), s.started_at) AS last_event_at,
                    COALESCE(SUM(CASE WHEN e.kind = 'llm_call'
                        THEN CAST(json_extract(e.payload_json, '$.prompt_tokens') AS INTEGER)
                        ELSE 0 END), 0) AS tokens_in,
                    COALESCE(SUM(CASE WHEN e.kind = 'llm_call'
                        THEN CAST(json_extract(e.payload_json, '$.completion_tokens') AS INTEGER)
                        ELSE 0 END), 0) AS tokens_out,
                    COALESCE(SUM(CASE WHEN e.kind = 'llm_call'
                        THEN CAST(json_extract(e.payload_json, '$.cost_usd') AS REAL)
                        ELSE 0 END), 0) AS cost_usd
                FROM sessions s
                LEFT JOIN events e ON e.session_id = s.session_id
                GROUP BY s.session_id
                ORDER BY last_event_at DESC
                LIMIT ? OFFSET ?
                """,
                (limit, offset),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def get_session(self, session_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                """
                SELECT
                    s.session_id,
                    s.stored_session_id,
                    s.parent_session_id,
                    s.title,
                    s.cwd,
                    s.model,
                    s.provider,
                    s.platform,
                    s.started_at,
                    s.ended_at,
                    s.outcome,
                    COUNT(e.id) AS event_count,
                    COALESCE(MAX(e.ts), s.started_at) AS last_event_at
                FROM sessions s
                LEFT JOIN events e ON e.session_id = s.session_id
                WHERE s.session_id = ?
                GROUP BY s.session_id
                """,
                (session_id,),
            ).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def list_events(
        self,
        session_id: str,
        *,
        after_seq: int | None = None,
        before_seq: int | None = None,
        limit: int = 200,
        kind: str | None = None,
    ) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            sql = "SELECT * FROM events WHERE session_id = ?"
            params: list[Any] = [session_id]
            if after_seq is not None:
                sql += " AND seq > ?"
                params.append(after_seq)
            if before_seq is not None:
                sql += " AND seq < ?"
                params.append(before_seq)
            if kind is not None:
                sql += " AND kind = ?"
                params.append(kind)
            sql += " ORDER BY seq ASC LIMIT ?"
            params.append(limit)
            rows = connection.execute(sql, params).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def list_turns(
        self,
        session_id: str,
        *,
        before_seq: int | None = None,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            rows = connection.execute(
                """
                WITH ranked AS (
                    SELECT id, seq, ts,
                           LAG(seq) OVER (ORDER BY seq DESC) AS next_seq
                    FROM events
                    WHERE session_id = ? AND kind = 'user_turn'
                ),
                anchors AS (
                    SELECT id, seq, ts, next_seq
                    FROM ranked
                    WHERE (? IS NULL OR seq < ?)
                    ORDER BY seq DESC
                    LIMIT ?
                ),
                stats AS (
                    SELECT a.id AS anchor_id,
                           COALESCE(MAX(e.seq), a.seq) AS seq_to,
                           COALESCE(MAX(e.ts), a.ts) AS last_ts,
                           COALESCE(
                               MAX(CASE WHEN e.kind = 'turn_end' THEN e.ts END),
                               COALESCE(MAX(e.ts), a.ts)
                           ) AS work_ts,
                           COUNT(e.id) AS event_count,
                           COALESCE(SUM(e.kind = 'tool_call'), 0) AS tool_calls,
                           COALESCE(SUM(e.kind = 'tool_result' AND e.status = 'error'), 0)
                               AS tool_errors,
                           COALESCE(SUM(e.kind = 'api_request'), 0) AS api_requests
                    FROM anchors a
                    LEFT JOIN events e
                        ON e.session_id = ?
                       AND e.seq >= a.seq
                       AND (a.next_seq IS NULL OR e.seq < a.next_seq)
                    GROUP BY a.id, a.seq, a.ts
                )
                SELECT ev.*, st.seq_to, st.last_ts, st.work_ts, st.event_count,
                       st.tool_calls, st.tool_errors, st.api_requests
                FROM stats st
                JOIN events ev ON ev.id = st.anchor_id
                ORDER BY st.seq_to DESC
                """,
                (session_id, before_seq, before_seq, limit, session_id),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def get_event(self, event_id: int) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def search_events(
        self,
        query: str,
        *,
        session_id: str | None = None,
        limit: int = 50,
        kind: str | None = None,
        tool_name: str | None = None,
    ) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            return _search_events(
                connection,
                query,
                session_id=session_id,
                limit=limit,
                kind=kind,
                tool_name=tool_name,
            )
        finally:
            connection.close()

    def get_snapshot(self, snapshot_id: int) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM snapshots WHERE id = ?",
                (snapshot_id,),
            ).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def session_metrics(self, session_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            return self._session_metrics(connection, session_id)
        finally:
            connection.close()

    def list_prunable_sessions(self, cutoff: float) -> list[str]:
        connection = self._connect()
        try:
            rows = connection.execute(
                """
                SELECT session_id FROM sessions
                WHERE ended_at IS NOT NULL AND ended_at < ?
                  AND session_id NOT IN (
                      SELECT parent_session_id FROM branches WHERE state IN ('prepared', 'running')
                  )
                  AND session_id NOT IN (
                      SELECT COALESCE(child_session_id, '') FROM branches
                      WHERE state IN ('prepared', 'running')
                  )
                ORDER BY ended_at ASC
                """,
                (cutoff,),
            ).fetchall()
            return [str(row["session_id"]) for row in rows]
        finally:
            connection.close()

    def list_snapshot_refs(self, session_ids: Sequence[str]) -> list[dict[str, Any]]:
        if not session_ids:
            return []
        connection = self._connect()
        try:
            placeholders = ",".join("?" for _ in session_ids)
            rows = connection.execute(
                f"SELECT repo_root, ref_name FROM snapshots WHERE session_id IN ({placeholders})",
                list(session_ids),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def list_snapshots(self, session_id: str) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            rows = connection.execute(
                "SELECT * FROM snapshots WHERE session_id = ? ORDER BY ts DESC",
                (session_id,),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def list_bookmarks(self, session_id: str) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            rows = connection.execute(
                "SELECT * FROM bookmarks WHERE session_id = ? ORDER BY created_at DESC",
                (session_id,),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def list_branches(self, parent_session_id: str) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            rows = connection.execute(
                "SELECT * FROM branches WHERE parent_session_id = ? ORDER BY created_at DESC",
                (parent_session_id,),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def list_abandoned_prepared(
        self, parent_session_id: str | None, older_than: float
    ) -> list[dict[str, Any]]:
        connection = self._connect()
        where = "state = 'prepared' AND updated_at < ?"
        params: list[Any] = [older_than]
        if parent_session_id is not None:
            where = f"parent_session_id = ? AND {where}"
            params.insert(0, parent_session_id)
        try:
            rows = connection.execute(
                f"SELECT * FROM branches WHERE {where} ORDER BY created_at ASC",
                tuple(params),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            connection.close()

    def get_branch(self, branch_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM branches WHERE id = ?",
                (branch_id,),
            ).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def get_run(self, branch_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM runs WHERE branch_id = ?",
                (branch_id,),
            ).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def count_branches_with_child(self, child_session_id: str) -> int:
        connection = self._connect()
        try:
            return int(
                connection.execute(
                    "SELECT COUNT(*) FROM branches WHERE child_session_id = ?",
                    (child_session_id,),
                ).fetchone()[0]
            )
        finally:
            connection.close()

    def get_branch_by_child(self, child_session_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM branches WHERE child_session_id = ? LIMIT 1",
                (child_session_id,),
            ).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def get_run_by_child(self, child_session_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                """
                SELECT r.* FROM runs r
                JOIN branches b ON b.id = r.branch_id
                WHERE b.child_session_id = ?
                ORDER BY r.updated_at DESC
                LIMIT 1
                """,
                (child_session_id,),
            ).fetchone()
            return dict(row) if row is not None else None
        finally:
            connection.close()

    def compare_sessions(
        self,
        left_session_id: str,
        right_session_id: str,
        *,
        left_before_ts: float | None = None,
    ) -> dict[str, Any]:
        connection = self._connect()
        try:
            left = self._session_metrics(connection, left_session_id, left_before_ts)
            right = self._session_metrics(connection, right_session_id)
            return {"left": left, "right": right}
        finally:
            connection.close()

    def _session_metrics(
        self,
        connection: sqlite3.Connection,
        session_id: str,
        before_ts: float | None = None,
    ) -> dict[str, Any] | None:
        summary = self.get_session(session_id)
        if summary is None:
            return None
        window = " AND ts <= ?" if before_ts is not None else ""
        params: list[Any] = [session_id]
        if before_ts is not None:
            params.append(before_ts)
        row = connection.execute(
            f"""
            SELECT
                COALESCE(SUM(CASE WHEN kind = 'llm_call'
                    THEN CAST(json_extract(payload_json, '$.prompt_tokens') AS INTEGER)
                    ELSE 0 END), 0) AS tokens_in,
                COALESCE(SUM(CASE WHEN kind = 'llm_call'
                    THEN CAST(json_extract(payload_json, '$.completion_tokens') AS INTEGER)
                    ELSE 0 END), 0) AS tokens_out,
                COALESCE(SUM(CASE WHEN kind = 'llm_call'
                    THEN CAST(json_extract(payload_json, '$.cost_usd') AS REAL)
                    ELSE 0 END), 0) AS cost_usd,
                COALESCE(SUM(CASE WHEN kind = 'tool_call' THEN 1 ELSE 0 END), 0) AS tool_calls,
                COALESCE(SUM(CASE WHEN kind = 'tool_result' AND status = 'error'
                    THEN 1 ELSE 0 END), 0) AS tool_errors
            FROM events
            WHERE session_id = ?{window}
            """,
            params,
        ).fetchone()
        first = connection.execute(
            f"SELECT ts FROM events WHERE session_id = ?{window} ORDER BY seq ASC LIMIT 1",
            params,
        ).fetchone()
        last = connection.execute(
            f"SELECT ts FROM events WHERE session_id = ?{window} ORDER BY seq DESC LIMIT 1",
            params,
        ).fetchone()
        duration_ms = 0.0
        if first is not None and last is not None:
            duration_ms = max(0.0, (float(last["ts"]) - float(first["ts"])) * 1000.0)
        metrics = dict(summary)
        if row is not None:
            metrics.update(
                {
                    "tokens_in": int(row["tokens_in"]),
                    "tokens_out": int(row["tokens_out"]),
                    "cost_usd": float(row["cost_usd"]),
                    "tool_calls": int(row["tool_calls"]),
                    "tool_errors": int(row["tool_errors"]),
                    "duration_ms": duration_ms,
                }
            )
        if before_ts is None:
            if metrics.get("outcome") is None:
                turn = connection.execute(
                    "SELECT payload_json FROM events "
                    "WHERE session_id = ? AND kind = 'turn_end' ORDER BY seq DESC LIMIT 1",
                    (session_id,),
                ).fetchone()
                if turn is not None:
                    metrics["outcome"] = last_turn_outcome(turn["payload_json"])
            return metrics
        boundary = connection.execute(
            "SELECT kind, payload_json FROM events "
            "WHERE session_id = ? AND ts <= ? AND kind IN ('session_end', 'turn_end') "
            "ORDER BY seq DESC LIMIT 1",
            (session_id, before_ts),
        ).fetchone()
        metrics["outcome"] = (
            last_turn_outcome(boundary["payload_json"]) if boundary is not None else None
        )
        metrics["ended_at"] = float(last["ts"]) if last is not None else None
        metrics["frozen_at"] = before_ts
        return metrics



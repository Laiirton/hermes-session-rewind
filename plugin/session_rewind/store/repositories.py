from __future__ import annotations

import re
import sqlite3
from collections.abc import Iterable
from typing import Any

from .db import Database, EventRecord


def _safe_fts_query(query: str) -> str:
    tokens = [token for token in re.split(r"\s+", query.strip()) if token]
    cleaned = [token.replace('"', "") for token in tokens]
    return " AND ".join(f'"{token}"' for token in cleaned if token)


class WriteStore:
    def __init__(self, connection: sqlite3.Connection) -> None:
        self._connection = connection

    def close(self) -> None:
        self._connection.close()

    def upsert_session(
        self,
        session_id: str,
        ts: float,
        *,
        stored_session_id: str | None = None,
        parent_session_id: str | None = None,
        title: str | None = None,
        cwd: str | None = None,
        model: str | None = None,
        provider: str | None = None,
        platform: str | None = None,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                INSERT INTO sessions (
                    session_id, stored_session_id, parent_session_id, title, cwd,
                    model, provider, platform, started_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    stored_session_id = COALESCE(
                        excluded.stored_session_id, sessions.stored_session_id
                    ),
                    parent_session_id = COALESCE(
                        excluded.parent_session_id, sessions.parent_session_id
                    ),
                    title = COALESCE(excluded.title, sessions.title),
                    cwd = COALESCE(excluded.cwd, sessions.cwd),
                    model = COALESCE(excluded.model, sessions.model),
                    provider = COALESCE(excluded.provider, sessions.provider),
                    platform = COALESCE(excluded.platform, sessions.platform)
                """,
                (
                    session_id,
                    stored_session_id,
                    parent_session_id,
                    title,
                    cwd,
                    model,
                    provider,
                    platform,
                    ts,
                ),
            )

    def append_events(self, events: Iterable[EventRecord]) -> list[int]:
        inserted: list[int] = []
        next_seq: dict[str, int] = {}
        with self._connection:
            for event in events:
                self._connection.execute(
                    "INSERT OR IGNORE INTO sessions (session_id, started_at) VALUES (?, ?)",
                    (event.session_id, event.ts),
                )
                seq = next_seq.get(event.session_id)
                if seq is None:
                    row = self._connection.execute(
                        "SELECT COALESCE(MAX(seq), 0) + 1 AS next_seq "
                        "FROM events WHERE session_id = ?",
                        (event.session_id,),
                    ).fetchone()
                    seq = int(row["next_seq"]) if row is not None else 1
                next_seq[event.session_id] = seq + 1
                cursor = self._connection.execute(
                    """
                    INSERT INTO events (
                        session_id, seq, ts, kind, turn_id, task_id, tool_call_id,
                        api_request_id, name, status, duration_ms, payload_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        event.session_id,
                        seq,
                        event.ts,
                        event.kind,
                        event.turn_id,
                        event.task_id,
                        event.tool_call_id,
                        event.api_request_id,
                        event.name,
                        event.status,
                        event.duration_ms,
                        event.payload_json,
                    ),
                )
                inserted.append(int(cursor.lastrowid or 0))
        return inserted

    def end_session(self, session_id: str, ts: float, outcome: str | None) -> None:
        with self._connection:
            self._connection.execute(
                "UPDATE sessions SET ended_at = ?, outcome = ? WHERE session_id = ?",
                (ts, outcome, session_id),
            )

    def add_snapshot(
        self,
        session_id: str,
        ts: float,
        repo_root: str,
        commit_sha: str,
        ref_name: str,
        fidelity: str,
        file_count: int,
        event_id: int | None = None,
    ) -> int:
        with self._connection:
            self._connection.execute(
                """
                INSERT OR IGNORE INTO snapshots (
                    session_id, event_id, ts, repo_root, commit_sha, ref_name,
                    fidelity, file_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (session_id, event_id, ts, repo_root, commit_sha, ref_name, fidelity, file_count),
            )
            row = self._connection.execute(
                "SELECT id FROM snapshots WHERE session_id = ? AND commit_sha = ?",
                (session_id, commit_sha),
            ).fetchone()
        if row is None:
            raise RuntimeError("snapshot insert failed")
        return int(row["id"])

    def create_branch(
        self,
        branch_id: str,
        parent_session_id: str,
        fork_before_ts: float,
        fork_row_count: int,
        snapshot_id: int | None,
        worktree_path: str | None,
        model: str | None,
        provider: str | None,
        prompt: str,
        verify_cmd: str | None,
        state: str,
        created_at: float,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                INSERT INTO branches (
                    id, parent_session_id, fork_before_ts, fork_row_count, snapshot_id,
                    worktree_path, model, provider, prompt, verify_cmd, state,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    branch_id,
                    parent_session_id,
                    fork_before_ts,
                    fork_row_count,
                    snapshot_id,
                    worktree_path,
                    model,
                    provider,
                    prompt,
                    verify_cmd,
                    state,
                    created_at,
                    created_at,
                ),
            )

    def set_branch_child(
        self,
        branch_id: str,
        child_session_id: str,
        child_stored_session_id: str | None,
        worktree_path: str | None,
        updated_at: float,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                UPDATE branches
                SET child_session_id = ?, child_stored_session_id = ?,
                    worktree_path = ?, state = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    child_session_id,
                    child_stored_session_id,
                    worktree_path,
                    "running",
                    updated_at,
                    branch_id,
                ),
            )

    def set_branch_state(self, branch_id: str, state: str, updated_at: float) -> None:
        with self._connection:
            self._connection.execute(
                "UPDATE branches SET state = ?, updated_at = ? WHERE id = ?",
                (state, updated_at, branch_id),
            )

    def upsert_run(
        self,
        branch_id: str,
        updated_at: float,
        *,
        tokens_in: int = 0,
        tokens_out: int = 0,
        cost_usd: float = 0.0,
        tool_calls: int = 0,
        tool_errors: int = 0,
        duration_ms: float = 0.0,
        verify_exit: int | None = None,
        verify_out: str | None = None,
        outcome_summary: str | None = None,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                INSERT INTO runs (
                    branch_id, tokens_in, tokens_out, cost_usd, tool_calls,
                    tool_errors, duration_ms, verify_exit, verify_out,
                    outcome_summary, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(branch_id) DO UPDATE SET
                    tokens_in = excluded.tokens_in,
                    tokens_out = excluded.tokens_out,
                    cost_usd = excluded.cost_usd,
                    tool_calls = excluded.tool_calls,
                    tool_errors = excluded.tool_errors,
                    duration_ms = excluded.duration_ms,
                    verify_exit = COALESCE(excluded.verify_exit, runs.verify_exit),
                    verify_out = COALESCE(excluded.verify_out, runs.verify_out),
                    outcome_summary = COALESCE(excluded.outcome_summary, runs.outcome_summary),
                    updated_at = excluded.updated_at
                """,
                (
                    branch_id,
                    tokens_in,
                    tokens_out,
                    cost_usd,
                    tool_calls,
                    tool_errors,
                    duration_ms,
                    verify_exit,
                    verify_out,
                    outcome_summary,
                    updated_at,
                ),
            )

    def update_branch_launch(
        self,
        branch_id: str,
        *,
        model: str | None,
        provider: str | None,
        prompt: str | None,
        updated_at: float,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                UPDATE branches SET
                    model = COALESCE(?, model),
                    provider = COALESCE(?, provider),
                    prompt = COALESCE(?, prompt),
                    updated_at = ?
                WHERE id = ?
                """,
                (model, provider, prompt, updated_at, branch_id),
            )

    def set_run_verify(
        self,
        branch_id: str,
        verify_exit: int | None,
        verify_out: str | None,
        updated_at: float,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                INSERT INTO runs (branch_id, verify_exit, verify_out, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(branch_id) DO UPDATE SET
                    verify_exit = excluded.verify_exit,
                    verify_out = excluded.verify_out,
                    updated_at = excluded.updated_at
                """,
                (branch_id, verify_exit, verify_out, updated_at),
            )

    def add_bookmark(
        self,
        session_id: str,
        event_id: int | None,
        label: str,
        note: str | None,
        created_at: float,
    ) -> int:
        with self._connection:
            cursor = self._connection.execute(
                """
                INSERT INTO bookmarks (session_id, event_id, label, note, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (session_id, event_id, label, note, created_at),
            )
        return int(cursor.lastrowid or 0)

    def delete_older_than(self, cutoff: float) -> int:
        with self._connection:
            cursor = self._connection.execute(
                "DELETE FROM sessions WHERE started_at < ?",
                (cutoff,),
            )
        return int(cursor.rowcount or 0)


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
            return {
                "sessions": int(sessions["count"]) if sessions is not None else 0,
                "events": int(events["count"]) if events is not None else 0,
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
            if kind is not None:
                sql += " AND kind = ?"
                params.append(kind)
            sql += " ORDER BY seq ASC LIMIT ?"
            params.append(limit)
            rows = connection.execute(sql, params).fetchall()
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
    ) -> list[dict[str, Any]]:
        fts_query = _safe_fts_query(query)
        if not fts_query:
            return []
        connection = self._connect()
        try:
            sql = (
                "SELECT e.* FROM events_fts f "
                "JOIN events e ON e.id = f.rowid "
                "WHERE events_fts MATCH ?"
            )
            params: list[Any] = [fts_query]
            if session_id is not None:
                sql += " AND e.session_id = ?"
                params.append(session_id)
            sql += " ORDER BY e.ts DESC LIMIT ?"
            params.append(limit)
            rows = connection.execute(sql, params).fetchall()
            return [dict(row) for row in rows]
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

    def compare_sessions(self, left_session_id: str, right_session_id: str) -> dict[str, Any]:
        connection = self._connect()
        try:
            left = self._session_metrics(connection, left_session_id)
            right = self._session_metrics(connection, right_session_id)
            return {"left": left, "right": right}
        finally:
            connection.close()

    def _session_metrics(
        self,
        connection: sqlite3.Connection,
        session_id: str,
    ) -> dict[str, Any] | None:
        summary = self.get_session(session_id)
        if summary is None:
            return None
        row = connection.execute(
            """
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
            WHERE session_id = ?
            """,
            (session_id,),
        ).fetchone()
        first = connection.execute(
            "SELECT ts FROM events WHERE session_id = ? ORDER BY seq ASC LIMIT 1",
            (session_id,),
        ).fetchone()
        last = connection.execute(
            "SELECT ts FROM events WHERE session_id = ? ORDER BY seq DESC LIMIT 1",
            (session_id,),
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
        return metrics

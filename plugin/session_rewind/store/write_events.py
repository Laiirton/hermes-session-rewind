from __future__ import annotations

import sqlite3
from collections.abc import Iterable, Sequence

from .db import EventRecord


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

    def has_session(self, session_id: str) -> bool:
        row = self._connection.execute(
            "SELECT 1 FROM sessions WHERE session_id = ?",
            (session_id,),
        ).fetchone()
        return row is not None

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

    def complete_child_branch(self, session_id: str, state: str, ts: float) -> None:
        with self._connection:
            self._connection.execute(
                """
                UPDATE branches SET state = ?, updated_at = ?
                WHERE id = (
                    SELECT id FROM branches
                    WHERE child_session_id = ? AND state IN ('prepared', 'running')
                    ORDER BY created_at DESC LIMIT 1
                )
                """,
                (state, ts, session_id),
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
        verify_cmd: str | None,
        updated_at: float,
    ) -> None:
        with self._connection:
            self._connection.execute(
                """
                UPDATE branches SET
                    model = COALESCE(?, model),
                    provider = COALESCE(?, provider),
                    prompt = COALESCE(?, prompt),
                    verify_cmd = COALESCE(?, verify_cmd),
                    updated_at = ?
                WHERE id = ?
                """,
                (model, provider, prompt, verify_cmd, updated_at, branch_id),
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
            if event_id is not None:
                owner = self._connection.execute(
                    "SELECT session_id FROM events WHERE id = ?", (event_id,)
                ).fetchone()
                if owner is not None and str(owner[0]) != session_id:
                    raise ValueError("that event belongs to another session")
            cursor = self._connection.execute(
                """
                INSERT INTO bookmarks (session_id, event_id, label, note, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (session_id, event_id, label, note, created_at),
            )
        return int(cursor.lastrowid or 0)

    def delete_sessions(self, session_ids: Sequence[str]) -> int:
        if not session_ids:
            return 0
        placeholders = ",".join("?" for _ in session_ids)
        with self._connection:
            cursor = self._connection.execute(
                f"DELETE FROM sessions WHERE session_id IN ({placeholders})",
                list(session_ids),
            )
        return int(cursor.rowcount or 0)



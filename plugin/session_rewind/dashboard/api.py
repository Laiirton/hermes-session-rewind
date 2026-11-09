from __future__ import annotations

import sqlite3
import time
from typing import Any

from fastapi import APIRouter, HTTPException, Path, Query

from ..fork.planner import ForkError, ForkRequest
from ..fork.service import build_fork_service
from ..metrics import compare_verdict
from ..serialization import event_detail, event_summary
from ..settings import Settings
from ..store.db import SQLITE_MAX_INT, Database
from ..store.repositories import ReadStore, WriteStore
from ..version import VERSION
from .models import (
    MAX_VERIFY_CMD_CHARS,
    VERIFY_CMD_PATTERN,
    BookmarkRequest,
    BookmarkResponse,
    BranchDetail,
    BranchSummary,
    CompareResponse,
    CompareSession,
    DiffEntry,
    EventDetail,
    EventPage,
    EventSummary,
    ForkCommitErrorResponse,
    ForkCommitRequest,
    ForkPlanResponse,
    ForkPrepareRequest,
    HealthResponse,
    RetentionPreviewResponse,
    RunSummary,
    SearchResponse,
    SessionPage,
    SessionSummary,
    SnapshotSummary,
    TurnPage,
    TurnSummary,
    VerifyResolveResponse,
    VerifyResponse,
    WorkspaceDiffResponse,
    WorkspaceStateResponse,
)

_BOOT_TIME = time.monotonic()


def create_router(database: Database, settings: Settings | None = None) -> APIRouter:
    router = APIRouter()
    _settings = settings or Settings()
    forks = build_fork_service(database, _settings)

    def read_store() -> ReadStore:
        return ReadStore(database)

    @router.get("/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        started = time.monotonic()
        try:
            counts = read_store().counts()
            db_bytes = 0
            try:
                db_path = database.path
                db_bytes = int(db_path.stat().st_size)
            except OSError:
                db_bytes = 0
        except (sqlite3.Error, OSError) as exc:
            raise HTTPException(status_code=503, detail="session store unavailable") from exc
        _ = started
        return HealthResponse(
            status="ok",
            version=VERSION,
            sessions=counts["sessions"],
            events=counts["events"],
            branches=counts["branches"],
            snapshots=counts["snapshots"],
            db_bytes=db_bytes,
            uptime_seconds=max(0.0, time.monotonic() - _BOOT_TIME),
        )

    @router.get("/sessions", response_model=SessionPage)
    def list_sessions(
        limit: int = Query(50, ge=1, le=200),
        offset: int = Query(0, ge=0, le=100000),
    ) -> SessionPage:
        rows = read_store().list_sessions(limit=limit, offset=offset)
        return SessionPage(
            items=[SessionSummary(**row) for row in rows],
            limit=limit,
            offset=offset,
        )

    @router.get("/sessions/{session_id}", response_model=SessionSummary)
    def get_session(session_id: str) -> SessionSummary:
        row = read_store().get_session(session_id)
        if row is None:
            raise HTTPException(status_code=404, detail="session not found")
        return SessionSummary(**row)

    @router.get("/sessions/{session_id}/events", response_model=EventPage)
    def list_events(
        session_id: str,
        after_seq: int | None = Query(None, ge=0, le=SQLITE_MAX_INT),
        before_seq: int | None = Query(None, ge=0, le=SQLITE_MAX_INT),
        limit: int = Query(200, ge=1, le=500),
        kind: str | None = Query(None, min_length=1, max_length=64),
    ) -> EventPage:
        rows = read_store().list_events(
            session_id,
            after_seq=after_seq,
            before_seq=before_seq,
            limit=limit + 1,
            kind=kind,
        )
        has_more = len(rows) > limit
        page = rows[:limit]
        items = [EventSummary(**event_summary(row)) for row in page]
        next_seq = int(page[-1]["seq"]) if has_more and page else None
        return EventPage(items=items, after_seq=next_seq, has_more=has_more)

    @router.get("/sessions/{session_id}/turns", response_model=TurnPage)
    def list_turns(
        session_id: str,
        before_seq: int | None = Query(None, ge=0, le=SQLITE_MAX_INT),
        limit: int = Query(40, ge=1, le=200),
    ) -> TurnPage:
        rows = read_store().list_turns(session_id, before_seq=before_seq, limit=limit + 1)
        has_more = len(rows) > limit
        page = rows[:limit]
        items = [_turn_summary(row) for row in page]
        cursor = int(page[-1]["seq"]) if has_more and page else None
        return TurnPage(items=items, before_seq=cursor, has_more=has_more)

    @router.get("/events/{event_id}", response_model=EventDetail)
    def get_event(event_id: int = Path(..., ge=0, le=SQLITE_MAX_INT)) -> EventDetail:
        row = read_store().get_event(event_id)
        if row is None:
            raise HTTPException(status_code=404, detail="event not found")
        return EventDetail(**event_detail(row))

    @router.get("/retention/preview", response_model=RetentionPreviewResponse)
    def retention_preview(days: float | None = Query(None, ge=0)) -> RetentionPreviewResponse:
        cutoff_days = days if days is not None else (settings.retention_days if settings else 30.0)
        cutoff = time.time() - (cutoff_days * 86400.0)
        store = read_store()
        session_ids = store.list_prunable_sessions(cutoff)
        return RetentionPreviewResponse(
            cutoff=cutoff, session_ids=session_ids, sessions=len(session_ids)
        )

    @router.get("/search", response_model=SearchResponse)
    def search(
        q: str = Query(..., min_length=1, max_length=200),
        session_id: str | None = Query(None),
        kind: str | None = Query(None),
        tool_name: str | None = Query(None),
        limit: int = Query(30, ge=1, le=100),
    ) -> SearchResponse:
        rows = read_store().search_events(
            q, session_id=session_id, kind=kind, tool_name=tool_name, limit=limit
        )
        return SearchResponse(
            query=q,
            items=[EventSummary(**event_summary(row)) for row in rows],
        )

    @router.get("/sessions/{session_id}/snapshots", response_model=list[SnapshotSummary])
    def list_snapshots(session_id: str) -> list[SnapshotSummary]:
        return [SnapshotSummary(**row) for row in read_store().list_snapshots(session_id)]

    @router.get("/sessions/{session_id}/branches", response_model=list[BranchSummary])
    def list_branches(session_id: str) -> list[BranchSummary]:
        return [BranchSummary(**row) for row in read_store().list_branches(session_id)]

    @router.get("/branches/{branch_id}", response_model=BranchDetail)
    def get_branch(branch_id: str) -> BranchDetail:
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(read_store(), detail[0], detail[1])

    @router.post("/branches/{branch_id}/reconcile", response_model=BranchDetail)
    def reconcile_branch(branch_id: str) -> BranchDetail:
        forks.reconcile(branch_id)
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(read_store(), detail[0], detail[1])

    @router.get("/branches/{branch_id}/verify-resolve", response_model=VerifyResolveResponse)
    def resolve_verify_command(
        branch_id: str,
        cmd: str = Query(
            ...,
            min_length=1,
            max_length=MAX_VERIFY_CMD_CHARS,
            pattern=VERIFY_CMD_PATTERN,
        ),
    ) -> VerifyResolveResponse:
        command = cmd.strip()
        if not command:
            raise HTTPException(status_code=422, detail="verify command is empty")
        try:
            resolved = forks.resolve_verify(branch_id, command)
        except ForkError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc
        return VerifyResolveResponse(command=command, resolved=resolved)

    @router.post("/forks/prepare", response_model=ForkPlanResponse)
    def prepare_fork(payload: ForkPrepareRequest) -> ForkPlanResponse:
        try:
            plan = forks.prepare(
                ForkRequest(
                    session_id=payload.session_id,
                    stored_session_id=payload.stored_session_id,
                    event_id=payload.event_id,
                    model=payload.model,
                    provider=payload.provider,
                    prompt=payload.prompt,
                    verify_cmd=payload.verify_cmd,
                )
            )
        except ForkError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return ForkPlanResponse(
            branch_id=plan.branch_id,
            parent_session_id=plan.parent_session_id,
            fork_before_ts=plan.fork_before_ts,
            fork_row_count=plan.fork_row_count,
            snapshot_id=plan.snapshot_id,
            snapshot_commit=plan.snapshot_commit,
            worktree_path=plan.worktree_path,
            repo_root=plan.repo_root,
            prompt=plan.prompt,
            model=plan.model,
            provider=plan.provider,
            verify_cmd=plan.verify_cmd,
            verify_timeout_seconds=plan.verify_timeout_seconds,
            fidelity=plan.fidelity,
            context_rows=plan.context_rows,
            verify_presets=list(plan.verify_presets),
        )

    @router.post("/forks/{branch_id}/commit", response_model=BranchDetail)
    def commit_fork(branch_id: str, payload: ForkCommitRequest) -> BranchDetail:
        try:
            forks.commit(
                branch_id,
                payload.child_session_id,
                payload.child_stored_session_id,
                payload.model,
                payload.provider,
                payload.prompt,
                payload.verify_cmd,
            )
        except ForkError as exc:
            if exc.reason == "child_already_claimed":
                raise HTTPException(
                    status_code=400,
                    detail=ForkCommitErrorResponse(
                        detail=str(exc),
                        reason=exc.reason,
                        claimed_branch_id=exc.claimed_branch_id,
                    ).model_dump(),
                ) from exc
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(read_store(), detail[0], detail[1])

    @router.post("/forks/{branch_id}/verify", response_model=VerifyResponse)
    def verify_fork(branch_id: str) -> VerifyResponse:
        try:
            result = forks.verify(branch_id)
        except ForkError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return VerifyResponse(
            exit_code=result.exit_code,
            output=result.output,
            duration_ms=result.duration_ms,
            timed_out=result.timed_out,
        )

    @router.get("/forks/{branch_id}/workspace", response_model=WorkspaceStateResponse)
    def workspace_state_fork(branch_id: str) -> WorkspaceStateResponse:
        try:
            worktree_path, uncommitted, orphan = forks.workspace_state(branch_id)
        except ForkError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return WorkspaceStateResponse(
            worktree_path=worktree_path, uncommitted=uncommitted, orphan_commits=orphan
        )

    @router.post("/forks/{branch_id}/cleanup", response_model=BranchDetail)
    def cleanup_fork(branch_id: str) -> BranchDetail:
        try:
            forks.cleanup(branch_id)
        except ForkError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(read_store(), detail[0], detail[1])

    @router.get("/sessions/{session_id}/bookmarks", response_model=list[BookmarkResponse])
    def list_bookmarks(session_id: str) -> list[BookmarkResponse]:
        return [
            BookmarkResponse(**row) for row in read_store().list_bookmarks(session_id)
        ]

    @router.post("/bookmarks", response_model=BookmarkResponse)
    def create_bookmark(payload: BookmarkRequest) -> BookmarkResponse:
        created_at = time.time()
        try:
            store = WriteStore(database.connect())
            try:
                bookmark_id = store.add_bookmark(
                    payload.session_id,
                    payload.event_id,
                    payload.label,
                    payload.note,
                    created_at,
                )
            finally:
                store.close()
        except sqlite3.IntegrityError as exc:
            raise HTTPException(status_code=404, detail="session or event not found") from exc
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        return BookmarkResponse(
            id=bookmark_id,
            session_id=payload.session_id,
            event_id=payload.event_id,
            label=payload.label,
            note=payload.note,
            created_at=created_at,
        )

    @router.get("/forks/{branch_id}/diff", response_model=WorkspaceDiffResponse)
    def workspace_diff(branch_id: str) -> WorkspaceDiffResponse:
        try:
            result = forks.workspace_diff(branch_id)
        except ForkError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return WorkspaceDiffResponse(
            branch_id=result["branch_id"],
            worktree_path=result["worktree_path"],
            stat=result["stat"],
            diff=[DiffEntry(**entry) for entry in result["diff"]],
        )

    @router.get("/compare", response_model=CompareResponse)
    def compare(
        left: str = Query(..., min_length=1),
        right: str = Query(..., min_length=1),
        before_ts: float | None = Query(None, ge=0),
    ) -> CompareResponse:
        store = read_store()
        comparison = store.compare_sessions(left, right, left_before_ts=before_ts)
        left_metrics = comparison.get("left")
        right_metrics = comparison.get("right")
        branch_id = None
        if isinstance(right_metrics, dict):
            run = store.get_run_by_child(right)
            if run is not None:
                right_metrics["verify_exit"] = run.get("verify_exit")
        # Diff between the two worktrees if the rerun branch is known.
        diff_entries: list[DiffEntry] = []
        diff_stat = ""
        try:
            branch_row = store.get_branch_by_child(right)
            if branch_row is not None:
                branch_id = str(branch_row["id"])
                diff_result = forks.workspace_diff(branch_id)
                diff_entries = [DiffEntry(**e) for e in diff_result["diff"]]
                diff_stat = diff_result["stat"]
        except Exception:
            diff_entries = []
            diff_stat = ""
        return CompareResponse(
            left=CompareSession(**left_metrics) if isinstance(left_metrics, dict) else None,
            right=CompareSession(**right_metrics) if isinstance(right_metrics, dict) else None,
            verdict=compare_verdict(
                left_metrics if isinstance(left_metrics, dict) else None,
                right_metrics if isinstance(right_metrics, dict) else None,
            ),
            diff=diff_entries,
            diff_stat=diff_stat,
        )

    return router


def _turn_summary(row: dict[str, Any]) -> TurnSummary:
    return TurnSummary(
        **event_summary(row),
        seq_to=int(row["seq_to"]),
        last_ts=float(row["last_ts"]),
        work_ts=float(row["work_ts"]),
        event_count=int(row["event_count"]),
        tool_calls=int(row["tool_calls"]),
        tool_errors=int(row["tool_errors"]),
        api_requests=int(row["api_requests"]),
    )


def _branch_detail(
    read: ReadStore, branch: dict[str, Any], run: dict[str, Any] | None
) -> BranchDetail:
    prompt = branch.get("prompt")
    child = branch.get("child_session_id")
    shared = isinstance(child, str) and child != "" and read.count_branches_with_child(child) > 1
    return BranchDetail(
        branch=BranchSummary(**branch),
        run=RunSummary(**run) if run is not None else None,
        prompt=prompt if isinstance(prompt, str) else None,
        shared_child=shared,
    )

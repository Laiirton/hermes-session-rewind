from __future__ import annotations

import sqlite3
import time
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from ..fork.planner import ForkError, ForkPlanner, ForkRequest
from ..fork.service import ForkService
from ..fork.verify import VerifyRunner, resolved_command
from ..gitrepo.shadow import GitShadow
from ..gitrepo.worktree import WorktreeManager
from ..metrics import compare_verdict
from ..serialization import event_detail, event_summary
from ..sessiondb.transcript import SessionDBTranscriptReader
from ..settings import Settings
from ..store.db import Database
from ..store.repositories import ReadStore, WriteStore
from ..version import VERSION
from .models import (
    BookmarkRequest,
    BookmarkResponse,
    BranchDetail,
    BranchSummary,
    CompareResponse,
    CompareSession,
    EventDetail,
    EventPage,
    EventSummary,
    ForkCommitRequest,
    ForkPlanResponse,
    ForkPrepareRequest,
    HealthResponse,
    RunSummary,
    SearchResponse,
    SessionPage,
    SessionSummary,
    SnapshotSummary,
    TurnPage,
    TurnSummary,
    VerifyResponse,
)


def create_router(database: Database, settings: Settings | None = None) -> APIRouter:
    router = APIRouter()
    _settings = settings or Settings()
    shadow = GitShadow()
    worktrees = WorktreeManager(shadow)
    planner = ForkPlanner(
        database,
        _settings,
        shadow,
        worktrees,
        SessionDBTranscriptReader(),
    )
    forks = ForkService(
        database,
        _settings,
        planner,
        VerifyRunner(),
        worktrees,
    )

    def read_store() -> ReadStore:
        return ReadStore(database)

    @router.get("/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        try:
            counts = read_store().counts()
        except (sqlite3.Error, OSError) as exc:
            raise HTTPException(status_code=503, detail="session store unavailable") from exc
        return HealthResponse(
            status="ok",
            version=VERSION,
            sessions=counts["sessions"],
            events=counts["events"],
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
        after_seq: int | None = Query(None, ge=0),
        before_seq: int | None = Query(None, ge=0),
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
        before_seq: int | None = Query(None, ge=0),
        limit: int = Query(40, ge=1, le=200),
    ) -> TurnPage:
        rows = read_store().list_turns(session_id, before_seq=before_seq, limit=limit + 1)
        has_more = len(rows) > limit
        page = rows[:limit]
        items = [_turn_summary(row) for row in page]
        cursor = int(page[-1]["seq"]) if has_more and page else None
        return TurnPage(items=items, before_seq=cursor, has_more=has_more)

    @router.get("/events/{event_id}", response_model=EventDetail)
    def get_event(event_id: int) -> EventDetail:
        row = read_store().get_event(event_id)
        if row is None:
            raise HTTPException(status_code=404, detail="event not found")
        return EventDetail(**event_detail(row))

    @router.get("/search", response_model=SearchResponse)
    def search(
        q: str = Query(..., min_length=1, max_length=200),
        session_id: str | None = Query(None),
        limit: int = Query(30, ge=1, le=100),
    ) -> SearchResponse:
        rows = read_store().search_events(q, session_id=session_id, limit=limit)
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
        forks.reconcile(branch_id)
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(detail[0], detail[1])

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
            verify_resolved=_resolved_verify(plan.verify_cmd, plan.worktree_path, plan.repo_root),
            verify_timeout_seconds=plan.verify_timeout_seconds,
            fidelity=plan.fidelity,
            context_rows=plan.context_rows,
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
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(detail[0], detail[1])

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

    @router.post("/forks/{branch_id}/cleanup", response_model=BranchDetail)
    def cleanup_fork(branch_id: str) -> BranchDetail:
        try:
            forks.cleanup(branch_id)
        except ForkError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        detail = forks.detail(branch_id)
        if detail is None:
            raise HTTPException(status_code=404, detail="branch not found")
        return _branch_detail(detail[0], detail[1])

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
        return BookmarkResponse(
            id=bookmark_id,
            session_id=payload.session_id,
            event_id=payload.event_id,
            label=payload.label,
            note=payload.note,
            created_at=created_at,
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
        if isinstance(right_metrics, dict):
            run = store.get_run_by_child(right)
            if run is not None:
                right_metrics["verify_exit"] = run.get("verify_exit")
        return CompareResponse(
            left=CompareSession(**left_metrics) if isinstance(left_metrics, dict) else None,
            right=CompareSession(**right_metrics) if isinstance(right_metrics, dict) else None,
            verdict=compare_verdict(
                left_metrics if isinstance(left_metrics, dict) else None,
                right_metrics if isinstance(right_metrics, dict) else None,
            ),
        )

    return router


def _resolved_verify(
    verify_cmd: str | None,
    worktree_path: str | None,
    repo_root: str | None,
) -> str | None:
    if verify_cmd is None:
        return None
    worktree = Path(worktree_path) if worktree_path else None
    fallbacks = (Path(repo_root),) if repo_root else ()
    return resolved_command(verify_cmd, worktree, fallbacks)


def _turn_summary(row: dict[str, Any]) -> TurnSummary:
    return TurnSummary(
        **event_summary(row),
        seq_to=int(row["seq_to"]),
        last_ts=float(row["last_ts"]),
        event_count=int(row["event_count"]),
        tool_calls=int(row["tool_calls"]),
        tool_errors=int(row["tool_errors"]),
        api_requests=int(row["api_requests"]),
    )


def _branch_detail(branch: dict[str, Any], run: dict[str, Any] | None) -> BranchDetail:
    prompt = branch.get("prompt")
    return BranchDetail(
        branch=BranchSummary(**branch),
        run=RunSummary(**run) if run is not None else None,
        prompt=prompt if isinstance(prompt, str) else None,
    )

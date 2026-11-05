from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    version: str
    sessions: int
    events: int


class SessionSummary(BaseModel):
    session_id: str
    stored_session_id: str | None = None
    parent_session_id: str | None = None
    title: str | None = None
    cwd: str | None = None
    model: str | None = None
    provider: str | None = None
    platform: str | None = None
    started_at: float
    ended_at: float | None = None
    outcome: str | None = None
    event_count: int = 0
    last_event_at: float | None = None
    tokens_in: int = 0
    tokens_out: int = 0
    cost_usd: float = 0.0


class SessionPage(BaseModel):
    items: list[SessionSummary]
    limit: int
    offset: int


class EventSummary(BaseModel):
    id: int
    session_id: str
    seq: int
    ts: float
    kind: str
    name: str | None = None
    status: str | None = None
    duration_ms: float | None = None
    turn_id: str | None = None
    tool_call_id: str | None = None
    api_request_id: str | None = None
    preview: str = ""


class EventDetail(EventSummary):
    task_id: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)


class EventPage(BaseModel):
    items: list[EventSummary]
    after_seq: int | None = None
    has_more: bool = False


class SearchResponse(BaseModel):
    query: str
    items: list[EventSummary]


class SnapshotSummary(BaseModel):
    id: int
    session_id: str
    event_id: int | None = None
    ts: float
    repo_root: str
    commit_sha: str
    ref_name: str
    fidelity: str
    file_count: int


class BranchSummary(BaseModel):
    id: str
    parent_session_id: str
    fork_before_ts: float
    fork_row_count: int
    snapshot_id: int | None = None
    child_session_id: str | None = None
    child_stored_session_id: str | None = None
    worktree_path: str | None = None
    model: str | None = None
    provider: str | None = None
    state: str
    created_at: float
    updated_at: float


class RunSummary(BaseModel):
    branch_id: str
    tokens_in: int = 0
    tokens_out: int = 0
    cost_usd: float = 0.0
    tool_calls: int = 0
    tool_errors: int = 0
    duration_ms: float = 0.0
    verify_exit: int | None = None
    verify_out: str | None = None
    outcome_summary: str | None = None
    updated_at: float


class BranchDetail(BaseModel):
    branch: BranchSummary
    run: RunSummary | None = None
    prompt: str | None = None


class CompareSession(SessionSummary):
    tool_calls: int = 0
    tool_errors: int = 0
    duration_ms: float = 0.0


class CompareResponse(BaseModel):
    left: CompareSession | None
    right: CompareSession | None
    verdict: str


class BookmarkRequest(BaseModel):
    session_id: str
    event_id: int | None = None
    label: str
    note: str | None = None


class BookmarkResponse(BaseModel):
    id: int
    session_id: str
    event_id: int | None = None
    label: str
    note: str | None = None
    created_at: float


class ForkPrepareRequest(BaseModel):
    session_id: str
    stored_session_id: str | None = None
    event_id: int
    model: str | None = None
    provider: str | None = None
    prompt: str | None = None
    verify_cmd: str | None = None


class ForkCommitRequest(BaseModel):
    child_session_id: str
    child_stored_session_id: str | None = None
    model: str | None = None
    provider: str | None = None
    prompt: str | None = None


class ForkPlanResponse(BaseModel):
    branch_id: str
    parent_session_id: str
    fork_before_ts: float
    fork_row_count: int
    snapshot_id: int | None = None
    snapshot_commit: str | None = None
    worktree_path: str | None = None
    prompt: str
    model: str | None = None
    provider: str | None = None
    verify_cmd: str | None = None
    verify_timeout_seconds: int
    fidelity: str
    context_rows: int | None = None


class VerifyResponse(BaseModel):
    exit_code: int | None
    output: str
    duration_ms: float
    timed_out: bool

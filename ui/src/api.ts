import type { PluginContext } from '@hermes/plugin-sdk';

export interface SessionSummary {
  session_id: string;
  stored_session_id: string | null;
  parent_session_id: string | null;
  title: string | null;
  cwd: string | null;
  model: string | null;
  provider: string | null;
  platform: string | null;
  started_at: number;
  ended_at: number | null;
  outcome: string | null;
  event_count: number;
  last_event_at: number | null;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
}

export interface SessionPage {
  items: SessionSummary[];
  limit: number;
  offset: number;
}

export interface EventSummary {
  id: number;
  session_id: string;
  seq: number;
  ts: number;
  kind: string;
  name: string | null;
  status: string | null;
  duration_ms: number | null;
  turn_id: string | null;
  tool_call_id: string | null;
  api_request_id: string | null;
  preview: string;
}

export interface EventDetail extends EventSummary {
  task_id: string | null;
  payload: Record<string, unknown>;
}

export interface EventPage {
  items: EventSummary[];
  after_seq: number | null;
  has_more: boolean;
}

export interface TurnSummary extends EventSummary {
  seq_to: number;
  last_ts: number;
  work_ts: number;
  event_count: number;
  tool_calls: number;
  tool_errors: number;
  api_requests: number;
}

export interface TurnPage {
  items: TurnSummary[];
  before_seq: number | null;
  has_more: boolean;
}

export interface SnapshotSummary {
  id: number;
  session_id: string;
  event_id: number | null;
  ts: number;
  repo_root: string;
  commit_sha: string;
  ref_name: string;
  fidelity: string;
  file_count: number;
}

export interface BranchSummary {
  id: string;
  parent_session_id: string;
  fork_before_ts: number;
  fork_row_count: number;
  snapshot_id: number | null;
  child_session_id: string | null;
  child_stored_session_id: string | null;
  worktree_path: string | null;
  model: string | null;
  provider: string | null;
  verify_cmd: string | null;
  state: string;
  created_at: number;
  updated_at: number;
}

export interface RunSummary {
  branch_id: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  tool_calls: number;
  tool_errors: number;
  duration_ms: number;
  verify_exit: number | null;
  verify_out: string | null;
  outcome_summary: string | null;
  updated_at: number;
}

export interface BranchDetail {
  branch: BranchSummary;
  run: RunSummary | null;
  prompt: string | null;
  shared_child: boolean;
}

export interface CompareSession extends SessionSummary {
  tool_calls: number;
  tool_errors: number;
  duration_ms: number;
  verify_exit: number | null;
  frozen_at: number | null;
}

export interface CompareResponse {
  left: CompareSession | null;
  right: CompareSession | null;
  verdict: string;
}

export interface ForkPrepareInput {
  session_id: string;
  stored_session_id: string | null;
  event_id: number;
  model: string | null;
  provider: string | null;
  prompt: string | null;
  verify_cmd: string | null;
}

export interface ForkPlan {
  branch_id: string;
  parent_session_id: string;
  fork_before_ts: number;
  fork_row_count: number;
  snapshot_id: number | null;
  snapshot_commit: string | null;
  worktree_path: string | null;
  prompt: string;
  model: string | null;
  provider: string | null;
  verify_cmd: string | null;
  verify_timeout_seconds: number;
  fidelity: string;
  context_rows: number | null;
  verify_presets: string[];
}

export interface ForkCommitInput {
  child_session_id: string;
  child_stored_session_id: string | null;
  model: string | null;
  provider: string | null;
  prompt: string | null;
  verify_cmd: string | null;
}

export interface VerifyResult {
  exit_code: number | null;
  output: string;
  duration_ms: number;
  timed_out: boolean;
}

export interface VerifyResolution {
  command: string;
  resolved: string | null;
}

function post<T>(ctx: PluginContext, path: string, body: unknown): Promise<T> {
  return ctx.rest<T>(path, { method: 'POST', body } as unknown as RequestInit);
}

export const SESSIONS_PAGE_LIMIT = 100;

export async function getSessions(ctx: PluginContext): Promise<SessionSummary[]> {
  const page = await ctx.rest<SessionPage>(`/sessions?limit=${SESSIONS_PAGE_LIMIT}`);
  return page.items;
}

export async function getTurns(
  ctx: PluginContext,
  sessionId: string,
  beforeSeq: number | null = null
): Promise<TurnPage> {
  const cursor = beforeSeq === null ? '' : `&before_seq=${beforeSeq}`;
  return ctx.rest<TurnPage>(`/sessions/${encodeURIComponent(sessionId)}/turns?limit=40${cursor}`);
}

export async function getTurnEvents(
  ctx: PluginContext,
  sessionId: string,
  seqFrom: number,
  seqTo: number
): Promise<EventSummary[]> {
  const page = await ctx.rest<EventPage>(
    `/sessions/${encodeURIComponent(sessionId)}/events` +
      `?limit=200&after_seq=${seqFrom - 1}&before_seq=${seqTo + 1}`
  );
  return page.items;
}

export function getEvent(ctx: PluginContext, eventId: number): Promise<EventDetail> {
  return ctx.rest<EventDetail>(`/events/${eventId}`);
}

export function getSnapshots(ctx: PluginContext, sessionId: string): Promise<SnapshotSummary[]> {
  return ctx.rest<SnapshotSummary[]>(`/sessions/${encodeURIComponent(sessionId)}/snapshots`);
}

export function getBranches(ctx: PluginContext, sessionId: string): Promise<BranchSummary[]> {
  return ctx.rest<BranchSummary[]>(`/sessions/${encodeURIComponent(sessionId)}/branches`);
}

export function reconcileBranch(ctx: PluginContext, branchId: string): Promise<BranchDetail> {
  return post<BranchDetail>(ctx, `/branches/${encodeURIComponent(branchId)}/reconcile`, {});
}

export function getCompare(
  ctx: PluginContext,
  left: string,
  right: string,
  beforeTs: number | null = null
): Promise<CompareResponse> {
  const frozen = beforeTs === null ? '' : `&before_ts=${beforeTs}`;
  return ctx.rest<CompareResponse>(
    `/compare?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}${frozen}`
  );
}

export function prepareFork(ctx: PluginContext, input: ForkPrepareInput): Promise<ForkPlan> {
  return post<ForkPlan>(ctx, '/forks/prepare', input);
}

export function commitFork(
  ctx: PluginContext,
  branchId: string,
  input: ForkCommitInput
): Promise<BranchDetail> {
  return post<BranchDetail>(ctx, `/forks/${encodeURIComponent(branchId)}/commit`, input);
}

export function verifyFork(ctx: PluginContext, branchId: string): Promise<VerifyResult> {
  return post<VerifyResult>(ctx, `/forks/${encodeURIComponent(branchId)}/verify`, {});
}

export function resolveVerify(
  ctx: PluginContext,
  branchId: string,
  command: string
): Promise<VerifyResolution> {
  return ctx.rest<VerifyResolution>(
    `/branches/${encodeURIComponent(branchId)}/verify-resolve?cmd=${encodeURIComponent(command)}`
  );
}

export function cleanupFork(ctx: PluginContext, branchId: string): Promise<BranchDetail> {
  return post<BranchDetail>(ctx, `/forks/${encodeURIComponent(branchId)}/cleanup`, {});
}

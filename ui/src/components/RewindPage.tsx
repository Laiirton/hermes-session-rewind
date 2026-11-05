import { host, useValue } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
  cleanupFork,
  getBranches,
  getCompare,
  getEvent,
  getSessions,
  getSnapshots,
  getTurnEvents,
  getTurns,
  reconcileBranch,
  SESSIONS_PAGE_LIMIT,
  verifyFork
} from '../api';
import type {
  BranchDetail,
  BranchSummary,
  CompareResponse,
  EventDetail,
  EventSummary,
  SessionSummary,
  SnapshotSummary,
  TurnSummary
} from '../api';
import {
  errorMessage,
  formatDuration,
  formatNumber,
  formatTime,
  frozenOutcome,
  outcomeLabel,
  openRecordingNote,
  plural,
  sessionsCountLabel,
  shortId,
  turnsEmptyMessage,
  verifyOutcome
} from '../format';
import { ForkDialog } from './ForkDialog';
import { mergeTurnPages } from '../mergeTurnPages';

interface ForkTarget {
  session: SessionSummary;
  event: EventSummary;
}

const PAGE_CSS = `
.rw-page :is(button, input, textarea, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ui-accent, #4f8cff);
  outline-offset: 1px;
}
.rw-page button:not(:disabled) {
  cursor: pointer;
}
.rw-page button:disabled {
  cursor: not-allowed;
}
`;

const TERMINAL_BRANCH_STATES = new Set(['done', 'failed', 'cleaned', 'discarded']);

function turnDuration(turn: TurnSummary): string {
  return formatDuration(Math.max(0, (turn.work_ts - turn.ts) * 1000));
}

function EventRow({
  event,
  selected,
  onSelect
}: {
  event: EventSummary;
  selected: boolean;
  onSelect: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${
        selected ? 'bg-white/5' : ''
      }`}
      onClick={onSelect}
    >
      <span
        title={event.kind}
        className={`w-20 shrink-0 truncate uppercase ${kindTone(event.kind, event.status)}`}
      >
        {kindLabel(event.kind)}
      </span>
      <span className="min-w-0 flex-1 truncate text-(--ui-text-tertiary)">
        {event.name ?? event.preview}
      </span>
      <span className="w-14 shrink-0 text-right font-mono">
        {formatDuration(event.duration_ms)}
      </span>
    </button>
  );
}

const COLLAPSED_KINDS = new Set(['api_request', 'llm_call']);

function TimelineRow({
  turn,
  expanded,
  events,
  loading,
  selectedEventId,
  onToggle,
  onFork,
  onSelectEvent
}: {
  turn: TurnSummary;
  expanded: boolean;
  events: EventSummary[] | null;
  loading: boolean;
  selectedEventId: number | null;
  onToggle: () => void;
  onFork: () => void;
  onSelectEvent: (event: EventSummary) => void;
}): ReactNode {
  const visible = (events ?? []).filter((event) => !COLLAPSED_KINDS.has(event.kind));
  const hidden = (events ?? []).length - visible.length;
  return (
    <div className="border-b border-(--ui-border) pb-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="w-3 shrink-0 text-xs text-(--ui-text-tertiary)" aria-hidden="true">
            {expanded ? '▾' : '▸'}
          </span>
          <span className="w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)">
            {formatTime(turn.ts)}
          </span>
          <span className="min-w-0 flex-1 truncate">{turn.preview || 'User turn'}</span>
          <span className="shrink-0 text-xs text-(--ui-text-tertiary)">
            {plural(turn.tool_calls, 'tool')}
          </span>
          {turn.tool_errors > 0 ? (
            <span className="shrink-0 text-xs text-red-500">
              {plural(turn.tool_errors, 'error')}
            </span>
          ) : null}
          <span className="w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)">
            {turnDuration(turn)}
          </span>
        </button>
        <button
          type="button"
          className="shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs"
          onClick={onFork}
        >
          Rewind
        </button>
      </div>
      {expanded ? (
        <div className="flex flex-col gap-0.5 pb-1">
          {loading ? (
            <div className="pl-19 text-xs text-(--ui-text-tertiary)">Loading events...</div>
          ) : (
            <>
              {visible.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  selected={selectedEventId === event.id}
                  onSelect={() => {
                    onSelectEvent(event);
                  }}
                />
              ))}
              {hidden > 0 ? (
                <div className="pl-19 text-xs text-(--ui-text-tertiary)">
                  {plural(turn.api_requests, 'model request')} ·{plural(turn.event_count, 'event')}{' '}
                  in this turn
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function kindLabel(kind: string): string {
  switch (kind) {
    case 'user_turn':
      return 'user';
    case 'assistant_response':
      return 'reply';
    case 'tool_call':
      return 'tool';
    case 'tool_result':
      return 'result';
    case 'api_request':
      return 'request';
    case 'llm_call':
      return 'usage';
    case 'session_start':
      return 'start';
    case 'session_end':
      return 'end';
    case 'compaction':
      return 'compact';
    case 'turn_end':
      return 'turn';
    case 'session_finalize':
      return 'finalize';
    case 'capture_dropped':
      return 'dropped';
    default:
      return kind;
  }
}

function kindTone(kind: string, status: string | null): string {
  if (kind === 'tool_result' && status === 'error') {
    return 'text-red-500';
  }
  if (kind === 'assistant_response' || kind === 'tool_result') {
    return 'text-emerald-500';
  }
  if (kind === 'user_turn') {
    return 'text-sky-500';
  }
  if (kind === 'tool_call') {
    return 'text-violet-500';
  }
  if (kind === 'api_request' || kind === 'llm_call') {
    return 'text-amber-500';
  }
  if (kind === 'compaction') {
    return 'text-fuchsia-500';
  }
  return 'text-(--ui-text-tertiary)';
}

function stateTone(state: string): string {
  if (state === 'done') {
    return 'text-emerald-500';
  }
  if (state === 'failed') {
    return 'text-red-500';
  }
  if (state === 'running') {
    return 'text-sky-500';
  }
  return 'text-(--ui-text-tertiary)';
}

function Metric({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-(--ui-text-tertiary)">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}

function Inspector({ detail }: { detail: EventDetail | null }): ReactNode {
  if (detail === null) {
    return (
      <div className="text-xs text-(--ui-text-tertiary)">
        Select an event to inspect its payload.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={`font-medium ${kindTone(detail.kind, detail.status)}`}>
          {kindLabel(detail.kind)}
        </span>
        <span className="font-mono text-(--ui-text-tertiary)">
          #{detail.id} · seq {detail.seq}
        </span>
      </div>
      <div className="text-xs text-(--ui-text-tertiary)">
        {detail.name ?? 'event'}
        {detail.status !== null ? ` · ${detail.status}` : ''}
        {detail.duration_ms !== null ? ` · ${formatDuration(detail.duration_ms)}` : ''}
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs">
        {JSON.stringify(detail.payload, null, 2)}
      </pre>
    </div>
  );
}

function ComparePanel({
  ctx,
  branchId,
  refreshTick,
  onClose,
  onRefresh
}: {
  ctx: PluginContext;
  branchId: string;
  refreshTick: number;
  onClose: () => void;
  onRefresh: () => void;
}): ReactNode {
  const [detail, setDetail] = useState<BranchDetail | null>(null);
  const [compare, setCompare] = useState<CompareResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let disposeNext: (() => void) | null = null;

    const load = async (): Promise<boolean> => {
      try {
        const branch = await reconcileBranch(ctx, branchId);
        if (cancelled) {
          return true;
        }
        setDetail(branch);
        setError(null);
        const child = branch.branch.child_session_id;
        if (child !== null) {
          const result = await getCompare(
            ctx,
            branch.branch.parent_session_id,
            child,
            branch.branch.fork_before_ts
          );
          if (!cancelled) {
            setCompare(result);
          }
        } else {
          setCompare(null);
        }
        return TERMINAL_BRANCH_STATES.has(branch.branch.state);
      } catch (caught) {
        if (!cancelled) {
          setError(errorMessage(caught));
        }
        return false;
      }
    };

    const tick = async (): Promise<void> => {
      const terminal = await load();
      if (!cancelled && !terminal) {
        disposeNext = ctx.setTimeout(() => {
          void tick();
        }, 2500);
      }
    };

    void tick();
    return (): void => {
      cancelled = true;
      if (disposeNext !== null) {
        disposeNext();
      }
    };
  }, [ctx, branchId, refreshTick]);

  const verify = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await verifyFork(ctx, branchId);
      onRefresh();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const cleanup = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await cleanupFork(ctx, branchId);
      onRefresh();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  if (detail === null) {
    return <div className="text-xs text-(--ui-text-tertiary)">Loading branch...</div>;
  }

  const branch = detail.branch;
  const run = detail.run;
  const rerunVerifyExit = run?.verify_exit ?? compare?.right?.verify_exit ?? null;
  const verifyBlock = !branch.verify_cmd
    ? 'No verify command was recorded for this branch.'
    : !branch.worktree_path
      ? 'The workspace of this branch was cleaned.'
      : undefined;
  const cleanupBlock = branch.worktree_path
    ? undefined
    : 'This branch has no workspace left to remove.';
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">Branch {shortId(branch.id)}</span>
          <span className={`uppercase ${stateTone(branch.state)}`}>{branch.state}</span>
          {run !== null && run.verify_exit !== null ? (
            <span className={run.verify_exit === 0 ? 'text-emerald-500' : 'text-red-500'}>
              verify {verifyOutcome(run.verify_exit)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50"
            title={verifyBlock}
            onClick={() => {
              void verify();
            }}
            disabled={busy || !branch.verify_cmd || !branch.worktree_path}
          >
            Verify
          </button>
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50"
            title={cleanupBlock}
            onClick={() => {
              void cleanup();
            }}
            disabled={busy || !branch.worktree_path}
          >
            Cleanup
          </button>
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1"
            onClick={onClose}
          >
            Hide
          </button>
        </div>
      </div>

      {detail.shared_child ? (
        <div className="rounded border border-amber-600/40 bg-amber-500/5 p-2 text-xs text-(--ui-text)">
          Another branch claims this same rerun session, so the numbers below may describe a
          different fork. It was recorded before the session-id fix.
        </div>
      ) : null}

      {error !== null ? <div className="text-xs text-red-500">{error}</div> : null}

      {compare !== null ? (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded border border-(--ui-border) p-2">
            <div className="mb-1 text-(--ui-text-tertiary)">
              Original
              {compare.left?.frozen_at ? ` · frozen ${formatTime(compare.left.frozen_at)}` : ''}
            </div>
            <Metric
              label="outcome"
              value={compare.left === null ? 'not recorded' : frozenOutcome(compare.left.outcome)}
            />
            <Metric
              label="tokens"
              value={
                compare.left === null
                  ? 'n/a'
                  : formatNumber(compare.left.tokens_in + compare.left.tokens_out)
              }
            />
            <Metric
              label="tool errors"
              value={compare.left === null ? 'n/a' : String(compare.left.tool_errors)}
            />
          </div>
          <div className="rounded border border-(--ui-border) p-2">
            <div className="mb-1 text-(--ui-text-tertiary)">Rerun</div>
            <Metric
              label="outcome"
              value={compare.right === null ? 'not recorded' : outcomeLabel(compare.right.outcome)}
            />
            <Metric
              label="verify"
              value={rerunVerifyExit === null ? 'not run' : verifyOutcome(rerunVerifyExit)}
            />
            <Metric
              label="tokens"
              value={
                compare.right === null
                  ? 'n/a'
                  : formatNumber(compare.right.tokens_in + compare.right.tokens_out)
              }
            />
            <Metric
              label="tool errors"
              value={compare.right === null ? 'n/a' : String(compare.right.tool_errors)}
            />
          </div>
          <div className="col-span-2 text-(--ui-text-tertiary)">Verdict: {compare.verdict}</div>
        </div>
      ) : (
        <div className="text-xs text-(--ui-text-tertiary)">
          {branch.state === 'cleaned' || branch.state === 'discarded'
            ? 'The rerun never started, and its workspace is gone.'
            : 'Waiting for the rerun to start.'}
        </div>
      )}

      {run !== null && run.verify_out ? (
        <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs">
          {run.verify_out}
        </pre>
      ) : null}

      {detail.prompt !== null ? (
        <details className="text-xs text-(--ui-text-tertiary)">
          <summary>Prompt</summary>
          <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs">
            {detail.prompt}
          </pre>
        </details>
      ) : null}
    </div>
  );
}

export function RewindPage({ ctx }: { ctx: PluginContext }): ReactNode {
  const activeSessionId = useValue(host.state.activeSessionId);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<TurnSummary[]>([]);
  const [turnsHasMore, setTurnsHasMore] = useState(false);
  const [turnsLoading, setTurnsLoading] = useState(false);
  const [expandedTurnId, setExpandedTurnId] = useState<number | null>(null);
  const [turnEvents, setTurnEvents] = useState<Record<number, EventSummary[]>>({});
  const [snapshots, setSnapshots] = useState<SnapshotSummary[]>([]);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [detail, setDetail] = useState<EventDetail | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [forkTarget, setForkTarget] = useState<ForkTarget | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [liveTick, setLiveTick] = useState(0);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [turnsLoaded, setTurnsLoaded] = useState(false);
  const [turnsError, setTurnsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelTimer: (() => void) | null = null;
    const stop = ctx.onEvent('*', () => {
      if (cancelTimer !== null) {
        return;
      }
      cancelTimer = ctx.setTimeout(() => {
        cancelTimer = null;
        setLiveTick((value) => value + 1);
      }, 1500);
    });
    return (): void => {
      stop();
      if (cancelTimer !== null) {
        cancelTimer();
      }
    };
  }, [ctx]);

  useEffect(() => {
    if (selectedBranchId === null || forkTarget !== null) {
      return;
    }
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setSelectedBranchId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return (): void => {
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedBranchId, forkTarget]);

  useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const items = await getSessions(ctx);
        if (cancelled) {
          return;
        }
        setSessions(items);
        setSessionsLoaded(true);
        setError(null);
        setSelectedSessionId((current) => {
          if (current !== null && items.some((item) => item.session_id === current)) {
            return current;
          }
          return activeSessionId ?? items[0]?.session_id ?? null;
        });
      } catch (caught) {
        if (!cancelled) {
          setError(errorMessage(caught));
        }
      }
    };
    void load();
    const dispose = ctx.setInterval(() => {
      void load();
    }, 10000);
    return (): void => {
      cancelled = true;
      dispose();
    };
  }, [ctx, activeSessionId, refreshTick, liveTick]);

  useEffect(() => {
    if (selectedSessionId === null) {
      setTurns([]);
      setTurnsLoaded(false);
      setTurnsHasMore(false);
      setTurnsError(null);
      setSnapshots([]);
      setBranches([]);
      return;
    }
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const [turnPage, snapshotItems, branchItems] = await Promise.all([
          getTurns(ctx, selectedSessionId),
          getSnapshots(ctx, selectedSessionId),
          getBranches(ctx, selectedSessionId)
        ]);
        if (cancelled) {
          return;
        }
        setTurns((current) => mergeTurnPages(selectedSessionId, turnPage.items, current));
        setTurnsHasMore(turnPage.has_more);
        setTurnsLoaded(true);
        setSnapshots(snapshotItems);
        setBranches(branchItems);
        setTurnsError(null);
        setError(null);
      } catch (caught) {
        if (!cancelled) {
          setTurnsLoaded(true);
          setTurnsError(errorMessage(caught));
        }
      }
    };
    void load();
    const dispose = ctx.setInterval(() => {
      void load();
    }, 10000);
    return (): void => {
      cancelled = true;
      dispose();
    };
  }, [ctx, selectedSessionId, refreshTick, liveTick]);

  useEffect(() => {
    if (selectedEventId === null) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    void getEvent(ctx, selectedEventId)
      .then((item) => {
        if (!cancelled) {
          setDetail(item);
        }
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(errorMessage(caught));
        }
      });
    return (): void => {
      cancelled = true;
    };
  }, [ctx, selectedEventId]);

  const selectedSession = sessions.find((item) => item.session_id === selectedSessionId) ?? null;
  const running = selectedSession !== null && selectedSession.ended_at === null;
  const live = running && selectedSession.session_id === activeSessionId;
  const visibleTurns =
    selectedSessionId === null ? [] : turns.filter((turn) => turn.session_id === selectedSessionId);

  const selectSession = (session: SessionSummary): void => {
    setSelectedSessionId(session.session_id);
    setSelectedEventId(null);
    setSelectedBranchId(null);
    setExpandedTurnId(null);
    setTurnEvents({});
    setTurns([]);
    setTurnsLoaded(false);
    setTurnsHasMore(false);
    setTurnsError(null);
    setSnapshots([]);
    setBranches([]);
  };

  const refresh = (): void => {
    setRefreshTick((value) => value + 1);
  };

  const toggleTurn = (turn: TurnSummary): void => {
    if (expandedTurnId === turn.id) {
      setExpandedTurnId(null);
      return;
    }
    setExpandedTurnId(turn.id);
    if (turnEvents[turn.id] !== undefined) {
      return;
    }
    void getTurnEvents(ctx, turn.session_id, turn.seq, turn.seq_to)
      .then((items) => {
        setTurnEvents((current) => ({ ...current, [turn.id]: items }));
      })
      .catch((caught: unknown) => {
        setError(errorMessage(caught));
      });
  };

  const loadEarlier = async (): Promise<void> => {
    const oldest = visibleTurns[visibleTurns.length - 1];
    if (selectedSessionId === null || oldest === undefined) {
      return;
    }
    setTurnsLoading(true);
    try {
      const page = await getTurns(ctx, selectedSessionId, oldest.seq);
      setTurns((current) => mergeTurnPages(selectedSessionId, page.items, current));
      setTurnsHasMore(page.has_more);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setTurnsLoading(false);
    }
  };

  return (
    <div className="rw-page flex h-full flex-col gap-3 p-3 text-sm">
      <style>{PAGE_CSS}</style>
      <header className="flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2">
        <div>
          <div className="text-base font-medium">Session Rewind</div>
          <div className="text-xs text-(--ui-text-tertiary)">
            Recorded locally. Fork a user turn, rerun it, and compare outcomes.
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {selectedSession !== null ? (
            <span className="text-(--ui-text-tertiary)">
              {selectedSession.model ?? 'unknown model'}
            </span>
          ) : null}
          {running ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {live ? 'live' : 'running'}
            </span>
          ) : null}
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1"
            onClick={refresh}
          >
            Refresh
          </button>
        </div>
      </header>

      {error !== null ? <div className="text-xs text-red-500">{error}</div> : null}

      <div className="flex min-h-0 flex-1 gap-3">
        <aside className="flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2">
          <div className="flex flex-col gap-1">
            <div className="text-xs uppercase text-(--ui-text-tertiary)">
              Sessions
              {sessionsLoaded ? (
                <span className="ml-1">
                  {sessionsCountLabel(sessions.length, SESSIONS_PAGE_LIMIT)}
                </span>
              ) : null}
            </div>
            {!sessionsLoaded ? (
              <div className="text-xs text-(--ui-text-tertiary)">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-xs text-(--ui-text-tertiary)">
                Start a chat and Rewind will record every turn.
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  type="button"
                  key={session.session_id}
                  className={`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${
                    selectedSessionId === session.session_id
                      ? 'border-(--ui-accent)'
                      : 'border-(--ui-border)'
                  }`}
                  onClick={() => {
                    selectSession(session);
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        session.ended_at === null ? 'bg-emerald-500' : 'bg-(--ui-text-tertiary)'
                      }`}
                    />
                    <span className="truncate font-medium">
                      {session.title ?? shortId(session.session_id)}
                    </span>
                  </span>
                  <span className="truncate text-(--ui-text-tertiary)">
                    {session.model ?? 'unknown model'} · {plural(session.event_count, 'event')}
                  </span>
                  <span className="truncate text-(--ui-text-tertiary)">
                    {outcomeLabel(session.outcome)} ·{' '}
                    {formatNumber(session.tokens_in + session.tokens_out)} tokens
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-2">
          {selectedSession !== null ? (
            <div className="flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">
                    {selectedSession.title ?? shortId(selectedSession.session_id)}
                  </span>
                  {snapshots.length > 0 ? (
                    <span className="text-xs text-(--ui-text-tertiary)">
                      {plural(snapshots.length, 'snapshot')}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-(--ui-text-tertiary)">
                  {selectedSession.model ?? 'unknown model'} ·{' '}
                  {plural(selectedSession.event_count, 'event')} ·{' '}
                  {formatNumber(selectedSession.tokens_in + selectedSession.tokens_out)} tokens
                  {selectedSession.ended_at === null
                    ? ` · ${openRecordingNote(selectedSession.last_event_at)}`
                    : ''}
                </div>
              </div>
              <div className="text-right text-xs text-(--ui-text-tertiary)">
                Select a user turn and choose Rewind.
              </div>
            </div>
          ) : null}

          {branches.length > 0 ? (
            <div className="flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto">
              <span className="text-xs uppercase text-(--ui-text-tertiary)">Branches</span>
              <span className="text-xs text-(--ui-text-tertiary)">{branches.length}</span>
              {branches.map((branch) => (
                <button
                  type="button"
                  key={branch.id}
                  className={`flex items-center gap-2 rounded border px-2 py-1 text-xs ${
                    selectedBranchId === branch.id ? 'border-(--ui-accent)' : 'border-(--ui-border)'
                  }`}
                  onClick={() => {
                    setSelectedBranchId(branch.id);
                  }}
                >
                  <span className="font-mono">{shortId(branch.id)}</span>
                  <span className={`uppercase ${stateTone(branch.state)}`}>{branch.state}</span>
                  <span className="text-(--ui-text-tertiary)">
                    {branch.fork_row_count > 0
                      ? plural(branch.fork_row_count, 'message')
                      : 'context pack'}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 gap-2">
            <div className="min-w-0 flex-1 overflow-auto">
              {selectedSession === null ? (
                <div className="text-xs text-(--ui-text-tertiary)">Select a recorded session.</div>
              ) : !turnsLoaded ? (
                <div className="text-xs text-(--ui-text-tertiary)">Loading turns...</div>
              ) : visibleTurns.length === 0 ? (
                <div className="text-xs text-(--ui-text-tertiary)">
                  {turnsEmptyMessage(selectedSession.event_count, turnsError)}
                </div>
              ) : (
                <>
                  {visibleTurns.map((turn) => (
                    <TimelineRow
                      key={turn.id}
                      turn={turn}
                      expanded={expandedTurnId === turn.id}
                      events={turnEvents[turn.id] ?? null}
                      loading={expandedTurnId === turn.id && turnEvents[turn.id] === undefined}
                      selectedEventId={selectedEventId}
                      onToggle={() => {
                        toggleTurn(turn);
                      }}
                      onFork={() => {
                        if (selectedSession !== null) {
                          setForkTarget({ session: selectedSession, event: turn });
                        }
                      }}
                      onSelectEvent={(event) => {
                        setSelectedEventId(event.id);
                      }}
                    />
                  ))}
                  {turnsHasMore ? (
                    <button
                      type="button"
                      className="mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)"
                      onClick={() => {
                        void loadEarlier();
                      }}
                      disabled={turnsLoading}
                    >
                      {turnsLoading ? 'Loading...' : 'Load earlier turns'}
                    </button>
                  ) : (
                    <div className="mt-2 text-xs text-(--ui-text-tertiary)">
                      {plural(visibleTurns.length, 'turn')} · start of the recording
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2">
              <Inspector detail={detail} />
            </div>
          </div>
        </main>
      </div>

      {selectedBranchId !== null ? (
        <div className="max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2">
          <ComparePanel
            ctx={ctx}
            branchId={selectedBranchId}
            refreshTick={refreshTick}
            onClose={() => {
              setSelectedBranchId(null);
            }}
            onRefresh={refresh}
          />
        </div>
      ) : null}

      {forkTarget !== null ? (
        <ForkDialog
          ctx={ctx}
          session={forkTarget.session}
          event={forkTarget.event}
          onClose={() => {
            setForkTarget(null);
          }}
          onCreated={(branchId) => {
            setSelectedBranchId(branchId);
            refresh();
          }}
        />
      ) : null}
    </div>
  );
}

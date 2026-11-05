import { host, useValue } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
  cleanupFork,
  getBranch,
  getBranches,
  getCompare,
  getEvent,
  getEvents,
  getSessions,
  getSnapshots,
  verifyFork
} from '../api';
import type {
  BranchDetail,
  BranchSummary,
  CompareResponse,
  EventDetail,
  EventSummary,
  SessionSummary,
  SnapshotSummary
} from '../api';
import {
  errorMessage,
  formatDuration,
  formatNumber,
  formatTime,
  shortId
} from '../format';
import { ForkDialog } from './ForkDialog';

interface ForkTarget {
  session: SessionSummary;
  event: EventSummary;
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

function EventRow({
  event,
  selected,
  onSelect,
  onFork
}: {
  event: EventSummary;
  selected: boolean;
  onSelect: () => void;
  onFork: () => void;
}): ReactNode {
  return (
    <div
      className={`flex items-start gap-2 border-b border-(--ui-border) px-2 py-1.5 ${
        selected ? 'bg-white/5' : ''
      }`}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-2 text-left"
        onClick={onSelect}
      >
        <span className="w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)">
          {formatTime(event.ts)}
        </span>
        <span className={`w-20 shrink-0 text-xs uppercase ${kindTone(event.kind, event.status)}`}>
          {kindLabel(event.kind)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate">{event.name ?? (event.preview || event.kind)}</span>
          {event.name !== null && event.preview ? (
            <span className="block truncate text-xs text-(--ui-text-tertiary)">
              {event.preview}
            </span>
          ) : null}
        </span>
        <span className="w-16 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)">
          {formatDuration(event.duration_ms)}
        </span>
      </button>
      {event.kind === 'user_turn' ? (
        <button
          type="button"
          className="rounded border border-(--ui-border) px-2 py-0.5 text-xs"
          onClick={onFork}
        >
          Rewind
        </button>
      ) : null}
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
    const load = async (): Promise<void> => {
      try {
        const branch = await getBranch(ctx, branchId);
        if (cancelled) {
          return;
        }
        setDetail(branch);
        setError(null);
        const child = branch.branch.child_session_id;
        if (child !== null) {
          const result = await getCompare(ctx, branch.branch.parent_session_id, child);
          if (!cancelled) {
            setCompare(result);
          }
        } else {
          setCompare(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(errorMessage(caught));
        }
      }
    };
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">Branch {shortId(branch.id)}</span>
          <span className={`uppercase ${stateTone(branch.state)}`}>{branch.state}</span>
          {run !== null && run.verify_exit !== null ? (
            <span className={run.verify_exit === 0 ? 'text-emerald-500' : 'text-red-500'}>
              verify: {run.verify_exit}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50"
            onClick={() => {
              void verify();
            }}
            disabled={busy}
          >
            Verify
          </button>
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50"
            onClick={() => {
              void cleanup();
            }}
            disabled={busy || branch.state === 'cleaned'}
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

      {error !== null ? <div className="text-xs text-red-500">{error}</div> : null}

      {compare !== null ? (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded border border-(--ui-border) p-2">
            <div className="mb-1 text-(--ui-text-tertiary)">Original</div>
            <Metric label="outcome" value={compare.left?.outcome ?? 'unknown'} />
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
            <Metric label="outcome" value={compare.right?.outcome ?? 'running'} />
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
        <div className="text-xs text-(--ui-text-tertiary)">Waiting for the rerun to start.</div>
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
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotSummary[]>([]);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [detail, setDetail] = useState<EventDetail | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [forkTarget, setForkTarget] = useState<ForkTarget | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const items = await getSessions(ctx);
        if (cancelled) {
          return;
        }
        setSessions(items);
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
    const timer = window.setInterval(() => {
      void load();
    }, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [ctx, activeSessionId, refreshTick]);

  useEffect(() => {
    if (selectedSessionId === null) {
      setEvents([]);
      setSnapshots([]);
      setBranches([]);
      return;
    }
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const [eventItems, snapshotItems, branchItems] = await Promise.all([
          getEvents(ctx, selectedSessionId),
          getSnapshots(ctx, selectedSessionId),
          getBranches(ctx, selectedSessionId)
        ]);
        if (cancelled) {
          return;
        }
        setEvents(eventItems);
        setSnapshots(snapshotItems);
        setBranches(branchItems);
        setError(null);
      } catch (caught) {
        if (!cancelled) {
          setError(errorMessage(caught));
        }
      }
    };
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [ctx, selectedSessionId, refreshTick]);

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
    return () => {
      cancelled = true;
    };
  }, [ctx, selectedEventId]);

  const selectedSession =
    sessions.find((item) => item.session_id === selectedSessionId) ?? null;
  const live =
    selectedSession !== null &&
    selectedSession.ended_at === null &&
    selectedSession.session_id === activeSessionId;

  const selectSession = (session: SessionSummary): void => {
    setSelectedSessionId(session.session_id);
    setSelectedEventId(null);
    setSelectedBranchId(null);
  };

  const refresh = (): void => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <div className="flex h-full flex-col gap-3 p-3 text-sm">
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
          {live ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              live
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
            <div className="text-xs uppercase text-(--ui-text-tertiary)">Sessions</div>
            {sessions.length === 0 ? (
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
                        session.ended_at === null
                          ? 'bg-emerald-500'
                          : 'bg-(--ui-text-tertiary)'
                      }`}
                    />
                    <span className="truncate font-medium">
                      {session.title ?? shortId(session.session_id)}
                    </span>
                  </span>
                  <span className="truncate text-(--ui-text-tertiary)">
                    {session.model ?? 'unknown model'} · {session.event_count} events
                  </span>
                  <span className="text-(--ui-text-tertiary)">
                    {session.outcome ?? 'recording'} ·{' '}
                    {formatNumber(session.tokens_in + session.tokens_out)} tokens
                  </span>
                </button>
              ))
            )}
          </div>

          {branches.length > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="text-xs uppercase text-(--ui-text-tertiary)">Branches</div>
              {branches.map((branch) => (
                <button
                  type="button"
                  key={branch.id}
                  className={`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${
                    selectedBranchId === branch.id
                      ? 'border-(--ui-accent)'
                      : 'border-(--ui-border)'
                  }`}
                  onClick={() => {
                    setSelectedBranchId(branch.id);
                  }}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono">{shortId(branch.id)}</span>
                    <span className={`uppercase ${stateTone(branch.state)}`}>
                      {branch.state}
                    </span>
                  </span>
                  <span className="truncate text-(--ui-text-tertiary)">
                    {branch.model ?? 'same model'} · {branch.fork_row_count} rows
                  </span>
                </button>
              ))}
            </div>
          ) : null}
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
                      {snapshots.length} snapshots
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-(--ui-text-tertiary)">
                  {selectedSession.model ?? 'unknown model'} · {events.length} events ·{' '}
                  {formatNumber(selectedSession.tokens_in + selectedSession.tokens_out)} tokens
                </div>
              </div>
              <div className="text-right text-xs text-(--ui-text-tertiary)">
                Select a user turn and choose Rewind.
              </div>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 gap-2">
            <div className="min-w-0 flex-1 overflow-auto">
              {selectedSession === null ? (
                <div className="text-xs text-(--ui-text-tertiary)">
                  Select a recorded session.
                </div>
              ) : events.length === 0 ? (
                <div className="text-xs text-(--ui-text-tertiary)">
                  No events recorded yet.
                </div>
              ) : (
                events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    selected={selectedEventId === event.id}
                    onSelect={() => {
                      setSelectedEventId(event.id);
                    }}
                    onFork={() => {
                      if (selectedSession !== null) {
                        setForkTarget({ session: selectedSession, event });
                      }
                    }}
                  />
                ))
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

import type { PluginContext } from '@hermes/plugin-sdk';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cleanupFork, createBookmark, getCompare, getWorkspaceState, listBookmarks, reconcileBranch, verifyFork } from '../api';
import type { Bookmark, BranchDetail, CompareResponse, EventDetail, EventSummary, TurnSummary, WorkspaceState } from '../api';
import { cleanupWarning, errorMessage, formatDuration, formatNumber, formatTime, frozenOutcome, outcomeLabel, outcomeTone, plural, shortId, verifyOutcome } from '../format';
import { formatPayloadText, jsonTokens } from '../jsonFormat';
import { COLLAPSED_KINDS, pairToolEvents } from '../turnEvents';
import { Icon } from './icons';

const TERMINAL_BRANCH_STATES = new Set(['done', 'failed', 'cleaned', 'discarded']);
const CONFIRM_SCOPE = '[data-rw-confirm]';
function confirmOwnsEscape(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLElement && active.closest(CONFIRM_SCOPE) !== null;
}

function turnDuration(turn: TurnSummary): string {
  return formatDuration(Math.max(0, (turn.work_ts - turn.ts) * 1000));
}

export function EventRow({
  event,
  nested = false,
  selected,
  onSelect
}: {
  event: EventSummary;
  nested?: boolean;
  selected: boolean;
  onSelect: () => void;
}): ReactNode {
  const named = !nested && event.name !== null;
  return (
    <button
      type="button"
      className="rp-event"
      data-depth={nested ? '1' : '0'}
      aria-current={selected ? 'true' : undefined}
      onClick={onSelect}
    >
      <span
        title={event.kind}
        className="rp-event-icon"
        style={{ color: kindColor(event.kind, event.status) }}
      >
        <Icon name={kindIcon(event.kind)} size={12} />
      </span>
      <span title={event.kind} className="rp-event-kind">
        {kindLabel(event.kind)}
      </span>
      <span className="rp-event-text" title={event.preview !== '' ? event.preview : undefined}>
        {named ? <span className="rp-event-name">{event.name}</span> : null}
        {event.preview !== '' ? <span className="rp-event-preview">{event.preview}</span> : null}
      </span>
      {event.status === 'error' ? (
        <span className="rp-badge" data-tone="err">
          error
        </span>
      ) : null}
      <span className="rp-event-time rp-mono">{formatDuration(event.duration_ms)}</span>
    </button>
  );
}

export function TimelineRow({
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
  const pairs = pairToolEvents(events ?? []);
  const hidden = (events ?? []).filter((event) => COLLAPSED_KINDS.has(event.kind)).length;
  return (
    <div className="rp-turn">
      <div className="rp-turn-bar">
        <button
          type="button"
          className="rp-turn-row"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse turn ${turn.seq}` : `Expand turn ${turn.seq}`}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.rp-turn-row'));
              const idx = buttons.indexOf(event.currentTarget);
              if (idx !== -1) {
                const next = event.key === 'ArrowDown' ? buttons[idx + 1] : buttons[idx - 1];
                next?.focus();
              }
            }
          }}
        >
          <span className="rp-caret" data-open={expanded ? 'true' : 'false'}>
            <Icon name="chevron" size={12} />
          </span>
          <span className="rp-turn-time rp-mono">{formatTime(turn.ts)}</span>
          <span className="rp-turn-preview" title={turn.preview || 'User turn'}>
            {turn.preview || 'User turn'}
          </span>
          <span className="rp-turn-stat">{plural(turn.tool_calls, 'tool')}</span>
          {turn.tool_errors > 0 ? (
            <span className="rp-badge" data-tone="err">
              <span className="rp-dot" />
              {plural(turn.tool_errors, 'error')}
            </span>
          ) : null}
          <span className="rp-turn-duration rp-mono">{turnDuration(turn)}</span>
        </button>
        <button type="button" className="rp-button rp-button-sm" onClick={onFork}>
          <Icon name="rewind" size={12} />
          Rewind
        </button>
      </div>
      {expanded ? (
        <div className="rp-events">
          {loading ? (
            <div className="rp-aside-note">Loading events...</div>
          ) : (
            <>
              {pairs.map((pair) => (
                <Fragment key={pair.call.id}>
                  <EventRow
                    event={pair.call}
                    selected={selectedEventId === pair.call.id}
                    onSelect={() => {
                      onSelectEvent(pair.call);
                    }}
                  />
                  {pair.result !== null ? (
                    <EventRow
                      event={pair.result}
                      nested
                      selected={selectedEventId === pair.result.id}
                      onSelect={() => {
                        const result = pair.result;
                        if (result !== null) {
                          onSelectEvent(result);
                        }
                      }}
                    />
                  ) : null}
                </Fragment>
              ))}
              {hidden > 0 ? (
                <div className="rp-aside-note">
                  {plural(turn.api_requests, 'model request')} Ã‚Â· {plural(turn.event_count, 'event')}{' '}
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

export function kindLabel(kind: string): string {
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

export function kindIcon(kind: string): string {
  if (kind === 'user_turn') {
    return 'message';
  }
  if (kind === 'assistant_response') {
    return 'reply';
  }
  if (kind === 'tool_call') {
    return 'tool';
  }
  if (kind === 'tool_result') {
    return 'inbox';
  }
  if (kind === 'api_request' || kind === 'llm_call') {
    return 'zap';
  }
  if (kind === 'compaction') {
    return 'layers';
  }
  return 'event';
}

export function stateBadge(state: string): string {
  if (state === 'done') {
    return 'ok';
  }
  if (state === 'failed') {
    return 'err';
  }
  if (state === 'running') {
    return 'run';
  }
  return 'idle';
}

export function Stat({
  label,
  value,
  mono = true,
  tone = 'idle'
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: string;
}): ReactNode {
  const toneClass = tone === 'idle' ? '' : ` rp-tone-${tone}`;
  return (
    <span className="rp-stat">
      <span className="rp-stat-label">{label}</span>
      <span className={`rp-stat-value${mono ? ' rp-mono' : ''}${toneClass}`}>{value}</span>
    </span>
  );
}

export function Metric({
  label,
  value,
  tone = 'idle'
}: {
  label: string;
  value: string;
  tone?: string;
}): ReactNode {
  return (
    <>
      <span className="rp-metric-label">{label}</span>
      <span className={`rp-metric-value rp-tone-${tone}`}>{value}</span>
    </>
  );
}

export function kindColor(kind: string, status: string | null): string {
  if (kind === 'tool_result' && status === 'error') {
    return 'var(--ui-red)';
  }
  if (kind === 'assistant_response' || kind === 'tool_result') {
    return 'var(--ui-green)';
  }
  if (kind === 'user_turn') {
    return 'var(--ui-accent)';
  }
  if (kind === 'tool_call') {
    return 'var(--ui-purple)';
  }
  if (kind === 'api_request' || kind === 'llm_call') {
    return 'var(--ui-orange)';
  }
  if (kind === 'compaction') {
    return 'var(--ui-text-secondary)';
  }
  return 'var(--ui-text-tertiary)';
}

export function toneColor(tone: string): string {
  if (tone === 'ok') {
    return 'var(--ui-green)';
  }
  if (tone === 'err') {
    return 'var(--ui-red)';
  }
  if (tone === 'warn') {
    return 'var(--ui-yellow)';
  }
  return 'var(--ui-text-quaternary)';
}

export function statusTone(status: string | null): 'ok' | 'err' | 'run' | null {
  if (status === null) {
    return null;
  }
  if (status === 'error') {
    return 'err';
  }
  if (status === 'ok') {
    return 'ok';
  }
  return 'run';
}

export function CopyPayloadButton({
  text,
  onCopy
}: {
  text: string;
  onCopy: (text: string) => void;
}): ReactNode {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout((): void => {
      setCopied(false);
    }, 1600);
    return (): void => {
      window.clearTimeout(timer);
    };
  }, [copied]);
  return (
    <button
      type="button"
      className="rp-button rp-button-sm rp-quiet"
      aria-label="Copy payload"
      onClick={() => {
        try {
          onCopy(text);
          setCopied(true);
        } catch {
          // The host refused the write - leave the button as it was.
        }
      }}
    >
      <Icon name={copied ? 'check' : 'copy'} size={12} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function Inspector({
  ctx,
  sessionId,
  detail,
  onCopy
}: {
  ctx: PluginContext;
  sessionId: string | null;
  detail: EventDetail | null;
  onCopy: (text: string) => void;
}): ReactNode {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionId === null) {
      setBookmarks([]);
      return;
    }
    let cancelled = false;
    void listBookmarks(ctx, sessionId)
      .then((rows) => {
        if (!cancelled) {
          setBookmarks(rows);
        }
      })
      .catch(() => undefined);
    return (): void => {
      cancelled = true;
    };
  }, [ctx, sessionId]);

  if (detail === null) {
    return (
      <div className="rp-inspect-empty">
        <Icon name="info" size={14} />
        <span>Select an event to inspect its payload.</span>
      </div>
    );
  }
  const payloadText = formatPayloadText(detail.payload);
  const tone = statusTone(detail.status);
  const eventBookmarks = bookmarks.filter((b) => b.event_id === detail.id);

  const saveBookmark = async (): Promise<void> => {
    const trimmed = label.trim();
    if (trimmed === '' || sessionId === null) {
      return;
    }
    setSaving(true);
    try {
      const created = await createBookmark(ctx, sessionId, trimmed, detail.id);
      setBookmarks((prev) => [created, ...prev]);
      setLabel('');
    } catch {
      // Bookmark is best-effort - the payload remains usable.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rp-inspect">
      <div className="rp-inspect-head">
        <span
          title={detail.kind}
          className="rp-inspect-kind"
          style={{ color: kindColor(detail.kind, detail.status) }}
        >
          <span className="rp-dot" />
          {kindLabel(detail.kind)}
        </span>
        <span className="rp-inspect-name" title={detail.name ?? detail.kind}>
          {detail.name ?? detail.kind}
        </span>
        {tone !== null ? (
          <span className="rp-badge" data-tone={tone}>
            {detail.status}
          </span>
        ) : null}
      </div>
      <div className="rp-inspect-meta">
        <span className="rp-mono">#{detail.id}</span>
        <span className="rp-inspect-sep">Ã‚Â·</span>
        <span className="rp-mono">seq {detail.seq}</span>
        {detail.duration_ms !== null ? (
          <>
            <span className="rp-inspect-sep">Ã‚Â·</span>
            <span className="rp-mono" title={`${detail.duration_ms} ms`}>
              {formatDuration(detail.duration_ms)}
            </span>
          </>
        ) : null}
      </div>
      <div className="rp-bookmark-row">
        <input
          type="text"
          className="rp-filter-input"
          placeholder="Bookmark label"
          aria-label="Bookmark label"
          value={label}
          disabled={sessionId === null}
          onChange={(event) => {
            setLabel(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void saveBookmark();
            }
          }}
        />
        <button
          type="button"
          className="rp-button rp-button-sm"
          disabled={saving || label.trim() === '' || sessionId === null}
          onClick={() => {
            void saveBookmark();
          }}
        >
          {saving ? 'Saving...' : 'Bookmark'}
        </button>
      </div>
      {bookmarks.length > 0 ? (
        <div className="rp-bookmarks">
          {bookmarks.map((b) => (
            <div key={b.id} className="rp-bookmark">
              <span className="rp-bookmark-label">{b.label}</span>
              {b.event_id !== null ? (
                <span className="rp-mono">#{b.event_id}</span>
              ) : null}
              {b.event_id === detail.id ? (
                <span className="rp-badge" data-tone="ok">here</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {eventBookmarks.length > 0 ? null : null}
      <div className="rp-json-card">
        <div className="rp-json-head">
          <span className="rp-json-lang">json</span>
          <CopyPayloadButton text={payloadText} onCopy={onCopy} />
        </div>
        <pre className="rp-json">
          {jsonTokens(payloadText).map((token, index) => (
            <span key={index} className={`rp-j-${token.type}`}>
              {token.text}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

export function ComparePanel({
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
  const [pendingCleanup, setPendingCleanup] = useState<WorkspaceState | null>(null);
  const confirmRef = useRef<HTMLDivElement | null>(null);

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

  const cleanup = async (workspace: WorkspaceState): Promise<void> => {
    setBusy(true);
    setError(null);
    setPendingCleanup(null);
    try {
      await cleanupFork(ctx, branchId);
      onRefresh();
    } catch (caught) {
      setError(errorMessage(caught));
      setPendingCleanup(workspace);
    } finally {
      setBusy(false);
    }
  };

  const askCleanup = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      const workspace = await getWorkspaceState(ctx, branchId);
      if (workspace.uncommitted === 0 && (workspace.orphan_commits ?? 0) === 0) {
        await cleanupFork(ctx, branchId);
        onRefresh();
      } else {
        setPendingCleanup(workspace);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    setPendingCleanup(null);
  }, [branchId]);

  useEffect(() => {
    if (pendingCleanup === null) {
      return;
    }
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && confirmOwnsEscape()) {
        setPendingCleanup(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return (): void => {
      window.removeEventListener('keydown', onKey);
    };
  }, [pendingCleanup]);

  useEffect(() => {
    if (pendingCleanup === null) {
      return;
    }
    const previous = document.activeElement;
    confirmRef.current?.focus();
    return (): void => {
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [pendingCleanup]);

  if (detail === null) {
    return <div className="rp-meta">Loading branch...</div>;
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
    <div className="rp-stack">
      <div className="rp-branch-head">
        <div className="rp-branch-title">
          <span>Branch {shortId(branch.id)}</span>
          <span className="rp-badge" data-tone={stateBadge(branch.state)}>
            <span className="rp-dot" />
            {branch.state}
          </span>
          {run !== null && run.verify_exit !== null ? (
            <span className="rp-badge" data-tone={run.verify_exit === 0 ? 'ok' : 'err'}>
              verify {verifyOutcome(run.verify_exit)}
            </span>
          ) : null}
        </div>
        <div className="rp-branch-actions">
          <button
            type="button"
            className="rp-button rp-button-sm"
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
            className="rp-button rp-button-sm"
            title={cleanupBlock}
            onClick={() => {
              void askCleanup();
            }}
            disabled={busy || !branch.worktree_path}
          >
            Cleanup
          </button>
          <button type="button" className="rp-button rp-button-sm rp-quiet" onClick={onClose}>
            Hide
          </button>
        </div>
      </div>

      {detail.shared_child ? (
        <div className="rp-note rp-note-warn">
          Another branch claims this same rerun session, so the numbers below may describe a
          different fork. It was recorded before the session-id fix.
        </div>
      ) : null}

      {error !== null ? <div className="rp-error">{error}</div> : null}

      {pendingCleanup !== null ? (
        <div
          className="rp-confirm"
          ref={confirmRef}
          role="alertdialog"
          aria-label="Confirm workspace cleanup"
          data-rw-confirm="true"
          tabIndex={-1}
        >
          <div className="rp-confirm-copy">
            {cleanupWarning(pendingCleanup.uncommitted, pendingCleanup.orphan_commits ?? 0)}
          </div>
          <div className="rp-confirm-path">{pendingCleanup.worktree_path}</div>
          <div className="rp-confirm-actions">
            <button
              type="button"
              className="rp-button rp-button-sm rp-delete"
              onClick={() => {
                void cleanup(pendingCleanup);
              }}
              disabled={busy}
            >
              Delete workspace
            </button>
            <button
              type="button"
              className="rp-button rp-button-sm"
              onClick={() => {
                setPendingCleanup(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {compare !== null ? (
        <div className="rp-stack">
          <div className="rp-compare">
            <div className="rp-panel">
              <div className="rp-card-label">
                Original
                {compare.left?.frozen_at ? ` Ã‚Â· frozen ${formatTime(compare.left.frozen_at)}` : ''}
              </div>
              <div className="rp-metrics">
                <Metric
                  label="outcome"
                  value={
                    compare.left === null ? 'not recorded' : frozenOutcome(compare.left.outcome)
                  }
                  tone={compare.left === null ? 'idle' : outcomeTone(compare.left.outcome)}
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
                  tone={compare.left !== null && compare.left.tool_errors > 0 ? 'err' : 'idle'}
                />
              </div>
            </div>
            <div className="rp-panel">
              <div className="rp-card-label rp-card-label-accent">Rerun</div>
              <div className="rp-metrics">
                <Metric
                  label="outcome"
                  value={
                    compare.right === null ? 'not recorded' : outcomeLabel(compare.right.outcome)
                  }
                  tone={compare.right === null ? 'idle' : outcomeTone(compare.right.outcome)}
                />
                <Metric
                  label="verify"
                  value={rerunVerifyExit === null ? 'not run' : verifyOutcome(rerunVerifyExit)}
                  tone={rerunVerifyExit === null ? 'idle' : rerunVerifyExit === 0 ? 'ok' : 'err'}
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
                  tone={compare.right !== null && compare.right.tool_errors > 0 ? 'err' : 'idle'}
                />
              </div>
            </div>
          </div>
          <div className="rp-verdict">
            <Icon name="info" size={13} />
            <span>
              <strong>Verdict</strong> {compare.verdict}
            </span>
          </div>
          {compare.diff && compare.diff.length > 0 ? (
            <div className="rp-panel rp-diff">
              <div className="rp-card-label">Workspace diff</div>
              {compare.diff_stat ? <pre className="rp-pre">{compare.diff_stat}</pre> : null}
              <div className="rp-diff-list">
                {compare.diff.map((entry) => (
                  <div key={entry.path} className="rp-diff-entry">
                    <span className="rp-diff-path">{entry.path}</span>
                    <span className="rp-mono">
                      +{entry.additions} -{entry.deletions}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rp-meta">
          {branch.state === 'cleaned' || branch.state === 'discarded'
            ? 'The rerun never started, and its workspace is gone.'
            : 'Waiting for the rerun to start.'}
        </div>
      )}

      {run !== null && run.verify_out ? <pre className="rp-pre">{run.verify_out}</pre> : null}

      {detail.prompt !== null ? (
        <details className="rp-panel rp-disclosure">
          <summary>Prompt</summary>
          <pre className="rp-pre">{detail.prompt}</pre>
        </details>
      ) : null}
    </div>
  );
}







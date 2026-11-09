import { host, useValue } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import {
  getBranches,
  getEvent,
  getSessions,
  getSnapshots,
  getTurnEvents,
  getTurns,
  searchEvents,
  SESSIONS_PAGE_LIMIT
} from '../api';
import type {
  BranchSummary,
  EventDetail,
  EventSummary,
  SessionSummary,
  SnapshotSummary,
  TurnSummary
} from '../api';
import {
  errorMessage,
  formatNumber,
  formatRelative,
  formatTime,
  outcomeLabel,
  openRecordingNote,
  OPEN_RECORDING_HINT,
  outcomeTone,
  plural,
  sessionsCountLabel,
  shortId,
  turnsEmptyMessage
} from '../format';
import { ForkDialog } from './ForkDialog';
import { Icon } from './icons';
import { mergeTurnPages } from '../mergeTurnPages';
import { PAGE_CSS } from './rewindStyles';
import {
  ComparePanel,
  EventRow,
  Inspector,
  Stat,
  stateBadge,
  TimelineRow,
  toneColor
} from './RewindRows';

interface ForkTarget {
  session: SessionSummary;
  event: EventSummary;
}

const CONFIRM_SCOPE = '[data-rw-confirm]';

const PAYLOAD_WIDTH_KEY = 'hermes-session-rewind:payload-width';
const PAYLOAD_WIDTH_DEFAULT = 292;

function clampPayloadWidth(width: number): number {
  if (!Number.isFinite(width)) {
    return PAYLOAD_WIDTH_DEFAULT;
  }
  return Math.min(560, Math.max(240, Math.round(width)));
}

function readPayloadWidth(): number {
  try {
    const stored = window.localStorage.getItem(PAYLOAD_WIDTH_KEY);
    if (stored === null) {
      return PAYLOAD_WIDTH_DEFAULT;
    }
    return clampPayloadWidth(Number(stored)) || PAYLOAD_WIDTH_DEFAULT;
  } catch {
    // Storage unavailable - fall back to the default width.
    return PAYLOAD_WIDTH_DEFAULT;
  }
}

function storePayloadWidth(width: number): void {
  try {
    window.localStorage.setItem(PAYLOAD_WIDTH_KEY, String(width));
  } catch {
    // Storage unavailable - the width just does not survive a reload.
  }
}

function confirmOwnsEscape(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLElement && active.closest(CONFIRM_SCOPE) !== null;
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
  const [sessionFilter, setSessionFilter] = useState('');
  const [eventQuery, setEventQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EventSummary[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchKind, setSearchKind] = useState('');
  const [searchTool, setSearchTool] = useState('');
  const [payloadWidth, setPayloadWidth] = useState(readPayloadWidth);
  const [draggingDivider, setDraggingDivider] = useState(false);
  const dividerDrag = useRef<{ startX: number; startWidth: number } | null>(null);
  const payloadWidthRef = useRef(payloadWidth);

  useEffect(() => {
    payloadWidthRef.current = payloadWidth;
  }, [payloadWidth]);

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
      if (event.key === 'Escape' && !confirmOwnsEscape()) {
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

  useEffect(() => {
    const query = eventQuery.trim();
    if (query.length < 2 || selectedSessionId === null) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const dispose = ctx.setTimeout(() => {
      void searchEvents(
        ctx,
        selectedSessionId,
        query,
        30,
        searchKind || null,
        searchTool || null
      )
        .then((page) => {
          if (!cancelled) {
            setSearchResults(page.items);
            setSearching(false);
          }
        })
        .catch((caught: unknown) => {
          if (!cancelled) {
            setSearching(false);
            setError(errorMessage(caught));
          }
        });
    }, 200);
    return (): void => {
      cancelled = true;
      dispose();
    };
  }, [ctx, eventQuery, searchKind, searchTool, selectedSessionId]);

  const selectedSession = sessions.find((item) => item.session_id === selectedSessionId) ?? null;
  const filterNeedle = sessionFilter.trim().toLowerCase();
  const visibleSessions =
    filterNeedle === ''
      ? sessions
      : sessions.filter((session) =>
          `${session.title ?? ''} ${session.model ?? ''} ${session.session_id}`
            .toLowerCase()
            .includes(filterNeedle)
        );
  const running = selectedSession !== null && selectedSession.ended_at === null;
  const live = running && selectedSession.session_id === activeSessionId;
  const visibleTurns =
    selectedSessionId === null ? [] : turns.filter((turn) => turn.session_id === selectedSessionId);
  const searchActive = eventQuery.trim().length >= 2;

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
    setEventQuery('');
    setSearchResults(null);
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
    <div className="rw-page rp-shell">
      <style>{PAGE_CSS}</style>
      <header className="rp-head">
        <div className="rp-head-left">
          <span className="rp-mark">
            <Icon name="rewind" size={16} />
          </span>
          <div>
            <div className="rp-title">Session Rewind</div>
            <div className="rp-sub">
              Recorded locally. Fork a user turn, rerun it, and compare outcomes.
            </div>
          </div>
        </div>
        <div className="rp-head-right">
          {selectedSession !== null ? (
            <span className="rp-pill rp-mono" title={selectedSession.model ?? undefined}>
              {selectedSession.model ?? 'unknown model'}
            </span>
          ) : null}
          {running ? (
            <span className="rp-live">
              <span className="rp-dot" />
              {live ? 'live' : 'running'}
            </span>
          ) : null}
          <button type="button" className="rp-button" onClick={refresh}>
            <Icon name="refresh" size={13} />
            Refresh
          </button>
        </div>
      </header>

      {error !== null ? <div className="rp-error">{error}</div> : null}

      <div className="rp-columns">
        <aside className="rp-side">
          <div className="rp-eyebrow">
            <span className="rp-dot" />
            Sessions
            {sessionsLoaded ? (
              <span className="rp-eyebrow-count">
                {sessionsCountLabel(visibleSessions.length, SESSIONS_PAGE_LIMIT)}
              </span>
            ) : null}
          </div>
          {sessionsLoaded && sessions.length > 0 ? (
            <input
              type="text"
              className="rp-search"
              placeholder="Filter sessions..."
              aria-label="Filter sessions"
              value={sessionFilter}
              onChange={(event) => {
                setSessionFilter(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && sessionFilter !== '') {
                  setSessionFilter('');
                  event.preventDefault();
                  event.stopPropagation();
                }
              }}
            />
          ) : null}
          {!sessionsLoaded ? (
            <div className="rp-meta">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="rp-meta rp-empty">
              <Icon name="info" size={13} />
              Start a chat and Rewind will record every turn.
            </div>
          ) : visibleSessions.length === 0 ? (
            <div className="rp-meta">No session matches the filter.</div>
          ) : (
            <div className="rp-cards">
              {visibleSessions.map((session) => (
                <button
                  type="button"
                  key={session.session_id}
                  className="rp-session"
                  aria-current={selectedSessionId === session.session_id ? 'true' : undefined}
                  onClick={() => {
                    selectSession(session);
                  }}
                >
                  <span className="rp-session-title">
                    <span
                      className="rp-dot"
                      style={{ color: toneColor(outcomeTone(session.outcome)) }}
                    />
                    <span title={session.title ?? shortId(session.session_id)}>
                      {session.title ?? shortId(session.session_id)}
                    </span>
                    <span className="rp-session-when">
                      {session.last_event_at !== null ? formatRelative(session.last_event_at) : ''}
                    </span>
                  </span>
                  <span className="rp-meta">
                    {session.model ?? 'unknown model'} Ã‚Â· {plural(session.event_count, 'event')}
                  </span>
                  <span className="rp-meta rp-meta-dim">
                    {outcomeLabel(session.outcome)} Ã‚Â·{' '}
                    {formatNumber(session.tokens_in + session.tokens_out)} tokens
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="rp-main">
          {selectedSession !== null ? (
            <div className="rp-detail-head">
              <div className="rp-stack" style={{ gap: 5 }}>
                <div className="rp-detail-title">
                  {selectedSession.title ?? shortId(selectedSession.session_id)}
                </div>
                <div className="rp-stats">
                  {snapshots.length > 0 ? (
                    <Stat label="snapshot" value={String(snapshots.length)} />
                  ) : null}
                  <Stat label="events" value={formatNumber(selectedSession.event_count)} />
                  <Stat
                    label="tokens"
                    value={formatNumber(selectedSession.tokens_in + selectedSession.tokens_out)}
                  />
                  {selectedSession.ended_at !== null ? (
                    <Stat
                      label="window"
                      value={`${formatTime(selectedSession.started_at)} - ${formatTime(selectedSession.ended_at)}`}
                    />
                  ) : null}
                  <Stat
                    label="outcome"
                    value={outcomeLabel(selectedSession.outcome)}
                    mono={false}
                    tone={outcomeTone(selectedSession.outcome)}
                  />
                </div>
                <div className="rp-meta">
                  {selectedSession.model ?? 'unknown model'}
                  {selectedSession.ended_at === null ? (
                    <span title={OPEN_RECORDING_HINT}>
                      {` Ã‚Â· ${openRecordingNote(selectedSession.last_event_at)}`}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="rp-hint">Select a user turn and choose Rewind.</div>
            </div>
          ) : null}

          {branches.length > 0 ? (
            <div>
              <div className="rp-eyebrow">
                <span className="rp-dot" />
                Branches
                <span className="rp-eyebrow-count">{branches.length}</span>
              </div>
              <div className="rp-chips">
                {branches.map((branch) => (
                  <button
                    type="button"
                    key={branch.id}
                    className="rp-chip"
                    aria-current={selectedBranchId === branch.id ? 'true' : undefined}
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                    }}
                  >
                    <span className="rp-mono">{shortId(branch.id)}</span>
                    <span className="rp-badge" data-tone={stateBadge(branch.state)}>
                      <span className="rp-dot" />
                      {branch.state}
                    </span>
                    <span className="rp-chip-note">
                      {branch.fork_row_count > 0
                        ? plural(branch.fork_row_count, 'message')
                        : 'context pack'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div
            className="rp-columns"
            style={{ gap: 0, '--rp-payload-width': `${payloadWidth}px` } as React.CSSProperties}
          >
            <div className="rp-turns">
              <div className="rp-stack" style={{ width: '100%' }}>
                <div className="rp-eyebrow">
                  <span className="rp-dot" />
                  {searchActive ? 'Search results' : 'Turns'}
                  {searchActive && searchResults !== null ? (
                    <span className="rp-eyebrow-count">{searchResults.length}</span>
                  ) : null}
                </div>
                {selectedSession === null ? (
                  <div className="rp-meta">Select a recorded session.</div>
                ) : (
                  <>
                    <div className="rp-search-filters" role="search" aria-label="Event search">
                      <input
                        type="text"
                        role="searchbox"
                        className="rp-search"
                        placeholder="Search events..."
                        aria-label="Search events"
                        aria-describedby="rp-search-kind-note"
                        value={eventQuery}
                        onChange={(event) => {
                          setEventQuery(event.target.value);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape' && eventQuery !== '') {
                            setEventQuery('');
                            event.preventDefault();
                            event.stopPropagation();
                          }
                        }}
                      />
                      <select
                        className="rp-filter"
                        aria-label="Event kind"
                        value={searchKind}
                        onChange={(event) => {
                          setSearchKind(event.target.value);
                        }}
                      >
                        <option value="">all kinds</option>
                        <option value="user_turn">user_turn</option>
                        <option value="tool_call">tool_call</option>
                        <option value="tool_result">tool_result</option>
                        <option value="llm_call">llm_call</option>
                        <option value="api_request">api_request</option>
                        <option value="turn_end">turn_end</option>
                      </select>
                      <input
                        type="text"
                        className="rp-filter-input"
                        placeholder="tool name"
                        aria-label="Tool name"
                        value={searchTool}
                        onChange={(event) => {
                          setSearchTool(event.target.value);
                        }}
                      />
                    </div>
                    <span id="rp-search-kind-note" className="rp-meta" style={{display:'none'}}>Kind and tool filters narrow the search.</span>
                    {searchActive ? (
                      searching ? (
                        <div className="rp-meta">Searching...</div>
                      ) : searchResults === null || searchResults.length === 0 ? (
                        <div className="rp-meta">No event matches Ã¢â‚¬Å“{eventQuery.trim()}Ã¢â‚¬Â.</div>
                      ) : (
                        <div className="rp-events rp-search-results">
                          {searchResults.map((event) => (
                            <EventRow
                              key={event.id}
                              event={event}
                              selected={selectedEventId === event.id}
                              onSelect={() => {
                                setSelectedEventId(event.id);
                              }}
                            />
                          ))}
                        </div>
                      )
                    ) : !turnsLoaded ? (
                      <div className="rp-meta">Loading turns...</div>
                    ) : visibleTurns.length === 0 ? (
                      <div className="rp-meta">
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
                            loading={
                              expandedTurnId === turn.id && turnEvents[turn.id] === undefined
                            }
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
                            className="rp-load-more"
                            onClick={() => {
                              void loadEarlier();
                            }}
                            disabled={turnsLoading}
                          >
                            {turnsLoading ? 'Loading...' : 'Load earlier turns'}
                          </button>
                        ) : (
                          <div className="rp-tail">
                            {plural(visibleTurns.length, 'turn')} Ã‚Â· start of the recording
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize event payload panel"
              tabIndex={0}
              className="rp-divider"
              data-dragging={draggingDivider ? 'true' : undefined}
              onPointerDown={(event) => {
                dividerDrag.current = { startX: event.clientX, startWidth: payloadWidth };
                setDraggingDivider(true);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const drag = dividerDrag.current;
                if (drag === null) {
                  return;
                }
                setPayloadWidth(clampPayloadWidth(drag.startWidth - (event.clientX - drag.startX)));
              }}
              onPointerUp={(event) => {
                if (dividerDrag.current === null) {
                  return;
                }
                dividerDrag.current = null;
                setDraggingDivider(false);
                storePayloadWidth(payloadWidthRef.current);
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
              }}
              onPointerCancel={(event) => {
                if (dividerDrag.current === null) {
                  return;
                }
                dividerDrag.current = null;
                setDraggingDivider(false);
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                  const next = clampPayloadWidth(payloadWidthRef.current + 16);
                  setPayloadWidth(next);
                  storePayloadWidth(next);
                  event.preventDefault();
                } else if (event.key === 'ArrowRight') {
                  const next = clampPayloadWidth(payloadWidthRef.current - 16);
                  setPayloadWidth(next);
                  storePayloadWidth(next);
                  event.preventDefault();
                }
              }}
              onDoubleClick={() => {
                setPayloadWidth(PAYLOAD_WIDTH_DEFAULT);
                storePayloadWidth(PAYLOAD_WIDTH_DEFAULT);
              }}
            />
            <div className="rp-payload">
              <div className="rp-eyebrow">
                <span className="rp-dot" />
                Event payload
              </div>
              <Inspector
                ctx={ctx}
                sessionId={selectedSessionId}
                detail={detail}
                onCopy={(text) => {
                  ctx.os.writeClipboard(text);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {selectedBranchId !== null ? (
        <div className="rp-compare-wrap">
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


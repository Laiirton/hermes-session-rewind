import { host, useValue } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useEffect, useRef, useState } from 'react';
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
  getWorkspaceState,
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
  TurnSummary,
  WorkspaceState
} from '../api';
import {
  cleanupWarning,
  errorMessage,
  formatDuration,
  formatNumber,
  formatTime,
  frozenOutcome,
  outcomeLabel,
  openRecordingNote,
  outcomeTone,
  plural,
  sessionsCountLabel,
  shortId,
  turnsEmptyMessage,
  verifyOutcome
} from '../format';
import { ForkDialog } from './ForkDialog';
import { Icon } from './icons';
import { mergeTurnPages } from '../mergeTurnPages';

interface ForkTarget {
  session: SessionSummary;
  event: EventSummary;
}

const CONFIRM_SCOPE = '[data-rw-confirm]';

function confirmOwnsEscape(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLElement && active.closest(CONFIRM_SCOPE) !== null;
}

const PAGE_CSS = `
.rw-page :is(button, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ui-stroke-primary);
  outline-offset: 1px;
}
.rw-page :is(input, textarea):focus-visible {
  outline: none;
}
.rw-page button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.rw-page button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.rp-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  min-height: 0;
  font-size: 13px;
  color: var(--ui-text-primary);
}
.rp-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.rp-head-left {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  min-width: 0;
}
.rp-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: var(--ui-accent);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 10px;
}
.rp-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.rp-sub {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
}
.rp-head-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}
.rp-pill {
  max-width: 220px;
  overflow: hidden;
  padding: 4px 10px;
  font-size: 11px;
  color: var(--ui-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 999px;
}
.rp-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--ui-green);
}
.rp-dot {
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 999px;
  background: currentColor;
}
.rp-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rp-button:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rp-button-sm {
  padding: 3px 8px;
  font-size: 11px;
}
.rp-quiet {
  color: var(--ui-text-tertiary);
  background: transparent;
  border-color: transparent;
}
.rp-quiet:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rp-columns {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}
.rp-side {
  width: 238px;
  flex: none;
  overflow-y: auto;
  padding-right: 14px;
  border-right: 1px solid var(--ui-stroke-tertiary);
}
.rp-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.rp-eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rp-eyebrow .rp-dot {
  width: 5px;
  height: 5px;
  background: var(--ui-stroke-primary);
}
.rp-eyebrow-count {
  margin-left: 3px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}
.rp-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rp-session {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  padding: 9px 11px;
  text-align: left;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 10px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rp-session:hover {
  border-color: var(--ui-stroke-secondary);
}
.rp-session[aria-current="true"] {
  background: color-mix(in srgb, var(--ui-accent) 9%, var(--ui-bg-card));
  border-color: var(--ui-stroke-primary);
}
.rp-session-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
}
.rp-session-title > span:nth-child(2) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-meta {
  overflow: hidden;
  font-size: 11px;
  color: var(--ui-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-meta-dim {
  color: var(--ui-text-quaternary);
}
.rp-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rp-detail-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.rp-detail-note {
  font-size: 11px;
  font-weight: 400;
  color: var(--ui-text-tertiary);
}
.rp-hint {
  flex: none;
  max-width: 190px;
  font-size: 11px;
  line-height: 1.45;
  text-align: right;
  color: var(--ui-text-tertiary);
}
.rp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 92px;
  overflow-y: auto;
}
.rp-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 9px;
  font-size: 11px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rp-chip:hover {
  border-color: var(--ui-stroke-secondary);
}
.rp-chip[aria-current="true"] {
  border-color: var(--ui-stroke-primary);
  background: color-mix(in srgb, var(--ui-accent) 9%, var(--ui-bg-card));
}
.rp-chip-note {
  color: var(--ui-text-tertiary);
}
.rp-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 1px 7px;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ui-text-secondary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 999px;
}
.rp-badge[data-tone="ok"] {
  color: var(--ui-green);
  background: color-mix(in srgb, var(--ui-green) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-green) 32%, transparent);
}
.rp-badge[data-tone="err"] {
  color: var(--ui-red);
  background: color-mix(in srgb, var(--ui-red) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 32%, transparent);
}
.rp-badge[data-tone="run"] {
  color: var(--ui-accent);
  background: color-mix(in srgb, var(--ui-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--ui-accent) 34%, transparent);
}
.rp-mono {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
}
.rp-turns {
  display: flex;
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
.rp-turn {
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rp-turn-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rp-turn-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  padding: 8px 6px;
  text-align: left;
  border-radius: 8px;
  transition: background-color 120ms ease-out;
}
.rp-turn-row:hover {
  background: var(--ui-control-hover-background);
}
.rp-caret {
  display: inline-grid;
  place-items: center;
  width: 12px;
  flex: none;
  color: var(--ui-text-tertiary);
  transition: transform 140ms ease-out;
}
.rp-caret[data-open="true"] {
  transform: rotate(90deg);
}
.rp-turn-time {
  flex: none;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-turn-preview {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-turn-stat {
  flex: none;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-turn-duration {
  flex: none;
  width: 52px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-events {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 6px 8px 30px;
}
.rp-event {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 3px 6px;
  font-size: 11px;
  text-align: left;
  border-radius: 6px;
  transition: background-color 120ms ease-out;
}
.rp-event:hover {
  background: var(--ui-control-hover-background);
}
.rp-event[aria-current="true"] {
  background: color-mix(in srgb, var(--ui-accent) 12%, transparent);
}
.rp-event-kind {
  width: 62px;
  flex: none;
  overflow: hidden;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-event-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-event-time {
  width: 54px;
  flex: none;
  font-size: 11px;
  text-align: right;
}
.rp-aside-note {
  padding-left: 30px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-load-more {
  width: 100%;
  margin-top: 8px;
  padding: 6px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rp-load-more:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rp-tail {
  margin-top: 8px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-payload {
  width: 288px;
  flex: none;
  overflow-y: auto;
  padding-left: 14px;
  border-left: 1px solid var(--ui-stroke-tertiary);
}
.rp-panel {
  padding: 11px 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 10px;
}
.rp-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.rp-card-label {
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rp-card-label-accent {
  color: var(--ui-accent);
}
.rp-metrics {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 16px;
  align-items: baseline;
  font-size: 11px;
}
.rp-metric-label {
  color: var(--ui-text-tertiary);
}
.rp-tone-ok {
  color: var(--ui-green);
}
.rp-tone-err {
  color: var(--ui-red);
}
.rp-tone-warn {
  color: var(--ui-yellow);
}
.rp-metric-value {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.rp-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.rp-verdict {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 11px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-secondary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 8px;
}
.rp-verdict .rp-icon {
  flex: none;
  margin-top: 1px;
  color: var(--ui-text-tertiary);
}
.rp-verdict strong {
  font-weight: 600;
  color: var(--ui-text-primary);
}
.rp-pre {
  max-height: 132px;
  padding: 10px 12px;
  overflow: auto;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 8px;
}
.rp-disclosure {
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-disclosure summary {
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}
.rp-disclosure .rp-pre {
  max-height: 128px;
  margin-top: 8px;
  border: 0;
  padding: 0;
  background: transparent;
}
.rp-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 11px;
  font-size: 11px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: 8px;
}
.rp-note-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 8%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rp-error {
  font-size: 11px;
  color: var(--ui-red);
}
.rp-confirm {
  padding: 10px 12px;
  background: color-mix(in srgb, var(--ui-red) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--ui-red) 32%, transparent);
  border-radius: 10px;
}
.rp-confirm-copy {
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 1.45;
}
.rp-confirm-path {
  margin-bottom: 10px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-tertiary);
  word-break: break-all;
}
.rp-confirm-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rp-delete {
  color: var(--ui-red);
  border-color: color-mix(in srgb, var(--ui-red) 45%, transparent);
}
.rp-delete:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ui-red) 14%, transparent);
}
.rp-branch-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.rp-branch-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
}
.rp-branch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rp-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rp-icon {
  flex: none;
}
@media (max-width: 900px) {
  .rp-columns {
    flex-direction: column;
  }
  .rp-side {
    width: auto;
    padding-right: 0;
    border-right: 0;
  }
  .rp-payload {
    width: auto;
    padding-left: 0;
    border-left: 0;
  }
}
@media (max-width: 560px) {
  .rp-compare {
    grid-template-columns: 1fr;
  }
  .rp-head-right .rp-pill {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .rp-caret {
    transition: none;
  }
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
      className="rp-event"
      aria-current={selected ? 'true' : undefined}
      onClick={onSelect}
    >
      <span title={event.kind} className={`rp-event-kind ${kindTone(event.kind, event.status)}`}>
        {kindLabel(event.kind)}
      </span>
      <span className="rp-event-text">{event.name ?? event.preview}</span>
      <span className="rp-event-time rp-mono">{formatDuration(event.duration_ms)}</span>
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
    <div className="rp-turn">
      <div className="rp-turn-bar">
        <button type="button" className="rp-turn-row" onClick={onToggle} aria-expanded={expanded}>
          <span className="rp-caret" data-open={expanded ? 'true' : 'false'}>
            <Icon name="chevron" size={12} />
          </span>
          <span className="rp-turn-time rp-mono">{formatTime(turn.ts)}</span>
          <span className="rp-turn-preview">{turn.preview || 'User turn'}</span>
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
                <div className="rp-aside-note">
                  {plural(turn.api_requests, 'model request')} · {plural(turn.event_count, 'event')}{' '}
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
    return 'text-(--ui-red)';
  }
  if (kind === 'assistant_response' || kind === 'tool_result') {
    return 'text-(--ui-green)';
  }
  if (kind === 'user_turn') {
    return 'text-(--ui-accent)';
  }
  if (kind === 'tool_call') {
    return 'text-(--ui-purple)';
  }
  if (kind === 'api_request' || kind === 'llm_call') {
    return 'text-(--ui-orange)';
  }
  if (kind === 'compaction') {
    return 'text-(--ui-text-secondary)';
  }
  return 'text-(--ui-text-tertiary)';
}

function stateBadge(state: string): string {
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

function Metric({
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

function Inspector({ detail }: { detail: EventDetail | null }): ReactNode {
  if (detail === null) {
    return <div className="rp-meta">Select an event to inspect its payload.</div>;
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
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs">
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
      if (workspace.uncommitted === 0) {
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
          <div className="rp-confirm-copy">{cleanupWarning(pendingCleanup.uncommitted)}</div>
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
                {compare.left?.frozen_at ? ` · frozen ${formatTime(compare.left.frozen_at)}` : ''}
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
            <span className="rp-pill rp-mono">{selectedSession.model ?? 'unknown model'}</span>
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
                {sessionsCountLabel(sessions.length, SESSIONS_PAGE_LIMIT)}
              </span>
            ) : null}
          </div>
          {!sessionsLoaded ? (
            <div className="rp-meta">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="rp-meta">Start a chat and Rewind will record every turn.</div>
          ) : (
            <div className="rp-cards">
              {sessions.map((session) => (
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
                      style={{
                        background:
                          session.ended_at === null
                            ? 'var(--ui-green)'
                            : 'var(--ui-text-quaternary)'
                      }}
                    />
                    <span>{session.title ?? shortId(session.session_id)}</span>
                  </span>
                  <span className="rp-meta">
                    {session.model ?? 'unknown model'} · {plural(session.event_count, 'event')}
                  </span>
                  <span className="rp-meta rp-meta-dim">
                    {outcomeLabel(session.outcome)} ·{' '}
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
              <div className="rp-stack" style={{ gap: 3 }}>
                <div className="rp-detail-title">
                  {selectedSession.title ?? shortId(selectedSession.session_id)}
                  {snapshots.length > 0 ? (
                    <span className="rp-detail-note">{plural(snapshots.length, 'snapshot')}</span>
                  ) : null}
                </div>
                <div className="rp-meta">
                  {selectedSession.model ?? 'unknown model'} ·{' '}
                  {plural(selectedSession.event_count, 'event')} ·{' '}
                  {formatNumber(selectedSession.tokens_in + selectedSession.tokens_out)} tokens
                  {selectedSession.ended_at === null
                    ? ` · ${openRecordingNote(selectedSession.last_event_at)}`
                    : ''}
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

          <div className="rp-columns" style={{ gap: 0 }}>
            <div className="rp-turns">
              <div className="rp-stack" style={{ width: '100%' }}>
                <div className="rp-eyebrow">
                  <span className="rp-dot" />
                  Turns
                </div>
                {selectedSession === null ? (
                  <div className="rp-meta">Select a recorded session.</div>
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
                        {plural(visibleTurns.length, 'turn')} · start of the recording
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="rp-payload">
              <div className="rp-eyebrow">
                <span className="rp-dot" />
                Event payload
              </div>
              <Inspector detail={detail} />
            </div>
          </div>
        </main>
      </div>

      {selectedBranchId !== null ? (
        <div className="max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2">
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

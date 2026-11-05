import { host } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { commitFork, prepareFork, resolveVerify } from '../api';
import type { EventSummary, ForkPlan, SessionSummary, VerifyResolution } from '../api';
import { errorMessage, formatTime, shortId } from '../format';
import { branchPoint } from '../forkPrefix';
import { Icon } from './icons';
import type { HistoryResult } from '../forkPrefix';

interface BranchRpcResult {
  session_id: string;
  stored_session_id: string;
}

interface CreateRpcResult {
  session_id: string;
  stored_session_id: string;
}

interface ActiveSession {
  id: string;
  session_key: string;
}

interface ActiveSessions {
  sessions?: ActiveSession[];
}

interface SessionTitleResult {
  title: string;
  session_key?: string | null;
}

interface ConfigSetResult {
  confirm_required?: boolean;
  confirm_message?: string;
}

const VERIFY_PRESETS = ['python -m pytest -q', 'npm test', 'cargo test', 'go test ./...'];
const RESOLVE_DEBOUNCE_MS = 350;

interface LiveParent {
  runtimeId: string | undefined;
  storedId: string | null;
}

interface ForkDialogProps {
  ctx: PluginContext;
  session: SessionSummary;
  event: EventSummary;
  onClose: () => void;
  onCreated: (branchId: string) => void;
}

function labelled<T>(step: string, action: Promise<T>): Promise<T> {
  return action.catch((caught: unknown): never => {
    throw new Error(`${step}: ${errorMessage(caught)}`);
  });
}

function focusables(panel: HTMLElement | null): HTMLElement[] {
  if (panel === null) {
    return [];
  }
  const nodes = panel.querySelectorAll<HTMLElement>(
    'button, input, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(nodes).filter((node) => !node.hasAttribute('disabled'));
}

function trapFocus(panel: HTMLElement | null, keyEvent: KeyboardEvent): void {
  const items = focusables(panel);
  const first = items[0];
  const last = items[items.length - 1];
  if (panel === null || first === undefined || last === undefined) {
    return;
  }
  const active = document.activeElement;
  if (!panel.contains(active)) {
    keyEvent.preventDefault();
    first.focus();
    return;
  }
  if (keyEvent.shiftKey && active === first) {
    keyEvent.preventDefault();
    last.focus();
  } else if (!keyEvent.shiftKey && active === last) {
    keyEvent.preventDefault();
    first.focus();
  }
}

const DIALOG_CSS = `
.rw-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop, 120);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 28px 20px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(0.125rem);
  animation: rw-fade 140ms ease-out;
}
.rw-overlay[data-closing="true"] {
  animation: rw-fade 100ms ease-in reverse;
}
.rw-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(560px, 100%);
  max-height: calc(100vh - 56px);
  margin: auto 0;
  overflow: hidden;
  color: var(--ui-text-primary);
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * 1rem);
  box-shadow: var(--shadow-md);
  animation: rw-rise 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.rw-overlay[data-closing="true"] .rw-panel {
  animation: rw-rise 100ms ease-in reverse;
}
@keyframes rw-fade {
  from {
    opacity: 0;
  }
}
@keyframes rw-rise {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.985);
  }
}
@media (prefers-reduced-motion: reduce) {
  .rw-overlay,
  .rw-panel,
  .rw-overlay[data-closing="true"],
  .rw-overlay[data-closing="true"] .rw-panel {
    animation: none;
  }
}
.rw-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 18px 48px 14px 18px;
}
.rw-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: var(--ui-accent);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
}
.rw-heading {
  min-width: 0;
}
.rw-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-accent);
}
.rw-title {
  margin-top: 3px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.rw-panel .rw-close {
  position: absolute;
  top: 16px;
  right: 14px;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  color: var(--ui-text-tertiary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-panel .rw-close:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-panel .rw-close:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-panel:focus-visible {
  outline: none;
}
.rw-panel .rw-button:focus-visible,
.rw-panel .rw-close:focus-visible,
.rw-panel .rw-preset:focus-visible,
.rw-panel .rw-icon-button:focus-visible {
  outline: 2px solid var(--ui-stroke-primary);
  outline-offset: 2px;
}
.rw-input:focus-visible,
.rw-textarea:focus-visible {
  outline: none;
}
.rw-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 18px 18px;
  overflow-y: auto;
}
.rw-turn {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  padding: 8px 10px;
  font-size: 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-turn-time {
  flex: none;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-secondary);
}
.rw-turn-text {
  overflow: hidden;
  color: var(--ui-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-notes {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.rw-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-secondary);
}
.rw-note svg {
  flex: none;
  margin-top: 2px;
  color: var(--ui-text-tertiary);
}
.rw-note-warn {
  color: var(--ui-yellow);
}
.rw-note-warn svg {
  color: var(--ui-yellow);
}
.rw-path {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin-top: 2px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rw-path-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
}
.rw-panel .rw-icon-button {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  color: var(--ui-text-tertiary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-panel .rw-icon-button:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.rw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.rw-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.rw-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rw-count {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--ui-text-tertiary);
}
.rw-input,
.rw-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  outline: none;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.rw-input {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
}
.rw-input:focus,
.rw-textarea:focus {
  border-color: var(--ui-stroke-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-stroke-primary) 20%, transparent);
}
.rw-textarea {
  min-height: 132px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  line-height: 1.55;
  resize: vertical;
}
.rw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.rw-panel .rw-preset {
  padding: 3px 8px;
  font: inherit;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-panel .rw-preset:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
  border-color: var(--ui-stroke-secondary);
}
.rw-panel .rw-preset[aria-pressed="true"] {
  color: var(--ui-text-primary);
  background: color-mix(in srgb, var(--ui-accent) 14%, transparent);
  border-color: var(--ui-stroke-primary);
}
.rw-help {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
}
.rw-resolved {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 10px;
  line-height: 1.5;
  color: var(--ui-text-tertiary);
}
.rw-resolved-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
}
.rw-banner {
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-banner-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rw-banner-error {
  color: var(--ui-red);
  background: color-mix(in srgb, var(--ui-red) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 30%, transparent);
}
.rw-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 18px;
  background: var(--ui-bg-card);
  border-top: 1px solid var(--ui-stroke-tertiary);
}
.rw-reassure {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--ui-text-tertiary);
}
.rw-reassure .rw-icon {
  flex: none;
  color: var(--ui-green);
}
.rw-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.rw-panel .rw-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-panel .rw-button:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rw-panel .rw-button:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-panel .rw-primary {
  font-weight: 600;
  color: var(--dt-primary-foreground, #fcfcfc);
  background: var(--dt-primary, var(--ui-accent));
  border-color: transparent;
}
.rw-panel .rw-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--dt-primary, var(--ui-accent)) 88%, var(--ui-base));
}
.rw-kbd {
  padding: 1px 5px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 10px;
  line-height: 1.5;
  color: color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 78%, transparent);
  background: color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 18%, transparent);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 35%, transparent);
  border-top-color: var(--dt-primary-foreground, #fcfcfc);
  border-radius: 999px;
  animation: rw-spin 700ms linear infinite;
}
@keyframes rw-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .rw-spinner {
    animation-duration: 2.4s;
  }
}
@media (max-width: 520px) {
  .rw-overlay {
    padding: 12px;
  }
  .rw-panel {
    max-height: calc(100vh - 24px);
  }
  .rw-grid {
    grid-template-columns: 1fr;
  }
  .rw-footer {
    align-items: flex-start;
    flex-direction: column;
  }
  .rw-actions {
    width: 100%;
  }
  .rw-actions .rw-button {
    flex: 1;
    justify-content: center;
  }
}
`;

export function ForkDialog({
  ctx,
  session,
  event,
  onClose,
  onCreated
}: ForkDialogProps): ReactNode {
  const [model, setModel] = useState(session.model ?? '');
  const [prompt, setPrompt] = useState('');
  const [verifyCmd, setVerifyCmd] = useState('');
  const [plan, setPlan] = useState<ForkPlan | null>(null);
  const [resolution, setResolution] = useState<VerifyResolution | null>(null);
  const [busyAction, setBusyAction] = useState<'prepare' | 'run' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const disposers = useRef<(() => void)[]>([]);
  const busy = busyAction !== null;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const submitRef = useRef<() => void>(() => {});
  const close = useCallback((): void => {
    if (busy) {
      return;
    }
    setClosing(true);
    disposers.current.push(ctx.setTimeout(onClose, 100));
  }, [busy, ctx, onClose]);

  useEffect(() => {
    const stops = disposers.current;
    return (): void => {
      for (const stop of stops) {
        stop();
      }
    };
  }, []);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return (): void => {
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (keyEvent: KeyboardEvent): void => {
      if (keyEvent.key === 'Escape' && !busy) {
        close();
        return;
      }
      if (keyEvent.key === 'Tab') {
        trapFocus(panelRef.current, keyEvent);
        return;
      }
      if (keyEvent.key === 'Enter' && (keyEvent.metaKey || keyEvent.ctrlKey) && !busy) {
        keyEvent.preventDefault();
        submitRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return (): void => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [busy, close]);

  useEffect(() => {
    const command = verifyCmd.trim();
    if (plan === null || command === '') {
      setResolution(null);
      return;
    }
    let cancelled = false;
    const stop = ctx.setTimeout(() => {
      void resolveVerify(ctx, plan.branch_id, command)
        .then((value) => {
          if (!cancelled) {
            setResolution(value);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResolution(null);
          }
        });
    }, RESOLVE_DEBOUNCE_MS);
    return (): void => {
      cancelled = true;
      stop();
    };
  }, [ctx, plan, verifyCmd]);

  const resolveLiveParent = async (): Promise<LiveParent> => {
    const active = await host.request<ActiveSessions>('session.active_list', {});
    const activeSessions = Array.isArray(active.sessions) ? active.sessions : [];
    const runtimeId =
      activeSessions.find((item) => item.session_key === session.session_id)?.id ??
      activeSessions.find((item) => item.id === session.session_id)?.id;
    if (runtimeId === undefined) {
      return { runtimeId: undefined, storedId: session.stored_session_id };
    }
    try {
      const titled = await host.request<SessionTitleResult>('session.title', {
        session_id: runtimeId
      });
      return { runtimeId, storedId: titled.session_key ?? session.stored_session_id };
    } catch {
      return { runtimeId, storedId: session.stored_session_id };
    }
  };

  const prepare = async (): Promise<void> => {
    setBusyAction('prepare');
    setError(null);
    setNotice(null);
    try {
      const liveParent = await resolveLiveParent();
      const prepared = await prepareFork(ctx, {
        session_id: session.session_id,
        stored_session_id: liveParent.storedId,
        event_id: event.id,
        model: model.trim() || null,
        provider: null,
        prompt: prompt.trim() || null,
        verify_cmd: verifyCmd.trim() || null
      });
      setPlan(prepared);
      setPrompt(prepared.prompt);
      if (prepared.verify_presets.length > 0 && verifyCmd.trim() === '') {
        setVerifyCmd(prepared.verify_presets[0] ?? '');
      }
      if (prepared.model !== null) {
        setModel(prepared.model);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusyAction(null);
    }
  };

  const run = async (): Promise<void> => {
    if (plan === null) {
      return;
    }
    setBusyAction('run');
    setError(null);
    setNotice(null);
    try {
      const liveParent = await resolveLiveParent();
      const runtimeId = liveParent.runtimeId;
      const title = `↺ ${session.title ?? shortId(session.session_id)} · ${shortId(plan.branch_id)}`;
      let throughId: number | null = null;
      if (runtimeId !== undefined) {
        try {
          const history = await host.request<HistoryResult>('session.history', {
            session_id: runtimeId
          });
          throughId = branchPoint(history.messages, plan.fork_before_ts);
        } catch {
          throughId = null;
        }
      }
      let childId: string;
      let childStoredId: string;
      let freshSession = false;
      if (throughId !== null && runtimeId !== undefined) {
        const branch = await labelled(
          'could not branch the session',
          host.request<BranchRpcResult>('session.branch', {
            session_id: runtimeId,
            through_message_id: throughId
          })
        );
        childId = branch.session_id;
        childStoredId = branch.stored_session_id;
      } else {
        const createParams: Record<string, unknown> = {
          source: 'desktop',
          title
        };
        if (plan.worktree_path !== null) {
          createParams.cwd = plan.worktree_path;
        }
        if (liveParent.storedId !== null) {
          createParams.parent_session_id = liveParent.storedId;
        }
        const created = await labelled(
          'could not create the branch session',
          host.request<CreateRpcResult>('session.create', createParams)
        );
        childId = created.session_id;
        childStoredId = created.stored_session_id;
        freshSession = true;
      }
      if (freshSession && plan.worktree_path !== null) {
        const attach = (): Promise<unknown> =>
          host.request('session.cwd.set', { session_id: childId, cwd: plan.worktree_path });
        try {
          await labelled('could not attach the isolated workspace', attach());
        } catch (attachError) {
          throw attachError instanceof Error
            ? new Error(
                `The rerun was not started because the isolated workspace could not be attached: ${errorMessage(attachError)}`
              )
            : new Error(
                'The rerun was not started because the isolated workspace could not be attached.'
              );
        }
      }
      if (model.trim() && model.trim() !== (session.model ?? '')) {
        try {
          const config = await host.request<ConfigSetResult>('config.set', {
            key: 'model',
            value: model.trim(),
            session_id: childId,
            confirm_expensive_model: false
          });
          if (config.confirm_required === true) {
            setNotice(
              config.confirm_message ??
                'The model switch needs confirmation; the branch continues with the current model.'
            );
          }
        } catch {
          setNotice(
            'The branch was created, but the model switch failed; the rerun uses the current model.'
          );
        }
      }
      const finalPrompt = prompt.trim() || plan.prompt;
      await labelled(
        'could not record the branch',
        commitFork(ctx, plan.branch_id, {
          child_session_id: childId,
          child_stored_session_id: childStoredId,
          model: model.trim() || null,
          provider: null,
          prompt: finalPrompt,
          verify_cmd: verifyCmd.trim() || null
        })
      );
      await labelled(
        'could not start the rerun',
        host.request('prompt.submit', { session_id: childId, text: finalPrompt })
      );
      onCreated(plan.branch_id);
      host.openSession(childStoredId, { intent: 'tab' });
      onClose();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusyAction(null);
    }
  };

  submitRef.current = (): void => {
    if (plan === null) {
      void prepare();
    } else {
      void run();
    }
  };

  const prepared = plan !== null;
  const activePreset = verifyCmd.trim();
  const notes: { warn: boolean; text: string }[] = [];
  if (prepared) {
    if (plan.fidelity !== 'full') {
      notes.push({
        warn: true,
        text: 'No workspace snapshot matched this turn. The rerun starts from the current workspace.'
      });
    }
    if (plan.context_rows === null) {
      notes.push({
        warn: true,
        text: 'The live transcript prefix is unavailable. The context pack is the only context.'
      });
    }
    if (session.ended_at !== null) {
      notes.push({
        warn: false,
        text: 'This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript.'
      });
    }
    if (plan.fork_row_count === 0 && session.ended_at === null) {
      notes.push({
        warn: false,
        text: 'This is the first turn. The rerun starts a fresh chat in the restored workspace.'
      });
    }
  } else {
    notes.push({
      warn: false,
      text: 'Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork.'
    });
  }

  return (
    <div
      className="rw-overlay"
      data-closing={closing ? 'true' : 'false'}
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) {
          close();
        }
      }}
    >
      <style>{DIALOG_CSS}</style>
      <div
        className="rw-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rw-title"
        aria-describedby="rw-reassure"
        tabIndex={-1}
        ref={panelRef}
      >
        <header className="rw-head">
          <span className="rw-mark">
            <Icon name="rewind" size={16} />
          </span>
          <div className="rw-heading">
            <div className="rw-eyebrow">Session Rewind</div>
            <div className="rw-title" id="rw-title">
              Rewind to this turn
            </div>
          </div>
          <button
            type="button"
            className="rw-close"
            onClick={close}
            disabled={busy}
            aria-label="Close"
          >
            <Icon name="close" size={15} />
          </button>
        </header>

        <div className="rw-body">
          <div className="rw-turn">
            <span className="rw-turn-time">{formatTime(event.ts)}</span>
            <span className="rw-turn-text">{event.preview || 'user turn'}</span>
          </div>

          {error !== null ? (
            <div className="rw-banner rw-banner-error" role="alert">
              {error}
            </div>
          ) : null}
          {notice !== null ? (
            <div className="rw-banner rw-banner-warn" role="status">
              {notice}
            </div>
          ) : null}

          {prepared && plan.worktree_path ? (
            <div className="rw-path">
              <span className="rw-path-text" title={plan.worktree_path}>
                {plan.worktree_path}
              </span>
              <button
                type="button"
                className="rw-icon-button"
                onClick={() => {
                  ctx.os.revealPath(plan.worktree_path ?? '');
                }}
                disabled={busy}
                aria-label="Reveal the isolated workspace"
              >
                <Icon name="folder" size={13} />
              </button>
            </div>
          ) : null}

          {notes.length > 0 ? (
            <div className="rw-notes">
              {notes.map((note) => (
                <div
                  className={`rw-note${note.warn ? ' rw-note-warn' : ''}`}
                  key={note.text}
                  role={note.warn ? 'status' : undefined}
                >
                  <Icon name="info" />
                  <span>{note.text}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="rw-grid">
            <label className="rw-field">
              <span className="rw-label">Model</span>
              <input
                className="rw-input"
                value={model}
                onChange={(changeEvent) => {
                  setModel(changeEvent.target.value);
                }}
                placeholder="provider/model"
              />
              <span className="rw-help">Leave unchanged to keep the session model.</span>
            </label>

            <label className="rw-field">
              <span className="rw-label">Verify command</span>
              <input
                className="rw-input"
                value={verifyCmd}
                onChange={(changeEvent) => {
                  setVerifyCmd(changeEvent.target.value);
                }}
                placeholder="python -m pytest -q"
              />
              <div className="rw-chips">
                {(plan?.verify_presets.length ? plan.verify_presets : VERIFY_PRESETS).map(
                  (preset) => (
                    <button
                      type="button"
                      key={preset}
                      className="rw-preset"
                      aria-pressed={preset === activePreset}
                      onClick={() => {
                        setVerifyCmd(preset);
                      }}
                      disabled={busy}
                    >
                      {preset}
                    </button>
                  )
                )}
              </div>
              <span className="rw-help">
                Runs in the restored workspace with the gateway environment.
              </span>
              {resolution !== null && resolution.command === verifyCmd.trim() ? (
                <span className="rw-resolved">
                  {resolution.resolved === null ? (
                    'Not found in the gateway environment. Use the full interpreter path.'
                  ) : (
                    <>
                      <span>Resolves to</span>
                      <span className="rw-resolved-path" title={resolution.resolved}>
                        {resolution.resolved}
                      </span>
                    </>
                  )}
                </span>
              ) : null}
            </label>
          </div>

          <label className="rw-field">
            <span className="rw-label-row">
              <span className="rw-label">Prompt for the rerun</span>
              <span className="rw-count" aria-live="polite">
                {prompt.length} chars
              </span>
            </span>
            <textarea
              className="rw-textarea"
              value={prompt}
              onChange={(changeEvent) => {
                setPrompt(changeEvent.target.value);
              }}
              placeholder="Prepare the branch to draft the rerun prompt, or write your own."
            />
          </label>
        </div>

        <footer className="rw-footer">
          <span className="rw-reassure" id="rw-reassure">
            <Icon name="lock" size={13} />
            <span>Original session and workspace stay untouched.</span>
          </span>
          <div className="rw-actions">
            <button type="button" className="rw-button" onClick={close} disabled={busy}>
              Cancel
            </button>
            {!prepared ? (
              <button
                type="button"
                className="rw-button rw-primary"
                onClick={() => {
                  void prepare();
                }}
                disabled={busy}
                aria-busy={busyAction === 'prepare'}
              >
                {busyAction === 'prepare' ? <span className="rw-spinner" /> : null}
                {busyAction === 'prepare' ? 'Preparing' : 'Prepare branch'}
                {busyAction === 'prepare' ? null : <span className="rw-kbd">Ctrl ↵</span>}
              </button>
            ) : (
              <button
                type="button"
                className="rw-button rw-primary"
                onClick={() => {
                  void run();
                }}
                disabled={busy}
                aria-busy={busyAction === 'run'}
              >
                {busyAction === 'run' ? <span className="rw-spinner" /> : null}
                {busyAction === 'run' ? 'Forking' : 'Fork & run'}
                {busyAction === 'run' ? null : <span className="rw-kbd">Ctrl ↵</span>}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

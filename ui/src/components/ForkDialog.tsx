import { host, useTheme } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { commitFork, prepareFork, resolveVerify } from '../api';
import type { EventSummary, ForkPlan, SessionSummary, VerifyResolution } from '../api';
import { errorMessage, formatTime, plural, shortId } from '../format';
import { branchPoint } from '../forkPrefix';
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
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 28px 20px;
  overflow-y: auto;
  background: rgba(4, 6, 9, 0.72);
  backdrop-filter: blur(3px);
}
.rw-panel {
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: calc(100vh - 56px);
  margin: auto 0;
  overflow: hidden;
  color: var(--ui-text, #ececf1);
  background: var(--ui-bg, #15161a);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 14px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.62);
}
.rw-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
}
.rw-heading {
  min-width: 0;
}
.rw-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.rw-subtitle {
  max-width: 560px;
  margin-top: 4px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.45;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: none;
  padding: 0;
  font: inherit;
  font-size: 18px;
  line-height: 1;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 8px;
}
.rw-close:hover:not(:disabled) {
  color: var(--ui-text, #ececf1);
  background: rgba(255, 255, 255, 0.06);
}
.rw-panel:focus-visible {
  outline: none;
}
.rw-button:focus-visible,
.rw-close:focus-visible,
.rw-preset:focus-visible {
  outline: 2px solid var(--ui-accent, #6ea8fe);
  outline-offset: 2px;
}
.rw-input:focus-visible,
.rw-textarea:focus-visible {
  outline: none;
}
.rw-close:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px;
  overflow-y: auto;
}
.rw-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 10px;
}
.rw-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.rw-card-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-badge {
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.6;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 999px;
}
.rw-badge-idle {
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-badge-ok {
  color: #3fb950;
  background: rgba(63, 185, 80, 0.08);
  border-color: rgba(63, 185, 80, 0.35);
}
.rw-badge-warn {
  color: #e3b341;
  background: rgba(227, 179, 65, 0.08);
  border-color: rgba(227, 179, 65, 0.35);
}
.rw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.rw-chip {
  padding: 3px 8px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 6px;
}
.rw-preset {
  padding: 3px 8px;
  font: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 6px;
}
.rw-preset:hover {
  color: var(--ui-text, #ececf1);
  border-color: var(--ui-accent, #6ea8fe);
}
.rw-resolved {
  margin-top: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-path {
  margin-top: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  word-break: break-all;
}
.rw-note {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #e3b341;
}
.rw-note-muted {
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.rw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.rw-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-input,
.rw-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 9px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text, #ececf1);
  outline: none;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 8px;
}
.rw-input {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.rw-input:focus,
.rw-textarea:focus {
  border-color: var(--ui-accent, #6ea8fe);
  box-shadow: 0 0 0 3px rgba(110, 168, 254, 0.16);
}
.rw-textarea {
  min-height: 170px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  line-height: 1.55;
  resize: vertical;
}
.rw-help {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-banner {
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: 8px;
}
.rw-banner-warn {
  color: #e3b341;
  background: rgba(227, 179, 65, 0.08);
  border-color: rgba(227, 179, 65, 0.35);
}
.rw-banner-error {
  color: #ff7b72;
  background: rgba(255, 123, 114, 0.08);
  border-color: rgba(255, 123, 114, 0.35);
}
.rw-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: rgba(0, 0, 0, 0.16);
  border-top: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
}
.rw-hint {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.rw-button {
  padding: 8px 14px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text, #ececf1);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 8px;
}
.rw-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
}
.rw-button:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-primary {
  font-weight: 600;
  color: #08111f;
  background: var(--ui-accent, #6ea8fe);
  border-color: transparent;
}
.rw-primary:hover:not(:disabled) {
  background: var(--ui-accent, #6ea8fe);
  filter: brightness(1.08);
}
.rw-light {
  background: rgba(24, 26, 30, 0.32);
}
.rw-light .rw-panel {
  color: #1c1f24;
  background: #f6f7f9;
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 24px 70px rgba(15, 18, 22, 0.24);
}
.rw-light .rw-header {
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-subtitle,
.rw-light .rw-card-title,
.rw-light .rw-chip,
.rw-light .rw-path,
.rw-light .rw-label,
.rw-light .rw-help,
.rw-light .rw-hint,
.rw-light .rw-badge-idle,
.rw-light .rw-resolved {
  color: rgba(28, 31, 36, 0.62);
}
.rw-light .rw-note.rw-note-muted {
  color: rgba(28, 31, 36, 0.62);
}
.rw-light .rw-close {
  color: rgba(28, 31, 36, 0.62);
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-close:hover:not(:disabled) {
  color: #1c1f24;
  background: rgba(0, 0, 0, 0.06);
}
.rw-light .rw-card {
  background: rgba(0, 0, 0, 0.035);
  border-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-badge {
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-badge-ok {
  color: #1a7f37;
  background: rgba(26, 127, 55, 0.08);
  border-color: rgba(26, 127, 55, 0.32);
}
.rw-light .rw-badge-warn,
.rw-light .rw-note,
.rw-light .rw-banner-warn {
  color: #9a6700;
}
.rw-light .rw-banner-warn {
  background: rgba(154, 103, 0, 0.08);
  border-color: rgba(154, 103, 0, 0.3);
}
.rw-light .rw-banner-error {
  color: #cf222e;
  background: rgba(207, 34, 46, 0.07);
  border-color: rgba(207, 34, 46, 0.3);
}
.rw-light .rw-chip {
  border-color: rgba(0, 0, 0, 0.12);
}
.rw-light .rw-preset {
  color: rgba(28, 31, 36, 0.72);
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-preset:hover {
  color: #1c1f24;
  background: rgba(0, 0, 0, 0.05);
  border-color: #1f6feb;
}
.rw-light .rw-input,
.rw-light .rw-textarea {
  color: #1c1f24;
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.16);
}
.rw-light .rw-input:focus,
.rw-light .rw-textarea:focus {
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.22);
}
.rw-light .rw-footer {
  background: rgba(0, 0, 0, 0.03);
  border-top-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-button {
  color: #1c1f24;
  border-color: rgba(0, 0, 0, 0.16);
}
.rw-light .rw-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}
.rw-light .rw-primary {
  color: #ffffff;
  background: #1f6feb;
}
.rw-light .rw-primary:hover:not(:disabled) {
  background: #1a63d8;
}
@media (max-width: 620px) {
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
  const light = useTheme().resolvedMode === 'light';
  const [model, setModel] = useState(session.model ?? '');
  const [prompt, setPrompt] = useState('');
  const [verifyCmd, setVerifyCmd] = useState('');
  const [plan, setPlan] = useState<ForkPlan | null>(null);
  const [resolution, setResolution] = useState<VerifyResolution | null>(null);
  const [busyAction, setBusyAction] = useState<'prepare' | 'run' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const busy = busyAction !== null;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const submitRef = useRef<() => void>(() => {});

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
        onClose();
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
  }, [busy, onClose]);

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
      const title = `↺ ${session.title ?? shortId(session.session_id)}`;
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

  const fidelity = plan === null ? 'not prepared' : plan.fidelity;
  const badgeClass =
    plan === null
      ? 'rw-badge rw-badge-idle'
      : plan.fidelity === 'full'
        ? 'rw-badge rw-badge-ok'
        : 'rw-badge rw-badge-warn';

  return (
    <div
      className={light ? 'rw-overlay rw-light' : 'rw-overlay'}
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <style>{DIALOG_CSS}</style>
      <div
        className="rw-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rw-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <header className="rw-header">
          <div className="rw-heading">
            <div className="rw-title" id="rw-title">
              Rewind to this turn
            </div>
            <div className="rw-subtitle">
              {formatTime(event.ts)} · {event.preview || 'user turn'}
            </div>
          </div>
          <button
            type="button"
            className="rw-close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="rw-body">
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
          <section className="rw-card">
            <div className="rw-card-head">
              <span className="rw-card-title">Checkpoint</span>
              <span className={badgeClass}>
                {fidelity === 'full' ? 'workspace ready' : fidelity}
              </span>
            </div>
            <div className="rw-chips">
              <span className="rw-chip">
                {plan === null
                  ? 'carries —'
                  : plan.fork_row_count > 0
                    ? `carries ${plural(plan.fork_row_count, 'message')}`
                    : 'carries the context pack'}
              </span>
              <span className="rw-chip">
                verify timeout {plan === null ? '—' : `${plan.verify_timeout_seconds}s`}
              </span>
              {plan?.snapshot_commit ? (
                <span className="rw-chip">snapshot {plan.snapshot_commit.slice(0, 8)}</span>
              ) : null}
            </div>
            {plan?.worktree_path ? (
              <div className="rw-path">{plan.worktree_path}</div>
            ) : (
              <div className="rw-note rw-note-muted">
                Prepares an isolated worktree from the nearest snapshot. The original workspace is
                not changed.
              </div>
            )}
            {plan !== null && plan.fidelity !== 'full' ? (
              <div className="rw-note">
                No workspace snapshot matched this turn. The rerun starts from the current
                workspace.
              </div>
            ) : null}
            {plan !== null && plan.context_rows === null ? (
              <div className="rw-note">
                The live transcript prefix is unavailable. The context pack is the only context.
              </div>
            ) : null}
            {plan !== null && session.ended_at !== null ? (
              <div className="rw-note rw-note-muted">
                This session is closed, so the rerun starts a new chat carrying the recorded context
                instead of branching the original transcript.
              </div>
            ) : null}
            {plan !== null && plan.fork_row_count === 0 && session.ended_at === null ? (
              <div className="rw-note rw-note-muted">
                This is the first turn. The rerun starts a fresh chat in the restored workspace.
              </div>
            ) : null}
          </section>

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
                  {resolution.resolved === null
                    ? 'Not found in the gateway environment. Use the full interpreter path.'
                    : `Resolves to ${resolution.resolved}`}
                </span>
              ) : null}
            </label>
          </div>

          <label className="rw-field">
            <span className="rw-label">Prompt for the rerun</span>
            <textarea
              className="rw-textarea"
              value={prompt}
              onChange={(changeEvent) => {
                setPrompt(changeEvent.target.value);
              }}
              placeholder="Prepare the branch to generate a context prompt, or write your own."
            />
            <span className="rw-help">
              Prepared from the recorded context. Edit it before running the fork.
            </span>
          </label>
        </div>

        <footer className="rw-footer">
          <span className="rw-hint">
            The original session and workspace stay untouched. Ctrl+Enter runs the primary action.
          </span>
          <div className="rw-actions">
            <button type="button" className="rw-button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            {plan === null ? (
              <button
                type="button"
                className="rw-button rw-primary"
                onClick={() => {
                  void prepare();
                }}
                disabled={busy}
              >
                {busyAction === 'prepare' ? 'Preparing...' : 'Prepare branch'}
              </button>
            ) : (
              <button
                type="button"
                className="rw-button rw-primary"
                onClick={() => {
                  void run();
                }}
                disabled={busy}
              >
                {busyAction === 'run' ? 'Forking...' : 'Fork & run'}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

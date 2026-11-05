import { host } from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import { useState } from 'react';
import type { ReactNode } from 'react';

import {
  commitFork,
  prepareFork
} from '../api';
import type {
  EventSummary,
  ForkPlan,
  SessionSummary
} from '../api';
import { errorMessage, formatTime, shortId } from '../format';

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

interface HistoryMessage {
  role: string;
  text?: string | null;
  content?: unknown;
  timestamp?: number | null;
  row_id?: number | null;
}

interface HistoryResult {
  count: number;
  messages?: HistoryMessage[];
}

interface ConfigSetResult {
  confirm_required?: boolean;
  confirm_message?: string;
}

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

function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function messageText(message: HistoryMessage): string {
  if (typeof message.text === 'string' && message.text.trim()) {
    return message.text.trim();
  }
  const content = message.content;
  if (typeof content === 'string') {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part !== 'object' || part === null || !('text' in part)) {
          return '';
        }
        const text = (part as { text?: unknown }).text;
        return typeof text === 'string' ? text : '';
      })
      .join('')
      .trim();
  }
  return '';
}

function branchPoint(messages: HistoryMessage[] | undefined, forkTs: number): number | null {
  const rows = (messages ?? []).filter(
    (message) =>
      (message.role === 'user' || message.role === 'assistant') &&
      messageText(message).length > 0 &&
      typeof message.row_id === 'number'
  );
  let target = -1;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row === undefined) {
      continue;
    }
    const timestamp = row.timestamp;
    if (row.role === 'user' && typeof timestamp === 'number' && timestamp <= forkTs + 0.5) {
      target = index;
    }
  }
  if (target <= 0) {
    return null;
  }
  const rowId = rows[target - 1]?.row_id;
  return typeof rowId === 'number' && rowId > 0 ? rowId : null;
}

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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
    setBusy(true);
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
      if (prepared.model !== null) {
        setModel(prepared.model);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const run = async (): Promise<void> => {
    if (plan === null) {
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const liveParent = await resolveLiveParent();
      if (liveParent.runtimeId === undefined) {
        throw new Error('The session is not live. Open it in Hermes Desktop and try again.');
      }
      const title = `↺ ${session.title ?? shortId(session.session_id)}`;
      let throughId: number | null = null;
      try {
        const history = await host.request<HistoryResult>('session.history', {
          session_id: liveParent.runtimeId
        });
        throughId = branchPoint(history.messages, plan.fork_before_ts);
      } catch {
        throughId = null;
      }
      let childId: string;
      let childStoredId: string;
      let freshSession = false;
      if (throughId !== null) {
        const branch = await host.request<BranchRpcResult>('session.branch', {
          session_id: liveParent.runtimeId,
          through_message_id: throughId
        });
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
        const created = await host.request<CreateRpcResult>('session.create', createParams);
        childId = created.session_id;
        childStoredId = created.stored_session_id;
        freshSession = true;
      }
      if (!freshSession && plan.worktree_path !== null) {
        try {
          await host.request('session.cwd.set', {
            session_id: childId,
            cwd: plan.worktree_path
          });
        } catch {
          await delay(400);
          try {
            await host.request('session.cwd.set', {
              session_id: childId,
              cwd: plan.worktree_path
            });
          } catch {
            setNotice(
              'The branch was created, but the isolated workspace could not be attached. The rerun will use the original workspace.'
            );
          }
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
      await host.request('prompt.submit', {
        session_id: childId,
        text: finalPrompt
      });
      await commitFork(ctx, plan.branch_id, {
        child_session_id: childStoredId,
        child_stored_session_id: childStoredId,
        model: model.trim() || null,
        provider: null,
        prompt: finalPrompt,
        verify_cmd: verifyCmd.trim() || null
      });
      onCreated(plan.branch_id);
      host.openSession(childStoredId, { intent: 'tab' });
      onClose();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-6">
      <div className="w-full max-w-2xl rounded-lg border border-(--ui-border) bg-(--ui-bg) p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-(--ui-border) pb-2">
          <div>
            <div className="text-base font-medium">Rewind to this turn</div>
            <div className="text-xs text-(--ui-text-tertiary)">
              {formatTime(event.ts)} · {event.preview || 'user turn'}
            </div>
          </div>
          <button
            type="button"
            className="rounded border border-(--ui-border) px-2 py-1 text-xs"
            onClick={onClose}
            disabled={busy}
          >
            Close
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-(--ui-text-tertiary)">
              Model (leave unchanged to keep the current model)
            </span>
            <input
              className="w-full rounded border border-(--ui-border) bg-transparent p-2 font-mono text-xs"
              value={model}
              onChange={(changeEvent) => {
                setModel(changeEvent.target.value);
              }}
              placeholder="provider/model"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="text-(--ui-text-tertiary)">Verify command</span>
            <input
              className="w-full rounded border border-(--ui-border) bg-transparent p-2 font-mono text-xs"
              value={verifyCmd}
              onChange={(changeEvent) => {
                setVerifyCmd(changeEvent.target.value);
              }}
              placeholder="pytest -q"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="text-(--ui-text-tertiary)">
              Prompt for the rerun (prepared from the recorded context)
            </span>
            <textarea
              className="min-h-40 w-full rounded border border-(--ui-border) bg-transparent p-2 font-mono text-xs"
              value={prompt}
              onChange={(changeEvent) => {
                setPrompt(changeEvent.target.value);
              }}
              placeholder="Prepare the branch to generate a context prompt, or write your own."
            />
          </label>

          {plan !== null ? (
            <div className="rounded border border-(--ui-border) p-2 text-xs">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-(--ui-text-tertiary)">
                <span>fidelity: {plan.fidelity}</span>
                <span>history rows before turn: {plan.fork_row_count}</span>
                <span>verify timeout: {plan.verify_timeout_seconds}s</span>
              </div>
              {plan.worktree_path !== null ? (
                <div className="mt-1 break-all font-mono text-[11px] text-(--ui-text-tertiary)">
                  workspace: {plan.worktree_path}
                </div>
              ) : null}
              {plan.fidelity !== 'full' ? (
                <div className="mt-1 text-amber-500">
                  No workspace snapshot matched this turn. The rerun will start from the current workspace.
                </div>
              ) : null}
              {plan.context_rows === null ? (
                <div className="mt-1 text-amber-500">
                  The live transcript prefix is unavailable. The context pack is the only context.
                </div>
              ) : null}
              {plan.fork_row_count === 0 ? (
                <div className="mt-1 text-(--ui-text-tertiary)">
                  This is the first turn. The rerun starts a fresh chat in the restored workspace.
                </div>
              ) : null}
            </div>
          ) : null}

          {notice !== null ? <div className="text-xs text-amber-500">{notice}</div> : null}
          {error !== null ? <div className="text-xs text-red-500">{error}</div> : null}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded border border-(--ui-border) px-3 py-1.5 text-xs disabled:opacity-50"
              onClick={() => {
                void prepare();
              }}
              disabled={busy}
            >
              Prepare branch
            </button>
            <button
              type="button"
              className="rounded bg-(--ui-accent) px-3 py-1.5 text-xs text-white disabled:opacity-50"
              onClick={() => {
                void run();
              }}
              disabled={busy || plan === null}
            >
              Fork &amp; run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

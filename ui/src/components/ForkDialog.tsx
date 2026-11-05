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

interface ConfigSetResult {
  confirm_required?: boolean;
  confirm_message?: string;
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
  const live = session.ended_at === null;

  const prepare = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const prepared = await prepareFork(ctx, {
        session_id: session.session_id,
        stored_session_id: session.stored_session_id,
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
      const branch = await host.request<BranchRpcResult>('session.branch', {
        session_id: session.session_id,
        count: plan.fork_row_count,
        name: `↺ ${session.title ?? shortId(session.session_id)}`,
        idempotency_key: crypto.randomUUID()
      });
      const childId = branch.session_id;
      if (plan.worktree_path !== null) {
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
      }
      const finalPrompt = prompt.trim() || plan.prompt;
      await host.request('prompt.submit', {
        session_id: childId,
        text: finalPrompt
      });
      await commitFork(ctx, plan.branch_id, {
        child_session_id: childId,
        child_stored_session_id: branch.stored_session_id,
        model: model.trim() || null,
        provider: null,
        prompt: finalPrompt
      });
      onCreated(plan.branch_id);
      host.openSession(branch.stored_session_id, { intent: 'tab' });
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

        {!live ? (
          <div className="mt-2 text-xs text-amber-500">
            This session has ended. The native branch requires a live session.
          </div>
        ) : null}

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
                <span>context rows: {plan.context_rows ?? 'unavailable'}</span>
                <span>branch rows: {plan.fork_row_count}</span>
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
                  The transcript prefix is unavailable. The context pack is the only context.
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
              disabled={busy || plan === null || !live}
            >
              Fork &amp; run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

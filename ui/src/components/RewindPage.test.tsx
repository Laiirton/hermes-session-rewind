// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { RewindPage } from './RewindPage';
import type { PluginContext } from '@hermes/plugin-sdk';
import type { BranchDetail, BranchSummary, SessionSummary, TurnPage, TurnSummary } from '../api';

const TS = 1_700_000_000;

function session(id: string, eventCount: number): SessionSummary {
  return {
    session_id: `session-${id}`,
    stored_session_id: null,
    parent_session_id: null,
    title: `chat ${id}`,
    cwd: '/work/demo',
    model: 'test/model',
    provider: null,
    platform: 'desktop',
    started_at: TS,
    ended_at: TS + 60,
    outcome: 'completed',
    event_count: eventCount,
    last_event_at: TS + 60,
    tokens_in: 100,
    tokens_out: 50,
    cost_usd: 0
  };
}

function turn(id: string, preview: string): TurnSummary {
  return {
    id: id === 'a' ? 1 : 2,
    session_id: `session-${id}`,
    seq: 2,
    ts: TS,
    kind: 'user_turn',
    name: null,
    status: null,
    duration_ms: null,
    turn_id: `session-${id}`,
    tool_call_id: null,
    api_request_id: null,
    preview,
    seq_to: 12,
    last_ts: TS + 5,
    work_ts: TS + 5,
    event_count: 10,
    tool_calls: 3,
    tool_errors: 1,
    api_requests: 2
  };
}

function page(items: TurnSummary[]): TurnPage {
  return { items, before_seq: null, has_more: false };
}

function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((ready) => {
    resolve = ready;
  });
  return { promise, resolve };
}

const sessions = [session('a', 12), session('b', 9), session('c', 77)];

interface Harness {
  ctx: PluginContext;
  requests: () => number;
  emit: (count: number) => void;
}

function harness(handlers: (path: string) => Promise<unknown> | undefined): Harness {
  const listeners: ((payload: unknown) => void)[] = [];
  let counted = 0;
  const ctx = {
    register: (): (() => void) => () => {},
    registerMany: (): (() => void) => () => {},
    rest: (path: string) => {
      counted += 1;
      const answered = handlers(path);
      if (answered === undefined) {
        return Promise.reject(new Error(`unexpected rest path ${path}`));
      }
      return answered;
    },
    onEvent: (_type: string, listener: (payload: unknown) => void) => {
      listeners.push(listener);
      return (): void => {};
    },
    onDispose: () => {},
    setTimeout: (fn: () => void, ms: number): (() => void) => {
      const id = setTimeout(fn, ms);
      return (): void => {
        clearTimeout(id);
      };
    },
    setInterval: (): (() => void) => () => {},
    addEventListener: (): (() => void) => () => {},
    os: {
      notify: () => {},
      openExternal: () => {},
      revealPath: () => {},
      writeClipboard: () => {}
    }
  } as unknown as PluginContext;
  return {
    ctx,
    requests: (): number => counted,
    emit: (count: number): void => {
      for (let index = 0; index < count; index += 1) {
        for (const listener of listeners) {
          listener({});
        }
      }
    }
  };
}

afterEach(() => {
  cleanup();
});

describe('RewindPage timeline panel', () => {
  it('shows a loading panel while the selected session turns are in flight', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    const listed = screen
      .getAllByText(/Sessions/)
      .some((element) => /Sessions\s*3/.test(element.textContent ?? ''));
    expect(listed).toBe(true);

    fireEvent.click(screen.getByText('chat b'));

    expect(screen.queryByText(/but no user turn\./)).toBeNull();
    expect(screen.queryByText(/came back/)).toBeNull();
    expect(screen.getByText('Loading turns...')).toBeDefined();

    turnsB.resolve(page([turn('b', 'the b turn')]));
    await screen.findByText('the b turn');
  });

  it('states what a recording without user turns holds', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByText('chat c'));
    await screen.findByText('The recording holds 77 events but no user turn.');
  });

  it('coalesces a burst of host events into one refresh', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    const before = host.requests();
    host.emit(40);
    await new Promise((ready) => setTimeout(ready, 50));
    expect(host.requests() - before).toBeLessThanOrEqual(1);

    await waitFor(() => expect(screen.getByText('the a turn')).toBeDefined());
  });

  it('paints the first timeline well inside the one second target', async () => {
    const started = performance.now();
    const host = harness(
      routeTurns(
        { promise: Promise.resolve(page([turn('a', 'the a turn')])) },
        { promise: Promise.resolve(page([])) }
      )
    );
    render(<RewindPage ctx={host.ctx} />);
    await screen.findByText('the a turn');
    expect(performance.now() - started).toBeLessThan(1000);
  });
});

describe('RewindPage cleanup confirmation', () => {
  it('names the uncommitted files before the workspace is deleted', async () => {
    const state = { calls: [] as string[], uncommitted: 2 };
    await openBranchPanel(state);

    fireEvent.click(screen.getByRole('button', { name: 'Cleanup' }));

    expect(await screen.findByText(/holds 2 uncommitted files/)).toBeDefined();
    expect(state.calls.some((path) => path.includes('/cleanup'))).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));

    await waitFor(() =>
      expect(state.calls.filter((path) => path.includes('/cleanup'))).toHaveLength(1)
    );
    expect(screen.queryByText(/holds 2 uncommitted files/)).toBeNull();
  });

  it('deletes a workspace with nothing uncommitted without asking', async () => {
    const state = { calls: [] as string[], uncommitted: 0 };
    await openBranchPanel(state);

    fireEvent.click(screen.getByRole('button', { name: 'Cleanup' }));

    await waitFor(() =>
      expect(state.calls.filter((path) => path.includes('/cleanup'))).toHaveLength(1)
    );
    expect(screen.queryByText(/uncommitted/)).toBeNull();
  });

  it('asks when git cannot read the workspace and keeps Escape inside the dialog', async () => {
    const state = { calls: [] as string[], uncommitted: null };
    await openBranchPanel(state);

    fireEvent.click(screen.getByRole('button', { name: 'Cleanup' }));

    expect(await screen.findByText(/could not read this workspace/)).toBeDefined();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText(/could not read/)).toBeNull());
    expect(screen.getByText('Branch branch-1')).toBeDefined();
    expect(state.calls.some((path) => path.includes('/cleanup'))).toBe(false);
  });
});

function branchSummary(state: string, worktree: string | null): BranchSummary {
  return {
    id: 'branch-1',
    parent_session_id: 'session-a',
    fork_before_ts: TS,
    fork_row_count: 3,
    snapshot_id: null,
    child_session_id: null,
    child_stored_session_id: null,
    worktree_path: worktree,
    model: null,
    provider: null,
    verify_cmd: null,
    state,
    created_at: TS,
    updated_at: TS + 60
  };
}

function branchDetail(worktree: string | null): BranchDetail {
  return {
    branch: branchSummary('running', worktree),
    run: null,
    prompt: 'rerun the turn',
    shared_child: false
  };
}

function routeBranchFlow(state: {
  calls: string[];
  uncommitted: number | null;
}): (path: string) => Promise<unknown> | undefined {
  return (path: string) => {
    state.calls.push(path);
    if (path.startsWith('/sessions?limit')) {
      return Promise.resolve({ items: sessions, limit: 100, offset: 0 });
    }
    if (path.includes('/turns')) {
      return Promise.resolve(page([turn('a', 'the a turn')]));
    }
    if (path.includes('/snapshots')) {
      return Promise.resolve([]);
    }
    if (path === '/sessions/session-a/branches') {
      return Promise.resolve([branchSummary('running', '/work/.hermes-rewind/branch-1')]);
    }
    if (path.includes('/reconcile')) {
      return Promise.resolve(branchDetail('/work/.hermes-rewind/branch-1'));
    }
    if (path.includes('/workspace')) {
      return Promise.resolve({
        worktree_path: '/work/.hermes-rewind/branch-1',
        uncommitted: state.uncommitted
      });
    }
    if (path.includes('/cleanup')) {
      return Promise.resolve(branchDetail(null));
    }
    return undefined;
  };
}

async function openBranchPanel(state: {
  calls: string[];
  uncommitted: number | null;
}): Promise<Harness> {
  const host = harness(routeBranchFlow(state));
  render(<RewindPage ctx={host.ctx} />);
  await screen.findByText('the a turn');
  fireEvent.click(screen.getByText('branch-1'));
  await screen.findByText('Branch branch-1');
  return host;
}

function routeTurns(
  turnsA: { promise: Promise<TurnPage> },
  turnsB: { promise: Promise<TurnPage> }
): (path: string) => Promise<unknown> | undefined {
  return (path: string) => {
    if (path.startsWith('/sessions?limit')) {
      return Promise.resolve({ items: sessions, limit: 100, offset: 0 });
    }
    if (path.includes('/turns')) {
      if (path.includes('session-a')) {
        return turnsA.promise;
      }
      if (path.includes('session-b')) {
        return turnsB.promise;
      }
      return Promise.resolve(page([]));
    }
    if (path.includes('/snapshots') || path.includes('/branches')) {
      return Promise.resolve([]);
    }
    return undefined;
  };
}

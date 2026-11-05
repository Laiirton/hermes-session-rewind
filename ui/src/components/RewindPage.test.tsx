// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { RewindPage } from './RewindPage';
import type { PluginContext } from '@hermes/plugin-sdk';
import type { SessionSummary, TurnPage, TurnSummary } from '../api';

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

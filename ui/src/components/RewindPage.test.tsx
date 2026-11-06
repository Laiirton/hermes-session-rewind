// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { RewindPage } from './RewindPage';
import {
  hostCalls,
  resetHostStub,
  setConfigSetFailure,
  setModelOptions,
  setNativeForkScenario,
  setWorkspaceAttachFailure
} from '../../test/pluginSdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import type {
  BranchDetail,
  BranchSummary,
  EventDetail,
  EventSummary,
  ForkPlan,
  SessionSummary,
  TurnPage,
  TurnSummary
} from '../api';

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
  calls: () => { path: string; body: unknown }[];
  emit: (count: number) => void;
}

function harness(
  handlers: (path: string, body?: unknown) => Promise<unknown> | undefined
): Harness {
  const listeners: ((payload: unknown) => void)[] = [];
  const posted: { path: string; body: unknown }[] = [];
  let counted = 0;
  const ctx = {
    register: (): (() => void) => () => {},
    registerMany: (): (() => void) => () => {},
    rest: (path: string, options?: { body?: unknown }) => {
      counted += 1;
      posted.push({ path, body: options?.body });
      const answered = handlers(path, options?.body);
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
    calls: (): { path: string; body: unknown }[] => posted,
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
  resetHostStub();
  window.localStorage.clear();
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

  it('inspects a tool result with its embedded JSON unpacked and copyable', async () => {
    const events: EventSummary[] = [
      {
        id: 1325,
        session_id: 'session-a',
        seq: 3,
        ts: TS,
        kind: 'tool_result',
        name: 'web_search',
        status: 'ok',
        duration_ms: 2300,
        turn_id: 'session-a',
        tool_call_id: 't1',
        api_request_id: null,
        preview: 'beam model card'
      }
    ];
    const detail: EventDetail = {
      id: 1325,
      session_id: 'session-a',
      seq: 3,
      ts: TS,
      kind: 'tool_result',
      name: 'web_search',
      status: 'ok',
      duration_ms: 2300,
      turn_id: 'session-a',
      tool_call_id: 't1',
      api_request_id: null,
      preview: 'beam model card',
      task_id: null,
      payload: {
        args: { query: 'beam model card specs' },
        result: '{"success": true, "data": {"title": "Beam Model Card"}}'
      }
    };
    const turnsA = deferred<TurnPage>();
    const host = harness((path) => {
      if (path.startsWith('/events/')) {
        return Promise.resolve(detail);
      }
      if (path.includes('/events')) {
        return Promise.resolve({ items: events, after_seq: null, has_more: false });
      }
      return routeTurns(turnsA, turnsA)(path);
    });
    const writes: string[] = [];
    host.ctx.os.writeClipboard = (text: string): void => {
      writes.push(text);
    };
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByText('the a turn'));
    fireEvent.click(await screen.findByText('web_search'));

    await screen.findByText('#1325');
    expect(screen.getByText('"Beam Model Card"')).toBeDefined();
    expect(screen.queryByText(/\\\\"success\\\\"/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Copy payload' }));
    expect(writes).toEqual([
      '{\n  "args": {\n    "query": "beam model card specs"\n  },\n  "result": {\n    "success": true,\n    "data": {\n      "title": "Beam Model Card"\n    }\n  }\n}'
    ]);
  });

  it('resizes the payload panel and remembers the width', async () => {
    const turnsA = deferred<TurnPage>();
    const host = harness((path) => routeTurns(turnsA, turnsA)(path));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    const columns = document.querySelector('.rp-divider')?.parentElement as HTMLElement;
    const divider = screen.getByRole('separator', { name: 'Resize event payload panel' });
    expect(columns.style.getPropertyValue('--rp-payload-width')).toBe('292px');

    fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    expect(columns.style.getPropertyValue('--rp-payload-width')).toBe('308px');
    fireEvent.keyDown(divider, { key: 'ArrowRight' });
    expect(columns.style.getPropertyValue('--rp-payload-width')).toBe('292px');

    fireEvent.doubleClick(divider);
    expect(window.localStorage.getItem('hermes-session-rewind:payload-width')).toBe('292');

    fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    expect(window.localStorage.getItem('hermes-session-rewind:payload-width')).toBe('308');
  });

  it('draws the paired result as a nested row under its call', async () => {
    const base = {
      session_id: 'session-a',
      seq: 3,
      ts: TS,
      name: null,
      status: null,
      duration_ms: null,
      turn_id: 'session-a',
      api_request_id: null,
      preview: ''
    };
    const events: EventSummary[] = [
      {
        ...base,
        id: 10,
        kind: 'tool_call',
        tool_call_id: 'call-1',
        name: 'web_search',
        preview: '{"query": "beam"}'
      },
      {
        ...base,
        id: 11,
        kind: 'tool_result',
        tool_call_id: 'call-1',
        name: 'web_search',
        status: 'ok',
        duration_ms: 6200,
        preview: 'beam takes text as input'
      }
    ];
    const turnsA = deferred<TurnPage>();
    const host = harness((path) => {
      if (path.includes('/events')) {
        return Promise.resolve({ items: events, after_seq: null, has_more: false });
      }
      return routeTurns(turnsA, turnsA)(path);
    });
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByText('the a turn'));
    await screen.findByText('web_search');

    const nested = document.querySelectorAll('.rp-event[data-depth="1"]');
    expect(nested).toHaveLength(1);
    const nestedRow = nested[0];
    expect(nestedRow?.textContent).toContain('beam takes text as input');
    expect(nestedRow?.textContent).toContain('6.2s');
  });

  it('searches the session events and opens one in the payload', async () => {
    const hit: EventSummary = {
      id: 40,
      session_id: 'session-a',
      seq: 5,
      ts: TS,
      kind: 'tool_call',
      name: 'web_search',
      status: 'error',
      duration_ms: 120,
      turn_id: 'session-a',
      tool_call_id: 'c9',
      api_request_id: null,
      preview: 'boom in the tool'
    };
    const turnsA = deferred<TurnPage>();
    const host = harness((path) => {
      if (path.startsWith('/search')) {
        return Promise.resolve({ query: 'boom', items: [hit] });
      }
      if (path.startsWith('/events/')) {
        return Promise.resolve({ ...hit, task_id: null, payload: { error_message: 'boom' } });
      }
      return routeTurns(turnsA, turnsA)(path);
    });
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.change(screen.getByLabelText('Search events'), {
      target: { value: 'boom' }
    });

    await screen.findByText('boom in the tool');
    expect(screen.queryByText('the a turn')).toBeNull();

    fireEvent.click(screen.getByText('boom in the tool'));
    await screen.findByText('#40');
    expect(screen.getByText('Search results')).toBeDefined();

    fireEvent.keyDown(screen.getByLabelText('Search events'), { key: 'Escape' });
    expect(await screen.findByText('the a turn')).toBeDefined();
  });
});

describe('RewindPage fork dialog', () => {
  it('opens the fork dialog from a turn row', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Rewind to this turn')).toBeDefined();
    expect(within(dialog).getByText('Session Rewind')).toBeDefined();
    expect(
      within(dialog).getByText(
        'Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork.'
      )
    ).toBeDefined();
    expect(within(dialog).getByRole('button', { name: /Prepare branch/ })).toBeDefined();
    expect(
      within(dialog).getByText('Original session and workspace stay untouched.')
    ).toBeDefined();
  });

  it('gives the dialog one primary action and no status chrome', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog.querySelectorAll('.rw-primary')).toHaveLength(1);
    expect(within(dialog).queryByText('Checkpoint')).toBeNull();
    expect(within(dialog).queryByText('carries')).toBeNull();
    expect(within(dialog).queryByText('isolation')).toBeNull();
    expect(within(dialog).queryByText('not prepared')).toBeNull();
  });

  it('scopes every dialog control rule to the panel', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));

    const dialog = await screen.findByRole('dialog');
    const css = dialog.parentElement?.querySelector('style')?.textContent ?? '';
    const controls = [
      'rw-button',
      'rw-primary',
      'rw-close',
      'rw-preset',
      'rw-icon-button',
      'rw-trigger',
      'rw-option'
    ];
    const selectors = css
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.endsWith('{') || line.endsWith(','));
    const bare = selectors.filter((line) =>
      controls.some((name) => new RegExp(`^\\.${name}(?![a-z0-9-])`).test(line))
    );
    const scoped = selectors.filter((line) =>
      controls.some((name) => new RegExp(`^\\.rw-panel \\.${name}(?![a-z0-9-])`).test(line))
    );
    expect(bare).toEqual([]);
    expect(scoped.length).toBeGreaterThan(0);
  });
});

describe('RewindPage model picker', () => {
  function prepareBody(calls: { path: string; body: unknown }[]): Record<string, unknown> {
    const hit = calls.find((call) => call.path === '/forks/prepare');
    return (hit?.body ?? {}) as Record<string, unknown>;
  }

  async function awaitPrepare(host: Harness): Promise<Record<string, unknown>> {
    await waitFor(() =>
      expect(host.calls().some((call) => call.path === '/forks/prepare')).toBe(true)
    );
    return prepareBody(host.calls());
  }

  it('lists the models under the providers Hermes is configured for', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));

    expect(await within(dialog).findByText('Nous Portal')).toBeDefined();
    expect(within(dialog).getByText('NVIDIA NIM')).toBeDefined();
    expect(within(dialog).getByRole('option', { name: /anthropic\/claude-fable/ })).toBeDefined();
    expect(within(dialog).getByRole('option', { name: /Keep the session model/ })).toBeDefined();
    expect(within(dialog).getAllByText('session')).toHaveLength(1);
  });

  it('sends the provider with the model so an id shared by two providers is not guessed', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeFork(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    fireEvent.click(await within(dialog).findByRole('option', { name: /nvidia\/nemotron-3\.5/ }));

    expect(within(dialog).getByRole('button', { name: /^Model/ }).textContent).toContain(
      'nvidia/nemotron-3.5'
    );

    fireEvent.click(within(dialog).getByRole('button', { name: /Prepare branch/ }));
    const body = await awaitPrepare(host);
    expect(body.model).toBe('nvidia/nemotron-3.5');
    expect(body.provider).toBe('nvidia');
  });

  it('asks for no switch at all when the session model is kept', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeFork(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    fireEvent.click(await within(dialog).findByRole('option', { name: /nvidia\/nemotron-3\.5/ }));
    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    fireEvent.click(await within(dialog).findByRole('option', { name: /Keep the session model/ }));

    fireEvent.click(within(dialog).getByRole('button', { name: /Prepare branch/ }));
    const kept = await awaitPrepare(host);
    expect(kept.model).toBeNull();
    expect(kept.provider).toBeNull();
  });

  it('narrows the list as the search is typed', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    await within(dialog).findByText('Nous Portal');
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Search models' }), {
      target: { value: 'fable' }
    });

    expect(within(dialog).queryByText('NVIDIA NIM')).toBeNull();
    expect(within(dialog).getByRole('option', { name: /anthropic\/claude-fable/ })).toBeDefined();
    expect(within(dialog).getAllByRole('option')).toHaveLength(2);
  });

  it('offers a typed id as the value only when nothing in the catalog matches', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeFork(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    await within(dialog).findByText('Nous Portal');
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Search models' }), {
      target: { value: 'local/llama-3' }
    });

    fireEvent.click(await within(dialog).findByRole('option', { name: /as typed/ }));
    fireEvent.click(within(dialog).getByRole('button', { name: /Prepare branch/ }));

    const body = await awaitPrepare(host);
    expect(body.model).toBe('local/llama-3');
    expect(body.provider).toBeNull();
  });

  it('closes the picker with Escape before it closes the dialog', async () => {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    await within(dialog).findByText('Nous Portal');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(within(dialog).queryByText('Nous Portal')).toBeNull();
    expect(screen.queryByRole('dialog')).not.toBeNull();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('says so and keeps the session model when the catalog cannot be read', async () => {
    setModelOptions({});
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeFork(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');

    expect(
      await within(dialog).findByText(
        'Could not read the model list, so the rerun keeps the session model.'
      )
    ).toBeDefined();

    fireEvent.click(within(dialog).getByRole('button', { name: /Prepare branch/ }));
    expect((await awaitPrepare(host)).model).toBeNull();
  });

  it('does not list a provider that offers no model', async () => {
    setModelOptions({
      providers: [
        { slug: 'nous', name: 'Nous Portal', is_current: true, models: ['test/model'] },
        { slug: 'openrouter', name: 'OpenRouter', is_current: false, models: [] }
      ],
      model: 'test/model',
      provider: 'nous'
    });
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeTurns(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));

    await within(dialog).findByText('Nous Portal');
    expect(within(dialog).queryByText('OpenRouter')).toBeNull();
  });

  async function forkWithOtherModel(): Promise<void> {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeFork(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');

    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^Model/ }));
    fireEvent.click(await within(dialog).findByRole('option', { name: /nvidia\/nemotron-3\.5/ }));
    fireEvent.click(within(dialog).getByRole('button', { name: /Prepare branch/ }));
    await waitFor(() => expect(prepareBody(host.calls()).model).toBe('nvidia/nemotron-3.5'));
    fireEvent.click(within(dialog).getByRole('button', { name: /Fork & run/ }));
  }

  it('opens the rerun session before switching its model', async () => {
    await forkWithOtherModel();
    await waitFor(() =>
      expect(hostCalls().some((call) => call.name === 'prompt.submit')).toBe(true)
    );

    const names = hostCalls().map((call) => call.name);
    expect(names).toContain('config.set');
    expect(names.indexOf('openSession')).toBeLessThan(names.indexOf('config.set'));
  });

  it('says out loud when the model switch does not apply', async () => {
    setConfigSetFailure(true);
    await forkWithOtherModel();

    await waitFor(
      () =>
        expect(
          hostCalls().some((call) => call.kind === 'notify' && call.name.startsWith('warning:'))
        ).toBe(true),
      { timeout: 4000 }
    );
    const warning = hostCalls().find((call) => call.name.startsWith('warning:'));
    expect(warning?.name).toContain('nvidia/nemotron-3.5');
  });
});

describe('RewindPage native branch workspace', () => {
  async function startNativeFork(): Promise<Harness> {
    const turnsA = deferred<TurnPage>();
    const turnsB = deferred<TurnPage>();
    const host = harness(routeFork(turnsA, turnsB));
    render(<RewindPage ctx={host.ctx} />);
    turnsA.resolve(page([turn('a', 'the a turn')]));
    await screen.findByText('the a turn');
    fireEvent.click(screen.getByRole('button', { name: 'Rewind' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /Prepare branch/ }));
    await within(dialog).findByDisplayValue('the recorded context');
    fireEvent.click(within(dialog).getByRole('button', { name: /Fork & run/ }));
    return host;
  }

  it('attaches the prepared worktree on the native branch before starting', async () => {
    setNativeForkScenario(true);

    await startNativeFork();

    await waitFor(() =>
      expect(hostCalls().some((call) => call.name === 'prompt.submit')).toBe(true)
    );
    const names = hostCalls().map((call) => call.name);
    expect(names).toContain('session.branch');
    expect(names).not.toContain('session.create');
    const attachIndex = names.indexOf('session.cwd.set');
    expect(attachIndex).toBeGreaterThanOrEqual(0);
    expect(attachIndex).toBeLessThan(names.indexOf('openSession'));
    expect(names.indexOf('openSession')).toBeLessThan(names.indexOf('prompt.submit'));
    const attach = hostCalls().find((call) => call.name === 'session.cwd.set');
    expect(attach?.args).toEqual({
      session_id: 'runtime-child',
      cwd: '/work/.hermes-rewind/abcdef12'
    });
  });

  it('aborts before the rerun when the native attach fails', async () => {
    setNativeForkScenario(true);
    setWorkspaceAttachFailure(true);
    const host = await startNativeFork();
    await screen.findByText(/could not be attached/);
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(hostCalls().some((call) => call.name === 'prompt.submit')).toBe(false);
    expect(host.calls().some((call) => call.path.includes('/commit'))).toBe(false);
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

function planFixture(overrides: Partial<ForkPlan> = {}): ForkPlan {
  return {
    branch_id: 'branch-1',
    parent_session_id: 'session-a',
    fork_before_ts: TS,
    fork_row_count: 2,
    snapshot_id: 1,
    snapshot_commit: 'abcdef1234567890',
    worktree_path: '/work/.hermes-rewind/abcdef12',
    prompt: 'the recorded context',
    model: null,
    provider: null,
    verify_cmd: null,
    verify_timeout_seconds: 120,
    fidelity: 'full',
    context_rows: 2,
    verify_presets: ['python -m pytest -q'],
    ...overrides
  };
}

function routeFork(
  turnsA: { promise: Promise<TurnPage> },
  turnsB: { promise: Promise<TurnPage> },
  onPrepare?: (body: unknown) => void
): (path: string, body?: unknown) => Promise<unknown> | undefined {
  const turns = routeTurns(turnsA, turnsB);
  return (path: string, body?: unknown) => {
    if (path === '/forks/prepare') {
      onPrepare?.(body);
      return Promise.resolve(planFixture());
    }
    if (path.includes('/commit')) {
      return Promise.resolve(branchDetail('/work/.hermes-rewind/branch-1'));
    }
    if (path === '/sessions/session-a/branches') {
      return Promise.resolve([branchSummary('running', '/work/.hermes-rewind/branch-1')]);
    }
    if (path.includes('/reconcile') || path.includes('/branches/branch-1')) {
      return Promise.resolve(branchDetail('/work/.hermes-rewind/branch-1'));
    }
    return turns(path);
  };
}

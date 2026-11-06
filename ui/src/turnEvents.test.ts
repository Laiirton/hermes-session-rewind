import { describe, expect, it } from 'vitest';

import type { EventSummary } from './api';
import { pairToolEvents } from './turnEvents';

const TS = 1_700_000_000;

function event(id: number, kind: string, overrides: Partial<EventSummary> = {}): EventSummary {
  return {
    id,
    session_id: 'session-a',
    seq: 3,
    ts: TS,
    kind,
    name: null,
    status: null,
    duration_ms: null,
    turn_id: 'session-a',
    tool_call_id: null,
    api_request_id: null,
    preview: '',
    ...overrides
  };
}

describe('pairToolEvents', () => {
  it('groups each tool result under the call that produced it', () => {
    const call = event(10, 'tool_call', {
      tool_call_id: 'call-1',
      name: 'web_search',
      preview: '{"query": "beam"}'
    });
    const result = event(11, 'tool_result', {
      tool_call_id: 'call-1',
      name: 'web_search',
      duration_ms: 6200
    });
    const loose = event(12, 'tool_result', {
      tool_call_id: 'never-called',
      name: 'web_extract'
    });
    const request = event(13, 'api_request');
    const pairs = pairToolEvents([call, loose, result, request]);
    const [paired, orphan] = pairs;
    expect(pairs).toHaveLength(2);
    expect(paired?.call.id).toBe(10);
    expect(paired?.result?.id).toBe(11);
    expect(orphan?.call.id).toBe(12);
    expect(orphan?.result).toBeNull();
  });

  it('keeps the recorded order for everything that is not a paired result', () => {
    const pairs = pairToolEvents([
      event(1, 'user_turn', { preview: 'the ask' }),
      event(2, 'tool_call', { tool_call_id: 'c1', name: 'web_search' }),
      event(3, 'tool_call', { tool_call_id: 'c2', name: 'web_extract' }),
      event(4, 'tool_result', { tool_call_id: 'c1', name: 'web_search' })
    ]);
    expect(pairs.map((pair) => pair.call.id)).toEqual([1, 2, 3]);
    expect(pairs[1]?.result?.id).toBe(4);
    expect(pairs[2]?.result).toBeNull();
  });
});

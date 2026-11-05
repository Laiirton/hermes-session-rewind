import { describe, expect, it } from 'vitest';

import { mergeTurnPages } from './mergeTurnPages';
import type { TurnSummary } from './api';

function turn(id: number, seq: number, sessionId = 'sess'): TurnSummary {
  return {
    id,
    session_id: sessionId,
    seq,
    ts: seq,
    kind: 'user_turn',
    name: null,
    status: null,
    duration_ms: null,
    turn_id: null,
    tool_call_id: null,
    api_request_id: null,
    preview: `turn ${id}`,
    seq_to: seq,
    last_ts: seq,
    event_count: 1,
    tool_calls: 0,
    tool_errors: 0,
    api_requests: 0
  } as TurnSummary;
}

describe('mergeTurnPages', () => {
  it('keeps the newest page first and appends the older pages', () => {
    const merged: TurnSummary[] = mergeTurnPages('sess', [turn(3, 30), turn(2, 20)], [turn(1, 10)]);
    expect(merged.map((item: TurnSummary) => item.id)).toEqual([3, 2, 1]);
  });

  it('drops the rows a refresh redelivered', () => {
    const merged: TurnSummary[] = mergeTurnPages(
      'sess',
      [turn(2, 20), turn(1, 10)],
      [turn(1, 10), turn(0, 5)]
    );
    expect(merged.map((item: TurnSummary) => item.id)).toEqual([2, 1, 0]);
  });

  it('does not duplicate a row that only changed its event range', () => {
    const refreshed = { ...turn(1, 10), seq_to: 19, event_count: 4 };
    const merged: TurnSummary[] = mergeTurnPages('sess', [refreshed], [turn(1, 10), turn(0, 5)]);
    expect(merged.map((item: TurnSummary) => item.id)).toEqual([1, 0]);
    expect(merged[0]?.event_count).toBe(4);
  });

  it('drops rows left over from the previously selected session', () => {
    const merged: TurnSummary[] = mergeTurnPages(
      'sess',
      [turn(9, 90)],
      [turn(1, 10, 'other'), turn(0, 5)]
    );
    expect(merged.map((item: TurnSummary) => item.id)).toEqual([9, 0]);
  });
});

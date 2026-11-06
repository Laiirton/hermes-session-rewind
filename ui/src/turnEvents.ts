import type { EventSummary } from './api';

export const COLLAPSED_KINDS = new Set(['api_request', 'llm_call']);

export interface ToolEventPair {
  call: EventSummary;
  result: EventSummary | null;
}

/**
 * Groups each tool result under the tool call that produced it, matching on
 * tool_call_id, so the expanded turn reads as call-then-output instead of two
 * disconnected flat rows. Events that are not a tool call or result pass
 * through untouched; collapsed kinds are dropped here.
 */
export function pairToolEvents(events: EventSummary[]): ToolEventPair[] {
  const pairs: ToolEventPair[] = [];
  const openCalls = new Map<string, ToolEventPair>();
  for (const event of events) {
    if (COLLAPSED_KINDS.has(event.kind)) {
      continue;
    }
    if (event.kind === 'tool_call' && event.tool_call_id !== null) {
      const pair: ToolEventPair = { call: event, result: null };
      pairs.push(pair);
      openCalls.set(event.tool_call_id, pair);
      continue;
    }
    if (event.kind === 'tool_result' && event.tool_call_id !== null) {
      const pair = openCalls.get(event.tool_call_id);
      if (pair !== undefined) {
        pair.result = event;
        continue;
      }
    }
    pairs.push({ call: event, result: null });
  }
  return pairs;
}

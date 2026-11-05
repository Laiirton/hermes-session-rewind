import type { TurnSummary } from './api';

export function mergeTurnPages(
  sessionId: string,
  newest: TurnSummary[],
  older: TurnSummary[]
): TurnSummary[] {
  const incoming = new Set(newest.map((turn) => turn.id));
  const carry = older.filter((turn) => turn.session_id === sessionId && !incoming.has(turn.id));
  return [...newest, ...carry];
}

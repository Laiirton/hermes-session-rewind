import type { TurnSummary } from './api';

export function mergeTurnPages(newest: TurnSummary[], older: TurnSummary[]): TurnSummary[] {
  const incoming = new Set(newest.map((turn) => turn.id));
  return [...newest, ...older.filter((turn) => !incoming.has(turn.id))];
}

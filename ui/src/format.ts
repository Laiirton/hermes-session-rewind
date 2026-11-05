export function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function formatDuration(ms: number | null): string {
  if (ms === null) {
    return '';
  }
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

const RPC_ENVELOPE = /Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;

export function errorMessage(caught: unknown): string {
  const raw =
    caught instanceof Error
      ? caught.message
      : typeof caught === 'string'
        ? caught
        : 'Unexpected error';
  const envelope = RPC_ENVELOPE.exec(raw);
  const payload = envelope?.[1];
  if (envelope === null || payload === undefined) {
    return raw;
  }
  const detail = readDetail(payload);
  return detail === undefined ? raw : raw.replace(envelope[0], detail);
}

function readDetail(payload: string): string | undefined {
  try {
    const parsed = JSON.parse(payload) as { detail?: unknown };
    return typeof parsed.detail === 'string' && parsed.detail.length > 0
      ? parsed.detail
      : undefined;
  } catch {
    return undefined;
  }
}

export function shortId(value: string, length = 8): string {
  return value.length <= length ? value : value.slice(0, length);
}

export function plural(value: number, word: string): string {
  return `${value} ${value === 1 ? word : `${word}s`}`;
}

export function verifyOutcome(exit: number): string {
  return exit === 0 ? 'passed' : `failed (exit ${exit})`;
}

const OUTCOME_LABELS: Record<string, string> = {
  completed: 'completed',
  agent_close: 'closed with the app',
  ws_orphan_reap: 'ended with its window',
  startup_orphan_reap: 'ended with its window'
};

export function outcomeLabel(outcome: string | null): string {
  if (outcome === null) {
    return 'recording';
  }
  return OUTCOME_LABELS[outcome] ?? outcome;
}

export function frozenOutcome(outcome: string | null): string {
  return outcome === null ? 'open at freeze' : outcomeLabel(outcome);
}

export function sessionsCountLabel(count: number, limit: number): string {
  if (count === 0) {
    return '';
  }
  return count >= limit ? `${limit}+` : `${count}`;
}

export function formatClock(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function openRecordingNote(lastEventAt: number | null): string {
  if (lastEventAt === null) {
    return 'recording, nothing captured yet';
  }
  return `recording · last event ${formatClock(lastEventAt)}`;
}

export function turnsEmptyMessage(eventCount: number, error: string | null): string {
  if (error !== null) {
    return `The turns could not be loaded: ${error}`;
  }
  if (eventCount === 0) {
    return 'No user turns recorded yet for this session.';
  }
  return `The recording holds ${plural(eventCount, 'event')} but no user turn.`;
}

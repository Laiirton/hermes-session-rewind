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

export function formatRelative(ts: number): string {
  const seconds = Math.max(0, Math.round(Date.now() / 1000 - ts));
  if (seconds < 60) {
    return 'just now';
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.round(hours / 24);
  if (days < 30) {
    return `${days}d`;
  }
  return `${Math.round(days / 30)}mo`;
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
    if (typeof parsed.detail === 'string' && parsed.detail.length > 0) {
      return parsed.detail;
    }
    if (parsed.detail !== null && typeof parsed.detail === 'object') {
      const detail = parsed.detail as { detail?: unknown; reason?: unknown };
      return typeof detail.detail === 'string' && detail.detail.length > 0
        ? detail.detail
        : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function parseCommitError(caught: unknown): {
  detail: string;
  claimReason: string | null;
  claimedBranchId: string | null;
} {
  const raw =
    caught instanceof Error
      ? caught.message
      : typeof caught === 'string'
        ? caught
        : 'Unexpected error';
  const envelope = RPC_ENVELOPE.exec(raw);
  const payload = envelope?.[1];
  let detail = errorMessage(caught);
  let claimReason: string | null = null;
  let claimedBranchId: string | null = null;
  if (payload === undefined) {
    return { detail, claimReason, claimedBranchId };
  }
  try {
    const parsed = JSON.parse(payload) as {
      detail?: { detail?: unknown; reason?: unknown; claimed_branch_id?: unknown };
    };
    const nested = parsed.detail;
    if (nested !== null && typeof nested === 'object') {
      if (typeof nested.detail === 'string' && nested.detail.length > 0) {
        detail = `could not record the branch: ${nested.detail}`;
      }
      if (typeof nested.reason === 'string') {
        claimReason = nested.reason;
      }
      if (typeof nested.claimed_branch_id === 'string') {
        claimedBranchId = nested.claimed_branch_id;
      }
    }
  } catch {
    // No structured detail — keep the plain message.
  }
  return { detail, claimReason, claimedBranchId };
}

export function reusedChildNote(branchId: string): string {
  return (
    `The chat app returned the rerun session of branch ${branchId} — ` +
    'the same title already existed there, so nothing new was created. ' +
    'Close that tab, then rewind again; the next attempt opens a fresh rerun session.'
  );
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

export function outcomeTone(outcome: string | null): string {
  if (outcome === null) {
    return 'warn';
  }
  if (outcome === 'completed') {
    return 'ok';
  }
  if (outcome === 'failed') {
    return 'err';
  }
  return 'idle';
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

export const OPEN_RECORDING_HINT =
  'Recording — no end-of-session signal was captured yet, so Rewind cannot tell whether this session is still open. If its window is gone, the rerun still starts normally and carries the recorded context.';

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

export function cleanupWarning(
  uncommitted: number | null,
  orphanCommits: number | null = 0
): string {
  if (uncommitted === null || orphanCommits === null) {
    return 'Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.';
  }
  const parts: string[] = [];
  if (uncommitted > 0) {
    parts.push(`${uncommitted} uncommitted file${uncommitted === 1 ? '' : 's'}`);
  }
  if (orphanCommits > 0) {
    parts.push(`${orphanCommits} commit${orphanCommits === 1 ? '' : 's'} not on any branch`);
  }
  if (parts.length === 0) {
    return 'This workspace holds nothing uncommitted. Deleting it removes only the checkout; the rerun conversation stays in the recording.';
  }
  return `This workspace holds ${parts.join(' and ')}. Deleting it removes ${parts.length === 1 ? 'it' : 'them'} for good; the rerun conversation stays in the recording.`;
}

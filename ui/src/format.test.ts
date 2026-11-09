import { describe, expect, it } from 'vitest';

import {
  cleanupWarning,
  errorMessage,
  formatClock,
  formatRelative,
  frozenOutcome,
  OPEN_RECORDING_HINT,
  outcomeLabel,
  outcomeTone,
  openRecordingNote,
  parseCommitError,
  plural,
  reusedChildNote,
  sessionsCountLabel,
  turnsEmptyMessage,
  verifyOutcome
} from './format';

describe('plural', () => {
  it('adds the suffix except for one', () => {
    expect(plural(0, 'tool')).toBe('0 tools');
    expect(plural(1, 'tool')).toBe('1 tool');
    expect(plural(2, 'model request')).toBe('2 model requests');
  });
});

describe('errorMessage', () => {
  it('returns the message of an Error', () => {
    expect(errorMessage(new Error('the store is unavailable'))).toBe('the store is unavailable');
  });

  it('returns a plain string unchanged', () => {
    expect(errorMessage('branch not found')).toBe('branch not found');
  });

  it('falls back for a rejection that is not an error', () => {
    expect(errorMessage({ detail: 'nope' })).toBe('Unexpected error');
  });

  it('unwraps the electron rpc envelope into the server detail', () => {
    const raw =
      "could not record the branch: Error invoking remote method 'hermes:api': " +
      'Error: 400: {"detail":"that session is already the rerun of another branch"}';
    expect(errorMessage(new Error(raw))).toBe(
      'could not record the branch: that session is already the rerun of another branch'
    );
  });

  it('keeps the envelope when the payload carries no detail string', () => {
    const raw = "Error invoking remote method 'hermes:api': Error: 400: {}";
    expect(errorMessage(new Error(raw))).toBe(raw);
  });

  it('keeps the envelope when the payload is not valid json', () => {
    const raw = "Error invoking remote method 'hermes:api': Error: 400: {detail:";
    expect(errorMessage(new Error(raw))).toBe(raw);
  });

  it('keeps the envelope when the payload detail is a validation array', () => {
    const raw =
      "Error invoking remote method 'hermes:api': Error: 422: " +
      '{"detail":[{"loc":["query","cmd"],"msg":"value is not a valid integer"}]}';
    expect(errorMessage(new Error(raw))).toBe(raw);
  });

  it('unwraps a nested commit-error detail object', () => {
    const raw =
      "could not record the branch: Error invoking remote method 'hermes:api': " +
      'Error: 400: {"detail":{"detail":"that session is already the rerun of another branch",' +
      '"reason":"child_already_claimed","claimed_branch_id":"b-1"}}';
    expect(errorMessage(new Error(raw))).toBe(
      'could not record the branch: that session is already the rerun of another branch'
    );
  });
});

describe('parseCommitError', () => {
  it('reads the structured claim reason and branch id from the nested detail', () => {
    const raw =
      "could not record the branch: Error invoking remote method 'hermes:api': " +
      'Error: 400: {"detail":{"detail":"that session is already the rerun of another branch",' +
      '"reason":"child_already_claimed","claimed_branch_id":"branch-42"}}';
    const parsed = parseCommitError(new Error(raw));
    expect(parsed.claimReason).toBe('child_already_claimed');
    expect(parsed.claimedBranchId).toBe('branch-42');
    expect(parsed.detail).toContain('already the rerun of another branch');
  });

  it('keeps the plain detail for a non-structured error', () => {
    expect(parseCommitError(new Error('branch not found'))).toEqual({
      detail: 'branch not found',
      claimReason: null,
      claimedBranchId: null
    });
  });
});

describe('reusedChildNote', () => {
  it('names the branch that claimed the session and the next step', () => {
    const note = reusedChildNote('branch-42');
    expect(note).toContain('branch-42');
    expect(note).toMatch(/close that tab/i);
    expect(note).toMatch(/fresh rerun session/i);
  });
});

describe('outcomeLabel', () => {
  it('spells the recoverable orphan reaps and passes anything else through', () => {
    expect(outcomeLabel(null)).toBe('recording');
    expect(outcomeLabel('completed')).toBe('completed');
    expect(outcomeLabel('ws_orphan_reap')).toBe('ended with its window');
    expect(outcomeLabel('startup_orphan_reap')).toBe('ended with its window');
    expect(outcomeLabel('some_future_reason')).toBe('some_future_reason');
  });
});

describe('verifyOutcome', () => {
  it('says passed for a zero exit and names the code otherwise', () => {
    expect(verifyOutcome(0)).toBe('passed');
    expect(verifyOutcome(1)).toBe('failed (exit 1)');
    expect(verifyOutcome(127)).toBe('failed (exit 127)');
  });
});

describe('frozenOutcome', () => {
  it('places an unfinished baseline in the past, because the card is a snapshot', () => {
    expect(frozenOutcome(null)).toBe('open at freeze');
  });

  it('keeps every recorded reason in the words the host means', () => {
    expect(frozenOutcome('completed')).toBe('completed');
    expect(frozenOutcome('ws_orphan_reap')).toBe('ended with its window');
    expect(frozenOutcome('some_future_reason')).toBe('some_future_reason');
  });
});

describe('sessionsCountLabel', () => {
  it('counts the sessions listed', () => {
    expect(sessionsCountLabel(14, 100)).toBe('14');
  });

  it('says a full page is a window, not the whole store', () => {
    expect(sessionsCountLabel(100, 100)).toBe('100+');
  });

  it('says nothing before the first page arrives', () => {
    expect(sessionsCountLabel(0, 100)).toBe('');
  });
});

describe('openRecordingNote', () => {
  it('states the last event with the same clock the app already uses', () => {
    const ts = 1_700_000_000;
    expect(openRecordingNote(ts)).toBe(`recording · last event ${formatClock(ts)}`);
  });

  it('renders a clock in whatever shape the locale asks for', () => {
    const clock = formatClock(1_700_000_000);
    expect(clock).toMatch(/\d/);
    expect(clock).toContain(':');
    expect(clock).not.toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('says so when nothing has been captured yet', () => {
    expect(openRecordingNote(null)).toBe('recording, nothing captured yet');
  });
});

describe('OPEN_RECORDING_HINT', () => {
  it('is honest about the missing end signal without behaving like a warning', () => {
    expect(OPEN_RECORDING_HINT).toMatch(/no end-of-session signal/i);
    expect(OPEN_RECORDING_HINT).toMatch(/still starts normally/i);
  });
});

describe('turnsEmptyMessage', () => {
  it('names the failure when the query failed', () => {
    expect(turnsEmptyMessage(74, 'HTTP 500')).toBe('The turns could not be loaded: HTTP 500');
  });

  it('waits for more of the recording when there is nothing yet', () => {
    expect(turnsEmptyMessage(0, null)).toBe('No user turns recorded yet for this session.');
  });

  it('states what a recording without user turns holds, without sending the user to Refresh', () => {
    expect(turnsEmptyMessage(77, null)).toBe('The recording holds 77 events but no user turn.');
    expect(turnsEmptyMessage(1, null)).toBe('The recording holds 1 event but no user turn.');
  });
});

describe('outcomeTone', () => {
  it('marks an unfinished outcome as open and a failure as an error', () => {
    expect(outcomeTone(null)).toBe('warn');
    expect(outcomeTone('failed')).toBe('err');
  });

  it('leaves an outcome that is neither success nor failure uncoloured', () => {
    expect(outcomeTone('completed')).toBe('ok');
    expect(outcomeTone('ws_orphan_reap')).toBe('idle');
    expect(outcomeTone('shutdown')).toBe('idle');
  });
});

describe('cleanupWarning', () => {
  it('counts what the workspace holds', () => {
    expect(cleanupWarning(1)).toContain('holds 1 uncommitted file.');
    expect(cleanupWarning(3)).toContain('holds 3 uncommitted files.');
  });

  it('names commits that no branch points at even when status is clean', () => {
    expect(cleanupWarning(0, 1)).toContain('holds 1 commit not on any branch');
    expect(cleanupWarning(0, 2)).toContain('holds 2 commits not on any branch');
    expect(cleanupWarning(1, 1)).toContain(
      'holds 1 uncommitted file and 1 commit not on any branch'
    );
  });

  it('says the workspace could not be read rather than calling it clean', () => {
    expect(cleanupWarning(null)).toContain('could not read');
    expect(cleanupWarning(0, null)).toContain('could not read');
  });

  it('does not ask when there is nothing to lose', () => {
    expect(cleanupWarning(0, 0)).toContain('holds nothing uncommitted');
  });
});

describe('formatRelative', () => {
  it('buckets ages from seconds to months', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelative(now - 30)).toBe('just now');
    expect(formatRelative(now - 5 * 60)).toBe('5m');
    expect(formatRelative(now - 3 * 3600)).toBe('3h');
    expect(formatRelative(now - 2 * 86400)).toBe('2d');
    expect(formatRelative(now - 45 * 86400)).toBe('2mo');
  });

  it('never goes negative for a future timestamp', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelative(now + 500)).toBe('just now');
  });
});

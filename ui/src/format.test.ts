import { describe, expect, it } from 'vitest';

import {
  cleanupWarning,
  errorMessage,
  formatClock,
  frozenOutcome,
  outcomeLabel,
  outcomeTone,
  openRecordingNote,
  plural,
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

  it('says the workspace could not be read rather than calling it clean', () => {
    expect(cleanupWarning(null)).toContain('could not read');
  });
});

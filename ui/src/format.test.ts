import { describe, expect, it } from 'vitest';

import { errorMessage, outcomeLabel, plural, verifyOutcome } from './format';

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

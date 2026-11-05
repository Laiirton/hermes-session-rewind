import { describe, expect, it } from 'vitest';

import { errorMessage } from './format';

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

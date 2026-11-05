import { describe, expect, it } from 'vitest';

import { branchPoint, messageText } from './forkPrefix';
import type { HistoryMessage } from './forkPrefix';

function message(role: string, rowId: number, timestamp: number, text: string): HistoryMessage {
  return { role, row_id: rowId, timestamp, text };
}

describe('branchPoint', () => {
  it('branches just before the selected user turn', () => {
    const history = [
      message('user', 1, 100, 'first ask'),
      message('assistant', 2, 101, 'first answer'),
      message('user', 3, 200, 'second ask'),
      message('assistant', 4, 201, 'second answer')
    ];

    expect(branchPoint(history, 200)).toBe(2);
  });

  it('returns nothing for the first turn', () => {
    const history = [message('user', 1, 100, 'first ask'), message('assistant', 2, 101, 'ok')];

    expect(branchPoint(history, 100)).toBeNull();
  });

  it('takes the latest user row at or before the checkpoint', () => {
    const history = [
      message('user', 1, 100, 'a'),
      message('assistant', 2, 105, 'b'),
      message('user', 3, 110, 'c'),
      message('assistant', 4, 115, 'd')
    ];

    expect(branchPoint(history, 112)).toBe(2);
  });

  it('ignores rows without displayable text', () => {
    const history = [
      message('user', 1, 100, 'a'),
      { role: 'assistant', row_id: 2, timestamp: 101, text: '   ' },
      message('user', 3, 200, 'b')
    ];

    expect(branchPoint(history, 200)).toBe(1);
  });

  it('returns nothing when the history is missing', () => {
    expect(branchPoint(undefined, 200)).toBeNull();
  });
});

describe('messageText', () => {
  it('prefers the text field', () => {
    expect(messageText({ role: 'user', text: ' plain ', content: 'other' })).toBe('plain');
  });

  it('joins content parts', () => {
    const record: HistoryMessage = {
      role: 'assistant',
      content: [{ text: 'one' }, { text: ' two' }]
    };

    expect(messageText(record)).toBe('one two');
  });

  it('accepts a string body', () => {
    expect(messageText({ role: 'user', content: 'body text' })).toBe('body text');
  });

  it('yields nothing for shapes it cannot read', () => {
    expect(messageText({ role: 'tool', content: [{ noText: true }] })).toBe('');
    expect(messageText({ role: 'tool', content: 42 })).toBe('');
  });
});

import { describe, expect, it } from 'vitest';

import { formatPayloadText, jsonTokens, parseEmbeddedJson } from './jsonFormat';

describe('parseEmbeddedJson', () => {
  it('unpacks a tool result stored as an escaped JSON string', () => {
    const payload = {
      args: { query: 'beam model card' },
      result: '{"success": true, "data": {"web": [{"title": "Beam Model Card"}]}}'
    };
    const parsed = parseEmbeddedJson(payload) as Record<string, unknown>;
    const result = parsed.result as Record<string, unknown>;
    expect(result.success).toBe(true);
    expect((result.data as Record<string, unknown>).web).toEqual([
      { title: 'Beam Model Card' }
    ]);
  });

  it('leaves plain strings and non-JSON text untouched', () => {
    const payload = { result: 'Beam is an open model built by Reflection.', note: '{not json' };
    expect(parseEmbeddedJson(payload)).toEqual(payload);
  });

  it('does not unwrap JSON primitives that were quoted at capture time', () => {
    const payload = { result: '"42"', count: '7' };
    expect(parseEmbeddedJson(payload)).toEqual(payload);
  });

  it('recurses into parsed structures and stops at the depth limit', () => {
    const innermost = '{"e": 2}';
    const s3 = JSON.stringify({ d: innermost });
    const s2 = JSON.stringify({ c: s3 });
    const s1 = JSON.stringify({ b: s2 });
    const payload = { a: s1 };
    const parsed = parseEmbeddedJson(payload) as Record<string, unknown>;
    const b = parsed.a as Record<string, unknown>;
    const c = b.b as Record<string, unknown>;
    // depth cap reached - the deepest encoded level stays a recorded string
    expect(c.c).toBe(s3);
  });
});

describe('jsonTokens', () => {
  it('classifies keys, strings, numbers, literals and punctuation', () => {
    const tokens = jsonTokens('{\n  "name": "beam",\n  "ctx": 128000,\n  "ok": true,\n  "x": null\n}');
    const byType = (type: string): string[] =>
      tokens.filter((token) => token.type === type).map((token) => token.text);
    expect(byType('key')).toEqual(['"name"', '"ctx"', '"ok"', '"x"']);
    expect(byType('string')).toEqual(['"beam"']);
    expect(byType('number')).toEqual(['128000']);
    expect(byType('bool')).toEqual(['true']);
    expect(byType('null')).toEqual(['null']);
    expect(byType('punct')).toContain('{');
  });

  it('keeps escaped quotes inside strings', () => {
    const tokens = jsonTokens('{"a": "say \\"hi\\""}');
    const strings = tokens.filter((token) => token.type === 'string').map((token) => token.text);
    expect(strings).toEqual(['"say \\"hi\\""']);
  });
});

describe('formatPayloadText', () => {
  it('pretty-prints the payload with embedded JSON unpacked', () => {
    const text = formatPayloadText({ result: '{"success": true}' });
    expect(text).toBe('{\n  "result": {\n    "success": true\n  }\n}');
  });
});

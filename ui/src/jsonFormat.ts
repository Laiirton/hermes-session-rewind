export interface JsonToken {
  text: string;
  type: 'key' | 'string' | 'number' | 'bool' | 'null' | 'punct';
}

const EMBED_MAX_DEPTH = 4;

function looksLikeJson(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 2) {
    return false;
  }
  const first = trimmed[0];
  return (first === '{' && trimmed.endsWith('}')) || (first === '[' && trimmed.endsWith(']'));
}

/**
 * Rewrites payload values whose strings hold encoded JSON - a tool result that
 * stored `"{\"success\": true}"` becomes a real object - so the inspector shows
 * structure instead of escaped text. Depth-limited; anything that does not
 * parse as an object or array is left exactly as recorded.
 */
export function parseEmbeddedJson(value: unknown, depth = 0): unknown {
  if (depth >= EMBED_MAX_DEPTH) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => parseEmbeddedJson(item, depth + 1));
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = parseEmbeddedJson(item, depth + 1);
    }
    return out;
  }
  if (typeof value === 'string' && looksLikeJson(value)) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed !== null && typeof parsed === 'object') {
        return parseEmbeddedJson(parsed, depth + 1);
      }
    } catch {
      // Not JSON after all - keep the recorded string.
    }
  }
  return value;
}

const TOKEN_RE =
  /(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;

/** Tokenizes pretty-printed JSON so the renderer can colour keys, strings, numbers and literals. */
export function jsonTokens(source: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  for (const match of source.matchAll(TOKEN_RE)) {
    const full = match[0];
    const quoted = match.groups?.q;
    const colon = match.groups?.c;
    if (quoted !== undefined) {
      tokens.push({ text: quoted, type: colon !== undefined ? 'key' : 'string' });
      if (colon !== undefined) {
        tokens.push({ text: colon, type: 'punct' });
      }
      continue;
    }
    if (full === 'true' || full === 'false') {
      tokens.push({ text: full, type: 'bool' });
    } else if (full === 'null') {
      tokens.push({ text: full, type: 'null' });
    } else if (/^-?\d/.test(full)) {
      tokens.push({ text: full, type: 'number' });
    } else {
      tokens.push({ text: full, type: 'punct' });
    }
  }
  return tokens;
}

export function formatPayloadText(payload: Record<string, unknown>): string {
  return JSON.stringify(parseEmbeddedJson(payload), null, 2);
}

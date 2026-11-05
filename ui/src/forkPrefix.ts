export interface HistoryMessage {
  role: string;
  text?: string | null;
  content?: unknown;
  timestamp?: number | null;
  row_id?: number | null;
}

export interface HistoryResult {
  count: number;
  messages?: HistoryMessage[];
}

export function messageText(message: HistoryMessage): string {
  if (typeof message.text === 'string' && message.text.trim()) {
    return message.text.trim();
  }
  const content = message.content;
  if (typeof content === 'string') {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part !== 'object' || part === null || !('text' in part)) {
          return '';
        }
        const text = (part as { text?: unknown }).text;
        return typeof text === 'string' ? text : '';
      })
      .join('')
      .trim();
  }
  return '';
}

export function branchPoint(messages: HistoryMessage[] | undefined, forkTs: number): number | null {
  const rows = (messages ?? []).filter(
    (message) =>
      (message.role === 'user' || message.role === 'assistant') &&
      messageText(message).length > 0 &&
      typeof message.row_id === 'number'
  );
  let target = -1;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row === undefined) {
      continue;
    }
    const timestamp = row.timestamp;
    if (row.role === 'user' && typeof timestamp === 'number' && timestamp <= forkTs + 0.5) {
      target = index;
    }
  }
  if (target <= 0) {
    return null;
  }
  const rowId = rows[target - 1]?.row_id;
  return typeof rowId === 'number' && rowId > 0 ? rowId : null;
}

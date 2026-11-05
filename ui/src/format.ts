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

export function errorMessage(caught: unknown): string {
  if (caught instanceof Error) {
    return caught.message;
  }
  if (typeof caught === 'string') {
    return caught;
  }
  return 'Unexpected error';
}

export function shortId(value: string, length = 8): string {
  return value.length <= length ? value : value.slice(0, length);
}

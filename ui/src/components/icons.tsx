import type { ReactNode } from 'react';

const ICON_PATHS: Record<string, string> = {
  rewind: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  refresh: 'M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2',
  branch:
    'M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
  folder: 'M3 7h6l2 2h10v11H3z',
  close: 'M5 5l14 14M19 5L5 19',
  chevron: 'M9 6l6 6-6 6',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01',
  copy: 'M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10',
  check: 'M4 12l5 5L20 7',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  reply: 'M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  inbox: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  event: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18'
};

export function Icon({
  name,
  size = 14,
  className
}: {
  name: string;
  size?: number;
  className?: string;
}): ReactNode {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

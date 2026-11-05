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
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01'
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

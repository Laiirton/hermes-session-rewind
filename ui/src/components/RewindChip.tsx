import { host, useValue } from '@hermes/plugin-sdk';
import type { ReactNode } from 'react';

import { REWIND_PATH } from '../routes';

export function RewindChip(): ReactNode {
  const active = useValue(host.state.activeSessionId);
  return (
    <button
      type="button"
      className="flex items-center gap-1"
      onClick={() => {
        host.navigate(REWIND_PATH);
      }}
      title="Open Session Rewind"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active === null ? 'bg-(--ui-text-tertiary)' : 'bg-emerald-500'
        }`}
      />
      Rewind
    </button>
  );
}

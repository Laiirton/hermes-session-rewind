import {
  host,
  useValue,
  KEYBINDS_AREA,
  PALETTE_AREA,
  ROUTES_AREA,
  SIDEBAR_NAV_AREA,
  STATUSBAR_AREAS
} from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import type { ReactNode } from 'react';

import { RewindPage } from './components/RewindPage';

const REWIND_PATH = '/rewind';

function RewindChip(): ReactNode {
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

const plugin = {
  id: 'session-rewind',
  name: 'Rewind',
  defaultEnabled: true,
  register(ctx: PluginContext): void {
    const openRewind = (): void => {
      host.navigate(REWIND_PATH);
    };
    ctx.registerMany([
      {
        id: 'page',
        area: ROUTES_AREA,
        data: { path: REWIND_PATH },
        render: () => <RewindPage ctx={ctx} />
      },
      {
        id: 'nav',
        area: SIDEBAR_NAV_AREA,
        data: { path: REWIND_PATH, label: 'Rewind', codicon: 'history' }
      },
      {
        id: 'palette-open',
        area: PALETTE_AREA,
        data: {
          id: 'session-rewind.open',
          label: 'Open Session Rewind',
          keywords: ['rewind', 'checkpoint', 'time machine', 'fork'],
          run: openRewind
        }
      },
      {
        id: 'keybind-open',
        area: KEYBINDS_AREA,
        data: {
          id: 'session-rewind.open',
          label: 'Open Session Rewind',
          category: 'Rewind',
          defaults: ['mod+alt+r'],
          run: openRewind
        }
      },
      {
        id: 'chip',
        area: STATUSBAR_AREAS.right,
        order: 130,
        render: () => <RewindChip />
      }
    ]);
  }
};

export default plugin;

import {
  host,
  ROUTES_AREA,
  SIDEBAR_NAV_AREA,
  STATUSBAR_AREAS,
  useValue
} from '@hermes/plugin-sdk';
import type { PluginContext } from '@hermes/plugin-sdk';
import type { ReactNode } from 'react';

import { RewindPage } from './components/RewindPage';

function RewindChip(): ReactNode {
  const active = useValue(host.state.activeSessionId);
  return (
    <button
      type="button"
      className="flex items-center gap-1"
      onClick={() => {
        host.navigate('/rewind');
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
  register(ctx: PluginContext): void {
    ctx.register({
      id: 'page',
      area: ROUTES_AREA,
      data: { path: '/rewind' },
      render: () => <RewindPage ctx={ctx} />
    });
    ctx.register({
      id: 'nav',
      area: SIDEBAR_NAV_AREA,
      data: { path: '/rewind', label: 'Rewind', codicon: 'history' }
    });
    ctx.register({
      id: 'chip',
      area: STATUSBAR_AREAS.right,
      order: 130,
      render: () => <RewindChip />
    });
  }
};

export default plugin;

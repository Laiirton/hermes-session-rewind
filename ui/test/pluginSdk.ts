const defaultCatalog = {
  providers: [
    {
      slug: 'nous',
      name: 'Nous Portal',
      is_current: true,
      models: ['test/model', 'anthropic/claude-fable']
    },
    { slug: 'nvidia', name: 'NVIDIA NIM', is_current: false, models: ['nvidia/nemotron-3.5'] }
  ],
  model: 'test/model',
  provider: 'nous'
};

let modelOptions: unknown = defaultCatalog;
let configSetFails = false;
let nativeFork = false;
let workspaceAttachFails = false;
let createCount = 0;
const createTitles: string[] = [];

export interface HostCall {
  kind: 'request' | 'openSession' | 'notify';
  name: string;
  args?: unknown;
}

const calls: HostCall[] = [];

export function hostCalls(): HostCall[] {
  return calls;
}

export function setConfigSetFailure(fails: boolean): void {
  configSetFails = fails;
}

export function setNativeForkScenario(enabled: boolean): void {
  nativeFork = enabled;
}

export function setWorkspaceAttachFailure(fails: boolean): void {
  workspaceAttachFails = fails;
}

export function sessionCreateTitles(): string[] {
  return [...createTitles];
}

export function resetHostStub(): void {
  modelOptions = defaultCatalog;
  configSetFails = false;
  nativeFork = false;
  workspaceAttachFails = false;
  createCount = 0;
  createTitles.length = 0;
  calls.length = 0;
}

export function setModelOptions(payload: unknown): void {
  modelOptions = payload;
}

export const host = {
  state: {
    activeSessionId: null,
    focusedStoredSessionId: null,
    awaitingResponse: false,
    busy: false,
    model: 'test/model',
    cwd: '/work/demo'
  },
  notify: (input: { kind: string; message: string }): void => {
    calls.push({ kind: 'notify', name: `${input.kind}:${input.message}` });
  },
  navigate: (): void => {},
  newChat: async (): Promise<unknown> => ({}),
  openSession: async (): Promise<unknown> => {
    calls.push({ kind: 'openSession', name: 'openSession' });
    return {};
  },
  request: async (method: string, args?: unknown): Promise<unknown> => {
    calls.push({ kind: 'request', name: method, args });
    if (method === 'model.options') {
      return modelOptions;
    }
    if (method === 'config.set' && configSetFails) {
      throw new Error('Session revision unavailable; reopen the session before editing metadata');
    }
    if (method === 'session.active_list') {
      return nativeFork ? { sessions: [{ id: 'parent-runtime', session_key: 'session-a' }] } : {};
    }
    if (method === 'session.title') {
      return { title: 'chat a', session_key: 'stored-parent' };
    }
    if (method === 'session.history') {
      return nativeFork
        ? {
            count: 3,
            messages: [
              { role: 'user', text: 'earlier task', timestamp: 1_699_999_990, row_id: 10 },
              { role: 'assistant', text: 'earlier answer', timestamp: 1_699_999_995, row_id: 11 },
              { role: 'user', text: 'the a turn', timestamp: 1_700_000_000, row_id: 12 }
            ]
          }
        : {};
    }
    if (method === 'session.branch') {
      return { session_id: 'runtime-child', stored_session_id: 'stored-child' };
    }
    if (method === 'session.create') {
      const title = (args as { title?: unknown } | undefined)?.title;
      if (typeof title === 'string') {
        createTitles.push(title);
      }
      createCount += 1;
      return {
        session_id: `runtime-child${createCount === 1 ? '' : `-dup${createCount}`}`,
        stored_session_id: `stored-child${createCount === 1 ? '' : `-dup${createCount}`}`
      };
    }
    if (method === 'session.cwd.set' && workspaceAttachFails) {
      throw new Error('the child session is not ready');
    }
    return {};
  },
  composer: {
    insertText: async (): Promise<boolean> => true,
    submit: async (): Promise<boolean> => true,
    focus: (): void => {}
  }
};

export const ROUTES_AREA = 'routes';
export const SIDEBAR_NAV_AREA = 'sidebarNav';
export const PALETTE_AREA = 'palette';
export const KEYBINDS_AREA = 'keybinds';
export const STATUSBAR_AREAS = { left: 'statusBarLeft', right: 'statusBarRight' };

export function useValue<T>(atom: T): T {
  return atom;
}

export function useTheme(): {
  theme: Record<string, unknown>;
  themeName: string;
  availableThemes: { name: string; label: string }[];
  resolvedMode: string;
} {
  return {
    theme: {},
    themeName: 'nous',
    availableThemes: [],
    resolvedMode: 'dark'
  };
}

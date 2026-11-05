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

export interface HostCall {
  kind: 'request' | 'openSession' | 'notify';
  name: string;
}

const calls: HostCall[] = [];

export function hostCalls(): HostCall[] {
  return calls;
}

export function setConfigSetFailure(fails: boolean): void {
  configSetFails = fails;
}

export function resetHostStub(): void {
  modelOptions = defaultCatalog;
  configSetFails = false;
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
  request: async (method: string): Promise<unknown> => {
    calls.push({ kind: 'request', name: method });
    if (method === 'model.options') {
      return modelOptions;
    }
    if (method === 'config.set' && configSetFails) {
      throw new Error('Session revision unavailable; reopen the session before editing metadata');
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

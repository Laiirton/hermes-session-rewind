export const host = {
  state: {
    activeSessionId: null,
    focusedStoredSessionId: null,
    awaitingResponse: false,
    busy: false,
    model: 'test/model',
    cwd: '/work/demo'
  },
  notify: (): void => {},
  navigate: (): void => {},
  newChat: async (): Promise<unknown> => ({}),
  openSession: async (): Promise<unknown> => ({}),
  request: async (): Promise<unknown> => ({}),
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

declare module '@hermes/plugin-sdk' {
  import type { ReactNode } from 'react';

  export interface Contribution {
    id: string;
    area: string;
    title?: string;
    data?: Record<string, unknown>;
    order?: number;
    render?: () => ReactNode;
  }

  export interface PluginContext {
    register(contribution: Contribution): () => void;
    registerMany(contributions: readonly Contribution[]): () => void;
    rest<T>(path: string, options?: RequestInit): Promise<T>;
    onEvent(type: string, listener: (payload: unknown) => void): () => void;
    onDispose(fn: () => void): void;
    setTimeout(fn: () => void, ms: number): () => void;
    setInterval(fn: () => void, ms: number): () => void;
    addEventListener(
      target: EventTarget,
      type: string,
      listener: EventListener,
      options?: AddEventListenerOptions
    ): () => void;
    os: {
      notify(input: { title?: string; body?: string; id?: string }): void;
      openExternal(url: string): void;
      revealPath(path: string): void;
      writeClipboard(text: string): void;
    };
  }

  export interface Atom<T> {
    readonly __value?: T;
  }

  export interface Host {
    state: {
      activeSessionId: Atom<string | null>;
      focusedStoredSessionId: Atom<string | null>;
      awaitingResponse: Atom<boolean>;
      busy: Atom<boolean>;
      model: Atom<string | null>;
      cwd: Atom<string | null>;
    };
    notify(input: {
      kind: string;
      message: string;
      title?: string;
      detail?: string;
      action?: Record<string, unknown>;
    }): void;
    navigate(path: string): void;
    newChat(profile?: string): Promise<unknown>;
    openSession(id: string, options?: Record<string, unknown>): Promise<unknown>;
    request<T>(method: string, params?: Record<string, unknown>): Promise<T>;
    composer: {
      insertText(
        sessionId: string | null,
        text: string,
        options?: Record<string, unknown>
      ): Promise<boolean>;
      submit(sessionId: string | null, text: string): Promise<boolean>;
      focus(sessionId: string | null): void;
    };
  }

  export const host: Host;
  export const ROUTES_AREA: 'routes';
  export const SIDEBAR_NAV_AREA: 'sidebarNav';
  export const PALETTE_AREA: 'palette';
  export const KEYBINDS_AREA: 'keybinds';
  export const STATUSBAR_AREAS: { readonly left: string; readonly right: string };
  export function useValue<T>(atom: Atom<T>): T;
  export interface ThemeInfo {
    theme: Record<string, unknown>;
    themeName: string;
    availableThemes: { name: string; label: string }[];
    resolvedMode: string;
  }
  export function useTheme(): ThemeInfo;
}

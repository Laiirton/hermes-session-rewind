export interface ModelProvider {
  slug: string;
  name: string;
  isCurrent: boolean;
  models: string[];
}

export interface ModelCatalog {
  providers: ModelProvider[];
  currentModel: string | null;
  currentProvider: string | null;
}

const EMPTY: ModelCatalog = { providers: [], currentModel: null, currentProvider: null };

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function optionalText(value: unknown): string | null {
  const trimmed = text(value);
  return trimmed === '' ? null : trimmed;
}

export function parseCatalog(payload: unknown): ModelCatalog {
  if (payload === null || typeof payload !== 'object') {
    return EMPTY;
  }
  const rows = (payload as Record<string, unknown>).providers;
  if (!Array.isArray(rows)) {
    return EMPTY;
  }
  const providers: ModelProvider[] = [];
  for (const row of rows) {
    if (row === null || typeof row !== 'object') {
      continue;
    }
    const entry = row as Record<string, unknown>;
    const slug = text(entry.slug);
    const models = Array.isArray(entry.models)
      ? entry.models.map(text).filter((model) => model !== '')
      : [];
    if (slug === '' || models.length === 0) {
      continue;
    }
    providers.push({
      slug,
      name: text(entry.name) || slug,
      isCurrent: entry.is_current === true,
      models
    });
  }
  return {
    providers,
    currentModel: optionalText((payload as Record<string, unknown>).model),
    currentProvider: optionalText((payload as Record<string, unknown>).provider)
  };
}

export function orderProviders(
  catalog: ModelCatalog,
  sessionProvider: string | null
): ModelProvider[] {
  return [...catalog.providers].sort((a, b) => {
    const aHome = sessionProvider !== null && a.slug === sessionProvider ? 0 : 1;
    const bHome = sessionProvider !== null && b.slug === sessionProvider ? 0 : 1;
    if (aHome !== bHome) {
      return aHome - bHome;
    }
    if (a.isCurrent !== b.isCurrent) {
      return a.isCurrent ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export function searchProviders(providers: ModelProvider[], query: string): ModelProvider[] {
  const needle = query.trim().toLowerCase();
  if (needle === '') {
    return providers;
  }
  const hits: ModelProvider[] = [];
  for (const provider of providers) {
    if (
      provider.name.toLowerCase().includes(needle) ||
      provider.slug.toLowerCase().includes(needle)
    ) {
      hits.push(provider);
      continue;
    }
    const models = provider.models.filter((model) => model.toLowerCase().includes(needle));
    if (models.length > 0) {
      hits.push({ ...provider, models });
    }
  }
  return hits;
}

export function modelDirective(model: string, provider: string | null): string {
  const suffix = provider === null ? '' : ` --provider ${provider}`;
  return `${model}${suffix} --session`;
}

export function differsFromSession(
  model: string,
  provider: string | null,
  sessionModel: string | null,
  sessionProvider: string | null
): boolean {
  if (model === '') {
    return false;
  }
  return model !== (sessionModel ?? '') || provider !== sessionProvider;
}

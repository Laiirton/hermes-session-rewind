import { describe, expect, it } from 'vitest';

import {
  differsFromSession,
  modelDirective,
  orderProviders,
  parseCatalog,
  searchProviders
} from './models';
import type { ModelProvider } from './models';

function provider(slug: string, name: string, models: string[], isCurrent = false): ModelProvider {
  return { slug, name, isCurrent, models };
}

describe('parseCatalog', () => {
  it('keeps only providers that carry a slug and at least one model', () => {
    const catalog = parseCatalog({
      providers: [
        { slug: 'nous', name: 'Nous Portal', is_current: true, models: ['a/one', 'a/two'] },
        { slug: 'openrouter', name: 'OpenRouter', models: [] },
        { name: 'Anonymous', models: ['x'] },
        null,
        'not an object'
      ],
      model: 'a/one',
      provider: 'nous'
    });
    expect(catalog.providers.map((row) => row.slug)).toEqual(['nous']);
    expect(catalog.currentModel).toBe('a/one');
    expect(catalog.currentProvider).toBe('nous');
  });

  it('drops blank model ids and falls back to the slug when a name is missing', () => {
    const catalog = parseCatalog({
      providers: [{ slug: 'nvidia', models: ['ok', '', '  ', '  spaced  '], is_current: false }]
    });
    expect(catalog.providers[0]?.models).toEqual(['ok', 'spaced']);
    expect(catalog.providers[0]?.name).toBe('nvidia');
  });

  it('returns an empty catalog for a payload that is not the expected shape', () => {
    expect(parseCatalog(null).providers).toEqual([]);
    expect(parseCatalog({}).providers).toEqual([]);
    expect(parseCatalog({ providers: 'no' }).providers).toEqual([]);
  });
});

describe('orderProviders', () => {
  it('puts the session provider first, then the gateway current one, then by name', () => {
    const rows = [
      provider('aws', 'AWS Bedrock', ['a'], true),
      provider('nous', 'Nous Portal', ['b']),
      provider('gemini', 'AI Studio', ['c'])
    ];
    expect(
      orderProviders({ providers: rows, currentModel: null, currentProvider: 'aws' }, 'nous').map(
        (row) => row.slug
      )
    ).toEqual(['nous', 'aws', 'gemini']);
  });

  it('leaves the order alone when the session provider is unknown', () => {
    const rows = [provider('zeta', 'Zeta', ['a']), provider('alpha', 'Alpha', ['b'])];
    expect(
      orderProviders({ providers: rows, currentModel: null, currentProvider: null }, null).map(
        (row) => row.slug
      )
    ).toEqual(['alpha', 'zeta']);
  });
});

describe('searchProviders', () => {
  const rows = [
    provider('nous', 'Nous Portal', ['anthropic/claude-fable', 'upstage/solar-mini4:free']),
    provider('nvidia', 'NVIDIA NIM', ['nvidia/nemotron-3.5'])
  ];

  it('returns everything for an empty query', () => {
    expect(searchProviders(rows, '   ')).toBe(rows);
  });

  it('matches a provider name by keeping all of its models', () => {
    const hits = searchProviders(rows, 'nim');
    expect(hits).toHaveLength(1);
    expect(hits[0]?.models).toEqual(['nvidia/nemotron-3.5']);
  });

  it('matches individual models and narrows the row', () => {
    const hits = searchProviders(rows, 'solar');
    expect(hits).toHaveLength(1);
    expect(hits[0]?.models).toEqual(['upstage/solar-mini4:free']);
    expect(hits[0]?.name).toBe('Nous Portal');
  });

  it('says nothing when no model or provider matches', () => {
    expect(searchProviders(rows, 'zzz')).toEqual([]);
  });
});

describe('modelDirective', () => {
  it('names the provider so a model that exists under two is not resolved by guesswork', () => {
    expect(modelDirective('anthropic/claude-fable', 'nous')).toBe(
      'anthropic/claude-fable --provider nous --session'
    );
  });

  it('still scopes to the session when no provider was picked', () => {
    expect(modelDirective('gpt-4o', null)).toBe('gpt-4o --session');
  });
});

describe('differsFromSession', () => {
  it('treats an empty model as no switch at all', () => {
    expect(differsFromSession('', null, 'a/one', 'nous')).toBe(false);
  });

  it('counts a provider change as a switch even when the model id repeats', () => {
    expect(differsFromSession('a/one', 'nvidia', 'a/one', 'nous')).toBe(true);
  });

  it('does not fire when both halves already match', () => {
    expect(differsFromSession('a/one', 'nous', 'a/one', 'nous')).toBe(false);
  });
});

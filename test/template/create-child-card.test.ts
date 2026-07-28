import { describe, it, expect, afterEach } from 'vitest';
import {
  cardTypeHasEditor,
  createChildCard,
  fallbackCustomCardEntries,
  stubConfigForCardType,
} from '../../src/template/shell-grid/create-child-card';
import '../../src/index';

afterEach(() => {
  delete (window as { customCards?: unknown }).customCards;
});

describe('create-child-card', () => {
  it('detects cards that expose getConfigElement', () => {
    expect(cardTypeHasEditor('custom:au-action-card')).toBe(true);
    expect(cardTypeHasEditor('custom:unknown-card-xyz')).toBe(false);
  });

  it('creates a child card element and applies setConfig', async () => {
    const el = await createChildCard({
      type: 'custom:au-action-card',
      entity: 'light.kitchen',
    });
    expect(el.tagName.toLowerCase()).toBe('au-action-card');
    expect((el as { _config?: { entity?: string } })._config?.entity).toBe(
      'light.kitchen',
    );
  });

  it('builds stub config with type', () => {
    const stub = stubConfigForCardType('custom:au-sensor-card');
    expect(stub.type).toBe('custom:au-sensor-card');
  });

  it('filters fallback custom card entries', () => {
    window.customCards = [
      { type: 'au-shell-grid', name: 'Shell' },
      { type: 'au-action-card', name: 'Action' },
    ];
    expect(fallbackCustomCardEntries()).toEqual([
      { type: 'au-action-card', name: 'Action' },
    ]);
  });
});

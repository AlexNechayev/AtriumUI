import { describe, it, expect } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import {
  DRAWER_ITEM_KEYS,
  resolveShellDrawer,
  resolveShellTheme,
  shouldShowDrawerTrigger,
  validateShellDrawerConfig,
} from '../../src/template/shell-grid/shell-drawer-config';
import type { AuShellGridConfig } from '../../src/types/config';

const base = (): AuShellGridConfig => ({ type: 'custom:au-shell-grid' });

describe('resolveShellTheme', () => {
  it('defaults to system when omitted', () => {
    expect(resolveShellTheme(base())).toBe('system');
  });

  it('accepts light, dark, and system', () => {
    expect(resolveShellTheme({ ...base(), theme: 'light' })).toBe('light');
    expect(resolveShellTheme({ ...base(), theme: 'dark' })).toBe('dark');
    expect(resolveShellTheme({ ...base(), theme: 'system' })).toBe('system');
  });
});

describe('resolveShellDrawer', () => {
  it('defaults to enabled with every item on', () => {
    const drawer = resolveShellDrawer(base());
    expect(drawer.enabled).toBe(true);
    for (const key of DRAWER_ITEM_KEYS) {
      expect(drawer.items[key]).toBe(true);
    }
  });

  it('treats omitted item keys as true', () => {
    const drawer = resolveShellDrawer({
      ...base(),
      drawer: { items: { edit: false } },
    });
    expect(drawer.items.edit).toBe(false);
    expect(drawer.items.theme).toBe(true);
    expect(drawer.items.automations).toBe(true);
  });
});

describe('shouldShowDrawerTrigger', () => {
  it('is true by default', () => {
    expect(shouldShowDrawerTrigger(base())).toBe(true);
  });

  it('is false when drawer.enabled is false', () => {
    expect(
      shouldShowDrawerTrigger({ ...base(), drawer: { enabled: false } }),
    ).toBe(false);
  });

  it('is false when every item is false', () => {
    expect(
      shouldShowDrawerTrigger({
        ...base(),
        drawer: {
          items: {
            edit: false,
            theme: false,
            dashboard_settings: false,
            global: false,
            automations: false,
          },
        },
      }),
    ).toBe(false);
  });

  it('stays true when at least one item remains on', () => {
    expect(
      shouldShowDrawerTrigger({
        ...base(),
        drawer: { items: { edit: false, theme: false } },
      }),
    ).toBe(true);
  });
});

describe('validateShellDrawerConfig', () => {
  it('rejects an unknown theme', () => {
    expect(() =>
      validateShellDrawerConfig({ ...base(), theme: 'sepia' as never }),
    ).toThrow(/theme/i);
  });

  it('rejects a non-object drawer', () => {
    expect(() =>
      validateShellDrawerConfig({ ...base(), drawer: true as never }),
    ).toThrow(/drawer/i);
  });

  it('rejects non-boolean item flags', () => {
    expect(() =>
      validateShellDrawerConfig({
        ...base(),
        drawer: { items: { edit: 'no' as never } },
      }),
    ).toThrow(/drawer/i);
  });
});

describe('au-shell-grid setConfig drawer/theme', () => {
  it('accepts theme and drawer YAML', () => {
    const el = document.createElement('au-shell-grid') as AuShellGrid;
    expect(() =>
      el.setConfig({
        type: 'custom:au-shell-grid',
        theme: 'dark',
        drawer: { enabled: true, items: { automations: false } },
      }),
    ).not.toThrow();
  });

  it('rejects invalid theme on setConfig', () => {
    const el = document.createElement('au-shell-grid') as AuShellGrid;
    expect(() =>
      el.setConfig({ type: 'custom:au-shell-grid', theme: 'neon' } as never),
    ).toThrow(/theme/i);
  });
});

import type { AuShellGridConfig } from '../../types/config';

export const SHELL_THEMES = ['light', 'dark', 'system'] as const;
export type AuShellTheme = (typeof SHELL_THEMES)[number];

export const DRAWER_ITEM_KEYS = [
  'edit',
  'theme',
  'dashboard_settings',
  'global',
  'automations',
] as const;
export type AuShellDrawerItemKey = (typeof DRAWER_ITEM_KEYS)[number];

export interface AuResolvedShellDrawer {
  enabled: boolean;
  items: Record<AuShellDrawerItemKey, boolean>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isShellTheme(value: unknown): value is AuShellTheme {
  return (
    typeof value === 'string' &&
    (SHELL_THEMES as readonly string[]).includes(value)
  );
}

/** `theme` YAML: light | dark | system. Default system. */
export function resolveShellTheme(config: AuShellGridConfig): AuShellTheme {
  return isShellTheme(config.theme) ? config.theme : 'system';
}

/** `drawer` YAML with omitted keys defaulting to enabled / all items on. */
export function resolveShellDrawer(
  config: AuShellGridConfig,
): AuResolvedShellDrawer {
  const raw = config.drawer;
  const items = {} as Record<AuShellDrawerItemKey, boolean>;
  for (const key of DRAWER_ITEM_KEYS) {
    const flag = raw?.items?.[key];
    items[key] = flag !== false;
  }
  return {
    enabled: raw?.enabled !== false,
    items,
  };
}

/**
 * Hide the drawer icon when disabled or every menu item is off
 * (`docs/prd/ux/shell-drawer.md` AC9).
 */
export function shouldShowDrawerTrigger(config: AuShellGridConfig): boolean {
  const drawer = resolveShellDrawer(config);
  if (!drawer.enabled) return false;
  return DRAWER_ITEM_KEYS.some((key) => drawer.items[key]);
}

export function validateShellDrawerConfig(config: AuShellGridConfig): void {
  if (config.theme !== undefined && !isShellTheme(config.theme)) {
    throw new Error(
      'AtriumUI Shell Grid: "theme" must be light, dark, or system',
    );
  }
  if (config.drawer === undefined) return;
  if (!isRecord(config.drawer)) {
    throw new Error('AtriumUI Shell Grid: "drawer" must be an object');
  }
  if (
    config.drawer.enabled !== undefined &&
    typeof config.drawer.enabled !== 'boolean'
  ) {
    throw new Error('AtriumUI Shell Grid: "drawer.enabled" must be a boolean');
  }
  if (config.drawer.items === undefined) return;
  if (!isRecord(config.drawer.items)) {
    throw new Error('AtriumUI Shell Grid: "drawer.items" must be an object');
  }
  for (const key of DRAWER_ITEM_KEYS) {
    const flag = config.drawer.items[key];
    if (flag !== undefined && typeof flag !== 'boolean') {
      throw new Error(
        `AtriumUI Shell Grid: "drawer.items.${key}" must be a boolean`,
      );
    }
  }
}

/**
 * Create a child Lovelace card element (HA helpers or direct custom element).
 */
import type {
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../../types/home-assistant';

function cardTag(type: string): string {
  return type.replace(/^custom:/, '');
}

/** True when the card constructor exposes a visual editor. */
export function cardTypeHasEditor(type: string): boolean {
  const ctor = customElements.get(cardTag(type)) as
    | { getConfigElement?: unknown }
    | undefined;
  return typeof ctor?.getConfigElement === 'function';
}

/**
 * Load the native Lovelace card editor for `type`, if the card provides
 * `getConfigElement`. Supports sync or async factories.
 */
export async function getCardEditorElement(
  type: string,
): Promise<LovelaceCardEditor | undefined> {
  const tag = cardTag(type);
  if (!customElements.get(tag)) {
    try {
      await Promise.race([
        customElements.whenDefined(tag),
        new Promise<void>((_, reject) => {
          window.setTimeout(() => reject(new Error('timeout')), 1500);
        }),
      ]);
    } catch {
      return undefined;
    }
  }
  const ctor = customElements.get(tag) as
    | {
        getConfigElement?: () =>
          | LovelaceCardEditor
          | Promise<LovelaceCardEditor>;
      }
    | undefined;
  if (typeof ctor?.getConfigElement !== 'function') return undefined;
  try {
    const editor = await ctor.getConfigElement();
    return editor ?? undefined;
  } catch {
    return undefined;
  }
}

export async function createChildCard(
  config: LovelaceCardConfig,
): Promise<LovelaceCard> {
  const loader = (
    window as unknown as {
      loadCardHelpers?: () => Promise<{
        createCardElement: (c: LovelaceCardConfig) => LovelaceCard;
      }>;
    }
  ).loadCardHelpers;

  const applyConfig = (el: LovelaceCard): LovelaceCard => {
    if (typeof el.setConfig === 'function') {
      try {
        el.setConfig(config);
      } catch (err) {
         
        console.warn('AtriumUI: child card setConfig failed', err);
      }
    }
    return el;
  };

  if (typeof loader === 'function') {
    try {
      const helpers = await loader();
      if (helpers?.createCardElement) {
        // Re-apply config: HA helpers sometimes return a wrapper/error card
        // when the first stub had an empty entity; setConfig makes edits stick.
        return applyConfig(helpers.createCardElement(config));
      }
    } catch {
      // Fall through to direct element creation.
    }
  }

  const tag = config.type.replace(/^custom:/, '');
  return applyConfig(document.createElement(tag) as LovelaceCard);
}

/** Force-load HA's `hui-card-picker` the same way community cards do. */
export async function ensureCardPickerLoaded(): Promise<boolean> {
  if (customElements.get('hui-card-picker')) return true;

  const stack = document.createElement('hui-vertical-stack-card') as HTMLElement & {
    constructor: { getConfigElement?: () => unknown | Promise<unknown> };
  };
  const getConfigElement = (
    stack.constructor as { getConfigElement?: () => unknown | Promise<unknown> }
  ).getConfigElement;
  if (typeof getConfigElement === 'function') {
    try {
      await getConfigElement.call(stack.constructor);
    } catch {
      // Ignore.
    }
  }

  const loader = (
    window as unknown as { loadCardHelpers?: () => Promise<unknown> }
  ).loadCardHelpers;
  if (typeof loader === 'function') {
    try {
      await loader();
    } catch {
      // Ignore.
    }
  }

  if (customElements.get('hui-card-picker')) return true;

  try {
    await Promise.race([
      customElements.whenDefined('hui-card-picker'),
      new Promise<void>((_, reject) => {
        window.setTimeout(() => reject(new Error('timeout')), 2500);
      }),
    ]);
    return Boolean(customElements.get('hui-card-picker'));
  } catch {
    return false;
  }
}

export function stubConfigForCardType(
  type: string,
  hass?: unknown,
): LovelaceCardConfig {
  const tag = cardTag(type);
  const ctor = customElements.get(tag) as
    | { getStubConfig?: (hass?: unknown) => Record<string, unknown> }
    | undefined;
  const stub =
    typeof ctor?.getStubConfig === 'function' ? ctor.getStubConfig(hass) : {};
  const withType = stub as LovelaceCardConfig;
  const resolved =
    withType.type ??
    (type.startsWith('custom:') ? type : `custom:${type}`);
  return { ...withType, type: resolved };
}

export function fallbackCustomCardEntries(excludeType = 'au-shell-grid'): Array<{
  type: string;
  name: string;
  description?: string;
}> {
  const entries = window.customCards ?? [];
  return entries.filter((e) => e.type !== excludeType);
}

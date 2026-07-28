/**
 * AtriumUI - Explicit Home Assistant type surface.
 *
 * The spec (section 2) mandates TypeScript strict mode with every architectural
 * interface explicitly declared. Rather than depend on an external, drifting
 * community typings package, AtriumUI declares the minimal-yet-accurate slice of
 * the Home Assistant frontend contract it relies on.
 */

/** Common base attributes present on virtually every entity. */
export interface HassEntityAttributeBase {
  friendly_name?: string;
  unit_of_measurement?: string;
  icon?: string;
  entity_picture?: string;
  device_class?: string;
  supported_features?: number;
  assumed_state?: boolean;
  [key: string]: unknown;
}

/** A single entity's state object as injected via `hass.states[entity_id]`. */
export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: HassEntityAttributeBase;
  context?: {
    id: string;
    parent_id?: string | null;
    user_id?: string | null;
  };
}

/** Theme registry surfaced by the frontend. */
export interface HassThemes {
  default_theme: string;
  themes: Record<string, Record<string, string>>;
  darkMode?: boolean;
  theme?: string;
}

/** The authenticated user. */
export interface HassUser {
  id: string;
  name: string;
  is_admin?: boolean;
  is_owner?: boolean;
}

/** Area registry entry (when HA injects `hass.areas`). */
export interface HassArea {
  area_id: string;
  name: string;
  icon?: string;
  floor_id?: string | null;
  aliases?: string[];
}

/** Floor registry entry (when HA injects `hass.floors`). */
export interface HassFloor {
  floor_id: string;
  name: string;
  level?: number;
  icon?: string;
}

/** Device registry entry (when HA injects `hass.devices`). */
export interface HassDevice {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  area_id?: string | null;
  manufacturer?: string | null;
  model?: string | null;
}

/** Entity registry entry (when HA injects `hass.entities`). */
export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id?: string | null;
  area_id?: string | null;
  platform?: string;
  name?: string | null;
  original_name?: string | null;
  icon?: string | null;
  disabled_by?: string | null;
  hidden_by?: string | null;
}

/**
 * The global context object the Home Assistant frontend engine injects into every
 * active Lovelace custom card whenever state modifications occur (spec 3.1 / 3.3).
 */
export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  themes: HassThemes;
  user: HassUser;
  language: string;

  /**
   * Asynchronously push a state update back to the backend over the active
   * WebSocket bridge (spec 3.3).
   *
   * When `returnResponse` is true (HA 2023.12+), resolves with `{ response }`
   * for services that support response data (e.g. `calendar.get_events`).
   */
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<void | { response?: unknown }>;

  /**
   * Optional WebSocket API used for registry lookups on newer HA frontends.
   * Not required for P0; used opportunistically for areas/devices.
   */
  callWS?<T = unknown>(message: Record<string, unknown>): Promise<T>;

  /**
   * Optional REST helper used by the HA frontend (e.g. calendar list API).
   * Signature matches `hass.callApi(method, path)`.
   */
  callApi?<T = unknown>(method: string, path: string): Promise<T>;

  /** Area registry map when provided by the frontend. */
  areas?: { [area_id: string]: HassArea };
  /** Floor registry map when provided by the frontend. */
  floors?: { [floor_id: string]: HassFloor };
  /** Device registry map when provided by the frontend. */
  devices?: { [device_id: string]: HassDevice };
  /** Entity registry map when provided by the frontend. */
  entities?: { [entity_id: string]: HassEntityRegistryEntry };

  // Optional, commonly-available fields used opportunistically by cards.
  locale?: {
    language: string;
    number_format?: string;
    time_format?: string;
  };
  localize?: (key: string, ...args: unknown[]) => string;
}

/** Base shape of any Lovelace card configuration parsed from YAML. */
export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

/**
 * The dashboard (Lovelace) configuration/context. HA injects this onto editor
 * elements that declare a `lovelace` property, and nested editors (like the
 * card picker) require it. Kept loose since we only forward it downstream.
 */
export interface LovelaceConfig {
  [key: string]: unknown;
}

/** Live Lovelace dashboard context injected by HA on views and card editors. */
export interface Lovelace {
  editMode: boolean;
  mode?: 'generated' | 'yaml' | 'storage';
  config?: LovelaceConfig;
  saveConfig?: (config: Record<string, unknown>) => Promise<void>;
  showToast?: (params: { message: string; duration?: number }) => void;
  [key: string]: unknown;
}

/**
 * The runtime contract every native-behaving Lovelace card must satisfy
 * (spec 3.2). `hass` is injected as a property; `setConfig` validates YAML.
 */
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  /**
   * Set by HA to `true` while the dashboard is in edit mode. Newer HA renamed
   * this to `preview`, but still mirrors it here for backward compatibility.
   */
  editMode?: boolean;
  /** Newer HA edit-mode flag (also true in card editor/picker previews). */
  preview?: boolean;
  /** Set by HA to `true` when the card is the sole card of a Panel view. */
  isPanel?: boolean;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number | Promise<number>;
}

/** The editor element returned from a card's static `getConfigElement()`. */
export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  /** Injected by HA on editors that declare it; needed by nested card editors. */
  lovelace?: LovelaceConfig;
  setConfig(config: LovelaceCardConfig): void;
}

/** Descriptor pushed to `window.customCards` so a card appears in the UI picker. */
export interface CustomCardEntry {
  type: string;
  name: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

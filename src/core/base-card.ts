import { LitElement, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { entityFingerprint, getRootHass } from '../utils/hass-entity';
import type { HomeAssistant, LovelaceCardConfig } from '../types/home-assistant';

/**
 * Home Assistant swaps the state object reference for an entity whenever any of
 * its state or attributes change. Reference inequality is therefore a correct
 * and cheap implementation of the spec's change directive (spec 3.1).
 *
 * Also compares state/last_updated/brightness fingerprints so in-place mutation
 * and lagging forwarded hass still trigger updates.
 */
export function hasEntityChanged(
  prev: HomeAssistant | undefined,
  next: HomeAssistant | undefined,
  entityId: string,
): boolean {
  if (!prev || !next) return true;
  const a = prev.states[entityId];
  const b = next.states[entityId];
  if (a !== b) return true;
  // Same reference can still mutate in place on some HA paths — compare fields.
  return entityFingerprint(a) !== entityFingerprint(b);
}

/**
 * `AuBaseCard` - the shared foundation every AtriumUI card extends.
 *
 * Responsibilities:
 *  - Expose the injected `hass` context and typed `_config` as reactive props.
 *  - Enforce the `setConfig` validation contract (spec 3.2) via `validateConfig`.
 *  - Filter re-renders so cards never re-render unconditionally (spec 3.1) by
 *    diffing only the entities a card actually depends on.
 *  - Provide a teardown registry drained in `disconnectedCallback` so intervals,
 *    event streams, and listeners never leak (spec 7).
 */
export abstract class AuBaseCard<
  TConfig extends LovelaceCardConfig = LovelaceCardConfig,
> extends LitElement {
  /** Injected by the HA frontend on every state broadcast. Not an attribute. */
  @property({ attribute: false }) public hass?: HomeAssistant;

  /** Parsed + validated YAML configuration. */
  @state() protected _config?: TConfig;

  private _teardownFns: Array<() => void> = [];
  /** Last rendered fingerprints — detect root-hass fresher / in-place mutation. */
  private _entityFingerprints = new Map<string, string>();

  /**
   * Mandatory Lovelace lifecycle hook (spec 3.2). Validates structural YAML
   * before storing it; validation errors surface in the native red error card.
   */
  public setConfig(config: TConfig): void {
    if (!config) {
      throw new Error('AtriumUI: configuration is required');
    }
    // Never retain/mutate the caller’s object — Lovelace may share it with editors.
    const next = { ...config } as TConfig;
    this.validateConfig(next);
    this._config = next;
  }

  /**
   * Subclasses throw an explicit error string when required tokens are missing
   * (spec 3.2). Called before the config is committed.
   */
  protected abstract validateConfig(config: TConfig): void;

  /**
   * Entity ids whose state changes should trigger a re-render. Cards backed by
   * a single entity override this; container cards that forward `hass` to
   * children may override `shouldUpdate` instead.
   */
  protected watchedEntities(): string[] {
    return [];
  }

  /**
   * Guard the reactive update pipeline (spec 3.1). Re-render on config change,
   * on non-hass reactive changes, or only when a watched entity actually
   * changed. Never force an unconditional re-render on every hass broadcast.
   */
  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has('_config')) return true;
    if (!changed.has('hass')) return true;

    const prev = changed.get('hass') as HomeAssistant | undefined;
    if (!prev || !this.hass) return true;

    const ids = this.watchedEntities();
    if (ids.length === 0) return false;

    const root = getRootHass();
    return ids.some((id) => {
      if (hasEntityChanged(prev, this.hass, id)) {
        const e = this.hass!.states[id] ?? root?.states[id];
        this._entityFingerprints.set(id, entityFingerprint(e));
        return true;
      }

      const local = this.hass!.states[id];
      const live = root?.states[id];
      const best =
        live && local && live.last_updated > local.last_updated
          ? live
          : (local ?? live);
      const fp = entityFingerprint(best);
      const prevFp = this._entityFingerprints.get(id);
      if (prevFp !== undefined && prevFp !== fp) {
        this._entityFingerprints.set(id, fp);
        return true;
      }
      if (prevFp === undefined) {
        this._entityFingerprints.set(id, fp);
      }
      return false;
    });
  }

  /** Register a cleanup callback to run on disconnect (spec 7). */
  protected registerTeardown(fn: () => void): void {
    this._teardownFns.push(fn);
  }

  /**
   * Tear down all background references so long-lived dashboards never leak
   * intervals, event streams, or window listeners (spec 7).
   */
  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    const fns = this._teardownFns.splice(0, this._teardownFns.length);
    for (const fn of fns) {
      try {
        fn();
      } catch {
        /* teardown must never throw */
      }
    }
  }

  /** Default Lovelace layout size hint; cards may override. */
  public getCardSize(): number {
    return 1;
  }
}

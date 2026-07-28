import { html, nothing, type TemplateResult } from 'lit';
import { eventOptions } from 'lit/decorators.js';
import { type ClassInfo } from 'lit/directives/class-map.js';
import { AuCardContent } from './card-content';
import { executeAction, resolveAction } from '../utils/action';
import {
  computeDomain,
  computeEntityName,
  formatBrightnessPercent,
} from '../utils/entity';
import { getRootHass, pickFreshestEntity } from '../utils/hass-entity';
import {
  clearHoldTimer,
  createPointerGestureState,
  handleGesturePointerCancel,
  handleGesturePointerDown,
  handleGesturePointerUp,
  type GestureKind,
  type PointerGestureState,
} from '../utils/pointer-gestures';
import { activateOnce } from '../utils/touch-click';
import type {
  ActionConfig,
  AuActionCardBaseConfig,
  AuActionCardContentLayout,
} from '../types/action';
import type { HassEntity } from '../types/home-assistant';

/** Humanize an attribute/state key: "color_temp" -> "Color temp". */
function humanize(key: string): string {
  const spaced = key.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export interface ActionSurfaceOptions {
  ariaLabel?: string;
  active?: boolean;
  unavailable?: boolean;
}

/**
 * `AuActionCardBase` - shared foundation for entity-backed action cards.
 *
 * Only `entity` is required. Icon, name, and secondary line each show entity
 * defaults when their value is omitted; use `show_*` flags to hide any slot.
 * Defaults: tap = toggle, hold = more-info, double-tap = more-info.
 * Unavailable / non-toggleable tap falls back to more-info via `executeAction`.
 */
export abstract class AuActionCardBase<
  TConfig extends AuActionCardBaseConfig = AuActionCardBaseConfig,
> extends AuCardContent<TConfig> {
  private _gesture: PointerGestureState = createPointerGestureState();

  protected validateConfig(config: TConfig): void {
    if (!config.entity) {
      throw new Error('AtriumUI Action Card: "entity" is required');
    }
    if (typeof config.entity !== 'string' || !config.entity.includes('.')) {
      throw new Error('AtriumUI Action Card: "entity" must be a valid entity id');
    }
    // HA entity ids are lowercase; trim avoids "set but missing" lookups.
    // Mutating `config` is safe: `setConfig` already shallow-copied the caller object.
    const normalized = config.entity.trim().toLowerCase();
    if (normalized !== config.entity) {
      (config as { entity: string }).entity = normalized;
    }
    if (
      config.content_layout !== undefined &&
      config.content_layout !== 'horizontal' &&
      config.content_layout !== 'vertical'
    ) {
      throw new Error(
        'AtriumUI Action Card: "content_layout" must be "horizontal" or "vertical"',
      );
    }
  }

  protected override watchedEntities(): string[] {
    return this._config?.entity ? [this._config.entity] : [];
  }

  protected get entity(): HassEntity | undefined {
    if (!this._config) return undefined;
    const id = this._config.entity;
    const local = this.hass?.states[id];
    const root = getRootHass()?.states[id];
    return pickFreshestEntity(local, root);
  }

  protected get iconOverride(): string | undefined {
    const icon = this._config?.icon?.trim();
    return icon || undefined;
  }

  protected get showIcon(): boolean {
    return this._config?.show_icon !== false;
  }

  protected get showName(): boolean {
    return this._config?.show_name !== false;
  }

  protected get showSecondaryAttribute(): boolean {
    return this._config?.show_secondary_attribute !== false;
  }

  protected get contentLayout(): AuActionCardContentLayout {
    if (this._config?.content_layout === 'vertical') return 'vertical';
    if (this._config?.content_layout === 'horizontal') return 'horizontal';
    // Unset: home tiles default vertical; classic cards default horizontal.
    return this.isHomeVariant ? 'vertical' : 'horizontal';
  }

  /** Apple Home–style squircle treatment (set by home dashboard or YAML). */
  protected get isHomeVariant(): boolean {
    return this._config?.variant === 'home';
  }

  /** Icon-only chip (room strip) — same gestures, compact layout. */
  protected get isChip(): boolean {
    return this._config?.chip === true;
  }

  protected homeDomainClass(entityId: string): string {
    const domain = computeDomain(entityId);
    return domain ? `domain-${domain}` : '';
  }

  protected get nameOverride(): string | undefined {
    const name = this._config?.name?.trim();
    return name || undefined;
  }

  protected resolveName(entity: HassEntity): string {
    return this.nameOverride ?? computeEntityName(entity);
  }

  protected get secondaryAttribute(): string | undefined {
    const attr = this._config?.secondary_attribute?.trim();
    return attr || undefined;
  }

  protected resolveSecondaryText(entity: HassEntity): string | undefined {
    const attr = this.secondaryAttribute;
    if (attr) {
      if (attr === 'brightness') {
        if (entity.state === 'off') return '0%';
        const raw = entity.attributes.brightness;
        if (typeof raw !== 'number') return undefined;
        return formatBrightnessPercent(raw);
      }
      const value = entity.attributes[attr];
      if (value === undefined) return undefined;
      return `${humanize(attr)}: ${String(value)}`;
    }
    return entity.state;
  }

  /**
   * Up to two attribute lines under the device name.
   * Default: a single secondary line. Subclasses add a 2nd when supported.
   */
  protected resolveAttributeLines(entity: HassEntity): string[] {
    if (!this.showSecondaryAttribute) return [];
    if (this.secondaryAttribute) {
      const line = this.resolveSecondaryText(entity);
      return line !== undefined ? [line] : [];
    }
    const line = this.resolveSecondaryText(entity);
    return line !== undefined ? [line] : [];
  }

  /** Icon + name + attribute line(s), shared across action-derived cards. */
  protected renderHeaderStack(entity: HassEntity): TemplateResult {
    const name = this.showName ? this.resolveName(entity) : undefined;
    const lines = this.resolveAttributeLines(entity);
    const hasText = name !== undefined || lines.length > 0;

    return html`
      ${this.showIcon
        ? html`<div class="icon">${this.renderEntityIcon(entity, this.iconOverride)}</div>`
        : nothing}
      ${hasText
        ? html`<div class="text">
            ${name !== undefined ? this.renderName(name) : nothing}
            ${lines.map((line, i) =>
              i === 0
                ? this.renderSecondary(line)
                : html`<span class="secondary secondary-2">${line}</span>`,
            )}
          </div>`
        : nothing}
    `;
  }

  protected get tapAction(): ActionConfig {
    return resolveAction(this._config?.tap_action, this._config!.entity, 'tap');
  }

  protected get holdAction(): ActionConfig {
    return resolveAction(this._config?.hold_action, this._config!.entity, 'hold');
  }

  protected get doubleTapAction(): ActionConfig {
    return resolveAction(
      this._config?.double_tap_action,
      this._config!.entity,
      'double_tap',
    );
  }

  protected renderEntityIcon(
    entity: HassEntity,
    override?: string,
  ): TemplateResult {
    if (override) {
      return html`<ha-icon .icon=${override}></ha-icon>`;
    }
    return html`<ha-state-icon .hass=${this.hass} .stateObj=${entity}></ha-state-icon>`;
  }

  protected renderName(name: string): TemplateResult {
    return html`<span class="primary">${name}</span>`;
  }

  protected renderSecondary(text: string): TemplateResult {
    return html`<span class="secondary">${text}</span>`;
  }

  protected renderActionSurface(
    classes: ClassInfo,
    body: TemplateResult | typeof nothing,
    options: ActionSurfaceOptions = {},
  ): TemplateResult {
    const active = options.active ?? false;
    const ariaLabel = options.ariaLabel;

    // Keep gestures when unavailable so more-info can still open.
    // Tap uses touchend/click (tablet-safe); hold still uses pointerdown timer.
    return this.renderCardRoot(classes, body, {
      role: 'button',
      tabindex: 0,
      ariaPressed: active ? 'true' : 'false',
      ariaLabel,
      onPointerDown: this._onPointerDown,
      onPointerUp: this._onPointerUp,
      onPointerLeave: this._onPointerCancel,
      onPointerCancel: this._onPointerCancel,
      onTouchEnd: this._onTouchEnd,
      onClick: this._onClick,
      onKeyDown: this._onKeyDown,
    });
  }

  /**
   * Inner header button used by light/climate/device cards that keep controls
   * outside the tap surface. Shares the same gesture handlers as the root.
   */
  protected renderHeaderActionButton(
    content: TemplateResult | typeof nothing,
    options: {
      className?: string;
      disabled?: boolean;
      active?: boolean;
      ariaLabel?: string;
    } = {},
  ): TemplateResult {
    const className = options.className ?? 'header-action';
    const disabledClass = options.disabled ? ' disabled' : '';
    return html`
      <button
        type="button"
        class="${className}${disabledClass}"
        ?disabled=${options.disabled === true}
        aria-pressed=${options.active !== undefined
          ? options.active
            ? 'true'
            : 'false'
          : nothing}
        aria-label=${options.ariaLabel ?? nothing}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerCancel}
        @pointercancel=${this._onPointerCancel}
        @touchend=${this._onTouchEnd}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
      >
        ${content}
      </button>
    `;
  }

  /** Subclasses (e.g. device card) may override tap handling. */
  protected fireResolvedAction(kind: GestureKind): void {
    if (!this._config) return;
    const action =
      kind === 'hold'
        ? this.holdAction
        : kind === 'double_tap'
          ? this.doubleTapAction
          : this.tapAction;
    void executeAction(this, this.hass, action, this._config.entity);
  }

  protected _onPointerDown = (ev: PointerEvent): void => {
    handleGesturePointerDown(this._gesture, ev, {
      onHold: () => this.fireResolvedAction('hold'),
    });
  };

  protected _onPointerUp = (): void => {
    // Hold uses the timer; tap is handled by touchend/click so tablets
    // that drop pointerup still activate.
    clearHoldTimer(this._gesture);
  };

  protected _onPointerCancel = (): void => {
    handleGesturePointerCancel(this._gesture);
  };

  private _resolvePointerUp(): void {
    handleGesturePointerUp(this._gesture, {
      onTap: () => this.fireResolvedAction('tap'),
      onHold: () => this.fireResolvedAction('hold'),
      onDoubleTap: () => this.fireResolvedAction('double_tap'),
    });
  }

  @eventOptions({ passive: false })
  protected _onTouchEnd(ev: TouchEvent): void {
    const target = ev.currentTarget ?? ev.target;
    if (!target) {
      this._resolvePointerUp();
      return;
    }
    activateOnce(target, ev, () => this._resolvePointerUp());
  }

  protected _onClick(ev: Event): void {
    const target = ev.currentTarget ?? ev.target;
    if (!target) {
      this._resolvePointerUp();
      return;
    }
    activateOnce(target, ev, () => this._resolvePointerUp());
  }

  protected _onKeyDown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.fireResolvedAction('tap');
    }
  };

  /** Used by tests and HA action-handler compatibility shims. */
  protected _onAction = (
    ev: CustomEvent<{ action: 'tap' | 'hold' | 'double_tap' }>,
  ): void => {
    if (!this._config) return;
    this.fireResolvedAction(ev.detail.action);
  };

  protected abstract renderActionBody(
    entity: HassEntity,
  ): TemplateResult | typeof nothing;

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entity = this.entity;

    if (!entity) {
      return html`<div class="au-error">
        Entity not found: ${this._config.entity}
      </div>`;
    }

    return this.renderActionSurface(
      { tile: true },
      this.renderActionBody(entity),
      {
        ariaLabel: this.showName ? this.resolveName(entity) : this._config.entity,
      },
    );
  }
}

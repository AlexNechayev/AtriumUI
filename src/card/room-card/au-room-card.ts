import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement, eventOptions } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AuCardContent } from '../../core/card-content';
import { auHomeTileStyles, auHomeTokens } from '../../theme/home-style';
import { executeAction } from '../../utils/action';
import { activateOnce } from '../../utils/touch-click';
import { getRootHass, pickFreshestEntity } from '../../utils/hass-entity';
import { entityDisplayOn } from '../../utils/sync-debug';
import { controlIcon } from '../../utils/domain-icons';
import { hasEntityChanged } from '../../core/base-card';
import type { PropertyValues } from 'lit';
import type {
  AuRoomCardConfig,
  AuRoomCardEntityConfig,
} from '../../types/room-card';
import { normalizeRoomCardEntities } from '../../types/room-card';
import './au-room-card-editor';

/**
 * `au-room-card` — multi-entity icon row. No single required `entity`.
 *
 * Uses the same `.au-card.home-tile` surface as entity tiles. Only the icon
 * chips (and optional interactive header) are tap targets.
 */
@customElement('au-room-card')
export class AuRoomCard extends AuCardContent<AuRoomCardConfig> {
  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
      }

      .au-card.home-tile.room-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: var(--au-gap);
        height: 100%;
        min-height: 0;
      }

      .au-card.home-tile.room-card.has-active {
        background: linear-gradient(
          160deg,
          color-mix(
            in srgb,
            var(--au-home-accent-light, #f5c542) 22%,
            var(--au-home-surface-elevated, #fff)
          ),
          var(--au-home-surface-elevated, #fff) 60%
        );
      }

      .au-card.compact.room-card {
        padding: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        height: auto;
        min-height: var(--au-control-size);
      }

      .header-action {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: var(--au-gap);
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: start;
        width: 100%;
        min-width: 0;
        appearance: none;
        -webkit-appearance: none;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        cursor: default;
      }

      .header-action.interactive {
        cursor: pointer;
      }

      .header-action.interactive:focus-visible {
        outline: 2px solid
          color-mix(
            in srgb,
            var(--au-home-accent-default, var(--primary-color)) 55%,
            transparent
          );
        outline-offset: 2px;
        border-radius: 8px;
      }

      .header-action .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        pointer-events: none;
      }

      .header-action .text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        width: 100%;
        align-items: flex-start;
        text-align: start;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--au-gap-sm);
        width: 100%;
        margin-top: auto;
      }

      .chip {
        width: var(--au-control-size);
        height: var(--au-control-size);
        min-width: var(--au-control-size);
        min-height: var(--au-control-size);
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        font: inherit;
        color: var(--au-home-accent-light, #f5c542);
        background: color-mix(
          in srgb,
          var(--au-home-accent-light, #f5c542) 18%,
          transparent
        );
        --mdc-icon-size: var(--au-control-glyph);
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
      }

      .chip ha-icon {
        pointer-events: none;
      }

      .chip.is-on {
        background: color-mix(
          in srgb,
          var(--au-home-accent-light, #f5c542) 42%,
          var(--au-home-surface-elevated, #fff)
        );
        opacity: 1;
      }

      .chip.is-off {
        opacity: 0.42;
      }

      .chip:disabled {
        cursor: default;
        opacity: 0.35;
      }

      .chip:focus-visible {
        outline: 2px solid
          color-mix(in srgb, var(--au-home-accent-light, #f5c542) 55%, transparent);
        outline-offset: 2px;
      }

      .empty {
        font-size: var(--au-font-secondary);
        color: var(--au-home-muted, var(--secondary-text-color));
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-room-card-editor');
  }

  public static getStubConfig(): AuRoomCardConfig {
    return {
      type: 'custom:au-room-card',
      name: 'Room',
      icon: 'mdi:sofa-outline',
      variant: 'home',
      entities: [],
    };
  }

  protected validateConfig(config: AuRoomCardConfig): void {
    if (config.entities !== undefined && !Array.isArray(config.entities)) {
      throw new Error('AtriumUI Room Card: "entities" must be a list');
    }
  }

  protected override watchedEntities(): string[] {
    return normalizeRoomCardEntities(this._config?.entities).map((e) => e.entity);
  }

  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has('_config')) return true;
    if (!changed.has('hass')) return true;
    const prev = changed.get('hass') as typeof this.hass;
    const next = this.hass;
    for (const id of this.watchedEntities()) {
      if (hasEntityChanged(prev, next, id)) return true;
    }
    return false;
  }

  private get _entities(): AuRoomCardEntityConfig[] {
    return normalizeRoomCardEntities(this._config?.entities);
  }

  private get _compact(): boolean {
    return this._config?.compact === true;
  }

  private get _homeTile(): boolean {
    return this._config?.variant === 'home' || !this._config?.variant;
  }

  private get _headerIcon(): string {
    const icon = this._config?.icon?.trim();
    if (icon) return icon;
    return 'mdi:sofa-outline';
  }

  private get _showHeader(): boolean {
    if (this._compact) return false;
    if (this._config?.show_name === false) return false;
    return Boolean(this._config?.name?.trim()) || this._homeTile;
  }

  private get _headerInteractive(): boolean {
    return this._config?.header_interactive === true;
  }

  private get _hasActive(): boolean {
    return this._entities.some((e) => this._isOn(e.entity));
  }

  private _chipIcon(entry: AuRoomCardEntityConfig): string {
    const st = this.hass?.states[entry.entity];
    const attr = st?.attributes?.icon;
    return controlIcon({
      entity: {
        entity: entry.entity,
        icon: entry.icon?.trim() || undefined,
      },
      attrIcon: typeof attr === 'string' ? attr : undefined,
    });
  }

  private _chipLabel(entry: AuRoomCardEntityConfig): string {
    if (entry.name?.trim()) return entry.name.trim();
    const st = this.hass?.states[entry.entity];
    if (st?.attributes?.friendly_name) {
      return String(st.attributes.friendly_name);
    }
    return entry.entity;
  }

  private _isOn(entityId: string): boolean {
    const id = entityId.trim().toLowerCase();
    const local = this.hass?.states[id];
    const root = getRootHass()?.states[id];
    return entityDisplayOn(pickFreshestEntity(local, root));
  }

  private _toggleEntity(entityId: string): void {
    if (!this.hass) return;
    const id = entityId.trim().toLowerCase();
    void executeAction(
      this,
      this.hass,
      { action: 'toggle', entity: id },
      id,
    );
  }

  private _onChipActivate = (entityId: string, ev: Event): void => {
    const btn = ev.currentTarget;
    if (!(btn instanceof HTMLElement)) return;
    activateOnce(btn, ev, () => this._toggleEntity(entityId));
  };

  @eventOptions({ passive: false })
  private _onChipTouchEnd(ev: TouchEvent): void {
    const btn = ev.currentTarget as HTMLElement | null;
    const entityId = btn?.dataset?.entity?.trim();
    if (!entityId) return;
    this._onChipActivate(entityId, ev);
  }

  private _stop = this.stopPropagation;

  private _fireHeader(): void {
    this.dispatchEvent(
      new CustomEvent('au-room-header', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onHeaderActivate = (ev: Event): void => {
    const btn = ev.currentTarget;
    if (!(btn instanceof HTMLElement)) return;
    activateOnce(btn, ev, () => this._fireHeader());
  };

  @eventOptions({ passive: false })
  private _onHeaderTouchEnd(ev: TouchEvent): void {
    this._onHeaderActivate(ev);
  }

  private _renderHeader(): TemplateResult {
    const name = this._config?.name?.trim() || 'Room';
    const subtitle = this._config?.subtitle?.trim();
    const interactive = this._headerInteractive;
    const body = html`
      <div class="icon">
        <ha-icon .icon=${this._headerIcon}></ha-icon>
      </div>
      <div class="text">
        <span class="primary title">${name}</span>
        ${subtitle
          ? html`<span class="secondary subtitle">${subtitle}</span>`
          : nothing}
      </div>
    `;
    if (interactive) {
      return html`
        <button
          type="button"
          class="header-action interactive"
          aria-label=${name}
          @click=${this._onHeaderActivate}
          @touchend=${this._onHeaderTouchEnd}
        >
          ${body}
        </button>
      `;
    }
    return html`<div class="header-action">${body}</div>`;
  }

  private _renderChip(entry: AuRoomCardEntityConfig): TemplateResult {
    const on = this._isOn(entry.entity);
    const missing = !this.hass?.states[entry.entity];
    return html`
      <button
        type="button"
        class=${classMap({
          chip: true,
          'is-on': on,
          'is-off': !on,
        })}
        data-entity=${entry.entity}
        title=${this._chipLabel(entry)}
        aria-label=${this._chipLabel(entry)}
        aria-pressed=${on ? 'true' : 'false'}
        ?disabled=${missing}
        @pointerdown=${this._stop}
        @click=${(ev: Event) => this._onChipActivate(entry.entity, ev)}
        @touchend=${this._onChipTouchEnd}
      >
        <ha-icon .icon=${this._chipIcon(entry)}></ha-icon>
      </button>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entities = this._entities;
    const compact = this._compact;
    const homeTile = this._homeTile;

    return this.renderCardRoot(
      {
        'home-tile': homeTile,
        'room-card': true,
        compact,
        'has-active': this._hasActive,
      },
      html`
        ${this._showHeader ? this._renderHeader() : nothing}
        <div class="chips" @pointerdown=${this._stop} @click=${this._stop}>
          ${entities.length === 0
            ? homeTile
              ? nothing
              : html`<span class="empty">No entities configured</span>`
            : entities.map((e) => this._renderChip(e))}
        </div>
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-room-card': AuRoomCard;
  }
}

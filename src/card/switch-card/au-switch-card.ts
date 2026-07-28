import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityActive, isEntityOffline } from '../../utils/entity';
import { executeAction } from '../../utils/action';
import { auDebug } from '../../utils/debug';
import { localize } from '../../localize/localize';
import {
  formatSwitchSecondary,
  toggleSwitch,
  validateSwitchEntity,
} from '../../utils/switch';
import type { GestureKind } from '../../utils/pointer-gestures';
import type { HassEntity } from '../../types/home-assistant';
import type { AuSwitchCardConfig } from '../../types/switch';
import './au-switch-card-editor';

/**
 * `au-switch-card` - dedicated switch toggle tile.
 */
@customElement('au-switch-card')
export class AuSwitchCard extends AuActionCardBase<AuSwitchCardConfig> {
  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    auActionTileLayout,
    css`
      .tile.unavailable .header-action {
        cursor: not-allowed;
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-switch-card-editor');
  }

  public static getStubConfig(): AuSwitchCardConfig {
    return { type: 'custom:au-switch-card', entity: '' };
  }

  protected override validateConfig(config: AuSwitchCardConfig): void {
    super.validateConfig(config);
    validateSwitchEntity(config.entity);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const entityId = this._config?.entity;
    if (this.hass && entityId) {
      void this.hass.callService('homeassistant', 'update_entity', {
        entity_id: entityId,
      });
    }
  }

  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    return formatSwitchSecondary(entity);
  }

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass?.language, key);
  }

  protected override fireResolvedAction(kind: GestureKind): void {
    if (!this._config) return;
    if (!this.entity || isEntityOffline(this.entity)) {
      void executeAction(
        this,
        this.hass,
        { action: 'more-info', entity: this._config.entity },
        this._config.entity,
      );
      return;
    }
    if (kind === 'tap' && this.tapAction.action === 'toggle') {
      const entity = this.entity;
      const currentlyOn = isEntityActive(entity);
      auDebug(this._config.debug, 'switch-card', 'toggle', {
        entity: entity.entity_id,
        currentlyOn,
      });
      void toggleSwitch(this.hass!, entity, { currentlyOn });
      return;
    }
    super.fireResolvedAction(kind);
  }

  protected override renderActionBody(entity: HassEntity): TemplateResult | typeof nothing {
    const offline = isEntityOffline(entity);
    return html`
      ${this.renderHeaderActionButton(this.renderHeaderStack(entity), {
        disabled: offline,
      })}
    `;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entity = this.entity;

    if (!entity) {
      return html`<div class="au-error">
        ${this._t('home.entity_missing')}: ${this._config.entity}
      </div>`;
    }

    const active = isEntityActive(entity);
    const offline = isEntityOffline(entity);

    return this.renderCardRoot(
      {
        tile: true,
        active,
        unavailable: offline,
        [this.contentLayout]: true,
        'home-tile': this.isHomeVariant,
        chip: this.isChip,
        [this.homeDomainClass(entity.entity_id)]: this.isHomeVariant,
      },
      this.renderActionBody(entity),
      {
        ariaLabel: this.showName ? this.resolveName(entity) : this._config.entity,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-switch-card': AuSwitchCard;
  }
}

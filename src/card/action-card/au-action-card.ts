import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityActive, isUnavailable } from '../../utils/entity';
import type { HassEntity } from '../../types/home-assistant';
import type { AuActionCardConfig } from '../../types/config';
import './au-action-card-editor';

/**
 * `au-action-card` (spec 5.2) - a reactive tactical tile that shifts style
 * depending on whether the entity is on or off.
 *
 * Same DOM as light/device: outer `.au-card` + inner `.header-action` so
 * shared vertical home-tile CSS centers icon/name/secondary.
 */
@customElement('au-action-card')
export class AuActionCard extends AuActionCardBase<AuActionCardConfig> {
  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    auActionTileLayout,
    css`
      .tile {
        cursor: default;
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-action-card-editor');
  }

  public static getStubConfig(): AuActionCardConfig {
    return { type: 'custom:au-action-card', entity: '' };
  }

  protected override renderActionBody(entity: HassEntity): TemplateResult | typeof nothing {
    return this.renderHeaderStack(entity);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entity = this.entity;

    if (!entity) {
      return html`<div class="au-error">
        Entity not found: ${this._config.entity}
      </div>`;
    }

    const active = isEntityActive(entity);
    const unavailable = isUnavailable(entity);
    const ariaLabel = this.showName
      ? this.resolveName(entity)
      : this._config.entity;

    return this.renderCardRoot(
      {
        tile: true,
        active,
        unavailable,
        [this.contentLayout]: true,
        'home-tile': this.isHomeVariant,
        chip: this.isChip,
        [this.homeDomainClass(entity.entity_id)]: this.isHomeVariant,
      },
      html`
        ${this.renderHeaderActionButton(this.renderHeaderStack(entity), {
          disabled: unavailable,
          active,
          ariaLabel,
        })}
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-action-card': AuActionCard;
  }
}

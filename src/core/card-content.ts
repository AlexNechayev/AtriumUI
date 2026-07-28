import { html, nothing, type CSSResult, type TemplateResult } from 'lit';
import { classMap, type ClassInfo } from 'lit/directives/class-map.js';
import { AuBaseCard } from './base-card';
import { auTokens, auCardSurface, auCardContentLayout } from '../theme/tokens';
import type { LovelaceCardConfig } from '../types/home-assistant';

/** Optional interactive attributes for the `.au-card` root surface. */
export interface CardRootOptions {
  role?: string;
  tabindex?: number;
  ariaPressed?: string;
  ariaLabel?: string;
  onClick?: (ev: Event) => void;
  onKeyDown?: (ev: KeyboardEvent) => void;
  onPointerDown?: (ev: PointerEvent) => void;
  onPointerUp?: (ev: PointerEvent) => void;
  onPointerLeave?: (ev: PointerEvent) => void;
  onPointerCancel?: (ev: PointerEvent) => void;
  onTouchEnd?: (ev: TouchEvent) => void;
}

/**
 * `AuCardContent` - base class for cards that live inside `au-shell-grid`.
 *
 * Extends `AuBaseCard` with a grid-fill layout contract: the host element and
 * its `.au-card` surface always occupy 100% of the space allocated by the grid
 * cell, so cards resize when the user drags or resizes grid items.
 */
export abstract class AuCardContent<
  TConfig extends LovelaceCardConfig = LovelaceCardConfig,
> extends AuBaseCard<TConfig> {
  /** Shared styles every grid child card inherits. Subclasses append their own. */
  protected static readonly contentStyles: readonly CSSResult[] = [
    auTokens,
    auCardSurface,
    auCardContentLayout,
  ];

  /** Stop nested control events from reaching card/tile gesture handlers. */
  protected stopPropagation = (ev: Event): void => {
    ev.stopPropagation();
  };

  /** Standard `.au-card` root wrapper — keeps surface markup consistent. */
  protected renderCardRoot(
    classes: ClassInfo,
    content: TemplateResult | typeof nothing,
    options?: CardRootOptions,
  ): TemplateResult {
    // Native <button> when this surface is the tap target (entity / chip cards).
    if (options?.role === 'button') {
      return html`
        <button
          type="button"
          class="au-card ${classMap(classes)}"
          tabindex=${options.tabindex ?? 0}
          aria-pressed=${options.ariaPressed ?? nothing}
          aria-label=${options.ariaLabel ?? nothing}
          @click=${options.onClick}
          @keydown=${options.onKeyDown}
          @pointerdown=${options.onPointerDown}
          @pointerup=${options.onPointerUp}
          @pointerleave=${options.onPointerLeave}
          @pointercancel=${options.onPointerCancel}
          @touchend=${options.onTouchEnd}
        >
          ${content}
        </button>
      `;
    }
    return html`
      <div
        class="au-card ${classMap(classes)}"
        role=${options?.role ?? nothing}
        tabindex=${options?.tabindex ?? nothing}
        aria-pressed=${options?.ariaPressed ?? nothing}
        aria-label=${options?.ariaLabel ?? nothing}
        @click=${options?.onClick}
        @keydown=${options?.onKeyDown}
        @pointerdown=${options?.onPointerDown}
        @pointerup=${options?.onPointerUp}
        @pointerleave=${options?.onPointerLeave}
        @pointercancel=${options?.onPointerCancel}
        @touchend=${options?.onTouchEnd}
      >
        ${content}
      </div>
    `;
  }
}

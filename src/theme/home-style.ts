import { css } from 'lit';
import { auTokens } from './tokens';

/**
 * Apple Home–inspired visual language. Scale tokens live in `auTokens`
 * (single source of truth); this module adds home-tile / domain styling.
 */
export const auHomeTokens = auTokens;

/** Squircle device/action tile when `variant: home` (and shared scale). */
export const auHomeTileStyles = css`
  .au-card.home-tile {
    border: none;
    border-radius: var(--au-home-radius);
    background: var(--au-home-surface-elevated);
    box-shadow: var(--au-home-shadow);
    padding: var(--au-home-pad);
    overflow: hidden;
  }

  /* Keep open/close / timer rows visible inside short grid cells. */
  .au-card.home-tile.has-controls {
    overflow: auto;
  }

  .au-card.home-tile.has-controls .tile {
    justify-content: flex-start;
  }

  .au-card.home-tile .tile {
    height: 100%;
    gap: var(--au-gap);
    min-height: 0;
  }

  /* Vertical home: centered stack */
  .au-card.home-tile.vertical,
  .au-card.home-tile.vertical .header-action {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--au-gap);
    text-align: center;
  }

  .au-card.home-tile.vertical .text {
    width: 100%;
    align-items: center;
    text-align: center;
  }

  /* Horizontal home: icon | name+attrs */
  .au-card.home-tile.horizontal .header-action {
    flex-direction: row;
    align-items: center;
    text-align: start;
  }

  .au-card.home-tile.horizontal .text {
    width: auto;
    flex: 1;
    min-width: 0;
    align-items: flex-start;
    text-align: start;
  }

  .au-card.home-tile .icon {
    width: var(--au-display-size);
    height: var(--au-display-size);
    border-radius: 50%;
    background: color-mix(
      in srgb,
      var(--au-home-tile-accent, var(--au-home-accent-default)) 18%,
      transparent
    );
    color: var(--au-home-tile-accent, var(--au-home-accent-default));
    --mdc-icon-size: var(--au-display-glyph);
  }

  .au-card.home-tile .primary {
    font-size: var(--au-font-primary);
    font-weight: var(--au-weight-bold);
    letter-spacing: -0.01em;
    color: var(--au-home-label);
    line-height: 1.2;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .au-card.home-tile .secondary {
    font-size: var(--au-font-secondary);
    font-weight: 500;
    color: var(--au-home-muted);
    text-transform: capitalize;
  }

  .au-card.home-tile.active {
    background: var(--au-home-tile-accent, var(--au-home-accent-default));
    color: var(--au-home-on-ink);
  }

  .au-card.home-tile.active .icon {
    background: rgba(255, 255, 255, 0.28);
    color: var(--au-home-on-ink);
  }

  .au-card.home-tile.active .primary,
  .au-card.home-tile.active .secondary {
    color: var(--au-home-on-ink);
  }

  .au-card.home-tile.active .secondary {
    opacity: 0.88;
  }

  .au-card.home-tile.unavailable {
    opacity: 0.45;
    filter: grayscale(0.35);
  }

  .au-card.home-tile .controls {
    width: 100%;
    gap: var(--au-gap-sm);
  }

  .au-card.home-tile .ctrl {
    border-radius: 999px;
    padding: 0;
    width: var(--au-control-size);
    height: var(--au-control-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--au-home-control-fill);
    font-size: var(--au-font-secondary);
    font-weight: 600;
    --mdc-icon-size: var(--au-control-glyph);
    touch-action: manipulation;
  }

  .au-card.home-tile .ctrl:not(.icon) {
    width: auto;
    height: auto;
    padding: 7px 12px;
  }

  .au-card.home-tile.active .ctrl {
    background: var(--au-home-control-fill-on);
    color: var(--au-home-on-ink);
  }

  .au-card.home-tile .slider-wrap,
  .au-card.home-tile .controls {
    --au-slider-height: 26px;
    --au-slider-track: var(--au-home-control-fill-track);
    --au-slider-fill: color-mix(
      in srgb,
      var(--au-home-tile-accent, var(--au-home-accent-default)) 70%,
      white
    );
  }

  .au-card.home-tile.active .controls {
    --au-slider-track: rgba(255, 255, 255, 0.28);
    --au-slider-fill: rgba(255, 255, 255, 0.92);
  }

  /* Room-strip chips: same card/handlers, icon-only circle */
  .au-card.home-tile.chip {
    width: var(--au-control-size);
    height: var(--au-control-size);
    min-width: var(--au-control-size);
    min-height: var(--au-control-size);
    padding: 0;
    border-radius: 999px;
    box-shadow: none;
    background: color-mix(
      in srgb,
      var(--au-home-tile-accent, var(--au-home-accent-light)) 18%,
      transparent
    );
    overflow: hidden;
  }

  .au-card.home-tile.chip .tile,
  .au-card.home-tile.chip .header-action {
    width: 100%;
    height: 100%;
    min-height: 0;
    gap: 0;
    align-items: center;
    justify-content: center;
  }

  .au-card.home-tile.chip .icon {
    width: 100%;
    height: 100%;
    background: transparent;
    color: var(--au-home-tile-accent, var(--au-home-accent-light));
    --mdc-icon-size: var(--au-control-glyph);
  }

  .au-card.home-tile.chip.active {
    background: color-mix(
      in srgb,
      var(--au-home-tile-accent, var(--au-home-accent-light)) 42%,
      var(--au-home-surface-elevated)
    );
    color: var(--au-home-tile-accent, var(--au-home-accent-light));
  }

  .au-card.home-tile.chip.active .icon {
    background: transparent;
    color: var(--au-home-tile-accent, var(--au-home-accent-light));
  }

  .au-card.home-tile.chip:not(.active) {
    opacity: 0.42;
  }

  .au-card.home-tile.domain-light {
    --au-home-tile-accent: var(--au-home-accent-light);
  }
  .au-card.home-tile.domain-switch,
  .au-card.home-tile.domain-input_boolean {
    --au-home-tile-accent: var(--au-home-accent-switch);
  }
  .au-card.home-tile.domain-cover {
    --au-home-tile-accent: var(--au-home-accent-cover);
  }
  .au-card.home-tile.domain-fan {
    --au-home-tile-accent: var(--au-home-accent-fan);
  }
  .au-card.home-tile.domain-climate {
    --au-home-tile-accent: var(--au-home-accent-climate);
  }
  .au-card.home-tile.domain-vacuum {
    --au-home-tile-accent: var(--au-home-accent-vacuum);
  }
  .au-card.home-tile.domain-water_heater {
    --au-home-tile-accent: var(--au-home-accent-water);
  }
  .au-card.home-tile.domain-media_player {
    --au-home-tile-accent: var(--au-home-accent-media);
  }
  .au-card.home-tile.domain-sensor,
  .au-card.home-tile.domain-binary_sensor {
    --au-home-tile-accent: var(--au-home-accent-default);
  }
`;

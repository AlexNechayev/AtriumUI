import { css } from 'lit';

/**
 * AtriumUI design system — Home look as the single visual language.
 *
 * Display icon badge: 36px (glyph ~20px)
 * Control / chip buttons: 32px (glyph 18px)
 * Spacing: 16px pad, 12px gap (8px compact)
 * Type: keep name > secondary hierarchy
 */
export const auTokens = css`
  :host {
    /* --- Home look surfaces --- */
    --au-home-font:
      'SF Pro Rounded', 'SF Pro Display', 'Avenir Next', 'Nunito Sans', sans-serif;
    --au-font-family: var(--au-home-font);
    --au-home-radius: 22px;
    --au-home-radius-sm: 16px;
    --au-home-pad: 16px;
    --au-home-gap: 8px;

    --au-card-background: var(
      --ha-card-background,
      var(--card-background-color, #ffffff)
    );
    --au-primary-text: var(--primary-text-color, #1c1c1e);
    --au-secondary-text: var(--secondary-text-color, #8e8e93);
    --au-accent: var(--accent-color, #0a84ff);
    --au-card-radius: var(--au-home-radius);
    --au-card-padding: var(--au-home-pad);
    --au-card-border: none;
    --au-card-box-shadow: var(--au-home-shadow, 0 10px 28px rgba(0, 0, 0, 0.08));

    /* --- Spacing scale (4px grid) --- */
    --au-gap: var(--au-home-gap);
    --au-gap-sm: 8px;
    --au-gap-lg: 16px;

    /* --- Icon scale --- */
    --au-display-size: 36px;
    --au-display-glyph: 20px;
    --au-control-size: 32px;
    --au-control-glyph: 18px;
    /* Presence faces stay larger than tile icons for glanceability. */
    --au-presence-size: 56px;
    --au-icon-size: var(--au-display-glyph);

    /* --- Type scale (hierarchy preserved) --- */
    --au-font-primary: 0.95rem;
    --au-font-secondary: 0.78rem;
    --au-font-meta: 0.8rem;
    --au-weight-normal: 400;
    --au-weight-medium: 550;
    --au-weight-bold: 650;

    /* --- Home surfaces / accents --- */
    --au-home-bg: var(
      --ha-view-background-color,
      var(--primary-background-color, #f2f2f7)
    );
    --au-home-surface: color-mix(
      in srgb,
      var(--card-background-color, #ffffff) 88%,
      transparent
    );
    --au-home-surface-elevated: var(--card-background-color, #ffffff);
    --au-home-label: var(--au-primary-text);
    --au-home-muted: var(--au-secondary-text);
    --au-home-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
    --au-home-shadow-press: 0 4px 12px rgba(0, 0, 0, 0.1);
    --au-home-control-fill: rgba(120, 120, 128, 0.14);
    --au-home-control-fill-strong: rgba(120, 120, 128, 0.16);
    --au-home-control-fill-track: rgba(120, 120, 128, 0.22);
    --au-home-control-fill-on: rgba(255, 255, 255, 0.24);
    --au-home-scrim: rgba(0, 0, 0, 0.4);
    --au-home-modal-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    --au-home-overlay: color-mix(in srgb, var(--au-accent, #0a84ff) 12%, transparent);
    --au-home-accent-light: var(--au-home-light-color, #f5c542);
    --au-home-accent-switch: var(--au-home-switch-color, #34c759);
    --au-home-accent-cover: var(--au-home-cover-color, #5ac8fa);
    --au-home-accent-fan: var(--au-home-fan-color, #64d2ff);
    --au-home-accent-climate: var(--au-home-climate-color, #ff9f0a);
    --au-home-accent-vacuum: var(--au-home-vacuum-color, #bf5af2);
    --au-home-accent-water: var(--au-home-water-color, #0a84ff);
    --au-home-accent-media: var(--au-home-media-color, #ff375f);
    --au-home-accent-default: var(--au-home-default-color, #0a84ff);
    --au-home-on-ink: #ffffff;
    --au-home-room-min: 158px;
    --au-home-tile-min: 132px;

    /* --- Semantic state colors --- */
    --au-state-active: var(--state-active-color, var(--au-accent));
    --au-state-inactive: var(--state-inactive-color, var(--au-secondary-text));
    --au-state-open: var(--state-cover-open-color, var(--au-success, #4caf50));
    --au-state-closed: var(--state-cover-closed-color, var(--au-state-inactive));
    --au-state-home: var(--state-person-home-color, var(--au-success, #4caf50));
    --au-state-away: var(--state-person-not-home-color, var(--au-state-inactive));
    --au-state-heat: var(--state-climate-heat-color, #ff9800);
    --au-state-cool: var(--state-climate-cool-color, #2196f3);
    --au-success: var(--success-color, #4caf50);
    --au-warning: var(--warning-color, #ff9800);
    --au-error: var(--error-color, #f44336);

    /* --- Motion --- */
    --au-motion-fast: 160ms;
    --au-motion-medium: 280ms;
    --au-motion-slow: 420ms;
    --au-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);

    /* --- Grid --- */
    --au-grid-row-height: 80px;
    --au-grid-guide: var(--divider-color, rgba(120, 120, 120, 0.4));
    --au-grid-handle: var(--au-accent);

    display: block;
    font-family: var(--au-font-family);
    color: var(--au-primary-text);
    -webkit-font-smoothing: antialiased;
  }
`;

/**
 * Shared card chrome — Home squircle surface for every Atrium card.
 */
export const auCardSurface = css`
  .au-card {
    background: var(--au-card-background);
    border-radius: var(--au-card-radius);
    border: var(--au-card-border);
    box-shadow: var(--au-card-box-shadow);
    padding: var(--au-card-padding);
    box-sizing: border-box;
    color: var(--au-primary-text);
    font-family: var(--au-font-family);
  }

  .au-error {
    display: block;
    background: var(--au-error);
    color: #fff;
    padding: var(--au-card-padding);
    border-radius: var(--au-card-radius);
    font-weight: var(--au-weight-medium);
  }
`;

/**
 * Grid-fill layout contract for cards placed inside `au-shell-grid`.
 */
export const auCardContentLayout = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }

  .au-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  button.au-card {
    display: block;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font: inherit;
    color: inherit;
    text-align: inherit;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
`;

import { css } from 'lit';

/**
 * Shared horizontal / vertical tile layout for Action, Light, Climate, and Device.
 * Sizes come from the global Home design scale in `auTokens`.
 */
export const auActionTileLayout = css`
  .tile {
    display: flex;
    height: 100%;
    gap: var(--au-gap);
    user-select: none;
    outline: none;
    touch-action: manipulation;
    font-family: var(--au-font-family);
  }

  .tile.horizontal {
    flex-direction: row;
    align-items: center;
  }

  .tile.horizontal.has-controls {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: var(--au-gap-sm);
  }

  .tile.vertical {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--au-gap-sm);
  }

  .header-action {
    display: flex;
    align-items: center;
    gap: var(--au-gap);
    min-width: 0;
    width: 100%;
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
    outline: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .tile.horizontal.has-controls .header-action {
    flex: 0 0 auto;
  }

  .tile.vertical .header-action {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .header-action:focus-visible {
    box-shadow: 0 0 0 2px var(--au-accent);
    border-radius: var(--au-card-radius);
  }

  .header-action.disabled,
  .header-action:disabled {
    cursor: not-allowed;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--au-display-size);
    height: var(--au-display-size);
    flex: 0 0 auto;
    border-radius: 50%;
    color: var(--au-state-inactive);
    background: var(--au-icon-bg, rgba(120, 120, 120, 0.12));
    --mdc-icon-size: var(--au-display-glyph);
  }

  .tile.active .icon {
    color: var(--au-state-active);
    background: color-mix(in srgb, var(--au-state-active) 18%, transparent);
  }

  .text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    align-items: flex-start;
    text-align: start;
    gap: 2px;
  }

  .tile.vertical .text {
    flex: 0 0 auto;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .primary {
    font-size: var(--au-font-primary);
    font-weight: var(--au-weight-bold);
    letter-spacing: -0.01em;
    color: var(--au-primary-text);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .secondary {
    font-size: var(--au-font-secondary);
    font-weight: 500;
    color: var(--au-secondary-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: var(--au-gap-sm);
    width: 100%;
    flex: 0 0 auto;
    cursor: default;
  }

  .tile.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

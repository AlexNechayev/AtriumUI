/** Width at or below which the light card uses compact icon/slider sizing. */
export const LIGHT_CARD_COMPACT_MAX_WIDTH_PX = 300;

/** Height at or below which the light card uses compact icon/slider sizing. */
export const LIGHT_CARD_COMPACT_MAX_HEIGHT_PX = 96;

/** Ignore pre-layout measurements (0px / tiny) from ResizeObserver. */
export const LIGHT_CARD_LAYOUT_MIN_PX = 50;

/** Whether icon and sliders should use the compact size tier. */
export function isLightCardCompact(width: number, height: number): boolean {
  if (width < LIGHT_CARD_LAYOUT_MIN_PX) return false;
  return (
    width <= LIGHT_CARD_COMPACT_MAX_WIDTH_PX ||
    (height > 0 && height <= LIGHT_CARD_COMPACT_MAX_HEIGHT_PX)
  );
}

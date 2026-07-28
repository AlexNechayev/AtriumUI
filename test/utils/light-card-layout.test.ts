import { describe, it, expect } from 'vitest';
import {
  isLightCardCompact,
  LIGHT_CARD_COMPACT_MAX_HEIGHT_PX,
  LIGHT_CARD_COMPACT_MAX_WIDTH_PX,
} from '../../src/utils/light-card-layout';

describe('isLightCardCompact', () => {
  it('returns false before layout is measured', () => {
    expect(isLightCardCompact(0, 120)).toBe(false);
  });

  it('returns true when width is at or below the compact threshold', () => {
    expect(isLightCardCompact(LIGHT_CARD_COMPACT_MAX_WIDTH_PX, 200)).toBe(true);
    expect(isLightCardCompact(LIGHT_CARD_COMPACT_MAX_WIDTH_PX + 1, 200)).toBe(false);
  });

  it('returns true when height is at or below the compact threshold', () => {
    expect(isLightCardCompact(400, LIGHT_CARD_COMPACT_MAX_HEIGHT_PX)).toBe(true);
    expect(isLightCardCompact(400, LIGHT_CARD_COMPACT_MAX_HEIGHT_PX + 1)).toBe(false);
  });
});

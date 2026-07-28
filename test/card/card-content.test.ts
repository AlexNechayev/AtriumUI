import { describe, it, expect } from 'vitest';
import type { CSSResult } from 'lit';
import '../../src/index';
import { AuCardContent } from '../../src/core/card-content';
import { AuActionCard } from '../../src/card/action-card/au-action-card';
import { AuSensorCard } from '../../src/card/sensor-card/au-sensor-card';
import { auCardContentLayout } from '../../src/theme/tokens';

describe('AuCardContent inheritance', () => {
  it('AuActionCard extends AuCardContent', () => {
    expect(Object.prototype.isPrototypeOf.call(AuCardContent.prototype, AuActionCard.prototype)).toBe(
      true,
    );
  });

  it('AuSensorCard extends AuCardContent', () => {
    expect(Object.prototype.isPrototypeOf.call(AuCardContent.prototype, AuSensorCard.prototype)).toBe(
      true,
    );
  });
});

describe('auCardContentLayout fill contract', () => {
  const cssText = auCardContentLayout.cssText;

  it('sizes :host to 100% width and height', () => {
    expect(cssText).toMatch(/:host[\s\S]*width:\s*100%/);
    expect(cssText).toMatch(/:host[\s\S]*height:\s*100%/);
  });

  it('sizes .au-card to 100% width and height', () => {
    expect(cssText).toMatch(/\.au-card[\s\S]*width:\s*100%/);
    expect(cssText).toMatch(/\.au-card[\s\S]*height:\s*100%/);
  });
});

describe('card fill styles registration', () => {
  it('AuActionCard includes auCardContentLayout', () => {
    const styles = AuActionCard.styles as CSSResult[];
    expect(styles.some((s) => s === auCardContentLayout)).toBe(true);
  });

  it('AuSensorCard includes auCardContentLayout', () => {
    const styles = AuSensorCard.styles as CSSResult[];
    expect(styles.some((s) => s === auCardContentLayout)).toBe(true);
  });
});

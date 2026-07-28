import { describe, it, expect } from 'vitest';
import '../../src/index';
import { AuActionCardBase } from '../../src/core/action-card';
import { AuActionCard } from '../../src/card/action-card/au-action-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';
import type { HassEntity } from '../../src/types/home-assistant';

registerActionHandlerMock();

type ActionCardInternals = AuActionCard & {
  readonly iconOverride: string | undefined;
  readonly nameOverride: string | undefined;
  readonly showIcon: boolean;
  readonly showName: boolean;
  readonly showSecondaryAttribute: boolean;
  readonly contentLayout: 'horizontal' | 'vertical';
  readonly secondaryAttribute: string | undefined;
  resolveName(entity: HassEntity): string;
  resolveSecondaryText(entity: HassEntity): string | undefined;
};

function makeActionCard(): ActionCardInternals {
  return document.createElement('au-action-card') as ActionCardInternals;
}

async function renderActionCard(
  config: Parameters<ActionCardInternals['setConfig']>[0],
  entity = makeEntity('light.k', 'on'),
): Promise<ActionCardInternals> {
  const el = makeActionCard();
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass({ 'light.k': entity });
  await el.updateComplete;
  return el;
}

describe('AuActionCardBase inheritance', () => {
  it('AuActionCard extends AuActionCardBase', () => {
    expect(
      Object.prototype.isPrototypeOf.call(AuActionCardBase.prototype, AuActionCard.prototype),
    ).toBe(true);
  });
});

describe('optional display fields', () => {
  it('iconOverride returns undefined when icon is not set', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    el.hass = makeHass({ 'light.k': makeEntity('light.k', 'on') });
    expect(el.iconOverride).toBeUndefined();
  });

  it('iconOverride returns configured icon', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      icon: 'mdi:lightbulb',
    });
    expect(el.iconOverride).toBe('mdi:lightbulb');
  });

  it('showIcon is true by default', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.showIcon).toBe(true);
  });

  it('showIcon is false when show_icon is false', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      show_icon: false,
    });
    expect(el.showIcon).toBe(false);
  });

  it('showName is true by default', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.showName).toBe(true);
  });

  it('showName is false when show_name is false', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      show_name: false,
    });
    expect(el.showName).toBe(false);
  });

  it('showSecondaryAttribute is true by default', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.showSecondaryAttribute).toBe(true);
  });

  it('showSecondaryAttribute is false when show_secondary_attribute is false', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      show_secondary_attribute: false,
    });
    expect(el.showSecondaryAttribute).toBe(false);
  });

  it('contentLayout defaults to horizontal', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.contentLayout).toBe('horizontal');
  });

  it('contentLayout returns vertical when configured', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      content_layout: 'vertical',
    });
    expect(el.contentLayout).toBe('vertical');
  });

  it('contentLayout respects horizontal even with home variant', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      variant: 'home',
      content_layout: 'horizontal',
    });
    expect(el.contentLayout).toBe('horizontal');
  });

  it('contentLayout defaults to vertical for home when unset', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      variant: 'home',
    });
    expect(el.contentLayout).toBe('vertical');
  });

  it('nameOverride returns undefined when name is not set', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.nameOverride).toBeUndefined();
  });

  it('resolveName falls back to entity friendly name', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    const entity = makeEntity('light.k', 'on', { friendly_name: 'Kitchen' });
    expect(el.resolveName(entity)).toBe('Kitchen');
  });

  it('resolveName returns configured name override', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      name: 'Custom',
    });
    expect(el.resolveName(makeEntity('light.k', 'on', { friendly_name: 'Kitchen' }))).toBe(
      'Custom',
    );
  });

  it('resolveSecondaryText returns entity state when secondary_attribute is not set', () => {
    const el = makeActionCard();
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.resolveSecondaryText(makeEntity('light.k', 'on'))).toBe('on');
  });

  it('resolveSecondaryText formats brightness as a percentage', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      secondary_attribute: 'brightness',
    });
    expect(
      el.resolveSecondaryText(makeEntity('light.k', 'on', { brightness: 128 })),
    ).toBe('50%');
    expect(
      el.resolveSecondaryText(makeEntity('light.k', 'on', { brightness: 85 })),
    ).toBe('33%');
    expect(el.resolveSecondaryText(makeEntity('light.k', 'off', { brightness: 85 }))).toBe(
      '0%',
    );
  });

  it('resolveSecondaryText returns undefined when attribute is missing on entity', () => {
    const el = makeActionCard();
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.k',
      secondary_attribute: 'brightness',
    });
    expect(el.resolveSecondaryText(makeEntity('light.k', 'on'))).toBeUndefined();
  });

  it('throws when content_layout is invalid', () => {
    const el = makeActionCard();
    expect(() =>
      el.setConfig({
        type: 'custom:au-action-card',
        entity: 'light.k',
        content_layout: 'diagonal' as 'horizontal',
      }),
    ).toThrow(/content_layout/i);
  });
});

describe('action card rendering', () => {
  it('renders ha-state-icon when icon override is not set', async () => {
    const el = await renderActionCard({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.shadowRoot?.querySelector('ha-state-icon')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('ha-icon')).toBeNull();
    el.remove();
  });

  it('renders ha-icon when icon override is set', async () => {
    const el = await renderActionCard({
      type: 'custom:au-action-card',
      entity: 'light.k',
      icon: 'mdi:foo',
    });
    expect(el.shadowRoot?.querySelector('ha-icon')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('ha-state-icon')).toBeNull();
    el.remove();
  });

  it('hides icon slot when show_icon is false', async () => {
    const el = await renderActionCard({
      type: 'custom:au-action-card',
      entity: 'light.k',
      show_icon: false,
    });
    expect(el.shadowRoot?.querySelector('.icon')).toBeNull();
    el.remove();
  });

  it('renders entity name by default', async () => {
    const el = await renderActionCard(
      { type: 'custom:au-action-card', entity: 'light.k' },
      makeEntity('light.k', 'on', { friendly_name: 'Kitchen' }),
    );
    expect(el.shadowRoot?.querySelector('.primary')?.textContent).toBe('Kitchen');
    el.remove();
  });

  it('hides name when show_name is false', async () => {
    const el = await renderActionCard({
      type: 'custom:au-action-card',
      entity: 'light.k',
      show_name: false,
    });
    expect(el.shadowRoot?.querySelector('.primary')).toBeNull();
    el.remove();
  });

  it('renders entity state as secondary by default', async () => {
    const el = await renderActionCard({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.shadowRoot?.querySelector('.secondary')?.textContent).toBe('on');
    el.remove();
  });

  it('hides secondary when show_secondary_attribute is false', async () => {
    const el = await renderActionCard({
      type: 'custom:au-action-card',
      entity: 'light.k',
      show_secondary_attribute: false,
    });
    expect(el.shadowRoot?.querySelector('.secondary')).toBeNull();
    el.remove();
  });

  it('applies vertical layout class when content_layout is vertical', async () => {
    const el = await renderActionCard({
      type: 'custom:au-action-card',
      entity: 'light.k',
      content_layout: 'vertical',
    });
    expect(el.shadowRoot?.querySelector('.tile.vertical')).not.toBeNull();
    el.remove();
  });

  it('stacks icon then name then attribute in one header group', async () => {
    const el = await renderActionCard(
      { type: 'custom:au-action-card', entity: 'light.k', content_layout: 'horizontal' },
      makeEntity('light.k', 'on', { friendly_name: 'Lamp' }),
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    const header = card.querySelector('.header-action') as HTMLElement;
    expect(card.classList.contains('horizontal')).toBe(true);
    expect(header).not.toBeNull();
    expect(header.querySelector('.icon')).not.toBeNull();
    expect(header.querySelector('.text .primary')?.textContent).toBe('Lamp');
    expect(header.querySelector('.text .secondary')?.textContent).toBe('on');
    el.remove();
  });

  it('centers vertical layout with icon name and attribute', async () => {
    const el = await renderActionCard(
      { type: 'custom:au-action-card', entity: 'light.k', content_layout: 'vertical' },
      makeEntity('light.k', 'off', { friendly_name: 'Lamp' }),
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    const header = card.querySelector('.header-action') as HTMLElement;
    expect(card.classList.contains('vertical')).toBe(true);
    expect(header).not.toBeNull();
    expect(header.querySelector('.icon')).not.toBeNull();
    expect(header.querySelector('.text .primary')?.textContent).toBe('Lamp');
    expect(header.querySelector('.text .secondary')?.textContent).toBe('off');
    el.remove();
  });
});

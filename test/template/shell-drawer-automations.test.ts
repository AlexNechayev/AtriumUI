import { afterEach, describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';
import type { AuShellHomeView } from '../../src/template/shell-grid/au-shell-home-view';

registerActionHandlerMock();

async function openAutomationsCard(states: Parameters<typeof makeHass>[0]): Promise<{
  el: AuShellGrid;
  home: AuShellHomeView;
  callService: ReturnType<typeof vi.fn>;
  card: HTMLElement;
}> {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig({
    type: 'custom:au-shell-grid',
    floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
  });
  const callService = vi.fn().mockResolvedValue(undefined);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  const home = el.shadowRoot?.querySelector(
    'au-shell-home-view',
  ) as AuShellHomeView;
  await home.updateComplete;
  (home.shadowRoot?.querySelector('.au-drawer-trigger') as HTMLButtonElement).click();
  await home.updateComplete;
  (
    home.shadowRoot?.querySelector(
      '[data-drawer-card="automations"]',
    ) as HTMLButtonElement
  ).click();
  await home.updateComplete;
  const card = home.shadowRoot?.querySelector('.au-drawer-float') as HTMLElement;
  expect(card).toBeTruthy();
  return { el, home, callService, card };
}

describe('shell drawer automations list', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('shows an empty state when there are no automation entities', async () => {
    const { el, card } = await openAutomationsCard({
      'light.a': makeEntity('light.a', 'on'),
    });
    expect(card.querySelector('.au-drawer-automations-empty')).toBeTruthy();
    expect(card.querySelector('[data-automation-create]')).toBeNull();
    expect(card.querySelector('[data-automation-edit]')).toBeNull();
    el.remove();
  });

  it('lists automations and runs/toggles through executeAction', async () => {
    const { el, home, callService, card } = await openAutomationsCard({
      'automation.morning': makeEntity('automation.morning', 'on', {
        friendly_name: 'Morning',
      }),
      'automation.night': makeEntity('automation.night', 'off', {
        friendly_name: 'Night',
      }),
    });

    expect(card.querySelector('[data-automation="automation.morning"]')).toBeTruthy();
    expect(card.querySelector('[data-automation-create]')).toBeNull();

    (card.querySelector(
      '[data-automation-run="automation.morning"]',
    ) as HTMLButtonElement).click();
    await home.updateComplete;
    expect(callService).toHaveBeenCalledWith('automation', 'trigger', {
      entity_id: 'automation.morning',
    });

    callService.mockClear();
    (card.querySelector(
      '[data-automation-enable="automation.morning"]',
    ) as HTMLButtonElement).click();
    await home.updateComplete;
    expect(callService).toHaveBeenCalledWith('automation', 'turn_off', {
      entity_id: 'automation.morning',
    });

    callService.mockClear();
    (card.querySelector(
      '[data-automation-enable="automation.night"]',
    ) as HTMLButtonElement).click();
    await home.updateComplete;
    expect(callService).toHaveBeenCalledWith('automation', 'turn_on', {
      entity_id: 'automation.night',
    });
    el.remove();
  });

  it('shows unavailable feedback and does not call services', async () => {
    const { el, home, callService, card } = await openAutomationsCard({
      'automation.broken': makeEntity('automation.broken', 'unavailable', {
        friendly_name: 'Broken',
      }),
    });
    const row = card.querySelector(
      '[data-automation="automation.broken"]',
    ) as HTMLElement;
    expect(row.querySelector('[data-automation-feedback]')).toBeTruthy();

    (row.querySelector(
      '[data-automation-run="automation.broken"]',
    ) as HTMLButtonElement).click();
    (row.querySelector(
      '[data-automation-enable="automation.broken"]',
    ) as HTMLButtonElement).click();
    await home.updateComplete;
    expect(callService).not.toHaveBeenCalled();
    el.remove();
  });

  it('removes drawer overlays on disconnect', async () => {
    const { el, home } = await openAutomationsCard({
      'automation.morning': makeEntity('automation.morning', 'on'),
    });
    expect(home.shadowRoot?.querySelector('.au-drawer-float')).not.toBeNull();
    el.remove();
    expect(home.shadowRoot?.querySelector('.au-drawer-float')).toBeNull();
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    expect(home.shadowRoot?.querySelector('.au-drawer-catcher')).toBeNull();
  });
});

import { afterEach, describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';
import type { AuShellHomeView } from '../../src/template/shell-grid/au-shell-home-view';

registerActionHandlerMock();

async function openHomeDrawer(options?: {
  show_presence?: boolean;
  confirm_actions?: boolean;
  prefer_device_name?: boolean;
}): Promise<{ el: AuShellGrid; home: AuShellHomeView }> {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig({
    type: 'custom:au-shell-grid',
    floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    show_presence: options?.show_presence,
    confirm_actions: options?.confirm_actions,
    prefer_device_name: options?.prefer_device_name,
  });
  el.hass = makeHass({ 'light.a': makeEntity('light.a', 'on') });
  await el.updateComplete;
  const home = el.shadowRoot?.querySelector(
    'au-shell-home-view',
  ) as AuShellHomeView;
  await home.updateComplete;
  (home.shadowRoot?.querySelector('.au-drawer-trigger') as HTMLButtonElement).click();
  await home.updateComplete;
  return { el, home };
}

async function openCard(
  home: AuShellHomeView,
  id: 'dashboard_settings' | 'global',
): Promise<HTMLElement> {
  const btn = home.shadowRoot?.querySelector(
    `[data-drawer-card="${id}"]`,
  ) as HTMLButtonElement;
  expect(btn).toBeTruthy();
  btn.click();
  await home.updateComplete;
  const card = home.shadowRoot?.querySelector('.au-drawer-float') as HTMLElement;
  expect(card).toBeTruthy();
  return card;
}

describe('shell drawer dashboard and global settings', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('Dashboard settings edits this-view chrome and not Global keys', async () => {
    const { el, home } = await openHomeDrawer({ show_presence: true });
    const card = await openCard(home, 'dashboard_settings');

    const presence = card.querySelector(
      '[data-setting="show_presence"]',
    ) as HTMLInputElement;
    expect(presence).toBeTruthy();
    expect(presence.checked).toBe(true);
    expect(card.querySelector('[data-setting="clock_format"]')).toBeTruthy();
    expect(card.querySelector('[data-setting="confirm_actions"]')).toBeNull();
    expect(card.querySelector('[data-setting="prefer_device_name"]')).toBeNull();

    presence.checked = false;
    presence.dispatchEvent(new Event('change', { bubbles: true }));
    await home.updateComplete;
    await el.updateComplete;
    await home.updateComplete;

    expect(home.config?.show_presence).toBe(false);
    el.remove();
  });

  it('Global configuration edits confirm_actions / prefer_device_name and persists', async () => {
    const { el, home } = await openHomeDrawer({
      confirm_actions: false,
      prefer_device_name: true,
    });
    const saveConfig = vi.fn().mockResolvedValue(undefined);
    el.index = 0;
    el.lovelace = {
      editMode: false,
      mode: 'storage',
      saveConfig,
      config: { views: [{ type: 'custom:au-shell-grid' }] },
    };

    const card = await openCard(home, 'global');
    expect(card.querySelector('[data-setting="clock_format"]')).toBeNull();
    expect(card.querySelector('[data-setting="show_presence"]')).toBeNull();

    const confirm = card.querySelector(
      '[data-setting="confirm_actions"]',
    ) as HTMLInputElement;
    const prefer = card.querySelector(
      '[data-setting="prefer_device_name"]',
    ) as HTMLInputElement;
    expect(confirm).toBeTruthy();
    expect(prefer).toBeTruthy();
    expect(confirm.checked).toBe(false);
    expect(prefer.checked).toBe(true);

    confirm.checked = true;
    confirm.dispatchEvent(new Event('change', { bubbles: true }));
    await home.updateComplete;
    await el.updateComplete;

    expect(home.config?.confirm_actions).toBe(true);
    expect(saveConfig).toHaveBeenCalled();
    const saved = saveConfig.mock.calls[0]?.[0] as {
      views?: Array<{ confirm_actions?: boolean }>;
    };
    expect(saved.views?.[0]?.confirm_actions).toBe(true);
    el.remove();
  });
});

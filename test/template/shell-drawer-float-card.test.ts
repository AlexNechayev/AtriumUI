import { afterEach, describe, it, expect } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function openDrawer() {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig({
    type: 'custom:au-shell-grid',
    floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
  });
  el.hass = makeHass({ 'light.a': makeEntity('light.a', 'on') });
  await el.updateComplete;
  const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement;
  await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  (home.shadowRoot?.querySelector('.au-drawer-trigger') as HTMLButtonElement).click();
  await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  return { el, home };
}

describe('shell drawer 90% floating card', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('opens a 90% card from Dashboard settings; outside tap closes only the card', async () => {
    const { el, home } = await openDrawer();
    const dash = home.shadowRoot?.querySelector(
      '[data-drawer-card="dashboard_settings"]',
    ) as HTMLButtonElement;
    expect(dash).toBeTruthy();
    dash.click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    const card = home.shadowRoot?.querySelector('.au-drawer-float') as HTMLElement;
    expect(card).not.toBeNull();
    expect(card.style.width).toBe('90%');
    expect(card.style.height).toBe('90%');
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).not.toBeNull();

    (home.shadowRoot?.querySelector('.au-drawer-catcher') as HTMLButtonElement).click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(home.shadowRoot?.querySelector('.au-drawer-float')).toBeNull();
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).not.toBeNull();
    el.remove();
  });
});

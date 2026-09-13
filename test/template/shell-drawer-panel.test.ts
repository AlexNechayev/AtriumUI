import { afterEach, describe, it, expect } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderHome(): Promise<{ el: AuShellGrid; home: HTMLElement }> {
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
  return { el, home };
}

describe('shell drawer overlay panel', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('opens a right panel and undimmed catcher; tap outside closes it', async () => {
    const { el, home } = await renderHome();
    const btn = home.shadowRoot?.querySelector(
      '.au-drawer-trigger',
    ) as HTMLButtonElement;
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();

    btn.click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    const panel = home.shadowRoot?.querySelector(
      '.au-drawer-panel',
    ) as HTMLElement;
    const catcher = home.shadowRoot?.querySelector(
      '.au-drawer-catcher',
    ) as HTMLElement;
    expect(panel).not.toBeNull();
    expect(catcher).not.toBeNull();
    expect(panel.style.width).toBe('min(360px, max(280px, 40vw))');
    expect(catcher.style.background).toBe('transparent');

    catcher.click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    expect(
      home.shadowRoot
        ?.querySelector('.au-drawer-trigger')
        ?.classList.contains('open'),
    ).toBe(false);
    el.remove();
  });
});

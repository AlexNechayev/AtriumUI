import { afterEach, describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function openHomeDrawer(): Promise<{
  el: AuShellGrid;
  home: HTMLElement;
}> {
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
  const btn = home.shadowRoot?.querySelector(
    '.au-drawer-trigger',
  ) as HTMLButtonElement;
  btn.click();
  await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  return { el, home };
}

describe('shell drawer theme and enter edit', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('applies Atrium dark color-scheme from the inline theme control', async () => {
    const { el, home } = await openHomeDrawer();
    const dark = [...home.shadowRoot!.querySelectorAll('.au-drawer-theme button')].find(
      (b) => b.getAttribute('data-theme') === 'dark',
    ) as HTMLButtonElement;
    expect(dark).toBeTruthy();
    dark.click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await el.updateComplete;
    expect(el.getAttribute('data-au-theme')).toBe('dark');
    expect(getComputedStyle(el).colorScheme || el.style.colorScheme).toMatch(/dark/);
    el.remove();
  });

  it('Enter edit closes the drawer and turns on layout editing', async () => {
    const { el, home } = await openHomeDrawer();
    Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => 1280 });
    const saveConfig = vi.fn().mockResolvedValue(undefined);
    const setEditMode = vi.fn();
    el.lovelace = {
      editMode: false,
      mode: 'storage',
      saveConfig,
      setEditMode,
    };
    const editBtn = [...home.shadowRoot!.querySelectorAll('.au-drawer-panel button')].find(
      (b) => b.classList.contains('au-drawer-edit'),
    ) as HTMLButtonElement;
    expect(editBtn).toBeTruthy();
    editBtn.click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await el.updateComplete;
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    expect(setEditMode).toHaveBeenCalledWith(true);
    el.remove();
  });
});

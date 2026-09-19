import { afterEach, describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';
import type { AuShellHomeView } from '../../src/template/shell-grid/au-shell-home-view';

registerActionHandlerMock();

async function openHomeDrawer(options?: {
  height?: string;
  width?: string;
}): Promise<{ el: AuShellGrid; home: AuShellHomeView }> {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig({
    type: 'custom:au-shell-grid',
    floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    height: options?.height ?? '606px',
    width: options?.width ?? '1007px',
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

describe('shell drawer polish', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('pins the panel to the shell host height, not the viewport', async () => {
    const { el, home } = await openHomeDrawer();
    const panel = home.shadowRoot?.querySelector('.au-drawer-panel') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.style.height).toBe('100%');
    expect(panel.style.maxHeight).toBe('100%');
    expect(panel.style.height).not.toContain('vh');
    el.remove();
  });

  it('closes from the in-panel chevron', async () => {
    const { el, home } = await openHomeDrawer();
    const close = home.shadowRoot?.querySelector(
      '.au-drawer-panel .au-drawer-trigger',
    ) as HTMLButtonElement;
    expect(close).toBeTruthy();
    close.click();
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    el.remove();
  });

  it('slides the panel open with a transform transition', async () => {
    const { el, home } = await openHomeDrawer();
    const panel = home.shadowRoot?.querySelector('.au-drawer-panel') as HTMLElement;
    expect(panel.style.transition).toMatch(/transform/i);
    expect(panel.style.transform).toMatch(/translateX/i);
    el.remove();
  });

  it('lets native Done clear edit after drawer Enter edit', async () => {
    const { el, home } = await openHomeDrawer();
    Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => 1280 });
    const lovelace = {
      editMode: false,
      mode: 'storage' as const,
      saveConfig: vi.fn().mockResolvedValue(undefined),
      setEditMode(enabled: boolean) {
        lovelace.editMode = enabled;
      },
    };
    el.lovelace = lovelace;
    await el.updateComplete;

    const enter = home.shadowRoot?.querySelector(
      '.au-drawer-edit',
    ) as HTMLButtonElement;
    enter.click();
    await home.updateComplete;
    await el.updateComplete;
    expect(lovelace.editMode).toBe(true);
    expect(home.layoutEditing).toBe(true);

    lovelace.editMode = false;
    el.lovelace = { ...lovelace };
    await el.updateComplete;
    await home.updateComplete;
    expect(home.layoutEditing).toBe(false);
    el.remove();
  });

  it('Exit edit from the drawer calls setEditMode(false)', async () => {
    const { el, home } = await openHomeDrawer();
    Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => 1280 });
    const setEditMode = vi.fn((enabled: boolean) => {
      lovelace.editMode = enabled;
    });
    const lovelace = {
      editMode: true,
      mode: 'storage' as const,
      saveConfig: vi.fn().mockResolvedValue(undefined),
      setEditMode,
    };
    el.lovelace = lovelace;
    await el.updateComplete;
    await home.updateComplete;

    const exit = home.shadowRoot?.querySelector(
      '.au-drawer-edit',
    ) as HTMLButtonElement;
    expect(exit?.textContent).toMatch(/exit/i);
    exit.click();
    await home.updateComplete;
    await el.updateComplete;
    expect(setEditMode).toHaveBeenCalledWith(false);
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    el.remove();
  });
});

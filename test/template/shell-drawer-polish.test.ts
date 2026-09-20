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

  it('keeps a single chevron above the panel in the same top-right slot', async () => {
    const { el, home } = await openHomeDrawer();
    const triggers = [
      ...home.shadowRoot!.querySelectorAll('.au-drawer-trigger'),
    ] as HTMLButtonElement[];
    expect(triggers).toHaveLength(1);
    expect(home.shadowRoot?.querySelector('.au-drawer-panel .au-drawer-trigger')).toBeNull();

    const trigger = triggers[0]!;
    expect(trigger.style.position).toBe('absolute');
    expect(trigger.style.zIndex).toBe('23');
    expect(trigger.getAttribute('style') ?? '').toContain(
      'clamp(16px, 2.2vw, 28px)',
    );
    expect(home.shadowRoot?.querySelector('.home-shell')?.contains(trigger)).toBe(
      true,
    );
    expect(
      home.shadowRoot?.querySelector('.toolbar-end .au-drawer-trigger-slot'),
    ).toBeTruthy();

    const chevron = trigger.querySelector('.chevron') as HTMLElement;
    expect(chevron.style.transition).toMatch(/au-motion-medium|280ms/);
    expect(chevron.style.transition).toMatch(/au-motion-ease|cubic-bezier/);

    trigger.click();
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    el.remove();
  });

  it('pins Enter edit as an icon opposite the chevron on the same row', async () => {
    const { el, home } = await openHomeDrawer();
    const trigger = home.shadowRoot?.querySelector(
      '.au-drawer-trigger',
    ) as HTMLButtonElement;
    const edit = home.shadowRoot?.querySelector(
      '.au-drawer-edit',
    ) as HTMLButtonElement;
    const panel = home.shadowRoot?.querySelector(
      '.au-drawer-panel',
    ) as HTMLElement;
    expect(edit).toBeTruthy();
    expect(panel.contains(edit)).toBe(false);
    expect(edit.style.width).toBe('36px');
    expect(edit.style.height).toBe('36px');
    expect(edit.style.background).toBe('transparent');
    expect(edit.style.zIndex).toBe('23');
    expect(edit.style.position).toBe('absolute');
    expect(edit.style.top).toBe(trigger.style.top);
    expect(edit.getAttribute('style') ?? '').toContain(
      'min(220px, max(196px, 24vw))',
    );
    expect(edit.getAttribute('aria-label')).toMatch(/edit/i);
    expect(edit.textContent?.replace(/\s+/g, ' ').trim()).not.toMatch(
      /enter edit mode/i,
    );
    expect(panel.textContent).not.toMatch(/Enter edit mode/);
    trigger.click();
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('.au-drawer-edit')).toBeNull();
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
    expect(enter).toBeTruthy();
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
    expect(exit?.getAttribute('aria-label')).toMatch(/exit/i);
    expect(exit?.textContent?.trim()).not.toMatch(/exit edit/i);
    exit.click();
    await home.updateComplete;
    await el.updateComplete;
    expect(setEditMode).toHaveBeenCalledWith(false);
    expect(home.shadowRoot?.querySelector('.au-drawer-panel')).toBeNull();
    el.remove();
  });
});

import { afterEach, describe, it, expect } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderShell(
  config: Parameters<AuShellGrid['setConfig']>[0],
): Promise<AuShellGrid> {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass({
    'light.a': makeEntity('light.a', 'on'),
  });
  await el.updateComplete;
  return el;
}

async function homeView(el: AuShellGrid): Promise<HTMLElement> {
  const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement;
  expect(home).not.toBeNull();
  await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  return home;
}

function triggerIn(root: ParentNode | null | undefined): HTMLButtonElement | null {
  return root?.querySelector('.au-drawer-trigger') as HTMLButtonElement | null;
}

describe('shell drawer trigger chrome', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('renders a 36px icon-only chevron on the Home shell, not in the toolbar', async () => {
    const el = await renderShell({
      type: 'custom:au-shell-grid',
      floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    });
    const home = await homeView(el);
    const shell = home.shadowRoot?.querySelector('.home-shell');
    const end = home.shadowRoot?.querySelector('.toolbar-end');
    const btn = triggerIn(home.shadowRoot);
    expect(btn).not.toBeNull();
    expect(shell?.contains(btn)).toBe(true);
    expect(end?.contains(btn)).toBe(false);
    expect(end?.querySelector('.au-drawer-trigger-slot')).toBeTruthy();
    expect(btn?.getAttribute('aria-expanded')).toBe('false');
    expect(btn?.classList.contains('open')).toBe(false);
    expect(btn?.style.width).toBe('36px');
    expect(btn?.style.height).toBe('36px');
    expect(btn?.style.background).toBe('transparent');
    expect(btn?.style.zIndex).toBe('23');
    el.remove();
  });

  it('hides the Home trigger when the drawer is disabled', async () => {
    const el = await renderShell({
      type: 'custom:au-shell-grid',
      drawer: { enabled: false },
      floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    });
    const home = await homeView(el);
    expect(triggerIn(home.shadowRoot)).toBeNull();
    el.remove();
  });

  it('hides the Home trigger when every item is off', async () => {
    const el = await renderShell({
      type: 'custom:au-shell-grid',
      drawer: {
        items: {
          edit: false,
          theme: false,
          dashboard_settings: false,
          global: false,
          automations: false,
        },
      },
      floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    });
    const home = await homeView(el);
    expect(triggerIn(home.shadowRoot)).toBeNull();
    el.remove();
  });

  it('rotates 90deg when open', async () => {
    const el = await renderShell({
      type: 'custom:au-shell-grid',
      floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    });
    const home = await homeView(el);
    const btn = triggerIn(home.shadowRoot)!;
    const chevron = btn.querySelector('.chevron') as HTMLElement;
    expect(chevron).not.toBeNull();
    expect(chevron.style.transform.replace(/\s/g, '')).toBe('rotate(0deg)');
    btn.click();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    const openBtn = triggerIn(home.shadowRoot)!;
    const openChevron = openBtn.querySelector('.chevron') as HTMLElement;
    expect(openBtn.getAttribute('aria-expanded')).toBe('true');
    expect(openBtn.classList.contains('open')).toBe(true);
    expect(openChevron.style.transform.replace(/\s/g, '')).toBe('rotate(90deg)');
    el.remove();
  });

  it('renders the trigger on the classic grid', async () => {
    const el = await renderShell({
      type: 'custom:au-shell-grid',
      cards: [{ type: 'custom:au-action-card', entity: 'light.a' }],
    });
    const btn = triggerIn(el.shadowRoot);
    expect(btn).not.toBeNull();
    expect(btn?.classList.contains('au-drawer-trigger')).toBe(true);
    expect(btn?.style.zIndex).toBe('23');
    expect(btn?.style.top).toBe('8px');
    expect(btn?.style.right).toBe('8px');
    expect(el.shadowRoot?.querySelector('.au-drawer-edit')).toBeNull();
    btn?.click();
    await el.updateComplete;
    const edit = el.shadowRoot?.querySelector('.au-drawer-edit') as HTMLButtonElement;
    expect(edit).toBeTruthy();
    expect(edit.style.top).toBe('8px');
    expect(edit.style.zIndex).toBe('23');
    expect(edit.getAttribute('style') ?? '').toContain(
      'min(220px, max(196px, 24vw))',
    );
    el.remove();
  });
});

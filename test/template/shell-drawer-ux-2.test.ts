import { afterEach, describe, it, expect } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';
import type { AuShellHomeView } from '../../src/template/shell-grid/au-shell-home-view';
import { sanitizeDrawerSettingsPatch } from '../../src/template/shell-grid/shell-drawer-settings';
import { auTokens } from '../../src/theme/tokens';

registerActionHandlerMock();

async function openHomeDrawer(options?: {
  themeItem?: boolean;
}): Promise<{ el: AuShellGrid; home: AuShellHomeView }> {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig({
    type: 'custom:au-shell-grid',
    floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
    drawer:
      options?.themeItem === false
        ? { items: { theme: false } }
        : undefined,
  });
  el.hass = makeHass({
    'light.a': makeEntity('light.a', 'on'),
    'automation.morning': makeEntity('automation.morning', 'on', {
      friendly_name: 'Morning',
    }),
  });
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
  id: 'dashboard_settings' | 'global' | 'automations',
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

describe('shell drawer UX iteration 2', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('keeps theme out of the panel and shows it in Dashboard Appearance', async () => {
    const { el, home } = await openHomeDrawer();
    const panel = home.shadowRoot?.querySelector('.au-drawer-panel') as HTMLElement;
    expect(panel.querySelector('.au-drawer-theme')).toBeNull();
    expect(panel.querySelector('[data-theme]')).toBeNull();

    const card = await openCard(home, 'dashboard_settings');
    expect(card.querySelector('[data-section="appearance"]')).toBeTruthy();
    expect(card.querySelector('[data-theme="light"]')).toBeTruthy();
    expect(card.querySelector('[data-theme="dark"]')).toBeTruthy();
    expect(card.querySelector('[data-theme="system"]')).toBeTruthy();
    el.remove();
  });

  it('hides Appearance theme controls when drawer.items.theme is false', async () => {
    const { el, home } = await openHomeDrawer({ themeItem: false });
    const card = await openCard(home, 'dashboard_settings');
    expect(card.querySelector('[data-theme]')).toBeNull();
    expect(card.querySelector('[data-section="appearance"]')).toBeTruthy();
    el.remove();
  });

  it('applies Atrium dark surfaces from Dashboard theme', async () => {
    const { el, home } = await openHomeDrawer();
    const card = await openCard(home, 'dashboard_settings');
    const dark = card.querySelector('[data-theme="dark"]') as HTMLButtonElement;
    expect(dark).toBeTruthy();
    dark.click();
    await home.updateComplete;
    await el.updateComplete;

    expect(el.getAttribute('data-au-theme')).toBe('dark');
    expect(getComputedStyle(el).colorScheme || el.style.colorScheme).toMatch(
      /dark/,
    );
    expect(auTokens.cssText).toMatch(/--au-home-bg:\s*light-dark\(/);
    const bg =
      getComputedStyle(el).getPropertyValue('--au-home-bg').trim() ||
      el.style.getPropertyValue('--au-home-bg').trim();
    expect(bg.toLowerCase()).toBe('#000000');
    el.remove();
  });

  it('shows X as the 90% card close control', async () => {
    const { el, home } = await openHomeDrawer();
    const card = await openCard(home, 'dashboard_settings');
    const close = card.querySelector('.au-drawer-float-close') as HTMLButtonElement;
    expect(close).toBeTruthy();
    expect(close.textContent?.trim()).toBe('X');
    expect(close.getAttribute('aria-label')).toBe('Close settings');
    el.remove();
  });

  it('groups Dashboard settings into titled 3-column sections', async () => {
    const { el, home } = await openHomeDrawer();
    const card = await openCard(home, 'dashboard_settings');
    const sections = [...card.querySelectorAll('.au-drawer-section')];
    const ids = sections.map((s) => s.getAttribute('data-section'));
    expect(ids).toEqual(['appearance', 'clock', 'home', 'layout']);
    for (const section of sections) {
      expect(section.querySelector('h3')).toBeTruthy();
      const grid = section.querySelector('.au-drawer-section-grid') as HTMLElement;
      expect(grid).toBeTruthy();
      expect(grid.style.display).toBe('grid');
      expect(grid.style.gridTemplateColumns.replace(/\s/g, '')).toBe(
        'repeat(3,minmax(0,1fr))',
      );
    }
    el.remove();
  });

  it('renders each automation as one row of text and buttons', async () => {
    const { el, home } = await openHomeDrawer();
    const card = await openCard(home, 'automations');
    const row = card.querySelector(
      '[data-automation="automation.morning"]',
    ) as HTMLElement;
    expect(row).toBeTruthy();
    expect(row.style.display).toBe('flex');
    expect(row.style.flexDirection).toBe('row');
    expect(row.querySelector('.au-drawer-automation-meta')).toBeTruthy();
    expect(row.querySelector('.au-drawer-automation-actions')).toBeTruthy();
    el.remove();
  });

  it('lets Dashboard own theme patches and Global drop them', () => {
    expect(
      sanitizeDrawerSettingsPatch('dashboard_settings', { theme: 'dark' }),
    ).toEqual({ theme: 'dark' });
    expect(
      sanitizeDrawerSettingsPatch('global', { theme: 'dark' }),
    ).toEqual({});
  });
});

import { describe, it, expect } from 'vitest';
import '../../src/index';
import type { AuClimateCard } from '../../src/card/climate-card/au-climate-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

describe('au-climate-card home variant', () => {
  it('applies home look to room cards[] without explicit variant', async () => {
    await import('../../src/template/shell-grid/au-shell-grid');
    const el = document.createElement('au-shell-grid') as HTMLElement & {
      setConfig: (c: unknown) => void;
      hass?: unknown;
      updateComplete: Promise<boolean>;
    };
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-shell-grid',
      floors: [
        {
          name: 'Main',
          rooms: [
            {
              id: 'living',
              name: 'Living',
              cards: [
                {
                  id: 'au-card-0',
                  card: {
                    type: 'custom:au-climate-card',
                    entity: 'climate.living',
                    show_temperature: true,
                    show_hvac_modes: true,
                  },
                  layout: { x: 0, y: 0, w: 4, h: 4 },
                },
              ],
            },
          ],
        },
      ],
    });
    el.hass = makeHass({
      'climate.living': makeEntity('climate.living', 'heat', {
        friendly_name: 'Living AC',
        temperature: 22,
        current_temperature: 21,
        hvac_modes: ['off', 'heat'],
        min_temp: 16,
        max_temp: 30,
      }),
    });
    await el.updateComplete;
    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;
    (
      home as unknown as { _openRoom: (id: string) => void }
    )._openRoom('living');
    await home.updateComplete;
    await home.updateComplete;
    // Allow async child card attach.
    await Promise.resolve();
    await Promise.resolve();
    await home.updateComplete;

    const climate = home.shadowRoot?.querySelector('au-climate-card') as HTMLElement & {
      shadowRoot: ShadowRoot | null;
      updateComplete: Promise<unknown>;
    } | null;
    expect(climate).not.toBeNull();
    await climate!.updateComplete;
    expect(climate!.shadowRoot?.querySelector('.home-climate')).not.toBeNull();
    el.remove();
  });

  it('renders Apple-style hero temperature on home variant', async () => {
    const el = document.createElement('au-climate-card') as AuClimateCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-climate-card',
      entity: 'climate.living',
      variant: 'home',
    });
    el.hass = makeHass({
      'climate.living': makeEntity('climate.living', 'heat', {
        friendly_name: 'Living AC',
        temperature: 22,
        current_temperature: 21,
        hvac_modes: ['off', 'heat', 'cool'],
        min_temp: 16,
        max_temp: 30,
        target_temp_step: 1,
      }),
    });
    await el.updateComplete;

    const root = el.shadowRoot;
    expect(root?.querySelector('.home-climate')).not.toBeNull();
    expect(root?.querySelector('.home-temp')?.textContent).toMatch(/22/);
    expect(root?.querySelector('.home-name')?.textContent).toContain('Living AC');
    expect(root?.querySelector('.home-climate.active')).not.toBeNull();
    expect(root?.querySelector('au-temp-stepper')).not.toBeNull();
    el.remove();
  });

  it('uses horizontal home layout: icon+name, hero|modes, footer', async () => {
    const el = document.createElement('au-climate-card') as AuClimateCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-climate-card',
      entity: 'climate.living',
      variant: 'home',
      content_layout: 'horizontal',
    });
    el.hass = makeHass({
      'climate.living': makeEntity('climate.living', 'heat', {
        friendly_name: 'Living AC',
        temperature: 22,
        current_temperature: 21,
        hvac_modes: ['off', 'heat', 'cool'],
        fan_modes: ['auto', 'low'],
        min_temp: 16,
        max_temp: 30,
        target_temp_step: 1,
      }),
    });
    await el.updateComplete;

    const root = el.shadowRoot!;
    expect(root.querySelector('.au-card.horizontal')).not.toBeNull();
    expect(root.querySelector('.home-climate.horizontal')).not.toBeNull();

    const header = root.querySelector('.home-header');
    expect(header?.querySelector('.home-icon')).not.toBeNull();
    expect(header?.querySelector('.home-name')?.textContent).toContain('Living AC');

    const main = root.querySelector('.home-main');
    expect(main?.querySelector('.home-hero')).not.toBeNull();
    expect(main?.querySelector('.home-modes')).not.toBeNull();
    expect(main?.querySelector('.home-temp')?.textContent).toMatch(/22/);

    expect(root.querySelector('.home-footer .home-name')).toBeNull();
    expect(root.querySelector('.home-footer au-temp-stepper')).not.toBeNull();

    const selectors = root.querySelector('au-climate-selectors') as HTMLElement & {
      stackVertical?: boolean;
    };
    expect(selectors?.stackVertical).toBe(true);
    el.remove();
  });

  it('uses button temperature control when configured', async () => {
    const el = document.createElement('au-climate-card') as AuClimateCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-climate-card',
      entity: 'climate.living',
      variant: 'home',
      content_layout: 'horizontal',
      temperature_control: 'buttons',
    });
    el.hass = makeHass({
      'climate.living': makeEntity('climate.living', 'heat', {
        friendly_name: 'Living AC',
        temperature: 22,
        current_temperature: 21,
        hvac_modes: ['off', 'heat', 'cool'],
        fan_modes: ['auto', 'low'],
        min_temp: 16,
        max_temp: 30,
        target_temp_step: 1,
      }),
    });
    await el.updateComplete;

    const root = el.shadowRoot!;
    expect(root.querySelector('.home-climate.temp-buttons')).not.toBeNull();
    expect(root.querySelector('.home-main .home-modes')).toBeNull();
    expect(root.querySelector('.home-footer.with-modes .home-modes')).not.toBeNull();
    expect(root.querySelector('.home-footer.with-modes au-temp-stepper')).not.toBeNull();
    const footerKids = [...(root.querySelector('.home-footer.with-modes')?.children ?? [])].map(
      (n) => n.className || n.tagName.toLowerCase(),
    );
    expect(footerKids[0]).toMatch(/home-controls/);
    expect(footerKids[1]).toMatch(/home-modes/);

    const stepper = root.querySelector('au-temp-stepper') as HTMLElement & {
      control?: string;
      shadowRoot: ShadowRoot | null;
    };
    expect(stepper?.control).toBe('buttons');
    expect(stepper?.shadowRoot?.querySelectorAll('.btn').length).toBe(2);

    const selectors = root.querySelector('au-climate-selectors') as HTMLElement & {
      stackVertical?: boolean;
      optionLayout?: string;
    };
    expect(selectors?.stackVertical).toBe(false);
    expect(selectors?.optionLayout).toBe('cols');
    el.remove();
  });

  it('disables temp and fan controls when climate is off', async () => {
    const el = document.createElement('au-climate-card') as AuClimateCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-climate-card',
      entity: 'climate.living',
      variant: 'home',
      content_layout: 'horizontal',
      temperature_control: 'buttons',
    });
    el.hass = makeHass({
      'climate.living': makeEntity('climate.living', 'off', {
        friendly_name: 'Living AC',
        temperature: 22,
        current_temperature: 21,
        hvac_modes: ['off', 'heat', 'cool'],
        fan_modes: ['auto', 'low'],
        min_temp: 16,
        max_temp: 30,
        target_temp_step: 1,
      }),
    });
    await el.updateComplete;

    const stepper = el.shadowRoot?.querySelector('au-temp-stepper') as HTMLElement & {
      disabled?: boolean;
    };
    const selectors = el.shadowRoot?.querySelector(
      'au-climate-selectors',
    ) as HTMLElement & {
      disabled?: boolean;
      fanDisabled?: boolean;
      shadowRoot: ShadowRoot | null;
    };

    expect(stepper?.disabled).toBe(true);
    expect(selectors?.disabled).toBe(false);
    expect(selectors?.fanDisabled).toBe(true);

    const triggers = [
      ...(selectors?.shadowRoot?.querySelectorAll('.trigger') ?? []),
    ] as HTMLButtonElement[];
    const modeTrigger = triggers.find((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Mode:'),
    );
    const fanTrigger = triggers.find((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Fan:'),
    );
    expect(modeTrigger?.disabled).toBe(false);
    expect(fanTrigger?.disabled).toBe(true);
    el.remove();
  });
});

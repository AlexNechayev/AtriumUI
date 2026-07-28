import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuCoverCard } from '../../src/card/cover-card/au-cover-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderCoverCard(
  config: Parameters<AuCoverCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{ el: AuCoverCard; callService: typeof callService }> {
  const el = document.createElement('au-cover-card') as AuCoverCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  return { el, callService };
}

describe('au-cover-card', () => {
  it('requires a cover entity', () => {
    const el = document.createElement('au-cover-card') as AuCoverCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-cover-card', entity: 'switch.x' }),
    ).toThrow(/cover/i);
  });

  it('registers stub and customCards entry', () => {
    expect(AuCoverCard.getStubConfig()).toEqual({
      type: 'custom:au-cover-card',
      entity: '',
    });
    expect(window.customCards?.some((c) => c.type === 'au-cover-card')).toBe(
      true,
    );
  });

  it('renders open tile with controls', async () => {
    const { el } = await renderCoverCard(
      { type: 'custom:au-cover-card', entity: 'cover.blinds' },
      {
        'cover.blinds': makeEntity('cover.blinds', 'open', {
          friendly_name: 'Blinds',
          supported_features: 15,
          current_position: 40,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.tile.cover-open')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('au-light-slider')).not.toBeNull();
    expect(el.shadowRoot?.textContent).toContain('Blinds');
    el.remove();
  });

  it('keeps controls usable when state is unknown', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderCoverCard(
      {
        type: 'custom:au-cover-card',
        entity: 'cover.window',
        show_controls: true,
      },
      {
        'cover.window': makeEntity('cover.window', 'unknown', {
          supported_features: 15,
          friendly_name: 'Living room window',
        }),
      },
      callService,
    );
    expect(el.shadowRoot?.querySelector('.tile.unavailable')).toBeNull();
    const openBtn = el.shadowRoot?.querySelector(
      '.controls .ctrl.icon',
    ) as HTMLButtonElement | null;
    expect(openBtn).not.toBeNull();
    openBtn!.click();
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith('cover', 'open_cover', {
      entity_id: 'cover.window',
    });
    el.remove();
  });

  it('disables when unavailable', async () => {
    const { el } = await renderCoverCard(
      {
        type: 'custom:au-cover-card',
        entity: 'cover.window',
        show_controls: true,
      },
      {
        'cover.window': makeEntity('cover.window', 'unavailable', {
          supported_features: 15,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.tile.unavailable')).not.toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.controls .ctrl').length).toBe(0);
    el.remove();
  });

  it('toggles with cover.toggle on primary tap', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderCoverCard(
      { type: 'custom:au-cover-card', entity: 'cover.blinds' },
      {
        'cover.blinds': makeEntity('cover.blinds', 'closed', {
          supported_features: 15,
        }),
      },
      callService,
    );
    const card = el as AuCoverCard & {
      _onAction: (ev: CustomEvent) => void;
    };
    card._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith('cover', 'toggle', {
      entity_id: 'cover.blinds',
    });
    el.remove();
  });

  it('hides position slider when show_position is false', async () => {
    const { el } = await renderCoverCard(
      {
        type: 'custom:au-cover-card',
        entity: 'cover.blinds',
        show_position: false,
      },
      {
        'cover.blinds': makeEntity('cover.blinds', 'open', {
          supported_features: 15,
          current_position: 40,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('au-light-slider')).toBeNull();
    expect(
      el.shadowRoot?.querySelectorAll('.controls .ctrl.icon').length,
    ).toBeGreaterThanOrEqual(2);
    el.remove();
  });
});

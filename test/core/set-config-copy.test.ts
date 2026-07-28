import { describe, it, expect } from 'vitest';
import '../../src/index';
import { AuActionCard } from '../../src/card/action-card/au-action-card';
import { AuActionCardEditor } from '../../src/card/action-card/au-action-card-editor';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

describe('setConfig immutability', () => {
  it('does not mutate the caller config object on the card', async () => {
    const el = document.createElement('au-action-card') as AuActionCard;
    document.body.appendChild(el);
    const config = {
      type: 'custom:au-action-card',
      entity: '  Switch.Outlet  ',
    };
    const before = { ...config };
    el.setConfig(config);
    el.hass = makeHass({
      'switch.outlet': makeEntity('switch.outlet', 'on'),
    });
    await el.updateComplete;
    expect(config).toEqual(before);
    el.remove();
  });

  it('does not retain the caller config object identity in the editor', () => {
    const el = document.createElement(
      'au-action-card-editor',
    ) as AuActionCardEditor;
    const config = {
      type: 'custom:au-action-card',
      entity: 'switch.outlet',
    };
    el.setConfig(config);
    config.entity = 'switch.other';
    // Editor keeps a shallow copy; mutating caller must not rewrite editor state.
    expect((el as unknown as { _config?: { entity?: string } })._config?.entity).toBe(
      'switch.outlet',
    );
  });
});

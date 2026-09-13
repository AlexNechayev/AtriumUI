import { afterEach, describe, expect, it } from 'vitest';
import '../../src/card/action-card/au-action-card';
import { registerHaStubs } from '../../stories/fixtures/ha-elements';
import { demoHass } from '../../stories/fixtures/hass';
import { mountCardLayouts } from '../../stories/fixtures/mount';

describe('Storybook content_layout pairs', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('mounts vertical and horizontal home tiles', async () => {
    registerHaStubs();
    const root = mountCardLayouts(
      'au-action-card',
      {
        type: 'custom:au-action-card',
        entity: 'light.kitchen',
        variant: 'home',
      },
      demoHass,
    );
    document.body.append(root);

    const cards = [...root.querySelectorAll('au-action-card')] as Array<
      HTMLElement & { updateComplete: Promise<boolean> }
    >;
    expect(cards).toHaveLength(2);
    await Promise.all(cards.map((el) => el.updateComplete));

    expect(cards[0]?.shadowRoot?.querySelector('.tile.vertical')).not.toBeNull();
    expect(cards[1]?.shadowRoot?.querySelector('.tile.horizontal')).not.toBeNull();
  });
});

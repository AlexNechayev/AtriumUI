import { afterEach, describe, expect, it } from 'vitest';
import { registerHaStubs } from '../../stories/fixtures/ha-elements';
import { makeEntity } from '../helpers';

function glyphPath(host: HTMLElement): string | null {
  return host.shadowRoot?.querySelector('svg path')?.getAttribute('d') ?? null;
}

describe('Storybook HA icon stubs', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('renders an SVG path for ha-icon mdi:lightbulb', () => {
    registerHaStubs();
    const el = document.createElement('ha-icon') as HTMLElement & { icon: string };
    el.icon = 'mdi:lightbulb';
    document.body.append(el);

    const d = glyphPath(el);
    expect(d, 'ha-icon should paint an SVG glyph, not an empty webfont span').toBeTruthy();
    expect(d!.length).toBeGreaterThan(10);
  });

  it('renders an SVG path for ha-state-icon from entity domain when attributes.icon is absent', () => {
    registerHaStubs();
    const el = document.createElement('ha-state-icon') as HTMLElement & {
      stateObj?: ReturnType<typeof makeEntity>;
    };
    el.stateObj = makeEntity('light.kitchen', 'on');
    document.body.append(el);

    const d = glyphPath(el);
    expect(d, 'ha-state-icon should resolve a domain default glyph').toBeTruthy();
    expect(d!.length).toBeGreaterThan(10);
  });
});

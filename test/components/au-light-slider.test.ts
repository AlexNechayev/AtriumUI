import { describe, it, expect, vi } from 'vitest';
import '../../src/components/au-light-slider';

async function mountSlider(
  attrs: Record<string, string | number | boolean> = {},
): Promise<import('../../src/components/au-light-slider').AuLightSlider> {
  const el = document.createElement('au-light-slider') as import('../../src/components/au-light-slider').AuLightSlider;
  for (const [key, val] of Object.entries(attrs)) {
    if (typeof val === 'boolean') {
      if (val) el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(val));
    }
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('au-light-slider', () => {
  it('does not render visible header row', async () => {
    const el = await mountSlider({ label: 'Brightness', value: '128', min: '1', max: '255' });
    el.ariaValueText = '50%';
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.row')).toBeNull();
    expect(el.shadowRoot?.querySelector('.track')).not.toBeNull();
    el.remove();
  });

  it('exposes aria-valuetext for screen readers', async () => {
    const el = await mountSlider({ variant: 'plain', value: '128', min: '1', max: '255' });
    el.ariaValueText = '50%';
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.track')?.getAttribute('aria-valuetext')).toBe('50%');
    el.remove();
  });

  it('applies variant class on track', async () => {
    const el = await mountSlider({ variant: 'color_temp' });
    expect(el.shadowRoot?.querySelector('.track.color_temp')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.marker .grip')).not.toBeNull();
    el.remove();
  });

  it('applies hue variant with gradient handle', async () => {
    const el = await mountSlider({ variant: 'hue' });
    expect(el.shadowRoot?.querySelector('.track.hue')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.marker .grip')).not.toBeNull();
    el.remove();
  });

  it('uses fill and handle marker for plain variant', async () => {
    const el = await mountSlider({ variant: 'plain', value: '128', min: '1', max: '255' });
    const marker = el.shadowRoot?.querySelector('.marker') as HTMLElement | null;
    expect(el.shadowRoot?.querySelector('.track-fill')).not.toBeNull();
    expect(marker).not.toBeNull();
    expect(marker?.querySelector('.grip')).not.toBeNull();
    el.remove();
  });

  it('emits value-changing and value-changed on keyboard interaction', async () => {
    const el = await mountSlider({ min: '0', max: '100', value: '50', step: '1' });
    const track = el.shadowRoot?.querySelector('.track') as HTMLElement;

    const changing = vi.fn();
    const changed = vi.fn();
    el.addEventListener('value-changing', changing);
    el.addEventListener('value-changed', changed);

    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(changing).toHaveBeenCalled();
    expect(changed).toHaveBeenCalled();
    expect(el.value).toBe(51);
    el.remove();
  });

  it('does not emit when disabled', async () => {
    const el = await mountSlider({ disabled: true, min: '0', max: '100', value: '50' });
    const track = el.shadowRoot?.querySelector('.track') as HTMLElement;
    const changing = vi.fn();
    el.addEventListener('value-changing', changing);
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(changing).not.toHaveBeenCalled();
    el.remove();
  });
});

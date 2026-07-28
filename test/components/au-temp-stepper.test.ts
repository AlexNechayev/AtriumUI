import { describe, it, expect, vi } from 'vitest';
import '../../src/components/au-temp-stepper';
import type { AuTempStepper } from '../../src/components/au-temp-stepper';

async function mountStepper(
  attrs: Partial<{ value: number; min: number; max: number; step: number; unit: string }>,
): Promise<AuTempStepper> {
  const el = document.createElement('au-temp-stepper') as AuTempStepper;
  Object.assign(el, attrs);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('au-temp-stepper', () => {
  it('renders value with unit and a slider track', async () => {
    const el = await mountStepper({ value: 24, unit: '°C' });
    expect(el.shadowRoot?.textContent).toContain('24');
    expect(el.shadowRoot?.textContent).toContain('°C');
    expect(el.shadowRoot?.querySelector('.track')).not.toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.btn').length).toBe(0);
    el.remove();
  });

  it('changes value with keyboard and emits events', async () => {
    const el = await mountStepper({ value: 22, min: 16, max: 30, step: 1 });
    const track = el.shadowRoot?.querySelector('.track') as HTMLElement;
    const changing = vi.fn();
    const changed = vi.fn();
    el.addEventListener('value-changing', changing);
    el.addEventListener('value-changed', changed);

    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(el.value).toBe(23);
    expect(changing).toHaveBeenCalled();
    expect(changed).toHaveBeenCalled();

    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(el.value).toBe(22);
    el.remove();
  });

  it('does not change when disabled', async () => {
    const el = await mountStepper({ value: 22, min: 16, max: 30, step: 1 });
    el.disabled = true;
    await el.updateComplete;
    const track = el.shadowRoot?.querySelector('.track') as HTMLElement;
    const changed = vi.fn();
    el.addEventListener('value-changed', changed);
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(changed).not.toHaveBeenCalled();
    expect(el.value).toBe(22);
    el.remove();
  });

  it('renders − / + buttons when control is buttons', async () => {
    const el = await mountStepper({ value: 22, min: 16, max: 30, step: 1 });
    el.control = 'buttons';
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.track')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.btn').length).toBe(2);
    el.remove();
  });

  it('nudges temperature with button clicks', async () => {
    const el = await mountStepper({ value: 22, min: 16, max: 30, step: 1 });
    el.control = 'buttons';
    await el.updateComplete;
    const changed = vi.fn();
    el.addEventListener('value-changed', changed);

    const buttons = [...(el.shadowRoot?.querySelectorAll('.btn') ?? [])] as HTMLButtonElement[];
    const increase = buttons.find((b) => b.getAttribute('aria-label')?.includes('Increase'));
    const decrease = buttons.find((b) => b.getAttribute('aria-label')?.includes('Decrease'));
    expect(increase).toBeDefined();
    expect(decrease).toBeDefined();

    increase!.click();
    await el.updateComplete;
    expect(el.value).toBe(23);
    expect(changed).toHaveBeenCalled();

    decrease!.click();
    await el.updateComplete;
    expect(el.value).toBe(22);
    el.remove();
  });
});

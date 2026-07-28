import { describe, it, expect, vi } from 'vitest';
import '../../src/components/au-climate-selectors';
import { AuClimateSelectors } from '../../src/components/au-climate-selectors';

async function mountSelectors(opts?: {
  hvacModes?: string[];
  hvacValue?: string;
  fanModes?: string[];
  fanValue?: string;
  showHvac?: boolean;
  showFan?: boolean;
}): Promise<AuClimateSelectors> {
  const el = document.createElement('au-climate-selectors') as AuClimateSelectors;
  el.hvacModes = opts?.hvacModes ?? ['off', 'cool', 'heat'];
  el.hvacValue = opts?.hvacValue ?? 'cool';
  el.fanModes = opts?.fanModes ?? ['auto', 'low', 'high'];
  el.fanValue = opts?.fanValue ?? 'auto';
  el.showHvac = opts?.showHvac ?? true;
  el.showFan = opts?.showFan ?? true;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('au-climate-selectors', () => {
  it('collapsed shows both mode and fan triggers with icons', async () => {
    const el = await mountSelectors();
    const triggers = el.shadowRoot?.querySelectorAll('.trigger');
    expect(triggers?.length).toBe(2);
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(0);
    expect(el.shadowRoot?.querySelectorAll('ha-icon').length).toBe(2);
    el.remove();
  });

  it('expanding Mode keeps trigger footprint and shows HVAC icon grid', async () => {
    const el = await mountSelectors();
    const triggers = [...(el.shadowRoot?.querySelectorAll('.trigger') ?? [])] as HTMLButtonElement[];
    const modeTrigger = triggers.find((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Mode:'),
    );
    expect(modeTrigger).toBeDefined();
    modeTrigger!.click();
    await el.updateComplete;

    expect(el.shadowRoot?.querySelectorAll('.trigger').length).toBe(2);
    expect(el.shadowRoot?.querySelector('.selectors.expanded')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.option-grid')).not.toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(3);
    expect(el.shadowRoot?.querySelectorAll('.option ha-icon').length).toBe(3);
    el.remove();
  });

  it('option grid uses a 2-row column-flow layout by default', async () => {
    const el = await mountSelectors({
      hvacModes: ['off', 'heat', 'cool', 'dry', 'fan_only', 'auto'],
    });
    const modeTrigger = el.shadowRoot?.querySelector(
      '.trigger[aria-label^="Mode:"]',
    ) as HTMLButtonElement;
    modeTrigger.click();
    await el.updateComplete;

    const grid = el.shadowRoot?.querySelector('.option-grid');
    expect(grid).not.toBeNull();
    expect(grid?.classList.contains('rows-2')).toBe(true);
    expect(grid?.classList.contains('cols-2')).toBe(false);
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(6);

    const cssText = [...AuClimateSelectors.styles]
      .map((s) => String(s))
      .join('\n');
    expect(cssText).toMatch(/\.option-grid\.rows-2[\s\S]*grid-template-rows:\s*repeat\(2/);
    expect(cssText).toMatch(/\.option-grid[\s\S]*right:\s*0/);
    expect(cssText).toMatch(/\.option-grid[\s\S]*left:\s*auto/);
    el.remove();
  });

  it('option grid overlays without growing the host footprint', async () => {
    const el = await mountSelectors({
      hvacModes: ['off', 'heat', 'cool', 'dry'],
    });
    el.optionLayout = 'cols';
    await el.updateComplete;

    const cssText = [...AuClimateSelectors.styles]
      .map((s) => String(s))
      .join('\n');
    expect(cssText).toMatch(/\.option-grid[\s\S]*position:\s*absolute/);
    expect(cssText).toMatch(/\.option-grid[\s\S]*z-index:\s*8/);
    expect(cssText).toMatch(/\.selectors\.expanded \.trigger[\s\S]*visibility:\s*hidden/);
    expect(cssText).toMatch(/\.option-grid\.cols-2[\s\S]*max-width:\s*none/);
    expect(cssText).toMatch(/\.option-grid\.rows-2[\s\S]*top:\s*0/);

    const modeTrigger = el.shadowRoot?.querySelector(
      '.trigger[aria-label^="Mode:"]',
    ) as HTMLButtonElement;
    modeTrigger.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.option-grid.cols-2')).not.toBeNull();
    el.remove();
  });

  it('expanding Fan keeps triggers and shows fan icon grid', async () => {
    const el = await mountSelectors();
    const triggers = [...(el.shadowRoot?.querySelectorAll('.trigger') ?? [])] as HTMLButtonElement[];
    const fanTrigger = triggers.find((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Fan:'),
    );
    fanTrigger!.click();
    await el.updateComplete;

    expect(el.shadowRoot?.querySelectorAll('.trigger').length).toBe(2);
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(3);
    el.remove();
  });

  it('emits hvac-changed and collapses when an option is clicked', async () => {
    const el = await mountSelectors({ hvacValue: 'off' });
    const modeTrigger = el.shadowRoot?.querySelector(
      '.trigger[aria-label^="Mode:"]',
    ) as HTMLButtonElement;
    modeTrigger.click();
    await el.updateComplete;

    const changed = vi.fn();
    el.addEventListener('hvac-changed', changed);
    const cool = [
      ...(el.shadowRoot?.querySelectorAll('.option') ?? []),
    ].find((btn) => btn.getAttribute('aria-label') === 'Cool') as HTMLButtonElement;
    cool.click();
    await el.updateComplete;

    expect(changed).toHaveBeenCalled();
    expect(el.hvacValue).toBe('cool');
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(0);
    expect(el.shadowRoot?.querySelector('.selectors.expanded')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.trigger').length).toBe(2);
    el.remove();
  });

  it('collapses on outside pointerdown', async () => {
    const el = await mountSelectors();
    const modeTrigger = el.shadowRoot?.querySelector(
      '.trigger[aria-label^="Mode:"]',
    ) as HTMLButtonElement;
    modeTrigger.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(3);

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(0);
    el.remove();
  });

  it('does not expand when disabled', async () => {
    const el = await mountSelectors();
    el.disabled = true;
    await el.updateComplete;
    const modeTrigger = el.shadowRoot?.querySelector(
      '.trigger[aria-label^="Mode:"]',
    ) as HTMLButtonElement;
    modeTrigger.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(0);
    el.remove();
  });

  it('keeps HVAC usable while locking fan when fanDisabled', async () => {
    const el = await mountSelectors();
    el.fanDisabled = true;
    await el.updateComplete;

    const triggers = [...(el.shadowRoot?.querySelectorAll('.trigger') ?? [])] as HTMLButtonElement[];
    const modeTrigger = triggers.find((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Mode:'),
    );
    const fanTrigger = triggers.find((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Fan:'),
    );
    expect(modeTrigger?.disabled).toBe(false);
    expect(fanTrigger?.disabled).toBe(true);

    fanTrigger!.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(0);

    modeTrigger!.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(3);
    el.remove();
  });
});

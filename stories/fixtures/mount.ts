import type { HomeAssistant } from '../../src/types/home-assistant';

export type HassHost = HTMLElement & {
  hass?: HomeAssistant;
  setConfig: (config: unknown) => void;
};

export function frame(
  child: HTMLElement,
  size: { width?: number | string; height?: number | string } = {},
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'au-story-frame';
  wrap.style.width =
    typeof size.width === 'string' ? size.width : `${size.width ?? 176}px`;
  wrap.style.height =
    typeof size.height === 'string' ? size.height : `${size.height ?? 176}px`;
  wrap.style.position = 'relative';
  wrap.append(child);
  return wrap;
}

/** Mount a Lovelace card with config + hass inside a Home-tile-sized frame. */
export function mountCard(
  tag: string,
  config: unknown,
  hass: HomeAssistant,
  size?: { width?: number | string; height?: number | string },
): HTMLElement {
  const el = document.createElement(tag) as HassHost;
  el.setConfig(config);
  el.hass = hass;
  return frame(el, size);
}

/** Mount a visual editor with stubbed ha-form. */
export function mountEditor(
  tag: string,
  config: unknown,
  hass: HomeAssistant,
): HTMLElement {
  const el = document.createElement(tag) as HassHost;
  el.hass = hass;
  el.setConfig(config);
  const wrap = frame(el, { width: 420, height: 'auto' });
  wrap.style.minHeight = '120px';
  wrap.style.width = 'min(420px, 100%)';
  return wrap;
}

const CONTENT_LAYOUTS = ['vertical', 'horizontal'] as const;

/** Mount vertical and horizontal `content_layout` Home tiles side by side. */
export function mountCardLayouts(
  tag: string,
  config: Record<string, unknown>,
  hass: HomeAssistant,
  size?: { width?: number | string; height?: number | string },
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'au-story-layouts';
  row.style.display = 'flex';
  row.style.flexWrap = 'wrap';
  row.style.gap = '28px';
  row.style.alignItems = 'flex-start';

  for (const layout of CONTENT_LAYOUTS) {
    const col = document.createElement('div');
    col.style.display = 'grid';
    col.style.gap = '8px';
    col.style.justifyItems = 'center';

    const caption = document.createElement('span');
    caption.textContent = layout === 'vertical' ? 'Vertical' : 'Horizontal';
    caption.style.font = '600 12px/1.2 var(--au-home-font, system-ui, sans-serif)';
    caption.style.color = 'var(--secondary-text-color, #8e8e93)';

    col.append(
      caption,
      mountCard(tag, { ...config, content_layout: layout }, hass, size),
    );
    row.append(col);
  }

  return row;
}

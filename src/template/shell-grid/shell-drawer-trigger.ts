import { html, css, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { localize } from '../../localize/localize';
import type { AuShellGridConfig } from '../../types/config';
import { shouldShowDrawerTrigger } from './shell-drawer-config';

export const drawerTriggerStyles = css`
  .au-drawer-trigger {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    flex-shrink: 0;
    appearance: none;
    -webkit-appearance: none;
  }
  .au-drawer-trigger .chevron {
    display: inline-block;
    font-size: 1.35rem;
    line-height: 1;
    transform: rotate(0deg);
    transform-origin: center;
    transition: transform var(--au-motion-fast, 180ms) ease;
  }
  .au-drawer-trigger.open .chevron {
    transform: rotate(90deg);
  }
`;

export function renderDrawerTrigger(
  config: AuShellGridConfig | undefined,
  open: boolean,
  language: string | undefined,
  onToggle: (ev: Event) => void,
): TemplateResult | typeof nothing {
  if (!config || !shouldShowDrawerTrigger(config)) return nothing;
  const label = localize(language, open ? 'drawer.close' : 'drawer.open');
  return html`
    <button
      type="button"
      class=${classMap({ 'au-drawer-trigger': true, open })}
      style="width:36px;height:36px;min-width:36px;min-height:36px;padding:0;margin:0;border:0;background:transparent"
      aria-expanded=${open ? 'true' : 'false'}
      aria-label=${label}
      title=${label}
      @click=${onToggle}
    >
      <span
        class="chevron"
        aria-hidden="true"
        style="transform:rotate(${open ? 90 : 0}deg)"
        >›</span
      >
    </button>
  `;
}

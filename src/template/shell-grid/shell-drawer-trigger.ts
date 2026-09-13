import { html, css, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { localize } from '../../localize/localize';
import type { AuShellGridConfig } from '../../types/config';
import {
  resolveShellDrawer,
  resolveShellTheme,
  shouldShowDrawerTrigger,
  type AuShellTheme,
} from './shell-drawer-config';

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
  .au-drawer-catcher {
    position: absolute;
    inset: 0;
    z-index: 20;
    border: 0;
    padding: 0;
    margin: 0;
    cursor: default;
  }
  .au-drawer-panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 21;
    box-sizing: border-box;
    overflow: auto;
    background: var(--au-home-surface-elevated, var(--card-background-color, #fff));
    color: var(--au-primary-text, var(--primary-text-color, inherit));
    box-shadow: var(--au-home-shadow-press, 0 8px 32px rgba(0, 0, 0, 0.18));
    border-radius: var(--au-home-radius, 22px) 0 0 var(--au-home-radius, 22px);
    padding: var(--au-home-gap, 12px);
  }
  .au-drawer-theme {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .au-drawer-theme button,
  .au-drawer-edit {
    font: inherit;
    cursor: pointer;
    border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    background: transparent;
    color: inherit;
    border-radius: 12px;
    padding: 8px 12px;
  }
  .au-drawer-theme button[aria-pressed='true'] {
    border-color: var(--au-accent, #0a84ff);
    color: var(--au-accent, #0a84ff);
  }
  .au-drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  .au-drawer-nav button {
    font: inherit;
    cursor: pointer;
    text-align: start;
    border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    background: transparent;
    color: inherit;
    border-radius: 12px;
    padding: 10px 12px;
  }
  .au-drawer-float {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 22;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    overflow: auto;
    background: var(--au-home-surface-elevated, var(--card-background-color, #fff));
    color: var(--au-primary-text, var(--primary-text-color, inherit));
    border-radius: var(--au-home-radius, 22px);
    box-shadow: var(--au-home-shadow-press, 0 8px 32px rgba(0, 0, 0, 0.18));
    padding: 20px 20px 24px;
  }
  .au-drawer-float-close {
    float: inline-end;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 4px 8px;
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

export type AuDrawerCardId =
  | 'dashboard_settings'
  | 'global'
  | 'automations';

export const DRAWER_PANEL_WIDTH = 'min(360px, max(280px, 40vw))';

export function renderDrawerOverlay(
  open: boolean,
  language: string | undefined,
  onClose: (ev: Event) => void,
  body: TemplateResult | typeof nothing = nothing,
): TemplateResult | typeof nothing {
  if (!open) return nothing;
  const closeLabel = localize(language, 'drawer.close');
  return html`
    <button
      type="button"
      class="au-drawer-catcher"
      style="background:transparent"
      aria-label=${closeLabel}
      @click=${onClose}
    ></button>
    <aside
      class="au-drawer-panel"
      style=${'width:' + DRAWER_PANEL_WIDTH}
      role="dialog"
      aria-modal="true"
    >
      ${body}
    </aside>
  `;
}

export function renderDrawerMenu(
  config: AuShellGridConfig | undefined,
  language: string | undefined,
  onTheme: (theme: AuShellTheme) => void,
  onEdit: (ev: Event) => void,
  onOpenCard?: (id: AuDrawerCardId) => void,
): TemplateResult | typeof nothing {
  if (!config) return nothing;
  const drawer = resolveShellDrawer(config);
  const theme = resolveShellTheme(config);
  const showTheme = drawer.items.theme;
  const showEdit = drawer.items.edit && config.editable !== false;
  const cardItems: AuDrawerCardId[] = (
    ['dashboard_settings', 'global', 'automations'] as const
  ).filter((key) => drawer.items[key]);
  if (!showTheme && !showEdit && cardItems.length === 0) return nothing;
  return html`
    ${showTheme
      ? html`<div class="au-drawer-theme" role="group" aria-label=${localize(language, 'drawer.theme')}>
          ${(['light', 'dark', 'system'] as const).map((value) => {
            const key =
              value === 'light'
                ? 'drawer.theme.light'
                : value === 'dark'
                  ? 'drawer.theme.dark'
                  : 'drawer.theme.system';
            return html`
              <button
                type="button"
                data-theme=${value}
                aria-pressed=${theme === value ? 'true' : 'false'}
                @click=${(ev: Event) => {
                  ev.stopPropagation();
                  onTheme(value);
                }}
              >
                ${localize(language, key)}
              </button>
            `;
          })}
        </div>`
      : nothing}
    ${showEdit
      ? html`<button
          type="button"
          class="au-drawer-edit"
          @click=${onEdit}
        >
          ${localize(language, 'drawer.edit')}
        </button>`
      : nothing}
    ${cardItems.length
      ? html`<div class="au-drawer-nav">
          ${cardItems.map((id) => {
            const key =
              id === 'dashboard_settings'
                ? 'drawer.dashboard'
                : id === 'global'
                  ? 'drawer.global'
                  : 'drawer.automations';
            return html`
              <button
                type="button"
                data-drawer-card=${id}
                @click=${(ev: Event) => {
                  ev.stopPropagation();
                  onOpenCard?.(id);
                }}
              >
                ${localize(language, key)}
              </button>
            `;
          })}
        </div>`
      : nothing}
  `;
}

export function renderDrawerFloatCard(
  cardId: AuDrawerCardId | null,
  language: string | undefined,
  onClose: (ev: Event) => void,
  body?: TemplateResult | typeof nothing,
): TemplateResult | typeof nothing {
  if (!cardId) return nothing;
  const titleKey =
    cardId === 'dashboard_settings'
      ? 'drawer.dashboard'
      : cardId === 'global'
        ? 'drawer.global'
        : 'drawer.automations';
  return html`
    <article
      class="au-drawer-float"
      style="width:90%;height:90%"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="au-drawer-float-close"
        aria-label=${localize(language, 'drawer.close')}
        @click=${onClose}
      >
        ${localize(language, 'drawer.close')}
      </button>
      <h2>${localize(language, titleKey)}</h2>
      ${body ?? nothing}
    </article>
  `;
}



import { html, css, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { localize } from '../../localize/localize';
import type { AuShellGridConfig } from '../../types/config';
import {
  resolveShellDrawer,
  shouldShowDrawerTrigger,
} from './shell-drawer-config';

/** Home-look well: fill + outline so drawer groups stay visually separate. */
export const DRAWER_GROUP_CHROME =
  'background:var(--au-home-control-fill, rgba(120, 120, 128, 0.14));border:1px solid color-mix(in srgb, currentColor 12%, transparent);border-radius:var(--au-home-radius-sm, 16px);padding:12px 16px';

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
    transition: transform var(--au-motion-medium, 280ms)
      var(--au-motion-ease, cubic-bezier(0.22, 1, 0.36, 1));
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
    max-height: 100%;
  }
  .au-drawer-panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 21;
    box-sizing: border-box;
    overflow: auto;
    max-height: 100%;
    height: 100%;
    background: var(--au-home-surface-elevated, var(--card-background-color, #fff));
    color: var(--au-primary-text, var(--primary-text-color, inherit));
    box-shadow: var(--au-home-shadow-press, 0 8px 32px rgba(0, 0, 0, 0.18));
    border-radius: var(--au-home-radius, 22px) 0 0 var(--au-home-radius, 22px);
    padding: var(--au-home-gap, 12px);
    padding-top: calc(var(--au-drawer-trigger-top, 8px) + 36px + 8px);
    transform: translateX(0);
    transition: transform var(--au-motion-medium, 280ms)
      var(--au-motion-ease, cubic-bezier(0.22, 1, 0.36, 1));
  }
  @starting-style {
    .au-drawer-panel {
      transform: translateX(100%);
    }
  }
  .au-drawer-theme {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .au-drawer-theme button {
    font: inherit;
    cursor: pointer;
    border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    background: transparent;
    color: inherit;
    border-radius: 12px;
    padding: 8px 12px;
  }
  .au-drawer-edit {
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
  .au-drawer-edit ha-icon {
    --mdc-icon-size: 22px;
    width: 22px;
    height: 22px;
  }
  .au-drawer-theme button[aria-pressed='true'] {
    border-color: var(--au-accent, #0a84ff);
    color: var(--au-accent, #0a84ff);
  }
  .au-drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 0;
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
    font-weight: 650;
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    line-height: 1;
  }
  .au-drawer-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    clear: both;
  }
  .au-drawer-section,
  .au-drawer-form.au-drawer-group,
  .au-drawer-automations li {
    background: var(--au-home-control-fill, rgba(120, 120, 128, 0.14));
    border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
    border-radius: var(--au-home-radius-sm, 16px);
    padding: 12px 16px;
  }
  .au-drawer-section h3 {
    margin: 0 0 8px;
    font-size: var(--au-font-secondary, 0.78rem);
    font-weight: 650;
  }
  .au-drawer-section-grid {
    align-items: start;
  }
  .au-drawer-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font: inherit;
  }
  .au-drawer-field input,
  .au-drawer-field select {
    font: inherit;
    color: inherit;
    background: transparent;
    border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    border-radius: 12px;
    padding: 8px 12px;
  }
  .au-drawer-check {
    display: flex;
    align-items: center;
    gap: 8px;
    font: inherit;
  }
  .au-drawer-automations {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    clear: both;
  }
  .au-drawer-automations li {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .au-drawer-automations-empty {
    clear: both;
    margin: 12px 0 0;
  }
  .au-drawer-automation-meta {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .au-drawer-automation-meta span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .au-drawer-automation-actions {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0;
  }
  .au-drawer-automation-actions button {
    font: inherit;
    cursor: pointer;
    border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    background: transparent;
    color: inherit;
    border-radius: 12px;
    padding: 8px 12px;
  }
  .au-drawer-automation-actions button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DRAWER_TRIGGER_BOX =
  'width:36px;height:36px;min-width:36px;min-height:36px;padding:0;margin:0;border:0;background:transparent';
const DRAWER_HOME_TRIGGER_PIN =
  'position:absolute;top:calc(clamp(16px, 2.2vw, 28px) + 6px);right:clamp(16px, 2.2vw, 28px);z-index:23';
const DRAWER_CLASSIC_TRIGGER_PIN =
  'position:absolute;top:8px;right:8px;z-index:23';
const DRAWER_CHEVRON_MOTION =
  'transform var(--au-motion-medium, 280ms) var(--au-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))';

export function renderDrawerTriggerSlot(
  config?: AuShellGridConfig,
): TemplateResult | typeof nothing {
  if (config && !shouldShowDrawerTrigger(config)) return nothing;
  return html`
    <span
      class="au-drawer-trigger-slot"
      style="width:36px;height:36px;min-width:36px;min-height:36px;flex-shrink:0"
      aria-hidden="true"
    ></span>
  `;
}

export function renderDrawerTrigger(
  config: AuShellGridConfig | undefined,
  open: boolean,
  language: string | undefined,
  onToggle: (ev: Event) => void,
  slot: 'home' | 'classic' = 'home',
): TemplateResult | typeof nothing {
  if (!config || !shouldShowDrawerTrigger(config)) return nothing;
  const label = localize(language, open ? 'drawer.close' : 'drawer.open');
  const pin = slot === 'classic' ? DRAWER_CLASSIC_TRIGGER_PIN : DRAWER_HOME_TRIGGER_PIN;
  return html`
    <button
      type="button"
      class=${classMap({ 'au-drawer-trigger': true, open })}
      style="${DRAWER_TRIGGER_BOX};${pin}"
      aria-expanded=${open ? 'true' : 'false'}
      aria-label=${label}
      title=${label}
      @click=${onToggle}
    >
      <span
        class="chevron"
        aria-hidden="true"
        style="transform:rotate(${open ? 90 : 0}deg);transition:${DRAWER_CHEVRON_MOTION}"
        >›</span
      >
    </button>
  `;
}

export type AuDrawerCardId =
  | 'dashboard_settings'
  | 'global'
  | 'automations';

export const DRAWER_PANEL_WIDTH = 'min(220px, max(196px, 24vw))';
const DRAWER_PANEL_MOTION =
  'transform var(--au-motion-medium, 280ms) var(--au-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))';

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
      style="background:transparent;height:100%;max-height:100%"
      aria-label=${closeLabel}
      @click=${onClose}
    ></button>
    <aside
      class="au-drawer-panel"
      style=${`width:${DRAWER_PANEL_WIDTH};height:100%;max-height:100%;transform:translateX(0);transition:${DRAWER_PANEL_MOTION};padding-top:calc(var(--au-drawer-trigger-top, 8px) + 36px + 8px)`}
      role="dialog"
      aria-modal="true"
    >
      ${body}
    </aside>
  `;
}

export function renderDrawerEditTrigger(
  config: AuShellGridConfig | undefined,
  open: boolean,
  language: string | undefined,
  editing: boolean,
  onEdit: (ev: Event) => void,
  slot: 'home' | 'classic' = 'home',
): TemplateResult | typeof nothing {
  if (!open || !config) return nothing;
  const showEdit =
    resolveShellDrawer(config).items.edit && config.editable !== false;
  if (!showEdit) return nothing;
  const label = localize(language, editing ? 'drawer.edit.exit' : 'drawer.edit');
  const inset = slot === 'classic' ? '8px' : 'clamp(16px, 2.2vw, 28px)';
  const top =
    slot === 'classic'
      ? '8px'
      : 'calc(clamp(16px, 2.2vw, 28px) + 6px)';
  const pin = `position:absolute;top:${top};right:calc(${DRAWER_PANEL_WIDTH} - ${inset} - 36px);z-index:23`;
  return html`
    <button
      type="button"
      class="au-drawer-edit"
      style="${DRAWER_TRIGGER_BOX};${pin}"
      aria-label=${label}
      title=${label}
      @click=${onEdit}
    >
      <ha-icon icon=${editing ? 'mdi:check' : 'mdi:pencil'}></ha-icon>
    </button>
  `;
}

export function renderDrawerMenu(
  config: AuShellGridConfig | undefined,
  language: string | undefined,
  onOpenCard?: (id: AuDrawerCardId) => void,
): TemplateResult | typeof nothing {
  if (!config) return nothing;
  const drawer = resolveShellDrawer(config);
  const cardItems: AuDrawerCardId[] = (
    ['dashboard_settings', 'global', 'automations'] as const
  ).filter((key) => drawer.items[key]);
  if (cardItems.length === 0) return nothing;
  return html`
    <div class="au-drawer-nav">
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
    </div>
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
        ${'X'}
      </button>
      <h2>${localize(language, titleKey)}</h2>
      ${body ?? nothing}
    </article>
  `;
}



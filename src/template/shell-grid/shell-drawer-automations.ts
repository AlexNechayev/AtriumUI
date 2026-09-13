/**
 * Automations 90% card: list `automation.*`, enable/disable/run only.
 * Services go through `executeAction` (`docs/prd/ux/shell-drawer.md` AC8, AC12).
 */
import { html, nothing, type TemplateResult } from 'lit';
import { localize } from '../../localize/localize';
import type { ActionConfig } from '../../types/action';
import type { HassEntity, HomeAssistant } from '../../types/home-assistant';
import { executeAction } from '../../utils/action';
import { computeEntityName, isEntityOffline } from '../../utils/entity';

export type AuDrawerAutomationAction = 'run' | 'enable';

export function listShellAutomations(
  hass: HomeAssistant | undefined,
): HassEntity[] {
  if (!hass?.states) return [];
  return Object.keys(hass.states)
    .filter((id) => id.startsWith('automation.'))
    .map((id) => hass.states[id])
    .filter((entity): entity is HassEntity => Boolean(entity))
    .sort((a, b) =>
      computeEntityName(a).localeCompare(computeEntityName(b), undefined, {
        sensitivity: 'base',
      }),
    );
}

export function automationActionConfig(
  action: AuDrawerAutomationAction,
  entity: HassEntity,
): ActionConfig {
  if (action === 'run') {
    return {
      action: 'call-service',
      service: 'automation.trigger',
      service_data: { entity_id: entity.entity_id },
    };
  }
  const enabled = entity.state === 'on';
  return {
    action: 'call-service',
    service: enabled ? 'automation.turn_off' : 'automation.turn_on',
    service_data: { entity_id: entity.entity_id },
  };
}

/** Returns false when the entity is missing/unavailable (no service call). */
export async function runDrawerAutomationAction(
  host: HTMLElement,
  hass: HomeAssistant | undefined,
  entity: HassEntity | undefined,
  action: AuDrawerAutomationAction,
): Promise<boolean> {
  if (!entity || isEntityOffline(entity)) return false;
  await executeAction(
    host,
    hass,
    automationActionConfig(action, entity),
    entity.entity_id,
  );
  return true;
}

export function teardownDrawerOverlays(
  root: ParentNode | null | undefined,
): void {
  if (!root) return;
  for (const sel of [
    '.au-drawer-catcher',
    '.au-drawer-panel',
    '.au-drawer-float',
  ]) {
    root.querySelector(sel)?.remove();
  }
}

export function renderDrawerAutomations(
  hass: HomeAssistant | undefined,
  language: string | undefined,
  onAction: (entityId: string, action: AuDrawerAutomationAction) => void,
): TemplateResult {
  const items = listShellAutomations(hass);
  if (items.length === 0) {
    return html`
      <p class="au-drawer-automations-empty">
        ${localize(language, 'drawer.automations.empty')}
      </p>
    `;
  }
  return html`
    <ul class="au-drawer-automations">
      ${items.map((entity) => {
        const offline = isEntityOffline(entity);
        const enabled = entity.state === 'on';
        return html`
          <li data-automation=${entity.entity_id}>
            <div class="au-drawer-automation-meta">
              <span>${computeEntityName(entity)}</span>
              ${offline
                ? html`<span data-automation-feedback>
                    ${localize(language, 'drawer.automations.unavailable')}
                  </span>`
                : nothing}
            </div>
            <div class="au-drawer-automation-actions">
              <button
                type="button"
                data-automation-run=${entity.entity_id}
                ?disabled=${offline}
                @click=${(ev: Event) => {
                  ev.stopPropagation();
                  onAction(entity.entity_id, 'run');
                }}
              >
                ${localize(language, 'drawer.automations.run')}
              </button>
              <button
                type="button"
                data-automation-enable=${entity.entity_id}
                ?disabled=${offline}
                @click=${(ev: Event) => {
                  ev.stopPropagation();
                  onAction(entity.entity_id, 'enable');
                }}
              >
                ${localize(
                  language,
                  enabled
                    ? 'drawer.automations.disable'
                    : 'drawer.automations.enable',
                )}
              </button>
            </div>
          </li>
        `;
      })}
    </ul>
  `;
}

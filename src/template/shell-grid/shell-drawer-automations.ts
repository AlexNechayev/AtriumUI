/**
 * Automations 90% card: list `automation.*`, enable/disable/run only.
 * Services go through `executeAction` (`docs/prd/ux/shell-drawer.md` AC8, AC12).
 */
import { html, nothing, type TemplateResult } from 'lit';
import { localize } from '../../localize/localize';
import type { ActionConfig } from '../../types/action';
import type {
  HassEntity,
  HassEntityRegistryEntry,
  HomeAssistant,
} from '../../types/home-assistant';
import { executeAction } from '../../utils/action';
import { computeEntityName, isEntityOffline } from '../../utils/entity';

export type AuDrawerAutomationAction = 'run' | 'enable';

function isAutomationId(id: string): boolean {
  return id.startsWith('automation.');
}

function stubFromRegistry(entry: HassEntityRegistryEntry): HassEntity {
  const name = entry.name?.trim() || entry.original_name?.trim() || entry.entity_id;
  return {
    entity_id: entry.entity_id,
    state: 'unavailable',
    attributes: { friendly_name: name },
    last_changed: '',
    last_updated: '',
  };
}

export function listShellAutomations(
  hass: HomeAssistant | undefined,
  extras: HassEntity[] = [],
): HassEntity[] {
  const byId = new Map<string, HassEntity>();
  for (const entity of extras) {
    if (isAutomationId(entity.entity_id)) byId.set(entity.entity_id, entity);
  }
  for (const [key, entry] of Object.entries(hass?.entities ?? {})) {
    const id = entry.entity_id || key;
    if (!isAutomationId(id) && entry.platform !== 'automation') continue;
    const live = hass?.states?.[id];
    byId.set(id, live ?? stubFromRegistry({ ...entry, entity_id: id }));
  }
  for (const id of Object.keys(hass?.states ?? {})) {
    if (!isAutomationId(id)) continue;
    const live = hass?.states[id];
    if (live) byId.set(id, live);
  }
  return [...byId.values()].sort((a, b) =>
    computeEntityName(a).localeCompare(computeEntityName(b), undefined, {
      sensitivity: 'base',
    }),
  );
}

export async function fetchAutomationRegistry(
  hass: HomeAssistant | undefined,
): Promise<HassEntity[]> {
  if (!hass?.callWS) return [];
  try {
    const rows = await hass.callWS<HassEntityRegistryEntry[]>({
      type: 'config/entity_registry/list',
    });
    if (!Array.isArray(rows)) return [];
    return rows
      .filter(
        (row) =>
          isAutomationId(row.entity_id) || row.platform === 'automation',
      )
      .map(stubFromRegistry);
  } catch {
    return [];
  }
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
  extras: HassEntity[] = [],
): TemplateResult {
  const items = listShellAutomations(hass, extras);
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

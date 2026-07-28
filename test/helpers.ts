import { vi } from 'vitest';
import type { HassEntity, HomeAssistant } from '../src/types/home-assistant';

/** Build a minimal HassEntity for tests. */
export function makeEntity(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity {
  const now = new Date().toISOString();
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: now,
    last_updated: now,
  };
}

/** Build a minimal HomeAssistant context with a mocked `callService`. */
export function makeHass(
  states: Record<string, HassEntity>,
  callService = vi.fn().mockResolvedValue(undefined),
): HomeAssistant {
  return {
    states,
    themes: { default_theme: 'default', themes: {} },
    user: { id: 'u1', name: 'Test User' },
    language: 'en',
    callService,
  };
}

/** Minimal `<action-handler>` mock for jsdom tests. */
export function registerActionHandlerMock(): void {
  if (customElements.get('action-handler')) return;

  customElements.define(
    'action-handler',
    class extends HTMLElement {
      config?: { tap_action?: unknown; hold_action?: unknown };

      connectedCallback(): void {
        this.addEventListener('click', () => {
          this.dispatchEvent(
            new CustomEvent('action', {
              bubbles: true,
              composed: true,
              detail: { action: 'tap' },
            }),
          );
        });
      }
    },
  );
}

registerActionHandlerMock();

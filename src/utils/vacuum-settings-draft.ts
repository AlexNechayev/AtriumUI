/**
 * Draft buffer + Apply for vacuum settings overlay edits.
 */
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { computeDomain } from './entity';

export type VacuumDraftValue = string | number | boolean;

export class VacuumSettingsDraft {
  private _pending = new Map<string, VacuumDraftValue>();

  get size(): number {
    return this._pending.size;
  }

  get dirty(): boolean {
    return this._pending.size > 0;
  }

  clear(): void {
    this._pending.clear();
  }

  get(entityId: string): VacuumDraftValue | undefined {
    return this._pending.get(entityId);
  }

  set(entityId: string, value: VacuumDraftValue): void {
    this._pending.set(entityId, value);
  }

  delete(entityId: string): void {
    this._pending.delete(entityId);
  }

  entries(): IterableIterator<[string, VacuumDraftValue]> {
    return this._pending.entries();
  }

  /** Effective display value: draft overrides live state. */
  resolveState(entity: HassEntity | undefined, entityId: string): string {
    const draft = this._pending.get(entityId);
    if (draft === undefined) return entity?.state ?? 'unknown';
    if (typeof draft === 'boolean') return draft ? 'on' : 'off';
    return String(draft);
  }

  resolveNumber(
    entity: HassEntity | undefined,
    entityId: string,
  ): number | undefined {
    const draft = this._pending.get(entityId);
    if (typeof draft === 'number') return draft;
    if (typeof draft === 'string' && draft.trim() !== '' && !Number.isNaN(Number(draft))) {
      return Number(draft);
    }
    const n = Number(entity?.state);
    return Number.isFinite(n) ? n : undefined;
  }
}

export async function applyVacuumDraft(
  hass: HomeAssistant,
  draft: VacuumSettingsDraft,
): Promise<void> {
  const jobs: Promise<unknown>[] = [];
  for (const [entityId, value] of draft.entries()) {
    const domain = computeDomain(entityId);
    switch (domain) {
      case 'switch':
        jobs.push(
          hass.callService(
            'switch',
            value === true || value === 'on' ? 'turn_on' : 'turn_off',
            { entity_id: entityId },
          ),
        );
        break;
      case 'select':
        jobs.push(
          hass.callService('select', 'select_option', {
            entity_id: entityId,
            option: String(value),
          }),
        );
        break;
      case 'number':
        jobs.push(
          hass.callService('number', 'set_value', {
            entity_id: entityId,
            value: typeof value === 'number' ? value : Number(value),
          }),
        );
        break;
      case 'time':
        jobs.push(
          hass.callService('time', 'set_value', {
            entity_id: entityId,
            time: String(value),
          }),
        );
        break;
      default:
        break;
    }
  }
  await Promise.all(jobs);
  draft.clear();
}

export async function pressVacuumButton(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('button', 'press', { entity_id: entityId });
}

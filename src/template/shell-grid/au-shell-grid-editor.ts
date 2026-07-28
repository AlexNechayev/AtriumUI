import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import { ROOM_TOGGLE_DOMAINS } from '../../utils/domains';
import { fireEvent } from '../../utils/fire-event';
import type { AuShellGridConfig } from '../../types/config';
import type {
  AuHomeEntityConfig,
  AuHomeFloorConfig,
  AuHomeRoomControlsConfig,
} from '../../types/home';

const DEFAULT_HOME_FLOORS: AuHomeFloorConfig[] = [
  {
    name: 'Main',
    rooms: [{ name: 'Living room', entities: [] }],
  },
];

/**
 * Visual editor for `au-shell-grid` — one Home dashboard.
 * Floors / rooms / entities + shared room-grid settings (columns, gap, …).
 */
@customElement('au-shell-grid-editor')
export class AuShellGridEditor extends AuBaseEditor<AuShellGridConfig> {
  static override styles = [
    auTokens,
    css`
      :host {
        display: block;
      }
      ha-form {
        display: block;
        margin-bottom: var(--au-gap);
      }
      .section {
        margin-top: var(--au-gap-lg);
      }
      .section-title {
        font-weight: var(--au-weight-medium);
        color: var(--au-primary-text);
        margin: 0 0 var(--au-gap-sm);
      }
      .hint {
        font-size: 0.8125rem;
        color: var(--au-secondary-text);
        margin: 0 0 var(--au-gap);
        line-height: 1.4;
      }
      .floor,
      .room {
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 12px;
        padding: 12px;
        margin-bottom: var(--au-gap);
        background: var(--au-card-background, var(--card-background-color));
      }
      .room {
        margin-top: var(--au-gap-sm);
        background: color-mix(
          in srgb,
          var(--primary-text-color, #000) 3%,
          transparent
        );
      }
      .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: var(--au-gap-sm);
      }
      .banner {
        font-size: 0.8125rem;
        padding: 10px 12px;
        border-radius: 10px;
        margin-bottom: var(--au-gap);
        background: var(--au-home-overlay, color-mix(in srgb, var(--au-accent, #0a84ff) 12%, transparent));
        color: var(--primary-text-color);
      }
      button.gui {
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        font: inherit;
        font-weight: 500;
        cursor: pointer;
        background: var(--au-accent, #0a84ff);
        color: var(--text-primary-color, #fff);
      }
      button.gui.plain {
        background: transparent;
        color: var(--au-accent, #0a84ff);
        box-shadow: inset 0 0 0 1px var(--divider-color, rgba(0, 0, 0, 0.2));
      }
      .strip-icons {
        margin-top: var(--au-gap-sm);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .strip-icons-title {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--au-primary-text);
      }
      .icon-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(120px, 180px);
        gap: 8px;
        align-items: center;
      }
      .icon-entity {
        font-size: 0.8125rem;
        color: var(--au-secondary-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      button.gui.danger {
        background: color-mix(in srgb, var(--error-color, #f44336) 18%, transparent);
        color: var(--error-color, #f44336);
      }
    `,
  ];

  private readonly _shellSchema = [
    {
      name: 'size',
      type: 'grid',
      schema: [
        { name: 'width', selector: { text: {} } },
        { name: 'height', selector: { text: {} } },
      ],
    },
    {
      name: 'grid',
      type: 'grid',
      schema: [
        { name: 'columns', selector: { number: { min: 1, max: 24, mode: 'box' } } },
        { name: 'rows', selector: { number: { min: 1, max: 48, mode: 'box' } } },
        { name: 'row_height', selector: { text: {} } },
        { name: 'gap', selector: { text: {} } },
      ],
    },
    { name: 'editable', selector: { boolean: {} } },
  ];

  private readonly _homeOptionsSchema = [
    { name: 'show_presence', selector: { boolean: {} } },
    { name: 'show_bulk_actions', selector: { boolean: {} } },
    { name: 'header_title', selector: { text: {} } },
    { name: 'header_greeting', selector: { boolean: {} } },
    {
      name: 'clock_format',
      selector: {
        select: {
          options: [
            { label: '24-hour', value: '24h' },
            { label: '12-hour', value: '12h' },
          ],
        },
      },
    },
    { name: 'clock_show_date', selector: { boolean: {} } },
    {
      name: 'clock_date_format',
      selector: {
        select: {
          options: [
            { label: 'DD/MM', value: 'dd/mm' },
            { label: 'MM/DD', value: 'mm/dd' },
          ],
        },
      },
    },
    { name: 'clock_show_day', selector: { boolean: {} } },
    {
      name: 'clock_day_format',
      selector: {
        select: {
          options: [
            { label: 'Short (Mon)', value: 'short' },
            { label: 'Long (Monday)', value: 'long' },
          ],
        },
      },
    },
    { name: 'auto_areas', selector: { boolean: {} } },
    { name: 'prefer_device_name', selector: { boolean: {} } },
    { name: 'confirm_actions', selector: { boolean: {} } },
    {
      name: 'room_idle_timeout',
      selector: {
        number: {
          min: 0,
          max: 3600,
          mode: 'box',
          unit_of_measurement: 's',
        },
      },
    },
    { name: 'debug', selector: { boolean: {} } },
    {
      name: 'presence',
      selector: {
        entity: { multiple: true, domain: ['person', 'device_tracker'] },
      },
    },
    {
      name: 'scenes',
      selector: { entity: { multiple: true, domain: 'scene' } },
    },
    {
      name: 'scripts',
      selector: { entity: { multiple: true, domain: 'script' } },
    },
    {
      name: 'room_controls',
      type: 'expandable',
      title: 'Room tile light/switch strip (defaults)',
      schema: [
        { name: 'show', selector: { boolean: {} } },
        {
          name: 'include',
          selector: {
            entity: { multiple: true, domain: [...ROOM_TOGGLE_DOMAINS] },
          },
        },
        {
          name: 'exclude',
          selector: {
            entity: { multiple: true, domain: [...ROOM_TOGGLE_DOMAINS] },
          },
        },
      ],
    },
  ];

  private readonly _floorSchema = [
    { name: 'name', selector: { text: {} } },
    { name: 'id', selector: { text: {} } },
    {
      name: 'entities',
      selector: { entity: { multiple: true } },
    },
  ];

  private readonly _roomSchema = [
    { name: 'name', selector: { text: {} } },
    { name: 'icon', selector: { icon: {} } },
    { name: 'area_id', selector: { area: {} } },
    {
      name: 'entities',
      selector: { entity: { multiple: true } },
    },
    {
      name: 'controls',
      type: 'expandable',
      title: 'Room tile light/switch strip',
      schema: [
        { name: 'show', selector: { boolean: {} } },
        {
          name: 'include',
          selector: {
            entity: { multiple: true, domain: [...ROOM_TOGGLE_DOMAINS] },
          },
        },
        {
          name: 'exclude',
          selector: {
            entity: { multiple: true, domain: [...ROOM_TOGGLE_DOMAINS] },
          },
        },
      ],
    },
  ];

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      width: 'Dashboard width (default 100%)',
      height: 'Dashboard height (default 100vh)',
      columns: 'Grid columns (Home rooms + room entities)',
      rows: 'Equal-height row tracks (fills dashboard height)',
      row_height: 'Fixed row height when rows is unset (e.g. 80px)',
      gap: 'Grid gap (e.g. 12px)',
      editable: 'Allow room grid editing in dashboard edit mode',
      show_presence: 'Show presence strip',
      show_bulk_actions: 'Show room “All off”',
      header_title: 'Home title (when greeting is off)',
      header_greeting: 'Time-of-day greeting as Home title',
      clock_format: 'Clock time format',
      clock_show_date: 'Show date on clock',
      clock_date_format: 'Date format',
      clock_show_day: 'Show weekday on clock',
      clock_day_format: 'Weekday format',
      auto_areas: 'Auto-discover entities from room area',
      prefer_device_name: 'Prefer device registry names',
      confirm_actions: 'Confirm high-stakes actions',
      room_idle_timeout: 'Return to Home after idle (0 = off)',
      debug: 'Debug logging',
      presence: 'People (presence)',
      scenes: 'Scene shortcuts',
      scripts: 'Script shortcuts',
      name: 'Name',
      id: 'Id (optional)',
      icon: 'Icon',
      area_id: 'Home Assistant area',
      entities: 'Entities (floor overview or room)',
      show: 'Show strip on large room tiles',
      include: 'Whitelist (empty = all lights/switches)',
      exclude: 'Blacklist',
      room_controls: 'Room tile light/switch strip',
      controls: 'Room tile light/switch strip',
    };
    return labels[schema.name] ?? schema.name;
  };

  private get _floors(): AuHomeFloorConfig[] {
    return this._config?.floors ?? [];
  }

  public override setConfig(config: AuShellGridConfig): void {
    // Always ensure Home structure exists so the GUI never looks “empty/classic”.
    const floors =
      Array.isArray(config.floors) && config.floors.length > 0
        ? config.floors
        : structuredClone(DEFAULT_HOME_FLOORS);
    super.setConfig({
      ...config,
      floors,
      show_presence: config.show_presence ?? true,
      show_bulk_actions: config.show_bulk_actions ?? true,
      header_greeting: config.header_greeting === true,
      clock_format: config.clock_format === '12h' ? '12h' : '24h',
      clock_show_date: config.clock_show_date !== false,
      clock_date_format:
        config.clock_date_format === 'mm/dd' ? 'mm/dd' : 'dd/mm',
      clock_show_day: config.clock_show_day !== false,
      clock_day_format:
        config.clock_day_format === 'long' ? 'long' : 'short',
      room_idle_timeout:
        typeof config.room_idle_timeout === 'number' &&
        Number.isFinite(config.room_idle_timeout)
          ? Math.max(0, config.room_idle_timeout)
          : 0,
      cards: config.cards ?? [],
    });
  }

  private _emit(config: AuShellGridConfig): void {
    fireEvent(this, 'config-changed', { config });
  }

  private _patch(patch: Partial<AuShellGridConfig>): void {
    if (!this._config) return;
    this._emit({ ...this._config, ...patch });
  }

  private _entitiesToIds(entities: AuHomeEntityConfig[] | undefined): string[] {
    return (entities ?? []).map((e) => e.entity).filter(Boolean);
  }

  private _idsToEntities(
    ids: string[],
    previous: AuHomeEntityConfig[] | undefined,
  ): AuHomeEntityConfig[] {
    const prevById = new Map((previous ?? []).map((e) => [e.entity, e]));
    return ids.filter(Boolean).map((id) => {
      const prev = prevById.get(id);
      return prev ? { ...prev, entity: id } : { entity: id };
    });
  }

  private _handleShellChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this._config) return;
    const value = (ev.detail as { value: AuShellGridConfig }).value;
    this._emit({
      ...this._config,
      ...value,
      floors: this._floors,
    });
  };

  private _isToggleEntityId(entityId: string): boolean {
    const domain = entityId.split('.')[0] ?? '';
    return domain === 'light' || domain === 'switch';
  }

  /** Normalize form controls; keep icons from the previous config when omitted. */
  private _normalizeControls(
    value: AuHomeRoomControlsConfig | undefined,
    previousIcons?: Record<string, string>,
  ): AuHomeRoomControlsConfig | undefined {
    const next: AuHomeRoomControlsConfig = {};
    if (value?.show === false) next.show = false;
    if (value?.include?.length) {
      next.include = value.include.filter(Boolean);
    }
    if (value?.exclude?.length) {
      next.exclude = value.exclude.filter(Boolean);
    }
    // Prefer explicit `icons` (including cleared); otherwise preserve previous.
    const icons =
      value && 'icons' in value ? value.icons : (value?.icons ?? previousIcons);
    if (icons && Object.keys(icons).length > 0) {
      next.icons = { ...icons };
    }
    return Object.keys(next).length > 0 ? next : undefined;
  }

  private _homeOptionsData(): Record<string, unknown> {
    const cfg = this._config;
    if (!cfg) return {};
    return {
      ...cfg,
      header_greeting: cfg.header_greeting === true,
      clock_format: cfg.clock_format === '12h' ? '12h' : '24h',
      clock_show_date: cfg.clock_show_date !== false,
      clock_date_format:
        cfg.clock_date_format === 'mm/dd' ? 'mm/dd' : 'dd/mm',
      clock_show_day: cfg.clock_show_day !== false,
      clock_day_format: cfg.clock_day_format === 'long' ? 'long' : 'short',
      room_idle_timeout:
        typeof cfg.room_idle_timeout === 'number' &&
        Number.isFinite(cfg.room_idle_timeout)
          ? Math.max(0, cfg.room_idle_timeout)
          : 0,
      room_controls: {
        show: cfg.room_controls?.show !== false,
        include: cfg.room_controls?.include ?? [],
        exclude: cfg.room_controls?.exclude ?? [],
      },
    };
  }

  private _handleHomeOptionsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this._config) return;
    const value = (ev.detail as { value: AuShellGridConfig }).value;
    const { room_controls: formControls, ...rest } = value;
    const room_controls = this._normalizeControls(
      formControls,
      this._config.room_controls?.icons,
    );
    this._emit({
      ...this._config,
      ...rest,
      room_controls,
      floors: this._floors,
    });
  };

  private _globalStripIconEntities(): string[] {
    const cfg = this._config?.room_controls;
    if (cfg?.include?.length) {
      return cfg.include.filter((id) => this._isToggleEntityId(id));
    }
    const ids = new Set<string>();
    for (const floor of this._floors) {
      for (const room of floor.rooms ?? []) {
        for (const ent of room.entities ?? []) {
          if (ent.entity && this._isToggleEntityId(ent.entity)) {
            ids.add(ent.entity);
          }
        }
      }
    }
    return [...ids].sort();
  }

  private _setGlobalStripIcon(entityId: string, icon: string): void {
    if (!this._config) return;
    const icons = { ...(this._config.room_controls?.icons ?? {}) };
    const trimmed = icon.trim();
    if (trimmed) icons[entityId] = trimmed;
    else delete icons[entityId];
    const room_controls = this._normalizeControls({
      ...(this._config.room_controls ?? {}),
      icons: Object.keys(icons).length > 0 ? icons : undefined,
    });
    this._emit({ ...this._config, room_controls, floors: this._floors });
  }

  private _roomStripEntities(
    floorIndex: number,
    roomIndex: number,
  ): AuHomeEntityConfig[] {
    const room = this._floors[floorIndex]?.rooms?.[roomIndex];
    if (!room) return [];
    const controls = room.controls;
    let list = (room.entities ?? []).filter(
      (e) => e.entity && this._isToggleEntityId(e.entity),
    );
    if (controls?.include?.length) {
      const allow = new Set(controls.include);
      list = list.filter((e) => allow.has(e.entity));
    }
    if (controls?.exclude?.length) {
      const deny = new Set(controls.exclude);
      list = list.filter((e) => !deny.has(e.entity));
    }
    return list;
  }

  private _setRoomStripIcon(
    floorIndex: number,
    roomIndex: number,
    entityId: string,
    icon: string,
  ): void {
    const floor = this._floors[floorIndex];
    const room = floor?.rooms?.[roomIndex];
    if (!floor || !room) return;
    const icons = { ...(room.controls?.icons ?? {}) };
    const trimmed = icon.trim();
    if (trimmed) icons[entityId] = trimmed;
    else delete icons[entityId];
    const controls = this._normalizeControls({
      ...(room.controls ?? {}),
      icons: Object.keys(icons).length > 0 ? icons : undefined,
    });
    const rooms = (floor.rooms ?? []).map((r, i) =>
      i === roomIndex ? { ...r, controls } : r,
    );
    this._patchFloor(floorIndex, { rooms });
  }

  private _renderStripIconRows(
    entityIds: string[],
    icons: Record<string, string> | undefined,
    onChange: (entityId: string, icon: string) => void,
  ): TemplateResult | typeof nothing {
    if (entityIds.length === 0) return nothing;
    return html`
      <div class="strip-icons">
        <div class="strip-icons-title">Custom strip icons</div>
        <p class="hint">Override the icon shown on the Home room tile strip.</p>
        ${entityIds.map((entityId) => {
          const value = icons?.[entityId] ?? '';
          return html`
            <div class="icon-row">
              <span class="icon-entity" title=${entityId}>${entityId}</span>
              <ha-icon-picker
                .hass=${this.hass}
                .value=${value}
                .label=${'Icon'}
                @value-changed=${(ev: CustomEvent) => {
                  ev.stopPropagation();
                  const next = String(
                    (ev.detail as { value?: string }).value ?? '',
                  );
                  onChange(entityId, next);
                }}
              ></ha-icon-picker>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _emitFloors(floors: AuHomeFloorConfig[]): void {
    this._patch({ floors });
  }

  private _addFloor = (): void => {
    this._emitFloors([
      ...this._floors,
      {
        name: `Floor ${this._floors.length + 1}`,
        rooms: [{ name: 'New room', entities: [] }],
      },
    ]);
  };

  private _removeFloor = (index: number): void => {
    const floors = [...this._floors];
    floors.splice(index, 1);
    this._emitFloors(floors.length > 0 ? floors : structuredClone(DEFAULT_HOME_FLOORS));
  };

  private _patchFloor(index: number, patch: Partial<AuHomeFloorConfig>): void {
    this._emitFloors(
      this._floors.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    );
  }

  private _handleFloorForm = (floorIndex: number, ev: CustomEvent): void => {
    ev.stopPropagation();
    const floor = this._floors[floorIndex];
    if (!floor) return;
    const value = (
      ev.detail as {
        value: { name?: string; id?: string; entities?: string[] };
      }
    ).value;
    this._patchFloor(floorIndex, {
      name: value.name?.trim() || `Floor ${floorIndex + 1}`,
      id: value.id?.trim() || undefined,
      entities: this._idsToEntities(value.entities ?? [], floor.entities),
    });
  };

  private _floorFormData(floorIndex: number) {
    const floor = this._floors[floorIndex];
    return {
      name: floor?.name ?? '',
      id: floor?.id ?? '',
      entities: this._entitiesToIds(floor?.entities),
    };
  }

  private _addRoom = (floorIndex: number): void => {
    const floor = this._floors[floorIndex];
    if (!floor) return;
    this._patchFloor(floorIndex, {
      rooms: [...(floor.rooms ?? []), { name: 'New room', entities: [] }],
    });
  };

  private _removeRoom = (floorIndex: number, roomIndex: number): void => {
    const floor = this._floors[floorIndex];
    if (!floor) return;
    const rooms = [...(floor.rooms ?? [])];
    rooms.splice(roomIndex, 1);
    this._patchFloor(floorIndex, {
      rooms: rooms.length > 0 ? rooms : [{ name: 'New room', entities: [] }],
    });
  };

  private _handleRoomForm = (
    floorIndex: number,
    roomIndex: number,
    ev: CustomEvent,
  ): void => {
    ev.stopPropagation();
    const floor = this._floors[floorIndex];
    const room = floor?.rooms?.[roomIndex];
    if (!floor || !room) return;
    const value = (
      ev.detail as {
        value: {
          name?: string;
          icon?: string;
          area_id?: string;
          entities?: string[];
          controls?: AuHomeRoomControlsConfig;
        };
      }
    ).value;
    const controls = this._normalizeControls(
      value.controls,
      room.controls?.icons,
    );

    const rooms = (floor.rooms ?? []).map((r, i) =>
      i === roomIndex
        ? {
            ...r,
            name: value.name?.trim() || r.name,
            icon: value.icon?.trim() || undefined,
            area_id: value.area_id?.trim() || undefined,
            entities: this._idsToEntities(value.entities ?? [], r.entities),
            controls,
          }
        : r,
    );
    this._patchFloor(floorIndex, { rooms });
  };

  private _roomFormData(floorIndex: number, roomIndex: number) {
    const room = this._floors[floorIndex]?.rooms?.[roomIndex];
    return {
      name: room?.name ?? '',
      icon: room?.icon ?? '',
      area_id: room?.area_id ?? '',
      entities: this._entitiesToIds(room?.entities),
      controls: {
        show: room?.controls?.show !== false,
        include: room?.controls?.include ?? [],
        exclude: room?.controls?.exclude ?? [],
      },
    };
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;

    return html`
      <div class="banner">
        Configure floors, rooms, and entities here. In dashboard Edit mode, use
        each room’s Add card to place any installed Lovelace card.
      </div>

      <div class="section-title">Dashboard & room grid</div>
      <p class="hint">
        These settings control the Home overview and in-room entity grids.
      </p>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._shellSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._handleShellChanged}
      ></ha-form>

      <div class="section-title">Home options</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._homeOptionsData()}
        .schema=${this._homeOptionsSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._handleHomeOptionsChanged}
      ></ha-form>
      ${this._renderStripIconRows(
        this._globalStripIconEntities(),
        this._config.room_controls?.icons,
        (entityId, icon) => this._setGlobalStripIcon(entityId, icon),
      )}

      <div class="section">
        <div class="section-title">Floors & rooms</div>
        <p class="hint">
          Add floors and rooms. Pick floor-level entities for the Home overview,
          or room entities for each room (no typing). Expand “Room tile
          light/switch strip” on a room to show/hide, whitelist, blacklist, and
          set custom icons.
        </p>

        ${this._floors.map(
          (floor, fi) => html`
            <div class="floor">
              <ha-form
                .hass=${this.hass}
                .data=${this._floorFormData(fi)}
                .schema=${this._floorSchema}
                .computeLabel=${this._computeLabel}
                @value-changed=${(ev: CustomEvent) => this._handleFloorForm(fi, ev)}
              ></ha-form>

              ${(floor.rooms ?? []).map(
                (room, ri) => html`
                  <div class="room">
                    <ha-form
                      .hass=${this.hass}
                      .data=${this._roomFormData(fi, ri)}
                      .schema=${this._roomSchema}
                      .computeLabel=${this._computeLabel}
                      @value-changed=${(ev: CustomEvent) =>
                        this._handleRoomForm(fi, ri, ev)}
                    ></ha-form>
                    ${this._renderStripIconRows(
                      this._roomStripEntities(fi, ri).map((e) => e.entity),
                      room.controls?.icons,
                      (entityId, icon) =>
                        this._setRoomStripIcon(fi, ri, entityId, icon),
                    )}
                    <div class="row-actions">
                      <button
                        type="button"
                        class="gui danger"
                        @click=${() => this._removeRoom(fi, ri)}
                      >
                        Remove room
                      </button>
                    </div>
                  </div>
                `,
              )}

              <div class="row-actions">
                <button type="button" class="gui" @click=${() => this._addRoom(fi)}>
                  Add room
                </button>
                <button
                  type="button"
                  class="gui plain"
                  @click=${() => this._removeFloor(fi)}
                >
                  Remove floor
                </button>
              </div>
            </div>
          `,
        )}

        <button type="button" class="gui" @click=${this._addFloor}>Add floor</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-shell-grid-editor': AuShellGridEditor;
  }
}

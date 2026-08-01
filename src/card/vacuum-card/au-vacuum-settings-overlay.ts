import {
  LitElement,
  css,
  html,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant, HassEntity } from '../../types/home-assistant';
import type { AuVacuumSettingsSection } from '../../types/vacuum';
import { auTokens } from '../../theme/tokens';
import { isEntityOffline } from '../../utils/entity';
import {
  getVacuumCapabilities,
  isVacuumActive,
  pauseVacuum,
  returnVacuum,
  startVacuum,
  stopVacuum,
} from '../../utils/vacuum';
import {
  buildVacuumDeviceCatalog,
  entityLabel,
  entriesForSection,
  filterCatalogSections,
  roomDisplayName,
  vacuumLabelPrefixes,
  type VacuumCatalogEntry,
  type VacuumDeviceCatalog,
} from '../../utils/vacuum-device-catalog';
import {
  applyVacuumDraft,
  pressVacuumButton,
  VacuumSettingsDraft,
} from '../../utils/vacuum-settings-draft';
import { createDebounced } from '../../utils/debounce';
import '../../components/au-light-slider';

const SECTION_TABS: { id: AuVacuumSettingsSection; label: string }[] = [
  { id: 'essentials', label: 'Essentials' },
  { id: 'status', label: 'Status' },
  { id: 'clean', label: 'Clean' },
  { id: 'map', label: 'Map' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'dock', label: 'Dock' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'ai', label: 'AI' },
  { id: 'dnd', label: 'DND' },
  { id: 'voice', label: 'Voice' },
  { id: 'advanced', label: 'Advanced' },
];

const HISTORY_KEY = 'au-vacuum-settings';

export interface AuVacuumSettingsOpenOptions {
  section?: AuVacuumSettingsSection | string;
  entityId?: string;
  hideSections?: readonly string[];
}

/**
 * Full-screen Apple Home–inspired vacuum settings dashboard.
 */
@customElement('au-vacuum-settings-overlay')
export class AuVacuumSettingsOverlay extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public vacuumEntityId = '';
  @property({ attribute: false }) public title = 'Vacuum';
  @property({ attribute: false }) public hideSections: string[] = [];

  @state() private _open = false;
  @state() private _section: AuVacuumSettingsSection = 'essentials';
  @state() private _catalog?: VacuumDeviceCatalog;
  @state() private _draft = new VacuumSettingsDraft();
  @state() private _roomIndex = 1;
  @state() private _confirmEntityId?: string;
  @state() private _expandedSelect?: string;
  @state() private _highlightEntityId?: string;
  @state() private _applying = false;
  @state() private _advancedLimit = 80;
  /** Live slider preview while dragging (before debounced draft commit). */
  @state() private _sliderPreview = new Map<string, number>();

  private _popHandler?: () => void;
  private _keyHandler?: (ev: KeyboardEvent) => void;
  private _prevOverflow = '';
  private _numberDraftDebouncers = new Map<
    string,
    { (value: number): void; cancel: () => void }
  >();

  static override styles = [
    auTokens,
    css`
      :host {
        display: none;
      }
      :host([open]) {
        display: block;
      }
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: var(--au-home-scrim, rgba(0, 0, 0, 0.4));
        display: flex;
        align-items: stretch;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
      }
      .sheet {
        width: min(960px, 100%);
        height: 100%;
        background: var(--au-home-bg, #f2f2f7);
        border-radius: var(--au-home-radius, 22px);
        box-shadow: var(--au-home-modal-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: var(--au-primary-text);
        font-family: var(--au-home-font);
        --au-home-tile-accent: var(--au-home-accent-vacuum, #bf5af2);
      }
      .header {
        flex: 0 0 auto;
        padding: 16px 16px 10px;
        background: var(--au-home-surface-elevated, #fff);
        border-bottom: 1px solid rgba(60, 60, 67, 0.12);
      }
      .header-top {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .header-top h1 {
        margin: 0;
        flex: 1;
        font-size: 1.35rem;
        font-weight: var(--au-weight-bold);
      }
      .icon-btn {
        appearance: none;
        border: none;
        background: var(--au-home-control-fill);
        color: var(--au-primary-text);
        width: 36px;
        height: 36px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .status-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        background: var(--au-home-control-fill);
        font-size: var(--au-font-secondary);
        color: var(--au-primary-text);
      }
      .vacuum-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .ctrl {
        appearance: none;
        border: none;
        border-radius: 999px;
        width: var(--au-control-size);
        height: var(--au-control-size);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: color-mix(
          in srgb,
          var(--au-home-accent-vacuum, #bf5af2) 18%,
          transparent
        );
        color: var(--au-primary-text);
        cursor: pointer;
        --mdc-icon-size: var(--au-control-glyph);
      }
      .ctrl:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .tabs {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 10px 16px;
        flex: 0 0 auto;
        background: var(--au-home-surface-elevated, #fff);
        border-bottom: 1px solid rgba(60, 60, 67, 0.08);
        -webkit-overflow-scrolling: touch;
      }
      .tab {
        appearance: none;
        border: none;
        background: var(--au-home-control-fill);
        color: var(--au-primary-text);
        border-radius: 999px;
        padding: 8px 12px;
        font: inherit;
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
        white-space: nowrap;
        cursor: pointer;
      }
      .tab.active {
        background: var(--au-home-accent-vacuum, #bf5af2);
        color: #fff;
      }
      .body {
        flex: 1 1 auto;
        overflow: auto;
        padding: 12px 16px 24px;
        -webkit-overflow-scrolling: touch;
      }
      .card {
        background: var(--au-home-surface-elevated, #fff);
        border-radius: var(--au-home-radius-sm, 16px);
        box-shadow: var(--au-home-shadow);
        padding: 4px 0;
        margin-bottom: 12px;
      }
      .card-title {
        padding: 12px 14px 4px;
        font-size: var(--au-font-meta);
        font-weight: var(--au-weight-bold);
        color: var(--au-secondary-text);
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
        align-items: center;
        padding: 12px 14px;
        min-height: 48px;
        box-sizing: border-box;
        border-top: 1px solid rgba(60, 60, 67, 0.08);
      }
      .row:first-of-type {
        border-top: none;
      }
      .row.unavailable {
        opacity: 0.45;
      }
      .row.highlight {
        background: color-mix(
          in srgb,
          var(--au-home-accent-vacuum, #bf5af2) 12%,
          transparent
        );
      }
      .row-label {
        min-width: 0;
      }
      .row-label .name {
        font-size: var(--au-font-primary);
        font-weight: var(--au-weight-medium);
      }
      .row-label .meta {
        font-size: var(--au-font-secondary);
        color: var(--au-secondary-text);
        margin-top: 2px;
      }
      .toggle {
        appearance: none;
        width: 48px;
        height: 30px;
        border-radius: 999px;
        border: none;
        background: rgba(120, 120, 128, 0.32);
        position: relative;
        cursor: pointer;
      }
      .toggle.on {
        background: var(--au-home-accent-vacuum, #bf5af2);
      }
      .toggle::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.15s ease;
      }
      .toggle.on::after {
        transform: translateX(18px);
      }
      .select-trigger,
      .action-btn,
      .stepper button {
        appearance: none;
        border: none;
        border-radius: 10px;
        padding: 8px 12px;
        background: var(--au-home-control-fill);
        color: var(--au-primary-text);
        font: inherit;
        font-size: var(--au-font-secondary);
        cursor: pointer;
      }
      .select-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 14px 12px;
      }
      .select-options button {
        appearance: none;
        border: 1px solid rgba(60, 60, 67, 0.18);
        background: var(--au-home-control-fill);
        border-radius: 999px;
        padding: 8px 12px;
        font: inherit;
        font-size: var(--au-font-secondary);
        cursor: pointer;
      }
      .select-options button.selected {
        background: var(--au-home-accent-vacuum, #bf5af2);
        color: #fff;
        border-color: transparent;
      }
      .stepper {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .stepper .value {
        min-width: 3ch;
        text-align: center;
        font-weight: var(--au-weight-medium);
      }
      .row.volume-row {
        grid-template-columns: 1fr auto;
      }
      .slider-wrap {
        grid-column: 1 / -1;
        padding: 0 14px 14px;
        min-width: 0;
        --au-slider-height: 36px;
        --au-slider-fill: color-mix(
          in srgb,
          var(--au-home-accent-vacuum, #bf5af2) 78%,
          white
        );
      }
      .time-input {
        appearance: none;
        border: 1px solid rgba(60, 60, 67, 0.18);
        border-radius: 10px;
        padding: 8px 10px;
        font: inherit;
        background: var(--au-home-control-fill);
        color: var(--au-primary-text);
      }
      .map-hero {
        width: 100%;
        aspect-ratio: 4 / 3;
        border-radius: var(--au-home-radius-sm);
        overflow: hidden;
        background: #1c1c1e;
        margin-bottom: 12px;
      }
      .map-hero img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      .room-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }
      .room-chips button {
        appearance: none;
        border: none;
        border-radius: 999px;
        padding: 8px 12px;
        background: var(--au-home-control-fill);
        font: inherit;
        font-size: var(--au-font-secondary);
        cursor: pointer;
      }
      .room-chips button.active {
        background: var(--au-home-accent-vacuum, #bf5af2);
        color: #fff;
      }
      .apply-bar {
        flex: 0 0 auto;
        display: flex;
        gap: 10px;
        padding: 12px 16px;
        background: var(--au-home-surface-elevated, #fff);
        border-top: 1px solid rgba(60, 60, 67, 0.12);
      }
      .apply-bar button {
        flex: 1;
        appearance: none;
        border: none;
        border-radius: 14px;
        padding: 14px;
        font: inherit;
        font-weight: var(--au-weight-bold);
        cursor: pointer;
      }
      .apply-bar .discard {
        background: var(--au-home-control-fill);
        color: var(--au-primary-text);
      }
      .apply-bar .apply {
        background: var(--au-home-accent-vacuum, #bf5af2);
        color: #fff;
      }
      .apply-bar button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .confirm-bar {
        display: flex;
        gap: 8px;
        padding: 10px 14px 14px;
      }
      .confirm-bar button {
        flex: 1;
        appearance: none;
        border: none;
        border-radius: 12px;
        padding: 12px;
        font: inherit;
        font-weight: var(--au-weight-medium);
        cursor: pointer;
      }
      .confirm-bar .danger {
        background: #ff3b30;
        color: #fff;
      }
      .confirm-bar .cancel {
        background: var(--au-home-control-fill);
      }
      .empty {
        padding: 24px;
        text-align: center;
        color: var(--au-secondary-text);
      }
      .more-btn {
        display: block;
        width: 100%;
        margin-top: 8px;
        appearance: none;
        border: none;
        border-radius: 12px;
        padding: 12px;
        background: var(--au-home-control-fill);
        font: inherit;
        cursor: pointer;
      }
    `,
  ];

  public open(opts: AuVacuumSettingsOpenOptions = {}): void {
    if (!this.hass || !this.vacuumEntityId) return;
    this.hideSections = [...(opts.hideSections ?? this.hideSections)];
    this._rebuildCatalog();
    const wanted = (opts.section as AuVacuumSettingsSection) || 'essentials';
    this._section = this._visibleTabs().some((t) => t.id === wanted)
      ? wanted
      : 'essentials';
    this._highlightEntityId = opts.entityId;
    this._draft = new VacuumSettingsDraft();
    this._sliderPreview = new Map();
    this._cancelNumberDebouncers();
    this._confirmEntityId = undefined;
    this._expandedSelect = undefined;
    this._advancedLimit = 80;
    if (this._catalog?.rooms.length) {
      this._roomIndex = this._catalog.rooms[0]!.index;
    }
    this._open = true;
    this.setAttribute('open', '');
    this._lockScroll(true);
    this._pushHistory();
    this._bindGlobal();
    void this.updateComplete.then(() => {
      if (opts.entityId) {
        const el = this.renderRoot.querySelector(
          `[data-entity="${CSS.escape(opts.entityId)}"]`,
        );
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  }

  public close(): void {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute('open');
    this._lockScroll(false);
    this._unbindGlobal();
    this._cancelNumberDebouncers();
    this._draft.clear();
    this._sliderPreview = new Map();
    this._confirmEntityId = undefined;
    if (history.state && (history.state as { auVacuumSettings?: string }).auVacuumSettings === HISTORY_KEY) {
      history.back();
    }
  }

  public get isOpen(): boolean {
    return this._open;
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('hass') && this._open) {
      // Live updates — keep draft; refresh catalog membership lightly.
      this._rebuildCatalog();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._lockScroll(false);
    this._unbindGlobal();
    this._cancelNumberDebouncers();
  }

  private _cancelNumberDebouncers(): void {
    for (const d of this._numberDraftDebouncers.values()) d.cancel();
    this._numberDraftDebouncers.clear();
  }

  private _rebuildCatalog(): void {
    if (!this.hass || !this.vacuumEntityId) {
      this._catalog = undefined;
      return;
    }
    this._catalog = filterCatalogSections(
      buildVacuumDeviceCatalog(this.hass, this.vacuumEntityId),
      this.hideSections,
    );
  }

  private _visibleTabs(): { id: AuVacuumSettingsSection; label: string }[] {
    const hide = new Set(this.hideSections.map((s) => s.toLowerCase()));
    return SECTION_TABS.filter((t) => !hide.has(t.id));
  }

  private _lockScroll(lock: boolean): void {
    if (lock) {
      this._prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = this._prevOverflow;
    }
  }

  private _pushHistory(): void {
    try {
      history.pushState({ auVacuumSettings: HISTORY_KEY }, '');
    } catch {
      /* ignore */
    }
  }

  private _bindGlobal(): void {
    this._unbindGlobal();
    this._popHandler = () => {
      if (this._open) {
        this._open = false;
        this.removeAttribute('open');
        this._lockScroll(false);
        this._unbindGlobal();
        this._draft.clear();
      }
    };
    this._keyHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        this.close();
      }
    };
    window.addEventListener('popstate', this._popHandler);
    window.addEventListener('keydown', this._keyHandler);
  }

  private _unbindGlobal(): void {
    if (this._popHandler) {
      window.removeEventListener('popstate', this._popHandler);
      this._popHandler = undefined;
    }
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = undefined;
    }
  }

  private _state(entityId: string): HassEntity | undefined {
    return this.hass?.states[entityId];
  }

  private _vacuum(): HassEntity | undefined {
    return this._state(this.vacuumEntityId);
  }

  private async _apply(): Promise<void> {
    if (!this.hass || this._applying) return;
    // Flush any in-flight slider previews into the draft before apply.
    for (const [entityId, value] of this._sliderPreview) {
      this._numberDraftDebouncers.get(entityId)?.cancel();
      this._draft.set(entityId, value);
    }
    this._sliderPreview = new Map();
    if (!this._draft.dirty) return;
    this._applying = true;
    try {
      await applyVacuumDraft(this.hass, this._draft);
      this.requestUpdate();
    } finally {
      this._applying = false;
    }
  }

  private _discard(): void {
    this._cancelNumberDebouncers();
    this._sliderPreview = new Map();
    this._draft.clear();
    this.requestUpdate();
  }

  private _setDraft(entityId: string, value: string | number | boolean): void {
    this._draft.set(entityId, value);
    this.requestUpdate();
  }

  /** Preview immediately; commit to draft once after sliding settles. */
  private _scheduleNumberDraft(entityId: string, value: number): void {
    const next = new Map(this._sliderPreview);
    next.set(entityId, value);
    this._sliderPreview = next;
    let debounced = this._numberDraftDebouncers.get(entityId);
    if (!debounced) {
      debounced = createDebounced((v: number) => {
        this._sliderPreview = new Map(
          [...this._sliderPreview].filter(([id]) => id !== entityId),
        );
        this._setDraft(entityId, v);
      }, 400);
      this._numberDraftDebouncers.set(entityId, debounced);
    }
    debounced(value);
    this.requestUpdate();
  }

  private _commitNumberDraft(entityId: string, value: number): void {
    this._numberDraftDebouncers.get(entityId)?.cancel();
    this._sliderPreview = new Map(
      [...this._sliderPreview].filter(([id]) => id !== entityId),
    );
    this._setDraft(entityId, value);
  }

  private _isVolumeEntity(entityId: string): boolean {
    return /(?:^|[._])volume(?:$|[._])/.test(entityId) || entityId.endsWith('_volume');
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._open || !this.hass) return nothing;
    const vacuum = this._vacuum();
    const offline = vacuum ? isEntityOffline(vacuum) : true;
    const caps = vacuum ? getVacuumCapabilities(vacuum) : undefined;

    return html`
      <div
        class="scrim"
        @click=${(ev: Event) => {
          if (ev.target === ev.currentTarget) this.close();
        }}
      >
        <div class="sheet" role="dialog" aria-modal="true" aria-label=${this.title}>
          <div class="header">
            <div class="header-top">
              <h1>${this.title}</h1>
              <button
                class="icon-btn"
                type="button"
                aria-label="Close"
                @click=${() => this.close()}
              >
                <ha-icon .icon=${'mdi:close'}></ha-icon>
              </button>
            </div>
            ${this._renderStatusStrip()}
            <div class="vacuum-actions">
              ${caps?.canStart
                ? html`<button
                    class="ctrl"
                    type="button"
                    title="Start"
                    aria-label="Start"
                    ?disabled=${offline}
                    @click=${() => void startVacuum(this.hass!, this.vacuumEntityId)}
                  >
                    <ha-icon .icon=${'mdi:play'}></ha-icon>
                  </button>`
                : nothing}
              ${caps?.canPause
                ? html`<button
                    class="ctrl"
                    type="button"
                    title="Pause"
                    aria-label="Pause"
                    ?disabled=${offline}
                    @click=${() => void pauseVacuum(this.hass!, this.vacuumEntityId)}
                  >
                    <ha-icon .icon=${'mdi:pause'}></ha-icon>
                  </button>`
                : nothing}
              ${caps?.canStop
                ? html`<button
                    class="ctrl"
                    type="button"
                    title="Stop"
                    aria-label="Stop"
                    ?disabled=${offline}
                    @click=${() => void stopVacuum(this.hass!, this.vacuumEntityId)}
                  >
                    <ha-icon .icon=${'mdi:stop'}></ha-icon>
                  </button>`
                : nothing}
              ${caps?.canReturn
                ? html`<button
                    class="ctrl"
                    type="button"
                    title="Return home"
                    aria-label="Return home"
                    ?disabled=${offline}
                    @click=${() => void returnVacuum(this.hass!, this.vacuumEntityId)}
                  >
                    <ha-icon .icon=${'mdi:home-map-marker'}></ha-icon>
                  </button>`
                : nothing}
            </div>
          </div>
          <div class="tabs">
            ${this._visibleTabs().map(
              (t) => html`
                <button
                  class=${classMap({ tab: true, active: this._section === t.id })}
                  type="button"
                  @click=${() => {
                    this._section = t.id;
                    this._expandedSelect = undefined;
                    this._confirmEntityId = undefined;
                  }}
                >
                  ${t.label}
                </button>
              `,
            )}
          </div>
          <div class="body">${this._renderSectionBody(offline)}</div>
          ${this._draft.dirty
            ? html`<div class="apply-bar">
                <button class="discard" type="button" @click=${() => this._discard()}>
                  Discard
                </button>
                <button
                  class="apply"
                  type="button"
                  ?disabled=${this._applying || offline}
                  @click=${() => void this._apply()}
                >
                  Apply
                </button>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderStatusStrip(): TemplateResult {
    const vacuum = this._vacuum();
    const ids = this._catalog?.statusEntityIds ?? {};
    const chips: TemplateResult[] = [];
    const push = (entityId: string | undefined, fallbackLabel: string) => {
      if (!entityId) return;
      const ent = this._state(entityId);
      const value = ent?.state ?? '—';
      const unit = ent?.attributes.unit_of_measurement
        ? ` ${ent.attributes.unit_of_measurement}`
        : '';
      chips.push(html`
        <span class="chip">
          <strong>${fallbackLabel}</strong>
          ${value}${unit}
        </span>
      `);
    };
    push(ids.battery, 'Battery');
    push(ids.status, 'Status');
    push(ids.cleanedArea, 'Area');
    push(ids.cleaningProgress, 'Progress');
    push(ids.cleaningTime, 'Time');
    push(ids.currentRoom, 'Room');
    if (vacuum && isVacuumActive(vacuum)) {
      chips.unshift(html`<span class="chip"><strong>Active</strong></span>`);
    }
    return html`<div class="status-strip">${chips}</div>`;
  }

  private _renderSectionBody(offline: boolean): TemplateResult {
    const catalog = this._catalog;
    if (!catalog) {
      return html`<div class="empty">No device entities found.</div>`;
    }

    if (this._section === 'map') {
      return this._renderMap(catalog);
    }
    if (this._section === 'rooms') {
      return this._renderRooms(catalog, offline);
    }

    let entries = entriesForSection(catalog, this._section);
    if (this._section === 'dock') {
      // Prefer action buttons at top
      entries = [...entries].sort((a, b) => {
        const score = (e: VacuumCatalogEntry) =>
          e.domain === 'button' || e.entityId.includes('self_clean') ? 0 : 1;
        return score(a) - score(b);
      });
    }

    if (this._section === 'advanced' && entries.length > this._advancedLimit) {
      const shown = entries.slice(0, this._advancedLimit);
      return html`
        <div class="card">
          <div class="card-title">All other entities</div>
          ${shown.map((e) => this._renderEntry(e, offline))}
        </div>
        <button
          class="more-btn"
          type="button"
          @click=${() => {
            this._advancedLimit += 80;
          }}
        >
          Show more (${entries.length - shown.length} remaining)
        </button>
      `;
    }

    if (!entries.length) {
      return html`<div class="empty">Nothing in this section.</div>`;
    }

    return html`
      <div class="card">
        <div class="card-title">${this._section}</div>
        ${entries.map((e) => this._renderEntry(e, offline))}
      </div>
    `;
  }

  private _renderMap(catalog: VacuumDeviceCatalog): TemplateResult {
    const camId = catalog.mapCameraId;
    const cam = camId ? this._state(camId) : undefined;
    const picture =
      (cam?.attributes.entity_picture as string | undefined) ||
      (camId ? `/api/camera_proxy/${camId}` : undefined);
    return html`
      <div class="map-hero">
        ${picture
          ? html`<img src=${picture} alt="Vacuum map" />`
          : html`<div class="empty">Map camera unavailable</div>`}
      </div>
      ${camId
        ? html`<div class="card">
            <div class="card-title">Camera</div>
            ${this._renderSensorRow(camId, cam, false)}
          </div>`
        : nothing}
    `;
  }

  private _renderRooms(
    catalog: VacuumDeviceCatalog,
    offline: boolean,
  ): TemplateResult {
    const rooms = catalog.rooms;
    if (!rooms.length) {
      return html`<div class="empty">No room entities on this device.</div>`;
    }
    const room =
      rooms.find((r) => r.index === this._roomIndex) ?? rooms[0]!;
    const roomEntries = catalog.entries.filter(
      (e) => e.roomIndex === room.index,
    );
    return html`
      <div class="room-chips">
        ${rooms.map((r) => {
          const label = roomDisplayName(this.hass!, r);
          return html`<button
            type="button"
            class=${classMap({ active: r.index === room.index })}
            @click=${() => {
              this._roomIndex = r.index;
            }}
          >
            ${label}
          </button>`;
        })}
      </div>
      <div class="card">
        <div class="card-title">${roomDisplayName(this.hass!, room)}</div>
        ${roomEntries.map((e) => this._renderEntry(e, offline))}
      </div>
    `;
  }

  private _renderEntry(
    entry: VacuumCatalogEntry,
    offline: boolean,
  ): TemplateResult {
    const entity = this._state(entry.entityId);
    const unavailable = !entity || entity.state === 'unavailable';
    const disabled = offline || unavailable;

    if (entry.domain === 'switch') {
      return this._renderSwitchRow(entry.entityId, entity, disabled);
    }
    if (entry.domain === 'select') {
      return this._renderSelectRow(entry.entityId, entity, disabled);
    }
    if (entry.domain === 'number') {
      return this._renderNumberRow(entry.entityId, entity, disabled);
    }
    if (entry.domain === 'time') {
      return this._renderTimeRow(entry.entityId, entity, disabled);
    }
    if (entry.domain === 'button') {
      return this._renderButtonRow(entry, entity, disabled);
    }
    return this._renderSensorRow(entry.entityId, entity, unavailable);
  }

  private _rowClass(
    entityId: string,
    unavailable: boolean,
  ): Record<string, boolean> {
    return {
      row: true,
      unavailable,
      highlight: this._highlightEntityId === entityId,
    };
  }

  private _entityLabel(
    entity: HassEntity | undefined,
    entityId: string,
  ): string {
    return entityLabel(
      entity,
      entityId,
      vacuumLabelPrefixes(this.hass, this.vacuumEntityId, this.title),
    );
  }

  private _renderSwitchRow(
    entityId: string,
    entity: HassEntity | undefined,
    disabled: boolean,
  ): TemplateResult {
    const state = this._draft.resolveState(entity, entityId);
    const on = state === 'on' || state === 'true';
    return html`
      <div
        class=${classMap(this._rowClass(entityId, !entity || entity.state === 'unavailable'))}
        data-entity=${entityId}
      >
        <div class="row-label">
          <div class="name">${this._entityLabel(entity, entityId)}</div>
          <div class="meta">${state}</div>
        </div>
        <button
          class=${classMap({ toggle: true, on })}
          type="button"
          ?disabled=${disabled}
          aria-pressed=${on}
          @click=${() => this._setDraft(entityId, !on)}
        ></button>
      </div>
    `;
  }

  private _renderSelectRow(
    entityId: string,
    entity: HassEntity | undefined,
    disabled: boolean,
  ): TemplateResult {
    const current = this._draft.resolveState(entity, entityId);
    const options = Array.isArray(entity?.attributes.options)
      ? (entity!.attributes.options as string[])
      : [];
    const expanded = this._expandedSelect === entityId;
    return html`
      <div
        class=${classMap(this._rowClass(entityId, !entity || entity.state === 'unavailable'))}
        data-entity=${entityId}
      >
        <div class="row-label">
          <div class="name">${this._entityLabel(entity, entityId)}</div>
          <div class="meta">${current}</div>
        </div>
        <button
          class="select-trigger"
          type="button"
          ?disabled=${disabled}
          @click=${() => {
            this._expandedSelect = expanded ? undefined : entityId;
          }}
        >
          ${expanded ? 'Hide' : 'Change'}
        </button>
      </div>
      ${expanded
        ? html`<div class="select-options">
            ${options.map(
              (opt) => html`<button
                type="button"
                class=${classMap({ selected: opt === current })}
                ?disabled=${disabled}
                @click=${() => {
                  this._setDraft(entityId, opt);
                  this._expandedSelect = undefined;
                }}
              >
                ${opt}
              </button>`,
            )}
          </div>`
        : nothing}
    `;
  }

  private _renderNumberRow(
    entityId: string,
    entity: HassEntity | undefined,
    disabled: boolean,
  ): TemplateResult {
    const drafted = this._draft.resolveNumber(entity, entityId) ?? 0;
    const value = this._sliderPreview.get(entityId) ?? drafted;
    const min =
      typeof entity?.attributes.min === 'number' ? entity.attributes.min : 0;
    const max =
      typeof entity?.attributes.max === 'number' ? entity.attributes.max : 100;
    const step =
      typeof entity?.attributes.step === 'number' ? entity.attributes.step : 1;
    const unit = entity?.attributes.unit_of_measurement ?? '';
    const unavailable = !entity || entity.state === 'unavailable';

    if (this._isVolumeEntity(entityId)) {
      return html`
        <div
          class=${classMap({
            ...this._rowClass(entityId, unavailable),
            'volume-row': true,
          })}
          data-entity=${entityId}
        >
          <div class="row-label">
            <div class="name">${this._entityLabel(entity, entityId)}</div>
            <div class="meta">${unit || 'Volume'}</div>
          </div>
          <span class="chip">${value}${unit ? ` ${unit}` : ''}</span>
          <div class="slider-wrap">
            <au-light-slider
              .min=${min}
              .max=${max}
              .step=${step}
              .value=${value}
              .disabled=${disabled}
              label=${this._entityLabel(entity, entityId)}
              .ariaValueText=${`${value}${unit}`}
              @value-changing=${(ev: CustomEvent<{ value: number }>) => {
                this._scheduleNumberDraft(entityId, ev.detail.value);
              }}
              @value-changed=${(ev: CustomEvent<{ value: number }>) => {
                this._commitNumberDraft(entityId, ev.detail.value);
              }}
            ></au-light-slider>
          </div>
        </div>
      `;
    }

    return html`
      <div
        class=${classMap(this._rowClass(entityId, unavailable))}
        data-entity=${entityId}
      >
        <div class="row-label">
          <div class="name">${this._entityLabel(entity, entityId)}</div>
          <div class="meta">${unit}</div>
        </div>
        <div class="stepper">
          <button
            type="button"
            ?disabled=${disabled}
            @click=${() =>
              this._scheduleNumberDraft(
                entityId,
                Math.max(min, value - step),
              )}
          >
            −
          </button>
          <span class="value">${value}</span>
          <button
            type="button"
            ?disabled=${disabled}
            @click=${() =>
              this._scheduleNumberDraft(
                entityId,
                Math.min(max, value + step),
              )}
          >
            +
          </button>
        </div>
      </div>
    `;
  }

  private _renderTimeRow(
    entityId: string,
    entity: HassEntity | undefined,
    disabled: boolean,
  ): TemplateResult {
    const value = this._draft.resolveState(entity, entityId);
    const timeValue = value.length >= 5 ? value.slice(0, 5) : value;
    return html`
      <div
        class=${classMap(this._rowClass(entityId, !entity || entity.state === 'unavailable'))}
        data-entity=${entityId}
      >
        <div class="row-label">
          <div class="name">${this._entityLabel(entity, entityId)}</div>
        </div>
        <input
          class="time-input"
          type="time"
          .value=${timeValue}
          ?disabled=${disabled}
          @change=${(ev: Event) => {
            const v = (ev.target as HTMLInputElement).value;
            if (v) this._setDraft(entityId, v.length === 5 ? `${v}:00` : v);
          }}
        />
      </div>
    `;
  }

  private _renderButtonRow(
    entry: VacuumCatalogEntry,
    entity: HassEntity | undefined,
    disabled: boolean,
  ): TemplateResult {
    const entityId = entry.entityId;
    const isMaint = entry.section === 'maintenance';
    const confirming = this._confirmEntityId === entityId;
    return html`
      <div
        class=${classMap(this._rowClass(entityId, !entity || entity.state === 'unavailable'))}
        data-entity=${entityId}
      >
        <div class="row-label">
          <div class="name">${this._entityLabel(entity, entityId)}</div>
        </div>
        <button
          class="action-btn"
          type="button"
          ?disabled=${disabled}
          @click=${() => {
            if (isMaint) {
              this._confirmEntityId = entityId;
            } else {
              void pressVacuumButton(this.hass!, entityId);
            }
          }}
        >
          Run
        </button>
      </div>
      ${confirming
        ? html`<div class="confirm-bar">
            <button
              class="danger"
              type="button"
              @click=${() => {
                this._confirmEntityId = undefined;
                void pressVacuumButton(this.hass!, entityId);
              }}
            >
              Confirm
            </button>
            <button
              class="cancel"
              type="button"
              @click=${() => {
                this._confirmEntityId = undefined;
              }}
            >
              Cancel
            </button>
          </div>`
        : nothing}
    `;
  }

  private _renderSensorRow(
    entityId: string,
    entity: HassEntity | undefined,
    unavailable: boolean,
  ): TemplateResult {
    const unit = entity?.attributes.unit_of_measurement
      ? ` ${entity.attributes.unit_of_measurement}`
      : '';
    return html`
      <div
        class=${classMap(this._rowClass(entityId, unavailable))}
        data-entity=${entityId}
      >
        <div class="row-label">
          <div class="name">${this._entityLabel(entity, entityId)}</div>
        </div>
        <span class="chip">${entity?.state ?? '—'}${unit}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-vacuum-settings-overlay': AuVacuumSettingsOverlay;
  }
}

/** Ensure a single overlay instance exists and return it. */
export function ensureVacuumSettingsOverlay(): AuVacuumSettingsOverlay {
  let el = document.querySelector(
    'au-vacuum-settings-overlay',
  ) as AuVacuumSettingsOverlay | null;
  if (!el) {
    el = document.createElement(
      'au-vacuum-settings-overlay',
    ) as AuVacuumSettingsOverlay;
    document.body.appendChild(el);
  }
  return el;
}

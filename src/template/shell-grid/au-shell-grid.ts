import {
  html,
  css,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { AuBaseCard } from '../../core/base-card';
import { auTokens } from '../../theme/tokens';
import type {
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
  Lovelace,
} from '../../types/home-assistant';
import { isShellHomeMode, type AuShellGridConfig } from '../../types/config';
import {
  deriveResponsiveLayout,
  displayColumnsForWidth,
  findFreeSlot,
  gridRowCount,
  moveItem,
  normalizeLayout,
  resizeItem,
  resolveRowTrackCount,
  computeRowTrackHeightPx,
  shouldDistributeRowHeight,
  type GridItemLike,
} from './grid-engine';
import {
  applyGridToLovelaceConfig,
  buildPersistedGridConfig,
  buildPersistedHomeConfig,
} from './config-persist';
import {
  createChildCard,
  ensureCardPickerLoaded,
  fallbackCustomCardEntries,
  stubConfigForCardType,
} from './create-child-card';
import './au-shell-home-view';
import type { AuShellHomeView } from './au-shell-home-view';
import type { AuHomeFloorConfig } from '../../types/home';

const DEFAULT_ROW_HEIGHT = '80px';
const DEFAULT_GRID_WIDTH = '100%';
const DEFAULT_GRID_HEIGHT = '100vh';
const DEFAULT_HEIGHT_UNITS = 2;

/** Walk up the DOM including shadow-root hosts. */
function walkAncestors(
  start: Element,
  visit: (node: Element) => boolean,
): boolean {
  let node: Element | null = start;
  while (node) {
    if (visit(node)) return true;
    const root = node.getRootNode();
    if (root instanceof ShadowRoot) {
      node = root.host;
    } else {
      node = node.parentElement;
    }
  }
  return false;
}

/** A resolved grid item: engine coordinates plus its (possibly overridden) config. */
interface GridItem extends GridItemLike {
  config: LovelaceCardConfig;
}

interface DragState {
  id: string;
  startX: number;
  startY: number;
  pointerX: number;
  pointerY: number;
  cellW: number;
  rowH: number;
  gap: number;
}

/**
 * `au-shell-grid` (spec 5.1) - an interactive, coordinate-based dashboard grid.
 *
 * Layout editing is bound to Home Assistant's native dashboard edit mode:
 * pencil enters edit (handles/guides), Done saves to dashboard YAML. Changes
 * settle through collision resolution (push-down only). Column architecture
 * scales 12 / 6 / 1 with the container width. All observers/listeners are torn
 * down on disconnect (spec 7).
 */
@customElement('au-shell-grid')
export class AuShellGrid extends AuBaseCard<AuShellGridConfig> {
  static override styles = [
    auTokens,
    css`
      :host {
        display: block;
        box-sizing: border-box;
        max-width: 100%;
      }
      .shell {
        position: relative;
        box-sizing: border-box;
        overflow: auto;
      }
      .shell.home-mode {
        display: flex;
        flex-direction: column;
        min-height: 0;
        /* Nested overflow:auto with the home view scrollport steals tablet taps. */
        overflow: hidden;
      }
      .shell.home-mode au-shell-home-view {
        flex: 1;
        min-height: 0;
        display: block;
        overflow: hidden;
      }
      .shell.distribute-rows {
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(var(--grid-columns, 12), minmax(0, 1fr));
        grid-auto-rows: var(--au-grid-row-height);
        width: 100%;
        box-sizing: border-box;
      }
      .grid.distribute-rows {
        flex: 1;
        min-height: 0;
        height: 100%;
        grid-template-rows: repeat(var(--grid-rows, 1), minmax(0, 1fr));
      }
      .grid.editing {
        outline: 1px dashed var(--au-grid-guide);
        outline-offset: 4px;
        border-radius: var(--au-card-radius);
        background-image: linear-gradient(
            to right,
            var(--au-grid-guide) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, var(--au-grid-guide) 1px, transparent 1px);
        /* Match CSS grid track sizing: period = cell + gap */
        background-size:
          calc((100% + var(--grid-gap, 0px)) / var(--grid-columns, 12))
          calc(var(--au-grid-row-height, 80px) + var(--grid-gap, 0px));
        background-position: 0 0;
      }

      .cell {
        position: relative;
        min-width: 0;
        overflow: hidden;
      }
      .grid.editing .cell {
        outline: 1px dashed var(--au-grid-handle);
        outline-offset: -1px;
      }
      .cell-content {
        width: 100%;
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: auto;
      }
      .edit-cover {
        position: absolute;
        inset: 0;
        z-index: 2;
        cursor: pointer;
        background: transparent;
      }

      .handle {
        position: absolute;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: var(--au-grid-handle);
        --mdc-icon-size: 16px;
      }
      .drag-handle {
        top: 0;
        left: 0;
        height: 22px;
        padding: 0 6px;
        border-radius: 0 0 6px 0;
        cursor: move;
        touch-action: none;
      }
      .remove-btn {
        top: 0;
        right: 0;
        width: 22px;
        height: 22px;
        border: none;
        border-radius: 0 0 0 6px;
        cursor: pointer;
      }
      .resize-handle {
        right: 0;
        bottom: 0;
        width: 16px;
        height: 16px;
        border-radius: 6px 0 0 0;
        cursor: nwse-resize;
        touch-action: none;
        background:
          var(--au-grid-handle);
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9;
        background: rgba(0, 0, 0, 0.4);
      }
      .modal {
        position: fixed;
        z-index: 10;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(520px, 92vw);
        max-height: 82vh;
        display: flex;
        flex-direction: column;
        background: var(--au-card-background);
        color: var(--au-primary-text);
        border-radius: var(--au-card-radius);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      }
      .modal-header {
        display: flex;
        align-items: center;
        gap: var(--au-gap-sm);
        padding: var(--au-gap);
        border-bottom: 1px solid var(--au-grid-guide);
        font-weight: var(--au-weight-medium);
      }
      .modal-header .spacer {
        flex: 1 1 auto;
      }
      .modal-body {
        padding: var(--au-gap);
        overflow: auto;
      }
      .add-fab {
        position: absolute;
        bottom: 16px;
        right: 16px;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border: none;
        border-radius: 50%;
        background: var(--au-accent);
        color: #fff;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
        --mdc-icon-size: 28px;
      }
      .add-fab:focus-visible {
        outline: 2px solid var(--au-accent);
        outline-offset: 3px;
      }
      hui-card-picker {
        display: block;
      }
      .picker-status {
        color: var(--au-secondary-text);
        padding: var(--au-gap-sm) 0;
        font-size: 0.875rem;
      }
      .fallback-list {
        display: flex;
        flex-direction: column;
        gap: var(--au-gap-sm);
      }
      .fallback-item {
        appearance: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 8px;
        background: color-mix(in srgb, var(--au-primary-text) 4%, transparent);
        color: var(--au-primary-text);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .fallback-item:hover,
      .fallback-item:focus-visible {
        border-color: var(--au-accent);
        outline: none;
      }
      .fallback-item .name {
        font-weight: var(--au-weight-medium);
      }
      .fallback-item .desc {
        font-size: 0.8125rem;
        color: var(--au-secondary-text);
      }
      .empty {
        color: var(--au-secondary-text);
        padding: var(--au-card-padding);
      }
    `,
  ];

  /**
   * Home Assistant sets these on the card element while the dashboard is in edit
   * mode (via `hui-card`). Older HA uses `editMode`; newer HA uses `preview`.
   * Use `{ type: Boolean }` so Lit reacts when HA assigns the property.
   */
  @property({ type: Boolean }) public editMode = false;
  @property({ type: Boolean }) public preview = false;

  /**
   * Injected when `au-shell-grid` is used as a custom Lovelace **view** type.
   * HA sets `lovelace.editMode` here but does not mirror it to `preview`.
   */
  @property({ attribute: false }) public lovelace?: Lovelace;

  /** View index injected by HA when used as a custom Lovelace view type. */
  @property({ type: Number }) public index?: number;

  /** Tracks the previous dashboard-edit state for Done = save edge detection. */
  private _haDashboardEditing = false;

  /** Reactive mirror of `_layoutEditing()` so parent-only preview changes re-render. */
  @state() private _layoutEditingVisible = false;

  @state() private _items: GridItem[] = [];
  @state() private _displayCols = 12;
  @state() private _confirmRemoveId?: string;
  @state() private _contentEditId?: string;
  @state() private _addCardOpen = false;
  @state() private _cardPickerReady = false;
  @state() private _cardPickerLoading = false;
  @state() private _shellHeightPx = 0;

  @query('.shell') private _shellEl?: HTMLElement;
  @query('.grid') private _gridEl?: HTMLElement;

  private _baseColumns = 12;
  private _elements = new Map<string, LovelaceCard>();
  private _elementKey = new Map<string, string>();
  private _removedIds = new Set<string>();
  private _contentOverrides = new Map<string, LovelaceCardConfig>();
  private _contentEditor?: LovelaceCardEditor;
  private _drag?: DragState;
  private _resize?: DragState;
  private _resizeObserver?: ResizeObserver;
  private _shellObserver?: ResizeObserver;
  private _observedShell?: HTMLElement;
  private _editModeWatchId?: number;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import('./au-shell-grid-editor');
    return document.createElement('au-shell-grid-editor');
  }

  /**
   * Stub starts with a sample Home floor/room so the visual editor is ready
   * when the card is added from the GUI.
   */
  public static getStubConfig(): AuShellGridConfig {
    return {
      type: 'custom:au-shell-grid',
      columns: 12,
      gap: '12px',
      row_height: DEFAULT_ROW_HEIGHT,
      width: DEFAULT_GRID_WIDTH,
      height: DEFAULT_GRID_HEIGHT,
      cards: [],
      show_presence: true,
      show_bulk_actions: true,
      floors: [
        {
          name: 'Main',
          rooms: [{ name: 'Living room', entities: [] }],
        },
      ],
      presence: [],
    };
  }

  protected validateConfig(config: AuShellGridConfig): void {
    if (config.cards !== undefined && !Array.isArray(config.cards)) {
      throw new Error('AtriumUI Shell Grid: "cards" must be a list of cards');
    }
    if (config.floors !== undefined && !Array.isArray(config.floors)) {
      throw new Error('AtriumUI Shell Grid: "floors" must be an array');
    }
    if (config.presence !== undefined && !Array.isArray(config.presence)) {
      throw new Error('AtriumUI Shell Grid: "presence" must be an array');
    }
    if (config.columns !== undefined && config.columns < 1) {
      throw new Error('AtriumUI Shell Grid: "columns" must be >= 1');
    }
    if (config.rows !== undefined && config.rows < 1) {
      throw new Error('AtriumUI Shell Grid: "rows" must be >= 1');
    }
    for (const card of config.cards ?? []) {
      if (card.layout) {
        const { x, y, w, h } = card.layout;
        if ([x, y, w, h].some((n) => typeof n !== 'number')) {
          throw new Error(
            'AtriumUI Shell Grid: card "layout" must have numeric x, y, w, h',
          );
        }
      }
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._refreshLayoutEditingState();
    this._burstSyncEditMode();

    const parentCard = this.closest('hui-card');
    if (parentCard) {
      const onParentUpdated = (): void => {
        this._refreshLayoutEditingState();
        this._burstSyncEditMode();
      };
      parentCard.addEventListener('card-updated', onParentUpdated);
      this.registerTeardown(() =>
        parentCard.removeEventListener('card-updated', onParentUpdated),
      );
    }

    const onLocationChange = (): void => {
      this._refreshLayoutEditingState();
    };
    window.addEventListener('location-changed', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    this.registerTeardown(() => {
      window.removeEventListener('location-changed', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    });

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? this.clientWidth;
        this._updateDisplayCols(width);
      });
      this._resizeObserver.observe(this);
      this.registerTeardown(() => this._resizeObserver?.disconnect());
    }

    this._startEditModeWatch();
  }

  /**
   * Custom Lovelace views receive `lovelace.editMode` in-place (HA never sets
   * `preview` on the layout element). Poll each animation frame while connected.
   */
  private _startEditModeWatch(): void {
    if (this.closest('hui-card') || this._editModeWatchId !== undefined) {
      return;
    }

    let prev = this._layoutEditing();
    const tick = (): void => {
      if (!this.isConnected) {
        this._editModeWatchId = undefined;
        return;
      }
      const live = this._layoutEditing();
      if (live !== prev) {
        prev = live;
        this._refreshLayoutEditingState();
      }
      this._editModeWatchId = requestAnimationFrame(tick);
    };
    this._editModeWatchId = requestAnimationFrame(tick);
    this.registerTeardown(() => {
      if (this._editModeWatchId !== undefined) {
        cancelAnimationFrame(this._editModeWatchId);
        this._editModeWatchId = undefined;
      }
    });
  }

  protected override shouldUpdate(changed: PropertyValues): boolean {
    const structural =
      changed.has('_config') ||
      changed.has('_items') ||
      changed.has('_displayCols') ||
      changed.has('_confirmRemoveId') ||
      changed.has('_contentEditId') ||
      changed.has('_addCardOpen') ||
      changed.has('_cardPickerReady') ||
      changed.has('_cardPickerLoading') ||
      changed.has('_layoutEditingVisible') ||
      changed.has('editMode') ||
      changed.has('preview') ||
      changed.has('lovelace');
    if (changed.has('hass') && !structural) {
      this._refreshLayoutEditingState();
      this._forwardHass();
      return false;
    }
    return true;
  }

  protected override willUpdate(changed: PropertyValues): void {
    this._refreshLayoutEditingState();
    if (changed.has('_config') && this._config) {
      this._baseColumns = this._config.columns ?? 12;
      if (this._displayCols > this._baseColumns) {
        this._displayCols = this._baseColumns;
      }
      void this._rebuild();
    }
  }

  /** True when the dashboard URL carries HA's edit-mode flag (`?edit=1`). */
  private _isEditUrl(): boolean {
    try {
      return new URLSearchParams(window.location.search).get('edit') === '1';
    } catch {
      return false;
    }
  }

  /** Closest ancestor (including self) exposing HA's live `lovelace` context. */
  private _findClosestLovelace(): Lovelace | undefined {
    let result: Lovelace | undefined;
    walkAncestors(this, (node) => {
      const host = node as { lovelace?: Lovelace };
      if (host.lovelace !== undefined) {
        result = host.lovelace;
        return true;
      }
      return false;
    });
    return result;
  }

  /**
   * Whether the HA dashboard is in native edit mode. Fast paths (preview props)
   * are checked first because hui-card sets them synchronously on pencil click;
   * lovelace/URL are consulted afterward.
   */
  private _detectHaDashboardEditing(): boolean {
    if (this._config?.editable === false) return false;

    if (this.preview === true || this.editMode === true) return true;

    const parentCard = this.closest('hui-card') as
      | { preview?: boolean; editMode?: boolean }
      | null;
    if (parentCard?.preview === true || parentCard?.editMode === true) {
      return true;
    }

    if (this._isEditUrl()) return true;
    if (this.lovelace?.editMode === true) return true;
    return this._findClosestLovelace()?.editMode === true;
  }

  /** Desktop-width gate for layout handles (> 1024px per spec). */
  private _isDesktopLayout(): boolean {
    const w =
      this.clientWidth ||
      this.getBoundingClientRect().width ||
      window.innerWidth;
    return w > 1024;
  }

  /** Live layout-edit chrome (handles/guides) — desktop only. */
  private _layoutEditing(): boolean {
    return this._detectHaDashboardEditing() && this._isDesktopLayout();
  }

  /** Sync reactive edit visibility + HA enter/exit side effects. */
  private _refreshLayoutEditingState(): void {
    const live = this._layoutEditing();
    if (live !== this._layoutEditingVisible) {
      this._layoutEditingVisible = live;
    }
    this._syncHaDashboardEditing();
  }

  /**
   * HA can set parent `preview` before our element re-renders. Re-check for a
   * few animation frames after connect / card-updated (no interval delay).
   */
  private _burstSyncEditMode(): void {
    // Custom views receive lovelace.editMode asynchronously after ?edit=1 clears.
    let frames = this.closest('hui-card') ? 30 : 120;
    const tick = (): void => {
      this._refreshLayoutEditingState();
      if (--frames > 0) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('lovelace')) {
      this._burstSyncEditMode();
      this._startEditModeWatch();
    }
    this._observeShell();
  }

  /** Observe shell height so row tracks can fill a fixed container evenly. */
  private _observeShell(): void {
    const shell = this._shellEl;
    if (!shell || typeof ResizeObserver === 'undefined') return;

    if (!this._shellObserver) {
      this._shellObserver = new ResizeObserver((entries) => {
        const h = entries[0]?.contentRect.height ?? 0;
        if (Math.abs(h - this._shellHeightPx) > 0.5) {
          this._shellHeightPx = h;
        }
      });
      this.registerTeardown(() => {
        this._shellObserver?.disconnect();
        this._shellObserver = undefined;
        this._observedShell = undefined;
      });
    }

    if (this._observedShell === shell) return;
    this._shellObserver.disconnect();
    this._shellObserver.observe(shell);
    this._observedShell = shell;
    const h = shell.getBoundingClientRect().height;
    if (h > 0 && Math.abs(h - this._shellHeightPx) > 0.5) {
      this._shellHeightPx = h;
    }
  }

  private _gapPx(): number {
    if (this._gridEl) {
      const cs = getComputedStyle(this._gridEl);
      return parseFloat(cs.rowGap || cs.gap || '0') || 0;
    }
    const parsed = parseFloat(String(this._config?.gap ?? '12'));
    return Number.isFinite(parsed) ? parsed : 12;
  }

  private _distributeRowsActive(): boolean {
    const cfg = this._config;
    if (!cfg) return false;
    const heightExplicit = Boolean(cfg.height?.trim());
    return (
      shouldDistributeRowHeight(
        heightExplicit ? cfg.height : undefined,
        cfg.rows,
      ) && this._shellHeightPx > 0
    );
  }

  /** React to HA dashboard edit-mode transitions: pencil = enter, Done = save. */
  private _syncHaDashboardEditing(): void {
    const editing = this._detectHaDashboardEditing();
    const prev = this._haDashboardEditing;
    if (editing === prev) return;

    this._haDashboardEditing = editing;

    if (editing) {
      this._closeContentEdit();
      this._closeAddCard();
      this._confirmRemoveId = undefined;
      return;
    }

    this._closeContentEdit();
    this._closeAddCard();
    this._save();
  }

  private _defaultWidth(): number {
    return Math.max(1, Math.min(this._baseColumns, Math.round(this._baseColumns / 3)));
  }

  /** Rebuild items + child elements from dashboard YAML config. */
  private async _rebuild(): Promise<void> {
    const cfg = this._config;
    if (!cfg) return;
    const base = this._baseColumns;
    this._removedIds = new Set();
    this._contentOverrides = new Map();

    const entries = (cfg.cards ?? []).map((card, index) => ({
      id: card.id ?? `au-item-${index}`,
      card,
    }));

    const resolved = entries.map((e) => ({
      id: e.id,
      config: e.card,
      layout: e.card.layout,
    }));

    const normalized = normalizeLayout(
      resolved,
      base,
      this._defaultWidth(),
      DEFAULT_HEIGHT_UNITS,
    );

    const nextElements = new Map<string, LovelaceCard>();
    await Promise.all(
      resolved.map(async (r) => {
        const key = JSON.stringify(r.config);
        let el = this._elements.get(r.id);
        if (!el || this._elementKey.get(r.id) !== key) {
          el = await createChildCard(r.config);
          this._elementKey.set(r.id, key);
        }
        if (this.hass && el) el.hass = this.hass;
        nextElements.set(r.id, el);
      }),
    );
    this._elements = nextElements;

    this._items = normalized.map((n) => {
      const match = resolved.find((r) => r.id === n.id);
      return {
        id: n.id,
        x: n.x,
        y: n.y,
        w: n.w,
        h: n.h,
        config: match?.config ?? { type: 'error' },
      };
    });
  }

  private _forwardHass(): void {
    const hass = this.hass;
    if (!hass) return;
    for (const el of this._elements.values()) {
      el.hass = hass;
    }
    if (this._contentEditor) this._contentEditor.hass = hass;
    const home = this.renderRoot?.querySelector(
      'au-shell-home-view',
    ) as AuShellHomeView | null;
    if (home) home.hass = hass;
  }

  private _updateDisplayCols(width: number): void {
    // Ignore pre-layout measurements (0px) — they incorrectly force 1-column mode.
    if (width < 50) return;

    const cols = displayColumnsForWidth(width, this._baseColumns);
    if (cols !== this._displayCols) {
      this._displayCols = cols;
    }
  }

  // --- Layout persistence (triggered by HA Done → dashboard YAML) --------

  /** Path to this grid inside `lovelace.config` for YAML writes. */
  private _resolveConfigPath(): number[] | undefined {
    const options = this.closest('hui-card-options') as
      | { path?: number[] }
      | null;
    if (options?.path?.length) return options.path;
    if (typeof this.index === 'number' && !this.closest('hui-card')) {
      return [this.index];
    }
    return undefined;
  }

  private _save = (): void => {
    void this._persistToDashboard();
    this._confirmRemoveId = undefined;
  };

  /** Draft Home floors/layout updates from the room grid editor. */
  private _onHomeConfigChanged = (
    ev: CustomEvent<{ floors: AuHomeFloorConfig[] }>,
  ): void => {
    ev.stopPropagation();
    if (!this._config || !ev.detail?.floors) return;
    this._config = { ...this._config, floors: ev.detail.floors };
  };

  private async _persistToDashboard(): Promise<void> {
    const cfg = this._config;
    const lovelace = this.lovelace;
    if (!cfg) return;

    if (!lovelace?.saveConfig) {
       
      console.warn(
        'AtriumUI Shell Grid: cannot save layout — no dashboard context (lovelace.saveConfig)',
      );
      return;
    }

    if (lovelace.mode === 'yaml') {
      lovelace.showToast?.({
        message:
          'AtriumUI: switch dashboard to storage mode to save layout edits',
        duration: 5000,
      });
      return;
    }

    const path = this._resolveConfigPath();
    if (!path) {
       
      console.warn(
        'AtriumUI Shell Grid: cannot save layout — config path unknown',
      );
      return;
    }

    const gridConfig = isShellHomeMode(cfg)
      ? buildPersistedHomeConfig(cfg, cfg.floors ?? [])
      : buildPersistedGridConfig(cfg, this._items, this._contentOverrides);
    const dashboard = lovelace.config as Record<string, unknown> | undefined;
    if (!dashboard) return;

    const next = applyGridToLovelaceConfig(dashboard, path, gridConfig);
    try {
      await lovelace.saveConfig(next);
      this._removedIds.clear();
      this._contentOverrides.clear();
    } catch (err) {
       
      console.error('AtriumUI Shell Grid: failed to save layout', err);
      lovelace.showToast?.({
        message: 'AtriumUI: failed to save grid layout',
        duration: 4000,
      });
    }
  };

  // --- Drag -------------------------------------------------------------

  private _metrics(): { cellW: number; rowH: number; gap: number } {
    const cols = this._baseColumns;
    const rect = this._gridEl?.getBoundingClientRect();
    const width = rect?.width ?? this.clientWidth;

    let gap = 0;
    let rowH = parseFloat(DEFAULT_ROW_HEIGHT) || 80;
    if (this._gridEl) {
      const cs = getComputedStyle(this._gridEl);
      gap = parseFloat(cs.rowGap || cs.gap || '0') || 0;
      if (this._distributeRowsActive() && this._config) {
        const rowCount = resolveRowTrackCount(this._config, this._items);
        const gridHeight = rect?.height ?? 0;
        if (gridHeight > 0 && rowCount > 0) {
          rowH = (gridHeight - gap * (rowCount - 1)) / rowCount;
        } else {
          rowH =
            parseFloat(
              cs.getPropertyValue('--au-grid-row-height').trim().replace(/px$/, ''),
            ) || rowH;
        }
      } else {
        rowH =
          parseFloat(cs.gridAutoRows || '0') ||
          parseFloat(String(this._config?.row_height ?? DEFAULT_ROW_HEIGHT)) ||
          80;
      }
    } else {
      gap = parseFloat(String(this._config?.gap ?? '12')) || 12;
      rowH =
        parseFloat(String(this._config?.row_height ?? DEFAULT_ROW_HEIGHT)) || 80;
    }

    const cellW = cols > 0 ? (width - gap * (cols - 1)) / cols : width;
    return { cellW, rowH, gap };
  }

  private _onDragStart = (ev: PointerEvent, id: string): void => {
    if (!this._layoutEditingVisible) return;
    ev.preventDefault();
    ev.stopPropagation();
    const item = this._items.find((i) => i.id === id);
    if (!item) return;
    const { cellW, rowH, gap } = this._metrics();
    this._drag = {
      id,
      startX: item.x,
      startY: item.y,
      pointerX: ev.clientX,
      pointerY: ev.clientY,
      cellW,
      rowH,
      gap,
    };
    this._confirmRemoveId = undefined;
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
  };

  private _onDragMove = (ev: PointerEvent): void => {
    const d = this._drag;
    if (!d) return;
    const dCols = Math.round((ev.clientX - d.pointerX) / (d.cellW + d.gap));
    const dRows = Math.round((ev.clientY - d.pointerY) / (d.rowH + d.gap));
    this._items = moveItem(
      this._items,
      d.id,
      d.startX + dCols,
      d.startY + dRows,
      this._baseColumns,
    );
  };

  private _onDragEnd = (ev: PointerEvent): void => {
    if (!this._drag) return;
    (ev.currentTarget as HTMLElement).releasePointerCapture?.(ev.pointerId);
    this._drag = undefined;
  };

  // --- Resize -----------------------------------------------------------

  private _onResizeStart = (ev: PointerEvent, id: string): void => {
    if (!this._layoutEditingVisible) return;
    ev.preventDefault();
    ev.stopPropagation();
    const item = this._items.find((i) => i.id === id);
    if (!item) return;
    const { cellW, rowH, gap } = this._metrics();
    this._resize = {
      id,
      startX: item.w,
      startY: item.h,
      pointerX: ev.clientX,
      pointerY: ev.clientY,
      cellW,
      rowH,
      gap,
    };
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
  };

  private _onResizeMove = (ev: PointerEvent): void => {
    const r = this._resize;
    if (!r) return;
    const dCols = Math.round((ev.clientX - r.pointerX) / (r.cellW + r.gap));
    const dRows = Math.round((ev.clientY - r.pointerY) / (r.rowH + r.gap));
    this._items = resizeItem(
      this._items,
      r.id,
      r.startX + dCols,
      r.startY + dRows,
      this._baseColumns,
    );
  };

  private _onResizeEnd = (ev: PointerEvent): void => {
    if (!this._resize) return;
    (ev.currentTarget as HTMLElement).releasePointerCapture?.(ev.pointerId);
    this._resize = undefined;
  };

  // --- Remove -----------------------------------------------------------

  private _onRemove = (id: string): void => {
    if (this._confirmRemoveId !== id) {
      this._confirmRemoveId = id;
      return;
    }
    this._confirmRemoveId = undefined;
    this._removedIds.add(id);
    this._elements.delete(id);
    this._elementKey.delete(id);
    this._contentOverrides.delete(id);
    this._items = this._items.filter((i) => i.id !== id);
  };

  // --- Content edit -----------------------------------------------------

  private _openContentEdit(id: string): void {
    const item = this._items.find((i) => i.id === id);
    if (!item) return;
    const tag = item.config.type.replace(/^custom:/, '');
    const ctor = customElements.get(tag) as
      | { getConfigElement?: () => LovelaceCardEditor }
      | undefined;
    if (!ctor?.getConfigElement) {
       
      console.info(`AtriumUI Shell Grid: "${tag}" has no visual editor`);
      return;
    }
    const editor = ctor.getConfigElement();
    editor.hass = this.hass;
    editor.setConfig(item.config);
    editor.addEventListener('config-changed', (ev: Event) => {
      const detail = (ev as CustomEvent<{ config: LovelaceCardConfig }>).detail;
      void this._applyContentEdit(id, detail.config);
    });
    this._contentEditor = editor;
    this._contentEditId = id;
  }

  private async _applyContentEdit(
    id: string,
    config: LovelaceCardConfig,
  ): Promise<void> {
    this._contentOverrides.set(id, config);
    const el = await createChildCard(config);
    if (this.hass) el.hass = this.hass;
    this._elements.set(id, el);
    this._elementKey.set(id, JSON.stringify(config));
    this._items = this._items.map((it) =>
      it.id === id ? { ...it, config } : it,
    );
  }

  private _closeContentEdit = (): void => {
    this._contentEditId = undefined;
    this._contentEditor = undefined;
  };

  // --- Add card ---------------------------------------------------------

  private _openAddCard = (): void => {
    if (!this._layoutEditingVisible) return;
    this._closeContentEdit();
    this._confirmRemoveId = undefined;
    this._addCardOpen = true;
    this._cardPickerReady = Boolean(customElements.get('hui-card-picker'));
    this._cardPickerLoading = !this._cardPickerReady;
    void this._prepareCardPicker();
  };

  private _closeAddCard = (): void => {
    this._addCardOpen = false;
    this._cardPickerLoading = false;
  };

  private async _prepareCardPicker(): Promise<void> {
    const ready = await ensureCardPickerLoaded();
    if (!this._addCardOpen) return;
    this._cardPickerReady = ready;
    this._cardPickerLoading = false;
  }

  private _pickFallbackCard = (type: string): void => {
    void this._onCardPicked(stubConfigForCardType(type, this.hass));
  };

  private _handleCardPicked = (ev: Event): void => {
    ev.stopPropagation();
    const detail = (ev as CustomEvent<{ config: LovelaceCardConfig }>).detail;
    if (!detail?.config) return;
    void this._onCardPicked(detail.config);
  };

  private _nextItemId(preferred?: unknown): string {
    if (typeof preferred === 'string' && preferred.trim()) {
      const id = preferred.trim();
      if (!this._items.some((i) => i.id === id)) return id;
    }
    let n = this._items.length;
    let id = `au-item-${n}`;
    while (this._items.some((i) => i.id === id)) {
      n += 1;
      id = `au-item-${n}`;
    }
    return id;
  }

  /** Place a picked card into the next free slot (persisted on Done). */
  private async _onCardPicked(config: LovelaceCardConfig): Promise<void> {
    const id = this._nextItemId(
      (config as LovelaceCardConfig & { id?: string }).id,
    );
    const w = this._defaultWidth();
    const h = DEFAULT_HEIGHT_UNITS;
    const slot = findFreeSlot(this._items, w, h, this._baseColumns);
    const cardConfig: LovelaceCardConfig = { ...config, id };

    const el = await createChildCard(cardConfig);
    if (this.hass) el.hass = this.hass;
    this._elements.set(id, el);
    this._elementKey.set(id, JSON.stringify(cardConfig));

    this._items = [
      ...this._items,
      {
        id,
        x: slot.x,
        y: slot.y,
        w,
        h,
        config: cardConfig,
      },
    ];
    this._confirmRemoveId = undefined;
    this._addCardOpen = false;
  }

  public override getCardSize(): number {
    return Math.max(1, gridRowCount(this._items));
  }

  // --- Render -----------------------------------------------------------

  private _renderCell(item: GridItem, editing: boolean): TemplateResult {
    const el = this._elements.get(item.id);
    const style = {
      'grid-column': `${item.x + 1} / span ${item.w}`,
      'grid-row': `${item.y + 1} / span ${item.h}`,
    };
    return html`
      <div class="cell" style=${styleMap(style)}>
        ${editing
          ? html`
              <div
                class="handle drag-handle"
                title="Drag"
                @pointerdown=${(e: PointerEvent) => this._onDragStart(e, item.id)}
                @pointermove=${this._onDragMove}
                @pointerup=${this._onDragEnd}
                @pointercancel=${this._onDragEnd}
              >
                <ha-icon icon="mdi:drag"></ha-icon>
              </div>
              <button
                class="handle remove-btn"
                title=${this._confirmRemoveId === item.id
                  ? 'Confirm delete'
                  : 'Delete'}
                @click=${() => this._onRemove(item.id)}
              >
                <ha-icon
                  icon=${this._confirmRemoveId === item.id
                    ? 'mdi:check'
                    : 'mdi:delete'}
                ></ha-icon>
              </button>
            `
          : nothing}
        <div class="cell-content">${el ?? nothing}</div>
        ${editing
          ? html`
              <div
                class="edit-cover"
                title="Edit content"
                @click=${() => this._openContentEdit(item.id)}
              ></div>
              <div
                class="handle resize-handle"
                title="Resize"
                @pointerdown=${(e: PointerEvent) =>
                  this._onResizeStart(e, item.id)}
                @pointermove=${this._onResizeMove}
                @pointerup=${this._onResizeEnd}
                @pointercancel=${this._onResizeEnd}
              ></div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderContentModal(): TemplateResult {
    return html`
      <div class="modal-backdrop" @click=${this._closeContentEdit}></div>
      <div class="modal" role="dialog" aria-modal="true" aria-label="Edit card">
        <div class="modal-header">
          <span>Edit card</span>
          <span class="spacer"></span>
          <ha-icon-button .label=${'Close'} @click=${this._closeContentEdit}>
            <ha-icon icon="mdi:close"></ha-icon>
          </ha-icon-button>
        </div>
        <div class="modal-body">${this._contentEditor ?? nothing}</div>
      </div>
    `;
  }

  private _pickerLovelace(): unknown {
    const live = this.lovelace ?? this._findClosestLovelace();
    if (!live) return undefined;
    // Editors receive LovelaceConfig; live views inject the Lovelace object.
    return (live as { config?: unknown }).config ?? live;
  }

  private _renderAddCardModal(): TemplateResult {
    const fallback = fallbackCustomCardEntries();

    return html`
      <div class="modal-backdrop" @click=${this._closeAddCard}></div>
      <div class="modal" role="dialog" aria-modal="true" aria-label="Add card">
        <div class="modal-header">
          <span>Add card</span>
          <span class="spacer"></span>
          <ha-icon-button .label=${'Close'} @click=${this._closeAddCard}>
            <ha-icon icon="mdi:close"></ha-icon>
          </ha-icon-button>
        </div>
        <div class="modal-body">
          ${this._cardPickerLoading
            ? html`<div class="picker-status">Loading card picker…</div>`
            : nothing}
          ${this._cardPickerReady
            ? html`<hui-card-picker
                .hass=${this.hass}
                .lovelace=${this._pickerLovelace()}
                @config-changed=${this._handleCardPicked}
              ></hui-card-picker>`
            : nothing}
          ${!this._cardPickerLoading && !this._cardPickerReady
            ? html`
                <div class="picker-status">
                  Native picker unavailable — choose a registered card:
                </div>
                <div class="fallback-list">
                  ${fallback.length === 0
                    ? html`<div class="picker-status">No custom cards registered.</div>`
                    : fallback.map(
                        (card) => html`
                          <button
                            type="button"
                            class="fallback-item"
                            @click=${() => this._pickFallbackCard(card.type)}
                          >
                            <span class="name">${card.name}</span>
                            ${card.description
                              ? html`<span class="desc">${card.description}</span>`
                              : nothing}
                          </button>
                        `,
                      )}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;

    // Home (floors/rooms) is the product path. The classic free-form card grid
    // below is compat-only (no floors + legacy `cards[]`) — do not add features.
    if (isShellHomeMode(this._config)) {
      return html`
        <div
          class="shell home-mode"
          style=${styleMap({
            width: this._config.width?.trim() || DEFAULT_GRID_WIDTH,
            height: this._config.height?.trim() || DEFAULT_GRID_HEIGHT,
          })}
        >
          <au-shell-home-view
            .hass=${this.hass}
            .config=${this._config}
            .layoutEditing=${
              this._layoutEditingVisible && this._config.editable !== false
            }
            @home-config-changed=${this._onHomeConfigChanged}
          ></au-shell-home-view>
        </div>
      `;
    }

    const layoutEditing = this._layoutEditingVisible;
    const cols = layoutEditing ? this._baseColumns : this._displayCols;
    const items = layoutEditing
      ? this._items
      : deriveResponsiveLayout(this._items, this._baseColumns, cols);
    const gap = this._config.gap ?? 'var(--au-gap)';
    const heightExplicit = Boolean(this._config.height?.trim());
    const distributeRequested = shouldDistributeRowHeight(
      heightExplicit ? this._config.height : undefined,
      this._config.rows,
    );
    const rowCount = resolveRowTrackCount(this._config, this._items);
    const distributeActive = distributeRequested && this._shellHeightPx > 0;
    let rowHeight = this._config.row_height ?? DEFAULT_ROW_HEIGHT;
    if (distributeActive) {
      const trackHeightPx = computeRowTrackHeightPx(
        this._shellHeightPx,
        rowCount,
        this._gapPx(),
      );
      if (trackHeightPx > 0) {
        rowHeight = `${trackHeightPx}px`;
      }
    }

    return html`
      ${items.length === 0
        ? html`<div class="empty">No cards configured.</div>`
        : nothing}
      <div
        class="shell ${classMap({ 'distribute-rows': distributeActive })}"
        style=${styleMap({
          width: this._config.width?.trim() || DEFAULT_GRID_WIDTH,
          height: this._config.height?.trim() || DEFAULT_GRID_HEIGHT,
        })}
      >
        <div
          class="grid ${classMap({
            editing: layoutEditing,
            'distribute-rows': distributeActive,
          })}"
          style=${styleMap({
            '--grid-columns': String(cols),
            '--grid-rows': String(rowCount),
            '--au-grid-row-height': rowHeight,
            '--grid-gap': gap,
            gap,
          })}
        >
          ${repeat(
            items,
            (it) => it.id,
            (it) => this._renderCell(it, layoutEditing),
          )}
        </div>
        ${layoutEditing
          ? html`
              <button
                type="button"
                class="add-fab"
                title="Add card"
                aria-label="Add card"
                @click=${this._openAddCard}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            `
          : nothing}
      </div>
      ${this._contentEditId ? this._renderContentModal() : nothing}
      ${this._addCardOpen ? this._renderAddCardModal() : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-shell-grid': AuShellGrid;
  }
}

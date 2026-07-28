import {
  LitElement,
  html,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import {
  customElement,
  property,
  query,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { hasEntityChanged } from '../../core/base-card';
import { auHomeTokens } from '../../theme/home-style';
import { homeViewStyles } from './home-view-styles';
import {
  discoverFloorsFromAreas,
  findRoom,
  mergeAreaEntities,
  normalizeFloors,
} from '../../utils/areas';
import { bulkTurnOff } from '../../utils/bulk-action';
import { resolveDeviceDisplayName } from '../../utils/device';
import { normalizeAuHomeCardConfig } from '../../utils/home-card-type';
import { buildPresenceItems } from '../../utils/presence';
import { auDebug } from '../../utils/debug';
import { fireEvent } from '../../utils/fire-event';
import { formatToolbarClock } from '../../utils/format-clock';
import { formatGreeting } from '../../utils/format-greeting';
import { isRtlLanguage, localize } from '../../localize/localize';
import type { AuShellGridConfig } from '../../types/config';
import type {
  AuHomeCardConfig,
  AuHomeEntityConfig,
  AuHomeFloorConfig,
  AuHomeRoomConfig,
  AuHomeRoomControlsConfig,
} from '../../types/home';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../../types/home-assistant';
import {
  cardTypeHasEditor,
  ensureCardPickerLoaded,
  getCardEditorElement,
  stubConfigForCardType,
} from './create-child-card';
import {
  applyHomeItemMove,
  applyHomeItemResize,
  applyRoomItemMove,
  applyRoomItemResize,
  beginPointerDrag,
  beginPointerResize,
  computeGridMetrics,
  homeGridStyleVars,
  placementStyle,
} from './home-drag-resize';
import {
  commitHomeEditToFloors,
  commitRoomEditToFloors,
} from './home-edit-commit';
import {
  beginHomeEditDraft,
  beginRoomEditDraft,
  emptyEditSessionDraft,
} from './home-edit-session';
import {
  buildRoomTileCardConfig,
  childConfigForEntity,
  homeAwareCardConfig,
} from './home-child-config';
import {
  attachChildToHost,
  mountChildCard,
  pruneChildCards,
} from './home-child-host';
import {
  addEditRoomMember,
  buildEditRoomDraft,
  controlsFromEditDraft,
  moveEditRoomMember,
  renderEditRoomModal,
  roomEntitiesFromEditDraft,
  toggleEditRoomEntity,
  type EditRoomDraft,
} from './home-edit-room-modal';
import {
  buildHomeFloorGridItems,
  buildRoomGridItems,
} from './home-grid-items';
import {
  DEFAULT_HEIGHT_UNITS,
  DEFAULT_ROW_HEIGHT_PX,
  type EditScope,
  type HomeGridItem,
  type PointerDragState,
  type RoomEditItem,
} from './home-grid-types';
import {
  renderAddCardModal,
  renderAddEntityModal,
  renderAddRoomModal,
  renderCardEditorModal,
  renderHomeAddChooser,
} from './home-picker-modals';
import {
  collectRoomToggleEntities,
  controlIcon,
  entityIsOn,
  isToggleDomain,
  resolveRoomControls,
  roomControlEntities,
} from './room-controls';
import {
  displayColumnsForWidth,
  findFreeSlot,
  shouldDistributeRowHeight,
  type GridItemLike,
} from './grid-engine';
import '../../card/room-card/au-room-card';

type CardEditorMode = 'add' | 'edit';
type NavView = { kind: 'home' } | { kind: 'room'; roomId: string };

/**
 * Internal Home → Rooms view hosted by `au-shell-grid` (not a Lovelace card).
 */
@customElement('au-shell-home-view')
export class AuShellHomeView extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AuShellGridConfig;
  /** Desktop dashboard edit mode from parent shell-grid. */
  @property({ type: Boolean }) public layoutEditing = false;

  @state() private _view: NavView = { kind: 'home' };
  @state() private _expandedRooms = new Set<string>();
  @state() private _confirmBulk = false;
  @state() private _editItems: RoomEditItem[] = [];
  @state() private _homeEditItems: HomeGridItem[] = [];
  @state() private _confirmRemoveId?: string;
  @state() private _addEntityOpen = false;
  @state() private _addCardOpen = false;
  @state() private _cardPickerReady = false;
  @state() private _cardPickerLoading = false;
  @state() private _addRoomOpen = false;
  @state() private _homeAddChooserOpen = false;
  @state() private _pickerEntity = '';
  @state() private _entitySearchQuery = '';
  @state() private _newRoomName = '';
  @state() private _editRoomDraft: EditRoomDraft | null = null;
  @state() private _editRoomAddQuery = '';
  @state() private _cardEditorMode: CardEditorMode | null = null;
  @state() private _cardEditorId?: string;
  @state() private _cardEditorKind?: 'card' | 'entity';
  @state() private _cardEditorDraft?: LovelaceCardConfig;
  @state() private _cardEditorEl?: LovelaceCardEditor;

  @query('.au-edit-grid') private _editGridEl?: HTMLElement;

  private _childCards = new Map<string, LovelaceCard>();
  private _childConfigJson = new Map<string, string>();
  private _drag?: PointerDragState;
  private _resize?: PointerDragState;
  private _editScope: EditScope = 'none';
  private _editRoomId?: string;

  static override styles = [
    auHomeTokens,
    homeViewStyles,
  ];

  /** Prefer desktop until ResizeObserver reports a real width. */
  @state() private _hostWidth = 1280;
  /** Host/content height for equal row-track distribution (`rows`). */
  @state() private _shellHeightPx = 0;
  /** Wall clock for toolbar time display. */
  @state() private _clockNow = Date.now();
  private _clockInterval?: ReturnType<typeof setInterval>;
  private _roomIdleTimer?: ReturnType<typeof setTimeout>;

  private static readonly _idleActivityEvents = [
    'pointerdown',
    'touchstart',
    'keydown',
    'wheel',
  ] as const;

  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (
      changed.has('config') ||
      changed.has('layoutEditing') ||
      changed.has('_view') ||
      changed.has('_expandedRooms') ||
      changed.has('_confirmBulk') ||
      changed.has('_hostWidth') ||
      changed.has('_shellHeightPx') ||
      changed.has('_clockNow') ||
      changed.has('_editItems') ||
      changed.has('_homeEditItems') ||
      changed.has('_confirmRemoveId') ||
      changed.has('_addEntityOpen') ||
      changed.has('_addCardOpen') ||
      changed.has('_cardPickerReady') ||
      changed.has('_cardPickerLoading') ||
      changed.has('_addRoomOpen') ||
      changed.has('_homeAddChooserOpen') ||
      changed.has('_pickerEntity') ||
      changed.has('_entitySearchQuery') ||
      changed.has('_editRoomAddQuery') ||
      changed.has('_newRoomName') ||
      changed.has('_editRoomDraft') ||
      changed.has('_cardEditorMode') ||
      changed.has('_cardEditorDraft') ||
      changed.has('_cardEditorEl')
    ) {
      return true;
    }
    if (!changed.has('hass')) return true;

    const prev = changed.get('hass') as HomeAssistant | undefined;
    if (!prev || !this.hass) return true;

    // Child cards are mounted imperatively — always push hass even if this
    // host skips a paint (same pattern as au-shell-grid → home-view).
    this._forwardHassToChildren();

    const ids = this._watchedEntities();
    if (ids.length === 0) return Boolean(this.config?.auto_areas);
    return ids.some((id) => hasEntityChanged(prev, this.hass, id));
  }

  /** Push the latest hass into imperatively mounted room/floor child cards. */
  private _forwardHassToChildren(): void {
    const hass = this.hass;
    if (!hass) return;
    for (const el of this._childCards.values()) {
      el.hass = hass;
    }
  }

  private _watchedEntities(): string[] {
    if (!this.config) return [];
    const ids = new Set<string>(this.config.presence ?? []);
    for (const floor of this._resolvedFloors()) {
      for (const ent of floor.entities ?? []) {
        if (!ent.hide && ent.entity) ids.add(ent.entity);
      }
      for (const room of floor.rooms) {
        for (const ent of this._roomEntities(room)) {
          ids.add(ent.entity);
        }
        // Cards placed on the room grid (lights, climate, …) must be watched
        // or their tiles stay stale when state changes outside this UI.
        for (const entry of room.cards ?? []) {
          const entity = entry.card?.entity;
          if (typeof entity === 'string' && entity.trim()) {
            ids.add(entity.trim());
          }
        }
      }
    }
    for (const id of this.config.scenes ?? []) ids.add(id);
    for (const id of this.config.scripts ?? []) ids.add(id);
    for (const group of this.config.multi_entity ?? []) {
      for (const id of group.entities) ids.add(id);
    }
    return [...ids];
  }

  private _resizeObserver?: ResizeObserver;

  public override connectedCallback(): void {
    super.connectedCallback();
    this._clockNow = Date.now();
    this._clockInterval = setInterval(() => {
      this._clockNow = Date.now();
    }, 1000);
    for (const type of AuShellHomeView._idleActivityEvents) {
      this.addEventListener(type, this._onRoomActivity, { passive: true });
    }
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect) return;
        const w = rect.width ?? 0;
        const h = rect.height ?? 0;
        if (w >= 50 && Math.round(w) !== this._hostWidth) {
          this._hostWidth = Math.round(w);
        }
        if (h > 0 && Math.abs(h - this._shellHeightPx) > 0.5) {
          this._shellHeightPx = h;
        }
      });
      this._resizeObserver.observe(this);
    }
  }

  public override disconnectedCallback(): void {
    if (this._clockInterval !== undefined) {
      clearInterval(this._clockInterval);
      this._clockInterval = undefined;
    }
    this._clearRoomIdleTimer();
    for (const type of AuShellHomeView._idleActivityEvents) {
      this.removeEventListener(type, this._onRoomActivity);
    }
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    this._childCards.clear();
    this._childConfigJson.clear();
    super.disconnectedCallback();
  }

  private get _distributeRowsRequested(): boolean {
    const heightExplicit = Boolean(this.config?.height?.trim());
    return shouldDistributeRowHeight(
      heightExplicit ? this.config?.height : undefined,
      this.config?.rows,
    );
  }

  private get _distributeRowsActive(): boolean {
    return this._distributeRowsRequested && this._shellHeightPx > 0;
  }

  private _gapPx(): number {
    const parsed = parseFloat(String(this.config?.gap ?? '12'));
    return Number.isFinite(parsed) ? parsed : 12;
  }

  /** Available height for the active grid (shell minus toolbar/chrome). */
  private _gridAreaHeightPx(): number {
    const body = this.renderRoot?.querySelector('.room-body') as HTMLElement | null;
    const bodyH = body?.getBoundingClientRect().height ?? 0;
    if (bodyH > 40) return bodyH;
    // Fallback: host height minus toolbar + home padding.
    const chrome = this._view.kind === 'home' ? 120 : 72;
    return Math.max(0, this._shellHeightPx - chrome);
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (
      changed.has('layoutEditing') ||
      changed.has('_view') ||
      changed.has('config')
    ) {
      this._syncEditSession();
      this._armRoomIdleTimer();
    }
    this._syncEntityChildCards();
    this._attachCardEditorEl();
  }

  /** Mount the live editor node into the modal host (Lit node bindings are unreliable). */
  private _attachCardEditorEl(): void {
    const host = this.renderRoot?.querySelector(
      '.card-editor-host',
    ) as HTMLElement | null;
    if (!host) return;
    if (!this._cardEditorEl) {
      host.replaceChildren();
      return;
    }
    if (host.firstChild !== this._cardEditorEl) {
      host.replaceChildren(this._cardEditorEl);
    }
  }

  private get _baseColumns(): number {
    return this.config?.columns && this.config.columns >= 1
      ? this.config.columns
      : 12;
  }

  private get _displayColumns(): number {
    if (this.layoutEditing) return this._baseColumns;
    // Ignore pre-layout measurements so we don't force mobile stacking.
    if (this._hostWidth < 50) return this._baseColumns;
    return displayColumnsForWidth(this._hostWidth, this._baseColumns);
  }

  private get _defaultWidth(): number {
    const base = this._baseColumns;
    return Math.max(1, Math.min(base, Math.round(base / 3)));
  }

  private get _homeEditing(): boolean {
    return this.layoutEditing && this._view.kind === 'home';
  }

  private get _roomEditing(): boolean {
    return this.layoutEditing && this._view.kind === 'room';
  }

  private get _gridEditing(): boolean {
    return this._homeEditing || this._roomEditing;
  }

  private _clearEditSession(): void {
    const cleared = emptyEditSessionDraft();
    this._editScope = cleared.editScope;
    this._editItems = cleared.editItems;
    this._homeEditItems = cleared.homeEditItems;
    this._editRoomId = cleared.editRoomId;
    this._drag = undefined;
    this._resize = undefined;
    this._confirmRemoveId = undefined;
    this._addEntityOpen = false;
    this._addCardOpen = false;
    this._cardPickerReady = false;
    this._cardPickerLoading = false;
    this._addRoomOpen = false;
    this._homeAddChooserOpen = false;
    this._pickerEntity = '';
    this._entitySearchQuery = '';
    this._newRoomName = '';
    this._editRoomDraft = null;
    this._closeCardEditor();
  }

  private _editLayoutOpts(useBaseColumns: boolean) {
    return {
      baseColumns: this._baseColumns,
      defaultWidth: this._defaultWidth,
      displayColumns: this._displayColumns,
      useBaseColumns,
    };
  }

  /**
   * Start/stop Home overview or in-room layout edit sessions.
   * Enter = clone draft only; commit only via drag/resize/add/save paths.
   * Exit (`layoutEditing` false) clears the session without committing.
   */
  private _syncEditSession(): void {
    if (!this.layoutEditing) {
      this._clearEditSession();
      return;
    }

    if (this._view.kind === 'home') {
      if (this._editScope === 'home') return;
      const draft = beginHomeEditDraft(
        this._resolvedFloors(),
        this._editLayoutOpts(true),
      );
      this._editScope = draft.editScope;
      this._editRoomId = draft.editRoomId;
      this._editItems = draft.editItems;
      this._homeEditItems = draft.homeEditItems;
      this._addEntityOpen = false;
      return;
    }

    const roomId = this._view.roomId;
    if (this._editScope === 'room' && this._editRoomId === roomId) return;
    const draft = beginRoomEditDraft(
      this._resolvedFloors(),
      roomId,
      (room) => this._roomEntities(room),
      this._editLayoutOpts(true),
    );
    this._editScope = draft.editScope;
    this._editRoomId = draft.editRoomId;
    this._homeEditItems = draft.homeEditItems;
    this._editItems = draft.editItems;
    this._addRoomOpen = false;
  }

  private _gridStyleVars(items: GridItemLike[] = []): Record<string, string> {
    return homeGridStyleVars({
      gap: this.config?.gap?.trim() || '12px',
      rowsConfig: this.config,
      items,
      displayColumns: this._displayColumns,
      distributeRows: this._distributeRowsActive,
      gridAreaHeightPx: this._gridAreaHeightPx(),
      gapPx: this._gapPx(),
      rowHeightFallback: this.config?.row_height?.trim() || '80px',
    });
  }

  /** Resolve entity + arbitrary card placements inside a room. */
  private _roomGridItems(room: AuHomeRoomConfig, forEdit = false): RoomEditItem[] {
    return buildRoomGridItems(room, this._roomEntities(room), {
      ...this._editLayoutOpts(forEdit || this._roomEditing),
    });
  }

  /** Resolve room + entity + card placements on a floor’s Home grid. */
  private _homeFloorGridItems(
    floor: AuHomeFloorConfig,
    forEdit = false,
  ): HomeGridItem[] {
    return buildHomeFloorGridItems(floor, {
      ...this._editLayoutOpts(forEdit || this._homeEditing),
    });
  }

  /** Resolve entity config for a host on Home or inside a room. */
  private _findEntityConfig(entityId: string): AuHomeEntityConfig | undefined {
    const floors = this._resolvedFloors();
    if (this._view.kind === 'room') {
      const found = findRoom(floors, this._view.roomId);
      return found
        ? this._roomEntities(found.room).find((e) => e.entity === entityId)
        : undefined;
    }
    for (const floor of floors) {
      const onFloor = (floor.entities ?? []).find(
        (e) => !e.hide && e.entity === entityId,
      );
      if (onFloor) return onFloor;
    }
    // Edit-session draft may be ahead of config.
    const draft = this._homeEditItems.find(
      (i) => i.kind === 'entity' && i.id === entityId,
    );
    return draft?.kind === 'entity' ? draft.entity : undefined;
  }

  private _emitFloorsUpdate(floors: AuHomeFloorConfig[]): void {
    fireEvent(this, 'home-config-changed', { floors });
  }

  /** Persist in-room entity + card placements. */
  private _commitRoomEditToFloors(): void {
    if (this._view.kind !== 'room' || !this.config) return;
    const next = commitRoomEditToFloors(
      this._resolvedFloors(),
      this._view.roomId,
      this._editItems,
    );
    if (next) this._emitFloorsUpdate(next);
  }

  /** Persist Home overview room + standalone entity placements. */
  private _commitHomeEditToFloors(): void {
    if (!this.config) return;
    this._emitFloorsUpdate(
      commitHomeEditToFloors(this._resolvedFloors(), this._homeEditItems),
    );
  }

  private _commitActiveEdit(): void {
    if (this._editScope === 'home') this._commitHomeEditToFloors();
    else if (this._editScope === 'room') this._commitRoomEditToFloors();
  }

  private _activeEditItems(): GridItemLike[] {
    return this._editScope === 'home' ? this._homeEditItems : this._editItems;
  }

  private _metrics(): { cellW: number; rowH: number; gap: number } {
    const el =
      this._editGridEl ??
      (this.renderRoot?.querySelector('.au-edit-grid') as HTMLElement | null);
    const rect = el?.getBoundingClientRect();
    const width = rect?.width || this.clientWidth || 1200;
    let computed: {
      rowGap?: string;
      gap?: string;
      rowHeightCssVar?: string;
      gridAutoRows?: string;
    } | null = null;
    if (el) {
      const cs = getComputedStyle(el);
      computed = {
        rowGap: cs.rowGap,
        gap: cs.gap,
        rowHeightCssVar: cs.getPropertyValue('--home-grid-row-height'),
        gridAutoRows: cs.gridAutoRows,
      };
    }
    return computeGridMetrics({
      columns: this._baseColumns,
      gridWidth: width,
      computed,
      gapFallback: this.config?.gap ?? '12',
      rowHeightFallback: this.config?.row_height ?? DEFAULT_ROW_HEIGHT_PX,
    });
  }

  private _onDragStart = (ev: PointerEvent, id: string): void => {
    if (!this._gridEditing) return;
    ev.preventDefault();
    ev.stopPropagation();
    const item = this._activeEditItems().find((i) => i.id === id);
    if (!item) return;
    this._drag = beginPointerDrag(item, ev.clientX, ev.clientY, this._metrics());
    this._confirmRemoveId = undefined;
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
  };

  private _onDragMove = (ev: PointerEvent): void => {
    const d = this._drag;
    if (!d) return;
    if (this._editScope === 'home') {
      this._homeEditItems = applyHomeItemMove(
        this._homeEditItems,
        d,
        ev.clientX,
        ev.clientY,
        this._baseColumns,
      );
      return;
    }
    this._editItems = applyRoomItemMove(
      this._editItems,
      d,
      ev.clientX,
      ev.clientY,
      this._baseColumns,
    );
  };

  private _onDragEnd = (ev: PointerEvent): void => {
    if (!this._drag) return;
    (ev.currentTarget as HTMLElement).releasePointerCapture?.(ev.pointerId);
    this._drag = undefined;
    this._commitActiveEdit();
  };

  private _onResizeStart = (ev: PointerEvent, id: string): void => {
    if (!this._gridEditing) return;
    ev.preventDefault();
    ev.stopPropagation();
    const item = this._activeEditItems().find((i) => i.id === id);
    if (!item) return;
    this._resize = beginPointerResize(
      item,
      ev.clientX,
      ev.clientY,
      this._metrics(),
    );
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
  };

  private _onResizeMove = (ev: PointerEvent): void => {
    const r = this._resize;
    if (!r) return;
    if (this._editScope === 'home') {
      this._homeEditItems = applyHomeItemResize(
        this._homeEditItems,
        r,
        ev.clientX,
        ev.clientY,
        this._baseColumns,
      );
      return;
    }
    this._editItems = applyRoomItemResize(
      this._editItems,
      r,
      ev.clientX,
      ev.clientY,
      this._baseColumns,
    );
  };

  private _onResizeEnd = (ev: PointerEvent): void => {
    if (!this._resize) return;
    (ev.currentTarget as HTMLElement).releasePointerCapture?.(ev.pointerId);
    this._resize = undefined;
    this._commitActiveEdit();
  };

  private _onRemove = (id: string): void => {
    if (this._confirmRemoveId !== id) {
      this._confirmRemoveId = id;
      return;
    }
    this._confirmRemoveId = undefined;
    if (this._editScope === 'home') {
      const removed = this._homeEditItems.find((i) => i.id === id);
      this._homeEditItems = this._homeEditItems.filter((i) => i.id !== id);
      if (removed?.kind === 'entity' || removed?.kind === 'card') {
        this._childCards.delete(id);
        this._childConfigJson.delete(id);
      }
      if (removed?.kind === 'room') {
        this._childCards.delete(`room-tile:${id}`);
        this._childConfigJson.delete(`room-tile:${id}`);
      }
      this._commitHomeEditToFloors();
      return;
    }
    this._editItems = this._editItems.filter((i) => i.id !== id);
    this._childCards.delete(id);
    this._childConfigJson.delete(id);
    this._commitRoomEditToFloors();
  };

  private _openHomeAddChooser = (): void => {
    if (!this._homeEditing) return;
    this._homeAddChooserOpen = true;
  };

  private _closeHomeAddChooser = (): void => {
    this._homeAddChooserOpen = false;
  };

  /** Home overview: searchable entity list. Room: full HA card picker. */
  private _openAddEntity = (): void => {
    if (this._roomEditing) {
      this._openAddCard();
      return;
    }
    if (!this._homeEditing) return;
    this._homeAddChooserOpen = false;
    this._pickerEntity = '';
    this._entitySearchQuery = '';
    this._addEntityOpen = true;
  };

  private _closeAddEntity = (): void => {
    this._addEntityOpen = false;
    this._pickerEntity = '';
    this._entitySearchQuery = '';
  };

  /** All entities known to HA for the floor Add-entity picker. */
  private _entitySelectOptions(): Array<{
    id: string;
    name: string;
    label: string;
  }> {
    const states = this.hass?.states ?? {};
    return Object.keys(states)
      .sort((a, b) => {
        const an = String(states[a]?.attributes?.friendly_name ?? a);
        const bn = String(states[b]?.attributes?.friendly_name ?? b);
        return an.localeCompare(bn) || a.localeCompare(b);
      })
      .map((id) => {
        const friendly = states[id]?.attributes?.friendly_name;
        const name =
          typeof friendly === 'string' && friendly.trim() ? friendly : id;
        return {
          id,
          name,
          label: name === id ? id : `${name} (${id})`,
        };
      });
  }

  private _filteredEntityOptions(): Array<{
    id: string;
    name: string;
    label: string;
  }> {
    const q = this._entitySearchQuery.trim().toLowerCase();
    const all = this._entitySelectOptions();
    if (!q) return all;
    return all.filter(
      (opt) =>
        opt.id.toLowerCase().includes(q) ||
        opt.name.toLowerCase().includes(q) ||
        opt.label.toLowerCase().includes(q),
    );
  }

  private _onEntitySearchInput = (ev: Event): void => {
    this._entitySearchQuery = (ev.target as HTMLInputElement).value;
  };

  private _selectEntityOption = (entityId: string): void => {
    this._pickerEntity = entityId;
  };

  private _openAddCard = (): void => {
    if (!this._roomEditing && !this._homeEditing) return;
    this._homeAddChooserOpen = false;
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
  };

  private _nextCardId(): string {
    const taken = new Set([
      ...this._editItems.map((i) => i.id),
      ...this._homeEditItems.map((i) => i.id),
    ]);
    let n = 0;
    let id = `au-card-${n}`;
    while (taken.has(id)) {
      n += 1;
      id = `au-card-${n}`;
    }
    return id;
  }

  private _onCardEditorConfigChanged = (ev: Event): void => {
    const detail = (ev as CustomEvent<{ config?: LovelaceCardConfig }>).detail;
    if (!detail?.config) return;
    this._cardEditorDraft = { ...detail.config };
  };

  private _closeCardEditor = (): void => {
    if (this._cardEditorEl) {
      this._cardEditorEl.removeEventListener(
        'config-changed',
        this._onCardEditorConfigChanged,
      );
    }
    this._cardEditorMode = null;
    this._cardEditorId = undefined;
    this._cardEditorKind = undefined;
    this._cardEditorDraft = undefined;
    this._cardEditorEl = undefined;
  };

  private async _mountCardEditor(
    mode: CardEditorMode,
    draft: LovelaceCardConfig,
    opts?: { id?: string; kind?: 'card' | 'entity' },
  ): Promise<boolean> {
    const editor = await getCardEditorElement(draft.type);
    if (!editor) return false;
    if (this.hass) editor.hass = this.hass;
    try {
      editor.setConfig(draft);
    } catch {
      /* editor may still render with partial config */
    }
    editor.addEventListener('config-changed', this._onCardEditorConfigChanged);
    this._cardEditorEl = editor;
    this._cardEditorMode = mode;
    this._cardEditorDraft = { ...draft };
    this._cardEditorId = opts?.id;
    this._cardEditorKind = opts?.kind;
    await this.updateComplete;
    return true;
  }

  private async _placeRoomCard(config: LovelaceCardConfig): Promise<void> {
    if (!this._roomEditing) return;
    const preferred = (config as LovelaceCardConfig & { id?: string }).id;
    const id =
      typeof preferred === 'string' && preferred.trim()
        ? preferred.trim()
        : this._nextCardId();
    if (this._editItems.some((i) => i.id === id)) return;
    const w = this._defaultWidth;
    const h = DEFAULT_HEIGHT_UNITS;
    const slot = findFreeSlot(this._editItems, w, h, this._baseColumns);
    const cardConfig = this._persistedCardConfig(config);
    const entry: AuHomeCardConfig = {
      id,
      card: cardConfig,
      layout: { x: slot.x, y: slot.y, w, h },
    };
    this._editItems = [
      ...this._editItems,
      {
        id,
        kind: 'card',
        x: slot.x,
        y: slot.y,
        w,
        h,
        card: entry,
      },
    ];
    try {
      await mountChildCard(
        this._childMaps(),
        id,
        this._homeAwareCardConfig(cardConfig),
        this.hass,
      );
    } catch {
      /* host sync will retry */
    }
    this._commitRoomEditToFloors();
  }

  private async _placeFloorCard(config: LovelaceCardConfig): Promise<void> {
    if (!this._homeEditing) return;
    let floors = this._resolvedFloors();
    if (floors.length === 0) {
      floors = [{ id: 'main', name: 'Main', rooms: [], entities: [], cards: [] }];
      this._emitFloorsUpdate(floors);
    }
    const floorId = floors[0]!.id || 'main';
    const preferred = (config as LovelaceCardConfig & { id?: string }).id;
    const id =
      typeof preferred === 'string' && preferred.trim()
        ? preferred.trim()
        : this._nextCardId();
    if (this._homeEditItems.some((i) => i.id === id)) return;
    const w = this._defaultWidth;
    const h = DEFAULT_HEIGHT_UNITS;
    const floorItems = this._homeEditItems.filter((i) => i.floorId === floorId);
    const slot = findFreeSlot(floorItems, w, h, this._baseColumns);
    const cardConfig = this._persistedCardConfig(config);
    const entry: AuHomeCardConfig = {
      id,
      card: cardConfig,
      layout: { x: slot.x, y: slot.y, w, h },
    };
    this._homeEditItems = [
      ...this._homeEditItems,
      {
        id,
        floorId,
        kind: 'card',
        x: slot.x,
        y: slot.y,
        w,
        h,
        card: entry,
      },
    ];
    try {
      await mountChildCard(
        this._childMaps(),
        id,
        this._homeAwareCardConfig(cardConfig),
        this.hass,
      );
    } catch {
      /* host sync will retry */
    }
    this._commitHomeEditToFloors();
  }

  private _entityFromEditorConfig(
    ent: AuHomeEntityConfig,
    config: LovelaceCardConfig,
  ): AuHomeEntityConfig {
    const entityId =
      typeof config.entity === 'string' && config.entity.trim()
        ? config.entity.trim().toLowerCase()
        : ent.entity;
    const name =
      typeof config.name === 'string' && config.name.trim()
        ? config.name.trim()
        : undefined;
    const icon =
      typeof config.icon === 'string' && config.icon.trim()
        ? config.icon.trim()
        : undefined;
    const skip = new Set(['type', 'entity', 'name', 'icon']);
    const card_config: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      if (skip.has(key) || value === undefined) continue;
      card_config[key] = value;
    }
    const next: AuHomeEntityConfig = {
      entity: entityId,
      layout: ent.layout,
      hide: ent.hide,
      card_type: ent.card_type,
      ...(name ? { name } : {}),
      ...(icon ? { icon } : {}),
      ...(Object.keys(card_config).length > 0 ? { card_config } : {}),
    };
    return next;
  }

  private async _applyRoomItemEdit(
    id: string,
    kind: 'card' | 'entity',
    config: LovelaceCardConfig,
  ): Promise<void> {
    if (kind === 'card') {
      const persisted = this._persistedCardConfig(config);
      this._editItems = this._editItems.map((item) => {
        if (item.kind !== 'card' || item.id !== id) return item;
        const card: AuHomeCardConfig = {
          ...item.card,
          id,
          card: persisted,
        };
        return { ...item, card };
      });
    } else {
      this._editItems = this._editItems.map((item) => {
        if (item.kind !== 'entity' || item.id !== id) return item;
        const entity = this._entityFromEditorConfig(item.entity, config);
        return {
          ...item,
          id: entity.entity,
          entity,
        };
      });
    }
    try {
      const hostId =
        kind === 'entity'
          ? (this._editItems.find(
              (i) =>
                i.kind === 'entity' &&
                (i.id === id ||
                  i.entity.entity ===
                    (typeof config.entity === 'string'
                      ? config.entity.trim().toLowerCase()
                      : '')),
            )?.id ?? id)
          : id;
      const entityItem = this._editItems.find(
        (i) => i.kind === 'entity' && i.id === hostId,
      );
      const runtime =
        kind === 'card'
          ? this._homeAwareCardConfig(config)
          : entityItem?.kind === 'entity'
            ? this._childConfig(entityItem.entity)
            : config;
      const dropIds = hostId !== id ? [id, hostId] : [id];
      await mountChildCard(
        this._childMaps(),
        hostId,
        runtime,
        this.hass,
        { dropIds },
      );
    } catch {
      /* host sync will retry */
    }
    this._commitRoomEditToFloors();
  }

  private async _confirmCardEditor(): Promise<void> {
    const draft = this._cardEditorDraft;
    const mode = this._cardEditorMode;
    if (!draft || !mode) return;
    if (mode === 'add') {
      if (this._homeEditing) await this._placeFloorCard(draft);
      else await this._placeRoomCard(draft);
    } else if (this._cardEditorId && this._cardEditorKind) {
      if (this._homeEditing && this._cardEditorKind === 'entity') {
        await this._applyHomeEntityEdit(this._cardEditorId, draft);
      } else if (this._homeEditing && this._cardEditorKind === 'card') {
        await this._applyHomeCardEdit(this._cardEditorId, draft);
      } else if (this._roomEditing) {
        await this._applyRoomItemEdit(
          this._cardEditorId,
          this._cardEditorKind,
          draft,
        );
      }
    }
    this._closeCardEditor();
  }

  private async _onCardPicked(config: LovelaceCardConfig): Promise<void> {
    if (!this._roomEditing && !this._homeEditing) return;
    // Remap before editor/place so stubs with entity land on the right card.
    const draft = this._persistedCardConfig({ ...config });
    this._closeAddCard();
    const opened = await this._mountCardEditor('add', draft);
    if (!opened) {
      if (this._homeEditing) await this._placeFloorCard(draft);
      else await this._placeRoomCard(draft);
    }
  }

  private _handleCardPicked = (ev: Event): void => {
    const detail = (ev as CustomEvent<{ config?: LovelaceCardConfig }>).detail;
    if (!detail?.config) return;
    void this._onCardPicked(detail.config);
  };

  private _pickFallbackCard = (type: string): void => {
    void this._onCardPicked(stubConfigForCardType(type, this.hass));
  };

  private _openEditRoomCard = (id: string): void => {
    if (this._roomEditing) {
      const item = this._editItems.find((i) => i.id === id);
      if (!item) return;
      if (item.kind === 'card') {
        const draft = { ...item.card.card };
        if (!cardTypeHasEditor(draft.type)) return;
        void this._mountCardEditor('edit', draft, { id, kind: 'card' });
        return;
      }
      const draft = this._childConfig(item.entity);
      if (!cardTypeHasEditor(draft.type)) return;
      void this._mountCardEditor('edit', draft, { id, kind: 'entity' });
      return;
    }

    // Home / floor grid: standalone floor entities or cards.
    if (!this._homeEditing) return;
    const item = this._homeEditItems.find((i) => i.id === id);
    if (!item) return;
    if (item.kind === 'card') {
      const draft = { ...item.card.card };
      if (!cardTypeHasEditor(draft.type)) return;
      void this._mountCardEditor('edit', draft, { id, kind: 'card' });
      return;
    }
    if (item.kind !== 'entity') return;
    const draft = this._childConfig(item.entity);
    if (!cardTypeHasEditor(draft.type)) return;
    void this._mountCardEditor('edit', draft, { id, kind: 'entity' });
  };

  private async _applyHomeCardEdit(
    id: string,
    config: LovelaceCardConfig,
  ): Promise<void> {
    const persisted = this._persistedCardConfig(config);
    this._homeEditItems = this._homeEditItems.map((item) => {
      if (item.kind !== 'card' || item.id !== id) return item;
      const card: AuHomeCardConfig = {
        ...item.card,
        id,
        card: persisted,
      };
      return { ...item, card };
    });
    try {
      await mountChildCard(
        this._childMaps(),
        id,
        this._homeAwareCardConfig(persisted),
        this.hass,
      );
    } catch {
      /* host sync will retry */
    }
    this._commitHomeEditToFloors();
  }

  private async _applyHomeEntityEdit(
    id: string,
    config: LovelaceCardConfig,
  ): Promise<void> {
    this._homeEditItems = this._homeEditItems.map((item) => {
      if (item.kind !== 'entity' || item.id !== id) return item;
      const entity = this._entityFromEditorConfig(item.entity, config);
      return {
        ...item,
        id: entity.entity,
        entity,
      };
    });
    try {
      const hostId =
        this._homeEditItems.find(
          (i) =>
            i.kind === 'entity' &&
            (i.id === id ||
              i.entity.entity ===
                (typeof config.entity === 'string'
                  ? config.entity.trim().toLowerCase()
                  : '')),
        )?.id ?? id;
      const entityItem = this._homeEditItems.find(
        (i) => i.kind === 'entity' && i.id === hostId,
      );
      const runtime =
        entityItem?.kind === 'entity'
          ? this._childConfig(entityItem.entity)
          : this._homeAwareCardConfig(config);
      const dropIds = hostId !== id ? [id, hostId] : [id];
      await mountChildCard(
        this._childMaps(),
        hostId,
        runtime,
        this.hass,
        { dropIds },
      );
    } catch {
      /* host sync will retry */
    }
    this._commitHomeEditToFloors();
  }

  private _openAddRoom = (): void => {
    if (!this._homeEditing) return;
    this._homeAddChooserOpen = false;
    this._newRoomName = '';
    this._addRoomOpen = true;
  };

  private _closeAddRoom = (): void => {
    this._addRoomOpen = false;
    this._newRoomName = '';
  };

  private _confirmAddEntity = (): void => {
    const entityId = this._pickerEntity.trim();
    if (!entityId || !this._homeEditing) return;
    if (this._homeEditItems.some((i) => i.id === entityId)) {
      this._closeAddEntity();
      return;
    }
    const w = this._defaultWidth;
    const h = DEFAULT_HEIGHT_UNITS;
    let floors = this._resolvedFloors();
    if (floors.length === 0) {
      floors = [{ id: 'main', name: 'Main', rooms: [], entities: [] }];
      this._emitFloorsUpdate(floors);
    }
    const floorId = floors[0]!.id || 'main';
    const floorItems = this._homeEditItems.filter((i) => i.floorId === floorId);
    const slot = findFreeSlot(floorItems, w, h, this._baseColumns);
    this._homeEditItems = [
      ...this._homeEditItems,
      {
        id: entityId,
        floorId,
        kind: 'entity',
        x: slot.x,
        y: slot.y,
        w,
        h,
        entity: {
          entity: entityId,
          layout: { x: slot.x, y: slot.y, w, h },
        },
      },
    ];
    this._commitHomeEditToFloors();
    this._closeAddEntity();
  };

  private _confirmAddRoom = (): void => {
    const name = this._newRoomName.trim();
    if (!name || !this._homeEditing) return;
    let floors = this._resolvedFloors();
    if (floors.length === 0) {
      floors = [{ id: 'main', name: 'Main', rooms: [], entities: [] }];
      this._emitFloorsUpdate(floors);
    }
    const targetFloor = floors[0]!;
    const floorId = targetFloor.id || 'main';
    const floorItems = this._homeEditItems.filter((i) => i.floorId === floorId);
    const w = this._defaultWidth;
    const h = DEFAULT_HEIGHT_UNITS;
    const slot = findFreeSlot(floorItems, w, h, this._baseColumns);
    const idBase =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '') || 'room';
    let id = idBase;
    let n = 2;
    while (this._homeEditItems.some((i) => i.id === id)) {
      id = `${idBase}_${n}`;
      n += 1;
    }
    const room: AuHomeRoomConfig = {
      id,
      name,
      entities: [],
      layout: { x: slot.x, y: slot.y, w, h },
    };
    this._homeEditItems = [
      ...this._homeEditItems,
      {
        id,
        floorId,
        kind: 'room',
        x: slot.x,
        y: slot.y,
        w,
        h,
        room,
      },
    ];
    this._commitHomeEditToFloors();
    this._closeAddRoom();
  };

  private _renderGridHandles(
    id: string,
    options?: { editRoom?: boolean; editCard?: boolean },
  ): TemplateResult {
    return html`
      <div
        class="handle drag-handle"
        title="Drag"
        @pointerdown=${(e: PointerEvent) => this._onDragStart(e, id)}
        @pointermove=${this._onDragMove}
        @pointerup=${this._onDragEnd}
        @pointercancel=${this._onDragEnd}
      >
        <ha-icon icon="mdi:drag"></ha-icon>
      </div>
      <button
        class="handle remove-btn"
        title=${this._confirmRemoveId === id ? 'Confirm delete' : 'Delete'}
        @click=${() => this._onRemove(id)}
      >
        <ha-icon
          icon=${this._confirmRemoveId === id ? 'mdi:check' : 'mdi:delete'}
        ></ha-icon>
      </button>
      ${options?.editRoom
        ? html`
            <button
              class="handle edit-room-btn"
              type="button"
              title="Edit room"
              aria-label="Edit room"
              @click=${(e: Event) => {
                e.stopPropagation();
                this._openEditRoom(id);
              }}
            >
              <ha-icon icon="mdi:pencil"></ha-icon>
            </button>
          `
        : nothing}
      ${options?.editCard
        ? html`
            <button
              class="handle edit-card-btn"
              type="button"
              title="Edit card"
              aria-label="Edit card"
              @click=${(e: Event) => {
                e.stopPropagation();
                this._openEditRoomCard(id);
              }}
            >
              <ha-icon icon="mdi:pencil"></ha-icon>
            </button>
          `
        : nothing}
      <div class="edit-cover" title="Move or resize"></div>
      <div
        class="handle resize-handle"
        title="Resize"
        @pointerdown=${(e: PointerEvent) => this._onResizeStart(e, id)}
        @pointermove=${this._onResizeMove}
        @pointerup=${this._onResizeEnd}
        @pointercancel=${this._onResizeEnd}
      ></div>
    `;
  }

  private _roomToggleEntities(room: AuHomeRoomConfig): AuHomeEntityConfig[] {
    return collectRoomToggleEntities(this._roomEntities(room), room.cards);
  }

  private _roomToggleEntityIds(room: AuHomeRoomConfig): string[] {
    return this._roomToggleEntities(room).map((e) => e.entity);
  }

  private _openEditRoom = (roomId: string): void => {
    const item = this._homeEditItems.find(
      (i) => i.kind === 'room' && i.id === roomId,
    );
    const room =
      item?.kind === 'room'
        ? item.room
        : findRoom(this._resolvedFloors(), roomId)?.room;
    if (!room) return;
    this._editRoomAddQuery = '';
    this._editRoomDraft = buildEditRoomDraft(
      room,
      roomId,
      this._roomToggleEntityIds(room),
    );
  };

  private _closeEditRoom = (): void => {
    this._editRoomDraft = null;
    this._editRoomAddQuery = '';
  };

  private _patchEditRoomDraft(patch: Partial<EditRoomDraft>): void {
    if (!this._editRoomDraft) return;
    this._editRoomDraft = { ...this._editRoomDraft, ...patch };
  }

  private _confirmEditRoom = (): void => {
    const draft = this._editRoomDraft;
    if (!draft || !this._homeEditing) return;
    const name = draft.name.trim();
    if (!name) return;
    const item = this._homeEditItems.find(
      (i) => i.kind === 'room' && i.id === draft.roomId,
    );
    if (!item || item.kind !== 'room') return;
    const members = [
      ...new Set(draft.members.filter((id) => this._isToggleDomain(id))),
    ];
    const controls = controlsFromEditDraft(draft, members);
    const entities = roomEntitiesFromEditDraft({
      members,
      existing: item.room.entities ?? [],
      cards: item.room.cards,
    });
    const room: AuHomeRoomConfig = {
      ...item.room,
      id: draft.roomId,
      name,
      icon: draft.icon.trim() || undefined,
      entities,
      controls,
    };
    this._homeEditItems = this._homeEditItems.map((i) =>
      i.kind === 'room' && i.id === draft.roomId ? { ...i, room } : i,
    );
    this._commitHomeEditToFloors();
    this._closeEditRoom();
  };

  private _addEditRoomMember = (entityId: string): void => {
    const current = this._editRoomDraft;
    if (!current || !this._isToggleDomain(entityId)) return;
    this._editRoomDraft = addEditRoomMember(current, entityId);
    this._editRoomAddQuery = '';
  };

  private _toggleEditRoomEntity(entityId: string, on: boolean): void {
    const current = this._editRoomDraft;
    if (!current) return;
    this._editRoomDraft = toggleEditRoomEntity(current, entityId, on);
  }

  private _moveEditRoomMember = (entityId: string, delta: -1 | 1): void => {
    const current = this._editRoomDraft;
    if (!current) return;
    this._editRoomDraft = moveEditRoomMember(current, entityId, delta);
  };

  private _findCardConfig(cardId: string): AuHomeCardConfig | undefined {
    if (this._view.kind === 'room') {
      const draft = this._editItems.find(
        (i) => i.kind === 'card' && i.id === cardId,
      );
      if (draft?.kind === 'card') return draft.card;
      const found = findRoom(this._resolvedFloors(), this._view.roomId);
      return found?.room.cards?.find((c) => (c.id || '') === cardId);
    }
    const homeDraft = this._homeEditItems.find(
      (i) => i.kind === 'card' && i.id === cardId,
    );
    if (homeDraft?.kind === 'card') return homeDraft.card;
    for (const floor of this._resolvedFloors()) {
      const found = floor.cards?.find((c) => (c.id || '') === cardId);
      if (found) return found;
    }
    return undefined;
  }

  private _childMaps() {
    return { cards: this._childCards, configJson: this._childConfigJson };
  }

  /** Attach/update entity + arbitrary cards into placeholder hosts after render. */
  private _syncEntityChildCards(): void {
    const root = this.renderRoot;
    if (!root) return;
    const seen = new Set<string>();
    const maps = this._childMaps();

    const attach = (
      host: HTMLElement,
      id: string,
      config: LovelaceCardConfig,
    ): void => {
      seen.add(id);
      attachChildToHost(maps, host, id, config, this.hass, this.isConnected);
    };

    for (const host of root.querySelectorAll<HTMLElement>('[data-entity-host]')) {
      const entityId = host.dataset.entityHost;
      if (!entityId) continue;
      const ent = this._findEntityConfig(entityId);
      if (!ent) continue;
      attach(host, entityId, this._childConfig(ent));
    }

    for (const host of root.querySelectorAll<HTMLElement>('[data-card-host]')) {
      const cardId = host.dataset.cardHost;
      if (!cardId) continue;
      const card = this._findCardConfig(cardId);
      if (!card?.card) continue;
      attach(host, cardId, this._homeAwareCardConfig(card.card));
    }

    for (const host of root.querySelectorAll<HTMLElement>('[data-room-tile]')) {
      const roomId = host.dataset.roomTile?.trim();
      if (!roomId) continue;
      const found = findRoom(this._resolvedFloors(), roomId);
      if (!found) continue;
      attach(host, `room-tile:${roomId}`, this._roomTileCardConfig(found.room));
    }

    for (const host of root.querySelectorAll<HTMLElement>('[data-multi-entity]')) {
      const key = host.dataset.multiEntity?.trim();
      if (!key) continue;
      const group = this._findMultiEntityGroup(key);
      if (!group) continue;
      attach(host, `multi:${key}`, this._multiEntityCardConfig(group));
    }

    pruneChildCards(maps, seen);
  }

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass?.language, key);
  }

  private _resolvedFloors(): AuHomeFloorConfig[] {
    const configured = this.config?.floors ?? [];
    if (configured.length > 0) return normalizeFloors(configured);
    if (this.config?.auto_areas) {
      return normalizeFloors(discoverFloorsFromAreas(this.hass));
    }
    return [];
  }

  private _roomEntities(room: AuHomeRoomConfig): AuHomeEntityConfig[] {
    const preferAuto = this.config?.auto_areas === true;
    const list = preferAuto
      ? mergeAreaEntities(room, this.hass)
      : (room.entities ?? []);
    return list.filter((e) => !e.hide && e.entity);
  }

  private _isToggleDomain(entityId: string): boolean {
    return isToggleDomain(entityId);
  }

  private _entityIsOn(entityId: string): boolean {
    return entityIsOn(this.hass?.states[entityId]);
  }

  /** Merge card-level defaults with per-room `controls` (room wins per field). */
  private _resolvedRoomControls(room: AuHomeRoomConfig): AuHomeRoomControlsConfig {
    return resolveRoomControls(this.config?.room_controls, room.controls);
  }

  private _roomControlEntities(room: AuHomeRoomConfig): {
    visible: AuHomeEntityConfig[];
    overflow: number;
  } {
    return roomControlEntities({
      entities: this._roomToggleEntities(room),
      controls: this._resolvedRoomControls(room),
    });
  }

  private _controlIcon(ent: AuHomeEntityConfig, room: AuHomeRoomConfig): string {
    const attrIcon = this.hass?.states[ent.entity]?.attributes?.icon;
    return controlIcon({
      entity: ent,
      stripIcons: this._resolvedRoomControls(room).icons,
      attrIcon: typeof attrIcon === 'string' ? attrIcon : undefined,
    });
  }

  private _controlLabel(ent: AuHomeEntityConfig): string {
    if (ent.name) return ent.name;
    const st = this.hass?.states[ent.entity];
    if (st && this.hass) {
      return resolveDeviceDisplayName(
        st,
        undefined,
        this.hass,
        this.config?.prefer_device_name !== false,
      );
    }
    return ent.entity;
  }

  private _roomTileCardConfig(room: AuHomeRoomConfig) {
    const toggles = this._roomToggleEntities(room);
    const active = toggles.filter((e) => this._entityIsOn(e.entity)).length;
    const showChips = this._resolvedRoomControls(room).show !== false;
    const { visible } = showChips
      ? this._roomControlEntities(room)
      : { visible: [] as AuHomeEntityConfig[] };
    return buildRoomTileCardConfig({
      room,
      headerInteractive: !this._homeEditing,
      toggles,
      activeCount: active,
      chipEntities: visible,
      chipIcon: (ent) => this._controlIcon(ent, room),
      chipLabel: (ent) => this._controlLabel(ent),
      debug: this.config?.debug === true,
    });
  }

  private _onRoomTileHeader = (ev: Event): void => {
    if (this._homeEditing) return;
    const host = ev.currentTarget as HTMLElement | null;
    const roomId = host?.dataset?.roomTile?.trim();
    if (!roomId) return;
    ev.stopPropagation();
    this._openRoom(roomId);
  };

  private _goHome = (): void => {
    this._clearRoomIdleTimer();
    this._view = { kind: 'home' };
    this._confirmBulk = false;
  };

  private _openRoom = (roomId: string): void => {
    this._view = { kind: 'room', roomId };
    this._confirmBulk = false;
    auDebug(this.config?.debug, 'home-dashboard', 'open room', roomId);
    this._armRoomIdleTimer();
  };

  private _roomIdleSeconds(): number {
    return Math.max(0, Number(this.config?.room_idle_timeout) || 0);
  }

  private _clearRoomIdleTimer = (): void => {
    if (this._roomIdleTimer !== undefined) {
      clearTimeout(this._roomIdleTimer);
      this._roomIdleTimer = undefined;
    }
  };

  private _armRoomIdleTimer = (): void => {
    this._clearRoomIdleTimer();
    if (this._view.kind !== 'room' || this.layoutEditing) return;
    const seconds = this._roomIdleSeconds();
    if (seconds <= 0) return;
    this._roomIdleTimer = setTimeout(() => {
      this._roomIdleTimer = undefined;
      this._goHome();
    }, seconds * 1000);
  };

  private _onRoomActivity = (): void => {
    if (this._view.kind !== 'room') return;
    this._armRoomIdleTimer();
  };

  private async _runBulkOff(entityIds: string[]): Promise<void> {
    if (!this.hass) return;
    if (this.config?.confirm_actions && !this._confirmBulk) {
      this._confirmBulk = true;
      return;
    }
    this._confirmBulk = false;
    const result = await bulkTurnOff(this.hass, entityIds);
    auDebug(this.config?.debug, 'home-dashboard', 'bulk off', result);
  }

  private _toggleExpand(roomId: string): void {
    const next = new Set(this._expandedRooms);
    if (next.has(roomId)) next.delete(roomId);
    else next.add(roomId);
    this._expandedRooms = next;
  }

  private _homeAwareCardConfig(card: LovelaceCardConfig): LovelaceCardConfig {
    return homeAwareCardConfig(card);
  }

  /** Normalize remappable Atrium card type before writing to floors YAML. */
  private _persistedCardConfig(card: LovelaceCardConfig): LovelaceCardConfig {
    return normalizeAuHomeCardConfig(card).card;
  }

  private _childConfig(ent: AuHomeEntityConfig): LovelaceCardConfig {
    return childConfigForEntity(ent, {
      confirmActions: this.config?.confirm_actions === true,
      debug: this.config?.debug === true,
    });
  }

  private _placementStyle(placement?: GridItemLike): Record<string, string> {
    return placementStyle(placement);
  }

  private _renderChildCard(
    ent: AuHomeEntityConfig,
    placement?: GridItemLike,
    editing = false,
  ): TemplateResult {
    const id = ent.entity;
    const canEdit =
      editing && cardTypeHasEditor(this._childConfig(ent).type);
    return html`<div
      class="entity-host"
      style=${styleMap(this._placementStyle(placement))}
    >
      ${editing
        ? this._renderGridHandles(id, { editCard: canEdit })
        : nothing}
      <div class="entity-card" data-entity-host=${id}></div>
    </div>`;
  }

  private _renderRoomCardItem(
    card: AuHomeCardConfig,
    placement: GridItemLike,
    editing: boolean,
  ): TemplateResult {
    const id = card.id || placement.id;
    const canEdit = editing && cardTypeHasEditor(card.card.type);
    return html`<div
      class="entity-host"
      style=${styleMap(this._placementStyle(placement))}
    >
      ${editing
        ? this._renderGridHandles(id, { editCard: canEdit })
        : nothing}
      <div class="entity-card" data-card-host=${id}></div>
    </div>`;
  }

  private _renderRoomGridItem(
    item: RoomEditItem,
    editing: boolean,
  ): TemplateResult {
    if (item.kind === 'card') {
      return this._renderRoomCardItem(item.card, item, editing);
    }
    return this._renderChildCard(item.entity, item, editing);
  }

  private _renderAddEntityModal(): TemplateResult | typeof nothing {
    return renderAddEntityModal({
      open: this._addEntityOpen,
      all: this._entitySelectOptions(),
      filtered: this._filteredEntityOptions(),
      searchQuery: this._entitySearchQuery,
      pickerEntity: this._pickerEntity,
      onClose: this._closeAddEntity,
      onSearchInput: this._onEntitySearchInput,
      onSelect: this._selectEntityOption,
      onConfirm: this._confirmAddEntity,
    });
  }

  private _renderAddCardModal(): TemplateResult | typeof nothing {
    return renderAddCardModal({
      open: this._addCardOpen,
      hass: this.hass,
      loading: this._cardPickerLoading,
      ready: this._cardPickerReady,
      onClose: this._closeAddCard,
      onCardPicked: this._handleCardPicked,
      onPickFallback: this._pickFallbackCard,
    });
  }

  private _renderCardEditorModal(): TemplateResult | typeof nothing {
    return renderCardEditorModal({
      mode: this._cardEditorMode,
      draftType:
        typeof this._cardEditorDraft?.type === 'string'
          ? this._cardEditorDraft.type
          : undefined,
      onClose: this._closeCardEditor,
      onConfirm: () => {
        void this._confirmCardEditor();
      },
    });
  }

  private _renderPresence(): TemplateResult | typeof nothing {
    if (this.config?.show_presence === false) return nothing;
    const ids = this.config?.presence ?? [];
    if (ids.length === 0 || !this.hass) return nothing;
    const items = buildPresenceItems(ids, this.hass.states);
    return html`
      <div class="presence" role="list" aria-label=${this._t('home.presence')}>
        ${items.map(
          (p) => html`
            <div
              class=${classMap({
                person: true,
                home: p.home,
                away: !p.home && !p.unavailable,
              })}
              role="listitem"
            >
              <div class="avatar">
                ${p.picture
                  ? html`<img src=${p.picture} alt="" />`
                  : (p.name.charAt(0) || '?').toUpperCase()}
              </div>
              <div class="person-name">${p.name}</div>
              <div class="person-state">
                ${p.unavailable
                  ? this._t('home.entity_missing')
                  : p.home
                    ? this._t('home.presence.home')
                    : this._t('home.presence.away')}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderQuickActions(): TemplateResult | typeof nothing {
    const scenes = this.config?.scenes ?? [];
    const scripts = this.config?.scripts ?? [];
    if (scenes.length === 0 && scripts.length === 0) return nothing;
    return html`
      <div>
        <div class="floor-title">${this._t('home.quick_actions')}</div>
        <div class="quick">
          ${scenes.map((id) => this._quickChip(id, 'scene'))}
          ${scripts.map((id) => this._quickChip(id, 'script'))}
        </div>
      </div>
    `;
  }

  private _quickChip(entityId: string, domain: 'scene' | 'script'): TemplateResult {
    const entity = this.hass?.states[entityId];
    const name =
      entity && this.hass
        ? resolveDeviceDisplayName(
            entity,
            undefined,
            this.hass,
            this.config?.prefer_device_name !== false,
          )
        : entityId;
    return html`
      <button
        class="chip"
        type="button"
        ?disabled=${!entity}
        @click=${() => {
          if (!this.hass || !entity) return;
          void this.hass.callService(domain, 'turn_on', { entity_id: entityId });
        }}
      >
        ${name}
      </button>
    `;
  }

  private _multiEntityKey(
    group: NonNullable<AuShellGridConfig['multi_entity']>[number],
    index: number,
  ): string {
    const id = group.id?.trim();
    return id || `multi:${index}`;
  }

  private _findMultiEntityGroup(
    key: string,
  ): NonNullable<AuShellGridConfig['multi_entity']>[number] | undefined {
    const groups = this.config?.multi_entity ?? [];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i]!;
      if (this._multiEntityKey(group, i) === key) return group;
    }
    return undefined;
  }

  private _multiEntityCardConfig(
    group: NonNullable<AuShellGridConfig['multi_entity']>[number],
  ) {
    const entities = group.entities
      .filter((id) => typeof id === 'string' && id.trim())
      .map((id) => id.trim());
    const active = entities.filter((id) => this._entityIsOn(id)).length;
    return {
      type: 'custom:au-room-card',
      variant: 'home' as const,
      header_interactive: true,
      name: group.name,
      icon: group.icon ?? 'mdi:lightbulb-group',
      subtitle: `${active} on · ${entities.length}`,
      entities: entities.map((entity) => ({
        entity,
        icon: controlIcon({
          entity: { entity },
          attrIcon:
            typeof this.hass?.states[entity]?.attributes?.icon === 'string'
              ? String(this.hass.states[entity]!.attributes.icon)
              : undefined,
        }),
      })),
      ...(this.config?.debug ? { debug: true } : {}),
    };
  }

  private _onMultiEntityHeader = (ev: Event): void => {
    const host = ev.currentTarget as HTMLElement | null;
    const key = host?.dataset?.multiEntity?.trim();
    if (!key || !this.hass) return;
    const group = this._findMultiEntityGroup(key);
    if (!group) return;
    ev.stopPropagation();
    for (const id of group.entities) {
      void this.hass.callService('homeassistant', 'toggle', {
        entity_id: id,
      });
    }
  };

  /** Compat: `multi_entity` groups render as `au-room-card` tiles (same chrome as rooms). */
  private _renderMultiEntity(roomId: string): TemplateResult | typeof nothing {
    const groups = this.config?.multi_entity ?? [];
    const matched = groups
      .map((group, index) => ({ group, index }))
      .filter(
        ({ group }) => !group.room_id || group.room_id === roomId,
      );
    if (matched.length === 0) return nothing;
    return html`
      ${matched.map(({ group, index }) => {
        const key = this._multiEntityKey(group, index);
        return html`
          <div
            class="entity-host multi-entity-host"
            data-multi-entity=${key}
            @au-room-header=${this._onMultiEntityHeader}
          ></div>
        `;
      })}
    `;
  }

  private _renderRoomTile(
    room: AuHomeRoomConfig,
    placement: GridItemLike,
    editing: boolean,
  ): TemplateResult {
    const id = room.id || placement.id;
    const style = {
      gridColumn: `${placement.x + 1} / span ${placement.w}`,
      gridRow: `${placement.y + 1} / span ${placement.h}`,
    };
    return html`
      <div class="room-host" style=${styleMap(style)}>
        ${editing
          ? this._renderGridHandles(id, { editRoom: true })
          : nothing}
        <div
          class="room-tile-host"
          data-room-tile=${id}
          @au-room-header=${this._onRoomTileHeader}
        ></div>
      </div>
    `;
  }

  private _renderHomeGridItem(
    item: HomeGridItem,
    editing: boolean,
  ): TemplateResult {
    if (item.kind === 'room') {
      return this._renderRoomTile(item.room, item, editing);
    }
    if (item.kind === 'card') {
      return this._renderRoomCardItem(item.card, item, editing);
    }
    return this._renderChildCard(item.entity, item, editing);
  }

  private _renderHomeView(floors: AuHomeFloorConfig[]): TemplateResult {
    const editing = this._homeEditing;
    if (floors.length === 0 && !editing) {
      return html`<div class="empty">${this._t('home.no_rooms')}</div>`;
    }
    return html`
      ${editing ? nothing : this._renderPresence()}
      ${editing ? nothing : this._renderQuickActions()}
      <div class="room-body">
        ${floors.length === 0
          ? html`<div class="empty">${this._t('home.no_rooms')}</div>`
          : floors.map((floor) => {
              const floorId = floor.id || 'floor';
              const items = editing
                ? this._homeEditItems.filter((i) => i.floorId === floorId)
                : this._homeFloorGridItems(floor);
              return html`
                <section class="floor">
                  ${floors.length > 1
                    ? html`<div class="floor-title">${floor.name}</div>`
                    : nothing}
                  <div
                    class=${classMap({
                      rooms: true,
                      editing,
                      'au-edit-grid': editing || this._distributeRowsActive,
                      'distribute-rows': this._distributeRowsActive,
                    })}
                    style=${styleMap(this._gridStyleVars(items))}
                  >
                    ${items.map((item) =>
                      this._renderHomeGridItem(item, editing),
                    )}
                  </div>
                </section>
              `;
            })}
        ${editing
          ? html`
              <button
                class="add-fab"
                type="button"
                title="Add to floor"
                aria-label="Add to floor"
                @click=${this._openHomeAddChooser}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            `
          : nothing}
      </div>
      ${this._renderHomeAddChooser()}
      ${this._renderAddRoomModal()}
      ${this._renderAddEntityModal()}
      ${this._renderAddCardModal()}
      ${this._renderEditRoomModal()}
    `;
  }

  private _editRoomAddCandidates(): Array<{
    id: string;
    name: string;
    label: string;
  }> {
    const draft = this._editRoomDraft;
    if (!draft) return [];
    const taken = new Set(draft.members);
    const q = this._editRoomAddQuery.trim().toLowerCase();
    return this._entitySelectOptions()
      .filter((opt) => this._isToggleDomain(opt.id) && !taken.has(opt.id))
      .filter(
        (opt) =>
          !q ||
          opt.id.toLowerCase().includes(q) ||
          opt.name.toLowerCase().includes(q) ||
          opt.label.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }

  private _renderEditRoomModal(): TemplateResult | typeof nothing {
    const draft = this._editRoomDraft;
    if (!draft) return nothing;
    const item = this._homeEditItems.find(
      (i) => i.kind === 'room' && i.id === draft.roomId,
    );
    const room =
      item?.kind === 'room'
        ? item.room
        : findRoom(this._resolvedFloors(), draft.roomId)?.room;
    const canEdit = this._homeEditing;
    return renderEditRoomModal({
      draft,
      hass: this.hass,
      canEdit,
      room,
      addQuery: this._editRoomAddQuery,
      addCandidates: canEdit ? this._editRoomAddCandidates() : [],
      handlers: {
        onClose: this._closeEditRoom,
        onPatch: (patch) => this._patchEditRoomDraft(patch),
        onAddQuery: (query) => {
          this._editRoomAddQuery = query;
        },
        onAddMember: this._addEditRoomMember,
        onToggleEntity: (id, on) => this._toggleEditRoomEntity(id, on),
        onMoveMember: this._moveEditRoomMember,
        onConfirm: this._confirmEditRoom,
      },
    });
  }

  private _renderHomeAddChooser(): TemplateResult | typeof nothing {
    return renderHomeAddChooser({
      open: this._homeAddChooserOpen,
      onClose: this._closeHomeAddChooser,
      onAddRoom: this._openAddRoom,
      onAddEntity: this._openAddEntity,
      onAddCard: this._openAddCard,
    });
  }

  private _renderAddRoomModal(): TemplateResult | typeof nothing {
    return renderAddRoomModal({
      open: this._addRoomOpen,
      name: this._newRoomName,
      onClose: this._closeAddRoom,
      onNameInput: (value) => {
        this._newRoomName = value;
      },
      onConfirm: this._confirmAddRoom,
    });
  }

  private _homeToolbarTitle(): string {
    if (this.config?.header_greeting) {
      return formatGreeting(this._clockNow, this.hass?.language);
    }
    const custom = this.config?.header_title?.trim();
    return custom || this._t('home.title');
  }

  private _renderToolbarClock(): TemplateResult {
    const cfg = this.config;
    const label = formatToolbarClock(this._clockNow, {
      clock_format: cfg?.clock_format === '12h' ? '12h' : '24h',
      clock_show_date: cfg?.clock_show_date,
      clock_date_format: cfg?.clock_date_format,
      clock_show_day: cfg?.clock_show_day,
      clock_day_format: cfg?.clock_day_format,
      language: this.hass?.language,
    });
    return html`<time class="clock" datetime=${new Date(this._clockNow).toISOString()}
      >${label}</time
    >`;
  }

  private _renderRoomView(roomId: string): TemplateResult {
    const found = findRoom(this._resolvedFloors(), roomId);
    if (!found) {
      return html`<div class="empty">${this._t('home.no_rooms')}</div>`;
    }
    const { room } = found;
    const editing = this._roomEditing;
    const entities = this._roomEntities(room);
    const allGridItems = editing
      ? this._editItems
      : this._roomGridItems(room);
    const collapseAfter = room.collapse_after ?? 8;
    const isExpanded = this._expandedRooms.has(room.id!);
    const entityCount = allGridItems.length;
    const shouldCollapse =
      !editing && entityCount > collapseAfter && !isExpanded;
    const gridItems = shouldCollapse
      ? allGridItems.slice(0, collapseAfter)
      : allGridItems;
    const entityIds = entities.map((e) => e.entity);
    const showBulk =
      !editing && this.config?.show_bulk_actions !== false;

    return html`
      <div class="toolbar">
        <div class="toolbar-start">
          <button class="back" type="button" @click=${this._goHome}>
            ← ${this._t('home.back')}
          </button>
          <h2 class="title">${room.name}</h2>
        </div>
        ${this._renderToolbarClock()}
        <div class="toolbar-end">
          ${showBulk
            ? this._confirmBulk
              ? html`<div class="confirm-row">
                  <button
                    class="bulk"
                    type="button"
                    @click=${() => void this._runBulkOff(entityIds)}
                  >
                    ${this._t('home.confirm')}
                  </button>
                  <button
                    class="bulk"
                    type="button"
                    @click=${() => {
                      this._confirmBulk = false;
                    }}
                  >
                    ${this._t('home.cancel')}
                  </button>
                </div>`
              : html`<button
                  class="bulk"
                  type="button"
                  @click=${() => void this._runBulkOff(entityIds)}
                >
                  ${this._t('home.bulk.all_off')}
                </button>`
            : nothing}
        </div>
      </div>
      <div class="room-body">
        ${entityCount === 0 && !editing
          ? html`<div class="empty">${this._t('home.no_entities')}</div>`
          : entityCount === 0 && editing
            ? html`<div class="empty">${this._t('home.no_entities')}</div>`
            : html`
                <div
                  class=${classMap({
                    entities: true,
                    editing,
                    'au-edit-grid': editing || this._distributeRowsActive,
                    'distribute-rows': this._distributeRowsActive,
                  })}
                  style=${styleMap(this._gridStyleVars(gridItems))}
                >
                  ${editing ? nothing : this._renderMultiEntity(room.id!)}
                  ${gridItems.map((item) =>
                    this._renderRoomGridItem(item, editing),
                  )}
                </div>
                ${!editing && entityCount > collapseAfter
                  ? html`<button
                      class="collapse"
                      type="button"
                      @click=${() => this._toggleExpand(room.id!)}
                    >
                      ${isExpanded
                        ? this._t('home.show_less')
                        : this._t('home.show_more')}
                    </button>`
                  : nothing}
              `}
        ${editing
          ? html`
              <button
                class="add-fab"
                type="button"
                title="Add card"
                aria-label="Add card"
                @click=${this._openAddCard}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            `
          : nothing}
      </div>
      ${this._view.kind === 'room' ? this._renderAddCardModal() : nothing}
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config) return nothing;
    const floors = this._resolvedFloors();
    const rtl = isRtlLanguage(this.hass?.language);
    const body =
      this._view.kind === 'home'
        ? html`
            <div class="toolbar">
              <div class="toolbar-start">
                <h2 class="title">${this._homeToolbarTitle()}</h2>
              </div>
              ${this._renderToolbarClock()}
              <div class="toolbar-end"></div>
            </div>
            ${this._renderHomeView(floors)}
          `
        : this._renderRoomView(this._view.roomId);

    return html`
      <div class="home-shell">
        <div
          class=${classMap({
            home: true,
            rtl,
            'distribute-rows': this._distributeRowsActive,
          })}
        >
          ${body}
        </div>
        ${this._renderCardEditorModal()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-shell-home-view': AuShellHomeView;
  }
}

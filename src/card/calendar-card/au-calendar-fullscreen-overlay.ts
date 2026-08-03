import {
  LitElement,
  css,
  html,
  nothing,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { auTokens } from '../../theme/tokens';
import { localize } from '../../localize/localize';
import type { TranslationKey } from '../../localize/en';
import type {
  AuCalendarCardConfig,
  AuCalendarEntityConfig,
  AuCalendarEvent,
  AuCalendarView,
} from '../../types/calendar';
import { isAuCalendarView } from '../../types/calendar';
import {
  buildMonthGrid,
  eventOverlapsLocalDay,
  formatDayHeader,
  formatEventTimeRange,
  groupEventsByDay,
  isSameLocalDay,
  isSpanningEvent,
  layoutMonthSpanBars,
  packMonthDayChips,
  startOfLocalDay,
  startOfLocalMonth,
  startOfLocalWeek,
  WEEKDAY_LABELS_SUN,
} from '../../utils/calendar';

const HISTORY_KEY = 'au-calendar-fullscreen';

const VIEW_KEYS: Record<AuCalendarView, TranslationKey> = {
  agenda: 'calendar.view.agenda',
  today: 'calendar.view.today',
  week: 'calendar.view.week',
  month: 'calendar.view.month',
};

export interface AuCalendarFullscreenSync {
  title?: string;
  events?: AuCalendarEvent[];
  entities?: AuCalendarEntityConfig[];
  config?: AuCalendarCardConfig;
  language?: string;
  now?: number;
  loading?: boolean;
  error?: string | null;
}

export interface AuCalendarFullscreenOpenOptions extends AuCalendarFullscreenSync {
  onRefresh?: () => void;
  onMonthChange?: (monthStart: Date) => void;
  onClose?: () => void;
}

/**
 * Full-viewport calendar browse overlay (agenda 1/6 + Apple-like month 5/6).
 */
@customElement('au-calendar-fullscreen-overlay')
export class AuCalendarFullscreenOverlay extends LitElement {
  @property({ attribute: false }) public title = 'Calendar';
  @property({ attribute: false }) public events: AuCalendarEvent[] = [];
  @property({ attribute: false }) public entities: AuCalendarEntityConfig[] = [];
  @property({ attribute: false }) public config?: AuCalendarCardConfig;
  @property({ attribute: false }) public language?: string;
  @property({ attribute: false }) public now = Date.now();
  @property({ attribute: false }) public loading = false;
  @property({ attribute: false }) public error: string | null = null;

  @state() private _open = false;
  @state() private _view: AuCalendarView = 'month';
  @state() private _selectedDay: Date = startOfLocalDay(new Date());
  @state() private _visibleMonth: Date = startOfLocalMonth(new Date());
  @state() private _detail: AuCalendarEvent | null = null;
  @state() private _hiddenEntities = new Set<string>();
  @state() private _filtersOpen = false;
  @state() private _cellWidth = 120;

  private _onRefresh?: () => void;
  private _onMonthChange?: (monthStart: Date) => void;
  private _onClose?: () => void;
  private _prevOverflow = '';
  private _popHandler?: () => void;
  private _keyHandler?: (ev: KeyboardEvent) => void;
  private _resizeObserver?: ResizeObserver;

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
        animation: au-cal-fade 160ms ease-out;
      }
      @keyframes au-cal-fade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .sheet {
        width: 100%;
        height: 100%;
        background: var(--au-home-bg, #f2f2f7);
        border-radius: var(--au-home-radius, 22px);
        box-shadow: var(--au-home-modal-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: var(--au-primary-text);
        font-family: var(--au-home-font, system-ui, sans-serif);
      }
      .header {
        flex: 0 0 auto;
        padding: 12px 16px 10px;
        background: var(--au-home-surface-elevated, #fff);
        border-bottom: 1px solid rgba(60, 60, 67, 0.12);
        position: relative;
        z-index: 7;
      }
      .icon-btn,
      .text-btn {
        appearance: none;
        border: none;
        background: var(--au-home-control-fill, rgba(120, 120, 128, 0.12));
        color: var(--au-primary-text);
        border-radius: 999px;
        cursor: pointer;
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
      }
      .icon-btn {
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 20px;
        flex: 0 0 auto;
      }
      .text-btn {
        padding: 8px 12px;
        color: var(--au-home-accent-default, #0a84ff);
        background: color-mix(
          in srgb,
          var(--au-home-accent-default, #0a84ff) 12%,
          transparent
        );
        flex: 0 0 auto;
      }
      .toolbar-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        min-width: 0;
      }
      .toolbar-start,
      .toolbar-end {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        min-width: 0;
      }
      .views,
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .views button,
      .filters button {
        appearance: none;
        border: none;
        border-radius: 8px;
        padding: 6px 10px;
        background: transparent;
        color: var(--au-secondary-text);
        font-size: var(--au-font-secondary);
        cursor: pointer;
      }
      .views button.active,
      .filters button.active {
        background: color-mix(
          in srgb,
          var(--au-home-accent-default, #0a84ff) 16%,
          transparent
        );
        color: var(--au-home-accent-default, #0a84ff);
        font-weight: var(--au-weight-medium);
      }
      .filter-menu {
        position: relative;
        flex: 0 0 auto;
      }
      .filters-popover {
        position: absolute;
        top: calc(100% + 6px);
        inset-inline-end: 0;
        z-index: 6;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        min-width: 10rem;
        max-width: min(22rem, 70vw);
        padding: 8px;
        border-radius: 12px;
        background: var(--au-home-surface-elevated, #fff);
        box-shadow: var(--au-home-modal-shadow, 0 8px 28px rgba(0, 0, 0, 0.18));
        border: 1px solid rgba(60, 60, 67, 0.12);
      }
      .filters button.dimmed {
        opacity: 0.45;
      }
      .body {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }
      .split {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: 1fr 5fr;
        grid-template-rows: 1fr;
      }
      @media (max-width: 900px), (orientation: portrait) {
        .split {
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 5fr;
        }
      }
      .pane {
        min-height: 0;
        min-width: 0;
        overflow: auto;
        padding: 12px 14px;
      }
      .pane-agenda {
        background: var(--au-home-surface-elevated, #fff);
        border-inline-end: 1px solid rgba(60, 60, 67, 0.12);
      }
      @media (max-width: 900px), (orientation: portrait) {
        .pane-agenda {
          border-inline-end: none;
          border-bottom: 1px solid rgba(60, 60, 67, 0.12);
        }
      }
      .pane-single {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        padding: 14px 16px;
      }
      .day-header {
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-bold);
        color: var(--au-home-accent-default, #0a84ff);
        margin-bottom: 8px;
      }
      .status {
        color: var(--au-secondary-text);
        font-size: var(--au-font-secondary);
        padding: 12px 0;
      }
      .status.error {
        color: var(--au-error, #ff3b30);
      }
      .event {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
        text-align: start;
        appearance: none;
        border: none;
        background: transparent;
        padding: 8px 4px;
        border-radius: 10px;
        cursor: pointer;
        color: inherit;
      }
      .event:hover {
        background: color-mix(in srgb, var(--au-primary-text) 5%, transparent);
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-top: 6px;
        flex: 0 0 auto;
        background: var(--au-cal-color, #007aff);
      }
      .event-main {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .summary {
        font-size: var(--au-font-primary);
        font-weight: var(--au-weight-medium);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .meta {
        font-size: var(--au-font-secondary);
        color: var(--au-secondary-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .month-nav {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }
      .month-nav h2 {
        margin: 0;
        flex: 1;
        font-size: 1.15rem;
        font-weight: var(--au-weight-bold);
      }
      .month-wrap {
        position: relative;
        display: flex;
        flex-direction: column;
        height: calc(100% - 2.5rem);
        min-height: 280px;
      }
      .month-dow-row,
      .month-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
      }
      .month-dow-row {
        gap: 2px;
        margin-bottom: 4px;
      }
      .month-dow {
        text-align: center;
        font-size: 0.7rem;
        color: var(--au-secondary-text);
        padding: 4px 0;
        font-weight: var(--au-weight-medium);
      }
      .month-grid {
        flex: 1 1 auto;
        min-height: 0;
        gap: 2px;
        grid-template-rows: repeat(6, minmax(0, 1fr));
        position: relative;
      }
      .month-cell {
        appearance: none;
        border: none;
        border-radius: 8px;
        background: color-mix(in srgb, var(--au-primary-text) 3%, transparent);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        padding: 4px;
        min-width: 0;
        min-height: 0;
        color: inherit;
        text-align: start;
        position: relative;
        z-index: 1;
      }
      .month-cell.outside {
        opacity: 0.45;
      }
      .month-cell.today .day-num {
        background: var(--au-home-accent-default, #0a84ff);
        color: #fff;
      }
      .month-cell.selected {
        outline: 2px solid
          color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 70%, transparent);
        outline-offset: -2px;
      }
      .day-num {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: var(--au-weight-bold);
        align-self: flex-start;
      }
      .chip-stack {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-height: 0;
        overflow: hidden;
        flex: 1 1 auto;
      }
      .chip {
        appearance: none;
        border: none;
        border-radius: 4px;
        padding: 1px 4px 1px 6px;
        font-size: 0.65rem;
        line-height: 1.25;
        /* Dark text on tinted fill — never white-on-bright calendar colors */
        color: var(--au-primary-text, #1c1c1e);
        background: color-mix(
          in srgb,
          var(--au-cal-color, #007aff) 22%,
          var(--au-home-surface-elevated, #fff)
        );
        border-inline-start: 3px solid var(--au-cal-color, #007aff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        text-align: start;
        max-width: 100%;
      }
      .overflow {
        font-size: 0.65rem;
        color: var(--au-secondary-text);
        padding-inline-start: 2px;
      }
      .span-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }
      .span-bar {
        position: absolute;
        pointer-events: auto;
        appearance: none;
        border: none;
        border-radius: 5px;
        padding: 0 6px 0 7px;
        font-size: 0.65rem;
        line-height: 1.3;
        color: var(--au-primary-text, #1c1c1e);
        background: color-mix(
          in srgb,
          var(--au-cal-color, #007aff) 28%,
          var(--au-home-surface-elevated, #fff)
        );
        border-inline-start: 3px solid var(--au-cal-color, #007aff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        text-align: start;
        height: 16px;
        box-sizing: border-box;
      }
      .week {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
      }
      .week-day {
        min-height: 7rem;
        border-radius: 12px;
        padding: 6px;
        background: var(--au-home-surface-elevated, #fff);
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }
      .week-day.today {
        outline: 1px solid
          color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 55%, transparent);
      }
      .week-day-num {
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-bold);
        color: var(--au-secondary-text);
      }
      .week-chip {
        appearance: none;
        font-size: 0.7rem;
        line-height: 1.2;
        padding: 3px 5px 3px 6px;
        border-radius: 5px;
        color: var(--au-primary-text, #1c1c1e);
        background: color-mix(
          in srgb,
          var(--au-cal-color, #007aff) 22%,
          var(--au-home-surface-elevated, #fff)
        );
        border: none;
        border-inline-start: 3px solid var(--au-cal-color, #007aff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        text-align: start;
      }
      .detail-scrim {
        position: absolute;
        inset: 0;
        z-index: 5;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background: color-mix(in srgb, #000 35%, transparent);
        border-radius: inherit;
      }
      .detail-panel {
        background: var(--au-home-surface-elevated, #fff);
        border-radius: 16px 16px 12px 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 70%;
        overflow: auto;
        margin: 0 12px 12px;
      }
      .detail-title {
        font-size: 1.15rem;
        font-weight: var(--au-weight-bold);
      }
      .detail-row {
        font-size: var(--au-font-secondary);
        color: var(--au-secondary-text);
      }
      .sheet {
        position: relative;
      }
    `,
  ];

  public get isOpen(): boolean {
    return this._open;
  }

  public open(opts: AuCalendarFullscreenOpenOptions = {}): void {
    this._applySync(opts);
    this._onRefresh = opts.onRefresh;
    this._onMonthChange = opts.onMonthChange;
    this._onClose = opts.onClose;
    const today = startOfLocalDay(new Date());
    this._selectedDay = today;
    this._visibleMonth = startOfLocalMonth(today);
    this._view = 'month';
    this._detail = null;
    this._hiddenEntities = new Set();
    this._filtersOpen = false;
    this._open = true;
    this.setAttribute('open', '');
    this._lockScroll(true);
    this._pushHistory();
    this._bindGlobal();
    this._onMonthChange?.(this._visibleMonth);
    void this.updateComplete.then(() => this._observeMonth());
  }

  public sync(opts: AuCalendarFullscreenSync): void {
    if (!this._open) return;
    this._applySync(opts);
  }

  public close(): void {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute('open');
    this._lockScroll(false);
    this._unbindGlobal();
    this._teardownObserver();
    this._detail = null;
    const onClose = this._onClose;
    this._onRefresh = undefined;
    this._onMonthChange = undefined;
    this._onClose = undefined;
    onClose?.();
    if (
      history.state &&
      (history.state as { auCalendarFullscreen?: string }).auCalendarFullscreen ===
        HISTORY_KEY
    ) {
      history.back();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._lockScroll(false);
    this._unbindGlobal();
    this._teardownObserver();
  }

  private _applySync(opts: AuCalendarFullscreenSync): void {
    if (opts.title != null) this.title = opts.title;
    if (opts.events != null) this.events = opts.events;
    if (opts.entities != null) this.entities = opts.entities;
    if (opts.config != null) this.config = opts.config;
    if (opts.language != null) this.language = opts.language;
    if (opts.now != null) this.now = opts.now;
    if (opts.loading != null) this.loading = opts.loading;
    if (opts.error !== undefined) this.error = opts.error;
  }

  private _t(key: TranslationKey): string {
    return localize(this.language, key);
  }

  private _timeFormat(): '12h' | '24h' {
    return this.config?.time_format === '12h' ? '12h' : '24h';
  }

  /** Visible calendars only — ended events stay (unlike compact agenda). */
  private _visibleEvents(): AuCalendarEvent[] {
    return this.events.filter((e) => !this._hiddenEntities.has(e.entityId));
  }

  private _eventsForDay(day: Date): AuCalendarEvent[] {
    return this._visibleEvents()
      .filter((e) => eventOverlapsLocalDay(e, day))
      .sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        return a.start.getTime() - b.start.getTime();
      });
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
      history.pushState({ auCalendarFullscreen: HISTORY_KEY }, '');
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
        this._teardownObserver();
        this._onClose?.();
        this._onRefresh = undefined;
        this._onMonthChange = undefined;
        this._onClose = undefined;
      }
    };
    this._keyHandler = (ev: KeyboardEvent) => {
      if (!this._open) return;
      if (ev.key === 'Escape') {
        if (this._detail) {
          this._detail = null;
          return;
        }
        this.close();
        return;
      }
      if (this._detail) return;
      if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        this._nudgeSelected(-1);
      } else if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        this._nudgeSelected(1);
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        this._nudgeSelected(-7);
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        this._nudgeSelected(7);
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

  private _observeMonth(): void {
    this._teardownObserver();
    const grid = this.renderRoot.querySelector('.month-grid');
    if (!grid || typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      this._cellWidth = Math.max(40, w / 7);
    });
    this._resizeObserver.observe(grid);
  }

  private _teardownObserver(): void {
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
  }

  private _nudgeSelected(deltaDays: number): void {
    const next = new Date(this._selectedDay);
    next.setDate(next.getDate() + deltaDays);
    this._selectedDay = startOfLocalDay(next);
    const month = startOfLocalMonth(this._selectedDay);
    if (!isSameLocalDay(month, this._visibleMonth)) {
      this._visibleMonth = month;
      this._onMonthChange?.(month);
      void this.updateComplete.then(() => this._observeMonth());
    }
  }

  private _goToday = (ev: Event): void => {
    ev.stopPropagation();
    const today = startOfLocalDay(new Date());
    this._selectedDay = today;
    const month = startOfLocalMonth(today);
    if (!isSameLocalDay(month, this._visibleMonth)) {
      this._visibleMonth = month;
      this._onMonthChange?.(month);
    }
    void this.updateComplete.then(() => this._observeMonth());
  };

  private _shiftMonth = (delta: number) => (ev: Event): void => {
    ev.stopPropagation();
    const next = startOfLocalMonth(this._visibleMonth);
    next.setMonth(next.getMonth() + delta);
    this._visibleMonth = next;
    this._onMonthChange?.(next);
    void this.updateComplete.then(() => this._observeMonth());
  };

  private _setView = (view: AuCalendarView) => (ev: Event): void => {
    ev.stopPropagation();
    if (!isAuCalendarView(view)) return;
    this._view = view;
    this._detail = null;
    if (view === 'month') {
      void this.updateComplete.then(() => this._observeMonth());
    }
  };

  private _toggleFilters = (ev: Event): void => {
    ev.stopPropagation();
    this._filtersOpen = !this._filtersOpen;
  };

  private _toggleEntity = (entityId: string) => (ev: Event): void => {
    ev.stopPropagation();
    const next = new Set(this._hiddenEntities);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    this._hiddenEntities = next;
  };

  private _selectDay = (day: Date) => (ev: Event): void => {
    ev.stopPropagation();
    this._selectedDay = startOfLocalDay(day);
  };

  private _openDetail = (event: AuCalendarEvent) => (ev: Event): void => {
    ev.stopPropagation();
    this._detail = event;
  };

  private _closeDetail = (ev?: Event): void => {
    ev?.stopPropagation();
    this._detail = null;
  };

  private _monthTitle(): string {
    try {
      return new Intl.DateTimeFormat(this.language || 'en', {
        month: 'long',
        year: 'numeric',
      }).format(this._visibleMonth);
    } catch {
      return this._visibleMonth.toDateString();
    }
  }

  private _renderEventRow(event: AuCalendarEvent): TemplateResult {
    const showLabel = this.config?.show_calendar_label !== false;
    const showLoc = this.config?.show_location !== false;
    const time = formatEventTimeRange(
      event,
      this._timeFormat(),
      this.config?.timezone ?? 'local',
      this._t('calendar.all_day'),
    );
    const metaParts = [time];
    if (showLabel && event.label) metaParts.push(event.label);
    if (showLoc && event.location) metaParts.push(event.location);
    return html`
      <button type="button" class="event" @click=${this._openDetail(event)}>
        <span
          class="dot"
          style=${styleMap({ '--au-cal-color': event.color })}
        ></span>
        <span class="event-main">
          <span class="summary">${event.summary}</span>
          <span class="meta">${metaParts.join(' · ')}</span>
        </span>
      </button>
    `;
  }

  private _renderDayAgenda(day: Date): TemplateResult {
    const list = this._eventsForDay(day);
    if (list.length === 0) {
      return html`<div class="status">${this._t('calendar.no_events')}</div>`;
    }
    const allDay = list.filter((e) => e.allDay);
    const timed = list.filter((e) => !e.allDay);
    return html`
      <div class="day-header">
        ${formatDayHeader(day, this.language)}
      </div>
      ${allDay.map((e) => this._renderEventRow(e))}
      ${timed.map((e) => this._renderEventRow(e))}
    `;
  }

  private _renderAgendaList(): TemplateResult {
    const events = this._visibleEvents();
    if (events.length === 0) {
      return html`<div class="status">${this._t('calendar.no_events')}</div>`;
    }
    const groups = groupEventsByDay(events);
    return html`
      ${groups.map(
        (g) => html`
          <div>
            <div class="day-header">
              ${formatDayHeader(g.date, this.language)}
            </div>
            ${g.events.map((e) => this._renderEventRow(e))}
          </div>
        `,
      )}
    `;
  }

  private _renderWeek(): TemplateResult {
    const start = startOfLocalWeek(this._selectedDay);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    const now = new Date();
    return html`
      <div class="week">
        ${days.map((day) => {
          const list = this._eventsForDay(day);
          return html`
            <div
              class=${classMap({
                'week-day': true,
                today: isSameLocalDay(day, now),
              })}
            >
              <div class="week-day-num">${day.getDate()}</div>
              ${list.map(
                (e) => html`
                  <button
                    type="button"
                    class="week-chip"
                    style=${styleMap({ '--au-cal-color': e.color })}
                    title=${e.summary}
                    @click=${this._openDetail(e)}
                  >
                    ${e.summary}
                  </button>
                `,
              )}
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderRichMonth(): TemplateResult {
    const monthStart = startOfLocalMonth(this._visibleMonth);
    const grid = buildMonthGrid(monthStart);
    const now = new Date();
    const active = this._visibleEvents();
    const spanning = active.filter(isSpanningEvent);
    const bars = layoutMonthSpanBars(spanning, grid);
    const spanUids = new Set(spanning.map((e) => e.uid));
    // Reserve vertical space: day number ~22px + lanes of span bars.
    const maxLane = bars.reduce((m, b) => Math.max(m, b.lane), -1);
    const spanBand = (maxLane + 1) * 18;
    const cellHeightApprox = Math.max(72, (this._cellWidth * 6) / 7);
    const chipLines = Math.max(
      1,
      Math.floor((cellHeightApprox - 28 - spanBand) / 16),
    );

    return html`
      <div class="month-nav">
        <button
          type="button"
          class="icon-btn"
          aria-label=${this._t('calendar.prev_month')}
          @click=${this._shiftMonth(-1)}
        >
          ‹
        </button>
        <h2>${this._monthTitle()}</h2>
        <button type="button" class="text-btn" @click=${this._goToday}>
          ${this._t('calendar.view.today')}
        </button>
        <button
          type="button"
          class="icon-btn"
          aria-label=${this._t('calendar.next_month')}
          @click=${this._shiftMonth(1)}
        >
          ›
        </button>
      </div>
      <div class="month-wrap">
        <div class="month-dow-row">
          ${WEEKDAY_LABELS_SUN.map(
            (d) => html`<div class="month-dow">${d}</div>`,
          )}
        </div>
        <div class="month-grid">
          ${grid.map((day) => {
            const outside = day.getMonth() !== monthStart.getMonth();
            const dayEvents = this._eventsForDay(day).filter(
              (e) => !spanUids.has(e.uid),
            );
            const packed = packMonthDayChips(dayEvents, chipLines, {
              cellWidthPx: this._cellWidth,
              timeFormat: this._timeFormat(),
            });
            return html`
              <button
                type="button"
                class=${classMap({
                  'month-cell': true,
                  outside,
                  today: isSameLocalDay(day, now),
                  selected: isSameLocalDay(day, this._selectedDay),
                })}
                @click=${this._selectDay(day)}
              >
                <span class="day-num">${day.getDate()}</span>
                <div class="chip-stack" style=${styleMap({ marginTop: `${spanBand}px` })}>
                  ${packed.chips.map(
                    (chip) => html`
                      <button
                        type="button"
                        class="chip"
                        style=${styleMap({
                          '--au-cal-color': chip.event.color,
                        })}
                        title=${chip.event.summary}
                        @click=${this._openDetail(chip.event)}
                      >
                        ${chip.text}
                      </button>
                    `,
                  )}
                  ${packed.overflow > 0
                    ? html`<div class="overflow">
                        ${this._t('calendar.more_events').replace(
                          '{n}',
                          String(packed.overflow),
                        )}
                      </div>`
                    : nothing}
                </div>
              </button>
            `;
          })}
          <div class="span-layer">
            ${bars.map((bar) => {
              const left = (bar.startCol / 7) * 100;
              const width = (bar.spanDays / 7) * 100;
              return html`
                <button
                  type="button"
                  class="span-bar"
                  style=${styleMap({
                    top: `calc(${(bar.weekRow / 6) * 100}% + ${22 + bar.lane * 18}px)`,
                    left: `calc(${left}% + 2px)`,
                    width: `calc(${width}% - 4px)`,
                    '--au-cal-color': bar.event.color,
                  })}
                  title=${bar.event.summary}
                  @click=${this._openDetail(bar.event)}
                >
                  ${bar.event.summary}
                </button>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  private _renderDetail(): TemplateResult | typeof nothing {
    const event = this._detail;
    if (!event) return nothing;
    const time = formatEventTimeRange(
      event,
      this._timeFormat(),
      this.config?.timezone ?? 'local',
      this._t('calendar.all_day'),
    );
    return html`
      <div class="detail-scrim" @click=${this._closeDetail}>
        <div
          class="detail-panel"
          @click=${(ev: Event) => ev.stopPropagation()}
        >
          <div class="detail-title">${event.summary}</div>
          <div class="detail-row">${time}</div>
          ${event.label
            ? html`<div class="detail-row">
                <span
                  class="dot"
                  style=${styleMap({
                    display: 'inline-block',
                    marginTop: '0',
                    marginInlineEnd: '6px',
                    '--au-cal-color': event.color,
                  })}
                ></span
                >${event.label}
              </div>`
            : nothing}
          ${event.location && this.config?.show_location !== false
            ? html`<div class="detail-row">
                <strong>${this._t('calendar.location')}:</strong>
                ${event.location}
              </div>`
            : nothing}
          ${event.description && this.config?.show_description === true
            ? html`<div class="detail-row">
                <strong>${this._t('calendar.description')}:</strong>
                ${event.description}
              </div>`
            : nothing}
          <button type="button" class="text-btn" @click=${this._closeDetail}>
            ${this._t('calendar.close')}
          </button>
        </div>
      </div>
    `;
  }

  private _renderMain(): TemplateResult {
    if (this.error) {
      return html`<div class="pane-single">
        <div class="status error">${this.error}</div>
      </div>`;
    }
    if (this.loading && this.events.length === 0) {
      return html`<div class="pane-single"><div class="status">…</div></div>`;
    }
    if (this._view === 'month') {
      return html`
        <div class="split">
          <div class="pane pane-agenda">
            ${this._renderDayAgenda(this._selectedDay)}
          </div>
          <div class="pane">${this._renderRichMonth()}</div>
        </div>
      `;
    }
    if (this._view === 'today') {
      return html`<div class="pane-single">
        ${this._renderDayAgenda(startOfLocalDay(new Date()))}
      </div>`;
    }
    if (this._view === 'week') {
      return html`<div class="pane-single">${this._renderWeek()}</div>`;
    }
    return html`<div class="pane-single">${this._renderAgendaList()}</div>`;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    return html`
      <div
        class="scrim"
        @click=${(ev: Event) => {
          if (ev.target === ev.currentTarget) this.close();
        }}
      >
        <div
          class="sheet"
          role="dialog"
          aria-modal="true"
          aria-label=${this.title}
          @click=${(ev: Event) => ev.stopPropagation()}
        >
          <div class="header">
            <div class="toolbar-row">
              <div class="toolbar-start">
                <div class="views">
                  ${(
                    ['agenda', 'today', 'week', 'month'] as AuCalendarView[]
                  ).map(
                    (v) => html`
                      <button
                        type="button"
                        class=${classMap({ active: this._view === v })}
                        @click=${this._setView(v)}
                      >
                        ${this._t(VIEW_KEYS[v])}
                      </button>
                    `,
                  )}
                </div>
              </div>
              <div class="toolbar-end">
                <div class="filter-menu">
                  <button
                    class="icon-btn"
                    type="button"
                    aria-label=${this._t('calendar.filter')}
                    aria-expanded=${this._filtersOpen ? 'true' : 'false'}
                    @click=${this._toggleFilters}
                  >
                    <ha-icon .icon=${'mdi:filter-variant'}></ha-icon>
                  </button>
                  ${this._filtersOpen
                    ? html`
                        <div class="filters filters-popover">
                          ${this.entities.map((ent) => {
                            const active = !this._hiddenEntities.has(
                              ent.entity,
                            );
                            return html`
                              <button
                                type="button"
                                class=${classMap({
                                  active,
                                  dimmed: !active,
                                })}
                                style=${styleMap({
                                  borderInlineStart: `3px solid ${ent.color ?? '#007AFF'}`,
                                })}
                                @click=${this._toggleEntity(ent.entity)}
                              >
                                ${ent.label ||
                                ent.entity.replace(/^calendar\./, '')}
                              </button>
                            `;
                          })}
                        </div>
                      `
                    : nothing}
                </div>
                <button
                  type="button"
                  class="text-btn"
                  @click=${(ev: Event) => {
                    ev.stopPropagation();
                    this._onRefresh?.();
                  }}
                >
                  ${this._t('calendar.refresh')}
                </button>
                <button
                  class="icon-btn"
                  type="button"
                  aria-label=${this._t('calendar.close')}
                  @click=${() => this.close()}
                >
                  <ha-icon .icon=${'mdi:close'}></ha-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="body">${this._renderMain()}</div>
          ${this._renderDetail()}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-calendar-fullscreen-overlay': AuCalendarFullscreenOverlay;
  }
}

/** Ensure a single overlay instance exists and return it. */
export function ensureCalendarFullscreenOverlay(): AuCalendarFullscreenOverlay {
  const existing = document.querySelector(
    'au-calendar-fullscreen-overlay',
  ) as AuCalendarFullscreenOverlay | null;
  if (existing) return existing;
  const el = document.createElement(
    'au-calendar-fullscreen-overlay',
  ) as AuCalendarFullscreenOverlay;
  document.body.appendChild(el);
  return el;
}

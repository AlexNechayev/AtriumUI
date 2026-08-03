import {
  html,
  css,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { AuCardContent } from '../../core/card-content';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { localize } from '../../localize/localize';
import type { TranslationKey } from '../../localize/en';
import type {
  AuCalendarCardConfig,
  AuCalendarEvent,
  AuCalendarView,
} from '../../types/calendar';
import {
  isAuCalendarView,
  normalizeCalendarEntities,
} from '../../types/calendar';
import {
  buildMonthGrid,
  computeFetchWindow,
  computeMonthGridWindow,
  eventOverlapsLocalDay,
  fetchCalendarEvents,
  formatDayHeader,
  formatEventTimeRange,
  groupEventsByDay,
  isSameLocalDay,
  normalizeCalendarEvents,
  startOfLocalDay,
  startOfLocalMonth,
  startOfLocalWeek,
  WEEKDAY_LABELS_SUN,
} from '../../utils/calendar';
import {
  ensureCalendarFullscreenOverlay,
  type AuCalendarFullscreenOverlay,
} from './au-calendar-fullscreen-overlay';
import './au-calendar-card-editor';

const VIEW_KEYS: Record<AuCalendarView, TranslationKey> = {
  agenda: 'calendar.view.agenda',
  today: 'calendar.view.today',
  week: 'calendar.view.week',
  month: 'calendar.view.month',
};

/**
 * `au-calendar-card` — Apple Calendar–inspired, view-only preview of HA
 * `calendar.*` entities (Google, CalDAV/iCloud, Local, etc.).
 */
@customElement('au-calendar-card')
export class AuCalendarCard extends AuCardContent<AuCalendarCardConfig> {
  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
      .cal {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        gap: var(--au-gap-sm);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: var(--au-gap-sm);
        flex: 0 0 auto;
        min-width: 0;
      }
      .title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: var(--au-font-primary);
        font-weight: var(--au-weight-bold);
        color: var(--au-home-label, var(--au-primary-text));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .toolbar button {
        appearance: none;
        border: none;
        background: color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 12%, transparent);
        color: var(--au-home-accent-default, #0a84ff);
        border-radius: 10px;
        padding: 6px 10px;
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
        cursor: pointer;
      }
      .toolbar button:hover {
        background: color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 20%, transparent);
      }
      .views {
        display: flex;
        gap: 4px;
        flex: 0 0 auto;
        flex-wrap: wrap;
      }
      .views button {
        padding: 4px 8px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--au-home-muted, var(--au-secondary-text));
        font-size: var(--au-font-secondary);
        cursor: pointer;
      }
      .views button.active {
        background: color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 16%, transparent);
        color: var(--au-home-accent-default, #0a84ff);
        font-weight: var(--au-weight-medium);
      }
      .body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
      }
      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 4rem;
        color: var(--au-home-muted, var(--au-secondary-text));
        font-size: var(--au-font-secondary);
        text-align: center;
        padding: var(--au-gap);
      }
      .status.error {
        color: var(--au-error, #ff3b30);
      }
      .day-group {
        margin-bottom: var(--au-gap);
      }
      .day-header {
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-bold);
        color: var(--au-home-accent-default, #0a84ff);
        margin-bottom: 6px;
        letter-spacing: 0.01em;
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
        background: color-mix(in srgb, var(--au-home-label, #000) 5%, transparent);
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
        color: var(--au-home-label, var(--au-primary-text));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .meta {
        font-size: var(--au-font-secondary);
        color: var(--au-home-muted, var(--au-secondary-text));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .week {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 4px;
      }
      .week-day {
        min-height: 4.5rem;
        border-radius: 10px;
        padding: 4px;
        background: color-mix(in srgb, var(--au-home-label, #000) 4%, transparent);
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .week-day.today {
        outline: 1px solid color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 55%, transparent);
      }
      .week-day-num {
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-bold);
        color: var(--au-home-muted, var(--au-secondary-text));
      }
      .week-chip {
        font-size: 0.65rem;
        line-height: 1.2;
        padding: 2px 4px;
        border-radius: 4px;
        color: #fff;
        background: var(--au-cal-color, #007aff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border: none;
        cursor: pointer;
        text-align: start;
      }
      .month {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 2px;
      }
      .month-dow {
        text-align: center;
        font-size: 0.65rem;
        color: var(--au-home-muted, var(--au-secondary-text));
        padding: 2px 0;
      }
      .month-cell {
        aspect-ratio: 1;
        border: none;
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        color: var(--au-home-label, var(--au-primary-text));
        font-size: var(--au-font-secondary);
        padding: 2px;
      }
      .month-cell.outside {
        opacity: 0.35;
      }
      .month-cell.selected,
      .month-cell.today {
        background: color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 14%, transparent);
      }
      .month-dots {
        display: flex;
        gap: 2px;
        min-height: 4px;
      }
      .month-dots span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--au-cal-color, #007aff);
      }
      .sheet {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background: color-mix(in srgb, #000 35%, transparent);
        border-radius: inherit;
      }
      .sheet-panel {
        background: var(--au-home-surface-elevated, var(--ha-card-background, #fff));
        border-radius: 16px 16px 12px 12px;
        padding: var(--au-home-pad, 16px);
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 80%;
        overflow: auto;
      }
      .sheet-title {
        font-size: 1.15rem;
        font-weight: var(--au-weight-bold);
        color: var(--au-home-label, var(--au-primary-text));
      }
      .sheet-row {
        font-size: var(--au-font-secondary);
        color: var(--au-home-muted, var(--au-secondary-text));
      }
      .sheet-row strong {
        color: var(--au-home-label, var(--au-primary-text));
        font-weight: var(--au-weight-medium);
      }
      .sheet-panel > button {
        appearance: none;
        align-self: flex-start;
        border: none;
        background: color-mix(in srgb, var(--au-home-accent-default, #0a84ff) 12%, transparent);
        color: var(--au-home-accent-default, #0a84ff);
        border-radius: 10px;
        padding: 8px 12px;
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
        cursor: pointer;
        margin-top: 4px;
      }
      .au-card.calendar-card {
        position: relative;
        border: none;
        border-radius: var(--au-home-radius, 20px);
        background: var(--au-home-surface-elevated, var(--ha-card-background, #fff));
        box-shadow: var(--au-home-shadow, none);
        padding: var(--au-home-pad, 16px);
        overflow: hidden;
      }
      .au-card.calendar-card.compact .week-day {
        min-height: 3rem;
      }
      .au-card.calendar-card.compact .event {
        padding: 6px 2px;
      }
    `,
  ];

  @state() private _events: AuCalendarEvent[] = [];
  @state() private _loading = false;
  @state() private _error: string | null = null;
  @state() private _activeView: AuCalendarView = 'agenda';
  @state() private _selectedDay: Date = startOfLocalDay(new Date());
  @state() private _detail: AuCalendarEvent | null = null;
  /** Live clock for dropping events after they end between polls. */
  @state() private _now = Date.now();

  private _pollStarted = false;
  private _clockStarted = false;
  private _fetchGen = 0;
  /** When set, fetch covers this month grid (fullscreen open). */
  private _fsMonth: Date | null = null;
  private _fsOverlay: AuCalendarFullscreenOverlay | null = null;

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-calendar-card-editor');
  }

  public static getStubConfig(): AuCalendarCardConfig {
    return {
      type: 'custom:au-calendar-card',
      view: 'agenda',
      entities: [],
      days: 31,
      max_events: 12,
      refresh_minutes: 60,
    };
  }

  protected validateConfig(config: AuCalendarCardConfig): void {
    const entities = normalizeCalendarEntities(config.entities);
    if (entities.length === 0) {
      throw new Error('AtriumUI Calendar Card: at least one calendar entity is required');
    }
    for (const e of entities) {
      if (!e.entity.startsWith('calendar.')) {
        throw new Error(
          `AtriumUI Calendar Card: "${e.entity}" must be a calendar.* entity`,
        );
      }
    }
  }

  protected override watchedEntities(): string[] {
    return normalizeCalendarEntities(this._config?.entities).map((e) => e.entity);
  }

  public override getCardSize(): number {
    const view = this._resolvedView();
    if (view === 'month') return 4;
    if (view === 'week') return 3;
    return 2;
  }

  private _t(key: TranslationKey): string {
    return localize(this.hass?.language, key);
  }

  private _resolvedView(): AuCalendarView {
    if (isAuCalendarView(this._activeView)) return this._activeView;
    return 'agenda';
  }

  private _entityConfigs() {
    return normalizeCalendarEntities(this._config?.entities);
  }

  private _maxEvents(): number {
    const base = this._config?.max_events ?? 12;
    // Compact card shows a shorter list; fullscreen agenda is uncapped separately.
    if (this._config?.expand_on_tap !== false) {
      return Math.max(3, Math.ceil(base / 2));
    }
    return Math.max(1, base);
  }

  private _timeFormat(): '12h' | '24h' {
    return this._config?.time_format === '12h' ? '12h' : '24h';
  }

  /** Events still active at `_now` (end exclusive). */
  private _activeEvents(): AuCalendarEvent[] {
    return this._events.filter((e) => e.end.getTime() > this._now);
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('_config')) {
      const view = isAuCalendarView(this._config?.view)
        ? this._config!.view!
        : 'agenda';
      this._activeView = view;
      this._ensurePoll();
      this._ensureClock();
      void this._refresh();
      this._syncFullscreen();
      return;
    }
    if (
      changed.has('_events') ||
      changed.has('_loading') ||
      changed.has('_error') ||
      changed.has('_now')
    ) {
      this._syncFullscreen();
    }
    if (changed.has('hass')) {
      this._ensurePoll();
      this._ensureClock();
      const prev = changed.get('hass') as typeof this.hass;
      const ids = this.watchedEntities();
      const entityChanged =
        !prev ||
        ids.some((id) => prev.states[id] !== this.hass?.states[id]);
      if (entityChanged || !prev) {
        void this._refresh();
      } else {
        this._syncFullscreen();
      }
    }
  }

  private _ensurePoll(): void {
    if (this._pollStarted || !this._config) return;
    this._pollStarted = true;
    const minutes = Math.max(1, this._config.refresh_minutes ?? 60);
    const id = window.setInterval(() => {
      void this._refresh();
    }, minutes * 60_000);
    this.registerTeardown(() => window.clearInterval(id));

    const onVis = (): void => {
      if (document.visibilityState === 'visible') void this._refresh();
    };
    document.addEventListener('visibilitychange', onVis);
    this.registerTeardown(() =>
      document.removeEventListener('visibilitychange', onVis),
    );
  }

  private _ensureClock(): void {
    if (this._clockStarted || !this._config) return;
    this._clockStarted = true;
    this._now = Date.now();
    const id = window.setInterval(() => {
      this._now = Date.now();
    }, 60_000);
    this.registerTeardown(() => window.clearInterval(id));
  }

  private async _refresh(): Promise<void> {
    if (!this.hass || !this._config) return;

    const entities = this._entityConfigs();
    if (entities.length === 0) return;

    const view = this._resolvedView();
    const days = this._config.days ?? 31;
    const fsOpen = this._fsOverlay?.isOpen === true && this._fsMonth != null;
    const { start, end } = fsOpen
      ? computeMonthGridWindow(this._fsMonth!)
      : view === 'month'
        ? computeMonthGridWindow(startOfLocalMonth(new Date()))
        : computeFetchWindow(view, days);
    const gen = ++this._fetchGen;
    this._loading = true;
    this._error = null;

    try {
      const raw = await fetchCalendarEvents(
        this.hass,
        entities.map((e) => e.entity),
        start,
        end,
      );
      if (gen !== this._fetchGen) return;
      // Drop ended events only for compact agenda preview. Fullscreen (and
      // week/month/today) keep the full day so past events remain visible.
      const compactAgenda = !fsOpen && view === 'agenda';
      this._events = normalizeCalendarEvents(raw, entities, {
        hideAllDay: this._config.hide_all_day === true,
        allowlist: this._config.allowlist,
        blocklist: this._config.blocklist,
        now: compactAgenda ? new Date() : undefined,
        maxEvents:
          !fsOpen && (view === 'agenda' || view === 'today')
            ? this._maxEvents()
            : undefined,
      });
    } catch {
      if (gen !== this._fetchGen) return;
      this._events = [];
      this._error = this._t('calendar.error');
    } finally {
      if (gen === this._fetchGen) this._loading = false;
    }
  }

  private _fullscreenPayload() {
    const title = this._config?.title?.trim() || this._t('calendar.title');
    return {
      title,
      events: this._events,
      entities: this._entityConfigs(),
      config: this._config!,
      language: this.hass?.language,
      now: this._now,
      loading: this._loading,
      error: this._error,
    };
  }

  private _syncFullscreen(): void {
    if (!this._fsOverlay?.isOpen || !this._config) return;
    this._fsOverlay.sync(this._fullscreenPayload());
  }

  private _openFullscreen = (ev: Event): void => {
    ev.stopPropagation();
    if (!this._config || this._config.expand_on_tap === false) return;
    const overlay = ensureCalendarFullscreenOverlay();
    this._fsOverlay = overlay;
    this._fsMonth = startOfLocalMonth(new Date());
    overlay.open({
      ...this._fullscreenPayload(),
      onRefresh: () => {
        void this._refresh();
      },
      onMonthChange: (monthStart) => {
        this._fsMonth = startOfLocalMonth(monthStart);
        void this._refresh();
      },
      onClose: () => {
        this._fsMonth = null;
        this._fsOverlay = null;
        void this._refresh();
      },
    });
    void this._refresh();
  };

  private _setView = (view: AuCalendarView) => (ev: Event): void => {
    ev.stopPropagation();
    this._activeView = view;
    void this._refresh();
  };

  private _openDetail = (event: AuCalendarEvent) => (ev: Event): void => {
    ev.stopPropagation();
    this._detail = event;
  };

  private _closeDetail = (ev?: Event): void => {
    ev?.stopPropagation();
    this._detail = null;
  };

  private _selectDay = (day: Date) => (ev: Event): void => {
    ev.stopPropagation();
    this._selectedDay = startOfLocalDay(day);
  };

  private _eventsForDay(day: Date): AuCalendarEvent[] {
    return this._events.filter((e) => eventOverlapsLocalDay(e, day));
  }

  private _renderEventRow(event: AuCalendarEvent): TemplateResult {
    const showLabel = this._config?.show_calendar_label !== false;
    const showLoc = this._config?.show_location !== false;
    const time = formatEventTimeRange(
      event,
      this._timeFormat(),
      this._config?.timezone ?? 'local',
      this._t('calendar.all_day'),
    );
    const metaParts = [time];
    if (showLabel && event.label) metaParts.push(event.label);
    if (showLoc && event.location) metaParts.push(event.location);

    return html`
      <button
        type="button"
        class="event"
        @click=${this._openDetail(event)}
      >
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

  private _renderAgenda(events: AuCalendarEvent[]): TemplateResult {
    if (events.length === 0) {
      return html`<div class="status">${this._t('calendar.no_events')}</div>`;
    }
    const groups = groupEventsByDay(events);
    return html`
      ${groups.map(
        (g) => html`
          <div class="day-group">
            <div class="day-header">
              ${formatDayHeader(g.date, this.hass?.language)}
            </div>
            ${g.events.map((e) => this._renderEventRow(e))}
          </div>
        `,
      )}
    `;
  }

  private _renderToday(): TemplateResult {
    const day = startOfLocalDay(new Date());
    const events = this._eventsForDay(day).slice(0, this._maxEvents());
    const allDay = events.filter((e) => e.allDay);
    const timed = events.filter((e) => !e.allDay);
    if (events.length === 0) {
      return html`<div class="status">${this._t('calendar.no_events')}</div>`;
    }
    return html`
      <div class="day-header">
        ${formatDayHeader(day, this.hass?.language)}
      </div>
      ${allDay.length
        ? html`
            <div class="day-group">
              ${allDay.map((e) => this._renderEventRow(e))}
            </div>
          `
        : nothing}
      ${timed.map((e) => this._renderEventRow(e))}
    `;
  }

  private _renderWeek(): TemplateResult {
    const start = startOfLocalWeek(new Date());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    const now = new Date();
    const limit = 2;
    return html`
      <div class="week">
        ${days.map((day) => {
          const list = this._eventsForDay(day).slice(0, limit);
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

  private _renderMonth(): TemplateResult {
    const monthStart = startOfLocalMonth(new Date());
    const cells = buildMonthGrid(monthStart);
    const now = new Date();
    return html`
      <div class="month">
        ${WEEKDAY_LABELS_SUN.map((d) => html`<div class="month-dow">${d}</div>`)}
        ${cells.map((day) => {
          const dayEvents = this._eventsForDay(day);
          const colors = [...new Set(dayEvents.map((e) => e.color))].slice(0, 3);
          const outside = day.getMonth() !== monthStart.getMonth();
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
              <span>${day.getDate()}</span>
              <span class="month-dots">
                ${colors.map(
                  (c) =>
                    html`<span style=${styleMap({ '--au-cal-color': c })}></span>`,
                )}
              </span>
            </button>
          `;
        })}
      </div>
      ${(() => {
        const selected = this._eventsForDay(this._selectedDay).slice(
          0,
          this._maxEvents(),
        );
        if (selected.length === 0) {
          return html`<div class="status">${this._t('calendar.no_events')}</div>`;
        }
        return html`
          <div class="day-group" style="margin-top: var(--au-gap);">
            <div class="day-header">
              ${formatDayHeader(this._selectedDay, this.hass?.language)}
            </div>
            ${selected.map((e) => this._renderEventRow(e))}
          </div>
        `;
      })()}
    `;
  }

  private _renderDetail(): TemplateResult | typeof nothing {
    const event = this._detail;
    if (!event) return nothing;
    const time = formatEventTimeRange(
      event,
      this._timeFormat(),
      this._config?.timezone ?? 'local',
      this._t('calendar.all_day'),
    );
    return html`
      <div class="sheet" @click=${this._closeDetail}>
        <div
          class="sheet-panel"
          @click=${(ev: Event) => ev.stopPropagation()}
        >
          <div class="sheet-title">${event.summary}</div>
          <div class="sheet-row">${time}</div>
          ${event.label
            ? html`<div class="sheet-row">
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
          ${event.location && this._config?.show_location !== false
            ? html`<div class="sheet-row">
                <strong>${this._t('calendar.location')}:</strong>
                ${event.location}
              </div>`
            : nothing}
          ${event.description && this._config?.show_description === true
            ? html`<div class="sheet-row">
                <strong>${this._t('calendar.description')}:</strong>
                ${event.description}
              </div>`
            : nothing}
          <button type="button" @click=${this._closeDetail}>
            ${this._t('calendar.close')}
          </button>
        </div>
      </div>
    `;
  }

  private _renderBody(): TemplateResult {
    if (this._error) {
      return html`<div class="status error">${this._error}</div>`;
    }
    if (this._loading && this._events.length === 0) {
      return html`<div class="status">…</div>`;
    }
    const view = this._resolvedView();
    if (view === 'today') return this._renderToday();
    if (view === 'week') return this._renderWeek();
    if (view === 'month') return this._renderMonth();
    return this._renderAgenda(this._activeEvents());
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const title = this._config.title?.trim() || this._t('calendar.title');
    const fullscreenEnabled = this._config.expand_on_tap !== false;
    const showPicker = this._config.show_view_picker === true;

    return this.renderCardRoot(
      {
        'calendar-card': true,
        'home-tile': true,
        compact: true,
      },
      html`
        <div class="cal">
          <div class="toolbar">
            <div class="title">${title}</div>
            ${fullscreenEnabled
              ? html`
                  <button type="button" @click=${this._openFullscreen}>
                    ${this._t('calendar.fullscreen')}
                  </button>
                `
              : nothing}
          </div>
          ${showPicker
            ? html`
                <div class="views">
                  ${(
                    ['agenda', 'today', 'week', 'month'] as AuCalendarView[]
                  ).map(
                    (v) => html`
                      <button
                        type="button"
                        class=${classMap({ active: this._resolvedView() === v })}
                        @click=${this._setView(v)}
                      >
                        ${this._t(VIEW_KEYS[v])}
                      </button>
                    `,
                  )}
                </div>
              `
            : nothing}
          <div class="body">${this._renderBody()}</div>
        </div>
        ${this._renderDetail()}
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-calendar-card': AuCalendarCard;
  }
}

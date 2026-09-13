/**
 * Dashboard settings + Global configuration bodies for the shell drawer
 * 90% cards (`docs/prd/ux/shell-drawer.md` key ownership).
 */
import { html, nothing, type TemplateResult } from 'lit';
import { localize } from '../../localize/localize';
import type { AuShellGridConfig } from '../../types/config';
import type { AuHomeRoomControlsConfig } from '../../types/home';
import type { AuDrawerCardId } from './shell-drawer-trigger';

export type AuDrawerSettingsPatch = Partial<
  Pick<
    AuShellGridConfig,
    | 'show_presence'
    | 'show_bulk_actions'
    | 'header_title'
    | 'header_greeting'
    | 'clock_format'
    | 'clock_show_date'
    | 'clock_date_format'
    | 'clock_show_day'
    | 'clock_day_format'
    | 'room_idle_timeout'
    | 'columns'
    | 'gap'
    | 'row_height'
    | 'rows'
    | 'max_rows'
    | 'width'
    | 'height'
    | 'auto_areas'
    | 'confirm_actions'
    | 'prefer_device_name'
    | 'room_controls'
  >
>;

const DASHBOARD_KEYS = new Set<keyof AuDrawerSettingsPatch>([
  'show_presence',
  'show_bulk_actions',
  'header_title',
  'header_greeting',
  'clock_format',
  'clock_show_date',
  'clock_date_format',
  'clock_show_day',
  'clock_day_format',
  'room_idle_timeout',
  'columns',
  'gap',
  'row_height',
  'rows',
  'max_rows',
  'width',
  'height',
  'auto_areas',
]);

const GLOBAL_KEYS = new Set<keyof AuDrawerSettingsPatch>([
  'confirm_actions',
  'prefer_device_name',
  'room_controls',
]);

function allowedKeys(owner: 'dashboard_settings' | 'global') {
  return owner === 'global' ? GLOBAL_KEYS : DASHBOARD_KEYS;
}

/** Drop keys the other card owns so Dashboard/Global never write each other. */
export function sanitizeDrawerSettingsPatch(
  owner: 'dashboard_settings' | 'global',
  patch: AuDrawerSettingsPatch,
): AuDrawerSettingsPatch {
  const allowed = allowedKeys(owner);
  const next: AuDrawerSettingsPatch = {};
  for (const key of Object.keys(patch) as Array<keyof AuDrawerSettingsPatch>) {
    if (allowed.has(key) && patch[key] !== undefined) {
      (next as Record<string, unknown>)[key] = patch[key];
    }
  }
  return next;
}

export function applyShellSettingsPatch(
  config: AuShellGridConfig,
  patch: AuDrawerSettingsPatch,
): AuShellGridConfig {
  const next: AuShellGridConfig = { ...config, ...patch };
  if (patch.room_controls) {
    next.room_controls = {
      ...config.room_controls,
      ...patch.room_controls,
    };
  }
  return next;
}

function stop(ev: Event): void {
  ev.stopPropagation();
}

function checkbox(
  setting: string,
  checked: boolean,
  label: string,
  onChange: (checked: boolean) => void,
): TemplateResult {
  return html`
    <label class="au-drawer-check">
      <input
        type="checkbox"
        data-setting=${setting}
        .checked=${checked}
        @click=${stop}
        @change=${(ev: Event) => {
          ev.stopPropagation();
          onChange((ev.target as HTMLInputElement).checked);
        }}
      />
      <span>${label}</span>
    </label>
  `;
}

function textField(
  setting: string,
  value: string,
  label: string,
  onChange: (value: string) => void,
): TemplateResult {
  return html`
    <label class="au-drawer-field">
      <span>${label}</span>
      <input
        type="text"
        data-setting=${setting}
        .value=${value}
        @click=${stop}
        @change=${(ev: Event) => {
          ev.stopPropagation();
          onChange((ev.target as HTMLInputElement).value);
        }}
      />
    </label>
  `;
}

function numberField(
  setting: string,
  value: number | undefined,
  label: string,
  onChange: (value: number) => void,
  min = 0,
): TemplateResult {
  return html`
    <label class="au-drawer-field">
      <span>${label}</span>
      <input
        type="number"
        data-setting=${setting}
        min=${min}
        .value=${value === undefined ? '' : String(value)}
        @click=${stop}
        @change=${(ev: Event) => {
          ev.stopPropagation();
          const raw = (ev.target as HTMLInputElement).value;
          const parsed = Number(raw);
          if (raw === '' || Number.isNaN(parsed)) return;
          onChange(parsed);
        }}
      />
    </label>
  `;
}

function selectField(
  setting: string,
  value: string,
  label: string,
  options: Array<{ value: string; label: string }>,
  onChange: (value: string) => void,
): TemplateResult {
  return html`
    <label class="au-drawer-field">
      <span>${label}</span>
      <select
        data-setting=${setting}
        .value=${value}
        @click=${stop}
        @change=${(ev: Event) => {
          ev.stopPropagation();
          onChange((ev.target as HTMLSelectElement).value);
        }}
      >
        ${options.map(
          (opt) => html`<option value=${opt.value}>${opt.label}</option>`,
        )}
      </select>
    </label>
  `;
}

export function renderDrawerDashboardSettings(
  config: AuShellGridConfig,
  language: string | undefined,
  onPatch: (patch: AuDrawerSettingsPatch) => void,
): TemplateResult {
  const emit = (patch: AuDrawerSettingsPatch) =>
    onPatch(sanitizeDrawerSettingsPatch('dashboard_settings', patch));
  return html`
    <form class="au-drawer-form" @submit=${(ev: Event) => ev.preventDefault()}>
      ${checkbox(
        'show_presence',
        config.show_presence !== false,
        localize(language, 'drawer.settings.show_presence'),
        (checked) => emit({ show_presence: checked }),
      )}
      ${checkbox(
        'show_bulk_actions',
        config.show_bulk_actions !== false,
        localize(language, 'drawer.settings.show_bulk_actions'),
        (checked) => emit({ show_bulk_actions: checked }),
      )}
      ${checkbox(
        'header_greeting',
        config.header_greeting === true,
        localize(language, 'drawer.settings.header_greeting'),
        (checked) => emit({ header_greeting: checked }),
      )}
      ${textField(
        'header_title',
        config.header_title ?? '',
        localize(language, 'drawer.settings.header_title'),
        (value) => emit({ header_title: value }),
      )}
      ${selectField(
        'clock_format',
        config.clock_format ?? '24h',
        localize(language, 'drawer.settings.clock_format'),
        [
          {
            value: '24h',
            label: localize(language, 'drawer.settings.clock_24h'),
          },
          {
            value: '12h',
            label: localize(language, 'drawer.settings.clock_12h'),
          },
        ],
        (value) => emit({ clock_format: value as '12h' | '24h' }),
      )}
      ${checkbox(
        'clock_show_date',
        config.clock_show_date !== false,
        localize(language, 'drawer.settings.clock_show_date'),
        (checked) => emit({ clock_show_date: checked }),
      )}
      ${selectField(
        'clock_date_format',
        config.clock_date_format ?? 'dd/mm',
        localize(language, 'drawer.settings.clock_date_format'),
        [
          { value: 'dd/mm', label: 'DD/MM' },
          { value: 'mm/dd', label: 'MM/DD' },
        ],
        (value) => emit({ clock_date_format: value as 'dd/mm' | 'mm/dd' }),
      )}
      ${checkbox(
        'clock_show_day',
        config.clock_show_day !== false,
        localize(language, 'drawer.settings.clock_show_day'),
        (checked) => emit({ clock_show_day: checked }),
      )}
      ${selectField(
        'clock_day_format',
        config.clock_day_format ?? 'short',
        localize(language, 'drawer.settings.clock_day_format'),
        [
          {
            value: 'short',
            label: localize(language, 'drawer.settings.clock_day_short'),
          },
          {
            value: 'long',
            label: localize(language, 'drawer.settings.clock_day_long'),
          },
        ],
        (value) => emit({ clock_day_format: value as 'short' | 'long' }),
      )}
      ${numberField(
        'room_idle_timeout',
        config.room_idle_timeout,
        localize(language, 'drawer.settings.room_idle_timeout'),
        (value) => emit({ room_idle_timeout: value }),
      )}
      ${numberField(
        'columns',
        config.columns,
        localize(language, 'drawer.settings.columns'),
        (value) => emit({ columns: value }),
        1,
      )}
      ${textField(
        'gap',
        config.gap ?? '',
        localize(language, 'drawer.settings.gap'),
        (value) => emit({ gap: value }),
      )}
      ${textField(
        'row_height',
        config.row_height ?? '',
        localize(language, 'drawer.settings.row_height'),
        (value) => emit({ row_height: value }),
      )}
      ${numberField(
        'rows',
        config.rows,
        localize(language, 'drawer.settings.rows'),
        (value) => emit({ rows: value }),
        1,
      )}
      ${numberField(
        'max_rows',
        config.max_rows,
        localize(language, 'drawer.settings.max_rows'),
        (value) => emit({ max_rows: value }),
        1,
      )}
      ${textField(
        'width',
        config.width ?? '',
        localize(language, 'drawer.settings.width'),
        (value) => emit({ width: value }),
      )}
      ${textField(
        'height',
        config.height ?? '',
        localize(language, 'drawer.settings.height'),
        (value) => emit({ height: value }),
      )}
      ${checkbox(
        'auto_areas',
        config.auto_areas === true,
        localize(language, 'drawer.settings.auto_areas'),
        (checked) => emit({ auto_areas: checked }),
      )}
    </form>
  `;
}

export function renderDrawerGlobalSettings(
  config: AuShellGridConfig,
  language: string | undefined,
  onPatch: (patch: AuDrawerSettingsPatch) => void,
): TemplateResult {
  const emit = (patch: AuDrawerSettingsPatch) =>
    onPatch(sanitizeDrawerSettingsPatch('global', patch));
  const controls: AuHomeRoomControlsConfig = config.room_controls ?? {};
  return html`
    <form class="au-drawer-form" @submit=${(ev: Event) => ev.preventDefault()}>
      ${checkbox(
        'confirm_actions',
        config.confirm_actions === true,
        localize(language, 'drawer.settings.confirm_actions'),
        (checked) => emit({ confirm_actions: checked }),
      )}
      ${checkbox(
        'prefer_device_name',
        config.prefer_device_name !== false,
        localize(language, 'drawer.settings.prefer_device_name'),
        (checked) => emit({ prefer_device_name: checked }),
      )}
      ${checkbox(
        'room_controls.show',
        controls.show !== false,
        localize(language, 'drawer.settings.room_controls_show'),
        (checked) => emit({ room_controls: { show: checked } }),
      )}
    </form>
  `;
}

export function renderDrawerSettingsBody(
  cardId: AuDrawerCardId | null,
  config: AuShellGridConfig | undefined,
  language: string | undefined,
  onPatch: (patch: AuDrawerSettingsPatch) => void,
): TemplateResult | typeof nothing {
  if (!cardId || !config || cardId === 'automations') return nothing;
  if (cardId === 'dashboard_settings') {
    return renderDrawerDashboardSettings(config, language, onPatch);
  }
  return renderDrawerGlobalSettings(config, language, onPatch);
}

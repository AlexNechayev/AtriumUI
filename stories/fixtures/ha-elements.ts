import * as mdiJs from '@mdi/js';
import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

type FormSchema = {
  name?: string;
  selector?: Record<string, unknown>;
  type?: string;
};

type StateLike = {
  entity_id?: string;
  attributes?: Record<string, unknown>;
};

const MDI_PATHS = mdiJs as Record<string, string>;

const DOMAIN_ICONS: Record<string, string> = {
  light: 'mdi:lightbulb',
  switch: 'mdi:toggle-switch',
  climate: 'mdi:thermostat',
  fan: 'mdi:fan',
  cover: 'mdi:blinds',
  vacuum: 'mdi:robot-vacuum',
  sensor: 'mdi:eye',
  binary_sensor: 'mdi:checkbox-marked-circle',
  water_heater: 'mdi:water-boiler',
  calendar: 'mdi:calendar',
  person: 'mdi:account',
  lock: 'mdi:lock',
  media_player: 'mdi:cast',
  scene: 'mdi:palette',
  script: 'mdi:script-text',
  automation: 'mdi:robot',
  input_boolean: 'mdi:toggle-switch',
};

function defineOnce(tag: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

/** Map `mdi:home-map-marker` → `mdiHomeMapMarker` for `@mdi/js`. */
function mdiExportName(icon: string): string {
  const name = icon.replace(/^mdi:/i, '').trim();
  if (!name) return '';
  return `mdi${name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`;
}

function mdiPath(icon: string): string {
  const key = mdiExportName(icon);
  const path = key ? MDI_PATHS[key] : undefined;
  if (typeof path === 'string' && path.length > 0) return path;
  return MDI_PATHS.mdiHelpCircle ?? '';
}

function paintMdiIcon(host: HTMLElement, icon: string): void {
  const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
  const d = mdiPath(icon);
  root.innerHTML = `
    <style>
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--mdc-icon-size, 24px);
        height: var(--mdc-icon-size, 24px);
        line-height: 1;
        color: inherit;
        flex: 0 0 auto;
      }
      svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
        display: block;
      }
    </style>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"></path></svg>
  `;
}

function resolveStateIcon(stateObj: StateLike | undefined, override?: string): string {
  if (override) return override;
  const attrIcon = stateObj?.attributes?.icon;
  if (typeof attrIcon === 'string' && attrIcon) return attrIcon;
  const domain = (stateObj?.entity_id ?? '').split('.')[0] ?? '';
  return DOMAIN_ICONS[domain] ?? 'mdi:help-circle';
}

class HaIconStub extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['icon'];
  }

  private _icon = '';

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value ?? '';
    if (this.getAttribute('icon') !== this._icon) {
      this.setAttribute('icon', this._icon);
    }
    paintMdiIcon(this, this._icon);
  }

  connectedCallback(): void {
    this._icon = this.getAttribute('icon') ?? this._icon;
    paintMdiIcon(this, this._icon);
  }

  attributeChangedCallback(): void {
    const next = this.getAttribute('icon') ?? '';
    if (next === this._icon && this.shadowRoot) return;
    this._icon = next;
    paintMdiIcon(this, this._icon);
  }
}

class HaStateIconStub extends HTMLElement {
  hass?: unknown;
  private _stateObj?: StateLike;
  private _iconOverride = '';

  get stateObj(): StateLike | undefined {
    return this._stateObj;
  }

  set stateObj(value: StateLike | undefined) {
    this._stateObj = value;
    this._paint();
  }

  get icon(): string {
    return this._iconOverride;
  }

  set icon(value: string) {
    this._iconOverride = value ?? '';
    this._paint();
  }

  connectedCallback(): void {
    this._paint();
  }

  private _paint(): void {
    paintMdiIcon(this, resolveStateIcon(this._stateObj, this._iconOverride));
  }
}

class HaIconPickerStub extends HTMLElement {
  hass?: unknown;
  label?: string;
  private _value = '';

  get value(): string {
    return this._value;
  }

  set value(next: string) {
    this._value = next ?? '';
    const input = this.querySelector('input');
    if (input) input.value = this._value;
  }

  connectedCallback(): void {
    this.innerHTML = `<label style="display:flex;flex-direction:column;gap:4px;font:inherit">
      <span>${this.label ?? 'Icon'}</span>
      <input type="text" value="${this._value}" placeholder="mdi:lightbulb" />
    </label>`;
    this.querySelector('input')?.addEventListener('change', (ev) => {
      this._value = (ev.target as HTMLInputElement).value;
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          bubbles: true,
          composed: true,
          detail: { value: this._value },
        }),
      );
    });
  }
}

class HaEntityPickerStub extends HaIconPickerStub {
  connectedCallback(): void {
    this.label = this.label ?? 'Entity';
    super.connectedCallback();
    const input = this.querySelector('input');
    if (input) input.placeholder = 'light.kitchen';
  }
}

class ActionHandlerStub extends HTMLElement {
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
}

class HaFormStub extends LitElement {
  static override styles = css`
    :host {
      display: grid;
      gap: 10px;
      font-family: var(--au-home-font, system-ui, sans-serif);
      color: var(--au-primary-text, #1c1c1e);
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.85rem;
    }
    input,
    select,
    textarea {
      font: inherit;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(60, 60, 67, 0.18);
      background: var(--card-background-color, #fff);
      color: inherit;
    }
  `;

  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) data: Record<string, unknown> = {};
  @property({ attribute: false }) schema: FormSchema[] = [];
  @property({ attribute: false }) computeLabel?: (schema: { name: string }) => string;

  private _label(field: FormSchema): string {
    if (!field.name) return field.type ?? 'field';
    return this.computeLabel?.({ name: field.name }) ?? field.name;
  }

  private _emit(name: string, value: unknown): void {
    const next = { ...this.data, [name]: value };
    this.data = next;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      }),
    );
  }

  protected override render() {
    const fields = this.schema.filter((field) => field.name);
    if (!fields.length) return nothing;
    return html`
      ${fields.map((field) => {
        const name = field.name as string;
        const raw = this.data[name];
        const selector = field.selector ?? {};
        const key = Object.keys(selector)[0] ?? 'text';
        if (key === 'boolean') {
          return html`<label>
            <span>${this._label(field)}</span>
            <input
              type="checkbox"
              .checked=${Boolean(raw)}
              @change=${(ev: Event) =>
                this._emit(name, (ev.target as HTMLInputElement).checked)}
            />
          </label>`;
        }
        if (key === 'select') {
          const select = selector.select as
            { options?: Array<string | { value: string; label?: string }> } | undefined;
          const options = select?.options ?? [];
          return html`<label>
            <span>${this._label(field)}</span>
            <select
              .value=${String(raw ?? '')}
              @change=${(ev: Event) =>
                this._emit(name, (ev.target as HTMLSelectElement).value)}
            >
              ${options.map((opt) => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const label = typeof opt === 'string' ? opt : (opt.label ?? opt.value);
                return html`<option value=${value}>${label}</option>`;
              })}
            </select>
          </label>`;
        }
        if (key === 'number') {
          return html`<label>
            <span>${this._label(field)}</span>
            <input
              type="number"
              .value=${raw == null ? '' : String(raw)}
              @change=${(ev: Event) =>
                this._emit(name, Number((ev.target as HTMLInputElement).value))}
            />
          </label>`;
        }
        return html`<label>
          <span>${this._label(field)}</span>
          <input
            type="text"
            .value=${raw == null ? '' : String(raw)}
            @change=${(ev: Event) =>
              this._emit(name, (ev.target as HTMLInputElement).value)}
          />
        </label>`;
      })}
    `;
  }
}

const LIGHT_VARS: Record<string, string> = {
  '--primary-text-color': '#1c1c1e',
  '--secondary-text-color': '#8e8e93',
  '--accent-color': '#0a84ff',
  '--card-background-color': '#ffffff',
  '--primary-background-color': '#f2f2f7',
  '--ha-card-background': '#ffffff',
  '--au-home-bg': '#f2f2f7',
};

const DARK_VARS: Record<string, string> = {
  '--primary-text-color': '#f5f5f7',
  '--secondary-text-color': '#8e8e93',
  '--accent-color': '#0a84ff',
  '--card-background-color': '#1c1c1e',
  '--primary-background-color': '#000000',
  '--ha-card-background': '#2c2c2e',
  '--au-home-bg': '#000000',
};

/** Apply Home look CSS variables on the Storybook canvas. */
export function applyCanvasTheme(theme: 'light' | 'dark'): void {
  const vars = theme === 'dark' ? DARK_VARS : LIGHT_VARS;
  const root = document.documentElement;
  root.dataset.theme = theme;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  document.body.style.background = vars['--au-home-bg'] ?? '#f2f2f7';
  document.body.style.color = vars['--primary-text-color'] ?? '#1c1c1e';
  document.body.style.fontFamily =
    "'SF Pro Rounded', 'SF Pro Display', 'Avenir Next', 'Nunito Sans', system-ui, sans-serif";
}

/** Register stub HA custom elements used by Atrium cards/editors. */
export function registerHaStubs(): void {
  defineOnce('ha-icon', HaIconStub);
  defineOnce('ha-state-icon', HaStateIconStub);
  defineOnce('ha-icon-picker', HaIconPickerStub);
  defineOnce('ha-entity-picker', HaEntityPickerStub);
  defineOnce('action-handler', ActionHandlerStub);
  defineOnce('ha-form', HaFormStub);

  applyCanvasTheme('light');
}

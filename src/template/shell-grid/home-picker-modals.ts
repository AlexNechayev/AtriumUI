import { html, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant, LovelaceCardConfig } from '../../types/home-assistant';
import { fallbackCustomCardEntries } from './create-child-card';

export interface EntityOption {
  id: string;
  name: string;
  label: string;
}

export function renderAddEntityModal(props: {
  open: boolean;
  all: EntityOption[];
  filtered: EntityOption[];
  searchQuery: string;
  pickerEntity: string;
  onClose: () => void;
  onSearchInput: (ev: Event) => void;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}): TemplateResult | typeof nothing {
  if (!props.open) return nothing;
  const visible = props.filtered.slice(0, 200);
  const { all, filtered } = props;
  return html`
    <div class="modal-backdrop" @click=${props.onClose}></div>
    <div
      class="modal"
      role="dialog"
      aria-label="Add entity"
      @click=${(e: Event) => e.stopPropagation()}
    >
      <div class="modal-header">
        <span>Add entity</span>
        <span class="spacer"></span>
        <button
          class="handle remove-btn"
          type="button"
          title="Close"
          @click=${props.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="modal-body">
        <label class="picker-status" for="au-floor-entity-search"
          >Search entities</label
        >
        <input
          id="au-floor-entity-search"
          class="fallback-input"
          type="search"
          autocomplete="off"
          placeholder="Type name or entity id…"
          aria-label="Search entities"
          .value=${props.searchQuery}
          @input=${props.onSearchInput}
        />
        <div class="picker-status">
          ${all.length === 0
            ? 'No entities available'
            : filtered.length === 0
              ? 'No matches'
              : filtered.length > visible.length
                ? `Showing ${visible.length} of ${filtered.length} matches`
                : `${filtered.length} entit${filtered.length === 1 ? 'y' : 'ies'}`}
        </div>
        <div
          class="entity-search-list"
          role="listbox"
          aria-label="Entity results"
        >
          ${visible.map(
            (opt) => html`
              <button
                type="button"
                class=${classMap({
                  'entity-search-item': true,
                  selected: opt.id === props.pickerEntity,
                })}
                role="option"
                aria-selected=${opt.id === props.pickerEntity ? 'true' : 'false'}
                @click=${() => props.onSelect(opt.id)}
                @dblclick=${() => {
                  props.onSelect(opt.id);
                  props.onConfirm();
                }}
              >
                <span>${opt.name}</span>
                ${opt.name !== opt.id
                  ? html`<span class="id">${opt.id}</span>`
                  : nothing}
              </button>
            `,
          )}
        </div>
        <div class="modal-actions">
          <button class="plain" type="button" @click=${props.onClose}>
            Cancel
          </button>
          <button
            type="button"
            ?disabled=${!props.pickerEntity.trim()}
            @click=${props.onConfirm}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderAddCardModal(props: {
  open: boolean;
  hass?: HomeAssistant;
  loading: boolean;
  ready: boolean;
  onClose: () => void;
  onCardPicked: (ev: Event) => void;
  onPickFallback: (type: string) => void;
}): TemplateResult | typeof nothing {
  if (!props.open) return nothing;
  const fallback = fallbackCustomCardEntries();
  return html`
    <div class="modal-backdrop" @click=${props.onClose}></div>
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Add card"
      @click=${(e: Event) => e.stopPropagation()}
    >
      <div class="modal-header">
        <span>Add card</span>
        <span class="spacer"></span>
        <button
          class="handle remove-btn"
          type="button"
          title="Close"
          @click=${props.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="modal-body">
        ${props.loading
          ? html`<div class="picker-status">Loading card picker…</div>`
          : nothing}
        ${props.ready
          ? html`<hui-card-picker
              .hass=${props.hass}
              @config-changed=${props.onCardPicked}
            ></hui-card-picker>`
          : nothing}
        ${!props.loading && !props.ready
          ? html`
              <div class="picker-status">
                Native picker unavailable — choose a registered card:
              </div>
              <div class="fallback-list">
                ${fallback.length === 0
                  ? html`<div class="picker-status">
                      No custom cards registered.
                    </div>`
                  : fallback.map(
                      (card) => html`
                        <button
                          type="button"
                          class="fallback-item"
                          @click=${() => props.onPickFallback(card.type)}
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

export function renderCardEditorModal(props: {
  mode: 'add' | 'edit' | null;
  draftType?: string;
  onClose: () => void;
  onConfirm: () => void;
}): TemplateResult | typeof nothing {
  if (!props.mode) return nothing;
  const title = props.mode === 'add' ? 'Configure card' : 'Edit card';
  return html`
    <div class="modal-backdrop" @click=${props.onClose}></div>
    <div
      class="modal card-editor"
      role="dialog"
      aria-modal="true"
      aria-label=${title}
      @click=${(e: Event) => e.stopPropagation()}
    >
      <div class="modal-header">
        <span>${title}</span>
        <span class="spacer"></span>
        <button
          class="handle remove-btn"
          type="button"
          title="Close"
          @click=${props.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="modal-body card-editor-host"></div>
      <div class="modal-actions" style="padding: 0 16px 16px;">
        <button class="plain" type="button" @click=${props.onClose}>
          Cancel
        </button>
        <button
          type="button"
          ?disabled=${!props.draftType}
          @click=${props.onConfirm}
        >
          Save
        </button>
      </div>
    </div>
  `;
}

export function renderHomeAddChooser(props: {
  open: boolean;
  onClose: () => void;
  onAddRoom: () => void;
  onAddEntity: () => void;
  onAddCard: () => void;
}): TemplateResult | typeof nothing {
  if (!props.open) return nothing;
  return html`
    <div class="modal-backdrop" @click=${props.onClose}></div>
    <div
      class="modal"
      role="dialog"
      aria-label="Add to floor"
      @click=${(e: Event) => e.stopPropagation()}
    >
      <div class="modal-header">
        <span>Add to floor</span>
        <span class="spacer"></span>
        <button
          class="handle remove-btn"
          type="button"
          title="Close"
          @click=${props.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="modal-body">
        <div
          class="modal-actions"
          style="justify-content: stretch; flex-direction: column;"
        >
          <button type="button" @click=${props.onAddRoom}>Add room</button>
          <button type="button" @click=${props.onAddEntity}>Add entity</button>
          <button type="button" @click=${props.onAddCard}>Add card</button>
          <button class="plain" type="button" @click=${props.onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderAddRoomModal(props: {
  open: boolean;
  name: string;
  onClose: () => void;
  onNameInput: (value: string) => void;
  onConfirm: () => void;
}): TemplateResult | typeof nothing {
  if (!props.open) return nothing;
  return html`
    <div class="modal-backdrop" @click=${props.onClose}></div>
    <div
      class="modal"
      role="dialog"
      aria-label="Add room"
      @click=${(e: Event) => e.stopPropagation()}
    >
      <div class="modal-header">
        <span>Add room</span>
        <span class="spacer"></span>
        <button
          class="handle remove-btn"
          type="button"
          title="Close"
          @click=${props.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="modal-body">
        <input
          class="fallback-input"
          type="text"
          placeholder="Room name"
          .value=${props.name}
          @input=${(ev: Event) => {
            props.onNameInput((ev.target as HTMLInputElement).value);
          }}
        />
        <div class="modal-actions">
          <button class="plain" type="button" @click=${props.onClose}>
            Cancel
          </button>
          <button
            type="button"
            ?disabled=${!props.name.trim()}
            @click=${props.onConfirm}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

/** Re-export for callers that need the type near picker UI. */
export type { LovelaceCardConfig };

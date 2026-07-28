import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant } from '../../types/home-assistant';
import type {
  AuHomeCardConfig,
  AuHomeEntityConfig,
  AuHomeRoomConfig,
  AuHomeRoomControlsConfig,
} from '../../types/home';
import { entityIdFromHomeCard, isToggleDomain } from './room-controls';

/** Draft state for the Home-overview “Edit room” modal. */
export interface EditRoomDraft {
  roomId: string;
  name: string;
  icon: string;
  showStrip: boolean;
  /** All light/switch entity ids belonging to this room. */
  members: string[];
  /** Subset of `members` shown on the room-tile strip. */
  selected: string[];
  icons: Record<string, string>;
}

export function buildEditRoomDraft(
  room: AuHomeRoomConfig,
  roomId: string,
  toggleIds: string[],
): EditRoomDraft {
  const cfg = room.controls ?? {};
  const order = Array.isArray(cfg.order) ? cfg.order : [];
  const members = [
    ...order.filter((id) => toggleIds.includes(id)),
    ...toggleIds.filter((id) => !order.includes(id)),
  ];
  let selected = [...members];
  if (Array.isArray(cfg.include)) {
    const allow = new Set(cfg.include);
    selected = members.filter((id) => allow.has(id));
  } else if (cfg.exclude?.length) {
    const deny = new Set(cfg.exclude);
    selected = members.filter((id) => !deny.has(id));
  }
  return {
    roomId,
    name: room.name ?? '',
    icon: room.icon ?? '',
    showStrip: cfg.show !== false,
    members,
    selected,
    icons: { ...(cfg.icons ?? {}) },
  };
}

export function controlsFromEditDraft(
  draft: EditRoomDraft,
  toggleIds: string[],
): AuHomeRoomControlsConfig | undefined {
  const next: AuHomeRoomControlsConfig = {};
  if (!draft.showStrip) next.show = false;
  const selected = new Set(
    draft.selected.filter((id) => toggleIds.includes(id)),
  );
  const excluded = toggleIds.filter((id) => !selected.has(id));
  if (excluded.length > 0) next.exclude = excluded;
  const order = draft.members.filter((id) => toggleIds.includes(id));
  if (order.length > 0) next.order = order;
  const icons: Record<string, string> = {};
  for (const [id, icon] of Object.entries(draft.icons)) {
    const trimmed = icon.trim();
    if (trimmed && toggleIds.includes(id)) icons[id] = trimmed;
  }
  if (Object.keys(icons).length > 0) next.icons = icons;
  return Object.keys(next).length > 0 ? next : undefined;
}

/**
 * Rebuild `room.entities` from an Edit-room draft.
 * Toggle members already targeted by a room card stay card-only (not copied
 * into entities), so Save does not create duplicate grid tiles.
 */
export function roomEntitiesFromEditDraft(input: {
  members: string[];
  existing: AuHomeEntityConfig[];
  cards?: AuHomeCardConfig[];
}): AuHomeEntityConfig[] {
  const cardEntityIds = new Set(
    (input.cards ?? [])
      .map((entry) => entityIdFromHomeCard(entry))
      .filter((id): id is string => Boolean(id)),
  );
  const nonToggles = input.existing.filter(
    (e) => !e.entity || !isToggleDomain(e.entity),
  );
  const toggleEntities = input.members
    .filter((id) => isToggleDomain(id) && !cardEntityIds.has(id))
    .map((id) => {
      const prev = input.existing.find((e) => e.entity === id);
      return prev ? { ...prev, entity: id, hide: false } : { entity: id };
    });
  return [...nonToggles, ...toggleEntities];
}

export function addEditRoomMember(
  draft: EditRoomDraft,
  entityId: string,
): EditRoomDraft {
  if (draft.members.includes(entityId)) return draft;
  return {
    ...draft,
    members: [...draft.members, entityId],
    selected: draft.selected.includes(entityId)
      ? draft.selected
      : [...draft.selected, entityId],
  };
}

export function toggleEditRoomEntity(
  draft: EditRoomDraft,
  entityId: string,
  on: boolean,
): EditRoomDraft {
  if (on) {
    if (draft.selected.includes(entityId)) return draft;
    return { ...draft, selected: [...draft.selected, entityId] };
  }
  return {
    ...draft,
    selected: draft.selected.filter((id) => id !== entityId),
  };
}

export function moveEditRoomMember(
  draft: EditRoomDraft,
  entityId: string,
  delta: -1 | 1,
): EditRoomDraft {
  const members = [...draft.members];
  const index = members.indexOf(entityId);
  if (index < 0) return draft;
  const next = index + delta;
  if (next < 0 || next >= members.length) return draft;
  const [item] = members.splice(index, 1);
  members.splice(next, 0, item!);
  const selected = members.filter((id) => draft.selected.includes(id));
  return { ...draft, members, selected };
}

export interface EditRoomAddCandidate {
  id: string;
  name: string;
  label: string;
}

export interface EditRoomModalHandlers {
  onClose: () => void;
  onPatch: (patch: Partial<EditRoomDraft>) => void;
  onAddQuery: (query: string) => void;
  onAddMember: (entityId: string) => void;
  onToggleEntity: (entityId: string, on: boolean) => void;
  onMoveMember: (entityId: string, delta: -1 | 1) => void;
  onConfirm: () => void;
}

export interface EditRoomModalProps {
  draft: EditRoomDraft;
  hass?: HomeAssistant;
  canEdit: boolean;
  room?: AuHomeRoomConfig;
  addQuery: string;
  addCandidates: EditRoomAddCandidate[];
  handlers: EditRoomModalHandlers;
}

export function renderEditRoomModal(
  props: EditRoomModalProps,
): TemplateResult {
  const { draft, hass, canEdit, room, addQuery, addCandidates, handlers } =
    props;
  const members = draft.members;
  const selected = new Set(draft.selected);
  const title = canEdit ? 'Edit room' : 'Room info';

  return html`
    <div class="modal-backdrop" @click=${handlers.onClose}></div>
    <div
      class="modal edit-room"
      role="dialog"
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
          @click=${handlers.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="modal-body">
        <div class="edit-room-field">
          <label for="edit-room-name">Name</label>
          <input
            id="edit-room-name"
            class="fallback-input"
            type="text"
            .value=${draft.name}
            ?disabled=${!canEdit}
            @input=${(ev: Event) => {
              if (!canEdit) return;
              handlers.onPatch({
                name: (ev.target as HTMLInputElement).value,
              });
            }}
          />
        </div>
        <div class="edit-room-field">
          <label>Room icon</label>
          <ha-icon-picker
            .hass=${hass}
            .value=${draft.icon}
            .label=${'Icon'}
            ?disabled=${!canEdit}
            @value-changed=${(ev: CustomEvent) => {
              ev.stopPropagation();
              if (!canEdit) return;
              handlers.onPatch({
                icon: String((ev.detail as { value?: string }).value ?? ''),
              });
            }}
          ></ha-icon-picker>
        </div>
        <label class="edit-room-toggle">
          <input
            type="checkbox"
            .checked=${draft.showStrip}
            ?disabled=${!canEdit}
            @change=${(ev: Event) => {
              if (!canEdit) return;
              handlers.onPatch({
                showStrip: (ev.target as HTMLInputElement).checked,
              });
            }}
          />
          <span>Show light/switch strip on large tiles</span>
        </label>
        ${canEdit
          ? html`
              <div class="edit-room-field">
                <label for="edit-room-add-entity">Add light or switch</label>
                <input
                  id="edit-room-add-entity"
                  class="fallback-input"
                  type="search"
                  autocomplete="off"
                  placeholder="Search light.* or switch.*…"
                  aria-label="Search lights and switches"
                  .value=${addQuery}
                  @input=${(ev: Event) => {
                    handlers.onAddQuery((ev.target as HTMLInputElement).value);
                  }}
                />
                ${addQuery.trim()
                  ? html`
                      <div
                        class="entity-search-list"
                        role="listbox"
                        aria-label="Light and switch results"
                      >
                        ${addCandidates.length === 0
                          ? html`<div class="picker-status">No matches</div>`
                          : addCandidates.map(
                              (opt) => html`
                                <button
                                  type="button"
                                  class="entity-search-item"
                                  role="option"
                                  @click=${() => handlers.onAddMember(opt.id)}
                                >
                                  <span>${opt.name}</span>
                                  ${opt.name !== opt.id
                                    ? html`<span class="id">${opt.id}</span>`
                                    : nothing}
                                </button>
                              `,
                            )}
                      </div>
                    `
                  : html`
                      <p class="picker-status" style="margin:0">
                        Type to search Home Assistant lights and switches.
                      </p>
                    `}
              </div>
            `
          : nothing}
        ${members.length > 0
          ? html`
              <div class="edit-room-field">
                <label>Lights & switches on strip</label>
                <div class="edit-room-entities">
                  ${members.map((entityId, index) => {
                    const label =
                      room?.entities?.find((e) => e.entity === entityId)
                        ?.name ||
                      hass?.states[entityId]?.attributes?.friendly_name ||
                      entityId;
                    return html`
                      <div class="edit-room-entity">
                        <input
                          type="checkbox"
                          data-entity=${entityId}
                          .checked=${selected.has(entityId)}
                          ?disabled=${!canEdit}
                          @change=${(ev: Event) => {
                            if (!canEdit) return;
                            handlers.onToggleEntity(
                              entityId,
                              (ev.target as HTMLInputElement).checked,
                            );
                          }}
                        />
                        <span class="name" title=${entityId}>${label}</span>
                        <div class="edit-room-reorder">
                          <button
                            type="button"
                            title="Move up"
                            aria-label="Move up"
                            ?disabled=${!canEdit || index === 0}
                            @click=${() =>
                              handlers.onMoveMember(entityId, -1)}
                          >
                            <ha-icon icon="mdi:chevron-up"></ha-icon>
                          </button>
                          <button
                            type="button"
                            title="Move down"
                            aria-label="Move down"
                            ?disabled=${!canEdit ||
                            index === members.length - 1}
                            @click=${() =>
                              handlers.onMoveMember(entityId, 1)}
                          >
                            <ha-icon icon="mdi:chevron-down"></ha-icon>
                          </button>
                        </div>
                        <ha-icon-picker
                          .hass=${hass}
                          .value=${draft.icons[entityId] ?? ''}
                          .label=${'Icon'}
                          ?disabled=${!canEdit}
                          @value-changed=${(ev: CustomEvent) => {
                            ev.stopPropagation();
                            if (!canEdit) return;
                            const icon = String(
                              (ev.detail as { value?: string }).value ?? '',
                            );
                            const icons = { ...draft.icons };
                            if (icon.trim()) icons[entityId] = icon.trim();
                            else delete icons[entityId];
                            handlers.onPatch({ icons });
                          }}
                        ></ha-icon-picker>
                      </div>
                    `;
                  })}
                </div>
              </div>
            `
          : html`
              <p class="hint" style="margin:0;font-size:0.8rem;opacity:0.75">
                Add light or switch entities above to show counts and the
                strip on this room tile.
              </p>
            `}
        <div class="modal-actions">
          <button class="plain" type="button" @click=${handlers.onClose}>
            ${canEdit ? 'Cancel' : 'Close'}
          </button>
          ${canEdit
            ? html`
                <button
                  type="button"
                  ?disabled=${!draft.name.trim()}
                  @click=${handlers.onConfirm}
                >
                  Save
                </button>
              `
            : nothing}
        </div>
      </div>
    </div>
  `;
}

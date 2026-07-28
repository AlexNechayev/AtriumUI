import { css } from 'lit';

/** Static styles for `au-shell-home-view` (extracted for maintainability). */
export const homeViewStyles = css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0;
        box-sizing: border-box;
      }
      .home-shell {
        border: none;
        box-shadow: none;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        min-height: 0;
        background:
          radial-gradient(
            120% 80% at 0% 0%,
            color-mix(in srgb, var(--au-home-accent-default) 10%, transparent),
            transparent 55%
          ),
          radial-gradient(
            90% 70% at 100% 0%,
            color-mix(in srgb, var(--au-home-accent-light) 12%, transparent),
            transparent 50%
          ),
          var(--au-home-bg);
        padding: clamp(16px, 2.2vw, 28px);
        border-radius: calc(var(--au-home-radius) + 4px);
      }

      .home {
        display: flex;
        flex-direction: column;
        gap: var(--au-home-gap);
        height: 100%;
        min-height: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        font-family: var(--au-home-font);
      }
      .home.distribute-rows {
        overflow: hidden;
      }
      .home.rtl {
        direction: rtl;
      }

      .toolbar {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--au-home-gap);
        min-height: 48px;
        margin-bottom: 4px;
      }
      .toolbar-start {
        display: flex;
        align-items: center;
        gap: var(--au-home-gap);
        min-width: 0;
        flex: 1;
        /* Reserve center band so title never covers the clock. */
        padding-inline-end: 5.5rem;
      }
      .toolbar-end {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--au-home-gap);
        flex: 1;
        min-width: 0;
        /* Mirror start padding so Home/Room clock share the same center. */
        padding-inline-start: 5.5rem;
      }
      .back {
        border: none;
        background: color-mix(in srgb, var(--au-home-surface-elevated) 80%, transparent);
        color: var(--au-home-accent-default);
        border-radius: 999px;
        padding: 10px 16px;
        font: inherit;
        font-weight: 650;
        font-size: 0.95rem;
        cursor: pointer;
        box-shadow: var(--au-home-shadow-press);
        flex-shrink: 0;
      }
      .title {
        font-size: clamp(1.75rem, 3.2vw, 2.35rem);
        font-weight: 750;
        letter-spacing: -0.03em;
        color: var(--au-home-label);
        margin: 0;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.1;
      }
      .clock {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        font-size: clamp(1.15rem, 2.4vw, 1.55rem);
        font-weight: 650;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        color: var(--au-home-label);
        line-height: 1;
        pointer-events: none;
        white-space: nowrap;
      }
      .bulk {
        border: none;
        background: var(--au-home-surface-elevated);
        color: var(--au-home-label);
        border-radius: 999px;
        padding: 10px 16px;
        font: inherit;
        font-size: 0.85rem;
        font-weight: 650;
        cursor: pointer;
        box-shadow: var(--au-home-shadow-press);
        flex-shrink: 0;
      }
      .bulk:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .presence {
        display: flex;
        flex-wrap: wrap;
        gap: var(--au-gap);
        margin-bottom: 4px;
      }
      .person {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--au-gap-sm);
        padding: 4px 6px;
        background: transparent;
      }
      .person.home .avatar {
        box-shadow:
          0 0 0 3px color-mix(in srgb, var(--au-state-home) 85%, white),
          0 8px 18px rgba(52, 199, 89, 0.28);
      }
      .person.away {
        opacity: 0.55;
      }
      .person.away .avatar {
        filter: grayscale(0.35);
      }
      .avatar {
        width: var(--au-presence-size);
        height: var(--au-presence-size);
        border-radius: 50%;
        object-fit: cover;
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--au-home-accent-default) 35%, white),
          color-mix(in srgb, var(--au-home-accent-cover) 40%, white)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--au-home-on-ink);
        overflow: hidden;
        flex: 0 0 auto;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .person-name {
        font-size: var(--au-font-meta);
        font-weight: var(--au-weight-bold);
        color: var(--au-home-label);
        max-width: 72px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .person-state {
        font-size: var(--au-font-secondary);
        font-weight: 500;
        color: var(--au-home-muted);
      }

      .floor {
        display: flex;
        flex-direction: column;
        gap: var(--au-gap);
        min-height: 0;
      }
      .home.distribute-rows .floor {
        flex: 1 1 auto;
      }
      .floor-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--au-home-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding-inline-start: 4px;
      }
      .rooms {
        position: relative;
        display: grid;
        grid-template-columns: repeat(
          var(--home-grid-columns, 12),
          minmax(0, 1fr)
        );
        grid-auto-rows: var(--home-grid-row-height, 80px);
        gap: var(--home-grid-gap, var(--au-home-gap));
        align-content: start;
        width: 100%;
      }
      .rooms.distribute-rows {
        flex: 1;
        min-height: 0;
        height: 100%;
        grid-template-rows: repeat(var(--home-grid-rows, 1), minmax(0, 1fr));
        grid-auto-rows: unset;
      }
      .rooms.editing {
        outline: 1px dashed var(--au-grid-guide, rgba(120, 120, 120, 0.4));
        outline-offset: 4px;
        border-radius: var(--au-home-radius);
        background-image: linear-gradient(
            to right,
            var(--au-grid-guide, rgba(120, 120, 120, 0.4)) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            var(--au-grid-guide, rgba(120, 120, 120, 0.4)) 1px,
            transparent 1px
          );
        background-size:
          calc(
            (100% + var(--home-grid-gap, 12px)) / var(--home-grid-columns, 12)
          )
          calc(
            var(--home-grid-row-height, 80px) + var(--home-grid-gap, 12px)
          );
        background-position: 0 0;
        padding-bottom: 72px;
      }
      .room-host {
        position: relative;
        min-width: 0;
        min-height: 0;
      }
      .rooms.editing .room-host,
      .rooms.editing .entity-host {
        outline: 1px dashed var(--au-grid-handle, var(--au-accent, #0a84ff));
        outline-offset: -1px;
      }
      .rooms .entity-host {
        position: relative;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
      }
      .rooms.editing .entity-host {
        overflow: visible;
      }
      .room-tile-host {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
      }
      .room-tile-host > * {
        display: block;
        width: 100%;
        height: 100%;
      }
      /* Compat multi_entity groups mount au-room-card into these hosts. */
      .multi-entity-host {
        grid-column: span 4;
        grid-row: span 2;
        min-height: 0;
      }

      .entities {
        position: relative;
        display: grid;
        grid-template-columns: repeat(var(--home-grid-columns, 12), minmax(0, 1fr));
        grid-auto-rows: var(--home-grid-row-height, 80px);
        gap: var(--home-grid-gap, var(--au-home-gap));
        align-content: start;
        width: 100%;
      }
      .entities.distribute-rows {
        flex: 1;
        min-height: 0;
        height: 100%;
        grid-template-rows: repeat(var(--home-grid-rows, 1), minmax(0, 1fr));
        grid-auto-rows: unset;
      }
      .entities.editing {
        outline: 1px dashed var(--au-grid-guide, rgba(120, 120, 120, 0.4));
        outline-offset: 4px;
        border-radius: var(--au-home-radius);
        background-image: linear-gradient(
            to right,
            var(--au-grid-guide, rgba(120, 120, 120, 0.4)) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            var(--au-grid-guide, rgba(120, 120, 120, 0.4)) 1px,
            transparent 1px
          );
        background-size:
          calc(
            (100% + var(--home-grid-gap, 12px)) / var(--home-grid-columns, 12)
          )
          calc(
            var(--home-grid-row-height, 80px) + var(--home-grid-gap, 12px)
          );
        background-position: 0 0;
        padding-bottom: 72px;
      }
      .entity-host {
        position: relative;
        min-width: 0;
        min-height: 0;
        /* Do not clip children with a radius — native HA cards keep their own
           borders; Atrium tiles clip themselves via .home-tile. */
        overflow: hidden;
      }
      .entities.editing .entity-host {
        outline: 1px dashed var(--au-grid-handle, var(--au-accent, #0a84ff));
        outline-offset: -1px;
        overflow: visible;
      }
      /* Let drag/edit/remove handles receive clicks; child cards steal them otherwise. */
      .entities.editing .entity-card,
      .rooms.editing .entity-card {
        pointer-events: none;
      }
      .entity-host > *:not(.handle):not(.edit-cover) {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0;
      }
      .entity-card {
        width: 100%;
        height: 100%;
        min-height: 0;
        overflow: visible;
      }
      .handle {
        position: absolute;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: var(--au-grid-handle, var(--au-accent, #0a84ff));
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
      .edit-room-btn,
      .edit-card-btn {
        top: auto;
        right: auto;
        bottom: 0;
        left: 0;
        width: 22px;
        height: 22px;
        border: none;
        border-radius: 0 6px 0 0;
        cursor: pointer;
      }
      .modal.card-editor {
        width: min(520px, 94vw);
      }
      .modal.card-editor .modal-body {
        min-height: 120px;
      }
      .edit-room-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .edit-room-field label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--secondary-text-color, var(--au-home-muted));
      }
      .edit-room-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
      }
      .edit-room-entities {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: min(40vh, 280px);
        overflow: auto;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        padding: 8px;
      }
      .edit-room-entity {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto minmax(100px, 140px);
        gap: 8px;
        align-items: center;
      }
      .edit-room-entity .name {
        font-size: 0.8125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .edit-room-reorder {
        display: inline-flex;
        gap: 2px;
      }
      .edit-room-reorder button {
        width: 28px;
        height: 28px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 6px;
        background: color-mix(in srgb, var(--au-home-label) 4%, transparent);
        color: var(--au-home-label);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: pointer;
        --mdc-icon-size: 16px;
      }
      .edit-room-reorder button:disabled {
        opacity: 0.35;
        cursor: default;
      }
      .modal.edit-room {
        width: min(480px, 92vw);
      }
      .resize-handle {
        right: 0;
        bottom: 0;
        width: 16px;
        height: 16px;
        border-radius: 6px 0 0 0;
        cursor: nwse-resize;
        touch-action: none;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
      }
      .edit-cover {
        position: absolute;
        inset: 0;
        z-index: 2;
        cursor: default;
        background: transparent;
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
        background: var(--au-grid-handle, var(--au-accent, #0a84ff));
        color: #fff;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
        --mdc-icon-size: 28px;
      }
      .add-fab:focus-visible {
        outline: 2px solid var(--au-grid-handle, var(--au-accent, #0a84ff));
        outline-offset: 3px;
      }
      .room-body {
        position: relative;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }
      .home.distribute-rows .room-body {
        overflow: hidden;
      }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9;
        background: var(--au-home-scrim);
      }
      .modal {
        position: fixed;
        z-index: 10;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(420px, 92vw);
        max-height: 82vh;
        display: flex;
        flex-direction: column;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #1c1c1e);
        border-radius: var(--au-home-radius);
        box-shadow: var(--au-home-modal-shadow);
        transition: box-shadow var(--au-motion-medium) var(--au-motion-ease);
      }
      .modal-header {
        display: flex;
        align-items: center;
        gap: var(--au-gap-sm);
        padding: 14px 16px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        font-weight: var(--au-weight-bold);
      }
      .modal-header .spacer {
        flex: 1 1 auto;
      }
      .modal-body {
        padding: 16px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: var(--au-home-gap);
      }
      .modal-body ha-entity-picker {
        display: block;
        width: 100%;
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--au-gap-sm);
      }
      .modal-actions button {
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        background: var(--au-accent, #0a84ff);
        color: var(--text-primary-color, #fff);
      }
      .modal-actions button.plain {
        background: transparent;
        color: var(--au-accent, #0a84ff);
        box-shadow: inset 0 0 0 1px var(--divider-color, rgba(0, 0, 0, 0.2));
      }
      .fallback-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
        font: inherit;
        background: transparent;
        color: inherit;
      }
      .entity-search-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: min(42vh, 320px);
        overflow: auto;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        padding: 6px;
      }
      .entity-search-item {
        appearance: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        width: 100%;
        text-align: start;
        border: none;
        border-radius: 8px;
        padding: 8px 10px;
        font: inherit;
        cursor: pointer;
        background: transparent;
        color: inherit;
      }
      .entity-search-item:hover {
        background: color-mix(
          in srgb,
          var(--au-accent, #0a84ff) 12%,
          transparent
        );
      }
      .entity-search-item.selected {
        background: color-mix(
          in srgb,
          var(--au-accent, #0a84ff) 22%,
          transparent
        );
        font-weight: 600;
      }
      .entity-search-item .id {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #727272);
        font-weight: 400;
      }
      .picker-status {
        color: var(--secondary-text-color, #727272);
        padding: 8px 0;
        font-size: 0.875rem;
      }
      .fallback-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .fallback-item {
        appearance: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        width: 100%;
        text-align: start;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        padding: 10px 12px;
        font: inherit;
        cursor: pointer;
        background: transparent;
        color: inherit;
      }
      .fallback-item .name {
        font-weight: 600;
      }
      .fallback-item .desc {
        font-size: 0.8rem;
        color: var(--secondary-text-color, #727272);
      }
      hui-card-picker {
        display: block;
      }

      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .chip {
        border: none;
        border-radius: 999px;
        padding: 12px 18px;
        background: var(--au-home-surface-elevated);
        color: var(--au-home-label);
        font: inherit;
        font-size: 0.9rem;
        font-weight: 650;
        cursor: pointer;
        box-shadow: var(--au-home-shadow-press);
      }
      .empty {
        color: var(--au-home-muted);
        font-size: 1rem;
        font-weight: 500;
        padding: 24px 8px;
      }
      .collapse {
        border: none;
        background: transparent;
        color: var(--au-home-accent-default);
        font: inherit;
        font-size: 0.9rem;
        font-weight: 650;
        cursor: pointer;
        padding: 8px 4px;
        align-self: start;
      }
      .confirm-row {
        display: flex;
        gap: 8px;
      }

`;

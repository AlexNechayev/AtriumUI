/**
 * AtriumUI - single-bundle entry point.
 *
 * Importing each module registers its custom element via the `@customElement`
 * decorator side effect. We then advertise every card to `window.customCards`
 * so they appear in the Lovelace "Add card" visual picker with previews.
 */
import { AuShellGrid } from './template/shell-grid/au-shell-grid';
import { AuActionCard } from './card/action-card/au-action-card';
import { AuSensorCard } from './card/sensor-card/au-sensor-card';
import { AuLightCard } from './card/light-card/au-light-card';
import { AuClimateCard } from './card/climate-card/au-climate-card';
import { AuFanCard } from './card/fan-card/au-fan-card';
import { AuCoverCard } from './card/cover-card/au-cover-card';
import { AuSwitchCard } from './card/switch-card/au-switch-card';
import { AuVacuumCard } from './card/vacuum-card/au-vacuum-card';
import './card/vacuum-card/au-vacuum-settings-overlay';
import { AuDeviceCard } from './card/device-card/au-device-card';
import { AuRoomCard } from './card/room-card/au-room-card';
import { AuCalendarCard } from './card/calendar-card/au-calendar-card';
import { AuLightSlider } from './components/au-light-slider';
import { AuClimateSelectors } from './components/au-climate-selectors';
import { AuFanSpeedSelector } from './components/au-fan-speed-selector';
import { AuTempStepper } from './components/au-temp-stepper';
import type { CustomCardEntry } from './types/home-assistant';

export * from './types';
export { AuBaseCard } from './core/base-card';
export { AuCardContent } from './core/card-content';
export { AuActionCardBase } from './core/action-card';
export { AuBaseEditor } from './core/base-editor';
export { localize, isRtlLanguage, normalizeLanguage } from './localize/localize';
export { isShellHomeMode } from './types/config';
export {
  AuShellGrid,
  AuActionCard,
  AuSensorCard,
  AuLightCard,
  AuClimateCard,
  AuFanCard,
  AuCoverCard,
  AuSwitchCard,
  AuVacuumCard,
  AuDeviceCard,
  AuRoomCard,
  AuCalendarCard,
  AuLightSlider,
  AuClimateSelectors,
  AuFanSpeedSelector,
  AuTempStepper,
};

const VERSION = '0.5.4';

const CARDS: CustomCardEntry[] = [
  {
    type: 'au-shell-grid',
    name: 'AtriumUI Shell Grid',
    description:
      'Home dashboard with floors, rooms, and a visual room entity grid.',
    preview: true,
  },
  {
    type: 'au-action-card',
    name: 'AtriumUI Action Card',
    description: 'Reactive tile that toggles an entity and reflects its on/off state.',
    preview: true,
  },
  {
    type: 'au-sensor-card',
    name: 'AtriumUI Sensor Card',
    description: 'Linear gauge for environmental readouts with severity alerts.',
    preview: true,
  },
  {
    type: 'au-light-card',
    name: 'AtriumUI Light Card',
    description: 'Capability-driven light controls with brightness, warmth, and color sliders.',
    preview: true,
  },
  {
    type: 'au-climate-card',
    name: 'AtriumUI Climate Card',
    description:
      'Air conditioner controls with HVAC modes, target temperature, and fan modes.',
    preview: true,
  },
  {
    type: 'au-fan-card',
    name: 'AtriumUI Fan Card',
    description:
      'Fan controls with speed slider or chips, presets, oscillate, and direction.',
    preview: true,
  },
  {
    type: 'au-cover-card',
    name: 'AtriumUI Cover Card',
    description:
      'Cover controls with open/close/stop and an optional position slider.',
    preview: true,
  },
  {
    type: 'au-switch-card',
    name: 'AtriumUI Switch Card',
    description: 'Simple on/off switch tile.',
    preview: true,
  },
  {
    type: 'au-vacuum-card',
    name: 'AtriumUI Vacuum Card',
    description:
      'Vacuum controls with start, pause, stop, return home, and a full-screen settings dashboard.',
    preview: true,
  },
  {
    type: 'au-device-card',
    name: 'AtriumUI Device Card',
    description:
      'Adaptive tile for water heater and other toggleable domains without a dedicated card.',
    preview: true,
  },
  {
    type: 'au-room-card',
    name: 'AtriumUI Room Card',
    description:
      'Row of icon buttons to toggle lights/switches — no single entity required.',
    preview: true,
  },
  {
    type: 'au-calendar-card',
    name: 'AtriumUI Calendar Card',
    description:
      'Apple Calendar–inspired preview of Home Assistant calendar.* entities (agenda, today, week, month).',
    preview: true,
  },
];

window.customCards = window.customCards ?? [];
for (const card of CARDS) {
  if (!window.customCards.some((c) => c.type === card.type)) {
    window.customCards.push(card);
  }
}

 
console.info(
  `%c AtriumUI %c v${VERSION} `,
  'background:#0a84ff;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px;font-weight:600;',
  'background:#1c1c1e;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px;',
);

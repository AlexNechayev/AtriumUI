import type { HassEntity, HomeAssistant } from '../../src/types/home-assistant';
import type { AuShellGridConfig } from '../../src/types/config';
import type { AuCalendarEvent } from '../../src/types/calendar';

/** Storybook-only HassEntity factory (no Vitest). */
export function makeEntity(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity {
  const now = new Date().toISOString();
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: now,
    last_updated: now,
  };
}

function rawCalendarEvents(): Array<{
  summary: string;
  start: string;
  end: string;
  location?: string;
}> {
  const day = new Date();
  day.setHours(10, 0, 0, 0);
  const end = new Date(day);
  end.setHours(11, 0, 0, 0);
  const later = new Date(day);
  later.setHours(14, 0, 0, 0);
  const laterEnd = new Date(day);
  laterEnd.setHours(15, 30, 0, 0);
  return [
    {
      summary: 'Team sync',
      start: day.toISOString(),
      end: end.toISOString(),
      location: 'Office',
    },
    {
      summary: 'Focus block',
      start: later.toISOString(),
      end: laterEnd.toISOString(),
    },
  ];
}

export function demoCalendarEvents(): AuCalendarEvent[] {
  return rawCalendarEvents().map((event, i) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      uid: `evt-${i}`,
      summary: event.summary,
      start,
      end,
      allDay: false,
      location: event.location,
      entityId: 'calendar.personal',
      color: i === 0 ? '#007AFF' : '#FF9500',
      label: 'Personal',
    };
  });
}

const FAN_FEATURES = 1 + 2 + 4 + 8 + 16 + 32;
const COVER_FEATURES = 1 + 2 + 4 + 8;
const VACUUM_FEATURES = 8192 + 4 + 8 + 16 + 64 + 4096;

export const demoStates: Record<string, HassEntity> = {
  'light.kitchen': makeEntity('light.kitchen', 'on', {
    friendly_name: 'Kitchen',
    icon: 'mdi:lightbulb',
    brightness: 180,
    supported_color_modes: ['brightness'],
    color_mode: 'brightness',
  }),
  'light.living_room': makeEntity('light.living_room', 'on', {
    friendly_name: 'Living room',
    icon: 'mdi:ceiling-light',
    brightness: 200,
    color_temp: 320,
    min_mireds: 153,
    max_mireds: 500,
    hs_color: [30, 70],
    supported_color_modes: ['brightness', 'color_temp', 'hs'],
    color_mode: 'color_temp',
  }),
  'light.unavailable': makeEntity('light.unavailable', 'unavailable', {
    friendly_name: 'Unavailable light',
    icon: 'mdi:lightbulb-off',
  }),
  'switch.outlet': makeEntity('switch.outlet', 'on', {
    friendly_name: 'Outlet',
    icon: 'mdi:power-socket-eu',
  }),
  'sensor.living_room_temperature': makeEntity('sensor.living_room_temperature', '22.4', {
    friendly_name: 'Temperature',
    icon: 'mdi:thermometer',
    unit_of_measurement: '°C',
    device_class: 'temperature',
  }),
  'climate.living_room': makeEntity('climate.living_room', 'cool', {
    friendly_name: 'Air conditioner',
    icon: 'mdi:air-conditioner',
    hvac_modes: ['off', 'heat', 'cool', 'auto', 'fan_only'],
    fan_modes: ['auto', 'low', 'medium', 'high'],
    temperature: 22,
    current_temperature: 24,
    min_temp: 16,
    max_temp: 30,
    target_temp_step: 1,
    hvac_action: 'cooling',
  }),
  'fan.bedroom': makeEntity('fan.bedroom', 'on', {
    friendly_name: 'Bedroom fan',
    icon: 'mdi:fan',
    percentage: 50,
    percentage_step: 25,
    preset_modes: ['auto', 'sleep', 'smart'],
    preset_mode: 'auto',
    oscillating: true,
    direction: 'forward',
    supported_features: FAN_FEATURES,
  }),
  'cover.blinds': makeEntity('cover.blinds', 'open', {
    friendly_name: 'Blinds',
    icon: 'mdi:blinds',
    current_position: 80,
    supported_features: COVER_FEATURES,
  }),
  'vacuum.downstairs': makeEntity('vacuum.downstairs', 'docked', {
    friendly_name: 'Downstairs vacuum',
    icon: 'mdi:robot-vacuum',
    battery_level: 92,
    fan_speed: 'auto',
    supported_features: VACUUM_FEATURES,
  }),
  'water_heater.tank': makeEntity('water_heater.tank', 'on', {
    friendly_name: 'Water heater',
    icon: 'mdi:water-boiler',
    temperature: 50,
    current_temperature: 48,
    min_temp: 30,
    max_temp: 70,
    operation_list: ['off', 'eco', 'performance'],
    operation_mode: 'eco',
  }),
  'calendar.personal': makeEntity('calendar.personal', 'off', {
    friendly_name: 'Personal',
  }),
  'person.alex': makeEntity('person.alex', 'home', {
    friendly_name: 'Alex',
    entity_picture: undefined,
  }),
};

export function makeHass(states: Record<string, HassEntity> = demoStates): HomeAssistant {
  const events = rawCalendarEvents();
  return {
    states,
    themes: { default_theme: 'default', themes: {} },
    user: { id: 'u1', name: 'Alex' },
    language: 'en',
    locale: { language: 'en', time_format: '24' },
    areas: {
      living: { area_id: 'living', name: 'Living room', floor_id: 'main' },
      kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'main' },
    },
    floors: {
      main: { floor_id: 'main', name: 'Main', level: 0 },
    },
    async callService(domain, service, serviceData) {
      console.info('hass.callService', domain, service, serviceData);
      if (domain === 'calendar' && service === 'get_events') {
        return {
          response: {
            'calendar.personal': { events },
          },
        };
      }
      return undefined;
    },
  };
}

export const demoHass = makeHass();

export const demoHomeConfig: AuShellGridConfig = {
  type: 'custom:au-shell-grid',
  presence: ['person.alex'],
  floors: [
    {
      name: 'Main',
      rooms: [
        {
          id: 'living',
          name: 'Living room',
          entities: [
            { entity: 'light.living_room' },
            { entity: 'switch.outlet' },
            { entity: 'climate.living_room' },
            { entity: 'sensor.living_room_temperature' },
          ],
        },
        {
          id: 'kitchen',
          name: 'Kitchen',
          entities: [{ entity: 'light.kitchen' }],
        },
      ],
    },
  ],
};

export const demoClassicConfig: AuShellGridConfig = {
  type: 'custom:au-shell-grid',
  columns: 12,
  row_height: '80px',
  cards: [
    {
      type: 'custom:au-light-card',
      entity: 'light.kitchen',
      layout: { x: 0, y: 0, w: 4, h: 2 },
    },
    {
      type: 'custom:au-sensor-card',
      entity: 'sensor.living_room_temperature',
      min: 0,
      max: 40,
      unit: '°C',
      layout: { x: 4, y: 0, w: 4, h: 2 },
    },
    {
      type: 'custom:au-switch-card',
      entity: 'switch.outlet',
      layout: { x: 8, y: 0, w: 4, h: 2 },
    },
  ],
};

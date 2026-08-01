/**
 * Discover and classify entities belonging to the same HA device as a vacuum.
 */
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { AuVacuumSettingsSection } from '../types/vacuum';
import { computeDomain } from './entity';

export type VacuumCatalogTier = 'essentials' | 'advanced';

export interface VacuumCatalogEntry {
  entityId: string;
  domain: string;
  section: AuVacuumSettingsSection;
  tier: VacuumCatalogTier;
  /** Room index when entity is `*_room_N_*`. */
  roomIndex?: number;
  /** Suffix after `room_N_` (e.g. `suction_level`). */
  roomKey?: string;
}

export interface VacuumRoomInfo {
  index: number;
  nameEntityId?: string;
  entityIds: string[];
}

export interface VacuumDeviceCatalog {
  vacuumEntityId: string;
  deviceId?: string;
  entries: VacuumCatalogEntry[];
  rooms: VacuumRoomInfo[];
  mapCameraId?: string;
  statusEntityIds: {
    battery?: string;
    status?: string;
    cleanedArea?: string;
    cleaningProgress?: string;
    cleaningTime?: string;
    currentRoom?: string;
  };
}

const ROOM_RE = /_room_(\d+)_(.+)$/;

const ESSENTIAL_SUFFIXES = new Set([
  'battery_level',
  'status',
  'state',
  'cleaned_area',
  'cleaning_progress',
  'cleaning_time',
  'current_room',
  'suction_level',
  'mop_pad_humidity',
  'wetness_level',
  'cleaning_mode',
  'cleaning_route',
  'volume',
  'start_auto_empty',
  'self_clean',
]);

function suffixOf(entityId: string): string {
  const id = entityId.includes('.') ? entityId.slice(entityId.indexOf('.') + 1) : entityId;
  const parts = id.split('_');
  // Drop device prefix tokens until we hit known tails — use last meaningful chunks.
  if (parts.length <= 2) return id;
  // Prefer matching from the end for multi-token suffixes.
  for (let n = 3; n >= 1; n--) {
    const candidate = parts.slice(-n).join('_');
    if (ESSENTIAL_SUFFIXES.has(candidate)) return candidate;
  }
  return parts.slice(2).join('_') || id;
}

function isEnabledRegistryEntry(
  hass: HomeAssistant,
  entityId: string,
): boolean {
  const entry = hass.entities?.[entityId];
  if (!entry) {
    // No registry: keep entities that exist in states.
    return Boolean(hass.states[entityId]);
  }
  if (entry.disabled_by) return false;
  return true;
}

export function classifyVacuumSection(entityId: string): AuVacuumSettingsSection {
  const id = entityId.toLowerCase();
  const domain = computeDomain(entityId);

  if (domain === 'camera' || id.includes('_map')) return 'map';
  if (ROOM_RE.test(id)) return 'rooms';
  if (
    id.includes('reset_') ||
    id.includes('filter') ||
    id.includes('brush') ||
    id.includes('sensor_dirty') ||
    id.includes('deodorizer') ||
    id.includes('clear_warning')
  ) {
    return 'maintenance';
  }
  if (
    id.includes('_ai_') ||
    id.includes('obstacle') ||
    id.includes('pet_') ||
    id.includes('furniture') ||
    id.includes('human_follow') ||
    id.includes('stain_avoidance') ||
    id.includes('fuzzy_obstacle')
  ) {
    return 'ai';
  }
  if (id.includes('_dnd') || id.includes('dnd_')) return 'dnd';
  if (
    id.includes('voice') ||
    id.includes('volume') ||
    id.includes('streaming_voice')
  ) {
    return 'voice';
  }
  if (
    id.includes('auto_empty') ||
    id.includes('self_clean') ||
    id.includes('self_wash') ||
    id.includes('drying') ||
    id.includes('water_tank') ||
    id.includes('dust_bag') ||
    id.includes('drainage') ||
    id.includes('detergent') ||
    id.includes('base_station') ||
    id.includes('washing_mode') ||
    id.includes('water_temperature') ||
    id.includes('manual_drying') ||
    id.includes('water_tank_draining')
  ) {
    return 'dock';
  }
  if (
    id.includes('suction') ||
    id.includes('mop') ||
    id.includes('wetness') ||
    id.includes('cleaning_mode') ||
    id.includes('cleaning_route') ||
    id.includes('carpet') ||
    id.includes('cleangenius') ||
    id.includes('customized_cleaning') ||
    id.includes('resume_cleaning') ||
    id.includes('cleaning_sequence')
  ) {
    return 'clean';
  }
  if (
    domain === 'sensor' ||
    domain === 'binary_sensor' ||
    id.includes('battery') ||
    id.includes('charging') ||
    id.includes('task_') ||
    id.includes('error') ||
    id.includes('status') ||
    id.includes('state') ||
    id.includes('progress') ||
    id.includes('cleaned') ||
    id.includes('current_room')
  ) {
    return 'status';
  }
  return 'advanced';
}

function isEssential(entityId: string, section: AuVacuumSettingsSection): boolean {
  const id = entityId.toLowerCase();
  const domain = computeDomain(entityId);
  if (domain === 'camera' && id.includes('_map') && !id.endsWith('_map_1')) {
    return true;
  }
  if (domain === 'camera' && id.endsWith('_map')) return true;

  const roomMatch = id.match(ROOM_RE);
  if (roomMatch) return false;

  const suffix = suffixOf(entityId);
  if (ESSENTIAL_SUFFIXES.has(suffix)) return true;

  // Dock essentials by full-token match
  if (
    section === 'dock' &&
    (id.endsWith('_start_auto_empty') ||
      id.endsWith('_self_clean') ||
      suffix === 'self_clean' ||
      suffix === 'start_auto_empty')
  ) {
    return true;
  }
  return false;
}

function pickMapCamera(entityIds: string[]): string | undefined {
  const cams = entityIds.filter((id) => computeDomain(id) === 'camera');
  if (!cams.length) return undefined;
  const primary = cams.find(
    (id) => id.endsWith('_map') && !id.endsWith('_map_1'),
  );
  return primary ?? cams.find((id) => id.includes('_map')) ?? cams[0];
}

/**
 * Build a catalog of enabled device members for `vacuumEntityId`.
 * Falls back to vacuum-only when device registry is missing.
 */
export function buildVacuumDeviceCatalog(
  hass: HomeAssistant,
  vacuumEntityId: string,
): VacuumDeviceCatalog {
  const deviceId = hass.entities?.[vacuumEntityId]?.device_id ?? undefined;
  let memberIds: string[];

  if (deviceId && hass.entities) {
    memberIds = Object.keys(hass.entities).filter((id) => {
      const entry = hass.entities![id];
      return entry?.device_id === deviceId && isEnabledRegistryEntry(hass, id);
    });
  } else {
    // Fallback: vacuum + same object_id prefix in states.
    const objectId = vacuumEntityId.includes('.')
      ? vacuumEntityId.slice(vacuumEntityId.indexOf('.') + 1)
      : vacuumEntityId;
    memberIds = Object.keys(hass.states).filter(
      (id) =>
        id === vacuumEntityId ||
        id.includes(`.${objectId}_`) ||
        id.endsWith(`.${objectId}`),
    );
  }

  // Ensure vacuum itself is present.
  if (!memberIds.includes(vacuumEntityId)) memberIds.push(vacuumEntityId);

  const roomMap = new Map<number, VacuumRoomInfo>();
  const entries: VacuumCatalogEntry[] = [];

  for (const entityId of memberIds.sort()) {
    const domain = computeDomain(entityId);
    if (domain === 'vacuum') continue;

    const section = classifyVacuumSection(entityId);
    const roomMatch = entityId.match(ROOM_RE);
    let roomIndex: number | undefined;
    let roomKey: string | undefined;
    if (roomMatch) {
      roomIndex = Number(roomMatch[1]);
      roomKey = roomMatch[2];
      const room = roomMap.get(roomIndex) ?? {
        index: roomIndex,
        entityIds: [],
      };
      room.entityIds.push(entityId);
      if (roomKey === 'name') room.nameEntityId = entityId;
      roomMap.set(roomIndex, room);
    }

    const tier: VacuumCatalogTier = isEssential(entityId, section)
      ? 'essentials'
      : 'advanced';

    entries.push({
      entityId,
      domain,
      section: roomIndex !== undefined ? 'rooms' : section,
      tier,
      roomIndex,
      roomKey,
    });
  }

  const mapCameraId = pickMapCamera(memberIds);
  const bySuffix = (suffix: string, domain?: string): string | undefined =>
    memberIds.find((id) => {
      if (domain && computeDomain(id) !== domain) return false;
      return id.endsWith(`_${suffix}`) || suffixOf(id) === suffix;
    });

  return {
    vacuumEntityId,
    deviceId: deviceId ?? undefined,
    entries,
    rooms: [...roomMap.values()].sort((a, b) => a.index - b.index),
    mapCameraId,
    statusEntityIds: {
      battery: bySuffix('battery_level', 'sensor'),
      status:
        bySuffix('status', 'sensor') ??
        bySuffix('state', 'sensor') ??
        bySuffix('task_status', 'sensor'),
      cleanedArea: bySuffix('cleaned_area', 'sensor'),
      cleaningProgress: bySuffix('cleaning_progress', 'sensor'),
      cleaningTime: bySuffix('cleaning_time', 'sensor'),
      currentRoom: bySuffix('current_room', 'sensor'),
    },
  };
}

export function filterCatalogSections(
  catalog: VacuumDeviceCatalog,
  hideSections: readonly string[] | undefined,
): VacuumDeviceCatalog {
  if (!hideSections?.length) return catalog;
  const hide = new Set(hideSections.map((s) => s.toLowerCase()));
  return {
    ...catalog,
    entries: catalog.entries.filter((e) => !hide.has(e.section)),
    rooms: hide.has('rooms') ? [] : catalog.rooms,
    mapCameraId: hide.has('map') ? undefined : catalog.mapCameraId,
  };
}

export function entriesForSection(
  catalog: VacuumDeviceCatalog,
  section: AuVacuumSettingsSection,
  tier?: VacuumCatalogTier,
): VacuumCatalogEntry[] {
  return catalog.entries.filter((e) => {
    if (section === 'essentials') return e.tier === 'essentials';
    if (section === 'advanced') {
      return e.tier === 'advanced' && e.section !== 'rooms';
    }
    if (e.section !== section) return false;
    if (tier) return e.tier === tier;
    return true;
  });
}

export function roomDisplayName(
  hass: HomeAssistant,
  room: VacuumRoomInfo,
): string {
  if (room.nameEntityId) {
    const state = hass.states[room.nameEntityId]?.state;
    if (state && state !== 'unknown' && state !== 'unavailable') {
      return state;
    }
    const friendly =
      hass.states[room.nameEntityId]?.attributes.friendly_name;
    if (friendly) return friendly;
  }
  return `Room ${room.index}`;
}

/**
 * Humanize vacuum object_id tokens into display-name candidates
 * (e.g. `vacuum.x40_ultra` → `"X40 Ultra"`, `vacuum.dreame_x40_ultra` →
 * `"Dreame X40 Ultra"` and `"X40 Ultra"`).
 */
function prefixesFromVacuumEntityId(vacuumEntityId: string): string[] {
  const objectId = vacuumEntityId.includes('.')
    ? vacuumEntityId.slice(vacuumEntityId.indexOf('.') + 1)
    : vacuumEntityId;
  const parts = objectId.split('_').filter(Boolean);
  if (!parts.length) return [];

  const humanize = (tokens: string[]): string =>
    tokens
      .map((p) => {
        if (/^[a-z]+\d/i.test(p) || (p.length <= 3 && /\d/.test(p))) {
          return p.toUpperCase();
        }
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join(' ');

  const out: string[] = [];
  for (let start = 0; start < parts.length; start++) {
    const slice = parts.slice(start);
    if (!slice.length) continue;
    const name = humanize(slice);
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

/**
 * Resolve candidate device-name prefixes to strip from child entity labels.
 * Prefers device registry names (what HA usually prefixes onto members), then
 * vacuum friendly_name / overlay title / humanized entity_id tokens.
 */
export function vacuumLabelPrefixes(
  hass: HomeAssistant | undefined,
  vacuumEntityId: string,
  title?: string,
): string[] {
  const names: string[] = [];
  const push = (value: unknown) => {
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (trimmed && !names.includes(trimmed)) names.push(trimmed);
  };

  const deviceId = hass?.entities?.[vacuumEntityId]?.device_id ?? undefined;
  const device = deviceId ? hass?.devices?.[deviceId] : undefined;
  push(device?.name_by_user);
  push(device?.name);
  push(hass?.states[vacuumEntityId]?.attributes.friendly_name);
  push(title);
  for (const candidate of prefixesFromVacuumEntityId(vacuumEntityId)) {
    push(candidate);
  }

  return names;
}

function stripDevicePrefix(raw: string, prefix: string): string | undefined {
  const trimmedPrefix = prefix.trim();
  if (!trimmedPrefix) return undefined;

  const lowerRaw = raw.toLowerCase();
  const lowerPrefix = trimmedPrefix.toLowerCase();
  if (!lowerRaw.startsWith(lowerPrefix)) return undefined;

  let rest = raw.slice(trimmedPrefix.length);
  if (rest.length === 0) return undefined;

  // Allow "Name Foo", "Name: Foo", "Name - Foo"
  const sep = rest.match(/^(\s*[-:]\s+|\s+)/);
  if (!sep) return undefined;

  const stripped = rest.slice(sep[0].length);
  return stripped || undefined;
}

export function entityLabel(
  entity: HassEntity | undefined,
  entityId: string,
  deviceName?: string | readonly string[],
): string {
  const raw = entity?.attributes.friendly_name ?? entityId;
  const candidates = (
    Array.isArray(deviceName)
      ? deviceName
      : deviceName
        ? [deviceName]
        : []
  )
    .map((n) => n.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const prefix of candidates) {
    const stripped = stripDevicePrefix(raw, prefix);
    if (stripped) return stripped;
  }
  return raw;
}

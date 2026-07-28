import { computeDomain } from './entity';
import type { AuHomeEntityConfig } from '../types/home';

/** Resolve a display icon for a home/room control entity. */
export function controlIcon(input: {
  entity: AuHomeEntityConfig;
  stripIcons?: Record<string, string>;
  attrIcon?: string;
}): string {
  const stripIcon = input.stripIcons?.[input.entity.entity];
  if (stripIcon) return stripIcon;
  if (input.entity.icon) return input.entity.icon;
  if (typeof input.attrIcon === 'string' && input.attrIcon) {
    return input.attrIcon;
  }
  return computeDomain(input.entity.entity) === 'switch'
    ? 'mdi:toggle-switch'
    : 'mdi:lightbulb';
}

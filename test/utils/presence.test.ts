import { describe, it, expect } from 'vitest';
import { buildPresenceItems, isPresenceEntity } from '../../src/utils/presence';
import { makeEntity } from '../helpers';

describe('presence utils', () => {
  it('detects presence domains', () => {
    expect(isPresenceEntity('person.alex')).toBe(true);
    expect(isPresenceEntity('device_tracker.phone')).toBe(true);
    expect(isPresenceEntity('light.kitchen')).toBe(false);
  });

  it('builds presence strip items', () => {
    const items = buildPresenceItems(
      ['person.alex', 'person.missing'],
      {
        'person.alex': makeEntity('person.alex', 'home', {
          friendly_name: 'Alex',
        }),
      },
    );
    expect(items[0]?.home).toBe(true);
    expect(items[0]?.name).toBe('Alex');
    expect(items[1]?.unavailable).toBe(true);
  });
});

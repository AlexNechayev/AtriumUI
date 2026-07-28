import { describe, it, expect, vi } from 'vitest';
import {
  getCoverCapabilities,
  getCoverPosition,
  openCover,
  closeCover,
  stopCover,
  setCoverPosition,
  validateCoverEntity,
} from '../../src/utils/cover';
import { makeEntity, makeHass } from '../helpers';

describe('cover utils', () => {
  it('validates cover domain', () => {
    expect(() => validateCoverEntity('light.x')).toThrow(/Cover Card/);
    expect(() => validateCoverEntity('cover.g')).not.toThrow();
  });

  it('reads capabilities from supported_features', () => {
    const entity = makeEntity('cover.g', 'open', {
      supported_features: 1 | 2 | 4 | 8,
      current_position: 40,
    });
    expect(getCoverCapabilities(entity)).toEqual({
      canOpen: true,
      canClose: true,
      canStop: true,
      canSetPosition: true,
    });
    expect(getCoverPosition(entity)).toBe(40);
  });

  it('calls cover services', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await openCover(hass, 'cover.g');
    await closeCover(hass, 'cover.g');
    await stopCover(hass, 'cover.g');
    await setCoverPosition(hass, 'cover.g', 150);
    expect(callService).toHaveBeenCalledWith('cover', 'open_cover', {
      entity_id: 'cover.g',
    });
    expect(callService).toHaveBeenCalledWith('cover', 'close_cover', {
      entity_id: 'cover.g',
    });
    expect(callService).toHaveBeenCalledWith('cover', 'stop_cover', {
      entity_id: 'cover.g',
    });
    expect(callService).toHaveBeenCalledWith('cover', 'set_cover_position', {
      entity_id: 'cover.g',
      position: 100,
    });
  });
});

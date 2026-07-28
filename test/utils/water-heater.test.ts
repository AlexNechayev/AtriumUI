import { describe, it, expect, vi } from 'vitest';
import {
  getWaterHeaterCapabilities,
  getWaterHeaterTemperature,
  setWaterHeaterTemperature,
  turnOffWaterHeater,
  turnOnWaterHeater,
  validateWaterHeaterEntity,
} from '../../src/utils/water-heater';
import { makeEntity, makeHass } from '../helpers';

describe('water-heater utils', () => {
  it('validates domain', () => {
    expect(() => validateWaterHeaterEntity('climate.x')).toThrow(/water_heater/);
  });

  it('reads temperature bounds and current temp', () => {
    const entity = makeEntity('water_heater.tank', 'on', {
      temperature: 48,
      min_temp: 35,
      max_temp: 65,
      target_temp_step: 0.5,
      operation_list: ['eco', 'performance'],
    });
    const caps = getWaterHeaterCapabilities(entity);
    expect(caps).toMatchObject({
      canSetTemperature: true,
      minTemp: 35,
      maxTemp: 65,
      step: 0.5,
    });
    expect(getWaterHeaterTemperature(entity)).toBe(48);
  });

  it('calls water_heater services', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await setWaterHeaterTemperature(hass, 'water_heater.tank', 50);
    await turnOnWaterHeater(hass, 'water_heater.tank');
    await turnOffWaterHeater(hass, 'water_heater.tank');
    expect(callService).toHaveBeenCalledWith('water_heater', 'set_temperature', {
      entity_id: 'water_heater.tank',
      temperature: 50,
    });
  });
});

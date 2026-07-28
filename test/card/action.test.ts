import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  defaultDoubleTapAction,
  defaultHoldAction,
  defaultTapAction,
  executeAction,
  resolveAction,
} from '../../src/utils/action';
import { makeHass } from '../helpers';
import { makeEntity } from '../helpers';

describe('defaultTapAction / defaultHoldAction / defaultDoubleTapAction', () => {
  it('returns toggle for tap and more-info for hold / double-tap', () => {
    expect(defaultTapAction('light.kitchen')).toEqual({
      action: 'toggle',
      entity: 'light.kitchen',
    });
    expect(defaultHoldAction('light.kitchen')).toEqual({
      action: 'more-info',
      entity: 'light.kitchen',
    });
    expect(defaultDoubleTapAction('light.kitchen')).toEqual({
      action: 'more-info',
      entity: 'light.kitchen',
    });
  });
});

describe('resolveAction', () => {
  it('returns explicit config when set', () => {
    const action = { action: 'toggle' as const, entity: 'light.a' };
    expect(resolveAction(action, 'light.b', 'tap')).toBe(action);
  });

  it('falls back to defaults when omitted', () => {
    expect(resolveAction(undefined, 'light.b', 'tap')).toEqual(
      defaultTapAction('light.b'),
    );
    expect(resolveAction(undefined, 'light.b', 'hold')).toEqual(
      defaultHoldAction('light.b'),
    );
    expect(resolveAction(undefined, 'light.b', 'double_tap')).toEqual(
      defaultDoubleTapAction('light.b'),
    );
  });
});

describe('executeAction', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  it('fires hass-more-info for more-info action', async () => {
    const spy = vi.fn();
    host.addEventListener('hass-more-info', spy);
    const hass = makeHass({});

    await executeAction(
      host,
      hass,
      { action: 'more-info', entity: 'light.kitchen' },
      'light.fallback',
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'light.kitchen' });
  });

  it('uses fallback entity when action entity is omitted', async () => {
    const spy = vi.fn();
    host.addEventListener('hass-more-info', spy);
    const hass = makeHass({});

    await executeAction(host, hass, { action: 'more-info' }, 'sensor.temp');

    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'sensor.temp' });
  });

  it('calls toggle service for toggle action', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass(
      { 'switch.fan': makeEntity('switch.fan', 'off') },
      callService,
    );

    await executeAction(
      host,
      hass,
      { action: 'toggle', entity: 'switch.fan' },
      'switch.fan',
    );

    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', {
      entity_id: 'switch.fan',
    });
  });

  it('restores last brightness when toggling a dimmable light', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass(
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          brightness: 90,
        }),
      },
      callService,
    );

    await executeAction(
      host,
      hass,
      { action: 'toggle', entity: 'light.cct' },
      'light.cct',
    );
    expect(callService).toHaveBeenCalledWith('light', 'turn_off', {
      entity_id: 'light.cct',
    });

    callService.mockClear();
    hass.states['light.cct'] = makeEntity('light.cct', 'off', {
      supported_color_modes: ['color_temp'],
    });
    await executeAction(
      host,
      hass,
      { action: 'toggle', entity: 'light.cct' },
      'light.cct',
    );
    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.cct',
      brightness: 90,
    });
  });

  it('falls back to more-info when toggle target is not toggleable', async () => {
    const spy = vi.fn();
    host.addEventListener('hass-more-info', spy);
    const callService = vi.fn();
    const hass = makeHass(
      { 'sensor.temp': makeEntity('sensor.temp', '21') },
      callService,
    );

    await executeAction(
      host,
      hass,
      { action: 'toggle', entity: 'sensor.temp' },
      'sensor.temp',
    );

    expect(callService).not.toHaveBeenCalled();
    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'sensor.temp' });
  });

  it('falls back to more-info when toggle target is unavailable', async () => {
    const spy = vi.fn();
    host.addEventListener('hass-more-info', spy);
    const callService = vi.fn();
    const hass = makeHass(
      { 'light.kitchen': makeEntity('light.kitchen', 'unavailable') },
      callService,
    );

    await executeAction(
      host,
      hass,
      { action: 'toggle', entity: 'light.kitchen' },
      'light.kitchen',
    );

    expect(callService).not.toHaveBeenCalled();
    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'light.kitchen' });
  });

  it('calls call-service action', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);

    await executeAction(
      host,
      hass,
      {
        action: 'call-service',
        service: 'switch.turn_on',
        service_data: { entity_id: 'switch.fan' },
      },
      'switch.fan',
    );

    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', {
      entity_id: 'switch.fan',
    });
  });

  it('does nothing for none action', async () => {
    const callService = vi.fn();
    const spy = vi.fn();
    host.addEventListener('hass-more-info', spy);
    const hass = makeHass({}, callService);

    await executeAction(host, hass, { action: 'none' }, 'light.k');

    expect(callService).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects call-service outside the allowlist', async () => {
    const callService = vi.fn();
    const hass = makeHass({}, callService);
    await executeAction(
      host,
      hass,
      { action: 'call-service', service: 'homeassistant.restart' },
      'light.k',
    );
    expect(callService).not.toHaveBeenCalled();
    await executeAction(
      host,
      hass,
      { action: 'call-service', service: 'shell_command.evil' },
      'light.k',
    );
    expect(callService).not.toHaveBeenCalled();
  });

  it('rejects javascript: urls and opens safe urls with noopener', async () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    const hass = makeHass({});
    await executeAction(
      host,
      hass,
      { action: 'url', url_path: 'javascript:alert(1)' },
      'light.k',
    );
    expect(openSpy).not.toHaveBeenCalled();
    await executeAction(
      host,
      hass,
      { action: 'url', url_path: 'https://example.com' },
      'light.k',
    );
    expect(openSpy).toHaveBeenCalledWith(
      'https://example.com',
      '_blank',
      'noopener,noreferrer',
    );
    openSpy.mockRestore();
  });

  it('rejects navigate paths that are not in-app', async () => {
    const spy = vi.fn();
    window.addEventListener('location-changed', spy);
    const hass = makeHass({});
    await executeAction(
      host,
      hass,
      { action: 'navigate', navigation_path: '//evil.example' },
      'light.k',
    );
    expect(spy).not.toHaveBeenCalled();
    await executeAction(
      host,
      hass,
      { action: 'navigate', navigation_path: '/lovelace/home' },
      'light.k',
    );
    expect(spy).toHaveBeenCalledTimes(1);
    window.removeEventListener('location-changed', spy);
  });
});

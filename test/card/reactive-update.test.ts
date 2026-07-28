import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { hasEntityChanged } from '../../src/core/base-card';
import { makeEntity, makeHass } from '../helpers';

/**
 * Spec 3.1: cards must leverage a change check and never force unconditional
 * re-renders. Spec 3.3: state updates go over callService. Spec 7: background
 * references are torn down on disconnect.
 */

describe('hasEntityChanged (Δ change check, spec 3.1)', () => {
  it('is false when the state object reference is unchanged', () => {
    const entity = makeEntity('light.k', 'on');
    const prev = makeHass({ 'light.k': entity });
    const next = makeHass({ 'light.k': entity });
    expect(hasEntityChanged(prev, next, 'light.k')).toBe(false);
  });

  it('is true when the entity state object changes', () => {
    const prev = makeHass({ 'light.k': makeEntity('light.k', 'on') });
    const next = makeHass({ 'light.k': makeEntity('light.k', 'off') });
    expect(hasEntityChanged(prev, next, 'light.k')).toBe(true);
  });

  it('is true when either hass is undefined', () => {
    expect(hasEntityChanged(undefined, makeHass({}), 'light.k')).toBe(true);
  });
});

type TestableCard = HTMLElement & {
  setConfig(config: Record<string, unknown>): void;
  hass?: unknown;
  shouldUpdate(changed: Map<string, unknown>): boolean;
  registerTeardown(fn: () => void): void;
  disconnectedCallback(): void;
  _onAction(ev: CustomEvent<{ action: 'tap' | 'hold' | 'double_tap' }>): void;
};

function makeCard(tag: string): TestableCard {
  return document.createElement(tag) as unknown as TestableCard;
}

describe('shouldUpdate reactive gate (spec 3.1)', () => {
  it('skips re-render when the tracked entity is unchanged', () => {
    const entity = makeEntity('light.k', 'on');
    const el = makeCard('au-action-card');
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });

    const prev = makeHass({ 'light.k': entity });
    el.hass = makeHass({
      'light.k': entity,
      'sensor.other': makeEntity('sensor.other', '99'),
    });

    expect(el.shouldUpdate(new Map([['hass', prev]]))).toBe(false);
  });

  it('re-renders when the tracked entity changed', () => {
    const el = makeCard('au-action-card');
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });

    const prev = makeHass({ 'light.k': makeEntity('light.k', 'on') });
    el.hass = makeHass({ 'light.k': makeEntity('light.k', 'off') });

    expect(el.shouldUpdate(new Map([['hass', prev]]))).toBe(true);
  });

  it('re-renders when the config changed', () => {
    const el = makeCard('au-action-card');
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.k' });
    expect(el.shouldUpdate(new Map([['_config', undefined]]))).toBe(true);
  });
});

describe('HA action execution (spec 3.3)', () => {
  it('default tap toggles the entity', async () => {
    const el = makeCard('au-action-card');
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.kitchen' });
    const callService = vi.fn().mockResolvedValue(undefined);
    el.hass = makeHass(
      { 'light.kitchen': makeEntity('light.kitchen', 'off') },
      callService,
    );

    el._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('light', 'toggle', {
      entity_id: 'light.kitchen',
    });
  });

  it('default hold opens more-info', () => {
    const el = makeCard('au-action-card');
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.kitchen' });
    el.hass = makeHass({
      'light.kitchen': makeEntity('light.kitchen', 'off'),
    });

    const spy = vi.fn();
    el.addEventListener('hass-more-info', spy);

    el._onAction(new CustomEvent('action', { detail: { action: 'hold' } }));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'light.kitchen' });
  });

  it('default double_tap opens more-info', () => {
    const el = makeCard('au-action-card');
    el.setConfig({ type: 'custom:au-action-card', entity: 'light.kitchen' });
    el.hass = makeHass({
      'light.kitchen': makeEntity('light.kitchen', 'off'),
    });

    const spy = vi.fn();
    el.addEventListener('hass-more-info', spy);

    el._onAction(new CustomEvent('action', { detail: { action: 'double_tap' } }));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'light.kitchen' });
  });

  it('honors explicit tap_action toggle', async () => {
    const el = makeCard('au-action-card');
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'switch.fan',
      tap_action: { action: 'toggle', entity: 'switch.fan' },
    });
    const callService = vi.fn().mockResolvedValue(undefined);
    el.hass = makeHass({ 'switch.fan': makeEntity('switch.fan', 'off') }, callService);

    el._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', {
      entity_id: 'switch.fan',
    });
  });

  it('honors explicit tap_action call-service', async () => {
    const el = makeCard('au-action-card');
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'switch.fan',
      tap_action: {
        action: 'call-service',
        service: 'switch.turn_on',
        service_data: { entity_id: 'switch.fan' },
      },
    });
    const callService = vi.fn().mockResolvedValue(undefined);
    el.hass = makeHass({ 'switch.fan': makeEntity('switch.fan', 'off') }, callService);

    el._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', {
      entity_id: 'switch.fan',
    });
  });

  it('honors explicit tap_action more-info override', () => {
    const el = makeCard('au-action-card');
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'light.kitchen',
      tap_action: { action: 'more-info', entity: 'light.kitchen' },
    });
    el.hass = makeHass({
      'light.kitchen': makeEntity('light.kitchen', 'off'),
    });

    const spy = vi.fn();
    el.addEventListener('hass-more-info', spy);

    el._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]![0].detail).toEqual({ entityId: 'light.kitchen' });
  });
});

describe('teardown lifecycle (spec 7)', () => {
  it('drains registered teardown callbacks on disconnect', () => {
    const el = makeCard('au-sensor-card');
    const spy = vi.fn();
    el.registerTeardown(spy);
    el.disconnectedCallback();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

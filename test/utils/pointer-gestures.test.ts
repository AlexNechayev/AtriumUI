import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DOUBLE_TAP_MS,
  HOLD_MS,
  createPointerGestureState,
  handleGesturePointerCancel,
  handleGesturePointerDown,
  handleGesturePointerUp,
} from '../../src/utils/pointer-gestures';

function leftPointerDown(): PointerEvent {
  return { button: 0, pointerType: 'mouse' } as PointerEvent;
}

function touchPointerDown(): PointerEvent {
  return { button: 0, pointerType: 'touch' } as PointerEvent;
}

describe('pointer-gestures', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires hold after HOLD_MS without a tap', () => {
    const state = createPointerGestureState();
    const onTap = vi.fn();
    const onHold = vi.fn();

    handleGesturePointerDown(state, leftPointerDown(), { onHold });
    vi.advanceTimersByTime(HOLD_MS);
    expect(onHold).toHaveBeenCalledTimes(1);

    handleGesturePointerUp(state, { onTap, onHold });
    expect(onTap).not.toHaveBeenCalled();
  });

  it('defers tap when double-tap is enabled, then fires tap', () => {
    const state = createPointerGestureState();
    const onTap = vi.fn();
    const onDoubleTap = vi.fn();

    handleGesturePointerDown(state, leftPointerDown(), {});
    handleGesturePointerUp(state, { onTap, onDoubleTap });
    expect(onTap).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DOUBLE_TAP_MS);
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('fires double-tap and suppresses deferred tap', () => {
    const state = createPointerGestureState();
    const onTap = vi.fn();
    const onDoubleTap = vi.fn();

    handleGesturePointerDown(state, leftPointerDown(), {});
    handleGesturePointerUp(state, { onTap, onDoubleTap });
    handleGesturePointerDown(state, leftPointerDown(), {});
    handleGesturePointerUp(state, { onTap, onDoubleTap });

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(DOUBLE_TAP_MS);
    expect(onTap).not.toHaveBeenCalled();
  });

  it('cancels pending hold on pointer cancel', () => {
    const state = createPointerGestureState();
    const onHold = vi.fn();
    handleGesturePointerDown(state, leftPointerDown(), { onHold });
    handleGesturePointerCancel(state);
    vi.advanceTimersByTime(HOLD_MS);
    expect(onHold).not.toHaveBeenCalled();
  });

  it('keeps deferred tap after leave/cancel (touch end pattern)', () => {
    const state = createPointerGestureState();
    const onTap = vi.fn();
    const onDoubleTap = vi.fn();

    handleGesturePointerDown(state, touchPointerDown(), {});
    handleGesturePointerUp(state, { onTap, onDoubleTap });
    // Touch browsers often emit leave/cancel after pointerup.
    handleGesturePointerCancel(state);
    vi.advanceTimersByTime(DOUBLE_TAP_MS);
    expect(onTap).toHaveBeenCalledTimes(1);
  });
});

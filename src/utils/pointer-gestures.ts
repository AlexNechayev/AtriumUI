/**
 * Shared tap / hold / double-tap pointer handling for action cards and Home tiles.
 * Matches Home Assistant action-handler timing (~500ms hold).
 */

export const HOLD_MS = 500;
export const DOUBLE_TAP_MS = 300;

export type GestureKind = 'tap' | 'hold' | 'double_tap';

export interface PointerGestureCallbacks {
  onTap?: () => void;
  onHold?: () => void;
  onDoubleTap?: () => void;
}

/** Mutable state for one interactive surface. */
export interface PointerGestureState {
  holdTimer?: ReturnType<typeof setTimeout>;
  holdFired: boolean;
  lastTapAt: number;
  /** Suppress the delayed single-tap after a double-tap. */
  tapTimer?: ReturnType<typeof setTimeout>;
}

export function createPointerGestureState(): PointerGestureState {
  return { holdFired: false, lastTapAt: 0 };
}

export function clearHoldTimer(state: PointerGestureState): void {
  if (state.holdTimer !== undefined) {
    clearTimeout(state.holdTimer);
    state.holdTimer = undefined;
  }
}

export function clearTapTimer(state: PointerGestureState): void {
  if (state.tapTimer !== undefined) {
    clearTimeout(state.tapTimer);
    state.tapTimer = undefined;
  }
}

export function handleGesturePointerDown(
  state: PointerGestureState,
  ev: PointerEvent,
  callbacks: PointerGestureCallbacks,
): void {
  // Touch pointers report button 0; ignore non-primary mouse buttons only.
  if (ev.pointerType === 'mouse' && ev.button !== 0) return;
  state.holdFired = false;
  clearHoldTimer(state);
  state.holdTimer = setTimeout(() => {
    state.holdFired = true;
    clearTapTimer(state);
    callbacks.onHold?.();
  }, HOLD_MS);
}

export function handleGesturePointerUp(
  state: PointerGestureState,
  callbacks: PointerGestureCallbacks,
): void {
  clearHoldTimer(state);
  if (state.holdFired) {
    state.holdFired = false;
    return;
  }
  state.holdFired = false;

  const now = Date.now();
  const isDouble =
    state.lastTapAt > 0 && now - state.lastTapAt <= DOUBLE_TAP_MS;

  if (isDouble) {
    clearTapTimer(state);
    state.lastTapAt = 0;
    callbacks.onDoubleTap?.();
    return;
  }

  state.lastTapAt = now;
  clearTapTimer(state);
  // Defer single tap so a second tap can form a double-tap.
  if (callbacks.onDoubleTap) {
    state.tapTimer = setTimeout(() => {
      state.tapTimer = undefined;
      callbacks.onTap?.();
    }, DOUBLE_TAP_MS);
  } else {
    callbacks.onTap?.();
  }
}

/**
 * Abort an in-progress press (hold). Do **not** clear a post-`pointerup` tap
 * timer — touch browsers often emit `pointerleave`/`pointercancel` after up,
 * which would otherwise swallow the tap (mouse still works).
 */
export function handleGesturePointerCancel(state: PointerGestureState): void {
  const tapPending = state.tapTimer !== undefined;
  clearHoldTimer(state);
  state.holdFired = false;
  if (!tapPending) {
    clearTapTimer(state);
  }
}

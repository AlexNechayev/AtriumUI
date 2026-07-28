/**
 * Deduped activation for controls that may receive pointerup + touchend + click
 * for a single physical tap (common on tablets).
 */

const recentActivate = new WeakSet<EventTarget>();

/** Mark target as activated; subsequent events for ~700ms are ignored. */
export function markActivated(target: EventTarget): void {
  recentActivate.add(target);
  window.setTimeout(() => recentActivate.delete(target), 700);
}

/**
 * Run `action` once per physical tap. Prefer calling with the real control
 * element (not `currentTarget` from a delegated listener).
 */
export function activateOnce(
  target: EventTarget,
  ev: Event,
  action: () => void,
): void {
  if (recentActivate.has(target)) {
    ev.stopPropagation();
    if (ev.cancelable) ev.preventDefault();
    return;
  }
  markActivated(target);
  ev.stopPropagation();
  if (ev.cancelable) ev.preventDefault();
  action();
}

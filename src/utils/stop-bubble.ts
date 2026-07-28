/** Bind pointer/click stopPropagation on a host so nested controls don't fire parent gestures. */
export function bindStopBubble(
  host: EventTarget,
  handler: (ev: Event) => void,
): void {
  host.addEventListener('pointerdown', handler);
  host.addEventListener('pointerup', handler);
  host.addEventListener('click', handler);
}

export function unbindStopBubble(
  host: EventTarget,
  handler: (ev: Event) => void,
): void {
  host.removeEventListener('pointerdown', handler);
  host.removeEventListener('pointerup', handler);
  host.removeEventListener('click', handler);
}

export function stopPropagation(ev: Event): void {
  ev.stopPropagation();
}

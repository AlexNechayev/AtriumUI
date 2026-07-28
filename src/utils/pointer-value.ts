/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Snap a value to the nearest step from min. */
export function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  if (step <= 0) return clamp(value, min, max);
  const snapped = min + Math.round((value - min) / step) * step;
  return clamp(snapped, min, max);
}

/** Map a clientX position within a track element to a value in [min, max]. */
export function valueFromClientX(
  clientX: number,
  track: HTMLElement,
  min: number,
  max: number,
  step: number,
): number {
  const rect = track.getBoundingClientRect();
  const width = rect.width || 1;
  const ratio = clamp((clientX - rect.left) / width, 0, 1);
  const raw = min + ratio * (max - min);
  return snapToStep(raw, min, max, step);
}

/** Returns a debounced wrapper; call `.cancel()` on teardown. */
export function createDebounced<T extends unknown[]>(
  fn: (...args: T) => void,
  delayMs: number,
): { (...args: T): void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: T): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delayMs);
  };
  debounced.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  return debounced;
}

/** Structured debug logger gated by a card `debug` flag. */
export function auDebug(
  enabled: boolean | undefined,
  scope: string,
  message: string,
  data?: unknown,
): void {
  if (!enabled) return;
  /* eslint-disable no-console */
  if (data !== undefined) {
    console.debug(`[AtriumUI:${scope}] ${message}`, data);
  } else {
    console.debug(`[AtriumUI:${scope}] ${message}`);
  }
}

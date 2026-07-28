/**
 * Dispatch a composed, bubbling CustomEvent the way the Home Assistant frontend
 * expects. Editors use this to emit `config-changed` back to the Lovelace editor
 * so the dashboard config stays in sync with the visual form.
 */
export function fireEvent<T>(
  node: HTMLElement | Window,
  type: string,
  detail?: T,
): CustomEvent<T> {
  const event = new CustomEvent<T>(type, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: false,
  });
  node.dispatchEvent(event);
  return event;
}

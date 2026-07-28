/**
 * Optimistic pending-value holder for sliders/steppers.
 * Clears when hass updates unless the pointer is actively dragging.
 */
export class PendingControl<T> {
  private _value: T | undefined;
  private _dragging = false;

  get value(): T | undefined {
    return this._value;
  }

  get dragging(): boolean {
    return this._dragging;
  }

  set(value: T): void {
    this._value = value;
  }

  beginDrag(): void {
    this._dragging = true;
  }

  endDrag(): void {
    this._dragging = false;
  }

  /** Clear pending when hass catches up (skip while dragging). */
  clearUnlessDragging(): void {
    if (!this._dragging) this._value = undefined;
  }

  clear(): void {
    this._value = undefined;
    this._dragging = false;
  }
}

import { describe, expect, it, vi } from 'vitest';
import { activateOnce } from '../../src/utils/touch-click';

describe('touch-click', () => {
  it('activateOnce runs once across touch then click', () => {
    const target = document.createElement('div');
    const action = vi.fn();
    const touch = new Event('touchend', { bubbles: true, cancelable: true });
    activateOnce(target, touch, action);
    expect(action).toHaveBeenCalledOnce();
    expect(touch.defaultPrevented).toBe(true);

    const click = new Event('click', { bubbles: true, cancelable: true });
    activateOnce(target, click, action);
    expect(action).toHaveBeenCalledOnce();
  });

  it('runs action on mouse click when there was no touch', () => {
    const target = document.createElement('button');
    const action = vi.fn();
    const click = new Event('click', { bubbles: true, cancelable: true });
    activateOnce(target, click, action);
    expect(action).toHaveBeenCalledOnce();
  });
});

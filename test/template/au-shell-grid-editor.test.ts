import { describe, it, expect, vi } from 'vitest';
import { AuShellGridEditor } from '../../src/template/shell-grid/au-shell-grid-editor';
import { makeHass } from '../helpers';

describe('au-shell-grid-editor', () => {
  it('seeds default floors when setConfig has none', async () => {
    const el = new AuShellGridEditor();
    document.body.appendChild(el);
    el.hass = makeHass({});
    el.setConfig({ type: 'custom:au-shell-grid' });
    await el.updateComplete;
    const cfg = (el as unknown as { _config?: { floors?: unknown[] } })._config;
    expect(cfg?.floors?.length).toBeGreaterThan(0);
    el.remove();
  });

  it('emits config-changed when floors are patched', async () => {
    const el = new AuShellGridEditor();
    document.body.appendChild(el);
    el.hass = makeHass({});
    el.setConfig({
      type: 'custom:au-shell-grid',
      floors: [{ name: 'Main', rooms: [{ name: 'Living', entities: [] }] }],
    });
    await el.updateComplete;

    const onChange = vi.fn();
    el.addEventListener('config-changed', onChange);

    (
      el as unknown as {
        _emit: (cfg: Record<string, unknown>) => void;
      }
    )._emit({
      type: 'custom:au-shell-grid',
      floors: [
        {
          name: 'Main',
          rooms: [
            {
              name: 'Living',
              entities: [{ entity: 'light.a' }],
            },
          ],
        },
      ],
    });

    expect(onChange).toHaveBeenCalled();
    const detail = onChange.mock.calls[0]?.[0]?.detail as {
      config: {
        floors: Array<{
          rooms: Array<{ entities: Array<{ entity: string }> }>;
        }>;
      };
    };
    expect(detail.config.floors[0]?.rooms[0]?.entities[0]?.entity).toBe(
      'light.a',
    );
    el.remove();
  });
});

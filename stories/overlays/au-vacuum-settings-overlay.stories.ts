import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/vacuum-card/au-vacuum-settings-overlay';
import { AuVacuumSettingsOverlay } from '../../src/card/vacuum-card/au-vacuum-settings-overlay';
import { demoHass } from '../fixtures/hass';

const meta = {
  title: 'Overlays/Vacuum Settings',
  component: 'au-vacuum-settings-overlay',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => {
    const el = document.createElement(
      'au-vacuum-settings-overlay',
    ) as AuVacuumSettingsOverlay;
    el.hass = demoHass;
    el.vacuumEntityId = 'vacuum.downstairs';
    el.title = 'Downstairs vacuum';
    queueMicrotask(() => el.open());
    return el;
  },
};

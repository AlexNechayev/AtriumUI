import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/vacuum-card/au-vacuum-card';
import { demoHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Vacuum Card',
  component: 'au-vacuum-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-vacuum-card',
      {
        type: 'custom:au-vacuum-card',
        entity: 'vacuum.downstairs',
        variant: 'home',
      },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-vacuum-card',
      { type: 'custom:au-vacuum-card', entity: 'vacuum.downstairs' },
      demoHass,
      { width: 320, height: 180 },
    ),
};

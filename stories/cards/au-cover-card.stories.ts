import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/cover-card/au-cover-card';
import { demoHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Cover Card',
  component: 'au-cover-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-cover-card',
      { type: 'custom:au-cover-card', entity: 'cover.blinds', variant: 'home' },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-cover-card',
      { type: 'custom:au-cover-card', entity: 'cover.blinds' },
      demoHass,
      { width: 320, height: 160 },
    ),
};

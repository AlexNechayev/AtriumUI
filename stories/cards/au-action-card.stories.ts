import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/action-card/au-action-card';
import { demoHass, makeEntity, makeHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Action Card',
  component: 'au-action-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-action-card',
      {
        type: 'custom:au-action-card',
        entity: 'light.kitchen',
        variant: 'home',
      },
      demoHass,
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-action-card',
      { type: 'custom:au-action-card', entity: 'light.kitchen' },
      demoHass,
      { width: 280, height: 96 },
    ),
};

export const Unavailable: Story = {
  render: () =>
    mountCardLayouts(
      'au-action-card',
      {
        type: 'custom:au-action-card',
        entity: 'light.unavailable',
        variant: 'home',
      },
      makeHass({
        'light.unavailable': makeEntity('light.unavailable', 'unavailable', {
          friendly_name: 'Unavailable',
        }),
      }),
    ),
};

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../fixtures/register-cards';
import { demoClassicConfig, demoHass, demoHomeConfig } from '../fixtures/hass';
import { mountCard } from '../fixtures/mount';

const meta = {
  title: 'Shell/Shell Grid',
  component: 'au-shell-grid',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCard('au-shell-grid', demoHomeConfig, demoHass, {
      width: '100%',
      height: '100vh',
    }),
};

export const Classic: Story = {
  render: () =>
    mountCard('au-shell-grid', demoClassicConfig, demoHass, {
      width: '100%',
      height: '100vh',
    }),
};

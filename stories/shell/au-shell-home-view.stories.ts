import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../fixtures/register-cards';
import '../../src/template/shell-grid/au-shell-home-view';
import { AuShellHomeView } from '../../src/template/shell-grid/au-shell-home-view';
import { demoHass, demoHomeConfig } from '../fixtures/hass';
import { frame } from '../fixtures/mount';

const meta = {
  title: 'Shell/Home View',
  component: 'au-shell-home-view',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => {
    const el = document.createElement('au-shell-home-view') as AuShellHomeView;
    el.config = demoHomeConfig;
    el.hass = demoHass;
    return frame(el, { width: '100%', height: '100vh' });
  },
};

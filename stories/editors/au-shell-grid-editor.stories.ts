import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/template/shell-grid/au-shell-grid-editor';
import { demoHass, demoHomeConfig } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Shell Grid',
  component: 'au-shell-grid-editor',
  render: () => mountEditor('au-shell-grid-editor', demoHomeConfig, demoHass),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/action-card/au-action-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Action Card',
  component: 'au-action-card-editor',
  render: () =>
    mountEditor(
      'au-action-card-editor',
      { type: 'custom:au-action-card', entity: 'light.kitchen' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/vacuum-card/au-vacuum-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Vacuum Card',
  component: 'au-vacuum-card-editor',
  render: () =>
    mountEditor(
      'au-vacuum-card-editor',
      { type: 'custom:au-vacuum-card', entity: 'vacuum.downstairs' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};

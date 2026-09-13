import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/climate-card/au-climate-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Climate Card',
  component: 'au-climate-card-editor',
  render: () =>
    mountEditor(
      'au-climate-card-editor',
      { type: 'custom:au-climate-card', entity: 'climate.living_room' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/fan-card/au-fan-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Fan Card',
  component: 'au-fan-card-editor',
  render: () =>
    mountEditor(
      'au-fan-card-editor',
      { type: 'custom:au-fan-card', entity: 'fan.bedroom' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};

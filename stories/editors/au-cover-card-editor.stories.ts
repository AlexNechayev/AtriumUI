import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/cover-card/au-cover-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Cover Card',
  component: 'au-cover-card-editor',
  render: () =>
    mountEditor(
      'au-cover-card-editor',
      { type: 'custom:au-cover-card', entity: 'cover.blinds' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/au-fan-speed-selector';
import { AuFanSpeedSelector } from '../../src/components/au-fan-speed-selector';
import { frame } from '../fixtures/mount';

function speed(layout: AuFanSpeedSelector['layout']): HTMLElement {
  const el = document.createElement('au-fan-speed-selector') as AuFanSpeedSelector;
  el.levels = [0, 25, 50, 75, 100];
  el.value = 50;
  el.variant = 'home';
  el.layout = layout;
  return frame(el, { width: 240, height: 80 });
}

const meta = {
  title: 'Primitives/Fan Speed Selector',
  component: 'au-fan-speed-selector',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Vertical: Story = { render: () => speed('vertical') };
export const Horizontal: Story = { render: () => speed('horizontal') };

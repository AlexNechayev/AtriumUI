import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/au-light-slider';
import { AuLightSlider } from '../../src/components/au-light-slider';
import { frame } from '../fixtures/mount';

function slider(variant: AuLightSlider['variant'], value: number): HTMLElement {
  const el = document.createElement('au-light-slider') as AuLightSlider;
  el.variant = variant;
  el.value = value;
  el.min = 0;
  el.max = 100;
  el.label = variant;
  return frame(el, { width: 280, height: 48 });
}

const meta = {
  title: 'Primitives/Light Slider',
  component: 'au-light-slider',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Plain: Story = { render: () => slider('plain', 40) };
export const ColorTemp: Story = { render: () => slider('color_temp', 55) };
export const Hue: Story = { render: () => slider('hue', 30) };

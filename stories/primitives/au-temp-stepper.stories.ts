import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/au-temp-stepper';
import { AuTempStepper } from '../../src/components/au-temp-stepper';
import { frame } from '../fixtures/mount';

function stepper(
  control: AuTempStepper['control'],
  variant: AuTempStepper['variant'],
): HTMLElement {
  const el = document.createElement('au-temp-stepper') as AuTempStepper;
  el.min = 16;
  el.max = 30;
  el.value = 22;
  el.unit = '°C';
  el.control = control;
  el.variant = variant;
  return frame(el, { width: 280, height: variant === 'home' ? 56 : 88 });
}

const meta = {
  title: 'Primitives/Temp Stepper',
  component: 'au-temp-stepper',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Slider: Story = { render: () => stepper('slider', 'default') };
export const Buttons: Story = { render: () => stepper('buttons', 'default') };
export const Home: Story = { render: () => stepper('slider', 'home') };

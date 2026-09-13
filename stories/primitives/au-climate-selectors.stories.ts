import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/au-climate-selectors';
import { AuClimateSelectors } from '../../src/components/au-climate-selectors';
import { frame } from '../fixtures/mount';

function selectors(variant: AuClimateSelectors['variant']): HTMLElement {
  const el = document.createElement('au-climate-selectors') as AuClimateSelectors;
  el.hvacModes = ['off', 'heat', 'cool', 'auto', 'fan_only'];
  el.hvacValue = 'cool';
  el.fanModes = ['auto', 'low', 'medium', 'high'];
  el.fanValue = 'auto';
  el.variant = variant;
  return frame(el, { width: 220, height: 80 });
}

const meta = {
  title: 'Primitives/Climate Selectors',
  component: 'au-climate-selectors',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => selectors('default') };
export const Home: Story = { render: () => selectors('home') };

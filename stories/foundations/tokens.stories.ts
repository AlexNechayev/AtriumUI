import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta = {
  title: 'Foundations/Tokens',
  render: () => html`
    <div
      style="display:grid;gap:12px;width:280px;font-family:var(--au-home-font,system-ui)"
    >
      <div
        style="padding:16px;border-radius:22px;background:var(--card-background-color);box-shadow:0 10px 28px rgba(0,0,0,.08)"
      >
        <div style="font-weight:650;color:var(--primary-text-color)">Home look</div>
        <div style="color:var(--secondary-text-color);font-size:.78rem">
          Accent + surfaces
        </div>
        <div
          style="margin-top:12px;height:32px;border-radius:999px;background:var(--accent-color,#0a84ff)"
        ></div>
      </div>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Canvas: Story = {};

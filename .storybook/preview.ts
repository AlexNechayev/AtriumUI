import type { Preview } from '@storybook/web-components-vite';
import { applyCanvasTheme, registerHaStubs } from '../stories/fixtures/ha-elements';

registerHaStubs();

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Home look canvas',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      applyCanvasTheme(theme);
      return story();
    },
  ],
  parameters: {
    layout: 'centered',
  },
};

export default preview;

import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    if (viteConfig.build) {
      delete viteConfig.build.lib;
      if (viteConfig.build.rollupOptions) {
        delete viteConfig.build.rollupOptions.output;
      }
    }
    return viteConfig;
  },
};

export default config;

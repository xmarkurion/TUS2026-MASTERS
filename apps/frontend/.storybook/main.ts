import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],

  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },

  addons: [getAbsolutePath("@storybook/addon-docs")],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  async viteFinal(config) {
    const stripStorybookSourcemapPlugin = {
      name: 'strip-storybook-sourcemap',
      enforce: 'post' as const,
      transform(code: string, id: string) {
        if (id.startsWith('/virtual:/@storybook')) {
          return code.replace(/\/\/# sourceMappingURL=.*$/gm, '').replace(/\/*# sourceMappingURL=.*\*\//gm, '');
        }
        return null;
      },
    };

    return {
      ...config,
      plugins: [...(config.plugins || []), stripStorybookSourcemapPlugin],
      build: {
        ...config.build,
        sourcemap: false,
      },
      esbuild: {
        ...config.esbuild,
        sourcemap: false,
      },
      optimizeDeps: {
        ...(config.optimizeDeps || {}),
        esbuildOptions: {
          ...((config.optimizeDeps && (config.optimizeDeps as any).esbuildOptions) || {}),
          sourcemap: false,
        },
      },
    } as typeof config;
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

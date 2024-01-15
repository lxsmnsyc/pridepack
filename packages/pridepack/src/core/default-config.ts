import type * as esbuild from 'esbuild';

interface PridepackPluginEnv {
  isDev: boolean;
  isESM: boolean;
  isCJS: boolean;
}

type PridepackLazyPlugin = (env: PridepackPluginEnv) => esbuild.Plugin[];

export interface PridepackConfig {
  entrypoints: Record<string, string>;
  tsconfig: string;
  target: string | string[];
  outputDir: string;
  startEntrypoint?: string;
  jsx?: esbuild.CommonOptions['jsx'];
  jsxFactory?: string;
  jsxFragment?: string;
  jsxImportSource?: string;
  plugins?: esbuild.Plugin[] | PridepackLazyPlugin;
}

const DEFAULT_CONFIG: PridepackConfig = {
  startEntrypoint: '.',
  entrypoints: {
    '.': 'src/index.ts',
  },
  target: 'es2018',
  tsconfig: 'tsconfig.json',
  outputDir: 'dist',
};

export default DEFAULT_CONFIG;

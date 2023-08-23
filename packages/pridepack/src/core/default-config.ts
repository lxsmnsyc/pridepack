import type { Plugin } from 'esbuild';

interface PridepackPluginEnv {
  isDev: boolean;
  isESM: boolean;
  isCJS: boolean;
}

type PridepackLazyPlugin = (env: PridepackPluginEnv) => Plugin[];

export interface PridepackConfig {
  entrypoints: Record<string, string>;
  tsconfig: string;
  target: string | string[];
  outputDir: string;
  startEntrypoint?: string;
  jsx?: 'transform' | 'preserve';
  jsxFactory?: string;
  jsxFragment?: string;
  plugins?: Plugin[] | PridepackLazyPlugin;
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

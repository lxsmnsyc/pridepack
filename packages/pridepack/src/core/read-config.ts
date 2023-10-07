import path from 'path';
import type { PridepackConfig } from './default-config';
import DEFAULT_CONFIG from './default-config';
import loadJS from './load-js';
import readPackage from './read-package';
import { readJson, isFile } from './fs-utils';

export const CONFIG_NAMES = [
  '.pridepackrc',
  '.pridepack.json',
  'pridepack.json',
  'pridepack.config.json',
  '.pridepack.config.json',
];

export const CONFIG_JS = [
  'pridepack.config.js',
  'pridepack.js',
  '.pridepack.config.js',
  '.pridepack.js',
];

let CONFIG: PridepackConfig;

export default async function readConfig(): Promise<PridepackConfig> {
  if (CONFIG) {
    return CONFIG;
  }
  const pkg = await readPackage();
  // Get working directory
  const cwd = process.cwd();

  for (let i = 0; i < CONFIG_NAMES.length; i += 1) {
    // Get config file path
    const filepath = path.resolve(path.join(cwd, CONFIG_NAMES[i]));

    // Check if config exists
    if (await isFile(filepath)) {
      // Read config
      const customConfig = await readJson<Partial<PridepackConfig>>(filepath);

      CONFIG = {
        ...customConfig,
        entrypoints: customConfig.entrypoints || DEFAULT_CONFIG.entrypoints,
        tsconfig: customConfig.tsconfig || DEFAULT_CONFIG.tsconfig,
        target: customConfig.target || DEFAULT_CONFIG.target,
        outputDir: customConfig.outputDir || DEFAULT_CONFIG.outputDir,
      };

      return CONFIG;
    }
  }

  for (let i = 0; i < CONFIG_JS.length; i += 1) {
    const filepath = path.resolve(path.join(cwd, CONFIG_JS[i]));

    if (await isFile(filepath)) {
      const customConfig: Partial<PridepackConfig> = await loadJS(pkg.type === 'module', filepath);

      CONFIG = {
        ...customConfig,
        entrypoints: customConfig.entrypoints || DEFAULT_CONFIG.entrypoints,
        tsconfig: customConfig.tsconfig || DEFAULT_CONFIG.tsconfig,
        target: customConfig.target || DEFAULT_CONFIG.target,
        outputDir: customConfig.outputDir || DEFAULT_CONFIG.outputDir,
      };

      return CONFIG;
    }
  }

  CONFIG = DEFAULT_CONFIG;

  // Return default config
  return CONFIG;
}

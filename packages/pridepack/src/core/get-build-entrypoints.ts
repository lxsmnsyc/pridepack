import path from 'node:path';
import type { PridepackConfig } from './default-config';
import {
  getCJSTargetDirectory,
  getESMTargetDirectory,
} from './resolve-entrypoint';

export default function getBuildEntrypoints(
  config: PridepackConfig,
  esm: boolean,
  dev: boolean,
): Record<string, string> {
  const cwd = process.cwd();
  const record: Record<string, string> = {};

  for (const key of Object.keys(config.entrypoints)) {
    const targetDir = esm
      ? getESMTargetDirectory(config, key, dev)
      : getCJSTargetDirectory(config, key, dev);
    const parsed = path.parse(path.resolve(path.join(cwd, targetDir)));
    const outfile = path.join(parsed.dir, parsed.name);

    record[outfile] = path.resolve(path.join(cwd, config.entrypoints[key]));
  }

  return record;
}

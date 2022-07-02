import path from 'path';
import { PridepackConfig } from './default-config';

export default function getTSEntrypoints(
  config: PridepackConfig,
): string[] {
  const cwd = process.cwd();
  const result = [];
  for (const value of Object.values(config.entrypoints)) {
    result.push(path.resolve(path.join(cwd, value)));
  }
  return result;
}

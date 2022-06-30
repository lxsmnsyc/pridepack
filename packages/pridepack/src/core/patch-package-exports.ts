import path from 'path';
import { PridepackConfig } from './default-config';
import { outputJson } from './fs-utils';
import getPackagePath from './get-package-path';
import readPackage from './read-package';
import {
  getCJSTargetDirectory,
  getESMTargetDirectory,
  getTypesTarget,
} from './resolve-entrypoint';
import toPosix from './to-posix';

interface BaseExportEntry {
  require: string;
  import: string;
}

interface ExportEntry extends BaseExportEntry {
  development: BaseExportEntry;
  types: string;
}

export default async function patchPackageExports(
  config: PridepackConfig,
  cwd = '.',
): Promise<void> {
  const packageInfo = await readPackage(cwd);
  const jsx = config.jsx === 'preserve' ? 'x' : '';
  const entries: Record<string, ExportEntry> = {};
  const targetTSPaths: Record<string, [string]> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleEntry of Object.keys(config.entrypoints)) {
    const tsPath = await getTypesTarget(config.entrypoints[moduleEntry]);
    const typesPath = `./${toPosix(tsPath)}.d.ts`;
    entries[moduleEntry] = {
      development: {
        require: `./${toPosix(getCJSTargetDirectory(moduleEntry, true))}${jsx}`,
        import: `./${toPosix(getESMTargetDirectory(moduleEntry, true))}${jsx}`,
      },
      require: `./${toPosix(getCJSTargetDirectory(moduleEntry, false))}${jsx}`,
      import: `./${toPosix(getESMTargetDirectory(moduleEntry, false))}${jsx}`,
      types: typesPath,
    };
    const targetPath = moduleEntry === '.' ? '*' : path.relative('.', moduleEntry);
    targetTSPaths[targetPath] = [typesPath];
  }

  await outputJson(
    getPackagePath(cwd),
    {
      ...packageInfo,
      exports: entries,
      typesVersions: {
        '*': targetTSPaths,
      },
    },
  );
}

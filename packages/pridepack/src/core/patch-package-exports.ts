import path from 'path';
import { PridepackConfig } from './default-config';
import { outputJson } from './fs-utils';
import getPackagePath from './get-package-path';
import readPackage from './read-package';
import { getCJSTargetDirectory, getESMTargetDirectory, getTypesTargetDirectory } from './resolve-entrypoint';

interface BaseExportEntry {
  require: string;
  import: string;
}

interface ExportEntry extends BaseExportEntry {
  development: BaseExportEntry;
  types: string;
}

function toPosix(filepath: string): string {
  return filepath.split(path.sep).join(path.posix.sep);
}

export default async function patchPackageExports(
  config: PridepackConfig,
  cwd = '.',
): Promise<void> {
  const packageInfo = await readPackage(cwd);
  const jsx = config.jsx === 'preserve' ? 'x' : '';
  const entries: Record<string, ExportEntry> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleEntry of Object.keys(config.entrypoints)) {
    entries[moduleEntry] = {
      development: {
        require: `./${toPosix(getCJSTargetDirectory(moduleEntry, true))}${jsx}`,
        import: `./${toPosix(getESMTargetDirectory(moduleEntry, true))}${jsx}`,
      },
      require: `./${toPosix(getCJSTargetDirectory(moduleEntry, false))}${jsx}`,
      import: `./${toPosix(getESMTargetDirectory(moduleEntry, false))}${jsx}`,
      types: `./${toPosix(getTypesTargetDirectory(moduleEntry))}.d.ts`,
    };
  }

  await outputJson(
    getPackagePath(cwd),
    { ...packageInfo, exports: entries },
  );
}

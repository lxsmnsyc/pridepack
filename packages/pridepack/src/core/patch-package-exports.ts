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
        require: `${getCJSTargetDirectory(moduleEntry, true)}${jsx}`,
        import: `${getESMTargetDirectory(moduleEntry, true)}${jsx}`,
      },
      require: `${getCJSTargetDirectory(moduleEntry, false)}${jsx}`,
      import: `${getESMTargetDirectory(moduleEntry, false)}${jsx}`,
      types: `${getTypesTargetDirectory(moduleEntry)}.ts`,
    };
  }

  await outputJson(
    getPackagePath(cwd),
    { ...packageInfo, exports: entries },
  );
}

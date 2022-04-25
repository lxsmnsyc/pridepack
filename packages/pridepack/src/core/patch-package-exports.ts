import fs from 'fs-extra';
import { PridepackConfig } from './default-config';
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

export default async function patchPackageExports(config: PridepackConfig, cwd = '.'): Promise<void> {
  const packageInfo = await readPackage(cwd);
  const entries: Record<string, ExportEntry> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleEntry of Object.keys(config.entrypoints)) {
    entries[moduleEntry] = {
      development: {
        require: getCJSTargetDirectory(moduleEntry, true),
        import: getESMTargetDirectory(moduleEntry, true),
      },
      require: getCJSTargetDirectory(moduleEntry, false),
      import: getESMTargetDirectory(moduleEntry, false),
      types: getTypesTargetDirectory(moduleEntry),
    };
  }

  await fs.outputJson(getPackagePath(cwd), { ...packageInfo, exports: entries }, {
    spaces: 2,
  });
}

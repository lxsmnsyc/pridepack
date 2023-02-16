import { spinner } from '@clack/prompts';
import generateTSDiagnostics from './generate-ts-diagnostics';
import readConfig from '../core/read-config';
import watchCompileTypes from '../core/watch-compile-types';
import runBuild from './run-build';

export default async function runWatchCommand(
  onRebuild?: () => void,
): Promise<void> {
  const config = await readConfig();

  const esmDev = runBuild(config, true, true, true);
  const esmProd = runBuild(config, true, false, true);
  const cjsDev = runBuild(config, true, true, false);
  const cjsProd = runBuild(config, true, false, false);

  const rebuilding = spinner();

  async function rebuild() {
    rebuilding.start('Rebuilding...');
    await esmDev.start();
    await esmProd.start();
    await cjsDev.start();
    await cjsProd.start();
    rebuilding.stop('Rebuild completed.');
  }

  watchCompileTypes(
    (diagnostic) => {
      generateTSDiagnostics([diagnostic]);
    },
    () => {
      rebuild().then(() => {
        onRebuild?.();
      }).catch((err) => {
        rebuilding.stop('Rebuild failed.');
        console.error(err);
        process.exit(1);
      });
    },
    false,
  );
}

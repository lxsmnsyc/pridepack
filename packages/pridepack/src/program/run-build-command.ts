import patchPackageExports from '../core/patch-package-exports';
import readConfig from '../core/read-config';
import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import runCompile from './run-compile';

export default async function runBuildCommand(): Promise<void> {
  const config = await readConfig();
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleEntry of Object.keys(config.entrypoints)) {
    const entrypoint = config.entrypoints[moduleEntry];
    const cjs = await runBuildCJS(config, moduleEntry, entrypoint, false);
    const esm = await runBuildESM(config, moduleEntry, entrypoint, false);
    await cjs.dev.start();
    await cjs.prod.start();
    await esm.dev.start();
    await esm.prod.start();
    await runCompile(moduleEntry, entrypoint, false);
  }
  await patchPackageExports(config);
}

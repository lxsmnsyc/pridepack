import patchPackageExports from '../core/patch-package-exports';
import readConfig from '../core/read-config';
import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import runCompile from './run-compile';

export default async function runBuildCommand(): Promise<void> {
  const config = await readConfig();
  const cjs = await runBuildCJS(config, false);
  const esm = await runBuildESM(config, false);
  await cjs.dev.start();
  await cjs.prod.start();
  await esm.dev.start();
  await esm.prod.start();
  await patchPackageExports(config);
  await runCompile(config, false);
}

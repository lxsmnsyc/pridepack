import patchPackageExports from '../core/patch-package-exports';
import readConfig from '../core/read-config';
import runBuild from './run-build';
import runCompile from './run-compile';

export default async function runBuildCommand(): Promise<void> {
  const config = await readConfig();
  await (await runBuild(config, false, true, true)).start();
  await (await runBuild(config, false, false, true)).start();
  await (await runBuild(config, false, true, false)).start();
  await (await runBuild(config, false, false, false)).start();
  await patchPackageExports(config);
  await runCompile(config, false);
}

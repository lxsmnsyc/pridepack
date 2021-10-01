import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import runCompile from './run-compile';

export default async function runBuildCommand(): Promise<void> {
  const cjs = await runBuildCJS(false);
  const esm = await runBuildESM(false);
  await cjs.dev.start();
  await cjs.prod.start();
  await esm.dev.start();
  await esm.prod.start();
  await runCompile(false);
}

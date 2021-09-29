import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import runCompile from './run-compile';

export default async function runBuildCommand(): Promise<void> {
  await runBuildCJS(false);
  await runBuildESM(false);
  await runCompile(false);
}

import { BuildIncremental, BuildResult } from 'esbuild';
import generateESBuildDiagnostics from './generate-esbuild-diagnostics';
import runTask, { Task, TaskStatus } from './run-task';

export default async function runESBuild(
  buildCall: (incremental: boolean) => Promise<BuildResult | BuildIncremental>,
  incremental: boolean,
  status: TaskStatus,
): Promise<Task<void>> {
  let current: BuildIncremental | undefined;
  async function getResult(): Promise<BuildResult> {
    if (incremental) {
      if (current) {
        return current.rebuild();
      }
      const result = await buildCall(true);
      if (result.rebuild) {
        current = result as BuildIncremental;
      }
      return result;
    }
    return buildCall(false);
  }
  return runTask(
    async (runSuccess) => {
      const result = await getResult();
      runSuccess();
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
    },
    status,
    {
      silent: incremental,
    },
  );
}

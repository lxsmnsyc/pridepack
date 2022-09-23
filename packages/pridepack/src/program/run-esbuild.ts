import { BuildFailure, BuildIncremental, BuildResult } from 'esbuild';
import generateESBuildDiagnostics from './generate-esbuild-diagnostics';
import processMetafile from './process-metafile';
import runTask, { Task, TaskStatus } from './run-task';

function isBuildFailure(error: unknown): error is BuildFailure {
  return !!((error as BuildFailure).errors && (error as BuildFailure).warnings);
}

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
      try {
        const result = await getResult();
        runSuccess();
        generateESBuildDiagnostics(false, result.errors);
        generateESBuildDiagnostics(true, result.warnings);

        if (result.metafile && !incremental) {
          await processMetafile(result.metafile);
        }
      } catch (err) {
        if (isBuildFailure(err)) {
          generateESBuildDiagnostics(false, err.errors);
          generateESBuildDiagnostics(true, err.warnings);
        }
        throw err;
      }
    },
    status,
    {
      silent: incremental,
    },
  );
}

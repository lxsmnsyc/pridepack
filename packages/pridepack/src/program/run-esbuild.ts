import type { BuildContext, BuildFailure, BuildResult } from 'esbuild';
import generateESBuildDiagnostics from './generate-esbuild-diagnostics';
import processMetafile from './process-metafile';
import type { Task, TaskStatus } from './run-task';
import runTask from './run-task';

function isBuildFailure(error: unknown): error is BuildFailure {
  return !!((error as BuildFailure).errors && (error as BuildFailure).warnings);
}

interface BuildCall {
  (incremental: false): Promise<BuildResult>;
  (incremental: true): Promise<BuildContext>;
}

export default async function runESBuild(
  buildCall: BuildCall,
  incremental: boolean,
  status: TaskStatus,
): Promise<Task<void>> {
  let current: BuildContext | undefined;
  async function getResult(): Promise<BuildResult> {
    if (incremental) {
      if (!current) {
        current = await buildCall(true);
      }
      return current.rebuild();
    }
    return buildCall(false);
  }
  return await runTask(
    async runSuccess => {
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

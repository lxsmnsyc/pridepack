import { BuildResult } from "esbuild";
import generateESBuildDiagnostics from "./generate-esbuild-diagnostics";
import runTask, { TaskStatus } from "./run-task";

export default async function runESBuild(
  buildCall: () => Promise<BuildResult>,
  status: TaskStatus,
): Promise<BuildResult> {
  return runTask(
    async (runSuccess) => {
      const result = await buildCall();
      runSuccess();
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      return result;
    },
    status,
  );
}
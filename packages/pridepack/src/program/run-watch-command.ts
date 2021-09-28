import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import generateTSDiagnostics from './generate-ts-diagnostics';
import generateESBuildDiagnostics from './generate-esbuild-diagnostics';
import watchCompileTypes from '../core/watch-compile-types';

export default async function runWatchCommand(): Promise<() => void> {
  const cjs = await runBuildCJS(true);
  const esm = await runBuildESM(true);

  const stopTS = watchCompileTypes(
    (diagnostic) => {
      generateTSDiagnostics([diagnostic]);
    },
    () => {
      Promise.all([
        cjs.dev.rebuild(),
        cjs.prod.rebuild(),
        esm.dev.rebuild(),
        esm.prod.rebuild(),
      ]).then(([cjsDev, cjsProd, esmDev, esmProd]) => {
        generateESBuildDiagnostics(false, cjsDev.warnings);
        generateESBuildDiagnostics(true, cjsDev.warnings);
        generateESBuildDiagnostics(false, cjsProd.warnings);
        generateESBuildDiagnostics(true, cjsProd.warnings);
        generateESBuildDiagnostics(false, esmDev.warnings);
        generateESBuildDiagnostics(true, esmDev.warnings);
        generateESBuildDiagnostics(false, esmProd.warnings);
        generateESBuildDiagnostics(true, esmProd.warnings);
      }, console.error);
    },
    false,
  );

  return () => {
    stopTS();
    cjs.dev.stop();
    cjs.prod.stop();
    esm.dev.stop();
    esm.prod.stop();
  };
}

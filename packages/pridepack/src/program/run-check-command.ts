import task from 'tasuku';
import generateTSDiagnostics from './generate-ts-diagnostics';
import compileTypes from '../core/compile-types';

export default async function runCheckCommand(): Promise<void> {
  await task('Compiling types...', async (ctx) => {
    const result = await compileTypes(true);
    generateTSDiagnostics(result);
    ctx.setTitle('Compiled types!');
  });
}

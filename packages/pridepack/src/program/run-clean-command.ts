import task from 'tasuku';
import clean from '../core/clean';

export default async function runCleanCommand(): Promise<void> {
  await task('Cleaning build directory...', async (ctx) => {
    await clean();
    ctx.setTitle('Cleaned!');
  });
}

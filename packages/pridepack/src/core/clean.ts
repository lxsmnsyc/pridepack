import path from 'path';
import { removeFile } from './fs-utils';
import readConfig from './read-config';

export default async function clean(): Promise<void> {
  const config = await readConfig();
  const cwd = process.cwd();
  // Remove CJS directory
  await removeFile(
    path.resolve(
      path.join(
        cwd,
        config.outputDir,
      ),
    ),
  );
}

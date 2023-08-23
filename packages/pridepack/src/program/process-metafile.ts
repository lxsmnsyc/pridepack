import type { Metafile } from 'esbuild';
import { blue, green } from '../core/colors';

export default async function processMetafile(metafile: Metafile): Promise<void> {
  const prettyBytes = (await import('pretty-bytes')).default;

  for (const [path, meta] of Object.entries(metafile.outputs)) {
    console.log(`- "${blue(path)}": ${green(prettyBytes(meta.bytes))}`);
  }
}

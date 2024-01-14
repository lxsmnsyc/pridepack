import path from 'node:path';

export default function toPosix(filepath: string): string {
  return filepath.split(path.sep).join(path.posix.sep);
}

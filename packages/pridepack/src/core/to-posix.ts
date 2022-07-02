import path from 'path';

export default function toPosix(filepath: string): string {
  return filepath.split(path.sep).join(path.posix.sep);
}

import path from 'node:path';

export default function getPackagePath(cwd = '.'): string {
  return path.resolve(path.join(process.cwd(), cwd, 'package.json'));
}

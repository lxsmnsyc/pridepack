import path from 'path';

export default function getPackagePath(): string {
  return path.resolve(path.join(process.cwd(), 'package.json'));
}

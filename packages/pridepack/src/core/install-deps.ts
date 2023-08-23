import path from 'path';
import execa from 'execa';

export type CMD = 'yarn' | 'npm' | 'pnpm';

function getCommand(cmd: CMD): string[] {
  switch (cmd) {
    case 'npm':
      return ['install'];
    case 'yarn':
      return [];
    case 'pnpm':
      return ['install'];
    default:
      return [];
  }
}

export default async function installPackage(command: CMD, cwd = '.'): Promise<void> {
  await execa(command, getCommand(command), {
    cwd: path.resolve(path.join(process.cwd(), cwd)),
  });
}

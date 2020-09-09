import execa from 'execa';

export type CMD = 'yarn' | 'npm';

let cmd: CMD;

export default async function getCMD(): Promise<CMD> {
  if (cmd) {
    return cmd;
  }
  try {
    await execa('yarnpkg', ['--version']);
    cmd = 'yarn';
  } catch (err) {
    cmd = 'npm';
  }

  return cmd;
}

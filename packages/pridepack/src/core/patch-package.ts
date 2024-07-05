import { getLicense } from 'license';
import path from 'node:path';
import type { IPackageJson } from 'package-json-type';
import { outputFile, outputJson } from './fs-utils';
import getPackagePath from './get-package-path';
import readPackage from './read-package';

const SCRIPTS = {
  prepublishOnly: 'pridepack clean && pridepack build',
  build: 'pridepack build',
  'type-check': 'pridepack check',
  clean: 'pridepack clean',
  watch: 'pridepack watch',
  start: 'pridepack start',
  dev: 'pridepack dev',
};

interface Patch {
  name: string;
  license?: string;
  author: string;
  description: string;
  repository: string;
  homepage: string;
  issues: string;
  isPrivate: boolean;
}

export default async function patchPackage(
  patch: Patch,
  cwd = '.',
): Promise<void> {
  const packageInfo = await readPackage(cwd);

  if (patch.license) {
    await outputFile(
      path.join(cwd, 'LICENSE'),
      getLicense(patch.license, {
        author: patch.author,
        year: new Date().getFullYear().toString(),
      }),
      {
        encoding: 'utf-8',
      },
    );
  }

  const newInfo: IPackageJson = {
    ...packageInfo,
    name: patch.name ?? packageInfo.name,
    version: '0.0.0',
    description: patch.description,
    repository: {
      url: patch.repository,
      type: 'git',
    },
    homepage: patch.homepage,
    bugs: {
      url: patch.issues,
    },
    author: patch.author,
    license: patch.license as any,
    private: patch.isPrivate,
    publishConfig: {
      access: patch.isPrivate ? 'restricted' : 'public',
    },
    scripts: {
      ...SCRIPTS,
      ...packageInfo.scripts,
    },
  };

  await outputJson(getPackagePath(cwd), newInfo);
}

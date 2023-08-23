import type { IPackageJson } from 'package-json-type';
import { readJson } from './fs-utils';
import getPackagePath from './get-package-path';

export default async function readPackage(cwd = '.'): Promise<IPackageJson> {
  return readJson<IPackageJson>(getPackagePath(cwd));
}

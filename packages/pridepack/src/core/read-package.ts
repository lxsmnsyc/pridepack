import { IPackageJson } from 'package-json-type';
import { readJson } from './fs-utils';
import getPackagePath from './get-package-path';

export default function readPackage(cwd = '.'): Promise<IPackageJson> {
  return readJson<IPackageJson>(getPackagePath(cwd));
}

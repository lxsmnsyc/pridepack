import fs from 'fs-extra';
import { IDependencyMap } from 'package-json-type';
import readPackage from '../utils/read-package';
import getPackagePath from '../utils/get-package-path';
import TEMPLATES from './templates';

export default async function addPeers(template: string): Promise<void> {
  const packageInfo = readPackage();
  const peerDependencies: IDependencyMap = {};

  if (packageInfo.devDependencies) {
    const peers = TEMPLATES[template].peerDependencies;
    Object.entries(packageInfo.devDependencies).forEach(([key, value]) => {
      if (peers.includes(key)) {
        peerDependencies[key] = value;
      }
    });
  }

  const newInfo = {
    ...packageInfo,
    peerDependencies,
  };

  await fs.outputFile(getPackagePath(), JSON.stringify(newInfo, null, 2));
}

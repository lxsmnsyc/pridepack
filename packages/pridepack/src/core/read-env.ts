import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isFile } from './fs-utils';

const ENV = '.env';
const ENV_PRODUCTION = '.env.production';
const ENV_DEVELOPMENT = '.env.development';

export default async function readEnv(
  isDev: boolean,
): Promise<Partial<Record<string, string>>> {
  const cwd = process.cwd();

  const record = {};

  if (isDev) {
    const developmentPath = path.resolve(path.join(cwd, ENV_DEVELOPMENT));
    if (await isFile(developmentPath)) {
      Object.assign(
        record,
        dotenv.parse(await readFile(developmentPath, 'utf-8')),
      );
    }
  } else {
    const productionPath = path.resolve(path.join(cwd, ENV_PRODUCTION));
    if (await isFile(productionPath)) {
      Object.assign(
        record,
        dotenv.parse(await readFile(productionPath, 'utf-8')),
      );
    }
  }

  const defaultPath = path.resolve(path.join(cwd, ENV));

  if (await isFile(defaultPath)) {
    Object.assign(record, dotenv.parse(await readFile(defaultPath, 'utf-8')));
  }
  return record;
}

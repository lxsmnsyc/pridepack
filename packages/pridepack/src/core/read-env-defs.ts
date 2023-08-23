import readEnv from './read-env';

const CJS_ENV = 'process.env';
const ESM_ENV = 'import.meta.env';

export default async function readEnvDefinitions(
  isDev: boolean,
): Promise<Record<string, string>> {
  const env = await readEnv(isDev);
  const container: Record<string, string> = {};

  for (const key of Object.keys(env)) {
    const value = JSON.stringify(env[key]);
    container[`${CJS_ENV}.${key}`] = value;
    container[`${ESM_ENV}.${key}`] = value;
  }

  container[`${CJS_ENV}.NODE_ENV`] = isDev ? '"development"' : '"production"';
  container[`${ESM_ENV}.MODE`] = isDev ? '"development"' : '"production"';
  container[`${ESM_ENV}.DEV`] = isDev ? 'true' : 'false';
  container[`${ESM_ENV}.PROD`] = isDev ? 'false' : 'true';

  return container;
}

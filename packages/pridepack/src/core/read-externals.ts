import { builtinModules } from 'module';
import readPackage from './read-package';

let EXTERNALS: string[];

function pushExternal(
  set: Set<string>,
  record?: Record<string, string>,
): void {
  if (record) {
    for (const key of Object.keys(record)) {
      set.add(key);
    }
  }
}

export default async function readExternals(): Promise<string[]> {
  if (EXTERNALS) {
    return EXTERNALS;
  }

  const pkg = await readPackage();

  const external = new Set<string>([pkg.name ?? '']);

  pushExternal(external, pkg.dependencies);
  pushExternal(external, pkg.devDependencies);
  pushExternal(external, pkg.peerDependencies);
  pushExternal(external, pkg.optionalDependencies);

  EXTERNALS = [
    ...builtinModules,
    ...Array.from(external),
  ];

  return EXTERNALS;
}

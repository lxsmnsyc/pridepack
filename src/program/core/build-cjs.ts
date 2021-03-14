import path from 'path';
import { legacy, resolve } from 'resolve.exports';
import readPackage from './read-package';

export const DEFAULT_OUTPUT = 'dist/cjs';
export const DEFAULT_CJS_ENTRY_FILE = 'index.js';
export const DEFAULT_CJS_ENTRY = `${DEFAULT_OUTPUT}/${DEFAULT_CJS_ENTRY_FILE}`;
export const DEFAULT_CJS_PRODUCTION_ENTRY = 'production/index.js';
export const DEFAULT_CJS_DEVELOPMENT_ENTRY = 'development/index.js';

export function resolveEntry() {
  const pkg = readPackage();

  // Resolve through Export map
  let result: string | void;
  try {
    result = resolve(pkg, '.', {
      require: true,
    }) ?? undefined;
  } catch (err) {
    result = undefined;
  }

  // If there is a definition, return it.
  if (result) {
    return result;
  }

  // Otherwise, fallback to legacy.
  const legacyResult = legacy(pkg, {
    browser: false,
    fields: ['main'],
  });

  if (legacyResult) {
    return legacyResult;
  }

  return DEFAULT_CJS_ENTRY;
}

export function getCJSTargetDirectory() {
  const targetPath = resolveEntry();

  return path.dirname(targetPath);
}
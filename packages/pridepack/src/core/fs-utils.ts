import type { Abortable } from 'node:events';
import type { Mode, ObjectEncodingOptions, OpenMode } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Stream } from 'node:stream';

export async function removeFile(filePath: string): Promise<void> {
  await fs.rm(filePath, { recursive: true, force: true });
}

export async function isFile(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

export async function isDirectory(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export function checkPath(filePath: string): void {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(
      filePath.replace(path.parse(filePath).root, ''),
    );

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${filePath}`);
      error.code = 'EINVAL';
      throw error;
    }
  }
}

export async function makeDir(
  dir: string,
  mode = 0o777,
): Promise<string | undefined> {
  checkPath(dir);
  return await fs.mkdir(dir, {
    mode,
    recursive: true,
  });
}

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function outputFile(
  file: string,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  encoding?:
    | (ObjectEncodingOptions & {
        mode?: Mode | undefined;
        flag?: OpenMode | undefined;
      } & Abortable)
    | BufferEncoding
    | null,
): Promise<void> {
  const dir = path.dirname(file);
  if (!(await pathExists(dir))) {
    await makeDir(dir);
  }
  await fs.writeFile(file, data, encoding);
}

function stringify(obj: unknown): string {
  const str = JSON.stringify(obj, undefined, 2);

  return `${str.replace(/\n/g, '\n')}\n`;
}

export async function outputJson(file: string, data: unknown): Promise<void> {
  await outputFile(file, stringify(data));
}

export async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, 'utf-8')) as T;
}

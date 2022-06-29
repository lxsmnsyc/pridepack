import { Abortable } from 'events';
import { Mode, ObjectEncodingOptions, OpenMode } from 'fs';
import { Stream } from 'stream';
import path from 'path';
import fs from 'fs/promises';

export async function removeFile(filePath: string): Promise<void> {
  return fs.rm(filePath, { recursive: true, force: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

export function checkPath(filePath: string): void {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(filePath.replace(path.parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${filePath}`);
      error.code = 'EINVAL';
      throw error;
    }
  }
}

export async function makeDir(dir: string, mode = 0o777) {
  checkPath(dir);
  return fs.mkdir(dir, {
    mode,
    recursive: true,
  });
}

export async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function outputFile(
  file: string,
  data: string
    | NodeJS.ArrayBufferView
    | Iterable<string
    | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  encoding?:
      | (ObjectEncodingOptions & {
            mode?: Mode | undefined;
            flag?: OpenMode | undefined;
        } & Abortable)
      | BufferEncoding
      | null,
) {
  const dir = path.dirname(file);
  if (!await pathExists(dir)) {
    await makeDir(dir);
  }
  return fs.writeFile(file, data, encoding);
}

function stringify(
  obj: any,
) {
  const str = JSON.stringify(obj, undefined, 2);

  return `${str.replace(/\n/g, '\n')}\n`;
}

export async function outputJson(
  file: string,
  data: any,
) {
  return outputFile(file, stringify(data));
}

export async function readJson<T>(
  file: string,
): Promise<T> {
  return JSON.parse(
    await fs.readFile(file, 'utf-8'),
  ) as T;
}

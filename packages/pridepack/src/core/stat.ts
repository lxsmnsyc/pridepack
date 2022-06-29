import fs from 'fs/promises';

export async function isFile(path: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path);

    return stat.isFile();
  } catch (err) {
    return false;
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path);

    return stat.isDirectory();
  } catch (err) {
    return false;
  }
}

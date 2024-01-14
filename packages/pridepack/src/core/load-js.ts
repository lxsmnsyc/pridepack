export default async function loadJS<T>(
  isESM: boolean,
  targetPath: string,
): Promise<T> {
  if (isESM) {
    return await import(targetPath);
  }
  delete require.cache[targetPath];
  return require(targetPath);
}

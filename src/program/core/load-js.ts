export function loadJS<T>(targetPath: string): T {
  delete require.cache[targetPath];
  return require(targetPath);
}


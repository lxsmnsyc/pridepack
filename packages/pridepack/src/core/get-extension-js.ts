export default function getExtensionJS(
  isModule: boolean,
  isPreservedJSX: boolean,
  isESM: boolean,
): string {
  if (isPreservedJSX) {
    return '.jsx';
  }
  if (isModule) {
    if (isESM) {
      return '.mjs';
    }
    return '.cjs';
  }
  return '.js';
}

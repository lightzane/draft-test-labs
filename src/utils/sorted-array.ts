/**
 * Sort array of objects
 * @param arr The array of objects to be sorted
 * @param key The base of sort, usually a timestamp that contains numbers
 * @returns sorted array of objects
 */
export const sortedArray = <T>(arr: T[], key: keyof T) => {
  return [...arr].sort((a, b) => +b[key] - +a[key]);
  // why this syntax? Get "sonarlint" extension in vscode and try to use common syntax to sort
};

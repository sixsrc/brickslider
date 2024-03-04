export function isValidSelector(string: string): boolean {
  const regex = /^[.#].*/;
  return regex.test(string);
}

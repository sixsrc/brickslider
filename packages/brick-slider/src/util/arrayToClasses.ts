// eslint-disable-next-line
export function arrayToClasses<T extends { new (...args: any[]): any }>(
  classes: T[],
  $root: string,
  options?: any
): InstanceType<T>[] {
  return classes.map(Class => new Class($root, options))
}

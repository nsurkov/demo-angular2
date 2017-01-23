export const noop = () => {};
export const identity = <T>(_: T):T => _;
export function parseNumber(s: string | number): number {
  if (s === undefined || s === '') {
    return undefined;
  }
  return +s;
}

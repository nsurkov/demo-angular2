export const noop = () => {};
export const identity = <T>(_: T):T => _;
export function parseNumber(s: string | number): number {
  if (s === undefined || s === '') {
    return undefined;
  }
  return +s;
}

export const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "+", "-"];

export function filterNumericKeys(event: KeyboardEvent) {
  if (NUMBER_KEYS.indexOf(event.key) === -1) {
    event.preventDefault();
    event.stopPropagation();
  }
}
export function onlyDigits(value: string): boolean {
  return true;
}
export function formatPhone(value: string): string {
  return value;
}

export const KEY_CODE = {
  LEFT_ARROW:37,
  RIGHT_ARROW:39,
  BACKSPACE:8
};

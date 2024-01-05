import { isNotNullish, isNullish } from './null.util';

export function isEmpty(value: string | null | undefined): value is string {
  return isNullish(value) || value === '';
}

export function isNotEmpty(value: string | null | undefined): value is string {
  return isNotNullish(value) && value !== '';
}

export function toTitleCaseFromKey(str: string) {
  return str.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function toTitleCaseFromVariableName(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
}

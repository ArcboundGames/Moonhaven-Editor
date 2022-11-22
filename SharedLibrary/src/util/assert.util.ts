import { isNullish } from './null.util';

export type Assert = (condition: boolean, errorMessage: string) => boolean;

export type AssertNotNullish = <T>(input: T | undefined | null, errorMessage: string) => input is T;

export function createAssert() {
  const errors: string[] = [];

  const assert = (condition: boolean, errorMessage: string) => {
    if (!condition) {
      errors.push(errorMessage);
      return false;
    }

    return true;
  };

  const assertNotNullish = <T>(input: T | undefined | null, errorMessage: string): input is T => {
    if (isNullish(input)) {
      errors.push(errorMessage);
      return false;
    }

    return true;
  };

  return { errors, assert, assertNotNullish };
}

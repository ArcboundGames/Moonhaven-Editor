export type Assert = (condition: boolean, errorMessage: string) => void;

export function createAssert() {
  const errors: string[] = [];

  const assert = (condition: boolean, errorMessage: string) => {
    if (!condition) {
      errors.push(errorMessage);
    }
  };

  return { errors, assert };
}

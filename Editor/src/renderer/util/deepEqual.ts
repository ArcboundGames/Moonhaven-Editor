// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function deepEqual(a: any, b: any) {
  if (a === undefined && b === undefined) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  return JSON.stringify(a) === JSON.stringify(b);
}

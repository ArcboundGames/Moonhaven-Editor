/* eslint-disable import/prefer-default-export */
export function getNumberFromInput(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): number {
  const { target } = event;
  if (target.value === '-') {
    target.value = '-1';
    target.setSelectionRange(1, 2);

    return -1;
  }

  return Number(event.target.value);
}

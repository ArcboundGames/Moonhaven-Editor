import { getNumberFromInput } from '../numberInput.util';

type MockInputChangeEvent = React.ChangeEvent<HTMLInputElement> & {
  target: HTMLInputElement & {
    setSelectionRange: jest.Mock;
  };
};

function createInputEvent(value: string): MockInputChangeEvent {
  const target = {
    value,
    setSelectionRange: jest.fn()
  } as unknown as HTMLInputElement & { setSelectionRange: jest.Mock };

  return { target } as MockInputChangeEvent;
}

describe('getNumberFromInput', () => {
  it('returns the numeric value from the input', () => {
    expect(getNumberFromInput(createInputEvent('42'))).toBe(42);
  });

  it('returns 0 for empty string', () => {
    expect(getNumberFromInput(createInputEvent(''))).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(getNumberFromInput(createInputEvent('-5'))).toBe(-5);
  });

  it('handles decimal numbers', () => {
    expect(getNumberFromInput(createInputEvent('3.14'))).toBe(3.14);
  });

  it('returns NaN for non-numeric string', () => {
    expect(getNumberFromInput(createInputEvent('abc'))).toBeNaN();
  });

  describe('when value is "-"', () => {
    it('returns -1', () => {
      const event = createInputEvent('-');
      expect(getNumberFromInput(event)).toBe(-1);
    });

    it('sets target value to "-1"', () => {
      const event = createInputEvent('-');
      getNumberFromInput(event);
      expect(event.target.value).toBe('-1');
    });

    it('calls setSelectionRange(1, 2)', () => {
      const event = createInputEvent('-');
      getNumberFromInput(event);
      expect(event.target.setSelectionRange).toHaveBeenCalledWith(1, 2);
    });
  });
});

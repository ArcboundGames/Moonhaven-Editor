import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import NumberTextField from '../widgets/form/NumberTextField';

describe('NumberTextField', () => {
  it('renders the label', () => {
    render(<NumberTextField label="Amount" value={10} />);
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('displays the current numeric value', () => {
    render(<NumberTextField label="Amount" value={42} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(42);
  });

  it('displays empty string when value is undefined', () => {
    render(<NumberTextField label="Amount" value={undefined} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(null);
  });

  it('calls onChange with the parsed number', () => {
    const onChange = jest.fn();
    render(<NumberTextField label="Amount" value={0} onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '7' } });
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('calls onChange with undefined for empty string', () => {
    const onChange = jest.fn();
    render(<NumberTextField label="Amount" value={5} onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('shows error when required and value is undefined', () => {
    render(<NumberTextField label="Amount" value={undefined} required />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error when value exceeds max', () => {
    render(<NumberTextField label="Amount" value={200} max={100} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error when value is below min', () => {
    render(<NumberTextField label="Amount" value={-5} min={0} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error when wholeNumber is true and value is fractional', () => {
    render(<NumberTextField label="Amount" value={3.5} wholeNumber />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not show error for a valid whole number', () => {
    render(<NumberTextField label="Amount" value={10} wholeNumber min={0} max={100} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'false');
  });

  it('is disabled when disabled prop is true', () => {
    render(<NumberTextField label="Amount" value={5} disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('renders start adornment', () => {
    render(<NumberTextField label="Price" value={5} startAdornment="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders end adornment', () => {
    render(<NumberTextField label="Weight" value={5} endAdornment="kg" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('normalizes display value on blur', () => {
    render(<NumberTextField label="Amount" value={5} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '005' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(5);
  });
});

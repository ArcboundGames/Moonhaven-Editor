import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TextField from '../widgets/form/TextField';

describe('TextField', () => {
  it('renders the label', () => {
    render(<TextField label="Name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<TextField label="Name" value="Alice" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Alice');
  });

  it('defaults value to empty string when undefined', () => {
    render(<TextField label="Name" value={undefined} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('calls onChange with the new string value', () => {
    const onChange = jest.fn();
    render(<TextField label="Name" value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bob' } });
    expect(onChange).toHaveBeenCalledWith('Bob');
  });

  it('shows error state when required and empty', () => {
    render(<TextField label="Name" value="" required />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error state when error prop is true', () => {
    render(<TextField label="Name" value="valid" error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

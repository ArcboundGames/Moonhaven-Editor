import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Checkbox from '../widgets/form/Checkbox';

describe('Checkbox', () => {
  it('renders the label', () => {
    render(<Checkbox label="Enable feature" checked={false} />);
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  it('renders checked state', () => {
    render(<Checkbox label="Toggle" checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('renders unchecked state', () => {
    render(<Checkbox label="Toggle" checked={false} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange with the new checked value on click', () => {
    const onChange = jest.fn();
    render(<Checkbox label="Toggle" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox label="Toggle" checked={false} disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('treats undefined checked as false', () => {
    render(<Checkbox label="Toggle" checked={undefined} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders helper text when provided', () => {
    render(<Checkbox label="Toggle" checked={false} helperText="Some help" />);
    expect(screen.getByText('Some help')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import Select from '../widgets/form/Select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
];

describe('Select', () => {
  it('renders the label', () => {
    render(<Select label="Fruit" value={undefined} options={options} />);
    expect(screen.getByLabelText('Fruit')).toBeInTheDocument();
  });

  it('displays the selected value', () => {
    render(<Select label="Fruit" value="banana" options={options} />);
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('shows "None" option when not required', () => {
    render(<Select label="Fruit" value={undefined} options={options} />);
    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.getByText('None')).toBeInTheDocument();
  });

  it('does not show "None" option when required', () => {
    render(<Select label="Fruit" value="apple" options={options} required onChange={jest.fn()} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.queryByText('None')).not.toBeInTheDocument();
  });

  it('calls onChange with the selected value', () => {
    const onChange = jest.fn();
    render(<Select label="Fruit" value="apple" options={options} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('Cherry'));
    expect(onChange).toHaveBeenCalledWith('cherry');
  });

  it('calls onChange with undefined when "None" is selected on non-required', () => {
    const onChange = jest.fn();
    render(<Select label="Fruit" value="apple" options={options} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('None'));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select label="Fruit" value="apple" options={options} disabled />);
    // MUI Select renders a div with role combobox — check aria-disabled
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('is disabled when options array is empty', () => {
    render(<Select label="Fruit" value={undefined} options={[]} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows error when required and value is empty', () => {
    const { container } = render(<Select label="Fruit" value={undefined} options={options} required onChange={jest.fn()} />);
    // MUI FormControl adds Mui-error as part of its class list
    const formControl = container.querySelector('[class*="Mui-error"]');
    expect(formControl).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<Select label="Fruit" value="apple" options={options} helperText="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });
});

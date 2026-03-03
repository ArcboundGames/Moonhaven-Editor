import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Autocomplete from '../widgets/form/Autocomplete';

const options = [
  { label: 'Red', id: 'red' },
  { label: 'Green', id: 'green' },
  { label: 'Blue', id: 'blue' }
];

describe('Autocomplete', () => {
  it('renders the label', () => {
    render(<Autocomplete label="Color" value={undefined} options={options} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Color')).toBeInTheDocument();
  });

  it('displays the selected option label', () => {
    render(<Autocomplete label="Color" value="green" options={options} onChange={jest.fn()} />);
    const input = screen.getByRole('combobox');
    expect(input.value).toBe('Green');
  });

  it('shows options when focused and typed', () => {
    render(<Autocomplete label="Color" value={undefined} options={options} onChange={jest.fn()} />);
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('calls onChange with the selected option id', () => {
    const onChange = jest.fn();
    render(<Autocomplete label="Color" value={undefined} options={options} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);
    fireEvent.click(screen.getByText('Blue'));
    expect(onChange).toHaveBeenCalledWith('blue');
  });

  it('shows empty input when value does not match any option', () => {
    render(<Autocomplete label="Color" value="purple" options={options} onChange={jest.fn()} />);
    const input = screen.getByRole('combobox');
    expect(input.value).toBe('');
  });
});

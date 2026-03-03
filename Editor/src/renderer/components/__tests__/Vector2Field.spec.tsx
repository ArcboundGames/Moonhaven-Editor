import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Vector2Field from '../widgets/form/Vector2Field';

describe('Vector2Field', () => {
  it('renders X and Y labels', () => {
    render(<Vector2Field value={{ x: 1, y: 2 }} />);
    expect(screen.getByLabelText('X')).toBeInTheDocument();
    expect(screen.getByLabelText('Y')).toBeInTheDocument();
  });

  it('displays x and y values', () => {
    render(<Vector2Field value={{ x: 10, y: 20 }} />);
    expect(screen.getByLabelText('X')).toHaveValue(10);
    expect(screen.getByLabelText('Y')).toHaveValue(20);
  });

  it('calls onChange with updated x when X field changes', () => {
    const onChange = jest.fn();
    render(<Vector2Field value={{ x: 0, y: 5 }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('X'), { target: { value: '3' } });
    expect(onChange).toHaveBeenCalledWith({ x: 3, y: 5 });
  });

  it('calls onChange with updated y when Y field changes', () => {
    const onChange = jest.fn();
    render(<Vector2Field value={{ x: 5, y: 0 }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Y'), { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith({ x: 5, y: 8 });
  });

  it('handles undefined value gracefully', () => {
    render(<Vector2Field value={undefined} />);
    expect(screen.getByLabelText('X')).toHaveValue(null);
    expect(screen.getByLabelText('Y')).toHaveValue(null);
  });

  it('defaults to 0 for missing coordinates on change', () => {
    const onChange = jest.fn();
    render(<Vector2Field value={undefined} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('X'), { target: { value: '7' } });
    expect(onChange).toHaveBeenCalledWith({ x: 7, y: 0 });
  });

  it('disables both fields when disabled', () => {
    render(<Vector2Field value={{ x: 1, y: 2 }} disabled />);
    expect(screen.getByLabelText('X')).toBeDisabled();
    expect(screen.getByLabelText('Y')).toBeDisabled();
  });
});

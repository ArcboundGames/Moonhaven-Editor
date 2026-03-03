import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import DayBox from '../widgets/DayBox';

describe('DayBox', () => {
  it('renders the abbreviation for a valid day', () => {
    render(<DayBox day={0} active={false} />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('renders Monday abbreviation', () => {
    render(<DayBox day={1} active />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('sets the title to the full day name', () => {
    render(<DayBox day={2} active={false} />);
    expect(screen.getByTitle('Tuesday')).toBeInTheDocument();
  });

  it('returns null for an invalid day index', () => {
    const { container } = render(<DayBox day={99} active={false} />);
    expect(container.firstElementChild).toBeNull();
  });
});

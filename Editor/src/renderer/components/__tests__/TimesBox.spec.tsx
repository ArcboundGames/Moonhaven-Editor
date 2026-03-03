import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  TIME_COMPARATOR_AFTER,
  TIME_COMPARATOR_BEFORE,
  TIME_COMPARATOR_BETWEEN,
  LENGTH_OF_HOUR
} from '../../../../../SharedLibrary/src/constants';
import TimesBox from '../widgets/TimesBox';

// LENGTH_OF_HOUR = 45, so 9 * 45 = 405 → 09:00 am
const NINE_AM = LENGTH_OF_HOUR * 9;
// 17 * 45 = 765 → 05:00 pm
const FIVE_PM = LENGTH_OF_HOUR * 17;

describe('TimesBox', () => {
  it('returns null when times is undefined', () => {
    const { container } = render(<TimesBox timesComparator={TIME_COMPARATOR_BEFORE} />);
    expect(container.firstElementChild).toBeNull();
  });

  it('returns null when timesComparator is undefined', () => {
    const { container } = render(<TimesBox times={[NINE_AM]} />);
    expect(container.firstElementChild).toBeNull();
  });

  it('renders "Before" text for BEFORE comparator with one time', () => {
    render(<TimesBox times={[NINE_AM]} timesComparator={TIME_COMPARATOR_BEFORE} />);
    expect(screen.getByText(/Before 09:00 am/)).toBeInTheDocument();
  });

  it('renders "After" text for AFTER comparator with one time', () => {
    render(<TimesBox times={[FIVE_PM]} timesComparator={TIME_COMPARATOR_AFTER} />);
    expect(screen.getByText(/After 05:00 pm/)).toBeInTheDocument();
  });

  it('renders "Between" text for BETWEEN comparator with two times', () => {
    render(<TimesBox times={[NINE_AM, FIVE_PM]} timesComparator={TIME_COMPARATOR_BETWEEN} />);
    expect(screen.getByText(/Between 09:00 am and 05:00 pm/)).toBeInTheDocument();
  });

  it('returns null for BEFORE comparator with wrong number of times', () => {
    const { container } = render(<TimesBox times={[NINE_AM, FIVE_PM]} timesComparator={TIME_COMPARATOR_BEFORE} />);
    expect(container.firstElementChild).toBeNull();
  });

  it('returns null for BETWEEN comparator with only one time', () => {
    const { container } = render(<TimesBox times={[NINE_AM]} timesComparator={TIME_COMPARATOR_BETWEEN} />);
    expect(container.firstElementChild).toBeNull();
  });
});

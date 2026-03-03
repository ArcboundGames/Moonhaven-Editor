import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import FormBox from '../widgets/layout/FormBox';

describe('FormBox', () => {
  it('renders children', () => {
    render(
      <FormBox>
        <span>form content</span>
      </FormBox>
    );
    expect(screen.getByText('form content')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<FormBox />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

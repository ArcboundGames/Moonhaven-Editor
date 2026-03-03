import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Card from '../widgets/layout/Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <span>card body</span>
      </Card>
    );
    expect(screen.getByText('card body')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(<Card header="My Title">body</Card>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('does not render a heading element when header is omitted', () => {
    render(<Card>body only</Card>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button type="button">Save</button>}>body</Card>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<Card />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

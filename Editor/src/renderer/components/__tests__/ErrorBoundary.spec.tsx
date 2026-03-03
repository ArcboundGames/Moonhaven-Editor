import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ErrorBoundary from '../ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

const GoodChild = () => <div>All is well</div>;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('All is well')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('logs the error via console.error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalled();
  });
});

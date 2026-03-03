import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabPanel, { a11yProps } from '../widgets/TabPanel';

describe('a11yProps', () => {
  it('returns correct id and aria-controls for a given index', () => {
    expect(a11yProps(0)).toEqual({
      id: 'object-type-view-tab-0',
      'aria-controls': 'object-type-view-tabpanel-0'
    });
  });

  it('works with arbitrary index values', () => {
    expect(a11yProps(5)).toEqual({
      id: 'object-type-view-tab-5',
      'aria-controls': 'object-type-view-tabpanel-5'
    });
  });
});

describe('TabPanel', () => {
  it('renders children when value equals index', () => {
    render(
      <TabPanel value={0} index={0}>
        <span>Tab content</span>
      </TabPanel>
    );
    expect(screen.getByText('Tab content')).toBeInTheDocument();
  });

  it('does not render children when value differs from index', () => {
    render(
      <TabPanel value={1} index={0}>
        <span>Tab content</span>
      </TabPanel>
    );
    expect(screen.queryByText('Tab content')).not.toBeInTheDocument();
  });

  it('sets role=tabpanel on the container', () => {
    render(
      <TabPanel value={0} index={0}>
        content
      </TabPanel>
    );
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('sets hidden attribute when value differs from index', () => {
    const { container } = render(
      <TabPanel value={1} index={0}>
        content
      </TabPanel>
    );
    const panel = container.firstElementChild as HTMLElement;
    expect(panel).toHaveAttribute('hidden');
  });

  it('sets correct id and aria-labelledby', () => {
    const { container } = render(
      <TabPanel value={2} index={2}>
        content
      </TabPanel>
    );
    const panel = container.firstElementChild as HTMLElement;
    expect(panel).toHaveAttribute('id', 'object-type-view-tabpanel-2');
    expect(panel).toHaveAttribute('aria-labelledby', 'object-type-view-tab-2');
  });
});

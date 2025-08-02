import React from 'react';
import { render, screen } from '@testing-library/react';
import CircularPieChart from '@/components/charts/CircularPieChart';
import '@testing-library/jest-dom';

describe('CircularPieChart', () => {
  it('renders without crashing', () => {
    render(<CircularPieChart />);
    const label = screen.getByText('92%');
    expect(label).toBeInTheDocument();
  });

  it('renders 2 pie slices', () => {
    const { container } = render(<CircularPieChart />);
    
    // Pie slices are rendered as <path> elements inside <svg>
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(2);
  });

  it('center label has correct styles', () => {
    render(<CircularPieChart />);
    const label = screen.getByText('92%');

    // Use `style` to verify inline CSS (if styled-components adds it inline)
    expect(label).toHaveStyle({
      textAnchor: 'middle',
      dominantBaseline: 'central',
    });
  });
});

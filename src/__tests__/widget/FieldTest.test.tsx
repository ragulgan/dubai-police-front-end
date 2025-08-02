import React from 'react';
import { render, screen } from '@testing-library/react';
import FieldTest from '@/components/widgets/FieldTest';

// Mock the SVG import
jest.mock('../../../public/RoutineSVG.svg', () => () => <svg data-testid="routine-svg" />);

describe('FieldTest', () => {
  const mockFieldData = [
    {
      id: 1,
      testName: 'Speed Test',
      testResult: '12.5',
      unitOfMeasurement: 'sec',
    },
    {
      id: 2,
      testName: 'Agility Test',
      testResult: '',
      unitOfMeasurement: 'custom',
      customUnitOfMeasurement: 'points',
    },
    {
      id: 3,
      testName: 'Stamina Test',
      testResult: null,
      unitOfMeasurement: '',
    },
  ];

  it('renders the Field Test title and SVG icon', () => {
    render(<FieldTest fieldData={mockFieldData} />);
    expect(screen.getByText('Field Test')).toBeInTheDocument();
    expect(screen.getByTestId('routine-svg')).toBeInTheDocument();
  });

  it('renders all test names and results correctly', () => {
    render(<FieldTest fieldData={mockFieldData} />);
    expect(screen.getByText('Speed Test')).toBeInTheDocument();
    expect(screen.getByText('12.5')).toBeInTheDocument();
    expect(screen.getByText('(sec)')).toBeInTheDocument();

    expect(screen.getByText('Agility Test')).toBeInTheDocument();
    // Should show -- for empty result
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
    // Should show custom unit
    expect(screen.getByText('(points)')).toBeInTheDocument();

    expect(screen.getByText('Stamina Test')).toBeInTheDocument();
    // Should show -- for null result
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
  });

  it('renders nothing for empty or invalid fieldData', () => {
    const { container } = render(<FieldTest fieldData={[]} />);
    // Only the title and SVG should be present
    expect(screen.getByText('Field Test')).toBeInTheDocument();
    expect(container.querySelectorAll('.dubai-med').length).toBe(0);

    // Test with undefined
    const { container: container2 } = render(<FieldTest fieldData={undefined} />);
    expect(container2.querySelectorAll('.dubai-med').length).toBe(0);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<FieldTest fieldData={mockFieldData} />);
    expect(asFragment()).toMatchSnapshot();
  });
}); 
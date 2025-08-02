import React from 'react';
import { render, screen } from '@testing-library/react';
import FitnessTest from '@/components/widgets/FitnessTest';

// Mock the SVG import
jest.mock('../../../public/ReportCardSVG.svg', () => () => <svg data-testid="report-card-svg" />);

describe('FitnessTest', () => {
  const mockFitnessData = [
    {
      id: 1,
      testName: 'Push-ups',
      testResult: '25',
      unitOfMeasurement: 'reps',
    },
    {
      id: 2,
      testName: 'Pull-ups',
      testResult: '',
      unitOfMeasurement: 'custom',
      customUnitOfMeasurement: 'count',
    },
    {
      id: 3,
      testName: 'Sit-ups',
      testResult: null,
      unitOfMeasurement: '',
    },
    {
      id: 4,
      testName: 'Running',
      testResult: '15:30',
      unitOfMeasurement: 'min:sec',
    },
  ];

  it('renders the Military Readiness Test title and SVG icon', () => {
    render(<FitnessTest fitnessData={mockFitnessData} />);
    expect(screen.getByText('Military Readiness Test')).toBeInTheDocument();
    expect(screen.getByTestId('report-card-svg')).toBeInTheDocument();
  });

  it('renders all test names and results correctly', () => {
    render(<FitnessTest fitnessData={mockFitnessData} />);
    
    // Test 1: Push-ups
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('(reps)')).toBeInTheDocument();

    // Test 2: Pull-ups
    expect(screen.getByText('Pull-ups')).toBeInTheDocument();
    // Should show -- for empty result
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
    // Should show custom unit
    expect(screen.getByText('(count)')).toBeInTheDocument();

    // Test 3: Sit-ups
    expect(screen.getByText('Sit-ups')).toBeInTheDocument();
    // Should show -- for null result
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);

    // Test 4: Running
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('15:30')).toBeInTheDocument();
    expect(screen.getByText('(min:sec)')).toBeInTheDocument();
  });

  it('renders nothing for empty or invalid fitnessData', () => {
    const { container } = render(<FitnessTest fitnessData={[]} />);
    // Only the title and SVG should be present
    expect(screen.getByText('Military Readiness Test')).toBeInTheDocument();
    expect(container.querySelectorAll('.dubai-med').length).toBe(0);

    // Test with undefined
    const { container: container2 } = render(<FitnessTest fitnessData={undefined} />);
    expect(container2.querySelectorAll('.dubai-med').length).toBe(0);
  });

  it('handles single fitness test result', () => {
    const singleTestData = [
      {
        id: 1,
        testName: 'Bench Press',
        testResult: '100',
        unitOfMeasurement: 'kg',
      },
    ];

    render(<FitnessTest fitnessData={singleTestData} />);
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('(kg)')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<FitnessTest fitnessData={mockFitnessData} />);
    expect(asFragment()).toMatchSnapshot();
  });
}); 
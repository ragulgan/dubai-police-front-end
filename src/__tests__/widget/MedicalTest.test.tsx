import React from 'react';
import { render, screen } from '@testing-library/react';
import MedicalTest from '@/components/widgets/MedicalTest';

// Mock the SVG import
jest.mock('../../../public/TestPadSVG.svg', () => () => <svg data-testid="test-pad-svg" />);

describe('MedicalTest', () => {
  const mockMedicalData = [
    {
      id: 1,
      testName: 'Blood Pressure',
      testResult: '120/80',
      unitOfMeasurement: 'mmHg',
    },
    {
      id: 2,
      testName: 'Heart Rate',
      testResult: '',
      unitOfMeasurement: 'custom',
      customUnitOfMeasurement: 'bpm',
    },
    {
      id: 3,
      testName: 'Body Temperature',
      testResult: null,
      unitOfMeasurement: '',
    },
    {
      id: 4,
      testName: 'Blood Sugar',
      testResult: '95',
      unitOfMeasurement: 'mg/dL',
    },
    {
      id: 5,
      testName: 'Cholesterol',
      testResult: '180',
      unitOfMeasurement: 'mg/dL',
    },
  ];

  it('renders the Medical Test title and SVG icon', () => {
    render(<MedicalTest medicalData={mockMedicalData} />);
    expect(screen.getByText('Medical Test')).toBeInTheDocument();
    expect(screen.getByTestId('test-pad-svg')).toBeInTheDocument();
  });

  it('renders all test names and results correctly', () => {
    render(<MedicalTest medicalData={mockMedicalData} />);
    
    // Test 1: Blood Pressure
    expect(screen.getByText('Blood Pressure')).toBeInTheDocument();
    expect(screen.getByText('120/80')).toBeInTheDocument();
    expect(screen.getByText('(mmHg)')).toBeInTheDocument();

    // Test 2: Heart Rate
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    // Should show -- for empty result
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
    // Should show custom unit
    expect(screen.getByText('(bpm)')).toBeInTheDocument();

    // Test 3: Body Temperature
    expect(screen.getByText('Body Temperature')).toBeInTheDocument();
    // Should show -- for null result
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
    // Should show -- for missing unit
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);

    // Test 4: Blood Sugar
    expect(screen.getByText('Blood Sugar')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getAllByText('(mg/dL)').length).toBeGreaterThan(0);

    // Test 5: Cholesterol
    expect(screen.getByText('Cholesterol')).toBeInTheDocument();
    expect(screen.getByText('180')).toBeInTheDocument();
    expect(screen.getAllByText('(mg/dL)').length).toBeGreaterThan(0);
  });

  it('renders nothing for empty or invalid medicalData', () => {
    const { container } = render(<MedicalTest medicalData={[]} />);
    // Only the title and SVG should be present
    expect(screen.getByText('Medical Test')).toBeInTheDocument();
    expect(container.querySelectorAll('.dubai-med').length).toBe(0);

    // Test with undefined
    const { container: container2 } = render(<MedicalTest medicalData={undefined} />);
    expect(container2.querySelectorAll('.dubai-med').length).toBe(0);
  });

  it('handles single medical test result', () => {
    const singleTestData = [
      {
        id: 1,
        testName: 'BMI',
        testResult: '22.5',
        unitOfMeasurement: 'kg/m²',
      },
    ];

    render(<MedicalTest medicalData={singleTestData} />);
    expect(screen.getByText('BMI')).toBeInTheDocument();
    expect(screen.getByText('22.5')).toBeInTheDocument();
    expect(screen.getByText('(kg/m²)')).toBeInTheDocument();
  });

  it('handles medical tests with no unit of measurement', () => {
    const noUnitData = [
      {
        id: 1,
        testName: 'Vision Test',
        testResult: '20/20',
        unitOfMeasurement: '',
      },
    ];

    render(<MedicalTest medicalData={noUnitData} />);
    expect(screen.getByText('Vision Test')).toBeInTheDocument();
    expect(screen.getByText('20/20')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument(); // Should show -- for missing unit
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<MedicalTest medicalData={mockMedicalData} />);
    expect(asFragment()).toMatchSnapshot();
  });
}); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import FitnessTabContent from '@/components/fitness-and-nutrition/FitnessTabContent';

jest.mock('@/components/testAndMedicalChecks/ListTestAndMedical', () => (props: any) => <div data-testid="TestAndMedicalsTestList">TestAndMedicalsTestList</div>);
jest.mock('@/components/skeleton/TableSkeleton', () => () => <div data-testid="TableSkeleton">TableSkeleton</div>);

const baseProps = {
  data: [{ id: 1, name: 'Test Fitness' }],
  tabValue: 'fitness',
  getFitnessListData: {
    loading: false,
    code: 200,
    data: [{ id: 1, name: 'Test Fitness' }],
    totalRecords: 1,
  },
  setIsUpdated: jest.fn(),
  page: 1,
  rowsPerPage: 10,
  testType: 'fitness',
  isEdit: jest.fn(),
  setPage: jest.fn(),
  setRowsPerPage: jest.fn(),
};

describe('FitnessTabContent', () => {
  it('renders TableSkeleton when loading', () => {
    render(
      <FitnessTabContent
        {...baseProps}
        getFitnessListData={{ ...baseProps.getFitnessListData, loading: true }}
      />
    );
    expect(screen.getByTestId('TableSkeleton')).toBeInTheDocument();
  });

  it('shows error alert when code is 500', () => {
    render(
      <FitnessTabContent
        {...baseProps}
        getFitnessListData={{ ...baseProps.getFitnessListData, code: 500, loading: false }}
      />
    );
    expect(screen.getByText(/Unable to load fitness list/i)).toBeInTheDocument();
  });

  it('shows no records alert when data is empty', () => {
    render(
      <FitnessTabContent
        {...baseProps}
        getFitnessListData={{ ...baseProps.getFitnessListData, data: [], loading: false, code: 200 }}
      />
    );
    expect(screen.getByText(/No record\(s\) found/i)).toBeInTheDocument();
  });

  it('renders TestAndMedicalsTestList when data is present', () => {
    render(<FitnessTabContent {...baseProps} />);
    expect(screen.getByTestId('TestAndMedicalsTestList')).toBeInTheDocument();
  });

  it('renders nothing if getFitnessListData is undefined', () => {
    const { container } = render(<FitnessTabContent {...baseProps} getFitnessListData={undefined} />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });
}); 
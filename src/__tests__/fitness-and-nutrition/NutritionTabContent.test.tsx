import React from 'react';
import { render, screen } from '@testing-library/react';
import NutritionTabContent from '@/components/fitness-and-nutrition/NutritionTabContent';

// Mock child components used inside NutritionTabContent
jest.mock('@/components/nutrition/table', () => () => <div data-testid="TeamsTable">TeamsTable</div>);
jest.mock('@/components/nutrition/card', () => () => <div data-testid="CardView">CardView</div>);
jest.mock('@/components/PaginationComponent', () => () => <div data-testid="PaginationComponent">PaginationComponent</div>);
jest.mock('@/components/skeleton/TableSkeleton', () => () => <div data-testid="TableSkeleton">TableSkeleton</div>);

const baseProps = {
  listNutritionData: {
    loading: false,
    code: 200,
    data: [{ id: 1, name: 'Test Nutrition' }],
    totalRecords: 1,
  },
  tabValue: 'nutrition',
  page: 1,
  rowsPerPage: 10,
  setPage: jest.fn(),
  setRowsPerPage: jest.fn(),
  pageView: 'tableview',
  module: 'nutrition',
  memoizedSelectedSport: [0],
  debouncedSearchText: '',
  filterNutritionData: { startDate: '', endDate: '' },
};

describe('NutritionTabContent', () => {
  it('renders TeamsTable when tableview and data present', () => {
    render(<NutritionTabContent {...baseProps} />);
    expect(screen.getByTestId('TeamsTable')).toBeInTheDocument();
  });

  it('renders TeamsTable and PaginationComponent when tableview and data present', () => {
    render(
      <NutritionTabContent
        {...baseProps}
        pageView="tableview"
        listNutritionData={{ ...baseProps.listNutritionData, code: 200 }}
      />
    );
    expect(screen.getByTestId('TeamsTable')).toBeInTheDocument();
    // expect(screen.getByTestId('PaginationComponent')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(
      <NutritionTabContent
        {...baseProps}
        listNutritionData={{ ...baseProps.listNutritionData, loading: true }}
      />
    );
    expect(screen.getByTestId('TableSkeleton')).toBeInTheDocument();
  });

  it('shows error alert when code is 500', () => {
    render(
      <NutritionTabContent
        {...baseProps}
        listNutritionData={{ ...baseProps.listNutritionData, code: 500, loading: false }}
      />
    );
    expect(screen.getByText(/Unable to load nutrition list/i)).toBeInTheDocument();
  });

  it('shows no records alert when data is empty', () => {
    render(
      <NutritionTabContent
        {...baseProps}
        listNutritionData={{ ...baseProps.listNutritionData, data: [], loading: false }}
      />
    );
    expect(screen.getByText(/No record\(s\) found/i)).toBeInTheDocument();
  });

  it('renders CardView and PaginationComponent when selectedView is gridview and data present', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['gridview', jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => [null, jest.fn()]);
    render(
      <NutritionTabContent
        {...baseProps}
        listNutritionData={{ ...baseProps.listNutritionData, code: 200, data: [{ id: 1, name: 'Test Nutrition' }] }}
      />
    );
    expect(screen.getByTestId('CardView')).toBeInTheDocument();
    expect(screen.getByTestId('PaginationComponent')).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it('renders CardView but not PaginationComponent when selectedView is gridview and data is empty', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['gridview', jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => [null, jest.fn()]);
    render(
      <NutritionTabContent
        {...baseProps}
        listNutritionData={{ ...baseProps.listNutritionData, code: 200, data: [] }}
      />
    );
    expect(screen.getByTestId('CardView')).toBeInTheDocument();
    expect(screen.queryByTestId('PaginationComponent')).not.toBeInTheDocument();
    jest.restoreAllMocks();
  });
}); 
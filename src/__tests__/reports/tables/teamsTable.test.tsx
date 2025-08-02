import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TeamsTable from "@/components/reports/tables/teamsTable";
import "@testing-library/jest-dom";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock SVG imports
jest.mock('../../../../public/speedometer.svg', () => () => <svg data-testid="speedometer" />);

// Mock child components
jest.mock('@/components/PaginationComponent', () => (props: any) => (
  <div data-testid="pagination-component" />
));

jest.mock('@/components/dialogs/DeleteDialog', () => (props: any) => (
  <div data-testid="delete-dialog" />
));

jest.mock('@/components/staff/StaffRoleChip', () => (props: any) => (
  <div data-testid="staff-role-chip">{props.roleValue}</div>
));

jest.mock('@/components/athlete/AthletePerformaceLevelChip', () => (props: any) => (
  <div data-testid="athlete-performance-chip">{props.performanceLevel}</div>
));

jest.mock('@/components/skeleton/TableSkeleton', () => () => (
  <div data-testid="table-skeleton" />
));

// Mock Redux slices
jest.mock('@/redux/slices/staff/staffDeleteSlice', () => ({
  deleteCustomerById: jest.fn(),
  clearDeleteState: jest.fn(),
}));

jest.mock('@/redux/slices/staff/staffListSlice', () => ({
  viewStaff: jest.fn(),
}));

jest.mock('@/redux/slices/athlete/athleteDeleteSlice', () => ({
  deleteAthleteById: jest.fn(),
}));

jest.mock('@/redux/slices/athlete/getAthleteListSlice', () => ({
  getAthleteListAPI: jest.fn(),
}));

// Mock utility functions
jest.mock('@/utils/helper', () => ({
  getLocalStorage: jest.fn(() => 'football'),
}));

jest.mock('@/utils/constants', () => ({
  getPerformanceLevel: jest.fn(),
}));

// Redux store setup
const rootReducer = combineReducers({
  deleteStaff: (state = {}) => state,
  deleteAthlete: (state = {}) => state,
  rolesList: (state = { data: [] }) => state,
});

const store = configureStore({ reducer: rootReducer });

describe("TeamsTable", () => {
  const mockAthleteData = [
    {
      name: "John Doe",
      role: "Forward",
      staffID: "staff1",
      profileImage: "",
      firstName: "John",
      middleName: "",
      surname: "Doe",
      currentJobPosition: "Athlete",
      personalEmail: "john.doe@example.com",
      performanceLevel: "High",
      athleteID: "ath1",
      dob: "1995-01-01",
    },
  ];

  const mockStaffData = [
    {
      name: "Jane Smith",
      role: "1", // roleID
      staffID: "staff2",
      profileImage: "",
      firstName: "Jane",
      middleName: "",
      surname: "Smith",
      currentJobPosition: "Coach",
      personalEmail: "jane.smith@example.com",
      staffId: "staff2",
      contractStartDate: "2023-01-01",
      contractEndDate: "2024-01-01",
      otherStaff: "Assistant Coach",
    },
  ];

  const defaultAthleteProps = {
    data: mockAthleteData,
    isEdit: jest.fn(),
    setPage: jest.fn(),
    page: 1,
    setRowsPerPage: jest.fn(),
    rowsPerPage: 10,
    dataList: { totalRecords: 1 },
    isLoading: false,
    isDisable: false,
    module: "athlete",
    headers: ["Name", "Role", "Email", "Performance Level", "Actions"],
    isHide: false,
  };

  const defaultStaffProps = {
    data: mockStaffData,
    isEdit: jest.fn(),
    setPage: jest.fn(),
    page: 1,
    setRowsPerPage: jest.fn(),
    rowsPerPage: 10,
    dataList: { totalRecords: 1 },
    isLoading: false,
    isDisable: false,
    module: "staff",
    headers: ["Name", "Role", "Email", "Contract Start Date", "Contract End Date", "Actions"],
    isHide: false,
  };

  function renderWithProvider(ui: React.ReactNode) {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders athlete table correctly", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByTestId("athlete-performance-chip")).toBeInTheDocument();
  });

  it("renders staff table correctly", () => {
    renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} isLoading={true} />);
    expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
  });

  it("calls isEdit when edit button is clicked (athlete)", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    const editButton = screen.getAllByLabelText("edit")[0];
    fireEvent.click(editButton);
    expect(defaultAthleteProps.isEdit).toHaveBeenCalledWith("ath1");
  });

  it("calls isEdit when edit button is clicked (staff)", () => {
    renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    const editButton = screen.getAllByLabelText("edit")[0];
    fireEvent.click(editButton);
    expect(defaultStaffProps.isEdit).toHaveBeenCalledWith("staff2");
  });

  it("renders delete dialog for each row", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    const deleteDialogs = screen.getAllByTestId("delete-dialog");
    expect(deleteDialogs).toHaveLength(mockAthleteData.length);
  });

  it("renders pagination component", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    expect(screen.getByTestId("pagination-component")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    const emptyProps = {
      ...defaultAthleteProps,
      data: [],
      dataList: { totalRecords: 0 },
    };
    renderWithProvider(<TeamsTable {...emptyProps} />);
    expect(screen.getByTestId("pagination-component")).toBeInTheDocument();
  });

  it("hides edit and delete buttons when isHide is true", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} isHide={true} />);
    const editButtons = screen.queryAllByLabelText("edit");
    const deleteDialogs = screen.queryAllByTestId("delete-dialog");
    expect(editButtons).toHaveLength(0);
    expect(deleteDialogs).toHaveLength(0);
  });

  it("displays correct table headers", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    defaultAthleteProps.headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("handles missing data fields gracefully", () => {
    const incompleteData = [
      {
        name: "Incomplete User",
        role: "Player",
        staffID: "staff3",
        profileImage: "",
        firstName: "Incomplete",
        middleName: "",
        surname: "User",
        currentJobPosition: "",
        personalEmail: "",
        performanceLevel: "",
        athleteID: "ath3",
        dob: "",
      },
    ];

    const incompleteProps = {
      ...defaultAthleteProps,
      data: incompleteData,
    };

    renderWithProvider(<TeamsTable {...incompleteProps} />);
    expect(screen.getAllByText("--").length).toBeGreaterThan(0);
  });

  it("matches snapshot for athlete table", () => {
    const { asFragment } = renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for staff table", () => {
    const { asFragment } = renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for loading state", () => {
    const { asFragment } = renderWithProvider(<TeamsTable {...defaultAthleteProps} isLoading={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for empty data", () => {
    const emptyProps = {
      ...defaultAthleteProps,
      data: [],
      dataList: { totalRecords: 0 },
    };
    const { asFragment } = renderWithProvider(<TeamsTable {...emptyProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
}); 
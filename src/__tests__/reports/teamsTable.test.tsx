
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TeamsTable from "@/components/reports/teamsTable";
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const mockAthleteData = [
  {
    name: "John Doe",
    role: "Runner",
    staffID: "staff123",
    profileImage: "",
    firstName: "John",
    athlete_name: "John Doe",
    athlete_department: "Running",
    individualResult: "5.8",
    injuryStatus: false,
    athleteID: "ath123",
  },
];

const mockStaffData = [
  {
    name: "Jane Smith",
    role: "Coach",
    staffID: "staff456",
    profileImage: "",
    firstName: "Jane",
    athlete_name: "Jane Smith",
    athlete_department: "Coaching",
    individualResult: "",
    injuryStatus: true,
    athleteID: "ath456",
    otherStaff: "Assistant Coach",
  },
];

// Minimal reducers for the required slices
const rootReducer = combineReducers({
  deleteStaff: (state = {}) => state,
  deleteAthlete: (state = {}) => state,
});
const store = configureStore({ reducer: rootReducer });

describe("TeamsTable", () => {
  const defaultAthleteProps = {
    headers: [
      "No",
      "Name",
      "Department",
      "Indv. Result in numbers",
      "Injury Status",
      "Actions",
    ],
    module: "athlete",
    data: mockAthleteData,
    setEdit: jest.fn(),
    RenderForm: <div>Mock Form</div>,
    currentIndex: -1,
    isSetOpen: jest.fn(),
    isLoading: false,
    setDeleteIndex: jest.fn(),
    before: "before",
  };

  const defaultStaffProps = {
    headers: [
      "No",
      "Name",
      "Role",
      "Department",
      "Actions",
    ],
    module: "staff",
    data: mockStaffData,
    setEdit: jest.fn(),
    RenderForm: <div>Mock Form</div>,
    currentIndex: -1,
    isSetOpen: jest.fn(),
    isLoading: false,
    setDeleteIndex: jest.fn(),
    before: "before",
  };

  function renderWithProvider(ui: React.ReactNode) {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("renders table rows with athlete data", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("5.8")).toBeInTheDocument();
    expect(screen.getAllByText("No").length).toBeGreaterThan(0);
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("renders table rows with staff data", () => {
    renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Coaching")).toBeInTheDocument();
    expect(screen.getAllByText(/Coach|Other Staff|Assistant Coach/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("No").length).toBeGreaterThan(0);
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("calls setEdit when Edit icon is clicked (athlete)", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    const editButton = screen.getAllByLabelText("edit")[0];
    fireEvent.click(editButton);
    expect(defaultAthleteProps.setEdit).toHaveBeenCalled();
  });

  it("calls setEdit when Edit icon is clicked (staff)", () => {
    renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    const editButton = screen.getAllByLabelText("edit")[0];
    fireEvent.click(editButton);
    expect(defaultStaffProps.setEdit).toHaveBeenCalled();
  });

  it("calls isSetOpen and setDeleteIndex when Delete icon is clicked (athlete)", () => {
    renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    const deleteButton = screen.getAllByLabelText("delete")[0];
    fireEvent.click(deleteButton);
    expect(defaultAthleteProps.isSetOpen).toHaveBeenCalled();
    expect(defaultAthleteProps.setDeleteIndex).toHaveBeenCalled();
  });

  it("calls isSetOpen and setDeleteIndex when Delete icon is clicked (staff)", () => {
    renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    const deleteButton = screen.getAllByLabelText("delete")[0];
    fireEvent.click(deleteButton);
    expect(defaultStaffProps.isSetOpen).toHaveBeenCalled();
    expect(defaultStaffProps.setDeleteIndex).toHaveBeenCalled();
  });

  it('matches snapshot (athlete)', () => {
    const { asFragment } = renderWithProvider(<TeamsTable {...defaultAthleteProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (staff)', () => {
    const { asFragment } = renderWithProvider(<TeamsTable {...defaultStaffProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

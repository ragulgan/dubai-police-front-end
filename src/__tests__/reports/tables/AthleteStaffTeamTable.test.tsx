import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AthleteStaffTeamTable from "@/components/reports/tables/AthleteStaffTeamTable";
import "@testing-library/jest-dom";
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

const rootReducer = combineReducers({
    deleteStaff: (state = {}) => state,
    deleteAthlete: (state = {}) => state,
  });
  const store = configureStore({ reducer: rootReducer });

describe("AthleteStaffTeamTable", () => {
  const defaultProps = {
    headers: [
      "No",
      "Name",
      "Role",
      "Performance Level",
      "Permission Type",
      "Actions",
    ],
    module: "athlete",
    data: [
      {
        athleteId: "1",
        athlete_name: "John Doe",
        athlete_department: "Football",
        avatar: "",
        medicalPerformanceLevel: "High",
        workPermissionType: "Full-Time",
        name: "John Doe",
        role: "Forward",
        staffID: "staff1",
        profileImage: "",
      },
    ],
    setEdit: jest.fn(),
    currentIndex: -1,
    isSetOpen: jest.fn(),
    setDeleteIndex: jest.fn(),
  };

  function renderWithProvider(ui: React.ReactNode) {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("calls setEdit on edit button click", () => {
    renderWithProvider(<AthleteStaffTeamTable {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("edit"));
    expect(defaultProps.setEdit).toHaveBeenCalledWith("1");
  });

  it("calls setDeleteIndex and isSetOpen on delete button click", () => {
    renderWithProvider(<AthleteStaffTeamTable {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("delete"));
    expect(defaultProps.setDeleteIndex).toHaveBeenCalledWith("1");
    expect(defaultProps.isSetOpen).toHaveBeenCalledWith(true);
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithProvider(<AthleteStaffTeamTable {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

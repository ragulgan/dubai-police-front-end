import React from "react";
import { render, screen } from "@testing-library/react";
import ContractDetailsCard from "@/components/view/ContractDetailsCard";


// Mock SVGs
jest.mock("../../../public/CalendarSVG.svg", () => () => <svg data-testid="calendar-icon" />);
// jest.mock("../../../public/BriefcaseSVG.svg", () => () => <svg data-testid="briefcase-icon" />);
// jest.mock("../../../public/department.svg", () => () => <svg data-testid="department-icon" />);

// Sample mock data
const staffData = {
  contractStartDate: "2023-01-01",
  contractEndDate: "2025-01-01",
  currentJobLocation: "Dubai HQ",
  dpEmploymentStatus: "Active",
  acknowledgementDate: "2023-02-01",
  pledgeDate: "2023-03-01"
};

describe("ContractDetailsCard", () => {
  it("renders all contract fields for staff", () => {
    render(<ContractDetailsCard data={staffData} module="staff" />);

    expect(screen.getAllByTestId("calendar-icon").length).toBeGreaterThan(0);
    expect(screen.getByText("Contract Start Date")).toBeInTheDocument();
    expect(screen.getByText("Contract End Date")).toBeInTheDocument();
    expect(screen.getByText("Current Job Position")).toBeInTheDocument();
    expect(screen.getByText("Dubai Police Employment Status")).toBeInTheDocument();
    expect(screen.getByText("Acknowledgement Date")).toBeInTheDocument();
    expect(screen.getByText("Pledge Date")).toBeInTheDocument();

    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2025-01-01")).toBeInTheDocument();
    expect(screen.getByText("Dubai HQ")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("2023-02-01")).toBeInTheDocument();
    expect(screen.getByText("2023-03-01")).toBeInTheDocument();
  });


  it("renders athlete fields correctly", () => {
    const athleteData = {
      dpEmploymentStatus: "Amateur",
      contractStartDate: "2024-06-01",
      contractEndDate: "2025-06-01"
    };
    render(<ContractDetailsCard data={athleteData} module="athlete" />);

    expect(screen.getByText("Contract Type")).toBeInTheDocument();
    expect(screen.getByText("2024-06-01")).toBeInTheDocument();
    expect(screen.getByText("2025-06-01")).toBeInTheDocument();
  });
});
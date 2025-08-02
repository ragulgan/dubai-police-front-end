import React from "react";
import { render, screen } from "@testing-library/react";
import FacilityStatusChip from "@/components/researchAndFacilities/facilityStatusChip/facilityStatusChip";
import '@testing-library/jest-dom';

jest.mock('@mui/icons-material/KeyboardArrowDown', () => () => (
  <svg data-testid="KeyboardArrowDownIcon" />
));

// // Mock SVG icons
// jest.mock("../../../public/team-requirements/drop-down-loading.svg", () => () => <svg data-testid="PendingIcon" />);
// jest.mock("../../../public/team-requirements/drop-down-close.svg", () => () => <svg data-testid="CancelledIcon" />);
// jest.mock("../../../public/ResearchAndFacilities/approved.svg", () => () => <svg data-testid="ApprovedIcon" />);
// jest.mock("../../../public/ResearchAndFacilities/rejected.svg", () => () => <svg data-testid="RejectedIcon" />);

describe("FacilityStatusChip", () => {
  const renderComponent = (status: "Pending" | "Cancelled" | "Approved" | "Rejected") => {
    render(<FacilityStatusChip status={status} />);
  };

  it("renders Pending status correctly", () => {
    renderComponent("Pending");
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByTestId("PendingIcon")).toBeInTheDocument();
  });

  it("renders Cancelled status correctly", () => {
    renderComponent("Cancelled");
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(screen.getByTestId("CancelledIcon")).toBeInTheDocument();
  });

  it("renders Approved status correctly", () => {
    renderComponent("Approved");
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByTestId("ApprovedIcon")).toBeInTheDocument();
  });

  it("renders Rejected status correctly", () => {
    renderComponent("Rejected");
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByTestId("RejectedIcon")).toBeInTheDocument();
  });

  it("renders arrow icon (KeyboardArrowDownIcon)", () => {
    renderComponent("Approved");
    expect(screen.getByTestId("ApprovedIcon")).toBeInTheDocument();
  });
});

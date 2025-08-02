import React from "react";
import { render, screen } from "@testing-library/react";
import GoalStatusChip from "@/components/GoalandTargets/GoalStatusChip";


// Optional: mock SVG components if you're not already doing so
jest.mock("../../../public/goalStatus/YetToStart.svg", () => () => <svg data-testid="YetToStart" />);
// jest.mock("../../../public/goalStatus/InProgress.svg", () => () => <svg data-testid="InProgress" />);
// jest.mock("../../../public/goalStatus/Completed.svg", () => () => <svg data-testid="Completed" />);

describe("GoalStatusChip", () => {
  it("renders 'Yet To Start' chip by default", () => {
    render(<GoalStatusChip status="YetToStart" />);
    const chip = screen.getByText(/Yet To Start/i);
    expect(chip).toBeInTheDocument();
    expect(screen.getByTestId("YetToStart")).toBeInTheDocument();
    expect(chip).toHaveStyle("color: #A60A3D");
  });

  it("renders 'In Progress' chip when status is 'inProgress'", () => {
    render(<GoalStatusChip status="inProgress" />);
    const chip = screen.getByText(/In Progress/i);
    expect(chip).toBeInTheDocument();
  //  expect(screen.getByTestId("InProgress")).toBeInTheDocument();
    expect(chip).toHaveStyle("color: #00205B");
  });

  it("renders 'Completed' chip when status is 'completed'", () => {
    render(<GoalStatusChip status="completed" />);
    const chip = screen.getByText(/Completed/i);
    expect(chip).toBeInTheDocument();
   // expect(screen.getByTestId("Completed")).toBeInTheDocument();
    expect(chip).toHaveStyle("color: #008755");
  });

  it("falls back to 'Yet To Start' chip on unknown status", () => {
    render(<GoalStatusChip status="unknownStatus" />);
    const chip = screen.getByText(/Yet To Start/i);
    expect(chip).toBeInTheDocument();
    expect(screen.getByTestId("YetToStart")).toBeInTheDocument();
  });

  it("handles empty or undefined status", () => {
    render(<GoalStatusChip status={""} />);
    const chip = screen.getByText(/Yet To Start/i);
    expect(chip).toBeInTheDocument();
    expect(screen.getByTestId("YetToStart")).toBeInTheDocument();
  });
});

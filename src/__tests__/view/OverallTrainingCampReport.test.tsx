import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OverallTrainingCampReport from "@/components/view/OverallTrainingCampReport";


describe("OverallTrainingCampReport", () => {
  const mockData = {
    problemsEncountered: "<p>Problem Content</p>",
    positiveAspects: "<p>Positive Content</p>",
    areasForImprovement: "<p>Improvement Content</p>",
  };

  const defaultProps = {
    label: "Training Report",
    expanded: true,
    onClick: jest.fn(),
    id: "camp1",
    data: mockData,
  };

  it("renders the component with given label", () => {
    render(<OverallTrainingCampReport {...defaultProps} />);
    expect(screen.getByText("Training Report")).toBeInTheDocument();
  });

  it("renders tab labels correctly", () => {
    render(<OverallTrainingCampReport {...defaultProps} />);
    expect(screen.getByText("PROBLEMS ENCOUNTERED")).toBeInTheDocument();
    expect(screen.getByText("POSITIVE ASPECTS")).toBeInTheDocument();
    expect(screen.getByText("AREAS FOR IMPROVEMENT")).toBeInTheDocument();
  });

  it("renders default tab content (Problems Encountered)", () => {
    render(<OverallTrainingCampReport {...defaultProps} />);
    expect(screen.getByText("Problem Content")).toBeInTheDocument();
  });

  it("switches to 'Positive Aspects' tab and shows correct content", () => {
    render(<OverallTrainingCampReport {...defaultProps} />);
    fireEvent.click(screen.getByText("POSITIVE ASPECTS"));
    expect(screen.getByText("Positive Content")).toBeInTheDocument();
  });

  it("switches to 'Areas for Improvement' tab and shows correct content", () => {
    render(<OverallTrainingCampReport {...defaultProps} />);
    fireEvent.click(screen.getByText("AREAS FOR IMPROVEMENT"));
    expect(screen.getByText("Improvement Content")).toBeInTheDocument();
  });

  it("calls onClick when top bar is clicked", () => {
    render(<OverallTrainingCampReport {...defaultProps} />);
    fireEvent.click(screen.getByText("Training Report"));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterDialog from "@/components/FilterDialog";

describe("FilterDialog", () => {
  const defaultProps = {
    open: true,
    anchorEl: document.createElement("div"),
    onClose: jest.fn(),
    onApply: jest.fn(),
    options: ["option1", "option2"],
    localStorageKey: "testFilter",
    setRowsPerPage: jest.fn(),
    setPage: jest.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders with given options", () => {
    render(<FilterDialog {...defaultProps} />);
    expect(screen.getByText("Filter by")).toBeInTheDocument();
    expect(screen.getByLabelText("Select All")).toBeInTheDocument();
    expect(screen.getByLabelText("Option1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option2")).toBeInTheDocument();
  });

  it("selects all options when 'Select All' is clicked", () => {
    render(<FilterDialog {...defaultProps} />);
    const selectAll = screen.getByLabelText("Select All");
    fireEvent.click(selectAll);
    expect((screen.getByLabelText("Option1") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Option2") as HTMLInputElement).checked).toBe(true);
  });
  it("deselects all options when all are selected", () => {
    // First render with all selected
   // localStorage.setItem("test-key", JSON.stringify(["option1", "option2"]));
    render(<FilterDialog {...defaultProps} />);
  const selectAll = screen.getByLabelText("Select All");
    fireEvent.click(selectAll);
    fireEvent.click(selectAll);

    // After clicking, all checkboxes should be unchecked
    expect(screen.getByLabelText("Select All")).not.toBeChecked();
    expect(screen.getByLabelText("Option1")).not.toBeChecked();
    expect(screen.getByLabelText("Option2")).not.toBeChecked();
  });
  it("removes an option from selectedFilters when toggled off", () => {
  render(<FilterDialog {...defaultProps} />);
  
  const option1 = screen.getByLabelText("Option1");

  // First click: select option1
  fireEvent.click(option1);
  expect((option1 as HTMLInputElement).checked).toBe(true);

  // Second click: deselect option1 (this is where splice runs)
  fireEvent.click(option1);
  expect((option1 as HTMLInputElement).checked).toBe(false);
});

  it("toggles a single option when clicked", () => {
    render(<FilterDialog {...defaultProps} />);
    const option1 = screen.getByLabelText("Option1");
     const option2 = screen.getByLabelText("Option2");
    fireEvent.click(option1);
    expect((option1 as HTMLInputElement).checked).toBe(true);
     expect((option2 as HTMLInputElement).checked).toBe(false);
  });

  it("clears selected filters on Clear", () => {
    render(<FilterDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Option1"));
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByText("Apply")).toBeDisabled();

});

  it("calls onApply and stores filters on Apply", () => {
    render(<FilterDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Option1"));
    fireEvent.click(screen.getByText("Apply"));

    expect(defaultProps.onApply).toHaveBeenCalledWith(["option1"]);
    expect(localStorage.getItem("testFilter")).toBe(JSON.stringify(["option1"]));
    expect(defaultProps.setPage).toHaveBeenCalledWith(1);
    expect(defaultProps.setRowsPerPage).toHaveBeenCalledWith(10);
  });
   it("renders 'Yet to Start' for 'notStarted'", () => {
    render(
      <FilterDialog {...defaultProps} options={["notStarted"]} />
    );
   expect(screen.getByLabelText(/Yet to Start/i)).toBeInTheDocument();

  });
  
  it("renders 'In Progress' for 'inprogress'", () => {
    render(
      <FilterDialog {...defaultProps} options={["inprogress"]} />
    );
    expect(screen.getByLabelText(/In Progress/i)).toBeInTheDocument();
  });

  it("renders 'Completed' for 'completed'", () => {
    render(
      <FilterDialog {...defaultProps} options={["completed"]} />
    );
    expect(screen.getByLabelText(/Completed/i)).toBeInTheDocument();
  });

  it("renders 'Fit To Play' for 'fitToPlay'", () => {
    render(
      <FilterDialog {...defaultProps} options={["fitToPlay"]} />
    );
    expect(screen.getByLabelText(/Fit To Play/i)).toBeInTheDocument();
  });

  it("renders 'Not Fit' for 'notFit'", () => {
    render(
      <FilterDialog {...defaultProps} options={["notFit"]} />
    );
    expect(screen.getByLabelText(/Not Fit/i)).toBeInTheDocument();
  });

  it("renders fallback label for unknown role", () => {
    render(
      <FilterDialog {...defaultProps} options={["coach"]} />
    );
    expect(screen.getByLabelText(/Coach/i)).toBeInTheDocument(); 
  });
});
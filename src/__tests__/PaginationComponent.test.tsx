import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationComponent from "@/components/PaginationComponent";
import "@testing-library/jest-dom";

describe("PaginationComponent", () => {
  const defaultProps = {
    rowsPerPage: 10,
    page: 1,
    handleChangeRowsPerPage: jest.fn(),
    handleChangePage: jest.fn(),
    startIndex: 1,
    endIndex: 10,
    totalItems: 25,
    isDisable: false,
  };

  it("renders without crashing", () => {
    render(<PaginationComponent {...defaultProps} />);
    expect(screen.getByText(/Items per page/i)).toBeInTheDocument();
    expect(screen.getByText(/Showing 1-10 of 25 total/i)).toBeInTheDocument();
  });

  it("disables dropdown if totalItems < 5", () => {
    render(<PaginationComponent {...defaultProps} totalItems={3} />);
  const combobox = screen.getByRole("combobox");

  fireEvent.mouseDown(combobox);
  // The options list should NOT appear
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
it("displays page 1 when page prop is 0", () => {
  render(<PaginationComponent {...defaultProps} page={0} />);
  const pageOneButton = screen.getByRole("button", { name: /page 1/i });
  expect(pageOneButton).toHaveAttribute("aria-current", "page");
});
it("displays correct current page when page > 0", () => {
  render(<PaginationComponent {...defaultProps} page={2} />);
  const pageTwoButton = screen.getByRole("button", { name: /page 2/i });
  expect(pageTwoButton).toHaveAttribute("aria-current", "page");
});
  it("disables dropdown if isDisable is true", () => {
    render(<PaginationComponent {...defaultProps} isDisable={true} />);
   expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true");
  });
  it("calls handleChangeRowsPerPage when new option selected", async () => {
  const handleChangeRowsPerPage = jest.fn();

  render(
    <PaginationComponent
      {...defaultProps}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      totalItems={25}
    />
  );

  const select = screen.getByRole("combobox");
  fireEvent.mouseDown(select);

  const option = await screen.findByRole("option", { name: "15" }); 
  fireEvent.click(option);

  expect(handleChangeRowsPerPage).toHaveBeenCalled();
});

  it("calls handleChangePage when pagination is clicked", () => {
    render(<PaginationComponent {...defaultProps} />);
    const page2 = screen.getByRole("button", { name: "Go to page 2" });
    fireEvent.click(page2);
    expect(defaultProps.handleChangePage).toHaveBeenCalled();
  });

  it("renders correct number of pages based on totalItems", () => {
    render(<PaginationComponent {...defaultProps} totalItems={30} rowsPerPage={10} />);
  expect(screen.getByRole("button", { name: "Go to page 3" })).toBeInTheDocument();

  });

  it("shows the correct selected page", () => {
    render(<PaginationComponent {...defaultProps} page={2} />);
    expect(screen.getByRole("button", { name: "page 2" })).toHaveClass("Mui-selected");
  });
});
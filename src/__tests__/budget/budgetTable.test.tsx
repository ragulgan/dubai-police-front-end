import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BudgetTable from "@/components/budget/budgetTable";

// Mock router
jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() })
}));

// Mock checkAccess utility
jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(() => true)
}));

// Mock StatusChip and PaginationComponent
jest.mock("@/components/statusChip", () => () => <div data-testid="status-chip" />);
jest.mock("@/components/PaginationComponent", () => () => <div data-testid="pagination-component" />);

// Mock XlsSVG
jest.mock("../../../public/XlsSVG.svg", () => (props: any) => <svg data-testid="xls-svg" {...props} />);

const budgetsList = {
  approvedGrandTotal: 10000,
  data: [
    {
      budgetName: "Budget 1",
      createdby: "John",
      createdByFirstName: "Doe",
      createdByMiddleName: "A.",
      createdBySurName: "Smith",
      budgetCreatedDate: "2024-06-01",
      budgetType: "Annual",
      statusText: "Approved",
      grandTotal: 5000,
      budgetID: 1,
    },
  ],
  totalRecords: 1,
};

describe("BudgetTable", () => {
  const baseProps = {
    budgetsList,
    setRowsPerPage: jest.fn(),
    setPage: jest.fn(),
    page: 1,
    rowsPerPage: 10,
    searchText: "",
    teamID: 42,
  };

  it("renders table headers and Approved Grand Total", () => {
    render(<BudgetTable {...baseProps} />);
    expect(screen.getByText("Approved Grand Total :")).toBeInTheDocument();
    expect(screen.getByText("Budget Name")).toBeInTheDocument();
    expect(screen.getByText("Created By")).toBeInTheDocument();
    expect(screen.getByText("Created Date")).toBeInTheDocument();
    expect(screen.getByText("Budget Type")).toBeInTheDocument();
    expect(screen.getByText("Approval Status")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("10000")).toBeInTheDocument();
  });

  it("renders a budget row with correct data", () => {
    render(<BudgetTable {...baseProps} />);
    expect(screen.getByText("Budget 1")).toBeInTheDocument();
    expect(screen.getByText("John Doe A. Smith")).toBeInTheDocument();
    expect(screen.getByText("2024-06-01")).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByTestId("status-chip")).toBeInTheDocument();
  });

  it("renders Export to Excel button and disables it if data is empty", () => {
    const { rerender } = render(<BudgetTable {...baseProps} />);
    const exportBtn = screen.getByRole("button", { name: /Export to Excel/i });
    expect(exportBtn).toBeInTheDocument();
    expect(exportBtn).not.toBeDisabled();
    // Disabled if data is empty
    rerender(<BudgetTable {...baseProps} budgetsList={{ ...budgetsList, data: [] }} />);
    expect(screen.getByRole("button", { name: /Export to Excel/i })).toBeDisabled();
  });

  it("renders action buttons (view/edit)", () => {
    render(<BudgetTable {...baseProps} />);
    // View button
    expect(screen.getByLabelText("view")).toBeInTheDocument();
    // Edit button
    expect(screen.getByLabelText("edit")).toBeInTheDocument();
  });

  it("renders PaginationComponent", () => {
    render(<BudgetTable {...baseProps} />);
    expect(screen.getByTestId("pagination-component")).toBeInTheDocument();
  });
}); 
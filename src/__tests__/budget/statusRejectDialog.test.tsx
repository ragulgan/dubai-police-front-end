import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StatusRejectDialog from "@/components/budget/view/statusRejectDialog";

// Mocks
jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: jest.fn()
  }));
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn(), useSelector: jest.fn(fn => fn({ budgetsUpdateStatus: {} })) }));
jest.mock("@/components/Fields/CustomTextField", () => () => <input placeholder="Reason for Rejection" />);
jest.mock("@/components/CustomSnackbar", () => (props: any) => <div>Snackbar: {props.message}</div>);

describe("StatusRejectDialog", () => {
  const budgetEditData = {
    data: [
      {
        budgetID: 1,
        budgetName: "Test Budget",
        rejectedReason: "",
        statusText: "Pending",
      },
    ],
  };

  it("renders Reject button and opens dialog", () => {
    render(<StatusRejectDialog budgetEditData={budgetEditData} />);
    const rejectBtn = screen.getByRole("button", { name: /Reject/i });
    expect(rejectBtn).toBeInTheDocument();
    fireEvent.click(rejectBtn);
    expect(screen.getByText(/Confirm Budget Rejection/)).toBeInTheDocument();
  });

  it("renders Rejected Reason link when status is 'Reject'", () => {
    render(<StatusRejectDialog budgetEditData={budgetEditData} status="Reject" />);
    expect(screen.getByText(/Rejected Reason/)).toBeInTheDocument();
  });

  it("shows snackbar on status update", async () => {
    // Set up the mock for useSelector to simulate a successful update
    const { useSelector } = require("react-redux");
    useSelector.mockImplementation((fn:any) => fn({ budgetsUpdateStatus: { code: 200 } }));

    const StatusRejectDialog = require("@/components/budget/view/statusRejectDialog").default;
    render(<StatusRejectDialog budgetEditData={budgetEditData} />);
    // Open the dialog
    fireEvent.click(screen.getByRole("button", { name: /Reject/i }));
    // Click the reject button
    fireEvent.click(screen.getByRole("button", { name: /Yes, Reject/i }));
    // Wait for the snackbar to appear
    expect(await screen.findByText(/Snackbar/)).toBeInTheDocument();
  });
}); 
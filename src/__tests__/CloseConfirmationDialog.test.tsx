import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CloseConfirmationDialog from "@/components/CloseConfirmationDialog"; 

describe("CloseConfirmationDialog", () => {
  const defaultProps = {
    open: true,
    setOpen: jest.fn(),
    module: "staff",
    closeConfirm: jest.fn(),
  }

  it("renders dialog with correct title and text", () => {
    render(<CloseConfirmationDialog {...defaultProps} />);

    expect(screen.getByText("Close Staff")).toBeInTheDocument();
    expect(screen.getByText("Do you want to Close?")).toBeInTheDocument();
    expect(screen.getByText("Edit Staff")).toBeInTheDocument();
  });

  it("renders correct label for module='athlete'", () => {
    render(<CloseConfirmationDialog {...defaultProps} module="athlete" />);
    expect(screen.getByText("Edit Athlete")).toBeInTheDocument();
  });

  it("calls setOpen(false) when Cancel is clicked", () => {
    render(<CloseConfirmationDialog {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
  });

it("calls closeConfirm when Close button is clicked", () => {
  render(<CloseConfirmationDialog {...defaultProps} />);
  const buttons = screen.getAllByRole("button", { name: /close/i });

  fireEvent.click(buttons[1]);

  expect(defaultProps.closeConfirm).toHaveBeenCalled();
});

  it("calls closeConfirm when Close icon is clicked", () => {
    render(<CloseConfirmationDialog {...defaultProps} />);
    const closeIcon = screen.getByLabelText("close");
    fireEvent.click(closeIcon);
    expect(defaultProps.closeConfirm).toHaveBeenCalled();
  });
  
 
});

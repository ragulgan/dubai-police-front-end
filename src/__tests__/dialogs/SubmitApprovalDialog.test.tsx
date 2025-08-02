import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SubmitApprovalDialog from "@/components/dialogs/SubmitApprovalDialog";
import "@testing-library/jest-dom";

// Mock props
const handleCloseMock = jest.fn();
const onSubmitMock = jest.fn();

const renderComponent = (openDialog = true) => {
  render(
    <SubmitApprovalDialog
      openDialog={openDialog}
      handleClose={handleCloseMock}
      onSubmit={onSubmitMock}
    />
  );
};

describe("SubmitApprovalDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render dialog when openDialog is false", () => {
    renderComponent(false);
    expect(screen.queryByText("Submit For Approval")).not.toBeInTheDocument();
  });

  it("should render dialog with correct text content", () => {
    renderComponent();

    // Use getAllByText if the same text appears in multiple places
    const titleElements = screen.getAllByText("Submit For Approval");
    expect(titleElements.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText("Are you sure you want to submit this for approval?")
    ).toBeInTheDocument();

    expect(screen.getByText(/one-time approval process/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancel Submission" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Submit For Approval" })
    ).toBeInTheDocument();
  });
  it("should call handleClose with 'closeButtonClick' when Cancel Submission button is clicked", () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", {
      name: /cancel submission/i,
    });
    fireEvent.click(cancelButton);

    expect(handleCloseMock).toHaveBeenCalledWith(
      expect.any(Object),
      "closeButtonClick"
    );
  });

  it("should call onSubmit when Submit For Approval button is clicked", () => {
    renderComponent();

    const submitButton = screen.getByRole("button", {
      name: /submit for approval/i,
    });
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("should call handleClose with 'closeButtonClick' when close icon is clicked", () => {
    renderComponent();
    const closeIcon = screen.getByTestId("CloseIcon");
    const closeButton = closeIcon.closest("button");

    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton!);

    expect(handleCloseMock).toHaveBeenCalledWith(
      expect.any(Object),
      "closeButtonClick"
    );
  });
});

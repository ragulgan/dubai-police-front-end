import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditRequestDialog from "@/components/dialogs/EditRequestDialog";
import "@testing-library/jest-dom";

const handleCloseMock = jest.fn();
const onSubmitMock = jest.fn();

const renderComponent = (open = true) => {
  render(
    <EditRequestDialog
      openDialog={open}
      handleClose={handleCloseMock}
      onSubmit={onSubmitMock}
    />
  );
};

describe("EditRequestDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render the dialog when openDialog is false", () => {
    renderComponent(false);
    expect(screen.queryByText("Edit Request")).not.toBeInTheDocument();
  });

  it("should render dialog with correct text and buttons", () => {
    renderComponent();
    // Title appears both in header and in button — use getAllByText to avoid ambiguity
    const titles = screen.getAllByText("Edit Request");
    expect(titles.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText("Are you sure you want to proceed with edit request?")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/You are requesting approval to edit this activity/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /cancel/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /send request/i })
    ).toBeInTheDocument();
  });

  it("should call handleClose with 'closeButtonClick' when Cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(handleCloseMock).toHaveBeenCalledWith(expect.any(Object), "closeButtonClick");
  });

  it("should call onSubmit when Send Request button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /send request/i }));

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("should call handleClose with 'closeButtonClick' when close icon is clicked", () => {
    renderComponent();

    const closeIcon = screen.getByTestId("CloseIcon");
    const closeButton = closeIcon.closest("button");

    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton!);

    expect(handleCloseMock).toHaveBeenCalledWith(expect.any(Object), "closeButtonClick");
  });
});
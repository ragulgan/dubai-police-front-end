import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomSnackbar from "@/components/CustomSnackbar"; // update the path if needed
import "@testing-library/jest-dom";

describe("CustomSnackbar", () => {
  const defaultProps = {
    message: "Operation successful!",
    severity: "success" as const,
    open: true,
    onClose: jest.fn(),
    duration: 3000,
  };
  it("renders success snackbar with custom message", () => {
    render(<CustomSnackbar {...defaultProps} />);
    expect(screen.getByText("Operation successful!")).toBeInTheDocument();
  });

  it("calls onClose when close icon is clicked", () => {
    render(<CustomSnackbar {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("renders error snackbar when severity is error", () => {
    render(
      <CustomSnackbar
        {...defaultProps}
        severity="error"
        message="Something went wrong"
      />
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("auto closes after duration", async () => {
    jest.useFakeTimers();
    render(<CustomSnackbar {...defaultProps} />);
    jest.advanceTimersByTime(3000);
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
    jest.useRealTimers();
  });
  it("auto closes after default 6000ms duration", async () => {
  jest.useFakeTimers(); // control timers

  const onCloseMock = jest.fn();

  render(
    <CustomSnackbar
      message="Auto-dismiss after 6000ms"
      severity="success"
      open={true}
      onClose={onCloseMock}
    />
  );
  jest.advanceTimersByTime(6000);

  await waitFor(() => {
    expect(onCloseMock).toHaveBeenCalled();
  });

  jest.useRealTimers();
});
});

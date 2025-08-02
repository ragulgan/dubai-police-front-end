import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import SeasonCreateDialog from "@/components/dialogs/SeasonCreateDialog";

// Mock the next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));


// Mock lodash isEmpty
jest.mock("lodash", () => ({
  isEmpty: jest.fn((value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0)
      return true;
    return false;
  }),
}));

describe("SeasonCreateDialog", () => {
  const mockHandleClose = jest.fn();
  const mockHandleMenuSelect = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: mockPush,
    });
    mockHandleClose.mockClear();
    mockHandleMenuSelect.mockClear();
    mockPush.mockClear();
    //   (isEmpty as jest.Mock).mockClear(); // Clear mock for isEmpty
  });

  it("should not render the dialog when openDialog is false", () => {
    render(
      <SeasonCreateDialog
        openDialog={false}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(
      screen.queryByText("Competition/Tournament")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Events/Initiative")).not.toBeInTheDocument();
    expect(screen.queryByText("Fitness Program")).not.toBeInTheDocument();
    expect(screen.queryByText("Training Courses")).not.toBeInTheDocument();
    expect(screen.queryByText("Awareness Activity")).not.toBeInTheDocument();
  });

  it("should render the dialog when openDialog is true", () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(screen.getByText("Competition/Tournament")).toBeInTheDocument();
    expect(screen.getByText("Events/Initiative")).toBeInTheDocument();
    expect(screen.getByText("Fitness Program")).toBeInTheDocument();
    expect(screen.getByText("Training Courses")).toBeInTheDocument();
    expect(screen.getByText("Awareness Activity")).toBeInTheDocument();
  });

  it("should call handleClose when the dialog is closed", () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
      code: "Escape",
    });
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('should call handleMenuSelect with "tournament" when Competition/Tournament button is clicked', () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Competition/Tournament"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("tournament");
  });

  it('should call handleMenuSelect with "event" when Events/Initiative button is clicked', () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Events/Initiative"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("event");
  });

  it('should call handleMenuSelect with "fitness" when Fitness Program button is clicked', () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Fitness Program"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("fitness");
  });

  it('should call handleMenuSelect with "training" when Training Courses button is clicked', () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );

    fireEvent.click(screen.getByText("Training Courses"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("training");
  });

  it('should call handleMenuSelect with "awareness" when Awareness Activity button is clicked', () => {
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Awareness Activity"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("awareness");
  });
  it("should call handleMenuSelect with the value from router.query.create on mount", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "events" },
      push: mockPush,
    });
    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    await waitFor(() => {
      expect(isEmpty).toHaveBeenCalledWith("events"); // Ensure isEmpty is called
      expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
      expect(mockHandleMenuSelect).toHaveBeenCalledWith("events");
    });
  });

  it("should not call handleMenuSelect if router.query.create is empty", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "" }, // Empty string
      push: mockPush,
    });

    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );

    await waitFor(() => {
      expect(isEmpty).toHaveBeenCalledWith(""); // Ensure isEmpty is called
      expect(mockHandleMenuSelect).not.toHaveBeenCalled();
    });
  });

  it("should not call handleMenuSelect if router.query.create is undefined", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {}, // No 'create' property
      push: mockPush,
    });

    render(
      <SeasonCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );

    await waitFor(() => {
      expect(isEmpty).toHaveBeenCalledWith(undefined); // Ensure isEmpty is called with undefined
      expect(mockHandleMenuSelect).not.toHaveBeenCalled();
    });
  });
});

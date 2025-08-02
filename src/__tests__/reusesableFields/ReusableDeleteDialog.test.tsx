import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";

// Mock next/image to avoid SSR issues
jest.mock("next/image", () => (props: any) => <img {...props} alt={props.alt || "mocked-image"} />);

const defaultProps = {
  title: "Test Item",
  successMessage: "Deleted successfully!",
  icon: <span data-testid="custom-icon">icon</span>,
  deleteAction: jest.fn(),
  fetchAfterDelete: jest.fn(),
  deleteResponse: {},
  payload: { id: 1 },
  revertMessage: "This action cannot be undone.",
  clearDeleteState: jest.fn(),
  width: undefined,
  height: undefined,
  minHeight: undefined,
  css: undefined,
  module: undefined,
  buttonIcon: undefined,
  btnBorderColor: undefined,
  btnColor: undefined,
  btnBgColor: undefined,
  btnLabel: undefined,
};

describe("ReusableDeleteDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders icon button and opens dialog on click", () => {
    render(<ReusableDeleteDialog {...defaultProps} />);
    const iconBtn = screen.getByLabelText("delete");
    expect(iconBtn).toBeInTheDocument();
    fireEvent.click(iconBtn);
    expect(screen.getByText("Delete Test Item")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
  });

  it("calls deleteAction with payload when 'Yes, delete' is clicked", () => {
    render(<ReusableDeleteDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("delete"));
    const yesBtn = screen.getByRole("button", { name: /Yes, delete/i });
    fireEvent.click(yesBtn);
    expect(defaultProps.deleteAction).toHaveBeenCalledWith(defaultProps.payload);
  });

  it("calls clearDeleteState and closes dialog when close icon is clicked", async () => {
    render(<ReusableDeleteDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("delete"));
    const closeBtn = screen.getByLabelText("close");
    fireEvent.click(closeBtn);
    expect(defaultProps.clearDeleteState).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText("Delete Test Item")).not.toBeInTheDocument();
    });
  });

  it("shows loading spinner when deleteResponse.loading is true", () => {
    render(
      <ReusableDeleteDialog
        {...defaultProps}
        deleteResponse={{ loading: true }}
      />
    );
    fireEvent.click(screen.getByLabelText("delete"));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows success message and calls fetchAfterDelete after deleteResponse.code === 200", async () => {
    jest.useFakeTimers();
    const fetchAfterDelete = jest.fn();
    const clearDeleteState = jest.fn();
    render(
      <ReusableDeleteDialog
        {...defaultProps}
        deleteResponse={{ code: 200 }}
        fetchAfterDelete={fetchAfterDelete}
        clearDeleteState={clearDeleteState}
      />
    );
    fireEvent.click(screen.getByLabelText("delete"));
    expect(screen.getByText("Deleted successfully!")).toBeInTheDocument();
    jest.advanceTimersByTime(3000);
    await waitFor(() => {
      expect(fetchAfterDelete).toHaveBeenCalled();
      expect(clearDeleteState).toHaveBeenCalled();
    });
    jest.useRealTimers();
  });

  it("renders CustomButton when module is 'news' or 'mou'", () => {
    render(
      <ReusableDeleteDialog
        {...defaultProps}
        module="news"
      />
    );
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  it("renders CustomButton when buttonIcon is provided", () => {
    render(
      <ReusableDeleteDialog
        {...defaultProps}
        buttonIcon={<span>icon</span>}
        btnLabel="Remove"
      />
    );
    expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();
  });
}); 
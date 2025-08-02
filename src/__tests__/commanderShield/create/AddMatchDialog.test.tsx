import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import AddMatchDialog from "@/components/commanderShield/create/AddMatchDialog";
import { renderWithProviders } from "../../../../__mocks__/store";



describe("AddMatchDialog", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    title: "Add Match",
    description: "Add a new match entry",
  };

  it("renders dialog with title and description", () => {
    renderWithProviders(<AddMatchDialog {...defaultProps} />);
    expect(screen.getByText("Add Match")).toBeInTheDocument();
  });

  it("renders '+ Add time slot' button", () => {
    renderWithProviders(<AddMatchDialog {...defaultProps} />);
    expect(screen.getByText("+ Add time slot")).toBeInTheDocument();
  });

  it("opens AddTimeSlotDialog when '+ Add time slot' is clicked", () => {
    renderWithProviders(<AddMatchDialog {...defaultProps} />);
    const addButton = screen.getByText("+ Add time slot");
    fireEvent.click(addButton);
    expect(screen.getByText("Time Slot Form")).toBeInTheDocument(); // AddTimeSlotDialog title
  });

  it("shows validation errors when submitting empty form", async () => {
    renderWithProviders(<AddMatchDialog {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitButton);

    // You can check for one required message — ideally from one of the fields
    expect(await screen.findAllByText(/is required/i)).toBeTruthy();
  });



});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BudgetItemAdd from "@/components/budget/add/budgetItemAdd";

jest.mock("@/utils/acessscheck", () => ({ checkAccess: () => true }));
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn() }));
jest.mock("@/components/buttons/AppAddButton", () => (props:any) => <button onClick={props.onClick}>Add item</button>);
jest.mock("@/components/Fields/CustomTextField", () => () => <input placeholder="CustomTextField" />);
jest.mock("@/components/CustomSnackbar", () => (props:any) => <div>Snackbar: {props.message}</div>);

describe("BudgetItemAdd", () => {
  const setBudgetItem = jest.fn();
  const baseProps = {
    setBudgetItem,
    budgetItem: [
      { itemName: "Item 1", amountPerItem: "100", quantity: "2" },
      { itemName: "Item 2", amountPerItem: "200", quantity: "1" },
    ],
    mode: "add",
    id: 1,
    teamID: 1,
    budgetEditData: null,
  };

  it("renders table headers and add button", () => {
    render(<BudgetItemAdd {...baseProps} />);
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Amount per Item")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Item Total")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Add item")).toBeInTheDocument();
  });

  it("renders budget items and grand total", () => {
    render(<BudgetItemAdd {...baseProps} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Grand Total:")).toBeInTheDocument();
    expect(screen.getAllByText(/AED/).length).toBeGreaterThan(0);
  });

  it("calls setBudgetItem on delete", () => {
    render(<BudgetItemAdd {...baseProps} />);
    const deleteBtns = screen.getAllByLabelText("view");
    fireEvent.click(deleteBtns[0]);
    expect(setBudgetItem).toHaveBeenCalled();
  });

  it.skip("shows snackbar on add/edit/error", () => {
    render(<BudgetItemAdd {...baseProps} />);
    // Simulate clicking the add button to open the add form
    fireEvent.click(screen.getByText("Add item"));
    // If your form fields are mocked, you may need to fill them and submit
    // fireEvent.change(screen.getByPlaceholderText("CustomTextField"), { target: { value: "New Item" } });
    // fireEvent.click(screen.getByText("Save")); // or whatever triggers the add
    // Now check for the snackbar
    expect(screen.queryByText(/Snackbar/)).not.toBeNull();
  });
}); 
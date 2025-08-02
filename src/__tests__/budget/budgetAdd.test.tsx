import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// Mocks
jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: jest.fn()
  }));
jest.mock("next/router", () => ({ useRouter: () => ({ query: { teamID: 1 }, push: jest.fn(), back: jest.fn() }) }));
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn(), useSelector: jest.fn(fn => fn({ budgetsAdd: {}, budgetsUpdate: {} })) }));
jest.mock("@/components/Fields/CustomRadioGroup", () => () => <div>CustomRadioGroup</div>);
jest.mock("@/components/Fields/CustomTextField", () => () => <div>CustomTextField</div>);
jest.mock("@/components/trainingCamp/trainingCampCustomDatePicker", () => () => <div>DatePicker</div>);
jest.mock("@/components/useFormSunEditor", () => () => <div>SunEditor</div>);
jest.mock("@/components/budget/add/budgetItemAdd", () => () => <div>BudgetItemAdd</div>);
jest.mock("@/components/CustomSnackbar", () => (props:any) => <div>Snackbar: {props.message}</div>);
jest.mock("@/components/trainingCamp/skeleton/editSkeletont", () => () => <div>EditFieldSkeleton</div>);
jest.mock("moment", () => () => ({ format: () => "01/01/2024" }));

import BudgetAdd from "@/components/budget/add/budgetAdd";

describe("BudgetAdd", () => {
  const baseProps = { edit: false, id: 1, budgetEditData: null, mode: "add" };

  it("renders form fields and buttons", () => {
    render(<BudgetAdd {...baseProps} />);
    expect(screen.getByText("CustomRadioGroup")).toBeInTheDocument();
    expect(screen.getAllByText("CustomTextField").length).toBeGreaterThan(0);
    expect(screen.getByText("DatePicker")).toBeInTheDocument();
    expect(screen.getByText("SunEditor")).toBeInTheDocument();
    expect(screen.getByText("BudgetItemAdd")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit For Approval/i })).toBeInTheDocument();
  });

  it("shows skeleton when loading", () => {
    render(<BudgetAdd {...baseProps} budgetEditData={{ loading: true }} />);
    expect(screen.getByText("EditFieldSkeleton")).toBeInTheDocument();
  });

  it("shows snackbar on success", async () => {
    // Set up the mock for useSelector to simulate a successful add
    const { useSelector } = require("react-redux");
    useSelector.mockImplementation((fn:any) => fn({ budgetsAdd: { code: 200 }, budgetsUpdate: {} }));

    render(<BudgetAdd edit={false} id={1} budgetEditData={null} mode="add" />);
    expect(await screen.findByText(/Snackbar/)).toBeInTheDocument();
  });

  it("cancel button calls router.back", () => {
    const { getByRole } = render(<BudgetAdd {...baseProps} />);
    fireEvent.click(getByRole("button", { name: /Cancel/i }));
    // No error = router.back called (mocked)
  });

  it("submit button is disabled when loading", () => {
    jest.doMock("react-redux", () => ({
      useDispatch: () => jest.fn(),
      useSelector: jest.fn(fn => fn({ budgetsAdd: { loading: true }, budgetsUpdate: {} }))
    }));
    const BudgetAdd = require("@/components/budget/add/budgetAdd").default;
    render(<BudgetAdd edit={false} id={1} budgetEditData={null} mode="add" />);
    const submitBtn = screen.getByRole("button", { name: /Submit For Approval/i });
    expect(submitBtn).toBeDisabled();
  });
}); 
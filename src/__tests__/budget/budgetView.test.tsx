import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BudgetView from "@/components/budget/view/budgetView";
// Mocks
jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: jest.fn()
  }));
jest.mock("next/router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn(), useSelector: jest.fn(fn => fn({ budgetsUpdateStatus: {} })) }));
jest.mock("@/components/buttons/CustomButton", () => (props: any) => <button onClick={props.onClick}>{props.label}</button>);
jest.mock("@/components/skeleton/TableSkeleton", () => () => <div>TableSkeleton</div>);
jest.mock("@/components/common/RenderHtmlContent", () => (props: any) => <div>{props.content}</div>);
jest.mock("@/components/budget/add/budgetItemAdd", () => () => <div>BudgetItemAdd</div>);
jest.mock("@/components/CustomSnackbar", () => (props: any) => <div>Snackbar: {props.message}</div>);
jest.mock("@/components/budget/view/statusRejectDialog", () => () => <div>StatusRejectDialog</div>);
jest.mock("@/components/statusChip", () => () => <div>StatusChip</div>);
jest.mock("../../../../public/XlsSVG.svg", () => (props: any) => <svg data-testid="xls-svg" {...props} />);
jest.mock("@/utils/acessscheck", () => ({ checkAccess: () => true }));


describe("BudgetView", () => {
  const budgetEditData = {
    code: 200,
    loading: false,
    data: [
      {
        budgetID: 1,
        budgetName: "Test Budget",
        budgetDescription: "Description",
        createdby: "Admin",
        budgetType: "Annual",
        grandTotal: 1000,
        budgetCreatedDate: "2024-06-01",
        statusText: "Pending",
        budgetItemList: [],
      },
    ],
  };
  const baseProps = { id: 1, budgetEditData, teamID: 1 };

  it("renders main budget info and buttons", () => {
    render(<BudgetView {...baseProps} />);
    expect(screen.getByText("Test Budget")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("Edit Budget")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Export to Excel/i })).toBeInTheDocument();
    expect(screen.getByText("BudgetItemAdd")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    render(<BudgetView {...baseProps} budgetEditData={{ ...budgetEditData, loading: true }} />);
    expect(screen.getByText("TableSkeleton")).toBeInTheDocument();
  });

  it("shows snackbar on success", async () => {
    // Set up the mock for useSelector to simulate a successful add
    const { useSelector } = require("react-redux");
    useSelector.mockImplementation((fn:any) => fn({ budgetsUpdateStatus: { code: 200 } }));

    render(<BudgetView {...baseProps} />);
    expect(await screen.findByText(/Snackbar/)).toBeInTheDocument();
  });
}); 
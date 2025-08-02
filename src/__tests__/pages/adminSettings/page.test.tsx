import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import UserManagementIndexPage from "../../../pages/admin-settings/index";

const createMockStore = (initialState: any) => {
  let state = initialState;
  const listeners: Function[] = [];

  return {
    getState: () => state,
    dispatch: jest.fn(),
    subscribe: (listener: Function) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    },
    replaceReducer: jest.fn(),
    [Symbol.observable]: () => ({
      subscribe: () => ({
        unsubscribe: jest.fn(),
      }),
    }),
  };
};

const initialState = {
  role: { rolesList: [] },
  user: { userList: [], totalCount: 0, loading: false },
  rolesList: {
    data: [
      { id: 1, name: "Admin" },
      { id: 2, name: "User" },
    ],
  },
};

jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/admin-settings",
    route: "/admin-settings",
    query: {},
    asPath: "/admin-settings",
    push: jest.fn(),
  }),
}));

jest.mock(
  "@/components/FilterDialog",
  () =>
    ({ open, onClose }: any) =>
      open ? (
        <div data-testid="filter-dialog">
          <p>Filter by</p>
          <button onClick={onClose}>Close</button>
        </div>
      ) : null
);

jest.mock("@/components/search/ModuleSearchInput", () => ({
  __esModule: true,
  default: (props: any) => (
    <input
      data-testid="search-input"
      onChange={(e) => props.onSearch?.(e.target.value)}
    />
  ),
}));

describe("UserManagementIndexPage UI", () => {
  let store: any;

  beforeEach(() => {
    store = createMockStore(initialState);
  });

  const renderWithMockStore = (ui: React.ReactElement) =>
    render(<Provider store={store}>{ui}</Provider>);

  it("renders the component and basic UI elements", () => {
    renderWithMockStore(<UserManagementIndexPage />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();

    // Find button with text "Filters" instead of data-testid
    const filterButton = screen.getByRole("button", { name: /filters/i });
    expect(filterButton).toBeInTheDocument();
  });

  it("handles search and filter dialog open/close", () => {
    renderWithMockStore(<UserManagementIndexPage />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "Asif" },
    });

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filterButton);

    expect(screen.getByTestId("filter-dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("filter-dialog")).not.toBeInTheDocument();
  });
});

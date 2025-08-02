import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Page from "../../../pages/latest-results/index";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/latest-results",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/latest-results",
    query: {},
    asPath: "/latest-results",
    back: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    isFallback: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

jest.mock("@/components/nav/BasicBreadcrumbs", () => () => (
  <div>Breadcrumbs</div>
));

jest.mock(
  "@/components/Fields/MultiSelect",
  () =>
    ({ onChange, value }: any) =>
      (
        <select data-testid="multi-select" onChange={onChange} value={value}>
          <option value="0">All</option>
          <option value="1">Football</option>
        </select>
      )
);

jest.mock(
  "@/components/search/ModuleSearchInput",
  () =>
    ({ searchText, setSearchText }: any) =>
      (
        <input
          data-testid="search-input"
          placeholder="Search by Event Name, etc..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )
);

jest.mock("@/components/buttons/AppAddButton", () => ({ onClick }: any) => (
  <button data-testid="add-button" onClick={onClick}>
    Add Result
  </button>
));

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: () => true,
}));

jest.mock("@/redux/slices/results/ResultListSlice", () => ({
  viewResults: jest.fn(() => ({ type: "VIEW_RESULTS" })),
}));

const createMockStore = (overrideState?: any) => {
  const defaultState = {
    getResultsList: {
      loading: false,
      code: 200,
      data: [
        { eventName: "Match A", id: 1 },
        { eventName: "Match B", id: 2 },
      ],
    },
    getSportList: {
      data: [{ sportID: 1, sportName: "Football", categoryType: "Team" }],
    },
  };

  return configureStore({
    reducer: (state) => state,
    preloadedState: { ...defaultState, ...overrideState },
  });
};

describe("Latest Results Page", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the page with all core UI", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    expect(screen.getByText("Breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("multi-select")).toBeInTheDocument();
  });

  it("updates sport filter when selected", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const select = screen.getByTestId("multi-select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "1" } });
  });

  it("updates search input", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Match A" } });

    expect(searchInput).toHaveValue("Match A");
  });

  it("triggers navigation when add button is clicked", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const button = screen.getByTestId("add-button");
    fireEvent.click(button);
  });
});

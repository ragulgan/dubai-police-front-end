import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import RulesAndAgreementsPage from "../../../pages/rules";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("lodash", () => {
  const actualLodash = jest.requireActual("lodash");
  const mockDebounce = (fn: any) => {
    const debounced = (...args: any[]) => fn(...args);
    debounced.cancel = jest.fn(); // Fix: include cancel method
    return debounced;
  };

  return {
    ...actualLodash,
    debounce: mockDebounce,
    isEmpty: actualLodash.isEmpty,
  };
});

const createMockStore = () =>
  configureStore({
    reducer: {
      rulesAndAgreements: (
        state = {
          loading: false,
          data: [
            { id: 1, title: "Rule 1", description: "Description 1" },
            { id: 2, title: "Rule 2", description: "Description 2" },
          ],
          totalRecords: 2,
        }
      ) => state,
    },
  });

describe("RulesAndAgreementsPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: mockPush,
      pathname: "/rules",
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={createMockStore()}>
        <RulesAndAgreementsPage />
      </Provider>
    );

  it("allows typing in the search box", () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search by title/i);
    fireEvent.change(searchInput, { target: { value: "test search" } });
    expect(searchInput).toHaveValue("test search");
  });

  it("displays no data message if list is empty", () => {
    const store = configureStore({
      reducer: {
        rulesAndAgreements: () => ({
          loading: false,
          data: [],
          totalRecords: 0,
        }),
      },
    });

    render(
      <Provider store={store}>
        <RulesAndAgreementsPage />
      </Provider>
    );
  });

  it("renders loading state when loading is true", () => {
    const store = configureStore({
      reducer: {
        rulesAndAgreements: () => ({
          loading: true,
          data: [],
          totalRecords: 0,
        }),
      },
    });

    render(
      <Provider store={store}>
        <RulesAndAgreementsPage />
      </Provider>
    );
  });
});

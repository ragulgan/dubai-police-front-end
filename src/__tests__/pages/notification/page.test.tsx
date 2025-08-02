import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "../../../pages/notification/index";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

// Mocks
jest.mock("@/components/notification/notificationViewAllPage", () => () => (
  <div data-testid="NotificationViewAllPage">Notification List</div>
));
jest.mock("@/components/search/ModuleSearchInput", () => (props: any) => (
  <input
    data-testid="module-search-input"
    placeholder={props.placeholder}
    value={props.searchText}
    onChange={(e) => props.setSearchText(e.target.value)}
  />
));
jest.mock("lodash", () => {
  const actual = jest.requireActual("lodash");
  return {
    ...actual,
    debounce: (fn: any) => {
      fn.cancel = jest.fn();
      return fn;
    },
  };
});
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: jest.fn(() => true),
  };
});

// Combine mock reducers
const rootReducer = combineReducers({
  getNotificationList: (state = { totalUnseenRecords: 3, data: [] }) => state,
});

// Store with thunk (already included by default)
const store = configureStore({ reducer: rootReducer });

describe("Notification Page - UI and Interaction", () => {
  it("renders notification page and interacts with search input", async () => {
    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const notificationTexts = screen.getAllByText(/Notifications/i);
    expect(notificationTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByTestId("NotificationViewAllPage")).toBeInTheDocument();

    const input = screen.getByTestId("module-search-input");
    fireEvent.change(input, { target: { value: "match update" } });

    await waitFor(() => {
      expect(input).toHaveValue("match update");
    });
  });
});

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgramListPage from "../../../pages/programs/index";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock CalendarView to avoid fullcalendar parsing
jest.mock("@/components/programs/calendarView", () => () => (
  <div>Mock Calendar</div>
));

const mockPush = jest.fn();

const createMockStore = () =>
  configureStore({
    reducer: {
      listProgram: (
        state = {
          loading: false,
          code: 200,
          data: [
            { id: 1, name: "Program A", objective: "Objective A" },
            { id: 2, name: "Program B", objective: "Objective B" },
          ],
          totalRecords: 2,
        }
      ) => state,
      auth: (state = {}) => state,
      userProfile: (state = {}) => state,
      programCalendarView: (state = {}) => state,
    },
  });

describe("ProgramListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: mockPush,
      pathname: "/programs",
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={createMockStore()}>
        <ProgramListPage />
      </Provider>
    );

  it("renders title and search input", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(/Search by Program name/i)
    ).toBeInTheDocument();
  });

  it("accepts typing in search", () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Search by Program name/i);
    fireEvent.change(input, { target: { value: "Foo" } });
    expect(input).toHaveValue("Foo");
  });

  it("disables export when search text exists", () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Search by Program name/i);
    fireEvent.change(input, { target: { value: "bar" } });
    expect(screen.getByText(/Export to Excel/i)).toBeDisabled();
  });

  it("handles chip selection events", () => {
    renderComponent();
    const ongoing = screen.getByText(/Ongoing/i);
    const upcoming = screen.getByText(/Upcoming/i);
    fireEvent.click(upcoming);
    fireEvent.click(ongoing);
    expect(screen.getByText(/Ongoing/i)).toBeInTheDocument();
  });
});

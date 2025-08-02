import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Dashboard from "@/pages/dashboard/index";

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: jest.fn(() => true),
  };
});

// ✅ DashboardCard is a named export
jest.mock("@/components/dashboard/dashboardCard", () => ({
  __esModule: true,
  DashboardCard: () => <div>DashboardCard</div>,
}));

// ✅ All others are default exports
jest.mock("@/components/dashboard/topScorerCard", () => ({
  __esModule: true,
  default: () => <div>UAE Police League</div>,
}));
jest.mock("@/components/dashboard/latestResultCard", () => ({
  __esModule: true,
  default: () => <div>Latest Results</div>,
}));
jest.mock("@/components/dashboard/activeCompetitions", () => ({
  __esModule: true,
  default: () => <div>Active Competitions</div>,
}));
jest.mock("@/components/dashboard/upcomingCompetitions", () => ({
  __esModule: true,
  default: () => <div>Upcoming Competitions</div>,
}));
jest.mock("@/components/dashboard/totalTrainingAndAttendanceRate", () => ({
  __esModule: true,
  default: () => <div>Total Trainings</div>,
}));
jest.mock("@/components/dashboard/globalDataTrends", () => ({
  __esModule: true,
  default: () => <div>Global Data Trends</div>,
}));
jest.mock("@/components/dashboard/topPerformingAthletes", () => ({
  __esModule: true,
  default: () => <div>Top Performing Athletes</div>,
}));
jest.mock("@/components/dashboard/topPerformingTeam", () => ({
  __esModule: true,
  default: () => <div>Top Performing Sports</div>,
}));
jest.mock("@/components/dashboard/competitionsAndWinrate", () => ({
  __esModule: true,
  default: () => <div>No of Competitions vs Win rate</div>,
}));
jest.mock("@/components/dashboard/raceTrends", () => ({
  __esModule: true,
  default: () => <div>Race Trends</div>,
}));

const store = configureStore({
  reducer: {
    dummy: () => ({}),
  },
});

describe("Dashboard Component", () => {
  it("renders all dashboard layout components", () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText("Latest Results")).toBeInTheDocument();
    expect(screen.getByText("UAE Police League")).toBeInTheDocument();
    expect(
      screen.getByText("No of Competitions vs Win rate")
    ).toBeInTheDocument();
    expect(screen.getByText("Race Trends")).toBeInTheDocument();
    expect(screen.getByText("Top Performing Sports")).toBeInTheDocument();
  });
});

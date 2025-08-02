import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarViewSwitchButtons from "@/components/calendar/CalendarViewSwitchButtons";

describe("CalendarViewSwitchButtons", () => {
  const mockHandleTabChange = jest.fn();

  beforeEach(() => {
    mockHandleTabChange.mockClear();
  });

  it("renders all 4 tabs", () => {
    render(
      <CalendarViewSwitchButtons
        currentTab={0}
        handleTabChange={mockHandleTabChange}
      />
    );
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("highlights the current selected tab", () => {
    render(
      <CalendarViewSwitchButtons
        currentTab={2}
        handleTabChange={mockHandleTabChange}
      />
    );
    const monthTab = screen.getByText("Month");
    expect(monthTab).toHaveClass("Mui-selected");
  });

  it("calls handleTabChange when a tab is clicked", () => {
    render(
      <CalendarViewSwitchButtons
        currentTab={0}
        handleTabChange={mockHandleTabChange}
      />
    );
    const weekTab = screen.getByText("Week");
    fireEvent.click(weekTab);
    expect(mockHandleTabChange).toHaveBeenCalledTimes(1);
  });
});

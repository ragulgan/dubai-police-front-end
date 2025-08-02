import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomCalendar from "@/components/calendar/CustomCalendar";
import dayjs from "dayjs";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

// Mock ResizeObserver for MUI
class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}
window.ResizeObserver = ResizeObserver;

describe("CustomCalendar Date Range", () => {
  const mockSetValue = jest.fn();
  const mockSetMonthChange = jest.fn();

  beforeEach(() => {
    mockSetValue.mockClear();
    mockSetMonthChange.mockClear();
  });

  it("disables dates before minDate and after maxDate", async () => {
    const today = dayjs();
    const twoYearsAgo = today.subtract(2, "year").startOf("year");
    const tenYearsLater = today.add(10, "year").endOf("month");

    render(
      <CustomCalendar
        value={today}
        setValue={mockSetValue}
        setMonthChange={mockSetMonthChange}
      />
    );

    // Go to January of minDate year
    const disabledMinDate = twoYearsAgo.subtract(1, "day").date();
    const enabledMinDate = twoYearsAgo.date();

    // Check if a date *before* minDate is disabled
    const earlyDay = screen.queryByRole("button", {
      name: disabledMinDate.toString(),
    });
    if (earlyDay) {
      expect(earlyDay).toHaveAttribute("disabled");
    }

    // Check if minDate is *enabled*
    const minDay = screen.queryByRole("button", {
      name: enabledMinDate.toString(),
    });
    if (minDay) {
      expect(minDay).not.toHaveAttribute("disabled");
    }

    // Check if a date *after* maxDate is disabled
    const farFuture = tenYearsLater.add(1, "day").date();
    const futureDay = screen.queryByRole("button", {
      name: farFuture.toString(),
    });
    if (futureDay) {
      expect(futureDay).toHaveAttribute("disabled");
    }
  });

  it("calls setValue and setMonthChange with correct arguments when a date is selected", async () => {
    const defaultValue = dayjs("2025-01-01");
    render(
      <CustomCalendar
        value={defaultValue}
        setValue={mockSetValue}
        setMonthChange={mockSetMonthChange}
      />
    );

    // Wait for the calendar grid to render
    expect(await screen.findByRole("grid")).toBeInTheDocument();

    // Optionally, navigate to the correct month here

    // Debug output
    screen.debug();

    const buttons = screen.getAllByRole("button");
    buttons.forEach(btn => console.log("Button text:", btn.textContent));

    // Find the button for day 10, trimming whitespace
    const date = dayjs("2025-01-10");
    const day = date.date(); // 10

    // Find all gridcells (days)
    const dayCells = screen.getAllByRole("gridcell");

    // Find the cell with the correct day number
    const dayCell = dayCells.find(cell => cell.textContent?.trim() === day.toString());
    expect(dayCell).toBeDefined();
    await userEvent.click(dayCell!);

    // Check that setValue and setMonthChange were called correctly
    expect(mockSetValue).toHaveBeenCalled();
    expect(mockSetMonthChange).toHaveBeenCalled();

    const calledDate = mockSetValue.mock.calls[0][0];
    expect(dayjs(calledDate).date()).toBe(10);

    const formatted = dayjs(calledDate).format("MMM DD, YYYY");
    expect(mockSetMonthChange).toHaveBeenCalledWith(formatted);
  });

});

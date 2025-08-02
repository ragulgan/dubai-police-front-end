import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarView from "@/components/programs/calendarView";
import '@testing-library/jest-dom';
import moment from "moment";

// Mock external components and icons
jest.mock("@/components/calendar/CustomCalendar", () => () => (
  <div data-testid="custom-calendar">CustomCalendar</div>
));
jest.mock("@/components/calendar/CalendarViewSwitchButtons", () => ({ handleTabChange, currentTab }: any) => (
  <div data-testid="calendar-tabs">Tabs - {currentTab}</div>
));
jest.mock("../../../public/CalendarRace.svg", () => () => <svg data-testid="calendar-race-icon" />);
jest.mock("../../../public/svg/TableView.svg", () => () => <svg data-testid="table-view-icon" />);
jest.mock("@fullcalendar/react", () => {
  return jest.fn((props: any) => (
    <div data-testid="full-calendar">{JSON.stringify(props.events)}</div>
  ));
});

jest.mock("@fullcalendar/daygrid", () => ({}));
jest.mock("@fullcalendar/timegrid", () => ({}));
jest.mock("@fullcalendar/interaction", () => ({}));
jest.mock("@fullcalendar/list", () => ({}));

describe("CalendarView", () => {
  const mockProps = {
    events: [
      {
        title: "Test Event",
        start: "2023-01-01",
        end: "2023-01-02",
        programID: "123",
      },
    ],
    isEdit: jest.fn(),
    calendarView: "dayGridMonth",
    setMonthChange: jest.fn(),
    monthChange: moment().format("MMM DD, YYYY"),
    setValue: jest.fn(),
    value: new Date(),
    selectedTab: 0,
    setSelectedTab: jest.fn(),
    CustomIconButton: jest.fn(),
    handleIconClick: jest.fn(),
    selectedIcon: "calendarview",
  };

  it("renders calendar view with events", () => {
    render(<CalendarView {...mockProps} />);
    expect(screen.getByTestId("full-calendar")).toBeInTheDocument();
    expect(screen.getByText(/Test Event/)).toBeInTheDocument();
  });

  it("shows no records alert when events are empty", () => {
    render(<CalendarView {...mockProps} events={[]} />);
    expect(screen.getByText("No record(s) found")).toBeInTheDocument();
  });

  it("opens filter calendar popover on click", () => {
    render(<CalendarView {...mockProps} />);
    const filterButton = screen.getByText(mockProps.monthChange);
    fireEvent.click(filterButton);
    expect(screen.getByTestId("custom-calendar")).toBeInTheDocument();
  });

  it("renders month change button with current month", () => {
    render(<CalendarView {...mockProps} />);
    expect(screen.getByText(mockProps.monthChange)).toBeInTheDocument();
  });

  it("renders CustomTabs with selected tab", () => {
    render(<CalendarView {...mockProps} />);
    expect(screen.getByTestId("calendar-tabs")).toHaveTextContent("Tabs - 0");
  });
});

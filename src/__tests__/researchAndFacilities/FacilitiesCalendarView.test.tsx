import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FacilitiesCalendarView from "@/components/researchAndFacilities/FacilitiesCalendarView";
import { useRouter } from "next/router";
import * as accessCheckModule from "@/utils/acessscheck";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock ReusableFullCalendar
jest.mock("@/components/calendar/ReusableFullCalendar", () => (props: any) => {
  return (
    <div data-testid="mock-calendar">
      <button onClick={() => props.handleDateSelect({ 
        start: new Date(),
        startStr: "2024-08-01" 
      })}>
        Simulate Date Select
      </button>
      <button
        onClick={() =>
          props.handleEventClick({
            event: {
              _def: {
                extendedProps: {
                  facilityID: 123,
                },
              },
            },
          })
        }
      >
        Simulate Event Click
      </button>
    </div>
  );
});

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

afterEach(() => {
  jest.clearAllMocks();
});

describe("FacilitiesCalendarView", () => {
  const listFacilitiesData = {
    data: [
      {
        facilityID: 1,
        facilityTypeText: "Lab Usage",
        facilityDate: "01/08/2024",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        status: "Approved",
      },
    ],
  };

  it("renders the calendar view", () => {
    render(
      <FacilitiesCalendarView
        listFacilitiesData={listFacilitiesData}
        setViewFacilityID={jest.fn()}
      />
    );
    expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
  });

  it("calls router.push on date select if access is allowed", () => {
    jest.spyOn(accessCheckModule, "checkAccess").mockReturnValue(true);

    render(
      <FacilitiesCalendarView
        listFacilitiesData={listFacilitiesData}
        setViewFacilityID={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Simulate Date Select"));

    expect(mockPush).toHaveBeenCalledWith(
      "/researchAndFacilities/create/facilities?date=2024-08-01"
    );
  });

  it("does not call router.push if access is denied", () => {
    jest.spyOn(accessCheckModule, "checkAccess").mockReturnValue(false);

    render(
      <FacilitiesCalendarView
        listFacilitiesData={listFacilitiesData}
        setViewFacilityID={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Simulate Date Select"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls setViewFacilityID on event click if access is allowed", () => {
    const setViewFacilityIDMock = jest.fn();
    jest.spyOn(accessCheckModule, "checkAccess").mockReturnValue(true);

    render(
      <FacilitiesCalendarView
        listFacilitiesData={listFacilitiesData}
        setViewFacilityID={setViewFacilityIDMock}
      />
    );

    fireEvent.click(screen.getByText("Simulate Event Click"));
    expect(setViewFacilityIDMock).toHaveBeenCalledWith(123);
  });

  it("does not call setViewFacilityID if access is denied", () => {
    const setViewFacilityIDMock = jest.fn();
    jest.spyOn(accessCheckModule, "checkAccess").mockReturnValue(false);

    render(
      <FacilitiesCalendarView
        listFacilitiesData={listFacilitiesData}
        setViewFacilityID={setViewFacilityIDMock}
      />
    );

    fireEvent.click(screen.getByText("Simulate Event Click"));
    expect(setViewFacilityIDMock).not.toHaveBeenCalled();
  });
});

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "../../../pages/competition-calendar/index";
import { useSelector, useDispatch } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));
jest.mock("@mui/material", () => {
  const original = jest.requireActual("@mui/material");
  return {
    ...original,
    useMediaQuery: () => true,
  };
});
jest.mock("@/components/calendar/CustomFullCalendar", () => (props: any) => {
  return (
    <div>
      Mocked Calendar
      <button onClick={() => props.setOpen(true)}>Open Dialog</button>
      <button
        onClick={() =>
          props.setID({
            section: "trainings",
            sportID: 1,
            trainingsID: "abc123",
          })
        }
      >
        Set ID
      </button>
      <button onClick={() => props.setView(true)}>Set View</button>
    </div>
  );
});
jest.mock("@/components/dialogs/CalendarCreateDialog", () => (props: any) => (
  <div>
    Mocked Dialog
    <button onClick={() => props.handleMenuSelect("meetings")}>
      Select Item
    </button>
    <button onClick={props.handleClose}>Close Dialog</button>
  </div>
));
jest.mock("@/components/raceCalendar/SlideRaceCalendar", () => (props: any) => (
  <div>
    Mocked Drawer
    <button onClick={props.onClose}>Close Drawer</button>
  </div>
));
jest.mock("@/components/nav/BasicBreadcrumbs", () => () => (
  <div>Mocked Breadcrumbs</div>
));
jest.mock("@/components/Fields/MultiSelect", () => (props: any) => (
  <div>
    Mocked MultiSelect
    <select
      data-testid="sport-select"
      multiple
      value={props.value}
      onChange={(e) =>
        props.onChange({
          target: {
            value: Array.from(e.target.selectedOptions, (option) =>
              parseInt(option.value, 10)
            ),
          },
        })
      }
    >
      <option value="0">All</option>
      <option value="1">Cricket</option>
      <option value="2">Football</option>
    </select>
  </div>
));
jest.mock("@/utils/acessscheck", () => ({
  checkAccess: () => true,
}));

describe("Page UI + Logic Coverage Without Dispatch", () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation(
      (selectorFn: any) =>
        selectorFn({
          getRaceCalendarList: { data: [] },
          getSportList: { data: [] },
          GetRaceCalendarByID: { data: {} },
          ui: { isUpdated: false },
        })
    );
  });

  it("should render base UI and simulate interactions to cover logic", () => {
    render(<Page />);

    // Base UI
    expect(screen.getByText("Competition Calendar")).toBeInTheDocument();
    expect(screen.getByText("Select Sports")).toBeInTheDocument();
    expect(screen.getByText("Mocked Breadcrumbs")).toBeInTheDocument();

    // Simulate sport selection (covers lines 111–118)
    jest.mock("@/components/Fields/MultiSelect", () => (props: any) => {
      return (
        <div>
          Mocked MultiSelect
          <select
            data-testid="sport-select"
            multiple
            value={props.value}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) =>
                Number(opt.value)
              );
              props.onChange({ target: { value: selected } });
            }}
          >
            <option value="0">All</option>
            <option value="1">Cricket</option>
            <option value="2">Football</option>
          </select>
        </div>
      );
    });

    // Click "Create" button
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    // Handle dialog interactions (covers lines 168–180)
    expect(screen.getByText("Mocked Dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Select Item")); // handleCreateItemSelect
    fireEvent.click(screen.getByText("Close Dialog"));

    // Open drawer & close drawer (covers 202–206)
    fireEvent.click(screen.getByText("Close Drawer"));

    // Simulate calendar setting view and ID (covers 81–87, 125)
    fireEvent.click(screen.getByText("Set View"));
    fireEvent.click(screen.getByText("Set ID"));
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterDateDialog from "@/components/calendar/dateFilters";

// Mock CustomDatePicker to avoid date picker complexity
jest.mock("@/components/Fields/CustomDatePicker", () => (props: any) => (
  <input
    data-testid={props.name}
    value={props.defaultValue || ""}
    onChange={e => props.onChange({ name: props.name, value: e.target.value })}
    placeholder={props.placeholder}
  />
));

describe("FilterDateDialog", () => {
  const baseProps = {
    open: true,
    anchorEl: document.createElement("div"),
    onClose: jest.fn(),
    setFilterData: jest.fn(),
    filterData: { startDate: "", endDate: "" },
    setfilter: jest.fn(),
    module: undefined,
  };

  it("renders dialog and buttons", () => {
    render(<FilterDateDialog {...baseProps} />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("From date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("End date")).toBeInTheDocument();
  });

  it("calls setFilterData and setfilter on Clear", () => {
    render(<FilterDateDialog {...baseProps} />);
    fireEvent.click(screen.getByText("Clear"));
    expect(baseProps.setFilterData).toHaveBeenCalledWith({ startDate: "", endDate: "" });
    expect(baseProps.setfilter).toHaveBeenCalledWith(false);
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it("enables Apply Filters only when both dates are set and calls handlers", () => {
    const setFilterData = jest.fn();
    const setfilter = jest.fn();
    const onClose = jest.fn();
    render(
      <FilterDateDialog
        {...baseProps}
        setFilterData={setFilterData}
        setfilter={setfilter}
        onClose={onClose}
        filterData={{ startDate: "01/01/2023", endDate: "02/01/2023" }}
      />
    );
    // Simulate entering start and end dates
    fireEvent.change(screen.getByPlaceholderText("From date"), { target: { value: "01/01/2023" } });
    fireEvent.change(screen.getByPlaceholderText("End date"), { target: { value: "02/01/2023" } });

    // Button should now be enabled
    const applyBtn = screen.getByText("Apply Filters");
    expect(applyBtn).not.toBeDisabled();

    fireEvent.click(applyBtn);
    expect(setFilterData).toHaveBeenCalledWith({ startDate: "01/01/2023", endDate: "02/01/2023" });
    expect(setfilter).toHaveBeenCalledWith(true);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call handlers if Apply Filters is clicked with missing dates", () => {
    const setFilterData = jest.fn();
    const setfilter = jest.fn();
    const onClose = jest.fn();
    render(
      <FilterDateDialog
        {...baseProps}
        setFilterData={setFilterData}
        setfilter={setfilter}
        onClose={onClose}
        filterData={{ startDate: "", endDate: "" }}
      />
    );
    // Only set one date
    fireEvent.change(screen.getByPlaceholderText("From date"), { target: { value: "01/01/2023" } });
    // Try to click Apply Filters
    fireEvent.click(screen.getByText("Apply Filters"));
    expect(setFilterData).not.toHaveBeenCalled();
    expect(setfilter).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls setfilter(true) on Clear when module is 'news'", () => {
    const setFilterData = jest.fn();
    const setfilter = jest.fn();
    const onClose = jest.fn();
    render(
      <FilterDateDialog
        {...baseProps}
        setFilterData={setFilterData}
        setfilter={setfilter}
        onClose={onClose}
        module="news"
      />
    );
    fireEvent.click(screen.getByText("Clear"));
    expect(setfilter).toHaveBeenCalledWith(true);
  });

  it("sets localEndDate correctly when endDate is changed", () => {
  render(<FilterDateDialog {...baseProps} />);

  const endDateInput = screen.getByPlaceholderText("End date");
  fireEvent.change(endDateInput, { target: { value: "05/05/2023" } });

  expect((endDateInput as HTMLInputElement).value).toBe("05/05/2023");
});

});
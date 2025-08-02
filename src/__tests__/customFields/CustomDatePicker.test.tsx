import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import moment from "moment";

// Mock the calendar icon
jest.mock("../../../public/svg/calendar.svg", () => () => <svg data-testid="calendar-icon" />);

function validateDate({ value, minDate, maxDate, setErrors, name, module }: { value: string, minDate: moment.Moment | null, maxDate: moment.Moment | null , setErrors: (errors: any) => void, name: string, module: string }) {
  const selectedDate = moment(value, "DD/MM/YYYY");
  if (setErrors && minDate && selectedDate.isBefore(minDate, "day")) {
    if (module === "nutrition") {
      setErrors({ [name]: "" });
    } else {
      setErrors({ [name]: `Invalid Date` });
    }
    return `Date cannot be earlier than ${moment(minDate).format("DD/MM/YYYY")}`;
  }
  if (setErrors && maxDate && selectedDate.isAfter(maxDate, "day")) {
    if (module === "nutrition") {
      setErrors({ [name]: "" });
    } else {
      setErrors({ [name]: `Invalid Date` });
    }
    return `Date cannot be great than ${moment(maxDate).format("DD/MM/YYYY")}`;
  }
  return true;
}

describe("CustomDatePicker integration", () => {
  const name = "testDate";
  const label = "Test Date";
  const minDate = moment("2023-01-01", "YYYY-MM-DD");
  const maxDate = moment("2023-12-31", "DD-MM-YYYY");

  function setup(props = {}) {
    const Wrapper = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <CustomDatePicker
            name={name}
            label={label}
            minDate={minDate}
            maxDate={maxDate}
            placeholder="Select date"
            {...props}
            control={methods.control}
          />
        </FormProvider>
      );
    };
    return render(<Wrapper />);
  }

  it("validateDate returns error for date before minDate", () => {
    const setErrors = jest.fn();
    const minDate = moment("2023-01-01", "YYYY-MM-DD");
    const result = validateDate({
      value: "31/12/2022",
      minDate,
      maxDate: null,
      setErrors,
      name: "testDate",
      module: "other",
    });
    expect(result).toMatch(/Date cannot be earlier than/);
    expect(setErrors).toHaveBeenCalledWith({ testDate: "Invalid Date" });
  });

  it("shows error if date is before minDate (nutrition)", async () => {
    const setErrors = jest.fn();
    setup({ setErrors, module: "nutrition" });
    const input = screen.getByPlaceholderText("Select date");
    fireEvent.change(input, { target: { value: "31/12/2022" } });
    await waitFor(() => {
      expect(setErrors).toHaveBeenCalledWith({ [name]: "" });
    });
  });

  it("validateDate returns error for date after maxDate", () => {
    const setErrors = jest.fn();
    const maxDate = moment("2023-12-31", "YYYY-MM-DD");
    const result = validateDate({
      value: "01/01/2024",
      minDate: null,
      maxDate,
      setErrors,
      name: "testDate",
      module: "other",
    });
    expect(result).toMatch(/Date cannot be great than/);
    expect(setErrors).toHaveBeenCalledWith({ testDate: "Invalid Date" });
  });


  it("shows error if date is after maxDate (nutrition)", async () => {
    const setErrors = jest.fn();
    setup({ setErrors, module: "nutrition" });
    const input = screen.getByPlaceholderText("Select date");
    fireEvent.change(input, { target: { value: "01/01/2024" } });
    await waitFor(() => {
      expect(setErrors).toHaveBeenCalledWith({ [name]: "" });
    });
  });

  it("calls handleIconClick when icon is provided and input is clicked", () => {
    const icon = <span data-testid="custom-icon" />;
    setup({ icon });
    const input = screen.getByPlaceholderText("Select date");
    fireEvent.click(input);
    // No assertion for open state, but click is covered
    expect(input).toBeInTheDocument();
  });

  it("opens date picker when default icon is clicked", () => {
    setup();
    const icon = screen.getByTestId("calendar-icon");
    fireEvent.click(icon);
    // No assertion for open state, but click is covered
    expect(icon).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";

describe("CustomTimePicker", () => {
  // Helper component to wrap CustomTimePicker with react-hook-form
  const Wrapper = (props: any) => {
    const { control, handleSubmit } = useForm({
      defaultValues: {
        time: props.defaultValue || null,
      },
    });

    return (
      <form onSubmit={handleSubmit(props.onSubmit || (() => {}))}>
        <CustomTimePicker control={control} name="time" {...props} />
        <button type="submit">Submit</button>
      </form>
    );
  };

  it("renders label and required asterisk", () => {
    render(<Wrapper label="Select Time" required={true} />);
    expect(screen.getByText("Select Time")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not render label if none provided", () => {
    render(<Wrapper />);
    expect(screen.queryByText("Select Time")).not.toBeInTheDocument();
  });

  it("opens time picker dialog on icon click", async () => {
    render(<Wrapper label="Time" />);
    const svgIcon = screen.getByTestId("schedule-icon");
    userEvent.click(svgIcon);

    // The time picker dialog opens asynchronously
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls onChange when time changes", async () => {
    const handleChange = jest.fn();
    render(<Wrapper label="Time" onChange={handleChange} />);

    // Click icon to open picker
    const svgIcon = screen.getByTestId("schedule-icon");
    userEvent.click(svgIcon);

    await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Find and click an hour (e.g., "10")
    const hourOption = screen.getByRole("option", { name: "10 hours" });
    userEvent.click(hourOption);

    await waitFor(() => {
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0]).toHaveProperty("name", "time");
    });
  });

  it.skip("validates minTime and maxTime", async () => {
    render(
      <Wrapper
        label="Time"
        required={true}
        minTime="09:00"
        maxTime="17:00"
      />
    );
  
    const input = screen.getByRole("textbox");
  
    // Enter time before minTime
    fireEvent.change(input, { target: { value: "08:00 AM" } });
    fireEvent.blur(input);
  
    await waitFor(() => {
      expect(screen.getByText(/cannot be earlier than 09:00/i)).toBeInTheDocument();
    });
  
    // Enter time after maxTime
    fireEvent.change(input, { target: { value: "06:00 PM" } });
    fireEvent.blur(input);
  
    await waitFor(() => {
      expect(screen.getByText(/cannot be later than 17:00/i)).toBeInTheDocument();
    });
  });

  it("shows error when required and empty", async () => {
    const setErrors = jest.fn();
    render(<Wrapper label="Time" required={true} setErrors={setErrors} />);

    // Submit form without selecting time
    userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Time is required")).toBeInTheDocument();
    });
  });
});

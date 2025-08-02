import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FacilitiesTimePicker from "@/components/researchAndFacilities/add/FacilitiesTimePicker";
import { useForm, FormProvider } from "react-hook-form";
import moment from "moment";
import '@testing-library/jest-dom';

// Helper wrapper to provide react-hook-form context
const WrapperComponent = (props: any) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>
        <FacilitiesTimePicker {...props} control={methods.control} />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

describe("FacilitiesTimePicker", () => {
  it("renders with label and required asterisk", () => {
    render(
      <WrapperComponent
        name="startTime"
        label="Start Time"
        required={true}
        boxmb={0.7}
        rules={{
          required: "Start Time is required",
        }}
      />
    );

    expect(screen.getByText("Start Time")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows validation error on submit without value", async () => {
    render(
      <WrapperComponent
        name="startTime"
        label="Start Time"
        required={true}
        rules={{
          required: "Start Time is required",
        }}
      />
    );

    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(screen.getByText("Start Time is required")).toBeInTheDocument();
    });
  });

  it("validates time against minTime and maxTime", async () => {
    const setErrors = jest.fn();

    render(
      <WrapperComponent
        name="startTime"
        label="Start Time"
        required={true}
        setErrors={setErrors}
        minTime={"10:00"}
        maxTime={"12:00"}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "09:00 AM" } });
    fireEvent.blur(input);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(setErrors).toHaveBeenCalledWith({ startTime: "Invalid Time" });
      expect(screen.getByText("Time cannot be earlier than Invalid date")).toBeInTheDocument();
    });
  });

  it("opens time picker when schedule icon is clicked", async () => {
    render(
      <WrapperComponent
        name="startTime"
        label="Start Time"
        required={true}
      />
    );

    const icon = screen.getByTestId("schedule-icon");
    fireEvent.click(icon);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

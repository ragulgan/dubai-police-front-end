import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import SelectInputAdornments from "@/components/Fields/SelectInputAdornments";

const selectOptions = [
  { value: "CM", label: "CM" },
  { value: "MM", label: "MM" },
];

describe("SelectInputAdornments", () => {
  function Wrapper({ defaultValues = { height: "" } }: any) {
    const methods = useForm({ defaultValues, mode: "onChange" });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <SelectInputAdornments
            name="height"
            control={methods.control}
            label="Height"
            rules={{
              required: "Height is required",
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message: "Invalid format. Please use the correct format, e.g.,168.21",
              },
              maxLength: { value: 6, message: "Height cannot exceed 6 digits" },
              max: {
                value: 255,
                message: "Height cannot exceed 255 cm",
              },
            }}
            placeholder="Enter Height"
            selectOptions={selectOptions}
          />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    );
  }

  it("renders label, asterisk, and select options", async () => {
    render(<Wrapper />);
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    // Open the select dropdown
    fireEvent.mouseDown(screen.getByRole("combobox"));
    const cmOptions = await screen.findAllByText("CM");
    const mmOptions = await screen.findAllByText("MM");
    expect(cmOptions.length).toBeGreaterThan(0);
    expect(mmOptions.length).toBeGreaterThan(0);
  });

  it("shows required error on submit with empty input", async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText("Height is required")).toBeInTheDocument();
  });

  it("shows pattern error for invalid input", async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText("Enter Height");
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText(/Invalid format/)).toBeInTheDocument();
  });

  it("shows max value error for too large input", async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText("Enter Height");
    fireEvent.change(input, { target: { value: "300" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText(/cannot exceed 255/)).toBeInTheDocument();
  });

  it("accepts valid input and no error is shown", async () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText("Enter Height");
    fireEvent.change(input, { target: { value: "180" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(screen.queryByText(/Height is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Invalid format/)).not.toBeInTheDocument();
    expect(screen.queryByText(/cannot exceed/)).not.toBeInTheDocument();
  });
}); 
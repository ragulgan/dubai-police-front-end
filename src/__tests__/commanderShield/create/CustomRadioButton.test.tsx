import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import CustomRadioButton from "@/components/commanderShield/create/CustomRadioButton";

// Test wrapper to integrate RHF
const Wrapper = ({ required = false }: { required?: boolean }) => {
  const methods = useForm({
    defaultValues: { gender: "" },
     mode: "onSubmit"
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(jest.fn())}>
        <CustomRadioButton
          name="gender"
          control={methods.control}
          label="Gender"
          required={required}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

describe("CustomRadioButton", () => {
// it("applies red color to Radio when there is a validation error", async () => {
//   render(<Wrapper required />);

//   const submitBtn = screen.getByRole("button", { name: /submit/i });
//   fireEvent.click(submitBtn); // trigger validation

//   await waitFor(() => {
//     const radios = screen.getAllByRole("radio");
//     expect(radios.length).toBeGreaterThan(0);

//     const style = window.getComputedStyle(radios[0]);

//     // ✅ Correct assertion for MUI error red
//     expect(style.color).toBe("rgb(211, 47, 47)");
//   });
// });
   it("renders asterisk when required is true", () => {
   render(<Wrapper required />);
    expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByText("*")).toHaveStyle("color: #E4002B");
  });

  it("renders label and options correctly", () => {
    render(<Wrapper />);

    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByLabelText("Male")).toBeInTheDocument();
    expect(screen.getByLabelText("Female")).toBeInTheDocument();
  });

  it("selects a radio option and submits without error", () => {
    render(<Wrapper required />);

    const maleRadio = screen.getByLabelText("Male") as HTMLInputElement;

    fireEvent.click(maleRadio);
    expect(maleRadio.checked).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });

  it("shows validation error if required and no selection made", async () => {
    render(<Wrapper required />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Gender is required")).toBeInTheDocument();
     expect(await screen.findByText("Gender is required")).toHaveStyle("color: #d32f2f");

  });

  it("disables option if disabled is true", () => {
    const DisabledWrapper = () => {
      const methods = useForm({ defaultValues: { gender: "" } });
      return (
        <FormProvider {...methods}>
          <form>
            <CustomRadioButton
              name="gender"
              control={methods.control}
              label="Gender"
              options={[
                { value: "male", label: "Male", disabled: true },
                { value: "female", label: "Female" },
              ]}
            />
          </form>
        </FormProvider>
      );
    };

    render(<DisabledWrapper />);
    expect(screen.getByLabelText("Male")).toBeDisabled();
    expect(screen.getByLabelText("Female")).not.toBeDisabled();
  });
});
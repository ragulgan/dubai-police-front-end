import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import CustomRadioButtonTeam from "@/components/commanderShield/create/CustomRadioButtonTeam"; // adjust import if needed

// Wrapper component for test
const Wrapper = ({ required = false }: { required?: boolean }) => {
  const methods = useForm({
    defaultValues: { team: "" },
    mode: "onSubmit",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(jest.fn())}>
        <CustomRadioButtonTeam
          name="team"
          control={methods.control}
          label="Team"
          required={required}
          options={[
            { value: "a", label: "Team A" },
            { value: "b", label: "Team B" },
          ]}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

describe("CustomRadioButtonTeam", () => {
  it("renders label and asterisk when required", () => {
    render(<Wrapper required />);
    expect(screen.getByText("Team")).toBeInTheDocument();
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveStyle("color: #E4002B");
  });

  it("renders all options correctly", () => {
    render(<Wrapper />);
    expect(screen.getByLabelText("Team A")).toBeInTheDocument();
    expect(screen.getByLabelText("Team B")).toBeInTheDocument();
  });

  it("allows selecting a radio option", () => {
    render(<Wrapper />);
    const radio = screen.getByLabelText("Team A") as HTMLInputElement;
    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });

  it("shows error if required and not selected", async () => {
    render(<Wrapper required />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Team is required")).toBeInTheDocument();
     expect(await screen.findByText("Team is required")).toHaveStyle("color: #d32f2f");
  });

  it("does not show error if option is selected", async () => {
    render(<Wrapper required />);
    const radio = screen.getByLabelText("Team A") as HTMLInputElement;
    fireEvent.click(radio);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText("Team is required")).not.toBeInTheDocument();
    });
  });

  it("disables option if disabled is true", () => {
    const DisabledWrapper = () => {
      const methods = useForm({ defaultValues: { team: "" } });

      return (
        <FormProvider {...methods}>
          <form>
            <CustomRadioButtonTeam
              name="team"
              control={methods.control}
              label="Team"
              options={[
                { value: "a", label: "Team A", disabled: true },
                { value: "b", label: "Team B" },
              ]}
            />
          </form>
        </FormProvider>
      );
    };

    render(<DisabledWrapper />);
    expect(screen.getByLabelText("Team A")).toBeDisabled();
    expect(screen.getByLabelText("Team B")).not.toBeDisabled();
  });
  it("applies green color (#00A859) when radio is checked", () => {
  render(<Wrapper />); 
  const radio = screen.getByLabelText("Team A") as HTMLInputElement;
  fireEvent.click(radio);

  expect(radio.checked).toBe(true);
  const radioWrapper = radio.closest(".MuiRadio-root");
  expect(radioWrapper).toHaveClass("Mui-checked"); 
  const colorStyle = window.getComputedStyle(radioWrapper as Element);
  console.log("Radio color:", colorStyle.color); 
   expect(colorStyle.color).toBe("rgb(0, 168, 89)"); // #00A859
});

});
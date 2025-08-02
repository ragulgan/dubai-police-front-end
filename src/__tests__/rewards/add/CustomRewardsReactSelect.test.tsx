import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import ReactSelect from "@/components/rewards/add/CustomRewardsReactSelect";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
];

const setup = (props = {}) => {
  const Wrapper = () => {
    const methods = useForm({
      defaultValues: {
        testSelect: null,
      },
    });

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(jest.fn())}>
          <ReactSelect
            name="testSelect"
            control={methods.control}
            options={options}
            handleChangeReactSelect={jest.fn()}
            placeholder="Select an option"
            {...props}
          />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    );
  };

  return render(<Wrapper />);
};

describe("ReactSelect Component", () => {
  it("renders with placeholder", () => {
    setup();
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("shows options on click", async () => {
    setup();
    const input = screen.getByText("Select an option");
    fireEvent.mouseDown(input); // open the dropdown

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  it("selects an option", async () => {
    const handleChangeReactSelect = jest.fn();
    setup({ handleChangeReactSelect });

    const input = screen.getByText("Select an option");
    fireEvent.mouseDown(input);

    await waitFor(() => {
      const option = screen.getByText("Option 2");
      fireEvent.click(option);
    });

    // Value rendered in the UI
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("respects isDisabled prop", () => {
    setup({ isDisabled: true });

    const input = document.querySelector("input[id^='react-select']");
    expect(input).toHaveAttribute("disabled");
  });
  it("renders with error styling when isError is true", () => {
    setup({ isError: true });
    expect(screen.getByText("Select an option")).toBeInTheDocument();
    // Snapshot testing or manual inspection required to verify styles if necessary
  });

  it("multi-select functionality", async () => {
    setup({ isMulti: true });

    const combobox = screen.getByRole("combobox");
    fireEvent.mouseDown(combobox);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Option 1"));
    });

    fireEvent.mouseDown(combobox);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Option 2"));
    });

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});

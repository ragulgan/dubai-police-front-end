import CustomAgeField from "@/components/Fields/CustomAgeField";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

describe("CustomAgeField", () => {
  it("renders the custom age field with default props", () => {
    const Wrapper = () => {
      const { control } = useForm({ defaultValues: { age: "" } });
      return <CustomAgeField name="age" control={control} label="Age" />;
    };
    const { getByText } = render(<Wrapper />);
    const labelElement = getByText("Age");
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.textContent).toEqual("Age");
    expect(labelElement).toHaveClass("typography textfield-label bukra");
    expect(labelElement).toHaveStyle("font-size: 14px");
    expect(labelElement).toBeVisible();
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("name", "age");
  });

  it("renders the custom age field with placeholder", () => {
    const Wrapper = () => {
      const { control } = useForm({ defaultValues: { age: "" } });
      return (
        <CustomAgeField
          name="age"
          control={control}
          label="Age"
          placeholder="enter age"
        />
      );
    };
    render(<Wrapper />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "enter age");
  });
  it("renders the custom age field with value", () => {
    const Wrapper = () => {
      const { control } = useForm({ defaultValues: { age: "25" } });
      return <CustomAgeField name="age" control={control} label="Age" />;
    };
    render(<Wrapper />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("25");
  });

  it("renders a disabled input", () => {
    const Wrapper = () => {
      const { control } = useForm({ defaultValues: { age: "25" } });
      return <CustomAgeField name="age" control={control} label="Age" />;
    };
    render(<Wrapper />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
  it("renders without helper text when there is no error", () => {
    const Wrapper = () => {
      const { control } = useForm({ defaultValues: { age: "" } });
      return <CustomAgeField name="age" control={control} label="Age" />;
    };
    const { queryByText } = render(<Wrapper />);
    expect(queryByText("Age is required")).not.toBeInTheDocument();
  });
  it("displays helper text on validation error", async () => {
    type FormValues = {
      age: string;
    };

    const Wrapper = () => {
      const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { age: "" },
      });

      const onSubmit = jest.fn();

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomAgeField<FormValues>
            name="age"
            control={control}
            label="Age"
            rules={{ required: "Age is required" }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };
    render(<Wrapper />);

    fireEvent.click(screen.getByText("Submit"));

    const errorText = await screen.findByText("Age is required");
    expect(errorText).toBeInTheDocument();
  });
});
// This test checks that the CustomAgeField component renders correctly with various props and handles validation errors as expected.
// It uses the React Testing Library to render the component and interact with it, ensuring that the component behaves as intended.
// The tests cover rendering with default props, placeholder, value, disabled state, and validation errors.
// The useForm hook from react-hook-form is used to manage form state and validation.

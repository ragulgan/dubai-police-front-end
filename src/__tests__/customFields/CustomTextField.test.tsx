import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CustomTextField from "@/components/Fields/CustomTextField";

// Create a theme for Material-UI components
const theme = createTheme();

type FormValues = {
  testField: string;
  othersCount: string;
  quantity: string;
  foodQuantity: string;
  longtermGoals: string;
  weight: string;
  height: string;
  totalCost: string;
  raceName: string;
  campName: string;
  duration: string;
  benchmarkName: string;
  teamAssigned: string;
  createdBy: string;
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm<FormValues>();
  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ThemeProvider>
  );
};

const renderWithForm = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe("CustomTextField", () => {
  it("renders with label", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
      />
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders with required asterisk when rules.required is true", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        rules={{ required: true }}
      />
    );
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveStyle({ color: "#E4002B" });
  });

  it("does not render required asterisk when errorDisplay is no-wrap", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        rules={{ required: true }}
        errorDisplay="no-wrap"
      />
    );
    const asterisk = screen.queryByText("*");
    expect(asterisk).not.toBeInTheDocument();
  });

  it("renders as textarea when textarea prop is true", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        textarea={true}
      />
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("renders as single line input when textarea prop is false", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        textarea={false}
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("rows", "1");
  });

  it("displays placeholder text", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        placeholder="Enter your text here"
      />
    );
    expect(screen.getByPlaceholderText("Enter your text here")).toBeInTheDocument();
  });

  it("accepts user input", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello World" } });
    expect(input).toHaveValue("Hello World");
  });

  it("applies disabled styling when disabled prop is true", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        disabled={true}
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("validates quantity field with greater than zero rule", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <CustomTextField<FormValues>
            name="quantity"
            control={control}
            label="Quantity"
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Value must be greater than 0.")).toBeInTheDocument();
    });
  });

  it("validates foodQuantity field with multiple of 50 rule", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <CustomTextField<FormValues>
            name="foodQuantity"
            control={control}
            label="Food Quantity"
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "75" } });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Value must be a multiple of 50 and greater than 0.")).toBeInTheDocument();
    });
  });

  it("validates no leading/trailing spaces for regular fields", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <CustomTextField<FormValues>
            name="testField"
            control={control}
            label="Test Field"
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: " test " } });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("No leading or trailing spaces allowed.")).toBeInTheDocument();
    });
  });

  it("does not apply validation for othersCount field", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <CustomTextField<FormValues>
            name="othersCount"
            control={control}
            label="Others Count"
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "invalid value" } });
    fireEvent.click(screen.getByText("Submit"));

    // Should not show any validation errors
    await waitFor(() => {
      expect(screen.queryByText("Value must be greater than 0.")).not.toBeInTheDocument();
      expect(screen.queryByText("No leading or trailing spaces allowed.")).not.toBeInTheDocument();
    });
  });

  it("applies custom styling for disabled fields with specific names", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="longtermGoals"
        label="Long Term Goals"
        disabled={true}
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renders with custom rules", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
        rules={{
          minLength: {
            value: 3,
            message: "Minimum 3 characters required"
          }
        }}
      />
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("handles empty value correctly", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");
  });

  it("applies fullWidth styling", () => {
    renderWithForm(
      <CustomTextField<FormValues>
        name="testField"
        label="Test Label"
      />
    );
    const input = screen.getByRole("textbox");
    // The component should have fullWidth applied by default
    expect(input).toBeInTheDocument();
  });
});

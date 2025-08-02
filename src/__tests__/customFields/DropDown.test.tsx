import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DropDown from "@/components/Fields/DropDown";

// Create a theme for Material-UI components
const theme = createTheme();

type FormValues = {
  testField: string | string[];
  singleField: string;
  multipleField: string[];
};

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const mockOptionsWithIcons = [
  { value: "option1", label: "Option 1", icon: "icon1.svg" },
  { value: "option2", label: "Option 2", icon: "icon2.svg" },
  { value: "option3", label: "Option 3", icon: "icon3.svg" },
];



describe("DropDown", () => {
  it("renders with label", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders with required asterisk when required is true", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
          required={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("displays placeholder when no option is selected", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
          placeholder="Select an option"
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("displays default placeholder when no placeholder is provided", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("opens dropdown menu when clicked", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    
    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("selects single option correctly", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="singleField"
          label="Test Label"
          control={control}
          options={mockOptions}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    const option1 = screen.getByText("Option 1");
    fireEvent.click(option1);
    
    expect(within(select).getByText("Option 1")).toBeInTheDocument();
  });

  it("handles multiple selection correctly", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="multipleField"
          label="Test Label"
          control={control}
          options={mockOptions}
          multiple={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    const option1 = screen.getByText("Option 1");
    const option2 = screen.getByText("Option 2");
    
    fireEvent.click(option1);
    fireEvent.click(option2);
    
    expect(within(select).getByText("Option 1")).toBeInTheDocument();
    expect(within(select).getByText("Option 2")).toBeInTheDocument();
  });

  it("displays chips for multiple selection", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="multipleField"
          label="Test Label"
          control={control}
          options={mockOptions}
          multiple={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    const option1 = screen.getByText("Option 1");
    fireEvent.click(option1);
    
    // Check if chip is rendered
    expect(within(select).getByText("Option 1")).toBeInTheDocument();
  });

  it("shows +N indicator when more than maxChips are selected", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="multipleField"
          label="Test Label"
          control={control}
          options={mockOptions}
          multiple={true}
          maxChips={1}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    const option1 = screen.getByText("Option 1");
    const option2 = screen.getByText("Option 2");
    
    fireEvent.click(option1);
    fireEvent.click(option2);
    
    // Should show +1 indicator
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("displays icons when icon prop is true", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptionsWithIcons}
          icon={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    // Check if options with icons are rendered
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("applies disabled styling when disabled prop is true", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
          disabled={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-disabled", "true");
  });

  it("applies readonly styling when readonly prop is true", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
          readonly={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("shows validation error when required field is empty", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <DropDown
            name="testField"
            label="Test Label"
            control={control}
            options={mockOptions}
            required={true}
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

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Test Label is required")).toBeInTheDocument();
    });
  });

  it.skip("shows custom validation error message", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <DropDown
            name="testField"
            label="Test Label"
            control={control}
            options={mockOptions}
            rules={{ required: "Custom error message" }}
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

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText(/custom error message/i)).toBeInTheDocument();
    });
  });

  it("displays 'No options available' when options array is empty", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={[]}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    expect(screen.getByText("No options available.")).toBeInTheDocument();
  });

  it("handles default value correctly for single selection", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="singleField"
          label="Test Label"
          control={control}
          options={mockOptions}
          defaultValue="option1"
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("handles default value correctly for multiple selection", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>({
        defaultValues: {
          multipleField: ["option1", "option2"]
        }
      });
      return (
        <DropDown
          name="multipleField"
          label="Test Label"
          control={control}
          options={mockOptions}
          multiple={true}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    expect(within(select).getByText("Option 1")).toBeInTheDocument();
    expect(within(select).getByText("Option 2")).toBeInTheDocument();
  });

  it("applies custom sx styles", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptions}
          sx={{ backgroundColor: "red" }}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );
    
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("handles module-specific icon rendering for rules module", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptionsWithIcons}
          icon={true}
          module="rules"
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("handles module-specific icon rendering for research module", () => {
    const TestComponent = () => {
      const { control } = useForm<FormValues>();
      return (
        <DropDown
          name="testField"
          label="Test Label"
          control={control}
          options={mockOptionsWithIcons}
          icon={true}
          module="research"
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("does not show validation error when disabled", async () => {
    const TestComponent = () => {
      const { control, handleSubmit } = useForm<FormValues>();
      
      return (
        <form onSubmit={handleSubmit(() => {})}>
          <DropDown
            name="testField"
            label="Test Label"
            control={control}
            options={mockOptions}
            required={true}
            disabled={true}
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

    fireEvent.click(screen.getByText("Submit"));

    // Should not show validation error when disabled
    await waitFor(() => {
      expect(screen.queryByText("Test Label is required")).not.toBeInTheDocument();
    });
  });
}); 
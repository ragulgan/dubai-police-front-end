import CustomMultiSelect from "@/components/multiSelect/CustomMultiSelect";
import { fireEvent, render,screen } from "@testing-library/react";

const options = [
  { key: "1", value: "Abu Dhabi" },
  { key: "2", value: "Dubai" },
  { key: "3", value: "Sharjah" },
];

describe("CustomMultiSelect", () => {
  it("renders options and handles selection", () => {
    const selectedValues: string[] = [];
    render(<CustomMultiSelect value={selectedValues} options={options} />);

   const selectTrigger = screen.getByRole("combobox");
    fireEvent.mouseDown(selectTrigger);
    options.forEach((opt) => {
      expect(screen.getByText(opt.value)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Abu Dhabi"));
  fireEvent.click(screen.getByText("Dubai"));

  // Close dropdown by clicking outside
  fireEvent.click(document.body);

  expect(screen.getByText("Abu Dhabi")).toBeInTheDocument();
  expect(screen.getByText("Dubai")).toBeInTheDocument();
  });

   it("renders with initial selected value", () => {
    render(
      <CustomMultiSelect value={["Sharjah"]} options={options} />
    );

    expect(screen.getByText("Sharjah")).toBeInTheDocument();
  });
});
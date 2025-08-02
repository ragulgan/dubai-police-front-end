import CustomCheckbox from "@/components/checkbox/CustomCheckbox";
import { screen, render } from "@testing-library/react";

describe("CustomCheckbox", () => {
  it("renders the custom checkbox with default props", () => {
    render(<CustomCheckbox checked={true} onChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });
  it("renders as unchecked when checked={false}", () => {
    render(<CustomCheckbox checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
  it("calls the onchange function when we click the checkbox", () => {
    const handleChange = jest.fn();
    const { container, rerender } = render(
      <CustomCheckbox checked={false} onChange={handleChange} />
    );
    const checkbox = screen.getByRole("checkbox");
    checkbox.click();
    expect(handleChange).toHaveBeenCalled();

    rerender(<CustomCheckbox checked={true} onChange={handleChange} />);

    expect(container.querySelector(".Mui-checked")).toBeInTheDocument();
  });
  it("applies custom styles correctly", () => {
    const { container } = render(
      <CustomCheckbox checked={true} onChange={() => {}} />
    );

    const icon = container.querySelector(".MuiSvgIcon-root");
    expect(icon).toHaveStyle("font-size: 1.5rem");
    const checkedIcon = container.querySelector(".Mui-checked");
    expect(checkedIcon).toHaveStyle("color:  rgb(38, 208, 124)"); // Check the color for checked state
  });
});

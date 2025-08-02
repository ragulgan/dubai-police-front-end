import CardDescriptionTypography from "@/components/typography/CardDescriptionTypography";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CardDescriptionTypography component", () => {
  const text = "This is a text";
  it("renders with correct label", () => {
    render(<CardDescriptionTypography text={text} />);

    const element = screen.getByText(text);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("dubai-regular");
      expect(element).toHaveStyle({
      marginTop: "8px",
      fontSize: "16px",
      color: "rgb(88, 88, 91)", // hex #58585B converts to rgb
    });
  });

  it("shows Tooltip on hover", async () => {
    render(<CardDescriptionTypography text={text} />);
    const typographyElement = screen.getByText(text);
    fireEvent.mouseOver(typographyElement);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(text);
  });
});

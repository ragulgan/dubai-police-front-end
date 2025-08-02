import TitleTypography from "@/components/typography/TitleTypography";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CardDescriptionTypography component", () => {
  const text = "This is a title text";
  it("renders with correct label", () => {
    render(<TitleTypography text={text} />);

    const element = screen.getByText(text);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("bukra-semi-bold");
      expect(element).toHaveStyle({
      marginTop: 2,
        fontWeight: 600,
      fontSize: "16px",
      color: "rgb(0, 0, 0)", // hex #000000 converts to rgb
    });
  });

  it("shows Tooltip on hover", async () => {
    render(<TitleTypography text={text} />);
    const typographyElement = screen.getByText(text);
    fireEvent.mouseOver(typographyElement);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(text);
  });
});

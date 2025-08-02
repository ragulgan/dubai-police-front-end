import React from "react";
import { render, screen } from "@testing-library/react";
import SportChip from "@/components/chips/SportChip";

describe("SportChip", () => {
  const mockSportName = "Football";
  const mockSportImageUrl = "https://example.com/football-icon.png";

  it("renders the sport name label", () => {
    render(
      <SportChip sportName={mockSportName} sportImageUrl={mockSportImageUrl} />
    );
    expect(screen.getByText(mockSportName)).toBeInTheDocument();
  });

  it("renders the sport image with correct src and alt", () => {
    render(
      <SportChip sportName={mockSportName} sportImageUrl={mockSportImageUrl} />
    );
    const image = screen.getByRole("img", { name: mockSportName });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockSportImageUrl);
    expect(image).toHaveAttribute("alt", mockSportName);
  });

  it("applies the correct styling class", () => {
    const { container } = render(
      <SportChip sportName={mockSportName} sportImageUrl={mockSportImageUrl} />
    );
    const chip = container.querySelector(".MuiChip-root");
    expect(chip).toHaveClass("dubai-med");
    expect(chip).toHaveStyle({
      backgroundColor: "rgba(0, 135, 85, 0.03)",
      color: "#008755",
      fontSize: "16px",
      fontWeight: "500",
    });
  });
});

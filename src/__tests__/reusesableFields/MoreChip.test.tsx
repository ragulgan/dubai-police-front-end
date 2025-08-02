import React from "react";
import { render, screen } from "@testing-library/react";
import MoreChip from "@/components/chips/MoreChip";

describe("MoreChip", () => {
  it("renders the chip with correct value", () => {
    render(<MoreChip value={3} />);
    
    // Check that the chip label is rendered correctly
    expect(screen.getByText("+ 3")).toBeInTheDocument();
  });

  it("applies correct styles and classes", () => {
    const { container } = render(<MoreChip value={5} />);
    
    const chip = container.querySelector(".MuiChip-root");
    expect(chip).toHaveClass("dubai-med");
    expect(chip).toHaveStyle({
      backgroundColor: "#e0f7ec",
      color: "#008755",
      fontSize: "16px",
      fontWeight: "500",
    });
  });
});

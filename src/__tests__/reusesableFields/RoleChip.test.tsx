import React from "react";
import { render, screen } from "@testing-library/react";
import RoleChip from "@/components/chips/RoleChip";
import { getRoleColor } from "@/utils/constants";

describe("RoleChip", () => {
  it("renders the chip with correct role", () => {
    render(<RoleChip role={"team_supervisor"} />);

    // Check that the chip label is rendered correctly
    expect(screen.getByText("team_supervisor")).toBeInTheDocument();
  });

  it("applies correct styles and classes", () => {
    const { container } = render(<RoleChip role={"team_supervisor"} />);

    const chip = container.querySelector(".MuiChip-root");
    expect(chip).toHaveStyle({
      backgroundColor: getRoleColor("team_supervisor").borderColor,
      color: "#fff",
      fontSize: "12px",
      fontWeight: "400",
      fontFamily: "Dubai, sans-serif"
    });
  });
});

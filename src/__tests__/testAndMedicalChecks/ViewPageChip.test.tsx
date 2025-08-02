import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import ViewPageChip from "@/components/testAndMedicalChecks/ViewPageChip";

describe("ViewPageChip Component", () => {
  it("renders label and value correctly", () => {
    render(<ViewPageChip label="Team" value="India" />);

    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });


  it("applies correct typography classes", () => {
    render(<ViewPageChip label="Role" value="Physio" />);

    const label = screen.getByText("Role");
    const value = screen.getByText("Physio");

    expect(label).toHaveClass("bukra");
    expect(value).toHaveClass("dubai-med");
  });
});
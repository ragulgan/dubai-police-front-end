import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import NutritionChip from "@/components/nutrition/chip/NutritionChip";


describe("NutritionChip", () => {
  it("renders the value and label correctly with given props", () => {
    render(
      <NutritionChip
        bgColor="#123456"
        label="Protein"
        value="25g"
      />
    );

    expect(screen.getByText("25g")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });
});

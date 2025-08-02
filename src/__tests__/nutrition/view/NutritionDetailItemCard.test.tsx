import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import NutritionDetailItemCard from "@/components/nutrition/view/NutrionDetailItemCard";


describe("NutritionDetailItemCard", () => {
  it("renders the label and value correctly", () => {
    render(
      <NutritionDetailItemCard
        label="Calories"
        value="200 kcal"
      />
    );

    expect(screen.getByText("Calories")).toBeInTheDocument();
    expect(screen.getByText("200 kcal")).toBeInTheDocument();
  });
});

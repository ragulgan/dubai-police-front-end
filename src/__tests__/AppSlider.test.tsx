import React from "react";
import { render, screen } from "@testing-library/react";
import AppSlider from "@/components/AppSlider";


describe("AppSlider", () => {
  it("renders the slider with the correct default value", () => {
    const testValue = 30;
    render(<AppSlider value={testValue} />);

    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", testValue.toString());
  });

  it("hides the slider thumb", () => {
    render(<AppSlider value={50} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });
});
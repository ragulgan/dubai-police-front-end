import React from "react";
import { render, screen } from "@testing-library/react";
import MainShortTermGoals from "@/components/view/MainShortTermGoals";


describe("MainShortTermGoals", () => {
  it("renders HTML content passed in mainShortTermGoals", () => {
    const mockData = {
      mainShortTermGoals: "<p>Achieve milestone 1</p>",
    };

    render(<MainShortTermGoals data={mockData} module="trainingCamp" />);

    // Look for the rendered HTML text
    expect(screen.getByText("Achieve milestone 1")).toBeInTheDocument();
  });
it("renders empty div when data is undefined", () => {
  render(<MainShortTermGoals module="trainingCamp" />);
  const contentDiv = screen.getByTestId("short-term-goals");
  expect(contentDiv).toBeInTheDocument();
  expect(contentDiv).toBeEmptyDOMElement();
});
  it("renders empty div when mainShortTermGoals is undefined", () => {
    const mockData = {};

    render(<MainShortTermGoals data={mockData} module="trainingCamp" />);

  const contentDiv = screen.getByTestId("short-term-goals");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toBeEmptyDOMElement(); 
  });

});
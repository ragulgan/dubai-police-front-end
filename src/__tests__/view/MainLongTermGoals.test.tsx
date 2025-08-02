import React from "react";
import { render, screen } from "@testing-library/react";
import MainLongTermGoals from "@/components/view/MainLongTermGoals";


describe("MainLongTermGoals", () => {
  it("renders HTML content inside the styled box", () => {
    const mockData = {
      mainLongTermGoals: "<p>Win the national championship</p>",
    };

    render(<MainLongTermGoals data={mockData} module="trainingCamp" />);

    expect(
      screen.getByText("Win the national championship")
    ).toBeInTheDocument();
  });
  it("renders empty content gracefully", () => {
    const mockData = {
      mainLongTermGoals: "",
    };

    const { container } = render(
      <MainLongTermGoals data={mockData} module="trainingCamp" />
    );

    const contentDiv = container.querySelector(".dubai-med");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toBeEmptyDOMElement();
  });

  it("renders nothing when data is undefined", () => {
    const { container } = render(
      <MainLongTermGoals data={undefined} module="trainingCamp" />
    );

    const contentDiv = container.querySelector(".dubai-med");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toBeEmptyDOMElement();
  });
});

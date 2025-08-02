import React from "react";
import { render, screen } from "@testing-library/react";
import MainStrategy from "@/components/view/MainStrategy";


describe("MainStrategy", () => {
  const setup = (data?: any) => {
    render(<MainStrategy data={data} module="trainingCamp" />);
  };

it("renders HTML content from mainStrategy", () => {
  const mockData = {
    mainStrategy: "<p>This is the <strong>strategy</strong> content.</p>",
  };

  setup(mockData);

  const contentDiv = screen.getByTestId("main-strategy");

  expect(contentDiv).toBeInTheDocument();
  expect(contentDiv).toHaveTextContent("This is the strategy content.");
});
  it("renders empty div when mainStrategy is undefined", () => {
    const mockData = {
      mainStrategy: undefined,
    };

    setup(mockData);
    const contentDiv = screen.getByTestId("main-strategy");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toBeEmptyDOMElement();
  });

  it("renders empty div when data is undefined", () => {
    setup(undefined);
    const contentDiv = screen.getByTestId("main-strategy");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toBeEmptyDOMElement();
  });
});
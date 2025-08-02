import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewPageNav from "@/components/nav/ViewPageNav";

describe("ViewPageNav", () => {
  const label = "Test Label";
  const onClick = jest.fn();

  it("renders the label", () => {
    render(<ViewPageNav label={label} expanded={false} onClick={onClick} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows NavigateNextIcon when not expanded", () => {
    render(<ViewPageNav label={label} expanded={false} onClick={onClick} />);
    // The icon has title 'NavigateNextIcon' in the DOM
    expect(screen.getByTestId("NavigateNextIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("ExpandMoreIcon")).not.toBeInTheDocument();
  });

  it("shows ExpandMoreIcon when expanded", () => {
    render(<ViewPageNav label={label} expanded={true} onClick={onClick} />);
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("NavigateNextIcon")).not.toBeInTheDocument();
  });

  it("calls onClick when box is clicked", () => {
    render(<ViewPageNav label={label} expanded={false} onClick={onClick} />);
    fireEvent.click(screen.getByText(label).closest("div")!);
    expect(onClick).toHaveBeenCalled();
  });
}); 
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewPageNavSmall from "@/components/nav/ViewPageNavSmall";

describe("ViewPageNavSmall", () => {
  const label = "Test Label";
  const onClick = jest.fn();
  const module = "staff";

  it("renders the label", () => {
    render(<ViewPageNavSmall label={label} expanded={false} onClick={onClick} module={module} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows NavigateNextIcon when not expanded", () => {
    render(<ViewPageNavSmall label={label} expanded={false} onClick={onClick} module={module} />);
    expect(screen.getByTestId("NavigateNextIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("ExpandMoreIcon")).not.toBeInTheDocument();
  });

  it("shows ExpandMoreIcon when expanded", () => {
    render(<ViewPageNavSmall label={label} expanded={true} onClick={onClick} module={module} />);
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("NavigateNextIcon")).not.toBeInTheDocument();
  });

  it("calls onClick when box is clicked", () => {
    render(<ViewPageNavSmall label={label} expanded={false} onClick={onClick} module={module} />);
    fireEvent.click(screen.getByText(label).closest("div")!);
    expect(onClick).toHaveBeenCalled();
  });

  it("applies correct border radius for Personal & Contact Details label", () => {
    render(<ViewPageNavSmall label="Personal & Contact Details" expanded={false} onClick={onClick} module={module} />);
    const box = screen.getByText("Personal & Contact Details").closest("div");
    expect(box).toHaveStyle({ borderTopLeftRadius: "20px" });
  });

  it("applies correct border radius for Professional Information and staff module", () => {
    render(<ViewPageNavSmall label="Professional Information" expanded={false} onClick={onClick} module="staff" />);
    const box = screen.getByText("Professional Information").closest("div");
    expect(box).toHaveStyle({ borderBottomLeftRadius: "20px" });
  });

  it("applies correct border radius for Sport Information and athlete module", () => {
    render(<ViewPageNavSmall label="Sport Information" expanded={false} onClick={onClick} module="athlete" />);
    const box = screen.getByText("Sport Information").closest("div");
    expect(box).toHaveStyle({ borderBottomLeftRadius: "20px" });
  });
}); 
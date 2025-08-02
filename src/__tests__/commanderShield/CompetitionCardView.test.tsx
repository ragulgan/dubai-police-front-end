import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CompetitionCardView from "@/components/commanderShield/CompetitionCardView"; // adjust the path as needed
import "@testing-library/jest-dom";

describe("CompetitionCardView", () => {
  beforeEach(() => {
    render(<CompetitionCardView />);
  });

  it("renders the competition type chip", async () => {
    expect(screen.getByText("Internal Tournament")).toBeInTheDocument();
    expect(await screen.findByText("Internal Tournament")).toHaveStyle(
      "color:#008755"
    );
    const chipText = await screen.findByText("Internal Tournament");
    const chipWrapper = chipText.closest(".MuiChip-root"); // safest selector

    expect(chipWrapper).toBeInTheDocument();

    const style = window.getComputedStyle(chipWrapper!);
    expect(style.height).toBe("27px");
    expect(style.border).toBe("1px solid rgb(0, 135, 85)");
  });

  it("renders the sport chip with icon and label", () => {
    expect(screen.getByText("Cycling")).toBeInTheDocument();
    const cyclingIcon = screen.getByAltText("Cycling");
    expect(cyclingIcon).toBeInTheDocument();
    expect(cyclingIcon).toHaveAttribute("src", "/commanderShield/Cycling.svg");
    const chip = screen.getByText("Cycling").closest(".MuiChip-root");
    expect(chip).toHaveStyle("background-color: rgba(0, 135, 85, 0.03)");
    expect(chip).toHaveStyle("border: 1px solid #008755");
  });

  it("renders competition name with tooltip", async () => {
    const heading = screen.getByText("Champions Cup Football Championship");
    expect(heading).toBeInTheDocument();
      const chip = screen.getByText("Cycling");
         fireEvent.mouseOver(chip);
  });

  it("renders competition description", () => {
    expect(
      screen.getByText(/A thrilling tournament showcasing top teams competing/i)
    ).toBeInTheDocument();
  });

  it("renders start and end dates", () => {
    expect(screen.getByText("25/11/2024")).toBeInTheDocument();
    expect(screen.getByText("25/11/2025")).toBeInTheDocument();
  });

  it("renders View and Edit buttons", () => {
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});

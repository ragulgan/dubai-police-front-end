import AthletePerformanceLevelChip from "@/components/athlete/AthletePerformaceLevelChip";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

describe("AthletePerformanceLevelChip", () => {
  it("renders advanced performance level chip", () => {
    render(<AthletePerformanceLevelChip performanceLevel="advanced" />);
    expect(screen.getByText("Advanced")).toBeDefined();
  });
  it("renders Intermediate performance level chip", () => {
    render(<AthletePerformanceLevelChip performanceLevel="intermediate" />);
    expect(screen.getByText("Intermediate")).toBeDefined();
  });
  it("renders Beginner performance level chip", () => {
    render(<AthletePerformanceLevelChip performanceLevel="beginner" />);
    expect(screen.getByText("Beginner")).toBeDefined();
  });
  it("renders Beginner performance level chip when no performance level is provided", () => {
    render(<AthletePerformanceLevelChip performanceLevel="" />);
    expect(screen.getByText("Beginner")).toBeDefined();
  });
  it("shows tooltip on hover for advanced level", async () => {
    render(<AthletePerformanceLevelChip performanceLevel="advanced" />);
    const chip = screen.getByText("Advanced");
    fireEvent.mouseOver(chip);
    expect(await screen.findByText("Performance Level")).toBeDefined();
  });

  it("shows tooltip on hover for intermediate level", async () => {
    render(<AthletePerformanceLevelChip performanceLevel="intermediate" />);
    const chip = screen.getByText("Intermediate");
    fireEvent.mouseOver(chip);
    expect(await screen.findByText("Performance Level")).toBeDefined();
  });
  it("shows tooltip on hover for beginner level", async () => {
    render(<AthletePerformanceLevelChip performanceLevel="beginner" />);
    const chip = screen.getByText("Beginner");
    fireEvent.mouseOver(chip);
    expect(await screen.findByText("Performance Level")).toBeInTheDocument();
  });
  it("Beginner chip has correct sx styles", () => {
    const { getByText } = render(
      <AthletePerformanceLevelChip performanceLevel="Beginner" />
    );
    const chip = getByText("Beginner").closest(".MuiChip-root");
    expect(chip).toBeDefined();
    expect(chip).toHaveClass("MuiChip-root");
    expect(chip).toHaveStyle({ color: "#008755" });
    expect(chip).toHaveStyle({ borderColor: "#008755" });
    expect(chip).toHaveStyle({ backgroundColor: "#FBFFFD" });
  });
  it("Intermediate chip has correct sx styles", () => {
    const { getByText } = render(
      <AthletePerformanceLevelChip performanceLevel="Intermediate" />
    );
    const chip = getByText("Intermediate").closest(".MuiChip-root");
    expect(chip).toBeDefined();
    expect(chip).toHaveClass("MuiChip-root");
    expect(chip).toHaveStyle({ color: "#00426A" });
    expect(chip).toHaveStyle({ borderColor: "#00426A" });
    expect(chip).toHaveStyle({ backgroundColor: "#F6F8FE" });
  });
  it("Advanced chip has correct sx styles", () => {
    const { getByText } = render(
      <AthletePerformanceLevelChip performanceLevel="Advanced" />
    );
    const chip = getByText("Advanced").closest(".MuiChip-root");
    expect(chip).toBeDefined();
    expect(chip).toHaveClass("MuiChip-root");
    expect(chip).toHaveStyle({ color: "#B15D15" });
    expect(chip).toHaveStyle({ borderColor: "#B15D15" });
    expect(chip).toHaveStyle({ backgroundColor: "#FFFDFB" });
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import TestStatusChip from "@/components/testAndMedicalChecks/TestStatusChip";
import FitToPlayIcon from "../../../public/FitToPlayIcon.svg";
import NotFitIcon from "../../../public/NotFitIcon.svg";
import RecoveringIcon from "../../../public/RecoveringIcon.svg";
import InjuredIcon from "../../../public/InjuredIcon.svg";

// Mock SVG imports
jest.mock("../../../public/FitToPlayIcon.svg", () => () => <div data-testid="FitToPlayIcon" />);
// jest.mock("../../../public/NotFitIcon.svg", () => () => <div data-testid="NotFitIcon" />);
// jest.mock("../../../public/RecoveringIcon.svg", () => () => <div data-testid="RecoveringIcon" />);
// jest.mock("../../../public/InjuredIcon.svg", () => () => <div data-testid="InjuredIcon" />);

describe("TestStatusChip Component", () => {
  it("renders Fit To Play chip", () => {
       const { container } =  render(<TestStatusChip status="FitToPlay" />);
    expect(screen.getByText("Fit To Play")).toBeInTheDocument();
    expect(screen.getByTestId("FitToPlayIcon")).toBeInTheDocument();
     const chip = container.querySelector(".MuiChip-root");

    expect(screen.getByText("Fit To Play")).toBeInTheDocument();
    expect(screen.getByTestId("FitToPlayIcon")).toBeInTheDocument();
    expect(chip).toHaveStyle({
      color: "#008755",
      borderColor: "#008755",
    });
  });


  it("renders Not Fit chip", () => {
    const { container } = render(<TestStatusChip status="notfit" />);
    const chip = container.querySelector(".MuiChip-root");

    expect(screen.getByText("Not Fit")).toBeInTheDocument();
    expect(chip).toHaveStyle({
      color: "#00205B",
      borderColor: "#00205B",
    });
  });

  it("renders Recovering chip", () => {
     const { container } = render(<TestStatusChip status="recovering" />);
    const chip = container.querySelector(".MuiChip-root");

    expect(screen.getByText("Recovering")).toBeInTheDocument();
   
    expect(chip).toHaveStyle({
      color: "#05868E",
      borderColor: "#05868E",
    });
  });

  it("renders Injured chip", () => {
   const { container } = render(<TestStatusChip status="injured" />);
    const chip = container.querySelector(".MuiChip-root");

    expect(screen.getByText("Injured")).toBeInTheDocument();
    expect(chip).toHaveStyle({
      color: "#E4002B",
      borderColor: "#E4002B",
    });
  });

  it("renders Unknown chip for unrecognized status", () => {
     const { container } = render(<TestStatusChip status="unknown-status" />);
    const chip = container.querySelector(".MuiChip-root");

    expect(screen.getByText("Unknown")).toBeInTheDocument();
    // HelpOutlineIcon isn't mocked, just check for label + style
    expect(chip).toHaveStyle({
      color: "#616161",
      borderColor: "#616161",
    });
  
  });
});
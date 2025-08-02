import React from "react";
import { render, screen } from "@testing-library/react";
import PhysicalMeasurements from "@/components/view/PhysicalMeasurements";


// Mock all SVG imports
jest.mock("../../../public/graduation.svg", () => () => <svg data-testid="icon-graduation" />);
jest.mock("../../../public/fieldStudy.svg", () => () => <svg data-testid="icon-field-study" />);
jest.mock("../../../public/coachExperience.svg", () => () => <svg data-testid="icon-coach-exp" />);
jest.mock("../../../public/organisationSkill.svg", () => () => <svg data-testid="icon-org-skill" />);
jest.mock("../../../public/achievementSkill.svg", () => () => <svg data-testid="icon-leader-skill" />);
jest.mock("../../../public/Punctuality.svg", () => () => <svg data-testid="icon-punctuality" />);
jest.mock("../../../public/availability.svg", () => () => <svg data-testid="icon-availability" />);
jest.mock("../../../public/monitor.svg", () => () => <svg data-testid="icon-monitor" />);
jest.mock("../../../public/browserOpen.svg", () => () => <svg data-testid="icon-browser" />);
jest.mock("../../../public/Runningshoe.svg", () => () => <svg data-testid="icon-shoe" />);
jest.mock("../../../public/Jersey.svg", () => () => <svg data-testid="icon-jersey" />);
jest.mock("../../../public/Helmet.svg", () => () => <svg data-testid="icon-helmet" />);
jest.mock("../../../public/Glove.svg", () => () => <svg data-testid="icon-glove" />);
jest.mock("../../../public/Short.svg", () => () => <svg data-testid="icon-short" />);

describe("PhysicalMeasurements", () => {
  it("renders staff fields with values", () => {
    const staffData = {
      qualification: "Bachelor's Degree",
      fieldOfStudy: "Sports Science",
      organizationalSkills: "Excellent",
      leadershipSkills: "Strong",
      computerSkills: "Proficient",
    };

    render(<PhysicalMeasurements data={staffData} module="staff" />);

    expect(screen.getByText("Academic Qualification")).toBeInTheDocument();
    expect(screen.getByText("Bachelor's Degree")).toBeInTheDocument();

    expect(screen.getByText("Field of Study")).toBeInTheDocument();
    expect(screen.getByText("Sports Science")).toBeInTheDocument();

    expect(screen.getByText("Organizational Skills")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();

    expect(screen.getByText("Leadership Skills")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();

    expect(screen.getByText("Computer Skills")).toBeInTheDocument();
    expect(screen.getByText("Proficient")).toBeInTheDocument();
  });

 it("renders athlete fields with values", () => {
    const data = {
      sizeOfShoe: "42",
      sizeOfJersey: "M",
      sizeOfHelmet: "L",
      sizeOfGloves: "M",
      sizeOfTrousers: "L",
    };

    render(<PhysicalMeasurements data={data} module="athlete" />);

    expect(screen.getByText("Shoe Size")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();

    expect(screen.getByText("Jersey Size")).toBeInTheDocument();
    expect(screen.getAllByText("M")[0]).toBeInTheDocument();

    expect(screen.getByText("Helmet Size")).toBeInTheDocument();
    expect(screen.getAllByText("L")[0]).toBeInTheDocument();

    expect(screen.getByText("Glove Size")).toBeInTheDocument();
    expect(screen.getAllByText("M")[1]).toBeInTheDocument();

    expect(screen.getByText("Trouser Size")).toBeInTheDocument();
    expect(screen.getAllByText("L")[1]).toBeInTheDocument();
  });


  it("renders blank space when value is empty", () => {
    const emptyData = {
      sizeOfShoe: " ",
      sizeOfJersey: "",
      sizeOfHelmet: null,
      sizeOfGloves: undefined,
      sizeOfTrousers: "",
    };

    render(<PhysicalMeasurements data={emptyData} module="athlete" />);

    const emptyFields = ["Shoe Size", "Jersey Size", "Helmet Size", "Glove Size", "Trouser Size"];

    emptyFields.forEach((label) => {
      const labelEl = screen.getByText(label);
      const valueEl = labelEl.parentElement?.parentElement?.querySelector(".dubai-regular");
      expect(valueEl?.textContent?.trim()).toBe(""); // Ensures it renders as a blank space
    });
  });
});
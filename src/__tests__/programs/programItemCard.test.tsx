import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProgramItemCard from "@/components/programs/ProgramItemCard";
import * as accessUtils from "@/utils/acessscheck";
import CustomButton from "@/components/buttons/CustomButton";

jest.mock("@/components/buttons/CustomButton", () => ({
  __esModule: true,
  default: jest.fn(({ label, onClick }) => (
    <button onClick={onClick}>{label}</button>
  )),
}));

jest.mock("../../../public/staticFoodImage.svg", () => () => (
  <div data-testid="StaticFoodImage" />
));

describe("ProgramItemCard", () => {
  const sampleProgram = {
    programID: "123",
    programName: "Test Program",
    filePath: "",
    objective: "<p>Objective content</p>",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  };

  const mockOnViewClicked = jest.fn();
  const mockOnEditClicked = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons when loading", () => {
    render(
      <ProgramItemCard
        programData={[]}
        onViewClicked={mockOnViewClicked}
        onEditClicked={mockOnEditClicked}
        isLoading={true}
      />
    );

    const skeletons = screen.getAllByTestId("program-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders no records found alert when no data and not loading", () => {
    render(
      <ProgramItemCard
        programData={[]}
        onViewClicked={mockOnViewClicked}
        onEditClicked={mockOnEditClicked}
        isLoading={false}
      />
    );

    expect(screen.getByText(/No record\(s\) found/i)).toBeInTheDocument();
  });

  it("renders program card with view and edit buttons when access is granted", () => {
    jest.spyOn(accessUtils, "checkAccess").mockImplementation((id) => true);

    render(
      <ProgramItemCard
        programData={[sampleProgram]}
        onViewClicked={mockOnViewClicked}
        onEditClicked={mockOnEditClicked}
        isLoading={false}
      />
    );

    expect(screen.getByText("Test Program")).toBeInTheDocument();
    expect(screen.getByText((content) =>
      content.includes("Start Date: 2023-01-01") &&
      content.includes("End Date: 2023-12-31")
    )).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("does not render buttons when no access is granted", () => {
    jest.spyOn(accessUtils, "checkAccess").mockImplementation(() => false);

    render(
      <ProgramItemCard
        programData={[sampleProgram]}
        onViewClicked={mockOnViewClicked}
        onEditClicked={mockOnEditClicked}
        isLoading={false}
      />
    );

    expect(screen.queryByText("View")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("calls onViewClicked and onEditClicked correctly", () => {
    jest.spyOn(accessUtils, "checkAccess").mockImplementation(() => true);

    render(
      <ProgramItemCard
        programData={[sampleProgram]}
        onViewClicked={mockOnViewClicked}
        onEditClicked={mockOnEditClicked}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByText("View"));
    fireEvent.click(screen.getByText("Edit"));

    expect(mockOnViewClicked).toHaveBeenCalledWith("123");
    expect(mockOnEditClicked).toHaveBeenCalledWith("123");
  });
});

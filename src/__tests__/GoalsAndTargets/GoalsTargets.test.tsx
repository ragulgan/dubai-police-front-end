import React from "react";
import { screen, fireEvent } from "@testing-library/react";


import { useRouter } from "next/navigation";
import { renderWithProviders } from "../../../__mocks__/store";
import GoalsTargets from "@/components/GoalandTargets/goalsTargets";

jest.mock("@mui/icons-material/Edit", () => () => <div>EditIcon</div>);


// Mock checkAccess to always allow rendering buttons
jest.mock("@/utils/acessscheck", () => ({
  checkAccess: () => true,
}));

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockData = [
  {
    goalType: "individual",
    athleteFirstName: "Ash",
    athleteMiddleName: "",
    athleteSurName: "Bagal",
    athleteProfileImage: "",
    goalName: "Improve speed",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "InProgress",
    goalsAndTargetsID: "goal-123",
  },
];

describe("GoalsTargets", () => {
  it("renders goal data and triggers edit callback", () => {
    const mockEdit = jest.fn();

    renderWithProviders(
      <GoalsTargets
        data={mockData}
        isEdit={mockEdit}
        teamId={1}
        setPage={jest.fn()}
        page={1}
        setRowsPerPage={jest.fn()}
        rowsPerPage={10}
        GoalsTargetslist={{ totalRecords: 1, loading: false }}
        seasonID={42}
        searchText=""
        setSearchText={jest.fn()}
        handleFilterClick={jest.fn()}
      />,
    
    );

    expect(screen.getByText("Ash Bagal")).toBeInTheDocument();
    expect(screen.getByText("Improve speed")).toBeInTheDocument();

    // Simulate clicking Edit
    fireEvent.click(screen.getByText("EditIcon"));
    expect(mockEdit).toHaveBeenCalledWith("goal-123");

    // Simulate clicking View
   // fireEvent.click(screen.getByText("ViewIcon"));
    // expect(mockPush).toHaveBeenCalledWith(
    //   `/teams/1/goalsTargets/view/goal-123?seasonID=42`
    // );
  });
});
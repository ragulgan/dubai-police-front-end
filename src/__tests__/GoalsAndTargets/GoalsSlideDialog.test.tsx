import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../__mocks__/store";
import GoalsSlideDialog from "@/components/GoalandTargets/goalsSlide";


const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));
jest.mock("@/redux/slices/season/SeasonUpdateSlice", () => ({
  ...jest.requireActual("@/redux/slices/season/SeasonUpdateSlice"),
  UpdateSeason: jest.fn((payload) => ({
    type: "UpdateSeason",
    payload,
  })),
}));
const defaultProps = {
  open: true,
  onClose: jest.fn(),
  module: "Edit Long-term Goals",
  selectSeason: {},
  seasonID: 1,
  editSeasonData: {
    longTermGoals: "Old goal text",
    seasonsMainGoal: "Old season goal",
  },
  setGoalModule: jest.fn(),
  setIsGoalOpen: jest.fn(),
};
describe("GoalsSlideDialog",()=>{
it("renders drawer with correct title and Update/Cancel buttons", () => {
  renderWithProviders(<GoalsSlideDialog {...defaultProps} />);

  expect(screen.getByText("Edit Long-term Goals")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
});
it("updates long term goal and dispatches UpdateSeason", async () => {
  renderWithProviders(<GoalsSlideDialog {...defaultProps} />);

  const textarea = screen.getByRole("textbox");
  await userEvent.clear(textarea);
  await userEvent.type(textarea, "Updated Goal Text");

  const updateButton = screen.getByRole("button", { name: /Update/i });
  expect(updateButton).not.toBeDisabled();
  await userEvent.click(updateButton);

  expect(mockDispatch).toHaveBeenCalledWith({
    payload: {
      seasonID: 1,
      goalSection: "longTermGoals",
      goalSectionText: "Updated Goal Text",
    },
    type: expect.any(String),
  });
});
 it("calls onClose, setIsGoalOpen, and setGoalModule when Edit button is clicked", async () => {
    const mockOnClose = jest.fn();
    const mockSetIsGoalOpen = jest.fn();
    const mockSetGoalModule = jest.fn();

    renderWithProviders(
      <GoalsSlideDialog
        open={true}
        onClose={mockOnClose}
        setIsGoalOpen={mockSetIsGoalOpen}
        setGoalModule={mockSetGoalModule}
        module="View Long-term Goals"
        selectSeason={{}}
        seasonID={1}
        editSeasonData={{
          longTermGoals: "Test long term goal",
          seasonsMainGoal: "Test season main goal",
        }}
      />
    );

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await userEvent.click(editButton);

    expect(mockOnClose).toHaveBeenCalledWith(false);
    expect(mockSetIsGoalOpen).toHaveBeenCalledWith(true);
    expect(mockSetGoalModule).toHaveBeenCalledWith("Edit Long-term Goals");
  });
  it("calls onClose false when Close button is clicked", async () => {
    const mockOnClose = jest.fn();
    const mockSetIsGoalOpen = jest.fn();
    const mockSetGoalModule = jest.fn();

    renderWithProviders(
      <GoalsSlideDialog
        open={true}
        onClose={mockOnClose}
        setIsGoalOpen={mockSetIsGoalOpen}
        setGoalModule={mockSetGoalModule}
        module="View Long-term Goals"
        selectSeason={{}}
        seasonID={1}
        editSeasonData={{
          longTermGoals: "Test long term goal",
          seasonsMainGoal: "Test season main goal",
        }}
      />
    );

    const editButton = screen.getByRole("button", { name: /Close/i });
    await userEvent.click(editButton);

    expect(mockOnClose).toHaveBeenCalledWith(false);
   
  });
   it('calls onClose(false) when Cancel button is clicked', async () => {
    const mockOnClose = jest.fn();

    renderWithProviders(
      <GoalsSlideDialog
        open={true}
        onClose={mockOnClose}
        setIsGoalOpen={jest.fn()}
        setGoalModule={jest.fn()}
        module="Edit Long-term Goals"
        selectSeason={{}}
        seasonID={1}
        editSeasonData={{
          longTermGoals: "Some Goal",
          seasonsMainGoal: "Some Season Goal",
        }}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledWith(false);
  });

it("pre-fills form with correct data from editSeasonData on mount", async () => {
  renderWithProviders(
    <GoalsSlideDialog
      open={true}
      onClose={jest.fn()}
      setIsGoalOpen={jest.fn()}
      setGoalModule={jest.fn()}
      module="Edit Long-term Goals"
      selectSeason={{}}
      seasonID={1}
      editSeasonData={{
        longTermGoals: "Prefilled goal",
        seasonsMainGoal: "Season main goal",
      }}
    />
  );

  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveValue("Prefilled goal");
});
it("dispatches with goalSection as 'seasonsMainGoal' when module is 'Edit Season's Main Goal'", async () => {
  renderWithProviders(
    <GoalsSlideDialog
      open={true}
      onClose={jest.fn()}
      setIsGoalOpen={jest.fn()}
      setGoalModule={jest.fn()}
      module="Edit Season's Main Goal"
      selectSeason={{}}
      seasonID={2}
      editSeasonData={{
        longTermGoals: "LT Goal",
        seasonsMainGoal: "Existing Season Goal",
      }}
    />
  );

  const textbox = screen.getByRole("textbox");
  await userEvent.clear(textbox);
  await userEvent.type(textbox, "Updated Season Goal");

  const updateBtn = screen.getByRole("button", { name: /Update/i });
  await userEvent.click(updateBtn);

  expect(mockDispatch).toHaveBeenCalledWith({
    type: expect.any(String),
    payload: {
      seasonID: 2,
      goalSection: "seasonsMainGoal",
      goalSectionText: "Updated Season Goal",
    },
  });
});
it("dispatches with goalSection as 'longTermGoals' when module is 'Edit Long-term Goals'", async () => {
  renderWithProviders(
    <GoalsSlideDialog
      open={true}
      onClose={jest.fn()}
      setIsGoalOpen={jest.fn()}
      setGoalModule={jest.fn()}
      module="Edit Long-term Goals"
      selectSeason={{}}
      seasonID={1}
      editSeasonData={{
        longTermGoals: "Existing LT Goal",
        seasonsMainGoal: "Existing SM Goal",
      }}
    />
  );

  const textbox = screen.getByRole("textbox");
  await userEvent.clear(textbox);
  await userEvent.type(textbox, "LT Goal Updated");

  const updateBtn = screen.getByRole("button", { name: /Update/i });
  await userEvent.click(updateBtn);

  expect(mockDispatch).toHaveBeenCalledWith({
    type: expect.any(String),
    payload: {
      seasonID: 1,
      goalSection: "longTermGoals",
      goalSectionText: "LT Goal Updated",
    },
  });
});
})
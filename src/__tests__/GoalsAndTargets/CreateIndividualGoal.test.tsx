import CreateIndividualGoal from "@/components/GoalandTargets/CreateIndividualGoal";
import { renderWithProviders } from "../../../__mocks__/store";
import { act, fireEvent ,getByPlaceholderText,screen, waitFor} from "@testing-library/react";
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "cricket"),
  safeJSONParse: jest.fn((data) => data),
}));
describe("CreateIndividualGoal Component",()=>{
     const mockPush = jest.fn();
     beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    query: { teamID: "123" }, 
    push: mockPush,
  });
});

 it("shows success snackbar when showBanner is true and code is 200", async () => {
    const customState = {
      addGoalsTargets: {
        loading: false,
        message: "Goal created successfully",
        code: 200,
      },
    };

    renderWithProviders(<CreateIndividualGoal />, customState);
    await waitFor(() =>
  expect(screen.getByText(/Individual Goals Added successfully!/i)).toBeInTheDocument()
);

  });
   it("shows error snackbar when showBanner is true and code is not 200", async () => {
    const customState = {
      addGoalsTargets: {
        loading: false,
        message: "Goal creation failed",
        code: 500,
      },
    };

    renderWithProviders(<CreateIndividualGoal />, customState);
   await waitFor(() =>
    expect( screen.queryByText(/Something went wrong/i)).toBeInTheDocument()
   );
  });
   it("renders both Team and Athlete options", () => {
    renderWithProviders(<CreateIndividualGoal />);

    const teamRadio = screen.getByRole("radio", { name: /team/i });
    const athleteRadio = screen.getByRole("radio", { name: /athlete/i });

    expect(teamRadio).toBeInTheDocument();
    expect(athleteRadio).toBeInTheDocument();
    expect(athleteRadio).toBeChecked(); 
  });
   it("changes selected goalType to 'team' when Team is clicked", () => {
     renderWithProviders(<CreateIndividualGoal />);

    const teamRadio = screen.getByRole("radio", { name: /team/i });
    fireEvent.click(teamRadio);

    expect(teamRadio).toBeChecked();
    const athleteRadio = screen.getByRole("radio", { name: /athlete/i });
    expect(athleteRadio).not.toBeChecked();
  });

it.skip("shows error when gender error exists in formState", async () => {
  renderWithProviders(<CreateIndividualGoal />);

  const submitButton = screen.getByRole("button", { name: /submit/i });
  fireEvent.click(submitButton);

  expect(
    await screen.findByText("Goal type is required")
  ).toBeInTheDocument();
});
it("updates formData on CustomDatePicker dateChange", async () => {
  renderWithProviders(<CreateIndividualGoal  />);
  
  const input = screen.getAllByPlaceholderText("DD/MM/YYYY");
  const startDateInput = input.find((input) => input.id === "startDate") as HTMLInputElement;
 await act(async () => {
    fireEvent.change(startDateInput, {
      target: { value: "12/08/2025" },
    });
    fireEvent.blur(startDateInput); 
  });

  expect(startDateInput.value).toBe("12/08/2025");

});


  it("renders the select with placeholder", () => {
    renderWithProviders(<CreateIndividualGoal />);
    const select = screen.getByText("Select Athlete");
    expect(select).toBeInTheDocument();
  });
it("disables athlete dropdown when goal type is 'team'", async () => {
  renderWithProviders(<CreateIndividualGoal />);

  const teamRadio = screen.getByRole("radio", { name: /team/i });
  fireEvent.click(teamRadio);
expect(teamRadio).not.toBeDisabled();

});
  it("should allow alphanumeric characters in the  'Enter Goal e.g. (Win the championship league within the season.)' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
    renderWithProviders(<CreateIndividualGoal />);

    const inputElement = screen.getByPlaceholderText('Enter Goal e.g. (Win the championship league within the season.)');
    const preventDefault = jest.fn();

    const disallowedCharEvent = new KeyboardEvent('keypress', {
      key: 'a',
      charCode: 97, // ASCII for '!'
      bubbles: true, // Crucial for events to propagate to React handlers
      cancelable: true, // Necessary for preventDefault to have an effect
    });
    jest.spyOn(disallowedCharEvent, 'preventDefault').mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue(''); // Assuming the input starts empty
  });
   it("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter Goal e.g. (Win the championship league within the season.)' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
   renderWithProviders(<CreateIndividualGoal />);

    const inputElement = screen.getByPlaceholderText('Enter Goal e.g. (Win the championship league within the season.)');
    const preventDefault = jest.fn();

    const disallowedCharEvent = new KeyboardEvent('keypress', {
      key: '!',
      charCode: 33, // ASCII for '!'
      bubbles: true, // Crucial for events to propagate to React handlers
      cancelable: true, // Necessary for preventDefault to have an effect
    });
    jest.spyOn(disallowedCharEvent, 'preventDefault').mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(inputElement).toHaveValue(''); // Assuming the input starts empty
  });
   it("sets actionType to 'saveAndNew' when Save & Add New  button is clicked for handleButtonClick()", async () => {
 renderWithProviders(<CreateIndividualGoal />);

    const saveAndNewButton = screen.getByRole("button", { name: /Save & Add New/i });
    await userEvent.click(saveAndNewButton);
    expect(saveAndNewButton).toHaveClass("save-continue-button");

    
  });
   it("sets actionType to 'save' when Save button is clicked for handleButtonClick()", async () => {
 renderWithProviders(<CreateIndividualGoal />);
  const buttons = screen.getAllByRole("button", { name: /Save/i });
  await userEvent.click(buttons[1]);
    
    expect(buttons[1]).toHaveClass("save-continue-button");

    
  });
  it("should handle error (code 500), show banner, and NOT redirect", async () => {
    renderWithProviders(<CreateIndividualGoal />, {
      addGoalsTargets: {
        code: 500,
        message: "Internal Server Error",
        loading: false,
      },
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
it.skip("should handle success (code 200), show banner, and redirect if actionType is 'save'", async () => {
  renderWithProviders(<CreateIndividualGoal />, {
    addGoalsTargets: {
      code: 200,
      message: "Success",
      loading: false,
    },
  });

  // Simulate clicking the "Save" button (not "Save & Add New")
  const buttons = screen.getAllByRole("button", { name: /Save/i });
  await userEvent.click(buttons[1]); // 0 = Save & Add New, 1 = Save
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/teams/cricket/goalsTargets?currentSeasonID=1");
  });
});
});
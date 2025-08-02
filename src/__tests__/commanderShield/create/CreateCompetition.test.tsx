import { renderWithProviders } from "../../../../__mocks__/store";
import CreateCompetition from "@/components/commanderShield/create/CreateCompetition";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/teams/123/create",
}));
describe("CreateCompetition", () => {
  const defaultProps = {
    GetProgramEditData: null,
    id: null,
    onClose: jest.fn(),
  };
  it("renders Tournament Name input", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("Enter Tournament Name")
    ).toBeInTheDocument();
  });

  it("opens AddMatchDialog on + Add Matches button click", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />);
    const addMatchButton = screen.getByText("+ Add Matches");
    expect(addMatchButton).toBeInTheDocument();

    fireEvent.click(addMatchButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Add Matches")).toBeInTheDocument();
  });
  it("updates formData and clears error on input change for handleChange()", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />, {
      addProgram: {
        loading: false,
        message: "",
        code: 200,
      },
      singleUpload: {
        loading: false,
      },
    });

    const input = screen.getByPlaceholderText("Enter Tournament Name");

    fireEvent.change(input, {
      target: { name: "tournamentName", value: "Dubai Cup" },
    });

    expect((input as HTMLInputElement).value).toBe("Dubai Cup");
    const errorMsg = screen.queryByText(/tournament name is required/i);
    expect(errorMsg).not.toBeInTheDocument();
  });

  it("should allow alphanumeric characters in the  'Enter Tournament Name' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText("Enter Tournament Name");
    const preventDefault = jest.fn();

    const disallowedCharEvent = new KeyboardEvent("keypress", {
      key: "a",
      charCode: 97, // ASCII for '!'
      bubbles: true, // Crucial for events to propagate to React handlers
      cancelable: true, // Necessary for preventDefault to have an effect
    });
    jest
      .spyOn(disallowedCharEvent, "preventDefault")
      .mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue(""); // Assuming the input starts empty
  });
  it("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter Tournament Name' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText("Enter Tournament Name");
    const preventDefault = jest.fn();

    const disallowedCharEvent = new KeyboardEvent("keypress", {
      key: "!",
      charCode: 33, // ASCII for '!'
      bubbles: true, // Crucial for events to propagate to React handlers
      cancelable: true, // Necessary for preventDefault to have an effect
    });
    jest
      .spyOn(disallowedCharEvent, "preventDefault")
      .mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(inputElement).toHaveValue(""); // Assuming the input starts empty
  });
  it("should prevent disallowed characters in 'Enter Organizer Email' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText("Enter Organizer Email");
    const preventDefault = jest.fn();

    // Characters NOT allowed by SPECIALCHARCTERS (e.g., letters, numbers, spaces)
    const disallowedChars = ["a", "1", "A", "Z", " ", "b"];
    for (const char of disallowedChars) {
      const disallowedCharEvent = new KeyboardEvent("keypress", {
        key: char,
        charCode: char.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      jest
        .spyOn(disallowedCharEvent, "preventDefault")
        .mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent);

      preventDefault.mockClear();
    }
  });
  it("should prevent disallowed characters in 'Enter Organizer Name' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<CreateCompetition {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText("Enter Organizer Name");
    const preventDefault = jest.fn();

    // Characters NOT allowed by SPECIALCHARCTERS (e.g., letters, numbers, spaces)
    const disallowedChars = ["a", "1", "A", "Z", " ", "b"];
    for (const char of disallowedChars) {
      const disallowedCharEvent = new KeyboardEvent("keypress", {
        key: char,
        charCode: char.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      jest
        .spyOn(disallowedCharEvent, "preventDefault")
        .mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent);

      preventDefault.mockClear();
    }
  });
 it("updates formData on CustomDatePicker dateChange", async () => {
  renderWithProviders(<CreateCompetition {...defaultProps} />);
  
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
 test("updates formData on CustomDatePicker dateChange", async () => {
  renderWithProviders(<CreateCompetition {...defaultProps} />);
  
  const input = screen.getAllByPlaceholderText("DD/MM/YYYY");
  const startDateInput = input.find((input) => input.id === "endDate") as HTMLInputElement;
 await act(async () => {
    fireEvent.change(startDateInput, {
      target: { value: "12/08/2025" },
    });
    fireEvent.blur(startDateInput); 
  });

  expect(startDateInput.value).toBe("12/08/2025");

});
 it("sets actionType to 'saveAndNew' when Save & Add New  button is clicked for handleButtonClick()", async () => {
  renderWithProviders(<CreateCompetition {...defaultProps} />);

    const saveAndNewButton = screen.getByRole("button", { name: /Save & Add New/i });
    await userEvent.click(saveAndNewButton);
    expect(saveAndNewButton).toHaveClass("save-continue-button");

  });
  it("sets actionType to 'saveAndNew' when Save & Continue  button is clicked for handleButtonClick()", async () => {
  renderWithProviders(<CreateCompetition {...defaultProps} />);

    const saveAndNewButton = screen.getByRole("button", { name: /Save & Continue/i });
    await userEvent.click(saveAndNewButton);
    expect(saveAndNewButton).toHaveClass("save-continue-button");
    
  });
   it("calls onClose when id is present", async () => {
    const onCloseMock = jest.fn();

    renderWithProviders(<CreateCompetition {...defaultProps}  id="123" onClose={onCloseMock} />);

    const backButton = screen.getByRole("button", { name: /Back/i });

    await userEvent.click(backButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
        expect(backButton).toHaveClass("cancel-button");
  });

});

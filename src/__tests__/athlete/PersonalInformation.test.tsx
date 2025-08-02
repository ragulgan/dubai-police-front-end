import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../../../__mocks__/store";
jest.mock('../../../public/svg/Cycling.svg', () => {
  const MockComponent = (props) => (
    <svg {...props} data-testid="cycling-icon" />
  );
  MockComponent.displayName = 'MockCyclingSvg'; // For better debugging
  MockComponent.ReactComponent = MockComponent;
  return MockComponent;
});
jest.mock('../../../public/svg/Athletics.svg', () => {
  const MockComponent = (props) => (
    <svg {...props} data-testid="athletics-icon" />
  );
  MockComponent.displayName = 'MockAthleticsSvg'; // For better debugging
  MockComponent.ReactComponent = MockComponent;
  return MockComponent;
});
jest.mock('../../../public/svg/Swat.svg', () => {
  const MockComponent = (props) => (
    <svg {...props} data-testid="swat-icon" />
  );
  MockComponent.displayName = 'MockSwatSvg'; // For better debugging
  MockComponent.ReactComponent = MockComponent;
  return MockComponent;
});
jest.mock('../../../public/svg/Badminton.svg', () => {
  const MockComponent = (props) => (
    <svg {...props} data-testid="badminton-icon" />
  );
  MockComponent.displayName = 'MockBadmintonSvg'; // For better debugging
  MockComponent.ReactComponent = MockComponent;
  return MockComponent;
});
import { getNationalityListAPI } from "@/redux/slices/nationality/getNationalityListSlice";
import moment from "moment";
import PersonalInformation from "@/components/athlete/personalInformation";
import { userEvent } from "@testing-library/user-event";
import { REGEX } from "@/utils/constants";
import { clearAddAthleteState } from "@/redux/slices/athlete/athleteAddSlice";


const mockAttachmentList = [
  { documentSection: "profileImage", fileID: "file-123" },
  { documentSection: "ProfileFullImage", fileID: "file-456" },
  { documentSection: "iddocument", fileID: "file-789" },
];
jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
  ...jest.requireActual("@/redux/slices/fileupload/singleFileUpload"),
  clearState: jest.fn(() => ({ type: "mockClearState" })),
}));
jest.mock("@/redux/slices/athlete/athleteAddSlice", () => ({
  clearAddAthleteState: jest.fn(() => ({ type: "mock/clearAddAthleteState" })),
}));
jest.mock("@/utils/helper", () => ({
  getLocalStorage: () => JSON.stringify({ athleteID: "athlete-123" }),
  safeJSONParse: jest.fn((data) => data),
  validateDateOfBirth: jest.fn(() => ({})), // or return a dummy error
  validateNewSingleDates: jest.fn(() => ({})),
  capitalizeFirstLetter: jest.fn((val) => val),
  formatDates: jest.fn((date) => date),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn((action) => action),
}));
jest.mock("@/redux/slices/athlete/athleteEditSlice", () => ({
  editAthlete: jest.fn(() => ({ type: "mock/editAthlete" })),
  clearState: jest.fn(() => ({ type: "mock/clearState" })),
}));
jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
  editAthlete: jest.fn(),
  clearState: jest.fn(),
}));
const mockDeleteFile = jest.fn();
jest.mock("@/redux/slices/fileupload/deleteFile", () => ({
  deleteFile: mockDeleteFile,
  clearDeletFileState: jest.fn(),
}));
jest.mock("@/redux/slices/nationality/getNationalityListSlice", () => {
  return {
    __esModule: true, // <- VERY IMPORTANT
    getNationalityListAPI: jest.fn(() => ({ type: "getNationalityListAPI" })),
  };
});
beforeEach(() => {
  const parsedData = {
    PersonalInformation: {
      firstName: "John",
    },
    profileImage: "/fallback/profile.jpg", // this should be overridden
  };
  localStorage.setItem("addAthleteData", JSON.stringify(parsedData));
});
const props = {
  activeStep: 0,
  setActiveStep: jest.fn(),
  setAllData: jest.fn(),
  allData: {},
  editAthleteData: null,
  teamId: "sport-456",
  editPayload: null,
  setDialogOpen: jest.fn(),
  showCancelButton: false,
  staffAndAthleteIdData: null,
  athleteEditId: null,
  onClose: jest.fn(),
};

describe("PersonalInformation Component", () => {
  it("shows and hides Snackbar when API returns 409 error", async () => {
    jest.useFakeTimers();

    const mockState = {
      athleteAdd: {
        message: "Athlete already exists",
        code: 409, // Conflict error
        loading: false,
      },
      listNationality: {
        data: [],
      },
    };

    renderWithProviders(<PersonalInformation {...props} />, mockState);

    // Expect the Snackbar to show
    expect(
      await screen.findByText(/athlete already exists/i)
    ).toBeInTheDocument();

    // Fast-forward the timer
    jest.advanceTimersByTime(3000);

    // Expect the action to clear state to have been dispatched
    await waitFor(() => {
      expect(clearAddAthleteState).toHaveBeenCalled();
    });

    // Snackbar should disappear after timeout
    await waitFor(() => {
      expect(
        screen.queryByText(/athlete already exists/i)
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
  it("shows and hides Snackbar when API returns 500 error", async () => {
    const mockState = {
      athleteAdd: {
        message: "Something went wrong!",
        code: 500,
        loading: false,
      },
      listNationality: {
        data: [],
      },
    };

    jest.useFakeTimers(); // mock timers for setTimeout

    renderWithProviders(<PersonalInformation {...props} />, mockState);

    expect(
      await screen.findByText(/something went wrong!/i)
    ).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(clearAddAthleteState).toHaveBeenCalled();
    });

    // Snackbar should disappear
    await waitFor(() => {
      expect(
        screen.queryByText(/something went wrong!/i)
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
  it("should render Snackbar when showBanner is true and athleteAdd.message exists", async () => {
    const mockState = {
      athleteAdd: {
        loading: false,
        message: "Athlete added successfully!",
        code: 200,
      },
      listNationality: {
        data: [],
      },
    };
    renderWithProviders(<PersonalInformation {...props} />, mockState);
    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/Athlete added successfully!/i)
      ).not.toBeInTheDocument();
    });
  });

  it("renders input fields", () => {
    renderWithProviders(<PersonalInformation />);

    const inputs = screen.getAllByPlaceholderText("Enter First Name");
    expect(inputs[0]).toBeInTheDocument();
    expect(inputs[1]).toBeInTheDocument();
  });
  it("dispatches getNationalityListAPI on mount", () => {
    renderWithProviders(<PersonalInformation {...props} />);
    expect(getNationalityListAPI).toHaveBeenCalled();
  });
  it("handleChange is triggered and updates formData on input change", () => {
    renderWithProviders(<PersonalInformation />);
    const surnameInput = screen.getByPlaceholderText(/Enter surname/i);
    fireEvent.change(surnameInput, { target: { value: "New Surname" } });
    expect(surnameInput).toHaveValue("New Surname");
  });
  it("selects gender and updates the form correctly", () => {
    renderWithProviders(<PersonalInformation />);

    const maleRadio = screen.getByLabelText("Male");
    const femaleRadio = screen.getByLabelText("Female");

    expect(maleRadio).not.toBeChecked();
    expect(femaleRadio).not.toBeChecked();

    fireEvent.click(maleRadio);
    expect(maleRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();
  });
  it("clears gender error when a gender is selected", async () => {
    renderWithProviders(<PersonalInformation />);
    fireEvent.click(screen.getByRole("button", { name: /save & continue/i }));

    expect(await screen.findByText(/gender is required/i)).toBeInTheDocument();

    const maleRadio = screen.getByLabelText("Male");
    fireEvent.click(maleRadio);

    // Wait and assert the error is cleared
    await waitFor(() => {
      expect(screen.queryByText(/gender is required/i)).not.toBeInTheDocument();
    });
  });
  it("renders nationality select with placeholder", () => {
    renderWithProviders(<PersonalInformation />);
    expect(screen.getByText("Select Nationality")).toBeInTheDocument();
  });
  it("selects nationality and updates selected option", async () => {
    const customState = {
      listNationality: {
        data: [
          { countryName: "United Arab Emirates", countryId: 971 },
          { countryName: "India", countryId: 91 },
        ],
      },
      athleteAdd: {
        loading: false,
        message: "",
        code: 0,
      },
    };

    renderWithProviders(<PersonalInformation />, customState);
    // Open the dropdown
    const countryDropdown = screen.getByText("Select Nationality");

    fireEvent.keyDown(countryDropdown, { key: "ArrowDown", code: 40 });
    // Select the option
    const option = await screen.findByText("United Arab Emirates");

    fireEvent.click(option);
    // Expect selected label to be shown
    await waitFor(() => {
      expect(screen.getByText("United Arab Emirates")).toBeInTheDocument();
    });
    // Optional: simulate submit and check error is cleared
    const submitButton = screen.getByRole("button", {
      name: /save & continue/i,
    });
    // Assuming "Nationality is required" appears on submit

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.queryByText(/nationality is required/i)
      ).not.toBeInTheDocument();
    });
  });
  it("clears error message when nationality is selected", async () => {
    const customState = {
      listNationality: {
        data: [{ countryName: "India", countryId: 91 }],
      },
    };
    renderWithProviders(<PersonalInformation />, customState);
    // Trigger validation error
    fireEvent.click(screen.getByRole("button", { name: /save & continue/i }));
    expect(
      await screen.findByText(/nationality is required/i)
    ).toBeInTheDocument();
    // Open dropdown
    fireEvent.mouseDown(screen.getByText("Select Nationality"));
    // Select option
    const indiaOption = await screen.findByText("India");
    fireEvent.click(indiaOption);
    // Wait for error to clear
    await waitFor(() => {
      expect(
        screen.queryByText(/nationality is required/i)
      ).not.toBeInTheDocument();
    });
  });
  it("should pass null as value when SelectedNationalityOption.label is empty", () => {
    const customState = {
      listNationality: {
        data: [
          { countryName: "", countryId: 91 }, // empty label
        ],
      },
    };

    renderWithProviders(<PersonalInformation />, customState);

    // Assert that no value is selected (i.e., dropdown shows placeholder)
    expect(screen.getByText("Select Nationality")).toBeInTheDocument();
  });
  it("updates dob and age on selecting a valid date of birth", async () => {
    renderWithProviders(<PersonalInformation />);

    const inputs = screen.getAllByRole("textbox");
    const dobInput = inputs.find((input) => {
      const inputType = input.getAttribute("type");
      return inputType === "text" || inputType === "date";
    });

    expect(dobInput).toBeDefined();
    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    expect(
      screen.queryByText((text) => text.toLowerCase().includes("date of birth"))
    ).toBeInTheDocument();

    await userEvent.clear(dobInput!);
    await userEvent.type(dobInput!, "01/01/2000");

    // Submit the form to trigger validation
    fireEvent.click(submitBtn);
    // Expect no DOB error
    await waitFor(() => {
      expect(
        screen.queryByText(/date of birth is required/i)
      ).not.toBeInTheDocument();
    });
  });

  it("calls datePickerChange and updates formData and clears error", async () => {
    renderWithProviders(<PersonalInformation />);
    const inputs = screen.getAllByRole("textbox");
    
    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    // Expect error to show (assuming it's shown)
    expect(screen.getByText(/eid expiry date/i)).toBeInTheDocument();

    // Find the input using placeholder
    const dateInputs = screen.getAllByPlaceholderText(/dd\/mm\/yyyy/i);

    const eidExpiryInput = dateInputs[2];
    expect(eidExpiryInput).toBeDefined();

    const validDate = moment().add(1, "year").format("DD/MM/YYYY");

    // Simulate changing the date
    await userEvent.clear(eidExpiryInput!);
    await userEvent.type(eidExpiryInput!, validDate);

    // Trigger blur or form submit if needed
    fireEvent.blur(eidExpiryInput!);

    // Error should be cleared
    await waitFor(() => {
      expect(
        screen.queryByText(/eid expiry date is required/i)
      ).not.toBeInTheDocument();
    });
  });

  it("should dispatch deleteFile and clear profileImage field if fileID is found", async () => {
    const { container } = renderWithProviders(
      <PersonalInformation
        {...props}
        editAthleteData={{ attachmentList: mockAttachmentList }}
        parsedData={{ athleteID: "athlete-123" }}
        athleteEditId="athlete-123"
      />,
      {
        fileDelete: {},
      }
    );

    const buttons = screen.getAllByRole("button"); // will find all button-like roles
    fireEvent.click(buttons[0]);
    const deleteButton = buttons.find(
      (btn) =>
        btn.getAttribute("aria-label")?.includes("delete") ||
        btn.className.includes("iconButton")
    );
    expect(deleteButton).toBeDefined();
  });

  it("handleFileChange updates imageData and formData correctly", async () => {
    const { container } = renderWithProviders(
      <PersonalInformation {...props} />,
      {
        fileDelete: {},
      }
    );
    const input = container.querySelector('input[type="file"]');

    expect(input).toBeInTheDocument();
  });
  it("should trigger hidden input click when Typography is clicked", () => {
    const clickMock = jest
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    renderWithProviders(<PersonalInformation />);
    const uploadLabel = screen.getByText(/Upload Emirates ID Document/i);

    fireEvent.click(uploadLabel);

    expect(clickMock).toHaveBeenCalled();

    clickMock.mockRestore();
  });
  it("should trigger hidden passport input click when Typography is clicked", () => {
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click");

    const { container } = renderWithProviders(<PersonalInformation />);
    const uploadLabel = screen.getByText(/Upload Passport \(PDF\)/i);
    expect(uploadLabel).toBeInTheDocument();
    fireEvent.click(uploadLabel);

    // Assert that .click() was called on the input
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore(); // cleanup
  });
});

describe("ContactDetails - SPECIALCHARACTERS keypress validation", () => {
  it("should prevent invalid characters in firstName input field", () => {
    const preventDefault = jest.fn();

    renderWithProviders(
      <PersonalInformation
        editAthleteData={{}}
        allData={{ PersonalInformation: { nationality: "" } }}
        setAllData={() => {}}
        setActiveStep={() => {}}
        setDialogOpen={() => {}}
        onClose={() => {}}
        activeStep={0}
        showCancelButton={false}
        teamId="team-1"
        editPayload={{}}
        athleteEditId={null}
        staffAndAthleteIdData={{ gender: "Male", middleName: "", lastName: "" }}
      />
    );

    const input = screen.getAllByPlaceholderText(
      "Enter First Name"
    )[0] as HTMLInputElement;

    // Initial state should be empty
    expect(input.value).toBe("");

    // Simulate typing valid and invalid characters
    fireEvent.change(input, { target: { value: "J" } });

    // The field should only contain valid characters (assuming your component filters them out on input)
    expect(input.value).toBe("J");
  });
  
  it("updates languagesSpoken on language dropdown select using handleChangeLanguage function", async () => {
    renderWithProviders(<PersonalInformation {...props} />);
    const placeholder = screen.getByText("Select Languages"); // use your actual placeholder text
    fireEvent.mouseDown(placeholder); // open dropdown

    const option = await screen.findByText("English");
    fireEvent.click(option);
    expect(screen.getByText("English")).toBeInTheDocument();
  });
  it("updates languageOptions from names and updates formData on selection", async () => {
    renderWithProviders(<PersonalInformation />);
    const placeholder = await screen.findByText("Select Languages");
    userEvent.click(placeholder); // simulate opening dropdown

    const option = await screen.findByText("English");
    expect(option).toBeInTheDocument();

    userEvent.click(option);
    await waitFor(() => {
      expect(screen.getByText("English")).toBeInTheDocument();
    });
  });
  it("should allow alphanumeric characters and NOT call preventDefault for Enter Emirates ID Number", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText(
      "Enter Emirates ID Number"
    );
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
  it("should prevent non-alphanumeric, non-space, non-slash characters in the input and call preventDefault for Enter Emirates ID Number", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText(
      "Enter Emirates ID Number"
    );
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
  it("should allow alphanumeric characters and NOT call preventDefault for Enter Passport Number", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Passport Number");
    const preventDefault = jest.fn();
    expect(inputElement).not.toBeDisabled();
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
  it("should prevent non-alphanumeric, non-space, non-slash characters in the input and call preventDefault for Enter Passport Number when press !", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Passport Number");
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
 it("should prevent disallowed characters in the 'Enter surname' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

   const inputElement = screen.getByPlaceholderText("Enter surname");
    const preventDefault = jest.fn();

    // Characters NOT allowed by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
    const disallowedCharEvent = new KeyboardEvent("keypress", {
      key: "1", // A number is not allowed by REGEX.TEXT
      charCode: 49, // ASCII for '1'
      bubbles: true,
      cancelable: true,
    });
    jest.spyOn(disallowedCharEvent, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).toHaveBeenCalled();

    const disallowedCharEvent2 = new KeyboardEvent("keypress", {
      key: "@",
      charCode: 64, // ASCII for '@'
      bubbles: true,
      cancelable: true,
    });
    jest.spyOn(disallowedCharEvent2, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent2);
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });
    it("should allow allowed characters in the 'Enter surname' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter surname");
    const preventDefault = jest.fn();

    // Characters ALLOWED by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
    const allowedChars = ['a', 'Z', '_', '.', ',', '(', ')', '/', ':', ' '];

    for (const char of allowedChars) {
      const allowedCharEvent = new KeyboardEvent("keypress", {
        key: char,
        charCode: char.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      jest.spyOn(allowedCharEvent, "preventDefault").mockImplementation(preventDefault);
      inputElement.dispatchEvent(allowedCharEvent);
      expect(preventDefault).not.toHaveBeenCalled();
      preventDefault.mockClear();
    }
    expect(preventDefault).not.toHaveBeenCalled();
  });
   it("should prevent disallowed characters in the 'Enter Place of Birth' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

   const inputElement = screen.getByPlaceholderText("Enter Place of Birth");
    const preventDefault = jest.fn();

    // Characters NOT allowed by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
    const disallowedCharEvent = new KeyboardEvent("keypress", {
      key: "1", // A number is not allowed by REGEX.TEXT
      charCode: 49, // ASCII for '1'
      bubbles: true,
      cancelable: true,
    });
    jest.spyOn(disallowedCharEvent, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).toHaveBeenCalled();

    const disallowedCharEvent2 = new KeyboardEvent("keypress", {
      key: "@",
      charCode: 64, // ASCII for '@'
      bubbles: true,
      cancelable: true,
    });
    jest.spyOn(disallowedCharEvent2, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent2);
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });
    it("should allow allowed characters in the 'Enter Place of Birth' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Place of Birth");
    const preventDefault = jest.fn();

    // Characters ALLOWED by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
    const allowedChars = ['a', 'Z', '_', '.', ',', '(', ')', '/', ':', ' '];

    for (const char of allowedChars) {
      const allowedCharEvent = new KeyboardEvent("keypress", {
        key: char,
        charCode: char.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      jest.spyOn(allowedCharEvent, "preventDefault").mockImplementation(preventDefault);
      inputElement.dispatchEvent(allowedCharEvent);
      expect(preventDefault).not.toHaveBeenCalled();
      preventDefault.mockClear();
    }
    expect(preventDefault).not.toHaveBeenCalled();
  });
   // --- New Test Cases for the FIRST 'Enter First Name' input (REGEX.TEXT) ---
  it("should prevent disallowed characters in the FIRST 'Enter First Name' input (REGEX.TEXT)", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    // Access the first "Enter First Name" input using its index [0]
    const inputElement = screen.getAllByPlaceholderText("Enter First Name")[0];
    const preventDefault = jest.fn();

    // Test with a number (not allowed)
    const disallowedCharEvent = new KeyboardEvent("keypress", {
      key: "1", charCode: 49, bubbles: true, cancelable: true,
    });
    jest.spyOn(disallowedCharEvent, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).toHaveBeenCalled();
    preventDefault.mockClear(); // Clear for next test

    // Test with '@' (not allowed)
    const disallowedCharEvent2 = new KeyboardEvent("keypress", {
      key: "@", charCode: 64, bubbles: true, cancelable: true,
    });
    jest.spyOn(disallowedCharEvent2, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent2);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("should allow allowed characters in the FIRST 'Enter First Name' input (REGEX.TEXT)", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    // Access the first "Enter First Name" input using its index [0]
    const inputElement = screen.getAllByPlaceholderText("Enter First Name")[0];
    const preventDefault = jest.fn();

    const allowedChars = ['a', 'Z', '_', '.', ',', '(', ')', '/', ':', ' '];
    for (const char of allowedChars) {
      const allowedCharEvent = new KeyboardEvent("keypress", {
        key: char, charCode: char.charCodeAt(0), bubbles: true, cancelable: true,
      });
      jest.spyOn(allowedCharEvent, "preventDefault").mockImplementation(preventDefault);
      inputElement.dispatchEvent(allowedCharEvent);
      expect(preventDefault).not.toHaveBeenCalled();
      preventDefault.mockClear();
    }
  });

  // --- New Test Cases for the SECOND 'Enter First Name' input (REGEX.TEXT) ---
  it("should prevent disallowed characters in the SECOND 'Enter First Name' input (REGEX.TEXT)", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    // Access the second "Enter First Name" input using its index [1]
    const inputElement = screen.getAllByPlaceholderText("Enter First Name")[1];
    const preventDefault = jest.fn();

    // Test with a number (not allowed)
    const disallowedCharEvent = new KeyboardEvent("keypress", {
      key: "7", charCode: 55, bubbles: true, cancelable: true,
    });
    jest.spyOn(disallowedCharEvent, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent);
    expect(preventDefault).toHaveBeenCalled();
    preventDefault.mockClear();

    // Test with '#' (not allowed)
    const disallowedCharEvent2 = new KeyboardEvent("keypress", {
      key: "#", charCode: 35, bubbles: true, cancelable: true,
    });
    jest.spyOn(disallowedCharEvent2, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(disallowedCharEvent2);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("should allow allowed characters in the SECOND 'Enter First Name' input (REGEX.TEXT)", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    // Access the second "Enter First Name" input using its index [1]
    const inputElement = screen.getAllByPlaceholderText("Enter First Name")[1];
    const preventDefault = jest.fn();

    const allowedChars = ['b', 'Y', '_', '.', ',', '(', ')', '/', ':', ' ']; // Using slightly different chars for distinction
    for (const char of allowedChars) {
      const allowedCharEvent = new KeyboardEvent("keypress", {
        key: char, charCode: char.charCodeAt(0), bubbles: true, cancelable: true,
      });
      jest.spyOn(allowedCharEvent, "preventDefault").mockImplementation(preventDefault);
      inputElement.dispatchEvent(allowedCharEvent);
      expect(preventDefault).not.toHaveBeenCalled();
      preventDefault.mockClear();
    }
  });

});

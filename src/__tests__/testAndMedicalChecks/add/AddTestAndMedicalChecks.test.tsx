import { screen, fireEvent, render, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../../../../__mocks__/store";
import TestAndMedicalChecks from "@/components/testAndMedicalChecks/add/AddTestAndMedicalChecks";
import CustomTextField from "@/components/Fields/CustomTextField";
import * as actions from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { editTestAndMedicalChecks } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { extractFilename } from "@/utils/helper";
import { HeightSharp } from "@mui/icons-material";
jest.mock("@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice", () => ({
  editTestAndMedicalChecks: jest.fn(() => ({ type: "MOCK_EDIT_TEST_MEDICAL" })),
}));
jest.mock("@/utils/helper", () => ({
     getLocalStorage: jest.fn(() => "cricket"),
  safeJSONParse: jest.fn((data) => data),
    validateDateOfBirth: jest.fn(() => ({})), 
   extractFilename: jest.fn(() => "mockFileName.pdf"),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: () => "medical", // or whatever returns `testType`
}));
const mockData = {
  testDate: "2023-01-01",
  testTime: "10:00",
  testName: "VO2 Max",
  kpiID: "123",
  kpiPoint: "45",
  location: "Stadium",
  conductingStaff: "John",
  testResult: "Positive",
  medicalClearanceStatus: "Cleared",
  recoveryPlan: "Rest for 2 weeks",
  comments: "No issues",
  unitOfMeasurement: "kg",
  customUnitOfMeasurement: "customKg",
  anotherTestID: "test-1234",
 file: "mockFile.pdf",
  testFilePath: "/uploads/mockFile.pdf",

};

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/test-and-medicals",
    query: {},
    asPath: "/test-and-medicals",
  }),
}));
const customState= { getAthleteList: {
        data: [{ athleteID: 1, name: "John Doe" }],
        loading: false,
      },
      getSportList: {
        data: [{ id: 1, name: "Football" }],
        loading: false,
      },
      addTestAndMedicalChecks: {
        loading: true,
        error: null,
      },
    };
describe("TestAndMedicalChecks component", () => {
  const defaultProps = {
    id: "123",
    onClose: jest.fn(),
    testType: "medical",
    editTestAndMedicalsData: null,
    cancelDialog: false,
    setCancelDialog: jest.fn(),
    module: "athlete",
    isEditSportId: null,
    clearEditData: jest.fn(),
  };

it("renders the select with placeholder", () => {
    renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)

    const select = screen.getByText("Select Athlete");
    expect(select).toBeInTheDocument();
  });
it("updates formData on CustomDatePicker dateChange", async () => {
   renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
  
  const input = screen.getAllByPlaceholderText("DD/MM/YYYY");
  const startDateInput = input.find((input) => input.id === "testDate") as HTMLInputElement;
 await act(async () => {
    fireEvent.change(startDateInput, {
      target: { value: "12/08/2025" },
    });
    fireEvent.blur(startDateInput); 
  });

  expect(startDateInput.value).toBe("12/08/2025");

});
it("updates formData on CustomDatePicker dateChange", async () => {
   renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
  
  const input = screen.getAllByPlaceholderText("DD/MM/YYYY");
  const startDateInput = input.find((input) => input.id === "dob") as HTMLInputElement;
 await act(async () => {
    fireEvent.change(startDateInput, {
      target: { value: "12/08/2025" },
    });
    fireEvent.blur(startDateInput); 
  });

  expect(startDateInput.value).toBe("12/08/2025");

});
  it("renders the component with default store and props", () => {
    renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)

    expect(screen.getByPlaceholderText("Test Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter (Physician, Physiotherapist)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Clinic, Hospital, Facility")
    ).toBeInTheDocument();
   
    expect(
      screen.getByPlaceholderText("Enter Test Result")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Recovery Plan")
    ).toBeInTheDocument();
  });

  it("submits the form when Submit button is clicked", () => {
    renderWithProviders(<TestAndMedicalChecks {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(submitButton);

    // Assert side effects or mock function calls depending on your dispatch mocks
  });
  it("updates formData and clears error for the field", async () => {
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)

    const input = screen.getByPlaceholderText("Enter Height");

    fireEvent.change(input, { target: { name: "height", value: "175" } });
    expect((input as HTMLInputElement).value).toBe("175");
    expect(screen.queryByText("Height is required")).not.toBeInTheDocument();
  });
    it("updates formData and clears error for the field", async () => {
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)

    const input = screen.getByPlaceholderText("Enter Weight");

    fireEvent.change(input, { target: { name: "weight", value: "175" } });
    expect((input as HTMLInputElement).value).toBe("175");
    expect(screen.queryByText("Weight is required")).not.toBeInTheDocument();
  });
   it("handleChange is triggered and updates formData on input change", () => {
  renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, {
      getAthleteList: {
        data: [{ athleteID: 1, name: "John Doe" }],
        loading: false,
      },
      getSportList: {
        data: [{ id: 1, name: "Football" }],
        loading: false,
      },
      addTestAndMedicalChecks: {
        loading: true,
        error: null,
      },
    });
    const surnameInput = screen.getByPlaceholderText(/Test Name/i);
    fireEvent.change(surnameInput, { target: { value: "New Name" } });
    expect(surnameInput).toHaveValue("New Name");
  });
 
     it('should allow digits in the height input and not prevent default for Enter Height', () => {
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
    const heightInput = screen.getByPlaceholderText('Enter Height');
    const preventDefault = jest.fn(); // Mock preventDefault
    fireEvent.keyPress(heightInput, { key: '5', charCode: 53, preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });
   it('should allow a decimal point in the height input and not prevent default for Enter Height', () => {
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)

    const heightInput = screen.getByPlaceholderText('Enter Height');
    const preventDefault = jest.fn();
    fireEvent.keyPress(heightInput, { key: '.', charCode: 46, preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });
 it('should prevent alphabetic characters in the height input and call preventDefault for Enter Height', () => {
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
    const heightInput = screen.getByPlaceholderText('Enter Height');
    const preventDefault = jest.fn();
    const mockKeyboardEvent = new KeyboardEvent('keypress', {
      key: 'a',
      charCode: 97, // ASCII for 'a'
      bubbles: true, // Important: Allows the event to bubble up to React's event system
      cancelable: true, // Important: Allows preventDefault() to have an effect
    });

    // 2. Attach your mock preventDefault to the native event object
    // When your component calls `e.preventDefault()`, it will call this mock
    jest.spyOn(mockKeyboardEvent, 'preventDefault').mockImplementation(preventDefault);
    heightInput.dispatchEvent(mockKeyboardEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(heightInput).toHaveValue(''); // Assuming the input starts empty or cleared
  });
   
 it('should prevent alphabetic characters in the Weight input and call preventDefault for Enter Weight', () => {
      renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)

    const heightInput = screen.getByPlaceholderText('Enter Weight');
    const preventDefault = jest.fn();
    const mockKeyboardEvent = new KeyboardEvent('keypress', {
      key: 'a',
      charCode: 97, 
      bubbles: true, 
      cancelable: true, 
    });
    jest.spyOn(mockKeyboardEvent, 'preventDefault').mockImplementation(preventDefault);
    heightInput.dispatchEvent(mockKeyboardEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(heightInput).toHaveValue(''); 
  });
      it("should prevent disallowed characters in the 'Test Name' input (REGEX.TEXT) and call preventDefault", () => {
        renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
      const inputElement = screen.getByPlaceholderText("Test Name");
      const preventDefault = jest.fn();
  
      // Characters NOT allowed by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
      const disallowedCharEvent = new KeyboardEvent("keypress", {
        key: "1", // A number is not allowed by REGEX.TEXT
        charCode: 49, // ASCII for '1'
        bubbles: true,
        cancelable: true,
      });
      jest
        .spyOn(disallowedCharEvent, "preventDefault")
        .mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent);
      expect(preventDefault).toHaveBeenCalled();
  
      const disallowedCharEvent2 = new KeyboardEvent("keypress", {
        key: "@",
        charCode: 64, // ASCII for '@'
        bubbles: true,
        cancelable: true,
      });
      jest
        .spyOn(disallowedCharEvent2, "preventDefault")
        .mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent2);
      expect(preventDefault).toHaveBeenCalledTimes(2);
    });
    it("should allow allowed characters in the 'Test Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
       renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
  
      const inputElement = screen.getByPlaceholderText("Test Name");
      const preventDefault = jest.fn();
  
      // Characters ALLOWED by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
      const allowedChars = ["a", "Z", "_", ".", ",", "(", ")", "/", ":", " "];
  
      for (const char of allowedChars) {
        const allowedCharEvent = new KeyboardEvent("keypress", {
          key: char,
          charCode: char.charCodeAt(0),
          bubbles: true,
          cancelable: true,
        });
        jest
          .spyOn(allowedCharEvent, "preventDefault")
          .mockImplementation(preventDefault);
        inputElement.dispatchEvent(allowedCharEvent);
        expect(preventDefault).not.toHaveBeenCalled();
        preventDefault.mockClear();
      }
      expect(preventDefault).not.toHaveBeenCalled();
    });
     it("should prevent disallowed characters in the 'Enter (Physician, Physiotherapist)' input (REGEX.TEXT) and call preventDefault", () => {
        renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
      const inputElement = screen.getByPlaceholderText("Enter (Physician, Physiotherapist)");
      const preventDefault = jest.fn();
  
      // Characters NOT allowed by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
      const disallowedCharEvent = new KeyboardEvent("keypress", {
        key: "1", // A number is not allowed by REGEX.TEXT
        charCode: 49, // ASCII for '1'
        bubbles: true,
        cancelable: true,
      });
      jest
        .spyOn(disallowedCharEvent, "preventDefault")
        .mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent);
      expect(preventDefault).toHaveBeenCalled();
  
      const disallowedCharEvent2 = new KeyboardEvent("keypress", {
        key: "@",
        charCode: 64, // ASCII for '@'
        bubbles: true,
        cancelable: true,
      });
      jest
        .spyOn(disallowedCharEvent2, "preventDefault")
        .mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent2);
      expect(preventDefault).toHaveBeenCalledTimes(2);
    });
    it("should allow allowed characters in the 'Enter (Physician, Physiotherapist)' input (REGEX.TEXT) and NOT call preventDefault", () => {
       renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
  
      const inputElement = screen.getByPlaceholderText("Enter (Physician, Physiotherapist)");
      const preventDefault = jest.fn();
  
      // Characters ALLOWED by REGEX.TEXT: /^[a-zA-Z_.,()/:\s ]*$/
      const allowedChars = ["a", "Z", "_", ".", ",", "(", ")", "/", ":", " "];
  
      for (const char of allowedChars) {
        const allowedCharEvent = new KeyboardEvent("keypress", {
          key: char,
          charCode: char.charCodeAt(0),
          bubbles: true,
          cancelable: true,
        });
        jest
          .spyOn(allowedCharEvent, "preventDefault")
          .mockImplementation(preventDefault);
        inputElement.dispatchEvent(allowedCharEvent);
        expect(preventDefault).not.toHaveBeenCalled();
        preventDefault.mockClear();
      }
      expect(preventDefault).not.toHaveBeenCalled();
    });
     it("should allow valid characters", () => {
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
  
      const input = screen.getByPlaceholderText("Enter Test Result");

    const validChar = "A";
    const event = new KeyboardEvent("keypress", {
      key: validChar,
      bubbles: true,
      cancelable: true,
    });

    const prevented = !input.dispatchEvent(event);
    expect(prevented).toBe(false); // keypress allowed
  });

  it.skip("should block invalid characters", () => {
   
     renderWithProviders(<TestAndMedicalChecks {...defaultProps} />, customState)
  
      const input = screen.getByPlaceholderText("Enter Test Result");
    const invalidChar = "#";
    const event = new KeyboardEvent("keypress", {
      key: invalidChar,
      bubbles: true,
      cancelable: true,
    });

    const prevented = !input.dispatchEvent(event);
    expect(prevented).toHaveBeenCalled(); // keypress prevented
  });

});

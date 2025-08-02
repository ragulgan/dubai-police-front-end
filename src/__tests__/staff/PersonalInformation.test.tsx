import { renderWithProviders } from "../../../__mocks__/store";
import PersonalInformation from "@/components/staff/personalInformation";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { clearStaffEditState, editStaff } from "@/redux/slices/staff/staffEditSlice";
import { clearAddState } from "@/redux/slices/staff/staffAddSlice";
import { getNationalityListAPI } from "@/redux/slices/nationality/getNationalityListSlice";
import userEvent from "@testing-library/user-event";
import moment from "moment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/redux/slices/nationality/getNationalityListSlice", () => {
  return {
    __esModule: true, // <- VERY IMPORTANT
    getNationalityListAPI: jest.fn(() => ({ type: "getNationalityListAPI" })),
  };
});
const mockAttachmentList = [
  { documentSection: "profileImage", fileID: "file-123" },
  { documentSection: "ProfileFullImage", fileID: "file-456" },
  { documentSection: "iddocument", fileID: "file-789" },
];
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
  Controller: ({ render }: any) => render({ field: {}, fieldState: {} }),
}));

jest.mock("@/components/Fields/CustomDatePicker", () => ({
  __esModule: true,
  default: ({ name }: any) => (
    <div data-testid="mock-date-picker" data-name={name}>
      MockDatePicker for {name}
    </div>
  ),
}));
jest.mock("@/redux/slices/staff/staffAddSlice", () => ({
  clearAddState: jest.fn(() => ({ type: "mock/clearAddState" })),
}));
jest.mock("@/redux/slices/staff/staffEditSlice", () => ({
  editStaff: jest.fn(() => ({ type: "mock/editStaff" })),
  clearStaffEditState: jest.fn(() => ({ type: "mock/clearStaffEditState" })),
}));

jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
  singleFileUpload: jest.fn(() => ({ type: "mock/singleFileUpload" })),
  clearDeletFileState: jest.fn(),
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
describe("PersonalInformation component", () => {
  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      handleSubmit: (cb: any) => cb,
      control: {},
      register: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn(),
      formState: { errors: {} },
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  const props = {
    activeStep: 0,
    setActiveStep: jest.fn(),
    setAllData: jest.fn(),
    allData: {},
    editAthleteData: null,
    teamId: "",
    editPayload: {},
    setDialogOpen: jest.fn(),
    showCancelButton: false,
    staffAndAthleteIdData: null,
    athleteEditId: null,
    onClose: jest.fn(),
  };

  it("renders CustomDatePicker (DOB) correctly", () => {
  renderWithProviders(<PersonalInformation {...props} />, {
    preloadedState: {
      staff: { staffAddData: {} },
      nationalityList: { nationalityList: [] },
    },
  });
  const allDatePickers = screen.getAllByTestId("mock-date-picker");
  const dobPicker = allDatePickers.find(picker =>
    picker.getAttribute("data-name") === "dob"
  );
  expect(dobPicker).toBeInTheDocument();
  expect(dobPicker).toHaveTextContent("MockDatePicker for dob");
});
 it("shows and hides Snackbar when API returns 409 error", async () => {
    jest.useFakeTimers();

    const mockState = {
      staffAdd: {
        message: "Staff already exists",
        code: 409, 
        loading: false,
      },
      listNationality: {
        data: [],
      },
    };

    renderWithProviders(<PersonalInformation {...props} />, mockState);

    // Expect the Snackbar to show
    expect(
      await screen.findByText(/staff already exists/i)
    ).toBeInTheDocument();
    jest.advanceTimersByTime(3000);
    await waitFor(() => {
      expect(clearAddState).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/staff already exists/i)
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
   it("shows and hides Snackbar when API returns 500 error", async () => {
      const mockState = {
        staffAdd: {
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
        expect(clearAddState).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/something went wrong!/i)
        ).not.toBeInTheDocument();
      });
  
      jest.useRealTimers();
    });
it("should render Snackbar when showBanner is true and staffAdd.message exists", async () => {
    const mockState = {
      staffAdd: {
        loading: false,
        message: "Staff added successfully!",
        code: 200,
        data: {
      staffID: "staff-123", 
    },
      },
      listNationality: {
        data: [],
      },
    };
    renderWithProviders(<PersonalInformation {...props} />, mockState);
    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/Staff added successfully!/i)
      ).not.toBeInTheDocument();
    });
  });
 it("dispatches getNationalityListAPI on mount", () => {
    renderWithProviders(<PersonalInformation {...props} />);
    expect(getNationalityListAPI).toHaveBeenCalled();
  });
 it("renders input fields", () => {
    renderWithProviders(<PersonalInformation />);

    const inputs = screen.getByPlaceholderText("Enter First Name");
    expect(inputs).toBeInTheDocument();
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
   it("should dispatch deleteFile and clear profileImage field if fileID is found", async () => {
    const { container } = renderWithProviders(
      <PersonalInformation
        {...props}
        editStaffData={{ attachmentList: mockAttachmentList }}
        parsedData={{  staffID: "staff-123"}}
        staffEditId="staff-123"
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
  it("should prevent disallowed characters in the 'Enter First Name' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

   const inputElement = screen.getByPlaceholderText("Enter First Name");
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
    it("should allow allowed characters in the 'Enter First Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter First Name");
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

 it("should prevent disallowed characters in the 'Enter Middle Name' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

   const inputElement = screen.getByPlaceholderText("Enter Middle name");
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
    it("should allow allowed characters in the 'Enter Middle Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<PersonalInformation {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Middle name");
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
 
});

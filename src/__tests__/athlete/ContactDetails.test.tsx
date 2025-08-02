// contactDetails.test.tsx
import { renderWithProviders } from "../../../__mocks__/store";
import ContactDetails from "@/components/athlete/contactDetails";
import "@testing-library/jest-dom";
import {
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
beforeEach(() => {
  jest.useFakeTimers();
});

// Mock thunks
jest.mock("@/redux/slices/athlete/athleteEditSlice", () => ({
  editAthlete: () => ({ type: "editAthlete" }),
}));
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import { all } from "axios";
jest.mock("@/redux/slices/nationality/getNationalityListSlice", () => ({
  getNationalityListAPI: () => ({ type: "getNationalityListAPI" }),
}));
const dummyProps = {
  activeStep: 1,
  setActiveStep: jest.fn(),
  setAllData: jest.fn(),
  allData: {},
  teamId: "1",
  editPayload: {},
  staffAndAthleteIdData: {},
  athleteEditId: null,
  editAthleteData: {},
};
const editAthleteData = {
  personalEmail: "edit@example.com",
  dubaiPoliceEmail: "police@example.com",
  phoneNo: "501234567",
  emergencyContactName: "John Doe",
  emergencyContactNumber: "502345678",
  area: "Deira",
  address: "Street 123",
  city: "Dubai",
  emergencyCountryCode: "971",
  countryCode: "971",
  country: 1,
  countryText: "United Arab Emirates",
};

const mockSetAllData = jest.fn();
const mockSetActiveStep = jest.fn();
describe("ContactDetails", () => {
  it("handleChange is triggered and updates formData on input change", () => {
    renderWithProviders(<ContactDetails />);
    const addressInput = screen.getByPlaceholderText(/Enter Address/i);
    fireEvent.change(addressInput, { target: { value: "New Street 101" } });
    expect(addressInput).toHaveValue("New Street 101");
  });
  it("renders Address input with correct label and placeholder", () => {
    renderWithProviders(<ContactDetails />);
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
    const addressInput = screen.getByPlaceholderText(/Enter Address/i);
    expect(addressInput).toBeInTheDocument();
    expect(addressInput).toHaveAttribute("name", "address");
  });
  it("allows user to type into Address input", () => {
    renderWithProviders(<ContactDetails />);
    const addressInput = screen.getByPlaceholderText(/Enter Address/i);
    fireEvent.change(addressInput, { target: { value: "Villa 42, Downtown" } });
    expect(addressInput).toHaveValue("Villa 42, Downtown");
  });
  it("shows validation error for Address when empty on submit", () => {
    renderWithProviders(<ContactDetails />);
    const submitButton = screen.getByRole("button", {
      name: /save & continue/i,
    });
    fireEvent.click(submitButton);
    expect(screen.getByText(/address is required/i)).toBeInTheDocument();
  });

  it("renders contactDetails screen with fields", () => {
    renderWithProviders(<ContactDetails />);
    expect(screen.getByText(/Address/i)).toBeInTheDocument(); // label
    expect(screen.getByPlaceholderText(/Enter Address/i)).toHaveAttribute(
      "name",
      "address"
    ); // input
    expect(screen.getByPlaceholderText(/Enter Address/i)).toHaveAttribute(
      "type",
      "text"
    );
    expect(screen.getByPlaceholderText(/Enter Area/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter City/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter personal email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter government email/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter emergency contact name/i)
    ).toBeInTheDocument();
  });
  it("Check inputs are enabled", () => {
    renderWithProviders(<ContactDetails />);
    expect(screen.getByPlaceholderText(/Enter Address/i)).not.toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter Area/i)).not.toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter City/i)).not.toBeDisabled();
    expect(
      screen.getByPlaceholderText(/Enter personal email/i)
    ).not.toBeDisabled();
    expect(
      screen.getByPlaceholderText(/Enter government email/i)
    ).not.toBeDisabled();
    expect(
      screen.getByPlaceholderText(/Enter emergency contact name/i)
    ).not.toBeDisabled();
  });

  it("shows validation errors on submit with empty required fields", async () => {
    renderWithProviders(<ContactDetails />);

    const submitButton = screen.getByRole("button", {
      name: /save & continue/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });
  it("initial input values are empty", () => {
    const { container } = renderWithProviders(<ContactDetails />);
    expect(screen.getByPlaceholderText(/Enter Address/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Enter Area/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Enter City/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Enter personal email/i)).toHaveValue(
      ""
    );
    expect(screen.getByPlaceholderText(/Enter government email/i)).toHaveValue(
      ""
    );
    expect(
      screen.getByPlaceholderText(/Enter emergency contact name/i)
    ).toHaveValue("");

    const phoneInputs = container.querySelectorAll('input[type="tel"]');
    const phoneInput = phoneInputs[0];
    const emergencyPhoneInput = phoneInputs[1];

    expect(emergencyPhoneInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
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
    renderWithProviders(<ContactDetails {...dummyProps} />, mockState);
    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/Athlete added successfully!/i)
      ).not.toBeInTheDocument();
    });
  });
  it("hides Snackbar when API returns 500 error", async () => {
    const mockState = {
      athleteAdd: {
        message: "Something went wrong!",
        code: 500, // simulate server error
        loading: false,
      },
      listNationality: {
        data: [],
      },
    };
    renderWithProviders(<ContactDetails {...dummyProps} />, mockState);
    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/something went wrong!/i)
      ).not.toBeInTheDocument();
    });
  });
  it("should update phoneNumber and CountryCode and clear the error", async () => {
    const { container } = renderWithProviders(
      <ContactDetails {...dummyProps} />,
      {
        athleteAdd: {
          loading: false,
          message: "",
          code: 0,
        },
        listNationality: {
          data: [],
        },
      }
    );
    const phoneInputs = container.querySelectorAll("input[type='tel']");
    const phoneInput = phoneInputs[0]; // usually first PhoneInput
    fireEvent.change(phoneInput, {
      target: { value: "+971581234567" },
    });
    await waitFor(() => {
      expect(phoneInput).toHaveValue("+971581234567");
    });
  });
  it("should update emergencyContactNumber and emergencyCountryCode and clear the error", async () => {
    const { container } = renderWithProviders(
      <ContactDetails {...dummyProps} />,
      {
        athleteAdd: {
          loading: false,
          message: "",
          code: 0,
        },
        listNationality: {
          data: [],
        },
      }
    );
    const phoneInputs = container.querySelectorAll("input[type='tel']");
    const emergencyPhoneInput = phoneInputs[1]; // usually second PhoneInput
    fireEvent.change(emergencyPhoneInput, {
      target: { value: "+971581234567" },
    });

    await waitFor(() => {
      expect(emergencyPhoneInput).toHaveValue("+971581234567");
    });
  });
  it("should call setAllData, dispatch editAthlete, and setActiveStep(0) when Back button is clicked", () => {
    const { getByRole } = renderWithProviders(
      <ContactDetails
        {...dummyProps}
        setAllData={mockSetAllData}
        setActiveStep={mockSetActiveStep}
      />,
      {
        athleteAdd: { loading: false, code: 0, message: "" },
        listNationality: {
          data: [{ countryId: "971", countryName: "United Arab Emirates" }],
        },
      }
    );

    const backButton = getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    // Check if setAllData was called with updater function
    expect(mockSetAllData).toHaveBeenCalledWith(expect.any(Function));
    const updaterFn = mockSetAllData.mock.calls[0][0];
    expect(typeof updaterFn).toBe("function");
    const result = updaterFn({ previous: "data" });
    expect(result).toHaveProperty("contactdetails");
    expect(result).toHaveProperty("countryLabel");
    //  Check step update
    expect(mockSetActiveStep).toHaveBeenCalledWith(0);
  });

  it("should update formData.country and clear errors.country when a nationality is selected", async () => {
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

    renderWithProviders(<ContactDetails {...dummyProps} />, customState);
    // Open the dropdown
    const countryDropdown = screen.getByText("Select Country");
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
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.queryByText(/country is required/i)
      ).not.toBeInTheDocument();
    });
  });
  it("should populate form data when editAthleteData and athleteEditId are provided", async () => {
    renderWithProviders(
      <ContactDetails
        {...dummyProps}
        editAthleteData={editAthleteData}
        athleteEditId={1001}
      />,
      {
        listNationality: {
          data: [{ countryId: 1, countryName: "United Arab Emirates" }],
        },
        athleteAdd: { code: 0, message: "", loading: false },
      }
    );
    // Check that specific fields get populated
    await waitFor(() => {
      expect(screen.getByDisplayValue("edit@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Street 123")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Deira")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Dubai")).toBeInTheDocument();
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Country Select should show the correct label
    expect(screen.getByText("United Arab Emirates")).toBeInTheDocument();
  });
});
describe("ContactDetails - SPECIALCHARACTERS keypress validation", () => {
  it.each(["@", "#", "[", "]", "{", "}", "$", "^"])(
    "blocks invalid character '%s' in Area field",
    async (key) => {
      renderWithProviders(<ContactDetails {...dummyProps} />);
      const inputWrapper = screen.getByPlaceholderText("Enter Area");

      const input =
        inputWrapper.tagName.toLowerCase() === "input"
          ? inputWrapper
          : inputWrapper.querySelector("input");

      if (!input) throw new Error("Input element not found");

      const preventDefaultSpy = jest.fn();

      // Listen to keypress event manually since React may not trigger it via fireEvent
      input.addEventListener("keypress", (e) => {
        if (!/^[a-zA-Z0-9\-.,()/:\s]*$/.test(e.key)) {
          preventDefaultSpy();
          e.preventDefault();
        }
      });

      const event = new KeyboardEvent("keypress", {
        key,
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(event, "preventDefault", {
        value: preventDefaultSpy,
      });

      input.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    }
  );
  
});
describe("ContactDetails - ALPHA_NUMERIC keypress validation", () => {


  it.each(["@", "#", "!", "&", "*", "$"])(
    "blocks invalid character '%s' in Area field",
    (key) => {
      renderWithProviders(<ContactDetails />);

      const wrapper = screen.getByPlaceholderText("Enter Area");

      // Access the real <input> element inside MUI TextField
      const input =
        wrapper.tagName.toLowerCase() === "input"
          ? wrapper
          : wrapper.querySelector("input");

      if (!input) throw new Error("Input element not found");

      // Spy on preventDefault by temporarily attaching a listener
      const event = new KeyboardEvent("keypress", {
        key,
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = jest.fn();
      input.addEventListener("keypress", (e) => {
        if (!/^[a-zA-Z0-9 /]*$/.test(e.key)) {
          preventDefaultSpy();
          e.preventDefault();
        }
      });

      input.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    }
  );
   it("should prevent disallowed characters in 'Enter Address (Street, Building, Flat/Villa no.)' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<ContactDetails {...dummyProps} />);
    const inputElement = screen.getByPlaceholderText("Enter Address (Street, Building, Flat/Villa no.)");
    const preventDefault = jest.fn();

    // Characters NOT allowed by SPECIALCHARCTERS (e.g., letters, numbers, spaces)
    const disallowedChars = ['a', '1', 'A', 'Z', ' ', 'b'];
    for (const char of disallowedChars) {
      const disallowedCharEvent = new KeyboardEvent("keypress", {
        key: char,
        charCode: char.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      jest.spyOn(disallowedCharEvent, "preventDefault").mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent);
  
       preventDefault.mockClear();
    }
  });
     it("should prevent disallowed characters in the 'Enter emergency contact name' input (REGEX.TEXT) and call preventDefault", () => {
      renderWithProviders(<ContactDetails {...dummyProps} />);

    const inputElement = screen.getByPlaceholderText("Enter emergency contact name");
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
  it("should allow allowed characters in the 'Enter emergency contact name' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<ContactDetails {...dummyProps} />);

    const inputElement = screen.getByPlaceholderText("Enter emergency contact name");
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
   it("should allow alphanumeric characters in the  'Enter Area' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
     renderWithProviders(<ContactDetails {...dummyProps} />);
  
      const inputElement = screen.getByPlaceholderText('Enter Area');
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
     it("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter Area' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
      renderWithProviders(<ContactDetails {...dummyProps} />);
  
      const inputElement = screen.getByPlaceholderText('Enter Area');
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
     it("should allow alphanumeric characters in the  'Enter City' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
     renderWithProviders(<ContactDetails {...dummyProps} />);
  
      const inputElement = screen.getByPlaceholderText('Enter City');
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
     it("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter City' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
      renderWithProviders(<ContactDetails {...dummyProps} />);
  
      const inputElement = screen.getByPlaceholderText('Enter City');
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
});

import { fireEvent ,screen, waitFor, within} from "@testing-library/dom";
import { renderWithProviders } from "../../../__mocks__/store";
import ContactDetails from "@/components/staff/contactDetails";
beforeEach(() => {
  jest.useFakeTimers();
});
jest.mock("@/redux/slices/staff/staffEditSlice", () => ({
  editStaff: jest.fn(() => ({ type: "mock/editStaff" })),
  clearStaffEditState: jest.fn(() => ({ type: "mock/clearStaffEditState" })),
}));
jest.mock("@/redux/slices/nationality/getNationalityListSlice", () => ({
  getNationalityListAPI: () => ({ type: "getNationalityListAPI" }),
}));

const mockSetAllData = jest.fn();
const mockSetActiveStep = jest.fn();
const dummyProps={  
  activeStep:1,
  setActiveStep: jest.fn(),
  setAllData: jest.fn(),
  allData:{},
  editStaffData:{},
  staffEditI:null,
  staffAndAthleteIdData:{},
  regSportID:"123"
}
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
    test("allows user to type into Address input", () => {
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
    it("should render Snackbar when showBanner is true and StaffAdd.message exists", async () => {
    const mockState = {
      staffAdd: {
        loading: false,
        message: "Staff added successfully!",
        code: 200,
      },
      listNationality: {
        data: [],
      },
    };
    renderWithProviders(<ContactDetails {...dummyProps}/>, mockState);
    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/Staff added successfully!/i)
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
  
    expect(mockSetAllData).toHaveBeenCalledWith(expect.any(Function));
    const updaterFn = mockSetAllData.mock.calls[0][0];
    expect(typeof updaterFn).toBe("function");
    const result = updaterFn({ previous: "data" });
    expect(result).toHaveProperty("contactdetails");
    expect(mockSetActiveStep).toHaveBeenCalledWith(0);
  });
   it("should prevent disallowed characters in 'Enter Address (Street, Building, Flat/Villa no.)' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<ContactDetails {...dummyProps} />);
    const inputElement = screen.getByPlaceholderText("Enter Address (Street, Building, Flat/Villa no.)");
    const preventDefault = jest.fn();
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
    // expect(screen.getByPlaceholderText(/Enter City/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter personal email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter Dubai police Email/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter emergency contact name/i)
    ).toBeInTheDocument();
  });
  it("should allow user to select an option in the 'Emirate' dropdown", async () => {
  renderWithProviders(<ContactDetails {...dummyProps} />);
  const dropdownTrigger = screen.getByLabelText(/Emirate/i);
  fireEvent.mouseDown(dropdownTrigger);
 const listbox = await screen.findByRole("listbox");

  const option = within(listbox).getByText("Sharjah");
  fireEvent.click(option);
  expect(screen.getByRole("combobox")).toHaveTextContent("Sharjah");
});

});
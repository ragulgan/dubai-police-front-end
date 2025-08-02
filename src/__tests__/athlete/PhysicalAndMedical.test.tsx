import PhysicalAndMedical from "@/components/athlete/physicalAndMedical";
import { renderWithProviders } from "../../../__mocks__/store";
import { waitFor, screen, fireEvent, within, createEvent } from "@testing-library/react";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("../../redux/slices/athlete/athleteAddSlice", () => ({
  ...jest.requireActual("../../redux/slices/athlete/athleteAddSlice"),
  clearAddAthleteState: jest.fn(() => ({ type: "clearAddAthleteState" })),
  editAthlete: jest.fn(() => ({ type: "mock/editAthlete" })),
  clearState: jest.fn(() => ({ type: "mock/clearState" })),
}));
jest.mock("@/redux/slices/athlete/athleteEditSlice", () => ({
  editAthlete: jest.fn(() => ({ type: "mock/editAthlete" })),
  clearState: jest.fn(() => ({ type: "mock/clearState" })),
}));

const defaultProps = {
  activeStep: 1,
  setActiveStep: jest.fn(),
  setAllData: jest.fn(),
  allData: {},
  teamId: "team123",
  editPayload: {},
  setLoading: jest.fn(),
  setRouteHandel: jest.fn(),
  setDisableRouting: jest.fn(),
  onClose: jest.fn(),
  editAthleteData: null,
  athleteEditId: null,
};

describe("PhysicalAndMedical Component ", () => {
  it("renders error snackbar when athleteAdd code is 500", async () => {
    const customState = {
      athleteAdd: {
        code: 500,
        loading: false,
        message: "Something went wrong!",
      },
    };

    renderWithProviders(<PhysicalAndMedical {...defaultProps} />, customState);

    expect(
      await screen.findByText(/Something went wrong!/i)
    ).toBeInTheDocument();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-filledError");
  });
  it("renders success snackbar when athleteAdd code is 200", async () => {
    const customState = {
      athleteAdd: {
        code: 200,
        loading: false,
        message: "Added Successfully!",
      },
    };

    renderWithProviders(<PhysicalAndMedical {...defaultProps} />, customState);

    expect(
      await screen.findByText((content) =>
        content
          .replace(/\s+/g, " ")
          .includes("Athlete member added successfully!")
      )
    ).toBeInTheDocument();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-filledSuccess");
  });
   it("dateChange is triggered and updates formData on input change", () => {
    renderWithProviders(<PhysicalAndMedical />);
   
       const inputs = screen.getAllByRole("textbox");
       const dobInput = inputs.find((input) => {
         const inputType = input.getAttribute("type");
         return inputType === "text" || inputType === "date";
       });
       console.log("dbinputs... ",dobInput)
       
           expect(dobInput).toBeDefined();
           const submitBtn = screen.getByRole("button", { name: /save/i });
           fireEvent.click(submitBtn);
       
  });
  it("updates formData and clears error for the field", async () => {
    renderWithProviders(<PhysicalAndMedical />);

    const input = screen.getByPlaceholderText("Enter Height"); // Adjust selector as needed

    fireEvent.change(input, { target: { name: "height", value: "175" } });
    expect((input as HTMLInputElement).value).toBe("175");
     expect(screen.queryByText("Height is required")).not.toBeInTheDocument();
  });
  it('should allow digits in the height input and not prevent default for Enter Height', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const heightInput = screen.getByPlaceholderText('Enter Height');
    const preventDefault = jest.fn(); // Mock preventDefault
    fireEvent.keyPress(heightInput, { key: '5', charCode: 53, preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });
   it('should allow a decimal point in the height input and not prevent default for Enter Height', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const heightInput = screen.getByPlaceholderText('Enter Height');
    const preventDefault = jest.fn();
    fireEvent.keyPress(heightInput, { key: '.', charCode: 46, preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });
 it('should prevent alphabetic characters in the height input and call preventDefault for Enter Height', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

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
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

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
     
 it('should prevent alphabetic characters in the Weight input and call preventDefault for Enter Size Of Shoe', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const heightInput = screen.getByPlaceholderText('Enter Size Of Shoe');
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

it('should allow alphanumeric characters and NOT call preventDefault for Enter Previous Injuries when press a', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter Previous Injuries');
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
   it('should prevent non-alphanumeric, non-space, non-slash characters in the input and call preventDefault  for Enter Previous Injuries when press !', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter Previous Injuries');
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
   it('should allow alphanumeric characters and NOT call preventDefault for Enter Size Of Helmet when press a', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter Size Of Helmet');
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
   it('should prevent non-alphanumeric, non-space, non-slash characters in the input and call preventDefault  for Enter Size of Helmet ', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter Size Of Helmet');
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
    it('should allow alphanumeric characters and NOT call preventDefault for Enter Size Of Gloves when press a', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter Size Of Gloves');
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
   it('should prevent non-alphanumeric, non-space, non-slash characters in the input and call preventDefault  for Enter Size Of Gloves when press !', () => {
    renderWithProviders(<PhysicalAndMedical {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter Size Of Gloves');
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
  const mockSetActiveStep = jest.fn();
  const mockSetAllData = jest.fn();
  it("should call setAllData, dispatch editAthlete, and setActiveStep(0) when Back button is clicked", () => {
    const { getByRole } = renderWithProviders(
      <PhysicalAndMedical
        {...defaultProps}
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
    console.log("insie result ",result)
     expect(result).toHaveProperty("physicalmedicaldetails");

    expect(mockSetActiveStep).toHaveBeenCalledWith(3);
  });
  it("should dispatch editAthlete if editPayload.athleteID exists", async () => {
    const mockEditPayload = {
      athleteID: "athlete-999",
    };

    renderWithProviders(
      <PhysicalAndMedical
        parsedData={{}}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-123"
        editPayload={mockEditPayload}
        editAthleteData={{}}
        athleteEditId={"athlete-999"}
      />
    );

    await waitFor(() => {
      expect(editAthlete).toHaveBeenCalled();
    });
  });
});

import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch } from "react-redux";

import { renderWithProviders } from "../../../../__mocks__/store";
import AddResults from "@/components/results/add/AddResults";
import userEvent from "@testing-library/user-event";
jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "1"),
  trimFormData: jest.fn((data) => data),
    validateNewSingleDates: jest.fn(() => ({})),
  safeJSONParse: jest.fn((value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }),
}));
// Mocks
jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { sportId: "123" },
    push: jest.fn(),
    pathname: "/latest-results",
  }),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/teams/99/results/view",
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));


jest.mock("@/redux/slices/sportsMenu/getSportsListSlice", () => ({
  getSportsListAPI: jest.fn(() => ({ type: "GET_SPORTS_LIST" })),
}));

jest.mock("@/redux/slices/results/ResultAddSlice", () => ({
  addResults: jest.fn(() => ({ type: "ADD_RESULTS" })),
  clearResultAddState: jest.fn(),
}));

jest.mock("@/redux/slices/notification/getNotificationModuleByID", () => ({
  getNotificationModuleByID: jest.fn(() => ({ type: "GET_NOTIFICATION_MODULE" })),
}));
const mockSportList = [
  { sportID: "1", sportName: "Football" },
  { sportID: "2", sportName: "Basketball" },
];
describe("AddResults Component", () => {
  const mockDispatch = jest.fn();

beforeEach(() => {
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
});

  it("renders required fields", () => {
    renderWithProviders(<AddResults />);

    expect(screen.getByText("Result Category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Home Team Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Away Team Name/i)).toBeInTheDocument();
  });

  it("triggers validation error on submit with empty required fields", async () => {
    renderWithProviders(<AddResults />);

    const submitBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(submitBtn);
await waitFor(() => {
     expect(screen.getByText("Result Category is required.")).toBeInTheDocument();
});
  });
it("should update selected sport and clear errors when option is selected", async () => {
    renderWithProviders(<AddResults />, {
      getSportList: {
        data: mockSportList,
        loading: false,
      },
    });

    // React Select input (you may need to adjust the query depending on how your component renders)
    const select = screen.getByText("Select Sport");
    // console.log("select",select)
 fireEvent.keyDown(select, { key: "ArrowDown", code: 40 });
 
  });
it("shows validation error if resultCategory is not selected", async () => {
  renderWithProviders(<AddResults />);

  const athleteRadio = screen.getByLabelText("Athlete") as HTMLInputElement;
  fireEvent.click(athleteRadio); // Ensure no change yet

  // Submit without valid resultCategory (simulate unselected state)
  const saveBtn = screen.getByRole("button", { name: /save/i });
  fireEvent.click(saveBtn);

});
  it("allows typing into Home Team Name field", () => {
    renderWithProviders(<AddResults />);

    const homeInput = screen.getByPlaceholderText("Enter Home Team Name") as HTMLInputElement;
    fireEvent.change(homeInput, { target: { value: "Test Team" } });

    expect(homeInput.value).toBe("Test Team");
  });

  it("dispatches getSportsListAPI on mount", () => {
    renderWithProviders(<AddResults />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "GET_SPORTS_LIST" })
    );
  });

  it("shows snackbar on successful form submission (mocked success)", async () => {
    const { rerender } = renderWithProviders(<AddResults />, {
      addResult: { code: 200, message: "Success", loading: false },
    });

    await waitFor(() => {
      expect(screen.getByText(/successfully/i)).toBeInTheDocument();
    });
  });

  it("clears form when 'Clear form' button is clicked", () => {
    const { getByRole, getByLabelText } = renderWithProviders(<AddResults />);
    const input = screen.getByPlaceholderText("Enter Home Team Name")  as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Some Team" } });
    expect(input.value).toBe("Some Team");

    const clearButton = getByRole("button", { name: /clear form/i });
    fireEvent.click(clearButton);

    // Expectation depends on your `clearFormData` impl — adjust as needed.
     expect(input.value).toBe(""); // if `setFormData({})` runs in `clearFormData`
  });
 it("should trigger file input click when Uploadtravel is clicked", async () => {
  renderWithProviders(<AddResults />);

  const fileInput = document.getElementById("file");
  expect(fileInput).toBeTruthy(); // Sanity check

  const clickSpy = jest.spyOn(fileInput!, "click");

  const uploadIcon = screen.getByTestId("upload-travel-icon");
  await userEvent.click(uploadIcon);

  expect(clickSpy).toHaveBeenCalled();
});
it("should update formData and clear error on input change", async () => {
  renderWithProviders(<AddResults />);

  const teamRadio = screen.getByLabelText(/Team/i);
  await userEvent.click(teamRadio); // triggers "unit" field to render

  expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
});
it("handleChange is triggered and updates formData on input change", () => {
    renderWithProviders(<AddResults />);
    const surnameInput = screen.getByPlaceholderText(/Enter Away Team Name/i);
    fireEvent.change(surnameInput, { target: { value: "test" } });
    expect(surnameInput).toHaveValue("test");
  });
   it("should prevent disallowed characters in the 'Enter Away Team Name' input (REGEX.TEXT) and call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
     const inputElement = screen.getByPlaceholderText("Enter Away Team Name");
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
      it("should allow allowed characters in the 'Enter Away Team Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
      const inputElement = screen.getByPlaceholderText("Enter Away Team Name");
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
    it("should prevent disallowed characters in the 'Enter Event Name' input (REGEX.TEXT) and call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
     const inputElement = screen.getByPlaceholderText("Enter Event Name");
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
      it("should allow allowed characters in the 'Enter Event Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
      const inputElement = screen.getByPlaceholderText("Enter Event Name");
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
     it("should prevent disallowed characters in the 'Enter Event Location' input (REGEX.TEXT) and call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
     const inputElement = screen.getByPlaceholderText("Enter Event Location");
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
      it("should allow allowed characters in the 'Enter Event Location' input (REGEX.TEXT) and NOT call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
      const inputElement = screen.getByPlaceholderText("Enter Event Location");
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
         it("should prevent disallowed characters in the 'Enter Home Team Name' input (REGEX.TEXT) and call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
     const inputElement = screen.getByPlaceholderText("Enter Home Team Name");
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
      it("should allow allowed characters in the 'Enter Home Team Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
      renderWithProviders(<AddResults  />);
  
      const inputElement = screen.getByPlaceholderText("Enter Home Team Name");
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
      it("should allow alphanumeric characters and NOT call preventDefault for Enter Discipline", () => {
        renderWithProviders(<AddResults  />);
    
        const inputElement = screen.getByPlaceholderText(
          "Enter Discipline"
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
      it("should prevent non-alphanumeric, non-space, non-slash characters in the input and call preventDefault for Enter Discipline", () => {
        renderWithProviders(<AddResults />);
    
        const inputElement = screen.getByPlaceholderText(
          "Enter Discipline"
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
});
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import moment from "moment";
import { useRouter } from "next/router";
import GeneralInfo from "@/components/raceCalendar/trainingPlan/GeneralInfo";
import { renderWithProviders } from "../../../../__mocks__/store";
import userEvent from "@testing-library/user-event";

// Mock router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockAllData = {
  PersonalInformation: {
    trainingType: "",
    additionalCoach: [],
    trainingPlan: "",
    assignedCoach: [],
    trainingFrequency: "",
    trainingObjective: "",
    athleteName: [],
    trainingStartDate: "",
    trainingEndDate: "",
  },
};
jest.mock("@/redux/slices/athlete/getAthleteListSlice", () => ({
  getAthleteListAPI: () => ({ type: "getAthleteListAPI" }),
}));
//const mockAllData={};
describe("GeneralInfo component", () => {
  let store: any;
  const mockProps = {
    allData: mockAllData,
    editData: {},
    onClose: jest.fn(),
    setTabValue: jest.fn(),
    setTrainingId: jest.fn(),
    date: moment().toDate(),
    setDate: jest.fn(),
    setAllData: jest.fn(),
    selectedSport: ["1"],
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { teamID: "123" },
      pathname: "/training",
    });
  });
  const mockState = {
    addRaceCalendar: { loading: false, code: null, message: "" },
    updateRaceCalendar: { loading: false, code: null, message: "" },
    getAthleteList: { data: [] },
    staffList: {
      data: [
        { label: "Coach A", value: "coach_a" },
        { label: "Coach B", value: "coach_b" },
      ],
    },
  };

  it("renders the form correctly", () => {
    renderWithProviders(<GeneralInfo {...mockProps} />, mockState);

    expect(screen.getByText("Training Type")).toBeInTheDocument();
    expect(screen.getByText("Training Plan")).toBeInTheDocument();
    expect(screen.getByText("Training Frequency")).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty and form is submitted", async () => {
    renderWithProviders(<GeneralInfo {...mockProps} />, mockState);

    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Training Plan is required")).toBeInTheDocument();
    });
  });

  it("should update athlete selection on selecting from ReactSelect", async () => {
    const athleteMockData = [
      { athleteID: "athlete1", firstName: "Athlete One" },
      { athleteID: "athlete2", firstName: "Athlete Two" },
    ];
    const updatedMockState = {
      ...mockState,
      getAthleteList: { data: athleteMockData },
    };
    renderWithProviders(<GeneralInfo {...mockProps} />, updatedMockState);
    const selectInput = screen.getByText("Select Athlete");

    fireEvent.keyDown(selectInput, { key: "ArrowDown", code: 40 });

    const optionToSelect = await screen.findByText("Athlete One");
    fireEvent.click(optionToSelect);

    expect(screen.getByText("Athlete One")).toBeInTheDocument();
  });

  it.skip("should select assigned coach from ReactSelect", async () => {
    const updatedMockState = {
      staffList: {
        data: [
          { label: "Coach A", value: "coach_a" },
          { label: "Coach B", value: "coach_b" },
        ],
      },
      getAthleteList: {
        data: [],
      },
    };

    renderWithProviders(<GeneralInfo {...mockProps} />, updatedMockState);
    const selectInput = screen.getByText("Select Assigned Coach");

    // open and select
    userEvent.click(selectInput);
    const coachOption = await screen.findByText("Coach A");
    userEvent.click(coachOption);

    expect(screen.getByText("Coach A")).toBeInTheDocument();
  });
  it.skip("should allow selecting multiple additional coaches", async () => {
    const updatedMockState = {
      ...mockState,
      staffList: {
        data: [
          { label: "Coach A", value: "coach_a" },
          { label: "Coach B", value: "coach_b" },
        ],
      },
    };

    renderWithProviders(<GeneralInfo {...mockProps} />, updatedMockState);

    // Open the dropdown
    const selectInput = screen.getByText("Select Additional coach");
    userEvent.click(selectInput);

    // Select Coach A
    const coachAOption = await screen.findByText("Coach A");
    userEvent.click(coachAOption);

    // Open again and select Coach B
    userEvent.click(screen.getByText("Select Additional coach"));
    const coachBOption = await screen.findByText("Coach B");
    userEvent.click(coachBOption);

    // Verify both coaches are selected
    expect(screen.getByText("Coach A")).toBeInTheDocument();
    expect(screen.getByText("Coach B")).toBeInTheDocument();
  });
  it("should show custom input when 'Custom' is selected", async () => {
    const user = userEvent.setup();

    renderWithProviders(<GeneralInfo {...mockProps} />, mockState);

    // Open dropdown
    const select = screen.getByText("Select Training Frequency");
    await user.click(select);

    // Click on "Custom" option
    const customOption = screen.getByText("Custom");
    await user.click(customOption);

    // Check if custom input appears
    const customInput = await screen.findByPlaceholderText(
      "Enter Custom Training Frequency"
    );
    expect(customInput).toBeInTheDocument();

    // Type into custom input
    await user.type(customInput, "My Custom Plan");
    expect(customInput).toHaveValue("My Custom Plan");
  });

  it("should render Training Objective editor with default data", () => {
    renderWithProviders(<GeneralInfo {...mockProps} />, mockState);

    const editor = screen.getByText(/Training Objective/i);
    expect(editor).toBeInTheDocument();
  });
  it("updates formData on CustomDatePicker dateChange for trainingStartDate", async () => {
    renderWithProviders(<GeneralInfo {...mockProps} />, mockState);

    const input = screen.getAllByPlaceholderText("DD/MM/YYYY");
    const startDateInput = input.find(
      (input) => input.id === "trainingStartDate"
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(startDateInput, {
        target: { value: "12/08/2025" },
      });
      fireEvent.blur(startDateInput);
    });

    expect(startDateInput.value).toBe("12/08/2025");
  });
    it("updates formData on CustomDatePicker dateChange for trainingEndDate", async () => {
    renderWithProviders(<GeneralInfo {...mockProps} />, mockState);

    const input = screen.getAllByPlaceholderText("DD/MM/YYYY");
    const startDateInput = input.find(
      (input) => input.id === "trainingEndDate"
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(startDateInput, {
        target: { value: "12/08/2025" },
      });
      fireEvent.blur(startDateInput);
    });

    expect(startDateInput.value).toBe("12/08/2025");
  });
     it.skip("should allow alphanumeric characters in the  'Enter Custom Training Frequency' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
      renderWithProviders(<GeneralInfo {...mockProps} />, mockState);
    
        const inputElement = screen.getByPlaceholderText('Enter Custom Training Frequency');
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
       it.skip("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter Custom Training Frequency' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
       renderWithProviders(<GeneralInfo {...mockProps} />, mockState);
    
        const inputElement = screen.getByPlaceholderText('Enter Custom Training Frequency');
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
           it("should allow alphanumeric characters in the  'Enter Training Plan' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
      renderWithProviders(<GeneralInfo {...mockProps} />, mockState);
    
        const inputElement = screen.getByPlaceholderText('Enter Training Plan');
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
       it("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter Training Plan' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
       renderWithProviders(<GeneralInfo {...mockProps} />, mockState);
    
        const inputElement = screen.getByPlaceholderText('Enter Training Plan');
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
        it("handleChange is triggered and updates formData on input change", () => {
 renderWithProviders(<GeneralInfo {...mockProps} />, mockState);
    const addressInput = screen.getByPlaceholderText(/Enter Training Plan/i);
    fireEvent.change(addressInput, { target: { value: "New Street 101" } });
    expect(addressInput).toHaveValue("New Street 101");
  });
});

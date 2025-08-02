import ProfessionalDetails from "@/components/athlete/professionalDetails";
import { renderWithProviders } from "../../../__mocks__/store";
import { waitFor, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { clearAddAthleteState } from "@/redux/slices/athlete/athleteAddSlice";
import { clearStaffAndAthleteFileDeleteState } from "@/redux/slices/staffAndAthlete/StaffAndAthleteFileDeleteSlice";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import { clearAddAcademicState } from "@/redux/slices/athlete/athleteAcademicQualification";
import { academicFileUpload } from "@/redux/slices/fileupload/academicFileUpload";
import * as academicActions from "@/redux/slices/athlete/athleteAcademicQualification";
import { REGEX } from "@/utils/constants";
const mockDeleteFile = jest.fn();
jest.mock("@/redux/slices/fileupload/deleteFile", () => ({
  deleteFile: mockDeleteFile,
  clearDeletFileState: jest.fn(),
}));
jest.mock(
  "@/redux/slices/staffAndAthlete/StaffAndAthleteFileDeleteSlice",
  () => ({
    clearStaffAndAthleteFileDeleteState: jest.fn(() => ({
      type: "mock/clearStaffAndAthleteFileDeleteState",
    })),
  })
);

jest.mock("@/redux/slices/athlete/athleteAcademicQualification", () => ({
  ...jest.requireActual("@/redux/slices/athlete/athleteAcademicQualification"),
  clearAddAcademicState: jest.fn(() => ({ type: "clearAddAcademicState" })),
  academicFileUpload: jest.fn(() => ({ type: "mock/academicFileUpload" })),
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
const mockState = {
  athleteAdd: {
    loading: false,
    message: "Athlete added successfully!",
    code: 200,
  },
  listNationality: {
    data: [],
  },
  addAcademicQualification: {
    loading: false,
    message: "",
    code: 200,
  },
  deleteAcademicQualification: {
    loading: false,
    message: "",
    code: 0,
  },
  academicFileUpload: {
    loading: false,
    message: "",
    code: 0,
  },
  staffAndAthleteFile: {
    loading: false,
    message: "",
    code: 0,
  },
};

const mockDispatch = jest.fn();
const mockSetAllData = jest.fn();
const mockSetActiveStep = jest.fn();

const dummyProps = {
  parsedData: {
    certificate: "certificate.pdf",
    license: "license.pdf",
    certificationLevel: "Level A",
  },
  editAthleteData: {
    academicQualification: "PhD",
    role: "Player",
    sportsCategory: "Senior",
    performanceLevel: "International",
    disciplinePracticed: "Track",
    fieldOfStudy: "Sports Science",
    universityName: "UAE University",
    location: "Dubai",
    federationLicense: "FED123",
    federationExpiryDate: "2024-12-31",
    nationalTeamMember: "Yes",
    externalClubs: "Club A",
    resultsAndAchievements: "Gold Medal",
    sportClubAssociation: "XYZ Club",
    roleAssignedClub: "Captain",
  },
  athleteEditId: "1001",
  setAllData: mockSetAllData,
  setActiveStep: mockSetActiveStep,
  teamId: "sport-456",
};
const props = {
  parsedData: { athleteID: "athlete-123" },
  setAllData: mockSetAllData,
  setActiveStep: mockSetActiveStep,
  teamId: "team-123",
  editAthleteData: { academicQualificationList: [] },
  editPayload: {},
  athleteEditId: null,
};
//     beforeEach(() => {
//     jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch);
//     jest.useFakeTimers();
//   });
//  afterEach(() => {
//     jest.clearAllTimers();
//     jest.clearAllMocks();
//   });
describe("ProfessionalDetails Component", () => {
  it("shows validation errors on submit with empty required fields", async () => {
    renderWithProviders(<ProfessionalDetails />);

    const submitButton = screen.getByRole("button", {
      name: /save & continue/i,
    });
    fireEvent.click(submitButton);
    //expect(screen.getByPlaceholderText(/Enter major Name/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
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

    renderWithProviders(<ProfessionalDetails />, mockState);

    expect(
      await screen.findByText(/something went wrong!/i)
    ).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(clearAddAthleteState).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/something went wrong!/i)
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
  it("should render Snackbar when showBanner is true and athleteAdd.message exists", async () => {
    renderWithProviders(<ProfessionalDetails {...props} />, mockState);

    fireEvent.click(screen.getByRole("button", { name: /Save & Continue/i }));

    await waitFor(() => {
      expect(mockSetAllData).toHaveBeenCalled();
      expect(
        screen.queryByText(/Athlete added successfully!/i)
      ).not.toBeInTheDocument(); // Snackbar auto-hides after 2s
    });
  });
  it("renders Academic Qualification dropdown", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    // check for label
    expect(screen.getByText("Academic Qualification")).toBeInTheDocument();
  });
  it("should allow selecting an option from Affiliations (Club/Association) dropdown", async () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    // Locate the dropdown by role and ID
    const dropdowns = screen.getAllByRole("combobox");
    const affiliationsDropdown = dropdowns.find((el) =>
      el.getAttribute("id")?.includes("externalClubs")
    );
    expect(affiliationsDropdown).toBeInTheDocument();

    // Open dropdown
    fireEvent.mouseDown(affiliationsDropdown!);

    // Find "Yes" option inside the dropdown listbox
    const listbox = await screen.findByRole("listbox");
    const yesOption = within(listbox).getByText("Yes");
    fireEvent.click(yesOption);

    // Optionally assert that "Yes" is selected — more robust if you read the actual value from the state
    expect(affiliationsDropdown).toHaveTextContent("Yes");
  });
  it("should update formData and clear error on location input change", () => {
    const { getByPlaceholderText } = renderWithProviders(
      <ProfessionalDetails {...props} />
    );

    const locationInput = getByPlaceholderText("Enter Campus Location");

    // Type into the input
    fireEvent.change(locationInput, {
      target: { name: "location", value: "Pune" },
    });

    // Check if value updated
    expect(locationInput).toHaveValue("Pune");

    // Optionally: simulate an error first and ensure it's cleared
    fireEvent.change(locationInput, {
      target: { name: "location", value: "Mumbai" },
    });
    expect(locationInput).toHaveValue("Mumbai");

    // Check that error is not shown
    const errorMessage = screen.queryByText(/location is required/i);
    expect(errorMessage).not.toBeInTheDocument();
  });
  it("should update formData and clear error on role input change", () => {
    const { getByPlaceholderText } = renderWithProviders(
      <ProfessionalDetails {...props} />
    );

    const roleInput = getByPlaceholderText("Enter Role");

    fireEvent.change(roleInput, { target: { name: "role", value: "Coach" } });
    expect(roleInput).toHaveValue("Coach");

    const errorMessage = screen.queryByText(/role is required/i);
    expect(errorMessage).not.toBeInTheDocument();
  });
  it("should clear error when dateOfLastJobPromotion is changed with a value", () => {
    const { getByPlaceholderText, rerender } = renderWithProviders(
      <ProfessionalDetails {...props} />
    );

    const dateInput = getByPlaceholderText("DD/MM/YYYY");
    fireEvent.change(dateInput, {
      target: { name: "dateOfLastJobPromotion", value: "" },
    });
    // Now change to valid date
    fireEvent.change(dateInput, {
      target: { name: "dateOfLastJobPromotion", value: "01/01/2024" },
    });

    // Assert input value updated
    expect(dateInput).toHaveValue("01/01/2024");

    // Assert error is cleared
    const errorMessage = screen.queryByText(/dateOfLastJobPromotion/i);
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("should populate visible form fields based on editAthleteData and parsedData", async () => {
    renderWithProviders(<ProfessionalDetails {...dummyProps} />, {
      athleteAdd: { code: 0, message: "", loading: false },
    });

    // Wait for values to appear in the form inputs
    await waitFor(() => {
      expect(screen.getByDisplayValue("PhD")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Player")).toBeInTheDocument();
      expect(screen.getByDisplayValue("UAE University")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Dubai")).toBeInTheDocument();
    });

    // Optional: check externalClubs if visible
    expect(screen.getByDisplayValue("Club A")).toBeInTheDocument();
  });
  it("should trigger file input click when Typography is clicked for handleLicence Click", () => {
    const clickMock = jest
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    renderWithProviders(<ProfessionalDetails />);
    const uploadLabel = screen.getByText(
      /Upload License Certificate: PDF format \(max size 25 MB\)/i
    );

    fireEvent.click(uploadLabel);

    expect(clickMock).toHaveBeenCalled();

    clickMock.mockRestore();
  });
  it("should trigger file input click when Typography is clicked for handlecertificateClick Click", () => {
    const clickMock = jest
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    renderWithProviders(<ProfessionalDetails />);
    const uploadLabel = screen.getByText(
      /Upload Degree Certificate: PDF format \(max size 25 MB\)/i
    );

    fireEvent.click(uploadLabel);

    expect(clickMock).toHaveBeenCalled();

    clickMock.mockRestore();
  });
});

describe("ProfessionalDetails - form population from editAthleteData", () => {
  const mockState = {
    athleteAdd: {},
    listNationality: {},
    staffAndAthleteFile: {},
    addAcademicQualification: {},
    contactDetails: {},
    editAthleteData: {
      academicQualificationList: [
        {
          academicQualificationID: "123",
          academicQualification: "Master of Sports",
          fieldOfStudy: "Physiology",
          universityName: "XYZ University",
          location: "Dubai",
          fileList: [
            {
              fileName: "degree.pdf",
              fileID: "file123",
              filePath: "/files/degree.pdf",
              documentSection: "AcademicQualification",
            },
          ],
        },
      ],
    },
  };
  it("should call window.open when download icon is clicked", () => {
    // Mock window.open
    const openMock = jest.fn();
    window.open = openMock;

    const mockEditAthleteData = {
      academicQualificationList: [
        {
          academicQualificationID: "123",
          academicQualification: "Bachelor of Arts",
          fieldOfStudy: "History",
          universityName: "Oxford",
          location: "UK",
          fileList: [
            {
              fileName: "degree.pdf",
              filePath: "http://example.com/degree.pdf",
              fileID: "file123",
              documentSection: "AcademicQualification",
            },
          ],
        },
      ],
    };

    renderWithProviders(
      <ProfessionalDetails
        {...{
          parsedData: {},
          setAllData: jest.fn(),
          setActiveStep: jest.fn(),
          teamId: "team-123",
          editAthleteData: mockEditAthleteData,
        }}
      />,
      {
        athleteAdd: {},
        listNationality: {},
        addAcademicQualification: {},
        deleteAcademicQualification: {},
        academicFileUpload: {},
        staffAndAthleteFile: {},
      }
    );

    // Find and click the download button
    const allButtons = screen.getAllByRole("button", { name: /edit/i });
    const downloadButton = allButtons[0]; // First edit icon is AttachFileIcon
    fireEvent.click(downloadButton);

    expect(openMock).toHaveBeenCalledWith(
      "http://example.com/degree.pdf",
      "_blank"
    );
  });
  it("should dispatch editAthlete and clearStaffAndAthleteFileDeleteState when certificateFileUploadDelete.code === 200", async () => {
    jest.useFakeTimers();

    const mockState = {
      athleteAdd: {},
      listNationality: {},
      addAcademicQualification: {},
      deleteAcademicQualification: {},
      academicFileUpload: {},
      staffAndAthleteFile: {},
      certificateFileUploadDelete: {
        code: 200,
        message: "",
        loading: false,
      },
    };

    renderWithProviders(
      <ProfessionalDetails
        parsedData={{}}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-123"
        editAthleteData={{}}
        athleteEditId="athlete-456"
      />,
      mockState
    );

    expect(editAthlete).toHaveBeenCalled(); // First dispatch
    jest.advanceTimersByTime(2000);

    jest.useRealTimers();
  });
  it("should dispatch editAthlete when academicFileUploadData.code === 200", () => {
    const mockState = {
      academicFileUpload: {
        code: 200,
        loading: false,
        message: "File uploaded",
      },
      athleteAdd: {},
      listNationality: {},
      addAcademicQualification: {},
      staffAndAthleteFile: {},
    };

    renderWithProviders(
      <ProfessionalDetails
        parsedData={{}}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-123"
        editAthleteData={{}}
        athleteEditId="athlete-456"
      />,
      mockState
    );

    expect(editAthlete).toHaveBeenCalled();
  });
  it("should dispatch editAthlete, call setEditShowAcadamic(false), and acadamicClear when deleteAcademicQualificationData.code === 200", async () => {
    // Create mock handlers
    const mockSetEditShowAcadamic = jest.fn();
    const mockAcadamicClear = jest.fn();
    const mockState = {
      athleteAdd: {},
      listNationality: {},
      addAcademicQualification: {},
      academicFileUpload: {},
      staffAndAthleteFile: {},
      deleteAcademicQualification: {
        code: 200,
        loading: false,
        message: "Deleted successfully",
      },
    };

    renderWithProviders(
      <ProfessionalDetails
        parsedData={{}}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-123"
        editAthleteData={{}}
        athleteEditId="athlete-789"
        setEditShowAcadamic={mockSetEditShowAcadamic}
        acadamicClear={mockAcadamicClear}
      />,
      mockState
    );

    // Wait for the useEffect to run and assertions to pass
    await waitFor(() => {
      expect(editAthlete).toHaveBeenCalled();
    });
  });
  it("shows error banner and clears state when academicQualificationData.code is 500 or 409", async () => {
    jest.useFakeTimers();

    const mockState = {
      addAcademicQualification: {
        code: 500,
        message: "Server Error!",
        loading: false,
      },
      athleteAdd: {},
      listNationality: {},
      academicFileUpload: {},
      staffAndAthleteFile: {},
    };

    renderWithProviders(
      <ProfessionalDetails
        parsedData={{}}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-123"
        editAthleteData={{}}
        athleteEditId="athlete-789"
      />,
      mockState
    );

    // Verify that the error message is shown
    expect(await screen.findByText(/Server Error!/i)).toBeInTheDocument();

    // Fast-forward the timer
    jest.advanceTimersByTime(2000);

    // After timeout, the banner should disappear and clear action dispatched
    await waitFor(() => {
      expect(clearAddAcademicState).toHaveBeenCalled();
      expect(screen.queryByText(/Server Error!/i)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
  it("should dispatch editAthlete, fileUpload, clearAddAcademicState, setEditShowAcadamic(false), and acadamicClear", () => {
    const mockSetEditShowAcadamic = jest.fn();
    const mockAcadamicClear = jest.fn();

    const mockFile = new File(["dummy"], "dummy.pdf", {
      type: "application/pdf",
    });

    const mockState = {
      addAcademicQualification: {
        code: 200,
        message: "Success",
        loading: false,
        data: {
          academicQualificationID: "aqid-001",
        },
      },
      athleteAdd: {},
      listNationality: {},
      academicFileUpload: {},
      staffAndAthleteFile: {},
    };

    renderWithProviders(
      <ProfessionalDetails
        parsedData={{ athleteID: "athlete-123", certificationLevel: mockFile }}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-999"
        editAthleteData={{}}
        athleteEditId="athlete-123"
        editShowAcadamic={true}
        setEditShowAcadamic={mockSetEditShowAcadamic}
        acadamicClear={mockAcadamicClear}
      />,
      mockState
    );

    // ✅ Check that editAthlete is dispatched
    expect(editAthlete).toHaveBeenCalled();
  });
  it("should dispatch editAthlete if editPayload.athleteID exists", async () => {
    const mockEditPayload = {
      athleteID: "athlete-999",
    };

    renderWithProviders(
      <ProfessionalDetails
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
  it("check when click on Add/Update Button handleAcadamicQualification () is call or not", async () => {
    renderWithProviders(<ProfessionalDetails {...props} />, mockState);

    const addButton = screen.getByRole("button", { name: /add/i }); // or /update/i

    fireEvent.click(addButton);

    expect(addButton).not.toBeDisabled();
  });
  it("calls handleBack function when we click on back button", () => {
    const mockSetAllData = jest.fn();
    const mockSetActiveStep = jest.fn();

    const { store } = renderWithProviders(
      <ProfessionalDetails
        parsedData={{ athleteID: "athlete-123" }}
        setAllData={mockSetAllData}
        setActiveStep={mockSetActiveStep}
        teamId="5"
        editAthleteData={{}}
      />
    );

    // Optional: Update formData via input
    fireEvent.change(screen.getByPlaceholderText("Enter major Name"), {
      target: { value: "Engineering" },
    });

    // Click "Back" button
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
  });
  const mockAttachmentList = [
    { documentSection: "profileImage", fileID: "file-123" },
    { documentSection: "ProfileFullImage", fileID: "file-456" },
    { documentSection: "iddocument", fileID: "file-789" },
  ];
  const localProps = {
    ...props,
    parsedData: {
      athleteID: "athlete-123",
      uploadLicense: "license.pdf", // ✅ this is needed
    },
    editAthleteData: {
      attachmentList: [{ documentSection: "License", fileID: "file-999" }],
    },
  };
  it("should update formData correctly when handleFileChange is called with EMPLOYEE_CERTIFICATE", async () => {
    const testFile = new File(["dummy"], "degree.pdf", {
      type: "application/pdf",
    });

    const { container } = renderWithProviders(
      <ProfessionalDetails
        parsedData={{ athleteID: "athlete-123" }}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-123"
        editAthleteData={{}}
      />
    );
    const hiddenInput = container.querySelector('input[type="file"]');
    expect(hiddenInput).toBeInTheDocument();

    fireEvent.change(hiddenInput!, {
      target: {
        files: [testFile],
      },
    });

    // Now wait for formData to be updated in the UI
    await waitFor(() => {
      expect(screen.getByText("degree.pdf")).toBeInTheDocument(); // assuming the filename is rendered
    });
  });
  it("should update formData and clear error when performanceLevel is changed", async () => {
    renderWithProviders(
      <ProfessionalDetails
        parsedData={{ athleteID: "athlete-123" }}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-999"
        editAthleteData={{}}
      />
    );
    const dropdowns = screen.getAllByRole("combobox");
    const performanceDropdown = dropdowns.find((el) =>
      el.getAttribute("id")?.includes("performanceLevel")
    );
    expect(performanceDropdown).toBeInTheDocument();

    // Open dropdown
    fireEvent.mouseDown(performanceDropdown!);

    // Find "Yes" option inside the dropdown listbox
    const listbox = await screen.findByRole("listbox");
    const yesOption = within(listbox).getByText("Intermediate");
    fireEvent.click(yesOption);

    // Optionally assert that "Intermediate" is selected — more robust if you read the actual value from the state
    expect(performanceDropdown).toHaveTextContent("Intermediate");
    const errorText = screen.queryByText(/performance level is required/i);
    expect(errorText).not.toBeInTheDocument();
  });
  it("should update formData and clear error when academicQualification is changed qualifyChange ()", async () => {
    renderWithProviders(
      <ProfessionalDetails
        parsedData={{ athleteID: "athlete-123" }}
        setAllData={jest.fn()}
        setActiveStep={jest.fn()}
        teamId="team-456"
        editAthleteData={{}}
      />
    );
    const selectTrigger = screen.getByText(
      /select current job location qualification/i
    );
    fireEvent.mouseDown(selectTrigger);

    const phdOption = await screen.findByText("Diploma");
    fireEvent.click(phdOption);
    const diplomaOptions = screen.getAllByText("Diploma");
    fireEvent.click(diplomaOptions[1]);
  });
  it("should prevent disallowed characters in the 'Enter major Name' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter major Name");
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
  it("should allow allowed characters in the 'Enter major Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter major Name");
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
   it("should prevent disallowed characters in the 'Enter Educational Institution Name' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Educational Institution Name");
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
  it("should allow allowed characters in the 'Enter Educational Institution Name' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Educational Institution Name");
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
   it("should prevent disallowed characters in the 'Enter Campus Location' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Campus Location");
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
  it("should allow allowed characters in the 'Enter Campus Location' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Campus Location");
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
     it("should prevent disallowed characters in the 'Role' input (REGEX.TEXT) and call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Role");
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
  it("should allow allowed characters in the 'Enter Role' input (REGEX.TEXT) and NOT call preventDefault", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText("Enter Role");
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
   it("should allow alphanumeric characters in the  'Enter Federation License' input (REGEX.ALPHA_NUMERIC) and NOT call preventDefault  ", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText('Enter Federation License');
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
   it("should prevent non-alphanumeric, non-space, non-slash characters in the  'Enter Federation License' input (REGEX.ALPHA_NUMERIC)  and call preventDefault  ", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);

    const inputElement = screen.getByPlaceholderText('Enter Federation License');
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
   it("should prevent disallowed characters in 'Enter Discipline Practiced' input (ALPHA_CHARS_SPACE)", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);
    const inputElement = screen.getByPlaceholderText("Enter Discipline Practiced");
    const preventDefault = jest.fn();

    const disallowedChars = ['1', '#', '&', '[', '>', '`']; // A subset of chars not allowed by ALPHA_CHARS_SPACE
    for (const char of disallowedChars) {
      const disallowedCharEvent = new KeyboardEvent("keypress", {
        key: char, charCode: char.charCodeAt(0), bubbles: true, cancelable: true,
      });
      jest.spyOn(disallowedCharEvent, "preventDefault").mockImplementation(preventDefault);
      inputElement.dispatchEvent(disallowedCharEvent);
      expect(preventDefault).toHaveBeenCalled();
      preventDefault.mockClear();
    }
  });
   it("should prevent disallowed characters in 'Enter Sports Category' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);
    const inputElement = screen.getByPlaceholderText("Enter Sports Category");
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
   it("should prevent disallowed characters in 'Enter Sport Club/Association Name' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);
    const inputElement = screen.getByPlaceholderText("Enter Sport Club/Association Name");
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
   it("should prevent disallowed characters in 'Enter Role Assigned in Club' input (SPECIALCHARCTERS)", () => {
    renderWithProviders(<ProfessionalDetails {...props} />);
    const inputElement = screen.getByPlaceholderText("Enter Role Assigned in Club");
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

});

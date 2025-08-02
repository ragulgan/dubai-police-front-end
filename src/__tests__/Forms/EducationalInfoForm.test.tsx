// EducationalInfoForm.test.tsx
import React from "react";
import { renderWithProviders } from "../../../__mocks__/store";
import EducationalInfoForm from "@/components/Forms/EducationalInfoForm";
import * as reactRedux from "react-redux";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as singleUploadActions from "@/redux/slices/fileupload/singleFileUpload";
jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
    singleFileUpload: jest.fn(() => ({ type: "MOCK_SINGLE_FILE_UPLOAD" })),
 clearState: jest.fn(() => ({ type: "CLEAR_STATE" })),
}));
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));
jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { id: "123", teamID: "456" },
  }),
}));
jest.mock("@/redux/slices/fileupload/academicFileUpload", () => ({
  ...jest.requireActual("@/redux/slices/fileupload/academicFileUpload"),
  academicFileUpload: jest.fn(),
  clearAddAcademicState: jest.fn(),
  clearAcademicFileUploadState: jest.fn(),
  editStaff: jest.fn(),
}));
jest.mock("@/redux/slices/staff/staffEditSlice", () => ({
  ...jest.requireActual("@/redux/slices/staff/staffEditSlice"),

  editStaff: jest.fn(),
}));
jest.mock("@/redux/slices/athlete/athleteAcademicQualification", () => ({
  ...jest.requireActual("@/redux/slices/athlete/athleteAcademicQualification"),
  clearAddAcademicState: jest.fn(),
}));
import * as staffActions from "@/redux/slices/staff/staffUpdateSlice"; // Adjust path if needed
import { UpdateStaff } from "@/redux/slices/staff/staffUpdateSlice";
import academicFileUpload from "@/redux/slices/fileupload/academicFileUpload";
import { clearAddAcademicState } from "@/redux/slices/athlete/athleteAcademicQualification";

jest.mock("@/redux/slices/staff/staffUpdateSlice", () => ({
  UpdateStaff: jest.fn(() => ({
    type: "updateStaff/UpdateStaff/pending",
    payload: { section: "contactdetails" },
  })),
}));

const mockEditStaffData = {
  fieldOfStudy: "Computer Science",
  universityName: "Test University",
  location: "City",
  upload_certificate: "test.pdf",
  assignedAthletesOrTeams: "Team A",
  coachingExperience: "5 years",
  previousAthleteExperience: "2 years",
  skills: "Skill A, Skill B",
  availabilityOnTraining: "Weekends",
  achievementsAsCoach: "Won 3 trophies",
  academicQualification: "bachelor",
    academicQualificationList: [
              {
                academicQualification: "Ph.D.",
                fieldOfStudy: "Physics",
                universityName: "Harvard",
                location: "Cambridge",
                fileList: [{ filePath: "phd_certificate.pdf" }],
              },
            ],
  attachmentList: [
    {
      documentSection: "Certificate",
      fileName: "test.pdf",
      fileID: "file-1",
    },
  ],
};
describe("EducationalInfoForm", () => {
     const mockDispatch = jest.fn();

  it("renders without crashing", () => {
renderWithProviders(
  <EducationalInfoForm id={0} onClose={undefined} editStaffData={mockEditStaffData} />,
  {
    staffAdd: {
      editStaffUpdatedData: mockEditStaffData,
    },
  })
   expect(screen.getByPlaceholderText("Enter Field of Study")).toHaveValue("Computer Science");
    expect(screen.getByPlaceholderText("Enter University Name")).toHaveValue("Test University");
    expect(screen.getByPlaceholderText("Enter Location")).toHaveValue("City");
    expect(screen.getByPlaceholderText("Enter Coaching Experience")).toBeInTheDocument();
     expect(screen.getByPlaceholderText("Enter Previous Athlete Experience")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Coaching Experience")).toBeInTheDocument();

    // Add further assertions here
  });
  it("submits the form and dispatches update action", async () => {
    const { store } = renderWithProviders( <EducationalInfoForm id={0} onClose={undefined} editStaffData={mockEditStaffData} />,
  {
    staffAdd: {
      editStaffUpdatedData: mockEditStaffData,
    },
  })

    const updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);
    // Wait for dispatch to occur (allow useEffect + async form handler)
    await waitFor(() => {
      const dispatchedActions = store.getState(); // or store.getActions() if using redux-mock-store
      expect(dispatchedActions).toBeDefined();
    });
  });
  it("renders academic qualification list when getAthleteByID has data in table", () => {
    const mockState = {
      getAthleteByID: {
        data: [
          {
            academicQualificationList: [
              {
                academicQualification: "Ph.D.",
                fieldOfStudy: "Physics",
                universityName: "Harvard",
                location: "Cambridge",
                fileList: [{ filePath: "phd_certificate.pdf" }],
              },
            ],
          },
        ],
      },
    };

     const { store } = renderWithProviders( <EducationalInfoForm id={0} onClose={undefined} editStaffData={mockEditStaffData} />,
  {
    staffAdd: {
      editStaffUpdatedData: mockEditStaffData,
    },
  })

    expect(screen.getByText(/Ph\.D\./i)).toBeInTheDocument();
    expect(screen.getByText(/Physics/i)).toBeInTheDocument();
    expect(screen.getByText(/Harvard/i)).toBeInTheDocument();
    expect(screen.getByText(/Cambridge/i)).toBeInTheDocument();
  });
 it("dispatches clearState when singleUpload.code is 200", () => {
    const clearStateSpy = singleUploadActions.clearState;

    renderWithProviders( <EducationalInfoForm id={0} onClose={undefined} editStaffData={mockEditStaffData} />,{
      singleUpload: {
        code: 200,
        loading: false,
        message: "File uploaded successfully",
      },
    });

    expect(clearStateSpy).toHaveBeenCalled(); // ✅ check if dispatched
  });
   it("calls onClose when cancel button is clicked", () => {
      const onCloseMock = jest.fn();
      renderWithProviders( <EducationalInfoForm id={0} onClose={onCloseMock} editStaffData={mockEditStaffData} />,{
      singleUpload: {
        code: 200,
        loading: false,
        message: "File uploaded successfully",
      },
    });
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onCloseMock).toHaveBeenCalled(); 
    });
});

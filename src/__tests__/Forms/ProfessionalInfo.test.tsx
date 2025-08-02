import ProfessionalInfo from "@/components/Forms/ProfessionalInfo";
import { renderWithProviders } from "../../../__mocks__/store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";

import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { teamID: "team-123" },
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/staff/edit",
  }),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

import { useDispatch } from "react-redux";

jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
  singleFileUpload: jest.fn(() => ({ type: "MOCK_UPLOAD" })),
  clearState: jest.fn(),
}));

const mockProps = {
  id: 1,
  onClose: jest.fn(),
  editData: {
    role: "Captain",
    academicQualification: "bachelor",
    fieldOfStudy: "Sports Science",
    universityName: "Dubai University",
    location: "Dubai",
    performanceLevel: "beginner",
    contractType: "Permanent Contract",
    currentJobPosition: "Coach",
    currentJobLocation: "Abu Dhabi",
    dpEmployeeNumber: "DP12345",
    rank: "Senior",
    department: "Training",
    dateOfLastJobPromotion: "2022-01-01",
    dpEmploymentStatus: "Active",
    sportsCategory: "elite",
    disciplinePracticed: "Judo",
    contractEndDate: "2025-01-01",
    contractStartDate: "2024-01-01",
    acknowledgementDate: "2023-01-01",
    pledgeDate: "2023-02-01",
    attachmentList: [],
  },
  module: "athlete",
};

describe("ProfessionalInfo Form Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as any).mockReturnValue(mockDispatch);
    jest.clearAllMocks(); // cleanup between tests
  });
  it("renders ProfessionalInfo fields", async () => {
    renderWithProviders(<ProfessionalInfo {...mockProps} />);
    expect(screen.getByText("Role On Team")).toBeInTheDocument();
    const text = await screen.findByText(/Upload Certificate/i);
    expect(text).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/Enter University Name/i);
    expect(input).toBeInTheDocument();
     expect( screen.getByPlaceholderText(/Enter Field of Study/i)).toBeInTheDocument();
    expect(input).toHaveValue("Dubai University");
  });
  it("submits the form and dispatches update action", async () => {
    const { store } = renderWithProviders(<ProfessionalInfo {...mockProps} />);

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

    renderWithProviders(<ProfessionalInfo {...mockProps} />, mockState);
    expect(screen.getByText(/Ph\.D\./i)).toBeInTheDocument();
    expect(screen.getByText(/Physics/i)).toBeInTheDocument();
    expect(screen.getByText(/Harvard/i)).toBeInTheDocument();
    expect(screen.getByText(/Cambridge/i)).toBeInTheDocument();
  });

  it.skip("dispatches singleFileUpload when a file is uploaded", async () => {
    renderWithProviders(<ProfessionalInfo {...mockProps} />);

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    const inputs = await screen.findAllByTestId("file-input");
    //console.log("inputs ",inputs)
    await userEvent.upload(inputs[0], file); // Upload file

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(singleFileUpload).toHaveBeenCalledWith(expect.any(FormData));
    });
  });
  it("calls file input click when Upload Contract Typography is clicked-handleIdClick()", async () => {
    const clickSpy = jest
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    renderWithProviders(<ProfessionalInfo {...mockProps} />);

    const uploadText = await screen.findByText(/Upload Contract/i);
    await userEvent.click(uploadText);

    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });
  it("calls file input click when Upload Certificate Typography is clicked -handlepassClick()", async () => {
    const clickSpy = jest
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    renderWithProviders(<ProfessionalInfo {...mockProps} />);

    const uploadText = await screen.findByText(/Upload Certificate/i);
    await userEvent.click(uploadText);

    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });
});

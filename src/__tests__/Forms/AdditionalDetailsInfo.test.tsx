import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";

import moment from "moment";
import { renderWithProviders } from "../../../__mocks__/store";
import AdditionalDetailsInfo from "@/components/Forms/AdditionalDetailsInfo";
import userEvent from "@testing-library/user-event";
import * as singleUploadActions from "@/redux/slices/fileupload/singleFileUpload";

jest.mock("@/components/Fields/CustomDateTimePicker", () => {
  const MockCustomDateTimePicker = (props: any) => (
    <input
      data-testid={props.name}
      type="datetime-local"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
  MockCustomDateTimePicker.displayName = "MockCustomDateTimePicker";
  return MockCustomDateTimePicker;
});
jest.mock("@/components/Fields/CustomTextField", () => {
  const MockCustomTextField = (props: any) => (
    <input data-testid={props.name} {...props} />
  );
  MockCustomTextField.displayName = "MockCustomTextField";
  return MockCustomTextField;
});
jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
    singleFileUpload: jest.fn(() => ({ type: "MOCK_SINGLE_FILE_UPLOAD" })),
 clearState: jest.fn(() => ({ type: "CLEAR_STATE" })),
}));
   const onCloseMock = jest.fn();
const defaultEditData = {
  source: "External",
  policeIDNo: "12345",
  nationalTeamMember: "Y",
  externalClubs: "Test Club",
  resultsAndAchievements: "Won gold",
  individualTrainingPlan: "Weekly training",
  permissionStartDate: moment().toISOString(),
  permissionEndDate: moment().add(1, "day").toISOString(),
  permissionTime: "2 hours",
  permissionType: "Hours",
  attachmentList: [],
};

describe("AdditionalDetailsInfo Component", () => {
    
  it("renders form fields and loads default values", () => {
    renderWithProviders(
      <AdditionalDetailsInfo id={1} onClose={jest.fn()} editData={defaultEditData} />
    );
     const dropdowns = screen.getAllByRole("combobox");
          const sourceDropdown = dropdowns.find((el) =>
            el.getAttribute("id")?.includes("source")
          );
           expect(sourceDropdown).toBeInTheDocument();
          const permissionTimeDropdown = dropdowns.find((el) =>
            el.getAttribute("id")?.includes("permissionTime")
          );
          expect(permissionTimeDropdown).toBeInTheDocument();
           expect(sourceDropdown).toBeInTheDocument();
          const permissionType = dropdowns.find((el) =>
            el.getAttribute("id")?.includes("permissionType")
          );
          expect(permissionType).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Police ID Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter External Clubs")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Results and Achievements")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Individual Training Plan")).toBeInTheDocument();
  });

  it("shows error when end date is before start date", async () => {
    const editDataWithInvalidDates = {
      ...defaultEditData,
      permissionStartDate: moment().toISOString(),
      permissionEndDate: moment().subtract(1, "day").toISOString(),
    };

    renderWithProviders(
      <AdditionalDetailsInfo id={1} onClose={jest.fn()} editData={editDataWithInvalidDates} />
    );

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Training End Date cannot be earlier than Start Date")
      ).toBeInTheDocument();
    });
  });

  it("renders snackbar on successful update", async () => {
    renderWithProviders(
      <AdditionalDetailsInfo id={1} onClose={jest.fn()} editData={defaultEditData} />,
      {
        athleteUpdateByID: {
          code: 200,
          status: "succeeded",
          loading: false,
          message: "Success",
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
    });
  });

  it("calls onClose when cancel button is clicked", () => {
 
    renderWithProviders(
      <AdditionalDetailsInfo id={1} onClose={onCloseMock} editData={defaultEditData} />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCloseMock).toHaveBeenCalledWith(false);
  });
  it("calls file input click when Upload Contract Typography is clicked-handleIdClick()", async () => {
      const clickSpy = jest
        .spyOn(HTMLInputElement.prototype, "click")
        .mockImplementation(() => {});
  
      renderWithProviders(<AdditionalDetailsInfo id={1} onClose={onCloseMock} editData={defaultEditData} />);
  
      const uploadText = await screen.findByText(/Upload Contract/i);
      await userEvent.click(uploadText);
  
      expect(clickSpy).toHaveBeenCalled();
  
      clickSpy.mockRestore();
    });
    it("calls file input click when Upload Contracts : PDF format(max size 25MB) Typography is clicked-handleExternalClubClick()", async () => {
      const clickSpy = jest
        .spyOn(HTMLInputElement.prototype, "click")
        .mockImplementation(() => {});
  
      renderWithProviders(<AdditionalDetailsInfo id={1} onClose={onCloseMock} editData={defaultEditData} />);
  
      const uploadText = await screen.findByText(/Upload Contracts/i);
      await userEvent.click(uploadText);
  
      expect(clickSpy).toHaveBeenCalled();
  
      clickSpy.mockRestore();
    });
     it("dispatches clearState when singleUpload.code is 200", () => {
    const clearStateSpy = singleUploadActions.clearState;

    renderWithProviders(<AdditionalDetailsInfo  id={1} onClose={onCloseMock} editData={defaultEditData} />, {
      singleUpload: {
        code: 200,
        loading: false,
        message: "File uploaded successfully",
      },
    });

    expect(clearStateSpy).toHaveBeenCalled(); // ✅ check if dispatched
  });
});

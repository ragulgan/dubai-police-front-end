import PhysicalAndMedicalInfoForm from "@/components/Forms/PhysicalAndMedicalInfoForm";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as singleUploadActions from "@/redux/slices/fileupload/singleFileUpload";
import { renderWithProviders } from "../../../__mocks__/store";
import React from "react";


jest.mock("@/redux/slices/fileupload/singleFileUpload", () => ({
    singleFileUpload: jest.fn(() => ({ type: "MOCK_SINGLE_FILE_UPLOAD" })),
 clearState: jest.fn(() => ({ type: "CLEAR_STATE" })),
}));
jest.mock("@/redux/slices/fileupload/deleteFile", () => ({
  deleteFile: jest.fn(),
}));
describe("PhysicalAndMedicalInfoForm - Height Field", () => {
 const defaultProps = {
  id: 1,
  onClose: jest.fn(),
  editData: {
    attachmentList: [
      {
        fileID: "file-123",
        documentSection: "license",
      },
    ],
  },
};

 it("renders input field", () => {
    renderWithProviders(<PhysicalAndMedicalInfoForm {...defaultProps} />);
    expect(screen.getByPlaceholderText("Enter Height")).toBeInTheDocument();
     expect(screen.getByPlaceholderText("Enter Weight")).toBeInTheDocument();
       expect(screen.getByPlaceholderText("Enter Previous Injuries")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Federation License")).toBeInTheDocument();
  });

  it("shows validation error when height/Weight is empty and form is submitted", async () => {
    renderWithProviders(<PhysicalAndMedicalInfoForm {...defaultProps} />);
    const submitBtn = screen.getByRole("button", { name: /update/i });
    await userEvent.clear(screen.getByPlaceholderText("Enter Height"));
    await userEvent.click(submitBtn);
    await waitFor(() =>{
      expect(screen.getByText(/Height is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Weight is required/i)).toBeInTheDocument()});
 
  });

  it("shows pattern error when height has invalid format", async () => {
    renderWithProviders(<PhysicalAndMedicalInfoForm {...defaultProps} />);
    const heightInput = screen.getByPlaceholderText("Enter Height");

    await userEvent.type(heightInput, "abc");

    const submitBtn = screen.getByRole("button", { name: /update/i });
    await userEvent.click(submitBtn);

    await waitFor(() =>
      expect(
        screen.getByText(
          "Invalid format. Please use the correct format, e.g.,168.21"
        )
      ).toBeInTheDocument()
    );
  });

  it("shows error when height exceeds 255", async () => {
    renderWithProviders(<PhysicalAndMedicalInfoForm {...defaultProps} />);
    const heightInput = screen.getByPlaceholderText("Enter Height");

    await userEvent.clear(heightInput);
    await userEvent.type(heightInput, "300");

    const submitBtn = screen.getByRole("button", { name: /update/i });
    await userEvent.click(submitBtn);

    await waitFor(() =>
      expect(
        screen.getByText("Height cannot exceed 255 cm")
      ).toBeInTheDocument()
    );
  });

  it("accepts valid height", async () => {
    renderWithProviders(<PhysicalAndMedicalInfoForm {...defaultProps} />);
    const heightInput = screen.getByPlaceholderText("Enter Height");

    await userEvent.clear(heightInput);
    await userEvent.type(heightInput, "180");

    expect(heightInput).toHaveValue("180");
  });
it("calls file input click when Upload License Certificate Typography is clicked-handleExternalClubClick()", async () => {
    const clickSpy = jest
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    renderWithProviders(<PhysicalAndMedicalInfoForm  />);

    const uploadText = await screen.findByText(/Upload License Certificate/i);
    await userEvent.click(uploadText);

    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

   it("renders success CustomSnackbar when snackbarStatus is 'success'", async () => {
    const customState = {
      athleteUpdateByID: {
        code: 200,
        status: "succeeded",
        loading: false,
        message: "Staff member updated successfully!",
      },
    };
    const onCloseMock = jest.fn();
    renderWithProviders(<PhysicalAndMedicalInfoForm onClose={onCloseMock} />, customState);

    // Wait for snackbar to show
    await waitFor(() => {
      expect(screen.getByText(/Staff member updated successfully!/i)).toBeInTheDocument();
      
 
    });
  });
it("renders error CustomSnackbar when snackbarStatus is 'error'", async () => {
    const customState = {
      athleteUpdateByID: {
        code: 500,
        status: "failed",
        loading: false,
        message: "Something went wrong",
      },
    };

    const onCloseMock = jest.fn();

    renderWithProviders(<PhysicalAndMedicalInfoForm onClose={onCloseMock} />, customState);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
  it('calls props.onClose(false) when "Cancel" button is clicked', async () => {
    const onCloseMock = jest.fn();

    renderWithProviders(<PhysicalAndMedicalInfoForm onClose={onCloseMock} />); 

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledWith(false);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
  it("dispatches clearState when singleUpload.code is 200", () => {
    const clearStateSpy = singleUploadActions.clearState;

    renderWithProviders(<PhysicalAndMedicalInfoForm />, {
      singleUpload: {
        code: 200,
        loading: false,
        message: "File uploaded successfully",
      },
    });

    expect(clearStateSpy).toHaveBeenCalled(); // ✅ check if dispatched
  });


});
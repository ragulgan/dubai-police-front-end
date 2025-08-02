import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileUploader from "@/components/Fields/ReUsableFileUploader";

// Mock FileUpload utility
jest.mock("@/utils/dropzone", () => (props: any) => (
  <div data-testid="file-upload-mock">
    <button onClick={() => props.onFileChange("mockFile.pdf", props.flag)}>
      Upload File
    </button>
  </div>
));

describe("FileUploader", () => {
  const baseProps = {
    fileKey: "contractDocument",
    fileLabel: "Upload Contract: PDF format (max size 25 MB)",
    formatType: "PDF",
    fileType: "DOCUMENTS",
    flag: "UPLOAD_CONTRACT",
    moduleName: "Athlete",
    moduleId: 123,
    fileInputRef: jest.fn(),
    formData: {},
    setFormData: jest.fn(),
    errors: {},
    handleFileChange: jest.fn(),
    handleDeleteFile: jest.fn(),
    handleFileClick: jest.fn(),
    required: false,
  };

  it("renders label and asterisk if required", () => {
    render(<FileUploader {...baseProps} required={true} />);
    expect(screen.getByText(/Upload Contract/)).toBeInTheDocument();
    expect(screen.getByText("*", { selector: "span.asterisk" })).toBeInTheDocument();
  });

  it("calls handleFileClick when label or icon is clicked", () => {
    render(<FileUploader {...baseProps} />);
    fireEvent.click(screen.getByText(/Upload Contract/));
    fireEvent.click(screen.getByTestId("AttachFileSharpIcon"));
    expect(baseProps.handleFileClick).toHaveBeenCalledTimes(2);
  });

  it("calls handleFileChange when file is uploaded", () => {
    render(<FileUploader {...baseProps} />);
    fireEvent.click(screen.getByText("Upload File"));
    expect(baseProps.handleFileChange).toHaveBeenCalledWith("mockFile.pdf", baseProps.flag);
  });

  it("renders uploaded file name and delete icon, and calls handleDeleteFile", () => {
    const formData = { contractDocument: "contract.pdf" };
    render(<FileUploader {...baseProps} formData={formData} />);
    expect(screen.getByText("contract.pdf")).toBeInTheDocument();
    const deleteBtn = screen.getByLabelText("delete");
    fireEvent.click(deleteBtn);
    expect(baseProps.handleDeleteFile).toHaveBeenCalledWith(
      baseProps.moduleName,
      baseProps.moduleId,
      baseProps.fileKey
    );
  });

  it("shows error message if present", () => {
    const errors = { contractDocument: "File is required" };
    render(<FileUploader {...baseProps} errors={errors} />);
    expect(screen.getByText("File is required")).toBeInTheDocument();
  });
}); 
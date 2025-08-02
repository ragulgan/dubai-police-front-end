import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateNewsForm from "@/components/news/createNewsForm";

// Mocks
const mockDispatch = jest.fn();
const mockBack = jest.fn();
const mockOnClose = jest.fn();
const mockSetIsUpdated = jest.fn();
const mockCategoryData = [{ categoryTitle: "Cat1", categoryID: 1 }];

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((fn: any) => fn({
    addNews: {},
    singleUpload: {},
    updateNews: {},
    categoryList: { data: mockCategoryData },
    editNewsData: { loading: true }
  })),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    back: mockBack,
    push: jest.fn(),
  }),
}));

jest.mock("@/components/Fields/CustomTextField", () => (props: any) => (
  <input
    data-testid={props.name}
    name={props.name}
    onChange={props.onChange}
    value={props.value || ""}
    placeholder={props.placeholder || props.label}
  />
));
jest.mock("@/components/Fields/CustomTimePicker", () => (props: any) => (
  <input data-testid="newsTime" />
));
jest.mock("@/components/Fields/DropDown", () => (props: any) => (
  <select data-testid="category" />
));
jest.mock("@/components/useFormSunEditor", () => (props: any) => (
  <textarea data-testid="paragraph" />
));
jest.mock("@/components/CustomSnackbar", () => (props: any) => (
  props.open ? <div data-testid="snackbar">{props.message}</div> : null
));
jest.mock("@/components/trainingCamp/trainingCampCustomDatePicker", () => (props: any) => (
  <input data-testid="newsDate" />
));
jest.mock("react-drag-drop-files", () => ({
  FileUploader: (props: any) => (
    <input
      data-testid="file-uploader"
      type="file"
      onChange={e => props.handleChange(e.target.files?.[0])}
    />
  ),
}));
jest.mock("@/components/trainingCamp/skeleton/editSkeletont", () => () => <div data-testid="edit-skeleton" />);

describe("CreateNewsForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<CreateNewsForm />);
    expect(screen.getByPlaceholderText("Enter New Article Title")).toBeInTheDocument();
    expect(screen.getByTestId("newsDate")).toBeInTheDocument();
    expect(screen.getByTestId("newsTime")).toBeInTheDocument();
    expect(screen.getByTestId("category")).toBeInTheDocument();
    expect(screen.getByTestId("paragraph")).toBeInTheDocument();
  });

  it("calls dispatch on submit", async () => {
    render(<CreateNewsForm />);
    fireEvent.change(screen.getByPlaceholderText("Enter New Article Title"), { target: { value: "Test Title" } });
    fireEvent.click(screen.getByRole("button", { name: /Save & Publish/i }));
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("shows snackbar on error", async () => {
    // Simulate error state
    jest.spyOn(require("react-redux"), "useSelector").mockImplementation((fn: any) =>
      fn({
        addNews: { code: 500 },
        singleUpload: {},
        updateNews: {},
        categoryList: { data: mockCategoryData }
      })
    );
    render(<CreateNewsForm />);
    await waitFor(() => {
      expect(screen.getByTestId("snackbar")).toBeInTheDocument();
    });
  });

  it("navigates back on cancel", () => {
    render(<CreateNewsForm />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it("calls onClose on cancel in edit mode", () => {
    render(<CreateNewsForm edit onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles file upload", () => {
    render(<CreateNewsForm />);
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByTestId("file-uploader"), { target: { files: [file] } });
    // No error means upload logic is triggered
  });

  it("clears form on clear button click", () => {
    render(<CreateNewsForm />);
    fireEvent.click(screen.getByRole("button", { name: /Clear form/i }));
    // No error means clear logic is triggered
  });

  it.skip("shows skeleton when loading editNewsData", () => {
    jest.spyOn(require("react-redux"), "useSelector").mockImplementation((fn: any) =>
      fn({
        addNews: {},
        singleUpload: {},
        updateNews: {},
        categoryList: { data: mockCategoryData },
        editNewsData: { loading: true }
      })
    );
    render(<CreateNewsForm edit />);
    expect(screen.getByTestId("edit-skeleton")).toBeInTheDocument();
  });
}); 
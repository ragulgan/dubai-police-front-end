import React from "react";
import { renderWithProviders } from "../../__mocks__/store";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import UserCreation from "@/components/UserCreation";
import "@testing-library/jest-dom";

// Mock next/router
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Axios
jest.mock("@/utils/AxiosInterceptor", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));
import Axios from "@/utils/AxiosInterceptor";

describe("UserCreation", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    setOpen: jest.fn(),
    teamID: "123",
    module: "athletes",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal and basic UI", () => {
    renderWithProviders(<UserCreation {...defaultProps} />);
    expect(screen.getByText(/Add Athlete to the System/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by Employee ID/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Add New Collaborator/i })).toBeInTheDocument();
  });

  it("calls onClose when close icon is clicked", () => {
    renderWithProviders(<UserCreation {...defaultProps} />);
    const closeBtn = screen.getAllByRole("button").find(btn => btn.innerHTML.includes("svg"));
    fireEvent.click(closeBtn!);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows search results and allows selection", async () => {
    (Axios.post as jest.Mock).mockResolvedValue({
      responseCode: 200,
      data: [
        { employeeNo: "E001", fullNameA: "John Doe" },
        { employeeNo: "E002", fullNameA: "Jane Smith" },
      ],
    });
    renderWithProviders(<UserCreation {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Search by Employee ID/i);
    fireEvent.change(input, { target: { value: "E" } });
    await waitFor(() => expect(Axios.post).toHaveBeenCalled());
    expect(await screen.findByText("E001")).toBeInTheDocument();
    expect(screen.getByText("E002")).toBeInTheDocument();
    fireEvent.click(screen.getByText("E001"));
    expect(screen.getByRole("button", { name: /Continue/i })).toBeEnabled();
  });

  it("shows error for duplicate entry", async () => {
    (Axios.post as jest.Mock).mockResolvedValue({
      responseCode: 409,
      data: [],
    });
    renderWithProviders(<UserCreation {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Search by Employee ID/i);
    fireEvent.change(input, { target: { value: "DUPLICATE" } });
    await waitFor(() => expect(Axios.post).toHaveBeenCalled());
    expect(await screen.findByText(/Duplicate Entry Not Allowed/i)).toBeInTheDocument();
    // expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });

  it("shows no results found for empty data", async () => {
    (Axios.post as jest.Mock).mockResolvedValue({
      responseCode: 200,
      data: [],
    });
    renderWithProviders(<UserCreation {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Search by Employee ID/i);
    fireEvent.change(input, { target: { value: "ZZZ" } });
    await waitFor(() => expect(Axios.post).toHaveBeenCalled());
    expect(await screen.findByText(/No results found/i)).toBeInTheDocument();
  });

  it("navigates to correct route on Continue", async () => {
    (Axios.post as jest.Mock).mockResolvedValue({
      responseCode: 200,
      data: [
        { employeeNo: "E001", fullNameA: "John Doe" },
      ],
    });
    renderWithProviders(<UserCreation {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Search by Employee ID/i);
    fireEvent.change(input, { target: { value: "E001" } });
    await waitFor(() => expect(Axios.post).toHaveBeenCalled());
    fireEvent.click(screen.getByText("E001"));
    const continueBtn = screen.getByRole("button", { name: /Continue/i });
    fireEvent.click(continueBtn);
    expect(mockPush).toHaveBeenCalledWith(
      `/teams/123/athletes/add?selectedEmployee=E001`
    );
  });

  it("navigates to add new collaborator", () => {
    renderWithProviders(<UserCreation {...defaultProps} />);
    const addBtn = screen.getByRole("button", { name: /Add New Collaborator/i });
    fireEvent.click(addBtn);
    expect(mockPush).toHaveBeenCalledWith(`/teams/123/athletes/add`);
  });
}); 
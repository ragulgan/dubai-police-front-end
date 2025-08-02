import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccessDeniedPage from "../../../pages/access-denied/index";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AccessDeniedPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Access Denied message", () => {
    render(<AccessDeniedPage />);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(
      screen.getByText("You do not have permission to view this page.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Go to Dashboard/i })
    ).toBeInTheDocument();
  });

  it("navigates to /dashboard on button click", () => {
    render(<AccessDeniedPage />);
    const button = screen.getByRole("button", { name: /Go to Dashboard/i });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useRouter } from "next/router";
import '@testing-library/jest-dom';
import QuickAccessCard from "@/components/quickAccess/quickAccessCard";

// Mock the router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/UserCreation", () => {
  return function MockUserCreation(props: any) {
    return props.open ? (
      <div data-testid="user-creation-dialog">
        UserCreation Opened
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null;
  };
});

// Dummy Icon Component
const DummyIcon = () => <svg data-testid="dummy-icon" />;

describe("QuickAccessCard", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { teamID: "team-123" },
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the card with profile name and icon", () => {
    render(<QuickAccessCard Profile={{ name: "Add Staff", icon: DummyIcon }} />);

    expect(screen.getByText("Add Staff")).toBeInTheDocument();
    expect(screen.getByTestId("dummy-icon")).toBeInTheDocument();
  });

 it("opens UserCreation dialog on Add Staff click", async () => {
  render(<QuickAccessCard Profile={{ name: "Add Staff", icon: DummyIcon }} />);
  const card = screen.getByText("Add Staff").closest("div");
  await userEvent.click(card!);

  expect(screen.getByTestId("user-creation-dialog")).toBeInTheDocument();
});
  it("opens UserCreation dialog on Add Athlete click", async () => {
    render(<QuickAccessCard Profile={{ name: "Add Athlete", icon: DummyIcon }} />);
    
    const card = screen.getByText("Add Athlete").closest("div");
    await userEvent.click(card!);

    expect(screen.getByTestId("user-creation-dialog")).toBeInTheDocument();
  });

  it("navigates to profile path when name is not Add Staff/Athlete", async () => {
    const profile = { name: "Team Overview", path: "/dashboard/team", icon: DummyIcon };
    render(<QuickAccessCard Profile={profile} />);

    const card = screen.getByText("Team Overview").closest("div");
    await userEvent.click(card!);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/team");
  });
  it("closes the UserCreation dialog when onClose is triggered", async () => {
  render(<QuickAccessCard Profile={{ name: "Add Staff", icon: DummyIcon }} />);
  
  // Open the dialog
  const card = screen.getByText("Add Staff").closest("div");
  await userEvent.click(card!);

  // Ensure dialog is open
  expect(screen.getByTestId("user-creation-dialog")).toBeInTheDocument();

  // Click the "Close" button in mock dialog
  const closeButton = screen.getByText("Close");
  await userEvent.click(closeButton);

  // The dialog should be closed (removed from DOM)
  expect(screen.queryByTestId("user-creation-dialog")).not.toBeInTheDocument();
});
});

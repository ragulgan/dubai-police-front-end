import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { useRouter } from "next/router";
import RewardsAdd from "@/components/rewards/add/rewardsAdd";
import { renderWithProviders } from "../../../../__mocks__/store";
import userEvent from "@testing-library/user-event";
import * as reactRedux from "react-redux";
import moment from "moment";
import { useForm } from "react-hook-form";
// Mocks
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/teams/1/rewards/add"),
}));

jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "1"),
  safeJSONParse: jest.fn((data) => data),
}));
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,

    useFieldArray: () => ({
      fields: [{ id: "1" }],
      append: jest.fn(),
      remove: jest.fn(),
    }),
  };
});

describe("RewardsAdd Component", () => {
  const pushMock = jest.fn();
  const defaultProps = {
    edit: false,
    id: null,
    onClose: jest.fn(),
    setIsUpdated: jest.fn(),
    rewardsEditresponse: { loading: false, data: [] },
  };

  const mockRewardsDataOption = [
    { label: "Medal", value: 1 },
    { label: "Trophy", value: 2 },
  ];
  const mockState = {
    getRewardsTypeList: {
      code: 200,
      data: mockRewardsDataOption,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: { teamID: "1" },
      push: pushMock,
    });
  });
 
  it("accepts valid numeric input", async () => {
      renderWithProviders(<RewardsAdd {...defaultProps} />);
  const input =  screen.getByPlaceholderText(/Enter Price Money/i)

    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText("Only numberics are allowed")).not.toBeInTheDocument();
      expect(screen.queryByText("Price Money cannot exceed 9 characters")).not.toBeInTheDocument();
    });
  });
  it("renders the form and form fields correctly", () => {
    renderWithProviders(<RewardsAdd {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(/Enter Reward Name/i)
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter Result/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter Price Money/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Specify other reward/i)
    ).toBeInTheDocument();

    const dropdowns = screen.getAllByRole("combobox");
    const athleteDropdown = dropdowns.find((el) =>
      el.getAttribute("id")?.includes("athleteName")
    );
    expect(athleteDropdown).toBeInTheDocument();
    expect(screen.getByLabelText(/Team/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Estimated Time: 1.5 minutes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Create Reward/i)).toBeInTheDocument();
  });
  it("disables athlete dropdown when Team is selected", async () => {
    renderWithProviders(<RewardsAdd {...defaultProps} />);
    const teamRadio = screen.getByLabelText(/Team/i);

    fireEvent.click(teamRadio);

    await waitFor(() => {
      expect(screen.getByLabelText(/Team/i)).toBeChecked();
    });

    const dropdowns = screen.getAllByRole("combobox");
    const athleteDropdown = dropdowns.find((el) =>
      el.getAttribute("id")?.includes("athleteName")
    );

    expect(athleteDropdown).toBeInTheDocument();
    expect(athleteDropdown).toHaveAttribute("aria-disabled", "true");
  });

  it("shows validation errors on empty submit", async () => {
    renderWithProviders(<RewardsAdd {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /Create Reward/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/is required/i).length).toBeGreaterThan(0);
    });
  });

  it("calls onClose and dispatches clearEditState on cancel in edit mode", async () => {
    const onCloseMock = jest.fn();

    renderWithProviders(
      <RewardsAdd
        {...defaultProps}
        edit={true}
        onClose={onCloseMock}
        rewardsEditresponse={{ loading: false, data: [] }}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("navigates back to rewards page on cancel in add mode", async () => {
    renderWithProviders(<RewardsAdd {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/teams/1/rewards");
    });
  });

  it("submits form with minimum required fields", async () => {
    renderWithProviders(<RewardsAdd {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Enter Reward Name"), {
      target: { value: "Test Reward" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Result"), {
      target: { value: "1st Place" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Price Money"), {
      target: { value: "10000" },
    });

    fireEvent.change(screen.getByPlaceholderText("Specify other reward"), {
      target: { value: "Gift Voucher" },
    });

    const submit = screen.getByRole("button", { name: /Create Reward/i });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(
        screen.queryByText(/Reward Name is required/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Result is required/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Price Money is required/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/other reward is required/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Specify other reward is required/i)
      ).not.toBeInTheDocument();
    });
  });
});

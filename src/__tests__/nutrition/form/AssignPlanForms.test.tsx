import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AssignPlanForms from "@/components/nutrition/form/assignPlanForms";
import { renderWithProviders } from "../../../../__mocks__/store";
import { useDispatch } from "react-redux";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(), // 👈 turn useDispatch into a mock function
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({ query: {}, push: jest.fn() })),
}));

jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "123"), // mock sportID
  safeJSONParse: jest.fn((data) => data),
}));

describe("AssignPlanForm", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // ✅ this works now because we mocked useDispatch above
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it("renders all necessary fields", () => {
    renderWithProviders(<AssignPlanForms />, {
      getAthleteList: { data: [{ id: 1, fullName: "Athlete A" }], loading: false },
      getPlanList: { data: [{ id: 1, planName: "Plan A" }], loading: false },
      addNutrition: { loading: false, code: 200, message: "Added" },
      getNotificationModuleByID: { data: {}, loading: false },
    });

    expect(screen.getByPlaceholderText(/Weight is auto-filled/i)).toBeInTheDocument();
    
  
    expect(screen.getByPlaceholderText(/Weight is auto-filled/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Height is auto-filled/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Nutritionist Comment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    
  });
  it("should call router.back() when Cancel button is clicked", async () => {
    const mockBack = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
      query: {},
      push: jest.fn(),
    });
  renderWithProviders(<AssignPlanForms />, {
      getAthleteList: { data: [{ id: 1, fullName: "Athlete A" }], loading: false },
      getPlanList: { data: [{ id: 1, planName: "Plan A" }], loading: false },
      addNutrition: { loading: false, code: 200, message: "Added" },
      getNotificationModuleByID: { data: {}, loading: false },
    });


    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockBack).toHaveBeenCalled();
  });
 it("should show success snackbar when status is success", () => {
    const customState = {
      getAthleteList: { data: [] },
      getPlanList: { data: [] },
      addNutrition: {
        code: 200,
        status: "succeeded",
        data: { nutritionID: 1 },
        loading: false,
      },
      getNotificationModuleByID: {
        code: 200,
        data: [{ message: "Nutrition plan assigned successfully!" }],
        loading: false,
      },
    };
    renderWithProviders(<AssignPlanForms />, customState);
    expect(
      screen.getByText(/Nutrition Plan Added successfully!/i)
    ).toBeInTheDocument();
  });
it.skip("should show error snackbar when status is error", async () => {
  renderWithProviders(<AssignPlanForms />, {
    getAthleteList: { data: [] },
    getPlanList: { data: [] },
    addNutrition: {
      loading: false,
      code: 500,
      message: "Error",
    },
    getNotificationModuleByID: {
      data: [{ message: "Something went wrong!" }],
      loading: false,
    },
  });

  await waitFor(() => {
    expect(
      screen.getByText((content) => content.includes("Something went wrong"))
    ).toBeInTheDocument();
  });
});

});

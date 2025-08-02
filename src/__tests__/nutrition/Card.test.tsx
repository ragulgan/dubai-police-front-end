import React from "react";
import { screen } from "@testing-library/react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { renderWithProviders } from "../../../__mocks__/store";
import CardView from "@/components/nutrition/card";
import userEvent from "@testing-library/user-event";
import { checkAccess } from "@/utils/acessscheck";
import * as nextRouter from "next/router";

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
  }),
}));

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(() => true),
}));

const theme = createTheme();

const mockNutritionData = [
  {
    nutritionID: 1,
    athleteFirstName: "John",
    athleteMiddleName: "A.",
    athleteSurName: "Doe",
    athleteProfileImage: "",
    planName: "Weight Loss Plan",
    startDate: "2024-01-01",
    endDate: "2024-06-01",
    bmi: 23.5,
    sportID: "2",
  },
];

describe("CardView", () => {
  it("renders skeletons when isLoading is true", () => {
    renderWithProviders(
      <ThemeProvider theme={theme}>
        <CardView data={[]} isLoading={true} isEdit={jest.fn()} module="nutrition-grid" />
      </ThemeProvider>
    );
     const skeletons = document.querySelectorAll(".MuiSkeleton-root");
       expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders nutrition card when data is present", () => {
    renderWithProviders(
      <ThemeProvider theme={theme}>
        <CardView data={mockNutritionData} isLoading={false} isEdit={jest.fn()} module="nutrition-grid" />
      </ThemeProvider>
    );

    expect(screen.getByText("John A. Doe")).toBeInTheDocument();
    expect(screen.getByText("Weight Loss Plan")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01 - 2024-06-01")).toBeInTheDocument();
    expect(screen.getByText("BMI Value")).toBeInTheDocument();
  });

  it("shows 'No record(s) found' when data is empty", () => {
    renderWithProviders(
      <ThemeProvider theme={theme}>
        <CardView data={[]} isLoading={false} isEdit={jest.fn()} module="nutrition-grid" />
      </ThemeProvider>
    );

    expect(screen.getByText(/No record\(s\) found/i)).toBeInTheDocument();
  });

});
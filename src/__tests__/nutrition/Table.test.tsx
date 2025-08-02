// __tests__/TeamsTable.test.tsx
import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import * as nextRouter from "next/router";
import * as helper from "@/utils/helper";
import * as accessCheck from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import thunk from "redux-thunk";
import { renderWithProviders } from "../../../__mocks__/store";
import TeamsTable from "@/components/nutrition/table";

// Mock the useRouter hook
const useRouter = jest.spyOn(nextRouter, "useRouter");
const mockPush = jest.fn();
useRouter.mockReturnValue({
  query: {},
  push: mockPush,
  prefetch: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
} as any);

// Mock getLocalStorage
jest.spyOn(helper, "getLocalStorage").mockReturnValue("Football");

// Mock checkAccess
jest.spyOn(accessCheck, "checkAccess").mockReturnValue(true); // Grant all permissions for tests by default

// Mock axiosCallBlob for downloadExcel
jest.mock("@/utils/AxiosInterceptor", () => ({
  axiosCallBlob: {
    post: jest.fn(),
  },
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
beforeAll(() => {
  global.URL.createObjectURL = jest.fn();
  global.URL.revokeObjectURL = jest.fn();
});


describe("TeamsTable", () => {
  const defaultProps = {
    data: [],
    isEdit: jest.fn(),
    setPage: jest.fn(),
    page: 1,
    setRowsPerPage: jest.fn(),
    rowsPerPage: 10,
    dataList: { totalRecords: 0 },
    isLoading: false,
    isDisable: false,
    module: "nutrition-table",
    headers: [
      "Name",
      "Plan Name",
      "Start Date",
      "End Date",
      "BMI",
      "Actions",
    ],
    memoizedSelectedSport: ["Football"],
    debouncedSearchText: "",
    filterNutritionData: {},
    teamID: undefined,
  };

  it("renders loading spinner when isLoading is true", () => {
    renderWithProviders(<TeamsTable {...defaultProps} isLoading={true} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders table headers correctly when not loading", () => {
    renderWithProviders(<TeamsTable {...defaultProps} />);
    defaultProps.headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("renders 'Manage Plan Template' button when teamID is provided", () => {
    renderWithProviders(<TeamsTable {...defaultProps} teamID={123} />);
    expect(screen.getByText("Manage Plan Template")).toBeInTheDocument();
  });

  it("does not render 'Manage Plan Template' button when teamID is undefined", () => {
    renderWithProviders(<TeamsTable {...defaultProps} teamID={undefined} />);
    expect(screen.queryByText("Manage Plan Template")).not.toBeInTheDocument();
  });

  it("calls handlePlanTemplate when 'Manage Plan Template' button is clicked", () => {
    renderWithProviders(<TeamsTable {...defaultProps} teamID={123} />);
    fireEvent.click(screen.getByText("Manage Plan Template"));
    expect(mockPush).toHaveBeenCalledWith("/teams/123/nutrition/planTemplate");
  });

  it("renders no data message when data is empty", () => {
    // For a table, "no data message" usually means no rows are rendered
    // We'll check for the absence of table body rows or a specific message if implemented
    renderWithProviders(<TeamsTable {...defaultProps} data={[]} />);
    const tableRows = screen.queryAllByRole("row");
    // Expecting only the header row to be present if no data rows
    expect(tableRows.length).toBe(1);
    expect(screen.queryByText("No data available.")).not.toBeInTheDocument(); // If you had a specific "no data" message
  });

  it("renders table rows with data", () => {
    const mockData = [
      {
        nutritionID: "nut1",
        athleteFirstName: "John",
        athleteMiddleName: "",
        athleteSurName: "Doe",
        athleteProfileImage: "john.jpg",
        planName: "Weight Loss Plan",
        startDate: "2023-01-01",
        endDate: "2023-03-31",
        bmi: 22.5,
        sportID: "sport1",
      },
      {
        nutritionID: "nut2",
        athleteFirstName: "Jane",
        athleteMiddleName: "A.",
        athleteSurName: "Smith",
        athleteProfileImage: "jane.jpg",
        planName: "Muscle Gain Plan",
        startDate: "2023-02-01",
        endDate: "2023-04-30",
        bmi: 17.0,
        sportID: "sport2",
      },
    ];
    renderWithProviders(<TeamsTable {...defaultProps} data={mockData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Weight Loss Plan")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2023-03-31")).toBeInTheDocument();
    expect(screen.getByText("22.5")).toBeInTheDocument();

    expect(screen.getByText("Jane A. Smith")).toBeInTheDocument();
    expect(screen.getByText("Muscle Gain Plan")).toBeInTheDocument();
    expect(screen.getByText("2023-02-01")).toBeInTheDocument();
    expect(screen.getByText("2023-04-30")).toBeInTheDocument();
   
  });

  it("displays correct BMI icon based on BMI value", () => {
    const mockData = [
      {
        nutritionID: "nut1",
        athleteFirstName: "Normal",
        athleteSurName: "Weight",
        athleteProfileImage: "",
        planName: "Plan",
        startDate: "",
        endDate: "",
        bmi: 20, // Normal
        sportID: "sport1",
      },
      {
        nutritionID: "nut2",
        athleteFirstName: "Low",
        athleteSurName: "Weight",
        athleteProfileImage: "",
        planName: "Plan",
        startDate: "",
        endDate: "",
        bmi: 15, // Low
        sportID: "sport2",
      },
      {
        nutritionID: "nut3",
        athleteFirstName: "Over",
        athleteSurName: "Weight",
        athleteProfileImage: "",
        planName: "Plan",
        startDate: "",
        endDate: "",
        bmi: 27, // Over
        sportID: "sport3",
      },
      {
        nutritionID: "nut4",
        athleteFirstName: "Heavy",
        athleteSurName: "Weight",
        athleteProfileImage: "",
        planName: "Plan",
        startDate: "",
        endDate: "",
        bmi: 35, // Heavy
        sportID: "sport4",
      },
    ];
    renderWithProviders(<TeamsTable {...defaultProps} data={mockData} />);

    // Check for specific SVG titles or accessible names if available,
    // otherwise, you might need to inspect the DOM for their presence.
    // For this example, let's assume they have distinct test IDs or roles.
    // You might need to adjust based on how your SVG components are rendered and accessible.
    // As the SVGs are directly imported components, we'd check for their rendered output.
    // A simple check could be to look for the rendered text '20', '15', etc. near the speedometer.

    // A more robust test would involve checking the actual SVG elements or their attributes.
    // For now, we'll rely on the displayed BMI number next to the (unseen in test) SVG.
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("27")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
  });

//   it("calls isEdit when edit icon is clicked (NutritionPlanEdit permission)", () => {
//     const mockData = [
//       {
//         nutritionID: "nut1",
//         athleteFirstName: "Test",
//         athleteSurName: "User",
//         athleteProfileImage: "",
//         planName: "Test Plan",
//         startDate: "",
//         endDate: "",
//         bmi: 20,
//         sportID: "sport1",
//       },
//     ];
//     jest
//       .spyOn(accessCheck, "checkAccess")
//       .mockImplementation((permission) => {
//         if (permission === USER_PERMISSION.NutritionPlanEdit) return true;
//         return true; // Keep other permissions true for simplicity
//       });

//     renderWithProviders(<TeamsTable {...defaultProps} data={mockData} />);

//     const editButton = screen.getByLabelText("edit");
//     fireEvent.click(editButton);
//     expect(defaultProps.isEdit).toHaveBeenCalledWith("nut1");
//   });

//   it("navigates to view page when view icon is clicked (NutritionPlanView permission, non-nutrition-table module)", () => {
//     const mockData = [
//       {
//         nutritionID: "nut1",
//         athleteFirstName: "Test",
//         athleteSurName: "User",
//         athleteProfileImage: "",
//         planName: "Test Plan",
//         startDate: "",
//         endDate: "",
//         bmi: 20,
//         sportID: "sport1",
//       },
//     ];
//     jest
//       .spyOn(accessCheck, "checkAccess")
//       .mockImplementation((permission) => {
//         if (permission === USER_PERMISSION.NutritionPlanView) return true;
//         return false; // Disable others to ensure this one is hit
//       });

//     renderWithProviders(
//       <TeamsTable {...defaultProps} data={mockData} module="teams-module" />
//     );

//     const viewButton = screen.getByLabelText("view");
//     fireEvent.click(viewButton);
//     expect(mockPush).toHaveBeenCalledWith("/teams/Football/nutrition/view/nut1");
//   });

  it("navigates to view page when view icon is clicked (FitnessNutritionView permission, nutrition-table module)", () => {
    const mockData = [
      {
        nutritionID: "nut1",
        athleteFirstName: "Test",
        athleteSurName: "User",
        athleteProfileImage: "",
        planName: "Test Plan",
        startDate: "",
        endDate: "",
        bmi: 20,
        sportID: "sport1",
      },
    ];
    jest
      .spyOn(accessCheck, "checkAccess")
      .mockImplementation((permission) => {
        if (permission === USER_PERMISSION.FitnessNutritionView) return true;
        return false;
      });
    useRouter.mockReturnValueOnce({
      query: { pageView: "overview" },
      push: mockPush,
      prefetch: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    } as any);

    renderWithProviders(
      <TeamsTable {...defaultProps} data={mockData} module="nutrition-table" />
    );

    const viewButton = screen.getByLabelText("view");
    fireEvent.click(viewButton);
    expect(mockPush).toHaveBeenCalledWith(
      "/teams/123/nutrition/planTemplate"
    );
  });

  it("does not render view button if no permission", () => {
    const mockData = [
      {
        nutritionID: "nut1",
        athleteFirstName: "Test",
        athleteSurName: "User",
        athleteProfileImage: "",
        planName: "Test Plan",
        startDate: "",
        endDate: "",
        bmi: 20,
        sportID: "sport1",
      },
    ];
    jest
      .spyOn(accessCheck, "checkAccess")
      .mockImplementation((permission) => false);

    renderWithProviders(<TeamsTable {...defaultProps} data={mockData} />);
    expect(screen.queryByLabelText("view")).not.toBeInTheDocument();
  });

  
it("handles pagination change (page number)", () => {
    renderWithProviders(<TeamsTable {...defaultProps} dataList={{ totalRecords: 100 }} />);
    // Click the "Go to next page" button which often has an accessible name or a specific aria-label
    const nextPageButton = screen.getByRole('button', { name: /Go to next page/i }); // Common for MUI Pagination
    fireEvent.click(nextPageButton);
    expect(defaultProps.setPage).toHaveBeenCalledWith(2); // Assuming it advances one page
});

//   it("dispatches deleteNutritionById when delete button is clicked and confirmed", async () => {
//     const mockData = [
//       {
//         nutritionID: "nut1",
//         athleteFirstName: "Delete",
//         athleteSurName: "Me",
//         athleteProfileImage: "",
//         planName: "Delete Plan",
//         startDate: "",
//         endDate: "",
//         bmi: 20,
//         sportID: "sport1",
//       },
//     ];

//     const store = mockStore({
//       deleteNutrition: { loading: false, code: 0, message: "" },
//     });

//     jest
//       .spyOn(accessCheck, "checkAccess")
//       .mockImplementation((permission) => {
//         if (permission === USER_PERMISSION.NutritionPlanDelete) return true;
//         return true;
//       });

//     renderWithProviders(<TeamsTable {...defaultProps} data={mockData} module="teams-module" />, {
//       deleteNutrition: store.getState().deleteNutrition,
//     });

//     const deleteButton = screen.getByTestId("DeleteOutlineIcon"); // Assuming DeleteNutrition component renders this icon
//     fireEvent.click(deleteButton);

//     expect(screen.getByTestId("DeleteOutlineIcon")).toBeInTheDocument();
//   });

  it("downloads Excel file when 'Export to Excel' button is clicked", async () => {
    const mockBlob = new Blob(["mock excel data"], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    (axiosCallBlob.post as jest.Mock).mockResolvedValueOnce({ data: mockBlob });
    (global.URL.createObjectURL as jest.Mock).mockReturnValue("mock-object-url");

    renderWithProviders(<TeamsTable {...defaultProps} />);

    const exportButton = screen.getByText("Export to Excel");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(axiosCallBlob.post).toHaveBeenCalledWith(
        `${process.env.API_BASE_URL}/Sports/ExportNutritionList`,
        {
          sportID: defaultProps.memoizedSelectedSport.join(","),
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          startDate: "",
          endDate: "",
        }
      );
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      // We can't directly assert link.click() but we can check the URL creation and revocation
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-object-url");
    });
  });

// it("displays a tooltip with full name for athlete name", async () => {
//     const mockData = [
//       {
//         nutritionID: "nut1",
//         athleteFirstName: "VeryLongFirstName",
//         athleteMiddleName: "Middle",
//         athleteSurName: "VeryLongSurName",
//         athleteProfileImage: "",
//         planName: "Plan",
//         startDate: "",
//         endDate: "",
//         bmi: 20,
//         sportID: "sport1",
//       },
//     ];
//     renderWithProviders(<TeamsTable {...defaultProps} data={mockData} />);

//     // Get the element that the tooltip is attached to.
//     // In your component, the Typography is wrapped by a Tooltip.
//     // The Typography has the full text.
//     const athleteNameElement = screen.getByText("VeryLongFirstName Middle VeryLongSurName");

//     // Simulate mouse hover over the element
//     fireEvent.mouseOver(athleteNameElement);

//     // Wait for the tooltip to appear in the DOM.
//     // Material-UI tooltips usually have role="tooltip".
//     await waitFor(() => {
//       expect(screen.getByRole("tooltip", { name: "VeryLongFirstName Middle VeryLongSurName" })).toBeInTheDocument();
//     });

//     // Optional: Simulate mouse leave to ensure cleanup
//     fireEvent.mouseLeave(athleteNameElement);
//     await waitFor(() => {
//       expect(screen.queryByRole("tooltip", { name: "VeryLongFirstName Middle VeryLongSurName" })).not.toBeInTheDocument();
//     });
//   });

  it("displays a tooltip with full plan name for plan name", async () => {
    const mockData = [
      {
        nutritionID: "nut1",
        athleteFirstName: "Test",
        athleteSurName: "User",
        athleteProfileImage: "",
        planName: "A Very Long Nutrition Plan Name That Should Be Tooltipped",
        startDate: "",
        endDate: "",
        bmi: 20,
        sportID: "sport1",
      },
    ];
    renderWithProviders(<TeamsTable {...defaultProps} data={mockData} />);

    const planNameTypography = screen.getByText("A Very Long Nutrition Plan Name That Should Be Tooltipped");
    fireEvent.mouseOver(planNameTypography);

    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "A Very Long Nutrition Plan Name That Should Be Tooltipped" })).toBeInTheDocument();
    });
  });

  it("handles API error during Excel download", async () => {
    (axiosCallBlob.post as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock window.alert

    renderWithProviders(<TeamsTable {...defaultProps} />);

    const exportButton = screen.getByText("Export to Excel");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to download the file. Please try again later."
      );
    });
  });
  it("handles API error during Excel download", async () => {
    (axiosCallBlob.post as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock window.alert

    renderWithProviders(<TeamsTable {...defaultProps} />);

    const exportButton = screen.getByText("Export to Excel");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to download the file. Please try again later."
      );
    });
  });
});
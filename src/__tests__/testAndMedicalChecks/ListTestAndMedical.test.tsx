import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { renderWithProviders } from "../../../__mocks__/store";
import { useRouter } from "next/navigation";
import TestAndMedicalsTestList from "../../components/testAndMedicalChecks/ListTestAndMedical";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(() => true),
}));

jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "mockSport"),
  getTestName: jest.fn(() => "Medical Test"),
}));

jest.mock("@/utils/AxiosInterceptor", () => ({
  axiosCallBlob: {
    post: jest.fn(() =>
      Promise.resolve({
        data: new Blob(["dummy"], { type: "application/vnd.ms-excel" }),
      })
    ),
  },
}));

const pushMock = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });

const baseProps = {
  data: [
    {
      athleteFirstName: "John",
      athleteMiddleName: "A",
      athleteSurName: "Doe",
      athleteProfileImage: "",
      testDate: "2025-07-01",
      medicalClearanceStatus: "Cleared",
      testAndMedicalChecksID: 1,
      sportID: 101,
      section: "fitness",
    },
  ],
  isEdit: jest.fn(),
  teamId: 1,
  setPage: jest.fn(),
  page: 1,
  setRowsPerPage: jest.fn(),
  rowsPerPage: 10,
  getTestAndMedicalCheckssListData: {
    loading: false,
    totalRecords: 1,
  },
  searchText: "",
  setSearchText: jest.fn(),
  handleFilterClick: jest.fn(),
  testType: "fitness",
  filterByData: [],
};

describe("TestAndMedicalsTestList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with headers", () => {
    renderWithProviders(<TestAndMedicalsTestList {...baseProps} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Last Test Date")).toBeInTheDocument();
    expect(screen.getByText("Last Test Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders a table row with athlete details", () => {
    renderWithProviders(<TestAndMedicalsTestList {...baseProps} />);
    expect(screen.getByText("John A Doe")).toBeInTheDocument();
    expect(screen.getByText("2025-07-01")).toBeInTheDocument();
  });

  it("calls isEdit handler on edit icon click", () => {
    const isEdit = jest.fn();
    renderWithProviders(
      <TestAndMedicalsTestList {...baseProps} isEdit={isEdit} />
    );
    fireEvent.click(screen.getByLabelText("edit"));
    expect(isEdit).toHaveBeenCalledWith(1, 101);
  });

  it("shows empty state when no data", () => {
    renderWithProviders(
      <TestAndMedicalsTestList {...baseProps} data={[]} />
    );
    expect(screen.getByText("No Medical Test record(s) found.")).toBeInTheDocument();
  });

  it("displays loader when loading is true", () => {
    renderWithProviders(
      <TestAndMedicalsTestList
        {...baseProps}
        getTestAndMedicalCheckssListData={{ loading: true }}
      />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("triggers export to excel button click", async () => {
    renderWithProviders(<TestAndMedicalsTestList {...baseProps} />);
    const exportButton = screen.getByRole("button", {
      name: /export to excel/i,
    });
    fireEvent.click(exportButton);

    // await waitFor(() => {
    //   expect(
    //     require("@/utils/AxiosInterceptor").axiosCallBlob.post
    //   ).toHaveBeenCalled();
    // });
  });
  it("calls router.push on view icon click", () => {
  renderWithProviders(<TestAndMedicalsTestList {...baseProps} />);

  const visibilityIcon = screen .getByLabelText("view").querySelector("svg");

  expect(visibilityIcon).toBeTruthy();

  if (visibilityIcon) fireEvent.click(visibilityIcon);

  expect(pushMock).toHaveBeenCalledWith(
    expect.stringContaining("/fitness-and-nutrition/view/fitness/")
  );
});

});
import { screen, fireEvent } from "@testing-library/react";
import TeamsTable from "@/components/tables/teamsTable";
import { renderWithProviders } from "../../../__mocks__/store";
import { useRouter } from "next/navigation";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "football"),
  safeJSONParse: jest.fn((data) => data),
}));
jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(() => true),
}));
const mockSetRowsPerPage = jest.fn();
const mockSetPage = jest.fn();
const sampleData = [
  {
    staffID: "1",
    profileImage: "/img.png",
    rank: "Captain",
    firstName: "John",
    middleName: "D.",
    surName: "Doe",
    roleValue: "Coach",
    roleShortText: "C",
    otherStaff: false,
    dob: "1990-01-01",
    personalEmail: "john@example.com",
    contractStartDate: "2023-01-01",
    contractEndDate: "2023-12-31",
    name: "Captain John D. Doe", 
    role: "Coach", 
  },
];

const headers = ["Name", "Role", "DOB", "Email", "Start", "End", "Actions"];

const defaultProps = {
  data: sampleData,
  isEdit: jest.fn(),
  setPage: jest.fn(),
  page: 1,
  setRowsPerPage: mockSetRowsPerPage,
  rowsPerPage: 10,
  dataList: { totalRecords: 1 },
  isLoading: false,
  module: "staff",
  headers,
  isHide: false,
};

describe("TeamsTable Component", () => {
  const push = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders staff row correctly", () => {
    renderWithProviders(<TeamsTable {...defaultProps} />, {
      deleteStaff: {},
    });

    expect(screen.getByText("Captain John D. Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2023-12-31")).toBeInTheDocument();
  });
  it("should trigger view icon click even if onClick is on VisibilityIcon", () => {
   renderWithProviders(<TeamsTable {...defaultProps} />, {
      deleteStaff: {},
     });

  // Access the IconButton's child svg
  const iconButton = screen.getByLabelText("view");
  const svg = iconButton.querySelector("svg");
  fireEvent.click(svg!);

  expect(push).toHaveBeenCalledWith("/teams/football/staffs/view/1");
});

  it("should navigate to correct athlete view page on view icon click", () => {
    const mockData = [
      {
        athleteID: "1",
        profileImage: "",
        rank: "Elite",
        firstName: "John",
        middleName: "A",
        surName: "Doe",
        performanceLevel: "High",
        dob: "1995-01-01",
        personalEmail: "john@example.com",
        name: "John Doe",
        role: "Athlete",
      },
    ];

    renderWithProviders(
      <TeamsTable
        module="athlete"
        data={mockData as any}
        isEdit={jest.fn()}
        setPage={jest.fn()}
        page={1}
        setRowsPerPage={jest.fn()}
        rowsPerPage={10}
        dataList={{ totalRecords: 1 }}
        isLoading={false}
        headers={headers}
        isHide={false}
      />
    );

const iconButton = screen.getByLabelText("view");
  const svg = iconButton.querySelector("svg");
  fireEvent.click(svg!);


    expect(push).toHaveBeenCalledWith(
      "/teams/football/athletes/view/1"
    );
  });
   it("should navigate to correct nutritionID view page on view icon click", () => {
    const mockData = [
      {
        nutritionID: "1",
        profileImage: "",
        rank: "Elite",
        firstName: "John",
        middleName: "A",
        surName: "Doe",
        performanceLevel: "High",
        dob: "1995-01-01",
        personalEmail: "john@example.com",
        name: "John Doe",
        role: "Athlete",
      },
    ];

    renderWithProviders(
      <TeamsTable
        module="nutrition"
        data={mockData as any}
        isEdit={jest.fn()}
        setPage={jest.fn()}
        page={1}
        setRowsPerPage={jest.fn()}
        rowsPerPage={10}
        dataList={{ totalRecords: 1 }}
        isLoading={false}
        headers={headers}
        isHide={false}
      />
    );

const iconButton = screen.getByLabelText("view");
  const svg = iconButton.querySelector("svg");
  fireEvent.click(svg!);


    expect(push).toHaveBeenCalledWith(
      "/teams/football/nutrition/view/1"
    );
  });
  it("clicking edit icon should call isEdit", () => {
    const isEditMock = jest.fn();
    renderWithProviders(
      <TeamsTable {...defaultProps} isEdit={isEditMock} />,
      { deleteStaff: {} }
    );

    fireEvent.click(screen.getByLabelText("edit"));
    expect(isEditMock).toHaveBeenCalledWith("1");
  });
 
  it("should update page when pagination page is changed", () => {
  renderWithProviders(
    <TeamsTable
      module="staff"
      data={sampleData}
      isEdit={jest.fn()}
      setPage={mockSetPage}
      page={1}
      setRowsPerPage={mockSetRowsPerPage}
      rowsPerPage={10}
      dataList={{ totalRecords: 20 }}
      isLoading={false}
      headers={headers}
      isHide={false}
    />
  );

  // Click the next page button (usually aria-label="Go to next page")
  const nextPageButton = screen.getByLabelText("Go to next page");

  fireEvent.click(nextPageButton);

  expect(mockSetPage).toHaveBeenCalledWith(2);
});
it.skip("should update rowsPerPage and reset page when rows-per-page changes", () => {
  renderWithProviders(
    <TeamsTable
      module="staff"
      data={sampleData}
      isEdit={jest.fn()}
      setPage={mockSetPage}
      page={1}
      setRowsPerPage={mockSetRowsPerPage}
      rowsPerPage={10}
      dataList={{ totalRecords: 1 }}
      isLoading={false}
      headers={headers}
      isHide={false}
    />
  );

  const select = screen.getByRole("combobox"); // 👈 more reliable than getByLabelText
  fireEvent.change(select, { target: { value: "25" } });

  expect(mockSetRowsPerPage).toHaveBeenCalledWith(25);
  expect(mockSetPage).toHaveBeenCalledWith(1);
});
});
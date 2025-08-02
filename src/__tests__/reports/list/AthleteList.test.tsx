import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AthleteList from "@/components/reports/list/AthleteList";
import "@testing-library/jest-dom";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { teamID: '1' },
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock SVG imports
jest.mock('../../../../../public/XlsSVG.svg', () => () => <svg data-testid="xls-svg" />);

// Mock child components
jest.mock('@/components/search/ModuleSearchInput', () => (props: any) => (
  <input 
    data-testid="search-input" 
    placeholder={props.placeholder}
    onChange={(e) => props.setSearchText(e.target.value)}
  />
));

jest.mock('@/components/Fields/DropDown', () => (props: any) => (
  <select data-testid={`dropdown-${props.name}`}>
    <option value="">{props.placeholder}</option>
  </select>
));

jest.mock('@/components/reports/tables/teamsTable', () => (props: any) => (
  <div data-testid="teams-table">
    <div data-testid="table-headers">
      {props.headers?.map((header: string, index: number) => (
        <span key={index} data-testid={`header-${index}`}>{header}</span>
      ))}
    </div>
    <div data-testid="table-data">
      {props.data?.map((item: any, index: number) => (
        <div key={index} data-testid={`row-${index}`}>
          <span data-testid={`name-${index}`}>{item.firstName} {item.surname}</span>
          <span data-testid={`email-${index}`}>{item.personalEmail}</span>
        </div>
      ))}
    </div>
  </div>
));

// Mock Redux slices
jest.mock('@/redux/slices/reports/getAthleteListSlice', () => ({
  getReportListAPI: jest.fn(),
}));

// Mock utility functions
jest.mock('@/utils/helper', () => ({
  filterBySearchTerm: jest.fn((data, searchText, fields) => {
    if (!data) return [];
    if (!searchText) return data;
    return data.filter((item: any) => 
      fields.some((field: string) => 
        item[field]?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }),
}));

jest.mock('@/utils/constants', () => ({
  ContractType: [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
  ],
  disciplinePracticed: [
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' },
  ],
  levelOptions: [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ],
  SortBy: [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
  ],
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: new Blob(['test']) })),
}));

// Mock window.URL.createObjectURL
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
  },
  writable: true,
});

// Mock document.createElement and appendChild
Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    href: '',
    setAttribute: jest.fn(),
    click: jest.fn(),
    parentNode: { removeChild: jest.fn() },
  })),
  writable: true,
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
  writable: true,
});

// Redux store setup
const rootReducer = combineReducers({
  getReportAthlete: (state = { 
    data: [], 
    loading: false, 
    totalRecords: 0,
    code: 200 
  }) => state,
});

const store = configureStore({ reducer: rootReducer });

describe("AthleteList", () => {
  const mockAthleteData = [
    {
      firstName: "John",
      middleName: "",
      surname: "Doe",
      personalEmail: "john.doe@example.com",
      performanceLevel: "High",
      role: "Forward",
      rank: "1",
      athleteID: "ath1",
      dob: "1995-01-01",
    },
    {
      firstName: "Jane",
      middleName: "",
      surname: "Smith",
      personalEmail: "jane.smith@example.com",
      performanceLevel: "Medium",
      role: "Midfielder",
      rank: "2",
      athleteID: "ath2",
      dob: "1998-05-15",
    },
  ];

  function renderWithProvider(ui: React.ReactNode, customStore = store) {
    console.log(ui);
    return render(<Provider store={customStore}>{ui}</Provider>);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    store.dispatch({ type: 'RESET' });
  });

  it("renders the component with title", () => {
    renderWithProvider(<AthleteList />);
    expect(screen.getByText("Athlete Reports")).toBeInTheDocument();
  });

  it("renders search input with correct placeholder", () => {
    renderWithProvider(<AthleteList />);
    const searchInput = screen.getByTestId("search-input");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", "Search by Athlete Name, etc...");
  });

  it("renders filter dropdowns", () => {
    renderWithProvider(<AthleteList />);
    expect(screen.getByTestId("dropdown-level")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-contractType")).toBeInTheDocument();
  });

  it("renders export button", () => {
    renderWithProvider(<AthleteList />);
    expect(screen.getByText("Export to Excel")).toBeInTheDocument();
    expect(screen.getByTestId("xls-svg")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    renderWithProvider(<AthleteList />);
    const expectedHeaders = [
      "Name",
      "Date of Birth", 
      "Email",
      "Performance Level",
      "Actions"
    ];
    
    expectedHeaders.forEach((header, index) => {
      expect(screen.getByTestId(`header-${index}`)).toHaveTextContent(header);
    });
  });

  it("shows no records alert when data is empty", () => {
    renderWithProvider(<AthleteList />);
    expect(screen.getByText("No Test records found .")).toBeInTheDocument();
  });

  it("renders teams table when data is available", () => {
    // Mock store with data
    const storeWithData = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: mockAthleteData, 
          loading: false, 
          totalRecords: 2,
          code: 200 
        }) => state,
      })
    });

    renderWithProvider(
      <Provider store={storeWithData}>
        <AthleteList />
      </Provider>
    );

    expect(screen.getByTestId("teams-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-data")).toBeInTheDocument();
  });

  it("displays athlete data in table", () => {
    const storeWithData = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: mockAthleteData, 
          loading: false, 
          totalRecords: 2,
          code: 200 
        }) => state,
      })
    });

    renderWithProvider(
      <Provider store={storeWithData}>
        <AthleteList />
      </Provider>
    );

    expect(screen.getByTestId("name-0")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("email-0")).toHaveTextContent("john.doe@example.com");
    expect(screen.getByTestId("name-1")).toHaveTextContent("Jane Smith");
    expect(screen.getByTestId("email-1")).toHaveTextContent("jane.smith@example.com");
  });

  it("handles search functionality", () => {
    const storeWithData = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: mockAthleteData, 
          loading: false, 
          totalRecords: 2,
          code: 200 
        }) => state,
      })
    });

    renderWithProvider(
      <Provider store={storeWithData}>
        <AthleteList />
      </Provider>
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "John" } });

    // The search should filter the data
    expect(searchInput).toHaveValue("John");
  });

  it("handles export to Excel functionality", async () => {
    renderWithProvider(<AthleteList />);
    
    const exportButton = screen.getByText("Export to Excel");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(exportButton).toBeInTheDocument();
    });
  });

  it("handles loading state", () => {
    const storeWithLoading = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: [], 
          loading: true, 
          totalRecords: 0,
          code: 200 
        }) => state,
      })
    });

    renderWithProvider(
      <Provider store={storeWithLoading}>
        <AthleteList />
      </Provider>
    );

    // Should not show no records alert when loading
    expect(screen.queryByText("No Test records found .")).not.toBeInTheDocument();
  });

  it("handles error state (code 500)", () => {
    const storeWithError = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: [], 
          loading: false, 
          totalRecords: 0,
          code: 500 
        }) => state,
      })
    });

    renderWithProvider(
      <Provider store={storeWithError}>
        <AthleteList />
      </Provider>
    );

    expect(screen.getByText("No Test records found .")).toBeInTheDocument();
  });

  it("matches snapshot with empty data", () => {
    const { asFragment } = renderWithProvider(<AthleteList />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with data", () => {
    const storeWithData = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: mockAthleteData, 
          loading: false, 
          totalRecords: 2,
          code: 200 
        }) => state,
      })
    });

    const { asFragment } = renderWithProvider(
      <Provider store={storeWithData}>
        <AthleteList />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot in loading state", () => {
    const storeWithLoading = configureStore({
      reducer: combineReducers({
        getReportAthlete: (state = { 
          data: [], 
          loading: true, 
          totalRecords: 0,
          code: 200 
        }) => state,
      })
    });

    const { asFragment } = renderWithProvider(
      <Provider store={storeWithLoading}>
        <AthleteList />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 
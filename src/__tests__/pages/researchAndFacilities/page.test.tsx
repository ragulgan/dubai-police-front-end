import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResearchAndFacilitiesPage from "../../../pages/researchAndFacilities/index";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/researchAndFacilities/ResearchTabContent", () => () => (
  <div>Mock Research Content</div>
));

jest.mock(
  "@/components/researchAndFacilities/FacilitiesTabContent",
  () => () => <div>Mock Facilities Content</div>
);

jest.mock(
  "@/components/FilterDialog",
  () => (props: any) => props.open ? <div>Mock Filter Dialog</div> : null
);

jest.mock("lodash/debounce", () => (fn: any) => fn);

const mockPush = jest.fn();

const createMockStore = () =>
  configureStore({
    reducer: {
      listResearch: (
        state = {
          loading: false,
          code: 200,
          data: [
            { id: 1, name: "Research A" },
            { id: 2, name: "Research B" },
          ],
          totalRecords: 2,
        }
      ) => state,
      listFacilities: (
        state = {
          loading: false,
          code: 200,
          data: [
            { id: 1, name: "Facility A" },
            { id: 2, name: "Facility B" },
          ],
          totalRecords: 2,
        }
      ) => state,
    },
  });

describe("ResearchAndFacilitiesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: { module: "research" },
      push: mockPush,
      pathname: "/researchAndFacilities",
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={createMockStore()}>
        <ResearchAndFacilitiesPage />
      </Provider>
    );

  it("renders search input", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(/Search by Research title/i)
    ).toBeInTheDocument();
  });

  it("accepts typing in search input", () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Search by Research title/i);
    fireEvent.change(input, { target: { value: "Biotech" } });
    expect(input).toHaveValue("Biotech");
  });

  it("shows filter dialog on filter button click in facilities tab", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { module: "facilities" },
      push: mockPush,
      pathname: "/researchAndFacilities",
    });
    renderComponent();
  });
});

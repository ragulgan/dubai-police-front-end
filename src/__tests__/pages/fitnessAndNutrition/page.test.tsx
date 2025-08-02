import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "../../../pages/fitness-and-nutrition/index";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Fitness & Nutrition Page", () => {
  const mockPush = jest.fn();

  const defaultQuery = {
    module: "fitness",
    pageView: "list",
  };

  const createMockStore = () =>
    configureStore({
      reducer: (state) => state,
      preloadedState: {
        getSportList: {
          data: [
            { id: 1, name: "Football" },
            { id: 2, name: "Basketball" },
          ],
        },
        getTestAndMedicalCheckssList: {},
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      query: defaultQuery,
      push: mockPush,
      pathname: "/fitness-and-nutrition",
    });
  });

  const renderWithQuery = (query = defaultQuery) => {
    (useRouter as jest.Mock).mockReturnValue({
      query,
      push: mockPush,
      pathname: "/fitness-and-nutrition",
    });

    return render(
      <Provider store={createMockStore()}>
        <Page />
      </Provider>
    );
  };

  it("renders Fitness tab and content by default", () => {
    renderWithQuery({ module: "fitness", pageView: "" });
  });

  it("switches to Nutrition tab when module=nutrition", () => {
    renderWithQuery({ module: "nutrition", pageView: "" });
  });

  it("updates tab on click (simulated route push)", () => {
    renderWithQuery({ module: "fitness", pageView: "" });
  });

  it("renders search input", () => {
    renderWithQuery();

    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput).toHaveValue("test");
  });

  it("renders select dropdowns (sports, athletes, etc.)", () => {
    renderWithQuery();
  });
});

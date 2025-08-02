import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditResearchFacilitiesSlider from "@/components/researchAndFacilities/edit/editResearchAndFacilitiesSlider";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import "@testing-library/jest-dom";

// Mock child components
jest.mock("@/components/researchAndFacilities/add/createReasearchForm", () => () => (
  <div data-testid="create-research-form">Mock CreateResearchForm</div>
));
jest.mock("@/components/researchAndFacilities/add/createFacilitiesForm", () => () => (
  <div data-testid="create-facilities-form">Mock CreateFacilitiesForm</div>
));

// Setup Redux store with mock reducer
const rootReducer = combineReducers({
  editResearchAndFacilities: (
    state = { facilityName: "Lab A", description: "Test" }
  ) => state,
});
const store = configureStore({ reducer: rootReducer });

describe("EditResearchFacilitiesSlider", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    isEditData: 1,
    setIsUpdated: jest.fn(),
  };

  it("renders research form when module is 'research'", () => {
    render(
      <Provider store={store}>
        <EditResearchFacilitiesSlider {...defaultProps} module="research" />
      </Provider>
    );

    expect(screen.getByText("Edit Research")).toBeInTheDocument();
    expect(screen.getByTestId("create-research-form")).toBeInTheDocument();
  });

  it("renders facilities form when module is not 'research'", () => {
    render(
      <Provider store={store}>
        <EditResearchFacilitiesSlider {...defaultProps} module="facilities" />
      </Provider>
    );

    expect(screen.getByText("Edit Facilities")).toBeInTheDocument();
    expect(screen.getByTestId("create-facilities-form")).toBeInTheDocument();
  });

  it("calls onClose when close icon is clicked", () => {
    render(
      <Provider store={store}>
        <EditResearchFacilitiesSlider {...defaultProps} module="research" />
      </Provider>
    );

    const closeIcon = screen.getByRole("button");
    fireEvent.click(closeIcon);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not render drawer when open is false", () => {
    const { container } = render(
      <Provider store={store}>
        <EditResearchFacilitiesSlider
          {...defaultProps}
          open={false}
          module="research"
        />
      </Provider>
    );
    expect(container.querySelector(".MuiDrawer-root")).toBeNull();
  });
});

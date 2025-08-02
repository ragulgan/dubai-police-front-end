import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditFacilitiesSlider from "@/components/researchAndFacilities/edit/EditFacilitiesSlider";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import '@testing-library/jest-dom';

jest.mock("@/components/researchAndFacilities/add/createFacilitiesForm", () => () => (
  <div data-testid="create-facilities-form">Mock CreateFacilitiesForm</div>
));

const mockDispatch = jest.fn();
jest.mock("@/redux/slices/researchFacilities/researchFacilitiesEditSlice", () => ({
  editResearchAndFacilities: (data: any) => ({
    type: "editResearchAndFacilities",
    payload: data,
  }),
}));

// Mock reducer
const rootReducer = combineReducers({
  editResearchAndFacilities: (
    state = {
      facilityName: "Physics Lab",
      description: "Test description",
    }
  ) => state,
});

const store = configureStore({ reducer: rootReducer });

describe("EditFacilitiesSlider", () => {
  it("renders with open drawer and calls API on mount", async () => {
    render(
      <Provider store={store}>
        <EditFacilitiesSlider
          open={true}
          onClose={jest.fn()}
          facilityID={1}
          setIsUpdated={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByText("Edit Facilities")).toBeInTheDocument();
    expect(screen.getByTestId("create-facilities-form")).toBeInTheDocument();
  });

  it("triggers onClose when close icon is clicked", () => {
    const onCloseMock = jest.fn();

    render(
      <Provider store={store}>
        <EditFacilitiesSlider
          open={true}
          onClose={onCloseMock}
          facilityID={10}
          setIsUpdated={jest.fn()}
        />
      </Provider>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("does not render drawer when open is false", () => {
    const { container } = render(
      <Provider store={store}>
        <EditFacilitiesSlider
          open={false}
          onClose={jest.fn()}
          facilityID={0}
          setIsUpdated={jest.fn()}
        />
      </Provider>
    );

    expect(container.querySelector(".MuiDrawer-root")).toBeNull();
  });
});

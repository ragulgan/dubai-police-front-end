import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
;
import { renderWithProviders } from "../../../__mocks__/store";
import userEvent from "@testing-library/user-event";
import DeleteNutrition from "@/components/nutrition/deleteNutrition";

jest.useFakeTimers();

describe("DeleteNutrition Component", () => {
  const mockDispatch = jest.fn();

  const defaultProps = {
    data: { planName: "Sample Plan", nutritionID: "123" },
    dispatchDelete: jest.fn(() => ({ type: "DELETE_ACTION" })),
    deleteResponse: { loading: false },
    clearDelete: jest.fn(() => ({ type: "CLEAR_DELETE" })),
    module: "nutritionID",
    dispatchList: jest.fn(() => ({ type: "LIST_DISPATCH" })),
    title: "Nutrition",
    listUrl: "",
    getCurrentSport: "sport-1",
    buttonIcon: "card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render delete button (card style)", () => {
    renderWithProviders(<DeleteNutrition {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should open confirmation dialog on button click", async () => {
    renderWithProviders(<DeleteNutrition {...defaultProps} />);
    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);
    expect(await screen.findByText(/are you sure/i)).toBeInTheDocument();
  });

  it("should dispatch delete action on clicking 'Yes, delete'", async () => {
    const props = { ...defaultProps };
    renderWithProviders(<DeleteNutrition {...props} />);

    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/are you sure/i)).toBeInTheDocument();

    const deleteConfirmBtn = screen.getByRole("button", { name: /yes, delete/i });
    fireEvent.click(deleteConfirmBtn);

    await waitFor(() => {
      expect(props.dispatchDelete).toHaveBeenCalledWith({ nutritionID: "123" });
    });
  });

  it("should show success message when deleteResponse code is 200", async () => {
    const props = {
      ...defaultProps,
      deleteResponse: {
        data: { responseCode: 200 },
      },
    };

    renderWithProviders(<DeleteNutrition {...props} />);

    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText(/deleted successfully/i)).toBeInTheDocument();
    expect(screen.getByAltText(/deleted-img/i)).toBeInTheDocument();
  });

  it("should close the dialog when 'No, I want to Keep' is clicked", async () => {
    renderWithProviders(<DeleteNutrition {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText(/are you sure/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /no, i want to keep/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });
});
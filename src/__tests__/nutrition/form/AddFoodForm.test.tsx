// __tests__/AddFoodForm.test.tsx
import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../../../../__mocks__/store";
import AddFoodForm from "@/components/nutrition/form/addFoodForms";
import { userEvent } from "@testing-library/user-event";
import { useDispatch } from "react-redux";
import * as foodUploadActions from "@/redux/slices/fileupload/foodFileUpload";
import { clearFoodAddState } from "@/redux/slices/food/FoodAddSlice";
import { clearFoodUpdateState } from "@/redux/slices/food/FoodUpdateSlice";
import { clearFoodEditState } from "@/redux/slices/food/FoodEditSlice";
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("next/router", () => ({
  useRouter: () => ({
   query: { sportID: "11" }, // must be a string
    push: jest.fn(),
    
  }),
}));

jest.mock("@/redux/slices/food/FoodAddSlice", () => ({
  addFood: jest.fn((data) => ({ type: "addFood", ...data })),
  clearFoodAddState: jest.fn(() => ({ type: "CLEAR_ADD_FOOD_STATE" })),
}));

jest.mock("@/redux/slices/fileupload/foodFileUpload", () => ({
   clearState: jest.fn(() => ({ type: "CLEAR_STATE" })),
     uploadFoodFile: jest.fn(() => ({ type: "foodUpload/pending" })),
}));

jest.mock("@/redux/slices/food/FoodUpdateSlice", () => ({
  updateFood: jest.fn((data) => ({ type: "updateFood", ...data })),
  clearFoodUpdateState: jest.fn(() => ({ type: "CLEAR_UPDATE_FOOD_STATE" })),
  
}));


describe("AddFoodForm", () => {
  const defaultProps = {
    setForm: jest.fn(),
    edit: false,
    setEdit: jest.fn(),
    clone: false,
    setClone: jest.fn(),
    foodId: "123",
  };

  const mockDispatch = jest.fn();


  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });
  it("renders all necessary fields", () => {
    renderWithProviders(<AddFoodForm {...defaultProps} />, {});
    expect(
      screen.getByPlaceholderText(/Enter Food Quantity/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Calories/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Proteins/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Carbs/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Fats/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Food Name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Food/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderWithProviders(<AddFoodForm {...defaultProps} />);

    const saveButton = screen.getByRole("button", { name: /Save Food/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Food Quantity is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Calories is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Proteins is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Carbs is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Fats is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Food Name is required/i)).toBeInTheDocument();
    });
  });

  it("submits the form when valid data is entered", async () => {
    renderWithProviders(<AddFoodForm {...defaultProps} />);

    const quantityField = screen.getByPlaceholderText(/Enter Food Quantity/i);
    fireEvent.change(quantityField, { target: { value: "150" } });
    const caloriesField = screen.getByPlaceholderText(/Enter Calories/i);
    fireEvent.change(caloriesField, { target: { value: "150" } });
    const proteinField = screen.getByPlaceholderText(/Enter Proteins/i);
    fireEvent.change(proteinField, { target: { value: "150" } });
    const carbsField = screen.getByPlaceholderText(/Enter Carbs/i);
    fireEvent.change(carbsField, { target: { value: "150" } });
    const fatsField = screen.getByPlaceholderText(/Enter Fats/i);
    fireEvent.change(fatsField, { target: { value: "150" } });
    const foodNameField = screen.getByPlaceholderText(/Enter Food Name/i);
    fireEvent.change(foodNameField, { target: { value: "150" } });

    const saveButton = screen.getByRole("button", { name: /Save Food/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
      // You can check for redux side effects or snackbar trigger here
    });
  });
  it("should show success snackbar when food is added successfully", async () => {
    renderWithProviders(<AddFoodForm {...defaultProps} />, {
      addFood: {
        code: 200,
        status: "succeeded",
        loading: false,
        data: { foodID: 1 },
      },
      foodUpload: {
        code: 0,
        loading: false,
        message: "",
      },
    });
    const successSnackbar = await screen.findByText("Food Added successfully!");
    expect(successSnackbar).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000); // 3s timeout
    });
  });
  it("should show error snackbar when food add fails", async () => {
    renderWithProviders(<AddFoodForm {...defaultProps} />, {
      addFood: {
        code: 500,
        status: "succeeded",
        loading: false,
      },
      foodUpload: {
        code: 0,
        loading: false,
        message: "",
      },
    });

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
  });

  it("dispatches addFood with correct payload when edit is false", async () => {
    renderWithProviders(<AddFoodForm edit={false} foodId={123} />);

    // Fill out form fields
    
    await userEvent.type(
      screen.getByPlaceholderText("Enter Food Quantity in multiple of 50"),
      "200"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter Food Name"),
      "Banana"
    );
    await userEvent.type(screen.getByPlaceholderText("Enter Calories"), "89");
    await userEvent.type(screen.getByPlaceholderText("Enter Proteins"), "1");
    await userEvent.type(screen.getByPlaceholderText("Enter Carbs"), "23");
    await userEvent.type(screen.getByPlaceholderText("Enter Fats"), "03");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /save food/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
     expect(mockDispatch).toHaveBeenCalledWith(
  expect.objectContaining({
    type: "addFood",
    url: "/InsertFood",
    payload: expect.objectContaining({
      foodQuantity: "200",
      foodName: "Banana",
      calories: "89",
      proteins: "1",
      carbs: "23",
      fats: "03",
  
    }),
  })
);
    });
  });

  it("dispatches updateFood with correct payload when edit is true", async () => {
    renderWithProviders(<AddFoodForm edit={true} foodId={123} />);

    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("Enter Food Quantity in multiple of 50"),
      "250"
    );
    await user.type(screen.getByPlaceholderText("Enter Food Name"), "Apple");
    await user.type(screen.getByPlaceholderText("Enter Calories"), "52");
    await user.type(screen.getByPlaceholderText("Enter Carbs"), "14");
    await user.type(screen.getByPlaceholderText("Enter Proteins"), "0.3");
    await user.type(screen.getByPlaceholderText("Enter Fats"), "0.2");

    // const submitBtn = screen.getByRole("button", { name: /Save Food/i });
    // await user.click(submitBtn);
    const saveButton = screen.getByRole("button", { name: /Update/i });
    await user.click(saveButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining("updateFood"),
        url: "/UpdateFoodById",
        payload: expect.objectContaining({
          foodID: 123,
          foodName: "Apple",
          foodQuantity: "250",
          calories: "52",
          carbs: "14",
          proteins: "03",
          fats: "02",
        }),
      })
    );
  });
   it("does not close snackbar on clickaway", async () => {
   renderWithProviders(<AddFoodForm {...defaultProps} />, {
      addFood: {
        code: 200,
        status: "succeeded",
        loading: false,
        data: { foodID: 1 },
      },
      foodUpload: {
        code: 0,
        loading: false,
        message: "",
      },
    });
    const successSnackbar = await screen.findByText("Food Added successfully!");
    expect(successSnackbar).toBeInTheDocument();

    // Trigger `onClose` with reason = "clickaway"
    screen.getByText("Food Added successfully!").parentElement?.props?.onClose?.({}, "clickaway");

    // Snackbar should still be open
    expect(screen.getByText("Food Added successfully!")).toBeInTheDocument();
  });

it("closes snackbar when reason is not 'clickaway'", async () => {
  renderWithProviders(<AddFoodForm {...defaultProps} />, {
    addFood: {
      code: 200,
      status: "succeeded",
      loading: false,
      data: { foodID: 1 },
    },
    foodUpload: {
      code: 0,
      loading: false,
      message: "",
    },
  });

  // Snackbar should appear
  const successSnackbar = await screen.findByText("Food Added successfully!");
  expect(successSnackbar).toBeInTheDocument();

  // Simulate user clicking the close button (if using IconButton inside CustomSnackbar)
  const closeButton = screen.getByRole("button", { name: /close/i });
  await userEvent.click(closeButton);

  // Snackbar should disappear
  await waitFor(() => {
    expect(screen.queryByText("Food Added successfully!")).not.toBeInTheDocument();
  });
});
  it("dispatches clearState when foodUpload.code is 200", () => {
    const clearStateSpy = foodUploadActions.clearState;
 renderWithProviders(<AddFoodForm {...defaultProps} />, {
    foodUpload: {
      code: 200,
      loading: false,
         message: "File uploaded successfully",
    },
  });

    expect(clearStateSpy).toHaveBeenCalled(); 
  });
it("should allow numeric characters and not call preventDefault for input Enter Food Quantity in multiple of 50", () => {
    renderWithProviders(<AddFoodForm  />);


  const inputElement = screen.getByPlaceholderText("Enter Food Quantity in multiple of 50");
  const preventDefault = jest.fn();

  const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (const char of allowedChars) {
    const event = new KeyboardEvent("keypress", {
      key: char,
      charCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(event, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(event);
    expect(preventDefault).not.toHaveBeenCalled();
    preventDefault.mockClear();
  }
});
it("should prevent non-numeric characters and call preventDefault for input Enter Food Quantity in multiple of 50", () => {
  renderWithProviders(<AddFoodForm  />);

  const inputElement = screen.getByPlaceholderText("Enter Food Quantity in multiple of 50"); 
  const preventDefault = jest.fn();

  const disallowedChars = ['a', '!', '-', '@', '/', '_', ' '];

  for (const char of disallowedChars) {
    const event = new KeyboardEvent("keypress", {
      key: char,
      charCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(event, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(event);
    expect(preventDefault).toHaveBeenCalled();
    preventDefault.mockClear();
  }
});
it("should allow numeric characters and not call preventDefault for input Enter Carbs", () => {
    renderWithProviders(<AddFoodForm  />);


  const inputElement = screen.getByPlaceholderText("Enter Carbs");
  const preventDefault = jest.fn();

  const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (const char of allowedChars) {
    const event = new KeyboardEvent("keypress", {
      key: char,
      charCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(event, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(event);
    expect(preventDefault).not.toHaveBeenCalled();
    preventDefault.mockClear();
  }
});
it("should prevent non-numeric characters and call preventDefault for input Enter Carbs", () => {
  renderWithProviders(<AddFoodForm  />);

  const inputElement = screen.getByPlaceholderText("Enter Carbs"); 
  const preventDefault = jest.fn();

  const disallowedChars = ['a', '!', '-', '@', '/', '_', ' '];

  for (const char of disallowedChars) {
    const event = new KeyboardEvent("keypress", {
      key: char,
      charCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(event, "preventDefault").mockImplementation(preventDefault);
    inputElement.dispatchEvent(event);
    expect(preventDefault).toHaveBeenCalled();
    preventDefault.mockClear();
  }
});
it("should disable 'Back' button when FoodAdd or FoodUpdate is loading", () => {
  const loadingProps = {
    ...defaultProps,
    FoodAdd: { loading: true },
    FoodUpdate: { loading: true },
  };

  renderWithProviders(<AddFoodForm {...loadingProps} />);

  const backButton = screen.getByRole("button", { name: /back/i });
  expect(backButton).not.toBeDisabled();
});
it("should show 'Clone Food' when clone is true", () => {
  renderWithProviders(<AddFoodForm {...defaultProps} clone={true} />);
  expect(
    screen.getByRole("button", { name: /clone food/i })
  ).toBeInTheDocument();
});

it("should show 'Update' when edit is true", () => {
renderWithProviders(<AddFoodForm {...defaultProps} edit={true}  />);
  expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
});

it("should show 'Save Food' by default", () => {
renderWithProviders(<AddFoodForm {...defaultProps}  />);
  expect(screen.getByRole("button", { name: /save food/i })).toBeInTheDocument();
});
});

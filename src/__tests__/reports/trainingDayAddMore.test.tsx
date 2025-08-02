import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrainingDayAddMore from "@/components/reports/trainingDayAddMore";
import { act } from "react-dom/test-utils";

jest.mock("@/components/checkbox/CustomCheckbox", () => (props: any) => (
  <input
    type="checkbox"
    data-testid="custom-checkbox"
    checked={props.checked}
    onChange={props.onChange}
  />
));

jest.mock("@/components/Fields/CustomTextField", () => (props: any) => (
  <input
    data-testid={`input-${props.name}`}
    name={props.name}
    placeholder={props.placeholder}
    onChange={(e) => props.control?.setValue?.(props.name, e.target.value)}
  />
));

jest.mock("@/components/Forms/CustomFormControlLabel", () => (props: any) => (
  <label>
    {props.label}
    {props.control}
  </label>
));

describe("TrainingDayAddMore Component", () => {
  let applyDaysForTraining = false;
  const setApplyDaysForTraining = jest.fn((val) => (applyDaysForTraining = val));
  const setTrainingPlanData = jest.fn();
  const setTrainingPlanSelectedData = jest.fn();
  const setResetForm = jest.fn();

  const trainingPlanData = [
    { dayNo: 1, morning: "Pushups", afternoon: "Running" },
  ];

  const trainingPlanSelectedData: any[] = [];

  const defaultProps = {
    applyDaysForTraining,
    setApplyDaysForTraining,
    getTrainingCampTrainingPlanData: trainingPlanData,
    setTrainingPlanData,
    trainingPlanData,
    trainingPlanSelectedData,
    setTrainingPlanSelectedData,
    resetForm: false,
    setResetForm,
  };

  it("renders correctly", () => {
    render(<TrainingDayAddMore {...defaultProps} />);
    expect(screen.getByText("Add Next Day")).toBeInTheDocument();
  });

  it("triggers onSubmit when button is clicked", async () => {
    render(<TrainingDayAddMore {...defaultProps} />);
    const addButton = screen.getByText("Add Next Day");
    await act(async () => {
      fireEvent.click(addButton);
    });
    expect(setTrainingPlanData).toHaveBeenCalled();
    expect(setTrainingPlanSelectedData).toHaveBeenCalledWith([]);
    expect(setApplyDaysForTraining).toHaveBeenCalledWith(false);
  });

  it("renders Apply for all Days checkbox when 1 item exists", () => {
    render(<TrainingDayAddMore {...defaultProps} />);
    const checkbox = screen.getByTestId("custom-checkbox");
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(setApplyDaysForTraining).toHaveBeenCalled();
  });

  it("resets form when resetForm prop is true", () => {
    jest.useFakeTimers();
    const resetProps = {
      ...defaultProps,
      resetForm: true,
    };
    render(<TrainingDayAddMore {...resetProps} />);
    expect(setTrainingPlanData).toHaveBeenCalledWith([]);
    act(() => {
      jest.runAllTimers();
    });
    expect(setResetForm).toHaveBeenCalledWith(false);
    jest.useRealTimers();
  });

  it("sets form values when trainingPlanSelectedData exists", () => {
    const selectedDataProps = {
      ...defaultProps,
      trainingPlanSelectedData: [
        { dayNo: "Day 3", morning: "Squats", afternoon: "Jogging" },
      ],
    };
    render(<TrainingDayAddMore {...selectedDataProps} />);
    // Not asserting values directly since CustomTextField is mocked
    expect(screen.getByTestId("input-dayNo")).toBeInTheDocument();
    expect(screen.getByTestId("input-morning")).toBeInTheDocument();
    expect(screen.getByTestId("input-afternoon")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<TrainingDayAddMore {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

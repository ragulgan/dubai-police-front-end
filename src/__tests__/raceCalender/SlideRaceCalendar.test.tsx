import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import SlideRaceCalendar from "@/components/raceCalendar/SlideRaceCalendar";
import { renderWithProviders } from "../../../__mocks__/store";

// Mock child components
jest.mock("@/components/raceCalendar/trainingPlan/GeneralInfo", () => () => <div data-testid="general-info" />);
jest.mock("@/components/raceCalendar/trainingPlan/TrainingInfo", () => () => <div data-testid="training-info" />);
jest.mock("@/components/raceCalendar/TournamentForm", () => () => <div data-testid="tournament-form" />);
jest.mock("@/components/Forms/EventForm", () => () => <div data-testid="event-form" />);
jest.mock("@/components/Forms/RemainderForm", () => () => <div data-testid="remainder-form" />);
jest.mock("@/components/Forms/MeetingForm", () => () => <div data-testid="meeting-form" />);
const mockState = {
  addRaceCalendar: {
    loading: false,
    message: "",
    code: 0,
  },
  eventReducer: {
    data: [],
    loading: false,
  },
  meetingReducer: {
    data: [],
    loading: false,
  },
};

describe("SlideRaceCalendar", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    title: "",
    editData: {},
    date: new Date(),
    setDate: jest.fn(),
    selectedSport: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Drawer when open", () => {
   renderWithProviders( <SlideRaceCalendar {...defaultProps}/>, mockState);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("calls onClose when Close button clicked", () => {
   renderWithProviders( <SlideRaceCalendar {...defaultProps} />, mockState);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("renders TournamentForm for title='tournament'", () => {
    renderWithProviders(<SlideRaceCalendar {...defaultProps} title="tournament" />);
    expect(screen.getByTestId("tournament-form")).toBeInTheDocument();
  });

  it("renders EventForm for title='event'", () => {
     renderWithProviders( <SlideRaceCalendar {...defaultProps} title="event" />, mockState);
    expect(screen.getByTestId("event-form")).toBeInTheDocument();
  });

  it("renders RemainderForm for title='remainder'", () => {
     renderWithProviders( <SlideRaceCalendar {...defaultProps} title="remainder" />, mockState);
    expect(screen.getByTestId("remainder-form")).toBeInTheDocument();
  });

  it("renders MeetingForm for title='meeting'", () => {
   renderWithProviders( <SlideRaceCalendar {...defaultProps} title="meeting" />, mockState);
    expect(screen.getByTestId("meeting-form")).toBeInTheDocument();
  });

  it("renders GeneralInfo initially for training", () => {
    renderWithProviders( <SlideRaceCalendar {...defaultProps} title="training" />, mockState);
    expect(screen.getByTestId("general-info")).toBeInTheDocument();
  });

  it("switches to TrainingInfo when tab is changed", () => {
    renderWithProviders(<SlideRaceCalendar {...defaultProps} title="training" editData={{ id: 1 }} />);
    const trainingDetailsTab = screen.getByRole("tab", { name: /training details/i });
    fireEvent.click(trainingDetailsTab);
    expect(screen.getByTestId("training-info")).toBeInTheDocument();
  });

  it("displays 'Create' titles when no editData is provided", () => {
    const { rerender } = renderWithProviders(<SlideRaceCalendar {...defaultProps} title="tournament" />);
    expect(screen.getByText("Create Tournament / Competition")).toBeInTheDocument();

    rerender(<SlideRaceCalendar {...defaultProps} title="event" />);
    expect(screen.getByText("Create Event")).toBeInTheDocument();
  });

  it("displays 'Update' titles when editData is present", () => {
    const editProps = { ...defaultProps, editData: { id: 1 } };

    const { rerender } = renderWithProviders(<SlideRaceCalendar {...editProps} title="tournament" />);
    expect(screen.getByText("Update Tournament / Competition")).toBeInTheDocument();

    rerender(<SlideRaceCalendar {...editProps} title="meeting" />);
    expect(screen.getByText("Update Meeting")).toBeInTheDocument();
  });
});
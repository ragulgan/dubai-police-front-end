import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// // Mock for Competition.svg
// jest.mock('../../../public/Competition.svg', () => {
//   const MockComponent = (props) => (
//     <svg {...props} data-testid="competition-icon" />
//   );
//   MockComponent.displayName = 'MockCompetitionSvg'; // For better debugging
//   // If your SVG imports use named exports (e.g., `import { ReactComponent } from './path/to/svg.svg';`)
//   // then include this line:
//   MockComponent.ReactComponent = MockComponent;
//   return MockComponent;
// });

// // Mock for Training.svg
// jest.mock('../../../public/Training.svg', () => {
//   const MockComponent = (props) => (
//     <svg {...props} data-testid="training-icon" />
//   );
//   MockComponent.displayName = 'MockTrainingSvg';
//   MockComponent.ReactComponent = MockComponent;
//   return MockComponent;
// });

// // Mock for Events.svg
// jest.mock('../../../public/Events.svg', () => {
//   const MockComponent = (props) => (
//     <svg {...props} data-testid="events-icon" />
//   );
//   MockComponent.displayName = 'MockEventsSvg';
//   MockComponent.ReactComponent = MockComponent;
//   return MockComponent;
// });

// Mock for Remainder.svg (Assuming this is the correct filename based on your previous 'remainder-icon')
jest.mock("../../../public/Remainder.svg", () => {
  const MockComponent = (props) => (
    <svg {...props} data-testid="remainder-icon" />
  );
  MockComponent.displayName = "MockRemainderSvg";
  MockComponent.ReactComponent = MockComponent;
  return MockComponent;
});

// Mock for Meetings.svg
jest.mock("../../../public/Meetings.svg", () => {
  const MockComponent = (props) => (
    <svg {...props} data-testid="meetings-icon" />
  );
  MockComponent.displayName = "MockMeetingsSvg";
  MockComponent.ReactComponent = MockComponent;
  return MockComponent;
});

// Mock the next/router specifically
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from "next/router";
import CalendarCreateDialog from "@/components/dialogs/CalendarCreateDialog";

describe("CalendarCreateDialog", () => {
  const mockHandleClose = jest.fn();
  const mockHandleMenuSelect = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    mockHandleClose.mockClear();
    mockHandleMenuSelect.mockClear();
    mockRouterPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      query: { teamID: "123" }, // simulate teamID
      push: mockRouterPush,
      prefetch: jest.fn(),
      asPath: "/",
    });
  });
  it("should call router.push when Tournament / Competition button is clicked", () => {
    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );

    const button = screen.getByText(/tournament \/ competition/i);
    fireEvent.click(button);

    expect(mockRouterPush).toHaveBeenCalledWith("/teams/123/raceCalendar/add");
    expect(mockHandleMenuSelect).not.toHaveBeenCalled();
  });
  it("should render the dialog when openDialog is true", () => {
    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tournament / Competition")).toBeInTheDocument();
    expect(screen.getByText("Training")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Reminders")).toBeInTheDocument();
    expect(screen.getByText("Meetings")).toBeInTheDocument();
  });

  it("should not render the dialog when openDialog is false", () => {
    render(
      <CalendarCreateDialog
        openDialog={false}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  //   it('should render all menu buttons with their specific icons', () => {
  //     render(
  //       <CalendarCreateDialog
  //         openDialog={true}
  //         handleClose={mockHandleClose}
  //         handleMenuSelect={mockHandleMenuSelect}
  //       />
  //     );

  //     // These assertions should now pass
  //     expect(screen.getByTestId('competition-icon')).toBeInTheDocument();
  //     expect(screen.getByTestId('training-icon')).toBeInTheDocument();
  //     expect(screen.getByTestId('events-icon')).toBeInTheDocument();
  //     expect(screen.getByTestId('remainder-icon')).toBeInTheDocument();
  //     expect(screen.getByTestId('meetings-icon')).toBeInTheDocument();
  //   });

  it('should call handleMenuSelect with "competition" when router.query.create is "competition"', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "competition" },
      push: jest.fn(),
      prefetch: jest.fn(),
      asPath: "/",
    });

    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("competition");
  });
  it('should call handleMenuSelect with "training" when the Training button is clicked', () => {
    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );

    fireEvent.click(screen.getByText("Training"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("training");
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
  it('should call handleMenuSelect with "training" when router.query.create is "training"', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "training" },
      push: jest.fn(),
      prefetch: jest.fn(),
      asPath: "/",
    });

    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("training");
  });
  it('should call handleMenuSelect with "event" when the Events button is clicked', () => {
    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Events"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("event");
  });
  it('should call handleMenuSelect with "event" when router.query.create is "event"', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "event" },
      push: jest.fn(),
      prefetch: jest.fn(),
      asPath: "/",
    });

    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("event");
  });
  it('should call handleMenuSelect with "remainder" when the Reminders button is clicked', () => {
    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Reminders"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("remainder");
  });
  it('should call handleMenuSelect with "remainder" when router.query.create is "remainder"', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "remainder" },
      push: jest.fn(),
      prefetch: jest.fn(),
      asPath: "/",
    });

    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("remainder");
  });
  it('should call handleMenuSelect with "meeting" when the Meetings button is clicked', () => {
    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    fireEvent.click(screen.getByText("Meetings"));
    expect(mockHandleMenuSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("meeting");
  });

  it('should call handleMenuSelect with "meeting" when router.query.create is "meeting"', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { create: "meeting" },
      push: jest.fn(),
      prefetch: jest.fn(),
      asPath: "/",
    });

    render(
      <CalendarCreateDialog
        openDialog={true}
        handleClose={mockHandleClose}
        handleMenuSelect={mockHandleMenuSelect}
      />
    );
    expect(mockHandleMenuSelect).toHaveBeenCalledWith("meeting");
  });
});

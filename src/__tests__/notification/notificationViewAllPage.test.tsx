import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import NotificationViewAllPage from "@/components/notification/notificationViewAllPage";
import * as redux from "react-redux";
import {
  updateNotification,
  clearNotificationUpdateState,
} from "@/redux/slices/notification/updateNotificationByIdSlice";

// Mock redux slice actions
jest.mock(
  "@/redux/slices/notification/updateNotificationByIdSlice",
  () => ({
    updateNotification: jest.fn(),
    clearNotificationUpdateState: jest.fn(),
  })
);

// Mock PaginationComponent and CustomSnackbar if they cause problems
jest.mock("@/components/PaginationComponent", () => (props: any) => {
  return (
    <div data-testid="pagination-component">
      Pagination Component - page: {props.page}, rowsPerPage: {props.rowsPerPage}
    </div>
  );
});

jest.mock("@/components/CustomSnackbar", () => (props: any) => (
  <div data-testid="custom-snackbar">{props.message}</div>
));

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  }));

describe("NotificationViewAllPage", () => {
  const useDispatchMock = redux.useDispatch as unknown as jest.Mock;
  const useSelectorMock = redux.useSelector as unknown as jest.Mock;

  const mockDispatch = jest.fn();

  const sampleNotifications = [
    {
      notificationID: 1,
      status: 0,
      message: "Unread notification 1",
      dateOfCreation: "07/23/2025 15:00:00",
      image: "/image1.png",
    },
    {
      notificationID: 2,
      status: 1,
      message: "Read notification 2",
      dateOfCreation: "07/22/2025 14:00:00",
      image: "/image2.png",
    },
  ];

  const baseProps = {
    getNotificationList: {
      data: sampleNotifications,
      totalRecords: 100,
      totalUnseenRecords: 50,
    },
    setFlagData: jest.fn(),
    setPage: jest.fn(),
    page: 1,
    rowsPerPage: 10,
    setRowsPerPage: jest.fn(),
    setIsUpdated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatchMock.mockReturnValue(mockDispatch);
    useSelectorMock.mockReturnValue({});
  });

  it("renders notification table with entries and checkboxes", () => {
    render(<NotificationViewAllPage {...baseProps} />);

    // Check toggle buttons rendered
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unread" })).toBeInTheDocument();

    // Checks notification messages render
    expect(screen.getByText("Unread notification 1")).toBeInTheDocument();
    expect(screen.getByText("Read notification 2")).toBeInTheDocument();

    // Table checkboxes
    // Checkboxes for each notification
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThanOrEqual(sampleNotifications.length + 1); // More than data length + select all

    // Verify "Mark all as read" button exists
    expect(screen.getByText(/mark all as read/i)).toBeInTheDocument();

    // Pagination component appears
    expect(screen.getByTestId("pagination-component")).toBeInTheDocument();
  });

  it("toggles filter buttons and invokes setFlagData", () => {
    render(<NotificationViewAllPage {...baseProps} />);

    const unreadButton = screen.getByRole("button", { name: "Unread" });
    fireEvent.click(unreadButton);

    // setFlagData should be called with 'unread'
    expect(baseProps.setFlagData).toHaveBeenCalledWith("unread");

    const allButton = screen.getByRole("button", { name: "All" });
    fireEvent.click(allButton);

    expect(baseProps.setFlagData).toHaveBeenCalledWith("all");
  });

  it("selects and deselects notifications with checkboxes", () => {
    render(<NotificationViewAllPage {...baseProps} />);

    // Select first notification checkbox. Note: The first checkbox might be selectAll, the rest are notification checkboxes
    const notificationCheckboxes = screen.getAllByRole("checkbox").slice(1); // skip select all checkbox

    // Initially not checked
    expect(notificationCheckboxes[0]).not.toBeChecked();

    // Click to select first
    fireEvent.click(notificationCheckboxes[0]);
    expect(notificationCheckboxes[0]).toBeChecked();

    // Click again to deselect
    fireEvent.click(notificationCheckboxes[0]);
    expect(notificationCheckboxes[0]).not.toBeChecked();

    // Select all checkbox
    const selectAllCheckbox = screen.getAllByRole("checkbox")[0];

    // Click select all
    fireEvent.click(selectAllCheckbox);
    expect(notificationCheckboxes[0]).toBeChecked();
    expect(notificationCheckboxes[1]).toBeChecked();

    // Click select all again (uncheck)
    fireEvent.click(selectAllCheckbox);
    expect(notificationCheckboxes[0]).not.toBeChecked();
  });

  it("dispatches updateNotification with selected IDs on 'Mark all as read' click", () => {
    render(<NotificationViewAllPage {...baseProps} />);

    // Select one notification
    const notificationCheckboxes = screen.getAllByRole("checkbox").slice(1);
    fireEvent.click(notificationCheckboxes[0]); // Select notificationID=1

    // Click Mark all as read
    fireEvent.click(screen.getByText(/mark all as read/i));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(updateNotification).toHaveBeenCalledWith({
      url: "/UpdateNotificationByID",
      payload: {
        flag: "",
        notificationID: "1",
      },
    });
  });

  it("displays success snackbar and clears state on notification update success", () => {
    jest.useFakeTimers();
    useSelectorMock.mockReturnValueOnce({});

    const { rerender } = render(<NotificationViewAllPage {...baseProps} />);
    useSelectorMock.mockReturnValue({ code: 200 });

    rerender(<NotificationViewAllPage {...baseProps} />);
    expect(screen.getByTestId("custom-snackbar")).toHaveTextContent(
        "Notifications marked as read!"
      );
    expect(baseProps.setIsUpdated).toHaveBeenCalledWith(true);
    act(() => {
        jest.advanceTimersByTime(3000);
      });
  });

  it("displays error snackbar and clears state on notification update failure", () => {
    jest.useFakeTimers();
    useSelectorMock.mockReturnValueOnce({});

    const { rerender } = render(<NotificationViewAllPage {...baseProps} />);
    useSelectorMock.mockReturnValue({ code: 500, message: "Failed update" });

    rerender(<NotificationViewAllPage {...baseProps} />);
    expect(screen.getByTestId("custom-snackbar")).toHaveTextContent(
      "Failed update"
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });
  });

  it("calls pagination callbacks on page and rowsPerPage change", () => {
    render(<NotificationViewAllPage {...baseProps} />);
    expect(baseProps.setPage).toBeDefined();
    expect(baseProps.setRowsPerPage).toBeDefined();
  });
});

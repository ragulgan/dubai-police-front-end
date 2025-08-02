import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotifiacationListPage from "@/components/notification/notifiacationListPage";
import * as redux from "react-redux";
import { useRouter } from "next/router";
import { updateNotification, clearNotificationUpdateState } from "@/redux/slices/notification/updateNotificationByIdSlice";

jest.mock("@/redux/slices/notification/updateNotificationByIdSlice", () => ({
  updateNotification: jest.fn(),
  clearNotificationUpdateState: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the react-redux module completely
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("NotifiacationListPage", () => {
  // Obtain refs to the mocked hooks from the react-redux mock
  const useDispatchMock = redux.useDispatch as unknown as jest.Mock;
  const useSelectorMock = redux.useSelector as unknown as jest.Mock;


  const mockDispatch = jest.fn();

  const mockRouterPush = jest.fn();

  const props = {
    onClose: jest.fn(),
    setIsUpdated: jest.fn(),
    getNotificationList: {
      totalUnseenRecords: 2,
      data: [
        {
          notificationID: "1",
          status: 0,
          message: "Test notification message 1",
          dateOfCreation: "07/23/2025 15:00:00",
        },
        {
          notificationID: "2",
          status: 1,
          message: "Test notification message 2",
          dateOfCreation: "07/22/2025 14:00:00",
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatchMock.mockReturnValue(mockDispatch);
    useSelectorMock.mockReturnValue({});
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("renders notification list with unread and read notifications", () => {
    render(<NotifiacationListPage {...props} />);

    expect(screen.getByRole("tab", { name: /notifications/i })).toBeInTheDocument();

    const unreadNotification = screen.getByText(/Test notification message 1/i);
    expect(unreadNotification).toBeInTheDocument();

    const readNotification = screen.getByText(/Test notification message 2/i);
    expect(readNotification).toBeInTheDocument();

    const badge = screen.getByText("2");
    expect(badge).toBeInTheDocument();

    expect(screen.getByText(/mark all as read/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view all/i })).toBeInTheDocument();
  });

  it("calls dispatch updateNotification when clicking Mark all as read", () => {
    render(<NotifiacationListPage {...props} />);

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

  it("navigates to /notification and calls onClose on clicking View All", () => {
    render(<NotifiacationListPage {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /view all/i }));

    expect(mockRouterPush).toHaveBeenCalledWith("/notification");
    expect(props.onClose).toHaveBeenCalled();
  });
});

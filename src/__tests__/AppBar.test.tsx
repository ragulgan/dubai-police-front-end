import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import HeaderAppBar from '@/components/AppBar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";

// ---- MOCKS FIRST ----
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

import { useDispatch } from 'react-redux'; // <-- Import after the mock

jest.mock('@/components/notification/notifiacationListPage', () => () => (
  <div data-testid="notification-dialog">Mock Notification List</div>
));
jest.mock('@/components/GoogleTranslate', () => () => <div data-testid="google-translate" />);
jest.mock('next/image', () => (props: any) => <img {...props} alt="Logo" />);
jest.mock('@/redux/slices/notification/getNotificationSlice', () => ({
  listNotification: jest.fn(({ url, payload }) => ({
    type: 'getNotificationList/fetch',
    payload: { url, payload }
  })),
}));
jest.mock('@/components/Fields/menu', () => () => <div data-testid="customized-menus" />);

// ---- REDUX STORE ----
const rootReducer = combineReducers({
  getNotificationList: (state = { totalUnseenRecords: 5, data: [] }) => state,
  someSlice: (state = { value: 'test' }) => state,
});
const store = configureStore({ reducer: rootReducer });

// ---- TESTS ----
describe('HeaderAppBar Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useDispatch as any).mockClear();
  });

  it('renders logo and Google Translate', () => {
    (useDispatch as any).mockReturnValue(jest.fn()); // Provide a dummy dispatch
    render(
      <Provider store={store}>
        <HeaderAppBar />
      </Provider>
    );
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByTestId('google-translate')).toBeInTheDocument();
  });

  it('renders notification bell with unseen count badge', () => {
    (useDispatch as any).mockReturnValue(jest.fn());
    render(
      <Provider store={store}>
        <HeaderAppBar />
      </Provider>
    );
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('opens the notification dialog when bell is clicked', () => {
    (useDispatch as any).mockReturnValue(jest.fn());
    render(
      <Provider store={store}>
        <HeaderAppBar />
      </Provider>
    );
    const bell = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bell);
    expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
  });

  it('dispatches listNotification on bell click', () => {
    const dispatchMock = jest.fn();
    (useDispatch as any).mockReturnValue(dispatchMock);
    render(
      <Provider store={store}>
        <HeaderAppBar />
      </Provider>
    );
    const bell = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bell);
    expect(dispatchMock).toHaveBeenCalled();
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateSportDialog from '@/components/settings/UpdateSportDialog';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import axios from 'axios';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mocks
jest.mock('axios');
jest.mock('next/router', () => ({
  useRouter: () => ({ query: { teamID: '1' }, push: jest.fn() }),
}));
jest.mock('@/redux/slices/appSplice', () => ({
  handleAdminSetting: () => ({ type: 'HANDLE_ADMIN_SETTING' }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const baseState = {
  ui: {},
  getSportList: { loading: false, data: [] },
};

function createStore(customState: Partial<typeof baseState> = {}) {
  const rootReducer = combineReducers({
    ui: (state = baseState.ui) => ({ ...state, ...(customState.ui || {}) }),
    getSportList: (state = baseState.getSportList) => ({
      ...state,
      ...(customState.getSportList || {}),
    }),
  });

  return configureStore({ reducer: rootReducer });
}

const theme = createTheme();

const renderComponent = (props: any, customState?: any) => {
  const store = createStore(customState);
  return render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <UpdateSportDialog {...props} />
      </Provider>
    </ThemeProvider>
  );
};

describe('UpdateSportDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  const sportMock = {
    sportId: 123,
    sportName: 'Football',
    categoryType: 'A',
    isActive: 1,
    orderId: 5,
  };

  it('renders with sport data', () => {
    renderComponent({
      open: true,
      onClose: mockOnClose,
      onUpdate: mockOnUpdate,
      sport: sportMock,
    });

    expect(screen.getByDisplayValue('Football')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('shows validation error if required fields are empty', async () => {
    renderComponent({
      open: true,
      onClose: mockOnClose,
      onUpdate: mockOnUpdate,
      sport: {},
    });

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(screen.getByText('Sports Name is required')).toBeInTheDocument();
    });
  });

  it('calls API and triggers onUpdate + onClose', async () => {
    mockedAxios.put.mockResolvedValueOnce({
      data: { responseCode: 200 },
    });

    renderComponent({
      open: true,
      onClose: mockOnClose,
      onUpdate: mockOnUpdate,
      sport: sportMock,
    });

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${process.env.API_BASE_URL}/settings/sports/${sportMock.sportId}`,
        expect.objectContaining({
          sportName: 'Football',
          categoryType: 'A',
          isActive: 1,
          orderId: 5,
        })
      );

      expect(mockOnUpdate).toHaveBeenCalledWith(true);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('closes dialog on Cancel click', () => {
    renderComponent({
      open: true,
      onClose: mockOnClose,
      onUpdate: mockOnUpdate,
      sport: sportMock,
    });

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

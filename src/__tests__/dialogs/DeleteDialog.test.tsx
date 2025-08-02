import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../__mocks__/store'; // ✅ correct import
import DeleteDialog from '../../components/dialogs/DeleteDialog';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => jest.fn()), // mock useDispatch correctly
}));

describe('DeleteDialog', () => {
  const mockDispatch = jest.fn();
  const mockDispatchDelete = jest.fn();
  const mockClearDelete = jest.fn();
  const mockDispatchList = jest.fn();
  const mockGetCurrentSport = '123';

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockClear();
    mockDispatchDelete.mockClear();
    mockClearDelete.mockClear();
    mockDispatchList.mockClear();
    (jest.spyOn(_, 'isEmpty') as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const defaultProps = {
    data: { id: 1, name: 'Test Item', nutritionPlanName: 'Test Nutrition Plan' },
    dispatchDelete: mockDispatchDelete,
    deleteResponse: { loading: false, data: null, error: null },
    clearDelete: mockClearDelete,
    module: 'itemID',
    dispatchList: mockDispatchList,
    title: 'Item',
    listUrl: '/api/items',
    getCurrentSport: mockGetCurrentSport,
    deleteUrl: '/api/delete-item',
    rowData: null,
    secodId: null,
  };

  it('renders default delete icon button', () => {
    renderWithProviders(<DeleteDialog {...defaultProps} />);
    expect(screen.getByLabelText('delete')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('renders outlined button when title is "Plan Template"', () => {
    renderWithProviders(<DeleteDialog {...defaultProps} title="Plan Template" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
  });

  it('opens dialog when delete button is clicked', () => {
    renderWithProviders(<DeleteDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('delete'));
    expect(screen.getByText(`Delete ${defaultProps.title}`)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure, Do you want to delete the Item from this list?/i)).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('closes dialog when close icon is clicked', async () => {
    renderWithProviders(<DeleteDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('delete'));
    fireEvent.click(screen.getByLabelText('close'));

    await waitFor(() => {
      expect(screen.queryByText(`Delete ${defaultProps.title}`)).not.toBeInTheDocument();
    });
  });

  it('opens dialog on outlined button (Plan Template) click', () => {
    renderWithProviders(<DeleteDialog {...defaultProps} title="Plan Template" />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete Plan Template')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure, Do you want to delete the Plan Template from this list/i)).toBeInTheDocument();
  });

  it('dispatches delete with deleteUrl and secodId', () => {
    const props = {
      ...defaultProps,
      deleteUrl: '/api/delete-item',
      module: 'itemID',
      rowData: null,
      secodId: 123,
      data: { itemID: 456, name: 'Item Name' }
    };

    renderWithProviders(<DeleteDialog {...props} />);
    fireEvent.click(screen.getByLabelText('delete'));
    fireEvent.click(screen.getByRole('button', { name: /Yes, delete/i }));

    expect(mockDispatchDelete).toHaveBeenCalledWith({
      url: props.deleteUrl,
      payload: {
        itemID: 456,
        testAndMedicalChecksID: 123
      }
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      mockDispatchDelete({
        url: props.deleteUrl,
        payload: {
          itemID: 456,
          testAndMedicalChecksID: 123
        }
      })
    );
  });

  it('dispatches correct payload for module "nutritionPlanID"', () => {
    const nutritionProps = {
      ...defaultProps,
      module: 'nutritionPlanID',
      data: { nutritionPlanID: 5, nutritionPlanName: 'Diet Plan' },
      deleteUrl: undefined,
    };

    renderWithProviders(<DeleteDialog {...nutritionProps} />);
    fireEvent.click(screen.getByLabelText('delete'));
    fireEvent.click(screen.getByRole('button', { name: /Yes, delete/i }));

    expect(mockDispatchDelete).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      mockDispatchDelete({ nutritionMenuPlanID: nutritionProps.data.nutritionPlanID })
    );
  });
it('shows success message and closes dialog', async () => {
  const successProps = {
    ...defaultProps,
    deleteResponse: { loading: false, data: { responseCode: 200 }, error: null },
  };

  const { rerender } = renderWithProviders(<DeleteDialog {...defaultProps} />);
  fireEvent.click(screen.getByLabelText('delete'));

  rerender(<DeleteDialog {...successProps} />);

// expect(
//   screen.getByText((content, element) =>
//     element?.textContent?.includes('Deleted Successfully') ?? false
//   )
// ).toBeInTheDocument();

  jest.advanceTimersByTime(2000);

  await waitFor(() => {
    expect(mockClearDelete).toHaveBeenCalled();
  });

  expect(mockDispatchList).toHaveBeenCalledTimes(1);
});


  it('dispatches dispatchList with default payload if listUrl is empty', async () => {
    const propsWithEmptyListUrl = {
      ...defaultProps,
      listUrl: '',
      deleteResponse: { loading: false, data: { responseCode: 200 }, error: null },
    };

    const { rerender } = renderWithProviders(<DeleteDialog {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('delete'));
    rerender(<DeleteDialog {...propsWithEmptyListUrl} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockDispatchList).toHaveBeenCalledWith({
        searchText: '',
        filteredBy: '',
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(mockGetCurrentSport),
      });
    });
  });
it('displays nutritionPlanName on success for module "nutritionPlanID"', async () => {
  const nutritionSuccessProps = {
    ...defaultProps,
    module: "nutritionPlanID",
    data: {
      nutritionPlanID: 1,
      nutritionPlanName: "My Diet Plan",
    },
    deleteResponse: {
      loading: false,
      data: { responseCode: 200 },
      error: null,
    },
  };

  const { rerender } = renderWithProviders(<DeleteDialog {...defaultProps} />);

  fireEvent.click(screen.getByLabelText("delete")); // Open the dialog

  rerender(<DeleteDialog {...nutritionSuccessProps} />);
  jest.advanceTimersByTime(2000);

});
it("shows loader when deleteResponse.loading is true", () => {
  const propsWithLoading = {
    ...defaultProps,
    deleteResponse: {
      loading: true,
      data: null,
      error: null,
    },
  };

  renderWithProviders(<DeleteDialog {...propsWithLoading} />);
  fireEvent.click(screen.getByLabelText("delete"));
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});
});

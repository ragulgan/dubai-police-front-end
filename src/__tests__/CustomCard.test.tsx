import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomCard from '@/components/CustomCard';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Mocks
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { teamID: '1' },
    push: jest.fn(),
  }),
}));
jest.mock('next/navigation', () => ({
  usePathname: () => '/teams/1/mainPage',
}));
jest.mock('@/utils/helper', () => ({
  getLocalStorage: jest.fn(() => '1'),
  setLocalStorage: jest.fn(),
}));
jest.mock('@/redux/slices/appSplice', () => ({
  handleSubMenu: jest.fn(() => ({ type: 'HANDLE_SUB_MENU' })),
}));
jest.mock('@mui/material/useMediaQuery', () => () => false);

const baseState = {
  ui: { allSportMenu: false },
  getSportList: {
    loading: false,
    data: [
      { sportID: 1, sportName: 'Football', sportProfile: '', sportGifProfile: '', categoryType: 'A' },
      { sportID: 2, sportName: 'Basketball', sportProfile: '', sportGifProfile: '', categoryType: 'B' },
    ],
  },
};

function createStore(customState: Partial<typeof baseState> = {}) {
  const rootReducer = combineReducers({
    ui: (state = baseState.ui) => ({ ...state, ...(customState.ui || {}) }),
    getSportList: (state = baseState.getSportList) => ({ ...state, ...(customState.getSportList || {}) }),
  });
  return configureStore({ reducer: rootReducer });
}

let originalScrollIntoView: any;
beforeAll(() => {
  originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
  window.HTMLElement.prototype.scrollIntoView = function() {};
});
afterAll(() => {
  window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
});

describe('CustomCard', () => {
  it('renders non-dialog card and module list', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <CustomCard path="/teams" customSelect="Main Page" />
      </Provider>
    );
    expect(screen.getByText('Main Page')).toBeInTheDocument();
    expect(screen.getByText('Team Overview')).toBeInTheDocument();
    expect(screen.getByText('Staffs')).toBeInTheDocument();
  });

  it('renders dialog when isSubOpen is true', () => {
    const store = createStore({ ui: { allSportMenu: true } });
    render(
      <Provider store={store}>
        <CustomCard path="/teams" customSelect="Main Page" />
      </Provider>
    );
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Sport...')).toBeInTheDocument();
    expect(screen.getByText('All Sport')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toBeInTheDocument();
  });

  it('shows skeletons when loading', () => {
    const store = createStore({
      ui: { allSportMenu: true },
      getSportList: { loading: true, data: [] },
    });
    render(
      <Provider store={store}>
        <CustomCard path="/teams" customSelect="Main Page" />
      </Provider>
    );
    expect(screen.getAllByTestId('sport-skeleton').length).toBeGreaterThan(0);
  });

  it('handles chip click', () => {
    const store = createStore({ ui: { allSportMenu: true } });
    render(
      <Provider store={store}>
        <CustomCard path="/teams" customSelect="Main Page" />
      </Provider>
    );
    const chip = screen.getByText('Category A');
    fireEvent.click(chip);
    expect(chip).toBeInTheDocument();
  });

  it('handles module list item click', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <CustomCard path="/teams" customSelect="Main Page" />
      </Provider>
    );
    const item = screen.getByText('Team Overview');
    fireEvent.click(item);
    expect(item).toBeInTheDocument();
  });

  it('handles sport avatar click', () => {
    const store = createStore({ ui: { allSportMenu: true } });
    render(
      <Provider store={store}>
        <CustomCard path="/teams" customSelect="Main Page" />
      </Provider>
    );
    // Find the avatar by the sport name and click the parent avatar div
    const footballLabel = screen.getByText('Football');
    // The avatar is the previous sibling of the label
    const avatarDiv = footballLabel.previousSibling as HTMLElement;
    fireEvent.click(avatarDiv);
    expect(footballLabel).toBeInTheDocument();
  });
}); 
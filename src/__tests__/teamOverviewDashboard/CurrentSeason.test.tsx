import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import CurrentSeason from '@/components/teamOverviewDashboard/currentSeason';

// Mocks
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { teamID: '1' },
    push: jest.fn(),
  }),
}));
jest.mock('@/components/common/CounterAnimation', () => () => <div>Count</div>);

const baseState = {
  getTeamOverviewCount: {
    loading: false,
    data: [
      {
        sportName: 'Football',
        totalCompetition: 5,
        maleAthletes: 10,
        totalMedal: 3,
        femaleAthletes: 7,
        nationalTeamAthletes: 2,
        currentSeason: 'preSeasons',
        preSeasons: 'Jan - Mar 2025',
        inSeasons: 'Jun - Dec 2025',
        offSeasons: 'Mar - Jun 2025',
      },
    ],
  },
  listSeason: {
    loading: false,
    code: 200,
    data: [
      { seasonID: 1, seasonName: '2025' },
    ],
  },
};

function createStore(customState: Partial<typeof baseState> = {}) {
  const rootReducer = combineReducers({
    getTeamOverviewCount: (state = baseState.getTeamOverviewCount) => ({ ...state, ...(customState.getTeamOverviewCount || {}) }),
    listSeason: (state = baseState.listSeason) => ({ ...state, ...(customState.listSeason || {}) }),
  });
  return configureStore({ reducer: rootReducer });
}

describe('CurrentSeason', () => {
  it('renders loading skeleton when loading', () => {
    const store = createStore({ getTeamOverviewCount: { ...baseState.getTeamOverviewCount, loading: true } });
    render(
      <Provider store={store}>
        <CurrentSeason phases={[]} />
      </Provider>
    );
    const skeletons = document.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons).toHaveLength(3);
  });

  it('renders sport name and phase cards', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <CurrentSeason phases={[
          { label: 'Pre-Season', duration: '(Jan - Mar 2025)' },
          { label: 'Off-Season', duration: '(Mar - Jun 2025)' },
          { label: 'In-Season', duration: '(Jun - Dec 2025)' },
        ]} />
      </Provider>
    );
    expect(screen.getByText('Current Season')).toBeInTheDocument();
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Total Competition')).toBeInTheDocument();
    expect(screen.getByText('Male Athletes')).toBeInTheDocument();
    expect(screen.getByText('Total Medals')).toBeInTheDocument();
    expect(screen.getByText('Female Athletes')).toBeInTheDocument();
    expect(screen.getByText('National Team Athletes')).toBeInTheDocument();
    expect(screen.getByText(/Pre-Season/)).toBeInTheDocument();
    expect(screen.getByText(/In-Season/)).toBeInTheDocument();
    expect(screen.getByText(/Off-Season/)).toBeInTheDocument();
  });

  it('renders select with season options', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <CurrentSeason phases={[]} />
      </Provider>
    );
    expect(screen.getByText('2025')).toBeInTheDocument();
  });
}); 
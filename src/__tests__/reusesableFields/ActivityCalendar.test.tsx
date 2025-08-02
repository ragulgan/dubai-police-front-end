import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/components/calendar/ActivityCalendar'; // Adjust path as needed
import '@testing-library/jest-dom';

// Mock the ActivityCalender component
jest.mock('@/components/calendar/YearAndMonth', () => ({
  __esModule: true,
  default: ({ seasonPlannerList }: any) => (
    <div data-testid="activity-calendar">
      {seasonPlannerList.map((monthData: any, index: number) => (
        <div key={index} data-testid="month-block">
          <h3>{monthData.month} {monthData.year}</h3>
          {monthData.data.length > 0 ? (
            monthData.data.map((event: any, i: number) => (
              <div key={i} data-testid="event-item">
                <p>{event.planName}</p>
                <p>{event.date}</p>
              </div>
            ))
          ) : (
            <p data-testid="no-events">No events</p>
          )}
        </div>
      ))}
    </div>
  ),
}));

describe('Page Component', () => {
  it('renders calendar with 12 months', () => {
    render(<Page />);
    const monthBlocks = screen.getAllByTestId('month-block');
    expect(monthBlocks).toHaveLength(12);
  });

  it('renders correct event data for specific months', () => {
    render(<Page />);
    expect(screen.getByText('Winter Training')).toBeInTheDocument();
    expect(screen.getByText('2025-01-15')).toBeInTheDocument();
    expect(screen.getByText('Trial Match')).toBeInTheDocument();
    expect(screen.getByText('2025-03-10')).toBeInTheDocument();
    expect(screen.getByText('Holiday Break')).toBeInTheDocument();
    expect(screen.getByText('2025-04-20')).toBeInTheDocument();
    expect(screen.getByText('May Kickoff')).toBeInTheDocument();
    expect(screen.getByText('2025-05-01')).toBeInTheDocument();
  });

  it('shows "No events" for months without data', () => {
    render(<Page />);
    const noEventsTexts = screen.getAllByTestId('no-events');
    expect(noEventsTexts).toHaveLength(8);
  });
});

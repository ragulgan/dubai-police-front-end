import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportCard from '@/components/reports/ReportCard';
import '@testing-library/jest-dom';
import moment from 'moment';

jest.mock('next/router', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));

const mockResults = {
  eventName: 'Dubai Super Cup 2024',
  eventLocation: 'Dubai',
  eventDate: '2024-12-12',
  resultID: 'result123',
  beforeRaceStatus: 'Submitted',
  afterRaceStatus: 'Pending',
};

const mockPlanning = {
  race: {
    raceName: 'Dubai Super Cup 2024',
    city: 'Dubai',
    startDate: '2024-12-12',
  },
};

describe('ReportCard component', () => {
  const mockSubmitFinalReport = jest.fn();
  const mockBeforeReport = jest.fn();
  const mockSetSelectedData = jest.fn();
  const mockGetCurrentSport = 'football';

  const defaultProps = {
    key: 1,
    cardIndex: 1,
    sportId: '1',
    currentPath: 'latest-results',
    results: { ...mockResults, planning: mockPlanning },
    getCurrentSport: mockGetCurrentSport,
    submitFinalReport: mockSubmitFinalReport,
    beforeReport: mockBeforeReport,
    setSelectedData: mockSetSelectedData,
  };

  it('displays correct race name, city, and date', () => {
    render(<ReportCard {...defaultProps} />);
    expect(screen.getByText('Dubai Super Cup 2024')).toBeInTheDocument();
    expect(screen.getByText('Dubai')).toBeInTheDocument();
    expect(screen.getByText(moment(mockPlanning.race.startDate).format('DD-MM-YYYY'))).toBeInTheDocument();
  });

  it('triggers submitFinalReport and setSelectedData on submit button click', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByText(/Submit Final Report/i));
    expect(mockSetSelectedData).toHaveBeenCalledWith(expect.objectContaining(mockResults));
    expect(mockSubmitFinalReport).toHaveBeenCalledWith(true);
  });

  it('triggers beforeReport and setSelectedData on planning report button click', () => {
    render(<ReportCard {...defaultProps} />);
    fireEvent.click(screen.getByText(/View Planning Report/i));
    expect(mockSetSelectedData).toHaveBeenCalledWith(expect.objectContaining(mockResults));
    expect(mockBeforeReport).toHaveBeenCalledWith(true);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ReportCard {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
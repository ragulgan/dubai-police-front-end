import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import SubMenuRegistration from '@/components/subMenuRegistration';
import { setLocalStorage } from '@/utils/helper';

// Mock Skeleton to be able to query it reliably
jest.mock('@mui/material/Skeleton', () => {
  const React = require('react');
  return function MockSkeleton(props: any) {
    return <div data-testid="skeleton" {...props} />;
  };
});

// Mock the react-redux module
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock child components and dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/utils/helper', () => ({
  setLocalStorage: jest.fn(),
  getLocalStorage: jest.fn(),
}));

jest.mock('@/components/Fields/SearchField', () => ({ value, onChange, placeholder }: any) => (
  <input
    data-testid="search-field"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
));

jest.mock('@/components/UserCreation', () => {
  // The factory must return the mock component
  return function MockedUserCreation({ open, onClose, module, teamID }: any) {
    if (!open) return null;
    return (
      <div data-testid="user-creation-dialog">
        <h2>{module}</h2>
        <p>Team ID: {teamID}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('@/utils/constants', () => ({
  // Use a simple string to avoid JSX compilation issues in the mock
  sportsIconDropData: Array(21).fill({ icon: 'default-icon-text' }),
}));

const mockSportsList = {
  loading: false,
  data: [
    { sportID: '1', sportName: 'Football', categoryType: 'A', sportProfile: 'football.jpg' },
    { sportID: '2', sportName: 'Basketball', categoryType: 'B', sportProfile: 'basketball.jpg' },
    { sportID: '3', sportName: 'Tennis', categoryType: 'C', sportProfile: '' },
  ],
};

// No Redux Provider or mock store is needed when useSelector is mocked directly.
const renderComponent = () => {
  return render(<SubMenuRegistration path="staffs" customSelect="Staff" />);
};

describe('SubMenuRegistration', () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it('renders the title, search field, and category chips', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    // Use getAllByText as "All Sports" is a title and a chip
    expect(screen.getAllByText('All Sports')).toHaveLength(2);
    expect(screen.getByTestId('search-field')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();
  });

  it('renders skeletons when data is loading', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({
      getSportList: { ...mockSportsList, loading: true }
    }));
    renderComponent();
    // The component renders 30 items with 2 skeletons each. We query by the mocked component.
    expect(screen.getAllByTestId('skeleton')).toHaveLength(60);
  });

  it('renders all sports items from the store', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Tennis')).toBeInTheDocument();
  });

  it('filters sports based on search input', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    const searchInput = screen.getByTestId('search-field');
    fireEvent.change(searchInput, { target: { value: 'Foot' } });
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.queryByText('Basketball')).not.toBeInTheDocument();
  });

  it('filters sports based on chip selection', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    const categoryBChip = screen.getByText('Category B');
    fireEvent.click(categoryBChip);
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.queryByText('Football')).not.toBeInTheDocument();
  });

  it('selects a sport and shows registration options', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    const footballAvatar = screen.getByText('Football').previousSibling?.firstChild;
    if (footballAvatar) {
        fireEvent.click(footballAvatar);
    }
    expect(setLocalStorage).toHaveBeenCalledWith('sport', '1');
    expect(screen.getByText('Register Staff')).toBeInTheDocument();
    expect(screen.getByText('Register Athlete')).toBeInTheDocument();
  });

  it('opens the UserCreation dialog when "Register Staff" is clicked', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    const footballAvatar = screen.getByText('Football').previousSibling?.firstChild;
     if (footballAvatar) {
        fireEvent.click(footballAvatar);
    }
    const registerStaffLink = await screen.findByText('Register Staff');
    fireEvent.click(registerStaffLink);
    
    await waitFor(() => {
        expect(screen.getByTestId('user-creation-dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('RegisterStaff')).toBeInTheDocument();
  });

  it('opens and closes the UserCreation dialog for Athlete', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
     const footballAvatar = screen.getByText('Football').previousSibling?.firstChild;
     if (footballAvatar) {
        fireEvent.click(footballAvatar);
    }

    const registerAthleteLink = await screen.findByText('Register Athlete');
    fireEvent.click(registerAthleteLink);

    await waitFor(() => {
      expect(screen.getByTestId('user-creation-dialog')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('user-creation-dialog')).not.toBeInTheDocument();
    });
  });

  it('uses a fallback icon when sportProfile is empty', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector => selector({ getSportList: mockSportsList }));
    renderComponent();
    expect(screen.getByText('Tennis')).toBeInTheDocument();
    // Check for the simple text content instead of a data-testid
    expect(screen.getByText('default-icon-text')).toBeInTheDocument();
  });
}); 
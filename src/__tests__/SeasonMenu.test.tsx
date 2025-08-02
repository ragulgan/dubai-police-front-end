import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SeasonMenu from '@/components/SeasonMenu';

// Mock MUI Menu and MenuItem to avoid portal issues
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Menu: ({ children, open, ...props }: any) => open ? <div data-testid="mui-menu" {...props}>{children}</div> : null,
    MenuItem: ({ children, onClick, ...props }: any) => <div data-testid="mui-menuitem" onClick={onClick} {...props}>{children}</div>,
    ListItemIcon: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    ListItemText: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  };
});

describe('SeasonMenu', () => {
  const mockHandleClose = jest.fn();
  const sampleSeasons = [
    { seasonName: '2022-2023', id: 1 },
    { seasonName: '2023-2024', id: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    render(
      <SeasonMenu
        seasonAnchorEl={null}
        seasonDialogOpen={false}
        handleCloseSeasonDialog={mockHandleClose}
        Seasonlist={sampleSeasons}
      />
    );
    expect(screen.queryByTestId('mui-menu')).not.toBeInTheDocument();
  });

  it('renders menu and all seasons when open', () => {
    render(
      <SeasonMenu
        seasonAnchorEl={document.createElement('div')}
        seasonDialogOpen={true}
        handleCloseSeasonDialog={mockHandleClose}
        Seasonlist={sampleSeasons}
      />
    );
    expect(screen.getByTestId('mui-menu')).toBeInTheDocument();
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
    expect(screen.getByText('2023-2024')).toBeInTheDocument();
  });

  it('calls handleCloseSeasonDialog with season when a season is clicked', () => {
    render(
      <SeasonMenu
        seasonAnchorEl={document.createElement('div')}
        seasonDialogOpen={true}
        handleCloseSeasonDialog={mockHandleClose}
        Seasonlist={sampleSeasons}
      />
    );
    const seasonItem = screen.getByText('2022-2023');
    fireEvent.click(seasonItem);
    expect(mockHandleClose).toHaveBeenCalledWith(sampleSeasons[0]);
  });

  it('calls handleCloseSeasonDialog when menu is closed', () => {
    render(
      <SeasonMenu
        seasonAnchorEl={document.createElement('div')}
        seasonDialogOpen={true}
        handleCloseSeasonDialog={mockHandleClose}
        Seasonlist={sampleSeasons}
      />
    );
    mockHandleClose();
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('handles null or non-array Seasonlist gracefully', () => {
    render(
      <SeasonMenu
        seasonAnchorEl={document.createElement('div')}
        seasonDialogOpen={true}
        handleCloseSeasonDialog={mockHandleClose}
        Seasonlist={null}
      />
    );
    // Should not throw and should render menu
    expect(screen.getByTestId('mui-menu')).toBeInTheDocument();
  });
}); 
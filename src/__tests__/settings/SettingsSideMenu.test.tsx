import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsSideMenu from '@/components/settings/SettingsSideMenu';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SettingsSideMenu', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      push: pushMock,
    });
  });

  it('renders all top-level menu items', () => {
    render(<SettingsSideMenu activeMenuID={1} />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Roles & Permissions')).toBeInTheDocument();
    expect(screen.getByText('Season Settings')).toBeInTheDocument();
    expect(screen.getByText('Admin Settings')).toBeInTheDocument();
  });

  it('applies active style based on activeMenuID', () => {
    render(<SettingsSideMenu activeMenuID={1} />);
    const activeItem = screen.getByText('User Management');
    expect(activeItem).toHaveStyle('background-color: #008755');
  });

  it('navigates to the correct menuLink when clicked', () => {
    render(<SettingsSideMenu activeMenuID={1} />);
    fireEvent.click(screen.getByText('Season Settings'));
    expect(pushMock).toHaveBeenCalledWith('/season-settings');
  });

  it('opens and shows admin submenu on click', () => {
    render(<SettingsSideMenu activeMenuID={4} />);
    const adminSettings = screen.getByText('Admin Settings');
    fireEvent.click(adminSettings);

    // Check for a submenu item
    expect(screen.getByText('Staff Role')).toBeInTheDocument();
    expect(screen.getByText('Sports List')).toBeInTheDocument();
  });

  it('highlights active submenu item based on router pathname', () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/admin-settings/staff-role',
      push: pushMock,
    });

    render(<SettingsSideMenu activeMenuID={0} />);
    const submenuItem = screen.getByText('Staff Role');
    expect(submenuItem).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
  });

  it('clicking submenu item triggers navigation', () => {
    render(<SettingsSideMenu activeMenuID={4} />);
    fireEvent.click(screen.getByText('Admin Settings'));

    fireEvent.click(screen.getByText('Facility Type'));
    expect(pushMock).toHaveBeenCalledWith('/admin-settings/facility-type');
  });
});

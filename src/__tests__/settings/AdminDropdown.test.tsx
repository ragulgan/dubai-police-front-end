import { render, screen, fireEvent } from '@testing-library/react';
import AdminDropdown from '@/components/settings/AdminDropdown';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

// Mock useRouter from Next.js
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('AdminDropdown Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  const item = {
    title: 'Admin',
    subMenu: [
      { title: 'Dashboard', menuLink: '/admin/dashboard' },
      { title: 'Users', menuLink: '/admin/users' },
    ],
  };

  it('renders the button with title', () => {
    render(<AdminDropdown isAdmin={true} adminOpen={true} item={item} />);
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument();
  });

  it('opens the menu when button is clicked', () => {
    render(<AdminDropdown isAdmin={true} adminOpen={true} item={item} />);
    
    const button = screen.getByRole('button', { name: /admin/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('navigates to correct route on menu item click', () => {
    render(<AdminDropdown isAdmin={true} adminOpen={true} item={item} />);
    
    const button = screen.getByRole('button', { name: /admin/i });
    fireEvent.click(button);
    
    const menuItem = screen.getByText('Users');
    fireEvent.click(menuItem);
    
    expect(pushMock).toHaveBeenCalledWith('/admin/users');
  });

  it('does not render if isAdmin or adminOpen is false (manually uncomment conditional)', () => {
    // Only valid if you uncomment the conditional rendering inside component
    render(<AdminDropdown isAdmin={false} adminOpen={true} item={item} />);
    expect(screen.queryByRole('button', { name: /admin/i })).not.toBeInTheDocument();
  });
});

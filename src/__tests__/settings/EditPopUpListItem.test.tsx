import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditPopUpListItem from '@/components/settings/EditPopUpListItem';

describe('EditPopUpListItem', () => {
  const mockOnEditClick = jest.fn();

  const baseProps = {
    id: 1,
    title: 'Basketball',
    order: 3,
    category: 'Outdoor',
    active: 1,
    onEditClick: mockOnEditClick,
    isEditing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sport title, category, order, and active chip', () => {
    render(<EditPopUpListItem {...baseProps} />);
    
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Outdoor')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders inactive chip when active=0', () => {
    render(<EditPopUpListItem {...baseProps} active={0} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('calls onEditClick with id and title when edit icon is clicked', () => {
    render(<EditPopUpListItem {...baseProps} />);
    const editButton = screen.getByRole('button');
    fireEvent.click(editButton);
    expect(mockOnEditClick).toHaveBeenCalledWith(1, 'Basketball');
  });

  it('renders correct styles and layout', () => {
    const { container } = render(<EditPopUpListItem {...baseProps} />);
    expect(container.firstChild).toHaveStyle('display: grid');
    expect(container.firstChild).toHaveStyle('grid-template-columns: 10% 35% 20% 20% 20% 0%');
  });
});

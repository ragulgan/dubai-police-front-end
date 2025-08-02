import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditDeleteListItem from '@/components/settings/EditDeleteListItem';

describe('EditDeleteListItem', () => {
  const mockProps = {
    id: 1,
    value: 'Custom Contract',
    isEditing: false,
    onEditClick: jest.fn(),
    onChange: jest.fn(),
    onUpdate: jest.fn(),
    updatedTitle: '',
    onDeleteClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the value and both action buttons', () => {
    render(<EditDeleteListItem {...mockProps} />);
    expect(screen.getByText('Custom Contract')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2); // Edit & Delete buttons
  });

  it('calls onEditClick when Edit icon is clicked', () => {
    render(<EditDeleteListItem {...mockProps} />);
    const editButton = screen.getAllByRole('button')[0];
    fireEvent.click(editButton);
    expect(mockProps.onEditClick).toHaveBeenCalledWith(1, 'Custom Contract');
  });

  it('calls onDeleteClick when Delete icon is clicked', () => {
    render(<EditDeleteListItem {...mockProps} />);
    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);
    expect(mockProps.onDeleteClick).toHaveBeenCalledWith(1);
  });

  it('disables Edit & Delete for restricted values', () => {
    const disabledProps = { ...mockProps, value: 'Collaboration Contracts' };
    render(<EditDeleteListItem {...disabledProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it('renders input and update button in editing mode', () => {
    render(
      <EditDeleteListItem
        {...mockProps}
        isEditing={true}
        updatedTitle="Updated Contract"
      />
    );
    expect(screen.getByRole('textbox')).toHaveValue('Updated Contract');
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('disables update button if input is empty', () => {
    render(
      <EditDeleteListItem
        {...mockProps}
        isEditing={true}
        updatedTitle=""
      />
    );
    const updateButton = screen.getByRole('button', { name: /update/i });
    expect(updateButton).toBeDisabled();
  });

  it('calls onChange when input is typed in editing mode', () => {
    render(
      <EditDeleteListItem
        {...mockProps}
        isEditing={true}
        updatedTitle="Updated Contract"
      />
    );
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'New Name' },
    });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('calls onUpdate when update button is clicked', () => {
    render(
      <EditDeleteListItem
        {...mockProps}
        isEditing={true}
        updatedTitle="Updated Contract"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(mockProps.onUpdate).toHaveBeenCalled();
  });
});

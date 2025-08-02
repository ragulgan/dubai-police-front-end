import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditableListItem from '@/components/settings/EditableListItem';

describe('EditableListItem', () => {
  const defaultProps = {
    id: 1,
    value: 'Admin',
    isEditing: false,
    onEditClick: jest.fn(),
    onChange: jest.fn(),
    onUpdate: jest.fn(),
    updatedTitle: '',
  };

  it('renders the role name when not in editing mode', () => {
    render(<EditableListItem {...defaultProps} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Edit icon button
  });

  it('calls onEditClick when edit button is clicked', () => {
    render(<EditableListItem {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onEditClick).toHaveBeenCalledWith(1, 'Admin');
  });

  it('renders TextField and Update button when in editing mode', () => {
    render(
      <EditableListItem
        {...defaultProps}
        isEditing={true}
        updatedTitle="Editor"
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('calls onChange when typing into the TextField', () => {
    render(
      <EditableListItem
        {...defaultProps}
        isEditing={true}
        updatedTitle="Editor"
      />
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Manager' },
    });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('calls onUpdate when Update button is clicked', () => {
    render(
      <EditableListItem
        {...defaultProps}
        isEditing={true}
        updatedTitle="Manager"
      />
    );

    const updateButton = screen.getByRole('button', { name: /update/i });
    expect(updateButton).not.toBeDisabled();

    fireEvent.click(updateButton);
    expect(defaultProps.onUpdate).toHaveBeenCalled();
  });

  it('disables Update button if input is empty', () => {
    render(
      <EditableListItem
        {...defaultProps}
        isEditing={true}
        updatedTitle=""
      />
    );

    const updateButton = screen.getByRole('button', { name: /update/i });
    expect(updateButton).toBeDisabled();
  });
});

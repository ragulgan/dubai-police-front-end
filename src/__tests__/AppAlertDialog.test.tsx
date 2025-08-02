import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppAlertDialog from '@/components/AppAlertDialog';

describe('AppAlertDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    title: 'Confirm Delete',
    description: 'Are you sure you want to delete this item?',
    onAgree: jest.fn(),
    onDisagree: jest.fn(),
    agreeLabel: 'Yes',
    disagreeLabel: 'No',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description correctly', () => {
    render(<AppAlertDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('renders agree and disagree buttons with custom labels', () => {
    render(<AppAlertDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('calls onDisagree when disagree button is clicked', () => {
    render(<AppAlertDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(defaultProps.onDisagree).toHaveBeenCalled();
  });

  it('calls onAgree when agree button is clicked', () => {
    render(<AppAlertDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(defaultProps.onAgree).toHaveBeenCalled();
  });

  it('calls onClose if onDisagree is not provided', () => {
    const { onClose, ...rest } = defaultProps;
    render(<AppAlertDialog {...rest} onDisagree={undefined} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose if onAgree is not provided', () => {
    const { onClose, ...rest } = defaultProps;
    render(<AppAlertDialog {...rest} onAgree={undefined} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render anything if `open` is false', () => {
    render(<AppAlertDialog {...defaultProps} open={false} />);
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
  });
});

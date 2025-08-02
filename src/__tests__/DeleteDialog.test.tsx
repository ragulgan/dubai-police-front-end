import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteDialog from '@/components/DeleteDialog';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: () => ({}) });

describe('DeleteDialog', () => {
  const title = 'Athlete';
  let setOpen: jest.Mock;
  let isDelete: jest.Mock;

  beforeEach(() => {
    setOpen = jest.fn();
    isDelete = jest.fn();
  });

  it('renders dialog with correct title and description', () => {
    render(
      <Provider store={store}>
      <DeleteDialog
        open={true}
        setOpen={setOpen}
        isDelete={isDelete}
        title={title}
      />
      </Provider>
    );
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/Do you want to delete the Athlete from this list/i)).toBeInTheDocument();
    expect(screen.getByText(/Once the Athlete is deleted, you cannot not revert/i)).toBeInTheDocument();
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('No, I want to Keep')).toBeInTheDocument();
  });

  it('calls isDelete when "Yes, delete" is clicked', () => {
    render(
      <Provider store={store}>
      <DeleteDialog
        open={true}
        setOpen={setOpen}
        isDelete={isDelete}
        title={title}
      />
      </Provider>
    );
    fireEvent.click(screen.getByText('Yes, delete'));
    expect(isDelete).toHaveBeenCalled();
  });

  it('calls setOpen(false) when "No, I want to Keep" is clicked', () => {
    render(
      <Provider store={store}>
      <DeleteDialog
        open={true}
        setOpen={setOpen}
        isDelete={isDelete}
        title={title}
      />
      </Provider>
    );
    fireEvent.click(screen.getByText('No, I want to Keep'));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('calls setOpen(false) when close icon is clicked', () => {
    render(
      <Provider store={store}>
      <DeleteDialog
        open={true}
        setOpen={setOpen}
        isDelete={isDelete}
        title={title}
      />
      </Provider>
    );
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('does not render dialog when open is false', () => {
    render(
      <Provider store={store}>
      <DeleteDialog
        open={false}
        setOpen={setOpen}
        isDelete={isDelete}
        title={title}
      />
      </Provider>
    );
    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
  });
});
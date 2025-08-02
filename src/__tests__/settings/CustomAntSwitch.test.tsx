import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomAntSwitch from '@/components/settings/CustomAntSwitch';
import { useForm, Controller } from 'react-hook-form';
import '@testing-library/jest-dom';

const renderWithForm = (defaultValues = { status: 0 }, error?: string) => {
  const Wrapper = () => {
    const { control } = useForm({ defaultValues });

    return (
      <CustomAntSwitch
        name="status"
        label="Status"
        control={control}
        error={error}
      />
    );
  };

  return render(<Wrapper />);
};

describe('CustomAntSwitch', () => {
  it('renders with default label and inactive state', () => {
    renderWithForm();

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();

    const switchEl = screen.getByRole('checkbox');
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).not.toBeChecked(); // switch not checked by default
  });

  it('renders with error message', () => {
    renderWithForm({ status: 0 }, 'This field is required');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('toggles to active on click', () => {
    renderWithForm({ status: 0 });

    const switchEl = screen.getByRole('checkbox');
    fireEvent.click(switchEl);

    // Label should now be 'Active'
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders as checked when value is 1', () => {
    renderWithForm({ status: 1 });
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
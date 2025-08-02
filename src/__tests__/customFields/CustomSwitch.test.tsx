import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, Controller } from 'react-hook-form';
import CustomSwitch from '@/components/Fields/CustomSwitch';

// Helper component to test CustomSwitch with react-hook-form
type FormValues = {
  testSwitch: boolean;
};

const renderWithForm = (props?: Partial<{ required: boolean; disabled: boolean }>, defaultValues?: Partial<FormValues>) => {
  const Wrapper = () => {
    const { control, handleSubmit } = useForm<FormValues>({
      defaultValues: { testSwitch: defaultValues?.testSwitch ?? false },
    });
    return (
      <form onSubmit={handleSubmit(() => {})}>
        <CustomSwitch
          name="testSwitch"
          control={control}
          label="Test Switch"
          required={props?.required}
          disabled={props?.disabled}
        />
        <button type="submit">Submit</button>
      </form>
    );
  };
  return render(<Wrapper />);
};

describe('CustomSwitch', () => {
  it('renders with label', () => {
    renderWithForm();
    expect(screen.getByText('Test Switch')).toBeInTheDocument();
  });

  it('shows required asterisk if required', () => {
    renderWithForm({ required: true });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows ON when checked and OFF when unchecked', () => {
    renderWithForm({}, { testSwitch: false });
    expect(screen.getByText('OFF')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByText('ON')).toBeInTheDocument();
  });

  it('calls onChange when toggled', () => {
    renderWithForm({}, { testSwitch: false });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('shows error message if required and not checked', async () => {
    renderWithForm({ required: true }, { testSwitch: false });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Test Switch is required')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    renderWithForm({ disabled: true });
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});

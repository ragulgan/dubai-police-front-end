import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomRadioGroup from '@/components/Fields/CustomRadioGroup';
import { useForm, FormProvider } from 'react-hook-form';

describe('CustomRadioGroup Component', () => {
  const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other', disabled: true },
  ];

  const Wrapper = ({
    required = false,
    onSubmit = jest.fn(),
  }: {
    required?: boolean;
    onSubmit?: (data: any) => void;
  }) => {
    const methods = useForm({
      defaultValues: {
        gender: '',
      },
    });

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} data-testid="form">
          <CustomRadioGroup
            name="gender"
            control={methods.control}
            label="Gender"
            options={options}
            required={required}
          />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    );
  };

  it('renders all radio buttons with correct labels', () => {
    render(<Wrapper />);
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(screen.getByLabelText('Other')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(<Wrapper required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error if required is true and no option is selected on submit', async () => {
    render(<Wrapper required />);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Gender is required')).toBeInTheDocument();
    });
  });

  it('selects a radio button and submits the form', async () => {
    const onSubmit = jest.fn();
    render(<Wrapper required onSubmit={onSubmit} />);

    const maleRadio = screen.getByLabelText('Male') as HTMLInputElement;
    fireEvent.click(maleRadio);
    expect(maleRadio.checked).toBe(true);

    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ gender: 'male' }, expect.anything());
    });
  });

  it('disables the radio button if disabled is true', () => {
    render(<Wrapper />);
    const otherRadio = screen.getByLabelText('Other') as HTMLInputElement;
    expect(otherRadio.disabled).toBe(true);
  });
}); 
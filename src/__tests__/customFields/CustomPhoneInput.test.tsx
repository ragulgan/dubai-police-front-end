import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomPhoneInput from '@/components/Fields/CustomPhoneInput';
import { useForm, FormProvider } from 'react-hook-form';

describe('CustomPhoneInput Component', () => {
  const Wrapper = ({
    required = false,
    onSubmit = jest.fn(),
    onChangeFormatted,
    disabled = false,
    defaultDialCode = '971',
  }: {
    required?: boolean;
    onSubmit?: (data: any) => void;
    onChangeFormatted?: (dialCode: string, phone: string) => void;
    disabled?: boolean;
    defaultDialCode?: string;
  }) => {
    const methods = useForm({
      defaultValues: {
        phone: '',
      },
    });

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} data-testid="form">
          <CustomPhoneInput
            name="phone"
            control={methods.control}
            label="Phone Number"
            rules={required ? { required: 'Phone Number is required' } : {}}
            onChangeFormatted={onChangeFormatted}
            disabled={disabled}
            defaultDialCode={defaultDialCode}
          />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    );
  };

  it('renders the phone input and label', () => {
    render(<Wrapper />);
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(<Wrapper required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error if required is true and no value is entered on submit', async () => {
    render(<Wrapper required />);
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByText('Phone Number is required')).toBeInTheDocument();
    });
  });

  it('calls onChangeFormatted with correct values when phone changes', async () => {
    const onChangeFormatted = jest.fn();
    render(<Wrapper onChangeFormatted={onChangeFormatted} />);
    const input = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '+971501234567' } });
    // react-phone-input-2 triggers onChange on blur or change, so fire blur
    fireEvent.blur(input);
    await waitFor(() => {
      expect(onChangeFormatted).toHaveBeenCalled();
    });
  });

  it('disables the input when disabled is true', () => {
    render(<Wrapper disabled />);
    const input = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
}); 
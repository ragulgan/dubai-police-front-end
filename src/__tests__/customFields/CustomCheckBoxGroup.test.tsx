import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomCheckboxGroup from '@/components/Fields/CustomCheckboxGroup';
import { useForm, FormProvider } from 'react-hook-form';

describe('CustomCheckboxGroup Component', () => {
  const options = [
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
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
        sports: {
          football: false,
          basketball: false,
          tennis: false,
        },
      },
    });

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} data-testid="form">
          <CustomCheckboxGroup
            name="sports"
            control={methods.control}
            label="Select Sports"
            options={options}
            required={required}
          />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    );
  };

  it('renders all checkboxes with correct labels', () => {
    render(<Wrapper />);
    expect(screen.getByLabelText('Football')).toBeInTheDocument();
    expect(screen.getByLabelText('Basketball')).toBeInTheDocument();
    expect(screen.getByLabelText('Tennis')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(<Wrapper required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error if required is true and no option is selected on submit', async () => {
    render(<Wrapper required />);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(
        screen.getByText('Please select at least one option.')
      ).toBeInTheDocument();
    });
  });

  it('selects and unselects a checkbox', async () => {
  const onSubmit = jest.fn();
  render(<Wrapper required onSubmit={onSubmit} />);

  const footballCheckbox = screen.getByLabelText('Football') as HTMLInputElement;
  expect(footballCheckbox.checked).toBe(false);

  fireEvent.click(footballCheckbox);
  expect(footballCheckbox.checked).toBe(true);
});

});

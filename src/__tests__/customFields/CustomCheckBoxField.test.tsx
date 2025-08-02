import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import CustomCheckBox from '@/components/Fields/CustomCheckBox';

type FormValues = {
  sports: string[];
};

const options = ['Football', 'Basketball', 'Cricket'];

const WrapperComponent = ({ required = false }: { required?: boolean }) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      sports: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <CustomCheckBox
          name="sports"
          control={methods.control}
          label="Select Sports"
          options={options}
          required={required}
        />
      </form>
    </FormProvider>
  );
};

describe('CustomCheckBox Component', () => {
  it('renders label and checkboxes', () => {
    render(<WrapperComponent />);

    // Label
    expect(screen.getByText('Select Sports')).toBeInTheDocument();

    // Options
    options.forEach((option) => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  it('renders asterisk if required is true', () => {
    render(<WrapperComponent required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('checks and unchecks an option on click', () => {
    render(<WrapperComponent />);
    
    const footballCheckbox = screen.getByLabelText('Football') as HTMLInputElement;
    fireEvent.click(footballCheckbox);
    expect(footballCheckbox.checked).toBe(true);
  });

    it('calls onChange with correct values', () => {
        const { result } = renderHook(() => useForm<FormValues>());
    
        const { control, getValues } = result.current;
    
        render(
        <FormProvider {...result.current}>
            <CustomCheckBox
            name="sports"
            control={control}
            label="Select Sports"
            options={options}
            />
        </FormProvider>
        );
    
        const footballCheckbox = screen.getByLabelText('Football') as HTMLInputElement;
        fireEvent.click(footballCheckbox);
        
        expect(getValues('sports')).toContain('Football');
    });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import ReactSelect from '@/components/Fields/CustomReactSelect';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

// Fix: Add proper typing for props
const renderWithForm = (props: Partial<React.ComponentProps<typeof ReactSelect>> = {}) => {
  const Wrapper = () => {
    const methods = useForm({ defaultValues: { testSelect: null } });
    return (
      <FormProvider {...methods}>
        <ReactSelect
          name="testSelect"
          control={methods.control}
          options={options}
          handleChangeReactSelect={props.handleChangeReactSelect}
          value={methods.getValues('testSelect')}
          placeholder={props.placeholder || 'Select...'}
          isMulti={props.isMulti}
          isDisabled={props.isDisabled}
          isClearable={props.isClearable}
          defaultValue={props.defaultValue}
          className={props.className}
        />
      </FormProvider>
    );
  };
  return render(<Wrapper />);
};

describe('ReactSelect', () => {
  it('renders with options and placeholder', () => {
    renderWithForm();
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('calls handleChangeReactSelect and onChange when option is selected', () => {
    const handleChangeReactSelect = jest.fn();
    renderWithForm({ handleChangeReactSelect });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChangeReactSelect).toHaveBeenCalled();
  });

  it('supports isMulti prop', () => {
    renderWithForm({ isMulti: true });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it.skip('supports isDisabled prop', () => {
    const { container } = renderWithForm({ isDisabled: true });
    // react-select disables the control div, not a native input
    const control = container.querySelector('.react-select__control') || container.querySelector('.Text-field-customise');
    expect(control).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports isClearable prop', () => {
    renderWithForm({ isClearable: true });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it.skip('renders with default value', () => {
    const { container } = renderWithForm({ defaultValue: options[0] });
    // react-select renders the selected value in a div, not as input value
    expect(container.textContent).toMatch(/Option 1/);
  });
});

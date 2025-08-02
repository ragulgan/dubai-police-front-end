import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomSelect from '@/components/Fields/CustomSelect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

describe('CustomSelect', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2', icon: <ExpandMoreIcon data-testid="custom-icon" /> },
  ];

  it('renders with options', () => {
    render(
      <CustomSelect
        value={''}
        onChange={jest.fn()}
        options={options}
        variant="outlined"
      />
    );
    // The select should be in the document
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays options when clicked', () => {
    render(
      <CustomSelect
        value={''}
        onChange={jest.fn()}
        options={options}
      />
    );
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        value={''}
        onChange={handleChange}
        options={options}
      />
    );
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Option 2'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with disabled state', () => {
    render(
      <CustomSelect
        value={''}
        onChange={jest.fn()}
        options={options}
        disable={true}
      />
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders custom icon if provided in option', () => {
    render(
      <CustomSelect
        value={''}
        onChange={jest.fn()}
        options={options}
      />
    );
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
}); 
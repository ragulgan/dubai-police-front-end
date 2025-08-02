import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchField from '@/components/Fields/SearchField';

jest.mock('../../../public/svg/searchicon.svg', () => {
  const MockSearchIcon = (props: any) => <svg {...props} />;
  MockSearchIcon.displayName = 'MockSearchIcon';
  return MockSearchIcon;
});

describe('SearchField Component', () => {
  const defaultProps = {
    label: 'Search',
    value: '',
    onChange: jest.fn(),
    placeholder: 'Enter search term',
  };

  it('renders correctly with provided props', () => {
    render(<SearchField {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter search term');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    expect(screen.getByTestId('SearchIcon')).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    function Wrapper() {
      const [value, setValue] = React.useState('');
      return (
        <SearchField
          label="Search"
          value={value}
          onChange={e => {
            setValue(e.target.value);
            handleChange(e);
          }}
          placeholder="Enter search term"
        />
      );
    }
  
    render(<Wrapper />);
    const inputElement = screen.getByPlaceholderText('Enter search term');
    fireEvent.change(inputElement, { target: { value: 'test' } });
  
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'test' }),
      })
    );
  });

  it('applies custom sx styles correctly', () => {
    const customSx = { backgroundColor: 'red' };
    render(<SearchField {...defaultProps} sx={customSx} />);

    const inputElement = screen.getByPlaceholderText('Enter search term');
    expect(inputElement.closest('.MuiOutlinedInput-root')).toBeInTheDocument();
  });

  it('renders SearchIcon', () => {
    render(<SearchField {...defaultProps} />);
    const searchIcon = screen.getByTestId('SearchIcon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('has correct input class and styles', () => {
    render(<SearchField {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Enter search term');
    const textFieldRoot = inputElement.closest('.MuiTextField-root');
    expect(textFieldRoot).toHaveClass('Text-field-customise', 'dubai-med');
  });
});
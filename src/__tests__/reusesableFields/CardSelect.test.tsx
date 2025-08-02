import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CardSelect from '@/components/Fields/CardSelect';
import '@testing-library/jest-dom';

describe('CardSelect Component', () => {
  const mockOptions = [
    {
      sportID: '1',
      sportName: 'Football',
      sportProfile: 'https://example.com/football.png',
    },
    {
      sportID: '2',
      sportName: 'Basketball',
      sportProfile: 'https://example.com/basketball.png',
    },
    {
      sportID: '3',
      sportName: 'All',
      sportProfile: <span data-testid="all-icon">AllIcon</span>,
    },
  ];

  const mockOnChange = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <CardSelect
        value={'1'}
        onChange={mockOnChange}
        options={mockOptions}
        {...props}
      />
    );

  it('renders without crashing', () => {
    renderComponent();
    const selectBox = screen.getByRole('combobox');
    expect(selectBox).toBeInTheDocument();
  });

  it('displays the correct selected value', () => {
    renderComponent();
    const selectedLabel = screen.getByText(/Football/i);
    expect(selectedLabel).toBeInTheDocument();
  });

  it('renders all menu items on click', () => {
    renderComponent();
    const selectBox = screen.getByRole('combobox');
    fireEvent.mouseDown(selectBox); // Open dropdown
    const listbox = screen.getByRole('listbox');

    const football = within(listbox).getByText('Football');
    const basketball = within(listbox).getByText('Basketball');
    const all = within(listbox).getByText('All');
    expect(football).toBeInTheDocument();
    expect(basketball).toBeInTheDocument();
    expect(all).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    renderComponent();
    const selectBox = screen.getByRole('combobox');
    fireEvent.mouseDown(selectBox); // Open dropdown
    const basketballOption = screen.getByText('Basketball');
    fireEvent.click(basketballOption);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('disables the select when disable prop is true', () => {
    renderComponent({ disable: true });
    const selectBox = screen.getByRole('combobox');
    expect(selectBox).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders custom icon for "All"', () => {
    renderComponent();
    const selectBox = screen.getByRole('combobox');
    fireEvent.mouseDown(selectBox);
    const allIcon = screen.getByTestId('all-icon');
    expect(allIcon).toBeInTheDocument();
  });
});

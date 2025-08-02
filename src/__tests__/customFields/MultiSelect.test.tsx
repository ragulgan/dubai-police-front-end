import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MultiSelect from '@/components/Fields/MultiSelect';

const options = [
  { value: 0, sportID: 0, sportName: 'All', sportProfile: <span data-testid="all-icon">ALL</span> },
  { value: 1, sportID: 1, sportName: 'Football', sportProfile: 'football.png' },
  { value: 2, sportID: 2, sportName: 'Basketball', sportProfile: 'basketball.png' },
];

describe('MultiSelect', () => {
  it('renders with options', () => {
    render(
      <MultiSelect
        value={[]}
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays options when clicked', async () => {
    render(
      <MultiSelect
        value={[]}
        onChange={jest.fn()}
        options={options}
      />
    );
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(await screen.findByText('All')).toBeInTheDocument();
    expect(await screen.findByText('Football')).toBeInTheDocument();
    expect(await screen.findByText('Basketball')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', async () => {
    const handleChange = jest.fn();
    render(
      <MultiSelect
        value={[]}
        onChange={handleChange}
        options={options}
      />
    );
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText('Football'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with disabled state', () => {
    render(
      <MultiSelect
        value={[]}
        onChange={jest.fn()}
        options={options}
        disable={true}
      />
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows selected value as chip and allows deletion', () => {
    const handleChange = jest.fn();
    render(
      <MultiSelect
        value={[1]}
        onChange={handleChange}
        options={options}
      />
    );
    // Chip should show truncated or full name
    expect(screen.getByText('Football')).toBeInTheDocument();
    // Simulate delete icon click
    const chip = screen.getByText('Football').closest('.MuiChip-root');
    if (chip) {
      const deleteIcon = chip.querySelector('svg');
      if (deleteIcon) {
        fireEvent.click(deleteIcon);
        expect(handleChange).toHaveBeenCalled();
      }
    }
  });

  it('shows avatar with count when multiple selected', () => {
    render(
      <MultiSelect
        value={[1, 2]}
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.getByText('1 +')).toBeInTheDocument();
  });

  it('shows "No Selection" when nothing is selected', () => {
    render(
      <MultiSelect
        value={[]}
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.getByText(/No Selectio/i)).toBeInTheDocument();
  });
}); 
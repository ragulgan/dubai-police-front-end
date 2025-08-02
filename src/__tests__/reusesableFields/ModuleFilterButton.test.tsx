import { render, screen, fireEvent } from '@testing-library/react';
import ModuleFilterButton from '@/components/buttons/ModuleFilterButton';

jest.mock('../../public/Icons/Filter.svg', () => () => (
  <svg data-testid="filter-icon" />
));

describe('ModuleFilterButton', () => {
  it('renders with correct text and icon', () => {
    render(
      <ModuleFilterButton
        text="Filter Tooltip"
        handleFilterClick={jest.fn()}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
  });

  it('calls handleFilterClick on click', () => {
    const handleClick = jest.fn();

    render(
      <ModuleFilterButton
        text="Filter Tooltip"
        handleFilterClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: /Filter Tooltip/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows tooltip text on hover', async () => {
    render(
      <ModuleFilterButton
        text="Filter Tooltip"
        handleFilterClick={jest.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /Filter Tooltip/i });

    fireEvent.mouseOver(button);
    const tooltip = await screen.findByText('Filter Tooltip');

    expect(tooltip).toBeVisible();
  });
});

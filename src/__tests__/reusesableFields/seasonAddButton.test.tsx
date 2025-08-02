import { render, screen, fireEvent } from '@testing-library/react';
import SeasonCustomIconButton from '@/components/buttons/seasonAddButton';

// Dummy icon component
const DummyIcon = ({ width, height, fill }: any) => (
  <svg data-testid="dummy-icon" width={width} height={height} fill={fill}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

describe('SeasonCustomIconButton', () => {
  it('renders the icon', () => {
    render(
      <SeasonCustomIconButton
        icon={DummyIcon}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <SeasonCustomIconButton
        icon={DummyIcon}
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows tooltip when title is provided', async () => {
    render(
      <SeasonCustomIconButton
        icon={DummyIcon}
        onClick={jest.fn()}
        title="Tooltip title"
      />
    );
    const button = screen.getByRole('button');
    fireEvent.mouseOver(button);
    const tooltip = await screen.findByText('Tooltip title');
    expect(tooltip).toBeVisible();
    fireEvent.mouseOut(button);
  });

  it('applies marginRight by default', () => {
    render(
      <SeasonCustomIconButton
        icon={DummyIcon}
        onClick={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('margin-right: 0px');
  });

  it('applies custom sx styles', () => {
    render(
      <SeasonCustomIconButton
        icon={DummyIcon}
        onClick={jest.fn()}
        sx={{ backgroundColor: '#f1f4f7' }}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: rgba(241, 244, 247, 1)');
    expect(button).toHaveStyle('color: rgba(0, 0, 0, 1)');
    expect(button).toHaveStyle('border: none');
  });
});
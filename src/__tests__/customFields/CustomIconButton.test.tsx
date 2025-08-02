import { render, screen, fireEvent } from '@testing-library/react';
import CustomIconButton from '@/components/buttons/CustomIconButton';

// Dummy icon component
const DummyIcon = ({ width, height, fill }: any) => (
  <svg data-testid="dummy-icon" width={width} height={height} fill={fill}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

describe('CustomIconButton', () => {
  it('renders the icon', () => {
    render(
      <CustomIconButton
        icon={DummyIcon}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <CustomIconButton
        icon={DummyIcon}
        isSelected={false}
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies selected styles when isSelected is true', () => {
    render(
      <CustomIconButton
        icon={DummyIcon}
        isSelected={true}
        onClick={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: rgb(0, 135, 85)');
    expect(button).toHaveStyle('color: rgb(255, 255, 255)');
    expect(button).not.toHaveStyle('border: 1px solid #008755');
  });

  it('applies unselected styles when isSelected is false', () => {
    render(
      <CustomIconButton
        icon={DummyIcon}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: rgb(255, 255, 255)');
    expect(button).toHaveStyle('color: rgb(0, 135, 85)');
    expect(button).toHaveStyle('border: 1px solid #008755');
  });

  it('shows tooltip when title is provided', async () => {
    render(
      <CustomIconButton
        icon={DummyIcon}
        isSelected={false}
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
      <CustomIconButton
        icon={DummyIcon}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('margin-right: 8px');
  });

  it('applies custom sx styles', () => {
    render(
      <CustomIconButton
        icon={DummyIcon}
        isSelected={false}
        onClick={jest.fn()}
        sx={{ backgroundColor: 'red' }}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: rgb(255, 0, 0)');
  });
});

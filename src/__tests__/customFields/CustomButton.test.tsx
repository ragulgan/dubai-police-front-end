import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomButton from '@/components/buttons/CustomButton';

const DummyIcon = ({ style }: { style?: React.CSSProperties }) => (
  <span data-testid="icon" style={style}>
    Icon
  </span>
);

describe('CustomButton', () => {
  it('should render the button with the correct label', () => {
    render(
      <CustomButton
        label="Add"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        onClick={() => {}}
      />
    );
    expect(screen.getByText('Add')).toBeDefined();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <CustomButton
        label="Add"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should render the icon at the start', () => {
    render(
      <CustomButton
        label="Add"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="start"
        onClick={() => {}}
      />
    );
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('should render the icon at the end', () => {
    render(
      <CustomButton
        label="Add"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="end"
        onClick={() => {}}
      />
    );
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('should show tooltip if passed', async () => {
    render(
      <CustomButton
        label="Add"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        tooltip="Test Tooltip"
        onClick={() => {}}
      />
    );
    fireEvent.mouseOver(screen.getByText('Add'));
    expect(await screen.findByRole('tooltip')).toBeDefined();
  });

  it('should render the button as disabled', () => {
    const onClick = jest.fn();
    render(
      <CustomButton
        label="Disabled"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        disabled
        onClick={onClick}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should render the button with fullWidth', () => {
    render(
      <CustomButton
        label="Full Width"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        fullWidth
        onClick={() => {}}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-fullWidth');
  });

  it('applies outlined variant styles', () => {
    render(
      <CustomButton
        label="Outlined"
        variant="outlined"
        ButtonIcon={DummyIcon}
        iconPosition="none"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-outlined');
  });

  it('renders end icon with size 18x18 for "Create Nutrition Plan" label', () => {
    render(
      <CustomButton
        label="Create Nutrition Plan"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="end"
      />
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({ width: '18px', height: '18px' });
  });
  
  it('renders end icon with size 20x20 for news module', () => {
    render(
      <CustomButton
        label="News Button"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="end"
        module="news"
      />
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({ width: '20px', height: '20px' });
  });
  
  it('renders end icon with size 13x13 for default case', () => {
    render(
      <CustomButton
        label="Any Other"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="end"
      />
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({ width: '13px', height: '13px' });
  });
    it("renders ButtonIcon with correct size for large button", () => {
    const {  container } = render(
      <CustomButton
        label="Large"
        iconPosition="start"
        ButtonIcon={({ style }) => <span data-testid="icon" style={style}>Icon</span>}
        variant="contained"
        size="large"
      />
    );
    const icon = container.querySelector('[data-testid="icon"]');
    expect(icon).toHaveStyle("width: 22px");
    expect(icon).toHaveStyle("height: 22px");
  });
  it("renders ButtonIcon with correct size for medium button", () => {
    const {  container } = render(
      <CustomButton
        label="Medium"
        iconPosition="start"
        ButtonIcon={({ style }) => <span data-testid="icon" style={style}>Icon</span>}
        variant="contained"
        size="medium"
      />
    );
    const icon = container.querySelector('[data-testid="icon"]');
    expect(icon).toHaveStyle("width: 16px");
    expect(icon).toHaveStyle("height: 16px");
  });
});

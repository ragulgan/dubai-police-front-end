import { render, screen, fireEvent } from '@testing-library/react';
import CustomEditButton from '@/components/buttons/CustomEditButton';

const DummyIcon = ({ style }: { style?: React.CSSProperties }) => (
  <span data-testid="icon" style={style}>
    Icon
  </span>
);

jest.mock('../../public/personEdit.svg', () => () => (
  <svg data-testid="person-edit-icon" />
));

describe.only('CustomEditButton', () => {
  it('renders with correct label', () => {
    render(
      <CustomEditButton
        label="Edit"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
      />
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <CustomEditButton
        label="Edit"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText('Edit'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders the icon at the start using PersonEdit', () => {
    render(
      <CustomEditButton
        label="Edit"
        variant="contained"
        ButtonIcon={require('../../public/personEdit.svg').default}
        iconPosition="start"
      />
    );
    const iconWrapper = document.querySelector('.MuiButton-startIcon');
    expect(iconWrapper).toBeInTheDocument();
    expect(screen.getByTestId('person-edit-icon')).toBeInTheDocument();
  });

  it('renders the icon at the end using ButtonIcon', () => {
    render(
      <CustomEditButton
        label="Edit"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="end"
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('disables the button when disabled is true', () => {
    const onClick = jest.fn();
    render(
      <CustomEditButton
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

  it('applies fullWidth class when fullWidth is true', () => {
    render(
      <CustomEditButton
        label="Full Width"
        variant="contained"
        ButtonIcon={DummyIcon}
        iconPosition="none"
        fullWidth
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-fullWidth');
  });

  it('applies outlined variant styles', () => {
    render(
      <CustomEditButton
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
    <CustomEditButton
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
    <CustomEditButton
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
    <CustomEditButton
      label="Any Other"
      variant="contained"
      ButtonIcon={DummyIcon}
      iconPosition="end"
    />
  );
  const icon = screen.getByTestId('icon');
  expect(icon).toHaveStyle({ width: '13px', height: '13px' });
});


});

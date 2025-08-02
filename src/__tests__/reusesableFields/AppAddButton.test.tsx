import { render, screen, fireEvent } from '@testing-library/react';
import AppAddButton from '@/components/buttons/AppAddButton';

describe('AppAddButton', () => {
  it('should render the button with the correct label', () => {
    render(<AppAddButton label="Add" onClick={() => {}} />);
    expect(screen.getByText('Add')).toBeDefined();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<AppAddButton label="Add" onClick={onClick} />);
    fireEvent.click(screen.getByText('Add'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should render the Add icon', () => {
    render(<AppAddButton label="Add" onClick={() => {}} />);
    const svgIcon = screen.getByTestId('AddIcon');
    expect(svgIcon).toBeDefined();
  });
});
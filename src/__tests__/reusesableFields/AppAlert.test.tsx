import { render, screen } from '@testing-library/react';
import AppAlert from '@/components/alert/AppAlert';

describe('AppAlert', () => {
  it('should render the alert with the correct message', () => {
    render(<AppAlert message="This is an alert" type="info" />);
    expect(screen.getByText('This is an alert')).toBeDefined();
  });

  it('should apply the correct severity type (info)', () => {
    const { container } = render(<AppAlert message="Info message" type="info" />);
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert?.classList.contains('MuiAlert-standardInfo')).toBe(true);
  });

  it('should apply the correct severity type (error)', () => {
    const { container } = render(<AppAlert message="Error message" type="error" />);
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert?.classList.contains('MuiAlert-standardError')).toBe(true);
  });
});

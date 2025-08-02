import React from 'react';
import { render, screen } from '@testing-library/react';
import CircularProgressAvatar from '@/components/view/CircularProgressAvatar';



// Mock the CameraSVG if it's an SVG React component
jest.mock('../../../public/CameraSVG.svg', () => () => <svg data-testid="camera-icon" />);

describe('CircularProgressAvatar', () => {
  const avatarSrc = 'https://example.com/avatar.jpg';
  const progress = 75;

  it('renders two CircularProgress components with correct values', () => {
    const { container } = render(
      <CircularProgressAvatar progress={progress} avatarSrc={avatarSrc} />
    );

    const circularProgressElements = container.querySelectorAll('.MuiCircularProgress-root');
    expect(circularProgressElements.length).toBe(2);

    const [backgroundCircle, progressCircle] = circularProgressElements;

    expect(backgroundCircle).toHaveAttribute('aria-valuenow', '100');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '75');
  });

  it('renders Avatar with correct src', () => {
    render(<CircularProgressAvatar progress={progress} avatarSrc={avatarSrc} />);
    const avatar = screen.getByAltText('Avatar') as HTMLImageElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toBe(avatarSrc);
  });

  it('renders the camera icon overlay', () => {
    render(<CircularProgressAvatar progress={progress} avatarSrc={avatarSrc} />);
    const cameraIcon = screen.getByTestId('camera-icon');
    expect(cameraIcon).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import RegistrationHeader from '@/components/RegistrationHeader';

// Mock next/image for test environment
jest.mock('next/image', () => (props: any) => <img {...props} alt={props.alt || 'mocked-image'} />);
// Mock Logo import
jest.mock('../../public/LogoPng.png', () => '/LogoPng.png');

describe('RegistrationHeader', () => {
  it('renders Dubai Police text', () => {
    render(<RegistrationHeader />);
    expect(screen.getByText('Dubai Police')).toBeInTheDocument();
  });

  it('renders the AccountCircle icon', () => {
    render(<RegistrationHeader />);
    // The icon is rendered as an SVG with role 'presentation'
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
  });

  it('renders the Logo image', () => {
    render(<RegistrationHeader />);
    const logoImg = screen.getByAltText('Logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', expect.stringContaining('LogoPng'));
  });
}); 
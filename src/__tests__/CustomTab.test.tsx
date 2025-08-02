import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomTab from '@/components/CustomTab';

describe('CustomTab', () => {
  let setTabValue: jest.Mock;

  beforeEach(() => {
    setTabValue = jest.fn();
  });

  it('renders all main tabs', () => {
    render(<CustomTab tabValue={0} setTabValue={setTabValue} />);
    expect(screen.getByText('Race Reports')).toBeInTheDocument();
    expect(screen.getByText('Training Camp Reports')).toBeInTheDocument();
    expect(screen.getByText('Athlete Reports')).toBeInTheDocument();
    expect(screen.getByText('Staff Reports')).toBeInTheDocument();
    expect(screen.getByText('Other Reports')).toBeInTheDocument();
  });

  it('calls setTabValue when a main tab is clicked', () => {
    render(<CustomTab tabValue={0} setTabValue={setTabValue} />);
    fireEvent.click(screen.getByText('Training Camp Reports'));
    expect(setTabValue).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByText('Athlete Reports'));
    expect(setTabValue).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByText('Staff Reports'));
    expect(setTabValue).toHaveBeenCalledWith(3);
  });

  it('opens the menu when "Other Reports" is clicked', () => {
    render(<CustomTab tabValue={0} setTabValue={setTabValue} />);
    fireEvent.click(screen.getByText('Other Reports'));
    expect(setTabValue).toHaveBeenCalledWith(4); // Menu open sets tabValue to 4
    // Menu should be open with its items visible
    expect(screen.getByText('Training Plans')).toBeInTheDocument();
    expect(screen.getByText('Test Reports')).toBeInTheDocument();
  });

  it('selects "Training Plans" from the menu', () => {
    render(<CustomTab tabValue={4} setTabValue={setTabValue} />);
    // Open the menu
    fireEvent.click(screen.getByText('Other Reports'));
    // Click menu item
    fireEvent.click(screen.getByText('Training Plans'));
    expect(setTabValue).toHaveBeenCalledWith(4);
  });

  it('selects "Test Reports" from the menu', () => {
    render(<CustomTab tabValue={4} setTabValue={setTabValue} />);
    // Open the menu
    fireEvent.click(screen.getByText('Other Reports'));
    // Click menu item
    fireEvent.click(screen.getByText('Test Reports'));
    expect(setTabValue).toHaveBeenCalledWith(5);
  });
});
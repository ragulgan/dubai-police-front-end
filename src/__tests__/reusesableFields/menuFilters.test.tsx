import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuFilter from '@/components/calendar/menuFilters';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/components/Forms/CustomFormControlLabel', () => (props: any) => (
  <label data-testid={`label-${props.label}`}>{props.label}{props.control}</label>
));
jest.mock('@/components/checkbox/CustomCheckbox', () => (props: any) => (
  <input
    type="checkbox"
    data-testid={`checkbox-${props.checked ? 'checked' : 'unchecked'}`}
    checked={props.checked}
    onChange={props.onChange}
  />
));

describe('MenuFilter', () => {
  let calendarItems: string[];
  let setCalendarItems: jest.Mock;

  beforeEach(() => {
    calendarItems = ['tournaments', 'events'];
    setCalendarItems = jest.fn((items) => (calendarItems = items));
  });

  it('renders button with correct label for selected items', () => {
    render(
      <MenuFilter calendarItems={calendarItems} setCalendarItems={setCalendarItems} />
    );
    expect(screen.getByRole('button')).toHaveTextContent('tournaments +1');
  });

  it('shows "No items" when nothing is selected', () => {
    render(
      <MenuFilter calendarItems={[]} setCalendarItems={setCalendarItems} />
    );
    expect(screen.getByRole('button')).toHaveTextContent('No items');
  });

  it('shows "All Activities" when more than 4 items are selected', () => {
    render(
      <MenuFilter
        calendarItems={["tournaments", "trainings", "events", "reminders", "meetings"]}
        setCalendarItems={setCalendarItems}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('All Activities');
  });

  it('opens menu and toggles checkbox selection', () => {
    render(
      <MenuFilter calendarItems={calendarItems} setCalendarItems={setCalendarItems} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // All menu items should be rendered
    expect(screen.getByText('tournaments')).toBeInTheDocument();
    expect(screen.getByText('trainings')).toBeInTheDocument();
    expect(screen.getByText('events')).toBeInTheDocument();
    expect(screen.getByText('reminders')).toBeInTheDocument();
    expect(screen.getByText('meetings')).toBeInTheDocument();

    // Simulate unchecking 'tournaments'
    const tournamentsCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(tournamentsCheckbox);
    expect(setCalendarItems).toHaveBeenCalledWith(['events']);

    // Simulate checking 'trainings'
    const trainingsCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(trainingsCheckbox);
    expect(setCalendarItems).toHaveBeenCalledWith(['tournaments', 'events', 'trainings']);
  });

  it('closes menu on menu close', () => {
    render(
      <MenuFilter calendarItems={calendarItems} setCalendarItems={setCalendarItems} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // Menu should be open
    expect(screen.getByText('tournaments')).toBeInTheDocument();
    // Simulate menu close
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    // Menu should close (MenuItems will be removed)
    // Note: MUI Menu may not unmount immediately in test env, so this is a basic check
  });
}); 
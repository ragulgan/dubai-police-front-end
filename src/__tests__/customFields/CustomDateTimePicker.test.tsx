import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import moment from 'moment';
import CustomDateTimePicker from '@/components/Fields/CustomDateTimePicker';

jest.mock('../../public/svg/calendar.svg', () => () => (
    <svg data-testid="calendar-icon" />
));

type CustomProps = {
    required?: boolean;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
    defaultValue?: any;
    setErrors?: jest.Mock;
    onChange?: jest.Mock;
};

const renderWithForm = (customProps?: CustomProps) => {
    const Wrapper: React.FC = () => {
        const methods = useForm();
        const props = {
            name: 'dateTime',
            label: 'Select DateTime',
            required: true,
            minDate: moment().subtract(1, 'days'),
            maxDate: moment().add(1, 'days'),
            defaultValue: moment(),
            setErrors: jest.fn(),
            onChange: jest.fn(),
            ...customProps,
            control: methods.control,
        };

        return (
            <FormProvider {...methods}>
                <CustomDateTimePicker {...props} />
            </FormProvider>
        );
    };

    return render(<Wrapper />);
};

describe('CustomDateTimePicker', () => {
    it('renders label and input', () => {
        renderWithForm();
        expect(screen.getByText('Select DateTime')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('opens calendar when icon is clicked', async () => {
        renderWithForm();
        const svgIcon = screen.getByTestId('calendar-icon');
        fireEvent.click(svgIcon);
        expect(screen.getByPlaceholderText('DD/MM/YYYY hh:mm:ss aa')).toBeInTheDocument();
    });

    it('handles defaultValue as null', async () => {
        renderWithForm({ defaultValue: null });
        const textbox1 = screen.getByRole('textbox');
        expect(textbox1).toBeInTheDocument();
        expect(textbox1).toHaveValue('');
    });

    it('shows asterisk for required fields', () => {
        renderWithForm({ required: true, defaultValue: null });
        const label = screen.getByText(/Select DateTime/);
        expect(label).toHaveTextContent('*');
      });

    it('calls onChange prop when value changes', () => {
        const onChange = jest.fn();
        renderWithForm({ onChange });
        // Simulate changing the value
        fireEvent.change(screen.getByRole('textbox'), { target: { value: moment().add(1, 'hour').format('DD/MM/YYYY hh:mm:ss A') } });
        // onChange should be called
        expect(onChange).toHaveBeenCalled();
    });
});

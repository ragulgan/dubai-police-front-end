import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import React from 'react';
import dayjs from 'dayjs';
interface CustomFullCalendarProps {
  setMonthChange?: any;
  monthChange?: any;
  setValue?: any;
  value?: any
}
const CustomCalendar: React.FC<CustomFullCalendarProps> = ({ setMonthChange, monthChange, setValue, value }) => {
  const handleDate = (newValue: any) => {
    setValue(newValue)
    setMonthChange(dayjs(newValue).format("MMM DD, YYYY"))
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        className='race-calendar-datepicker'
        value={value}
        onChange={(newValue) => handleDate(newValue)}
        minDate={dayjs().subtract(2, 'year').startOf('year')}
        maxDate={dayjs().add(10, 'year').endOf('month')}
      />
    </LocalizationProvider>
  )
}

export default CustomCalendar;
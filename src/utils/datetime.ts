import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export const getCurrentDateObject = () => {
  return dayjs();
}

export const getDateObject = (date: string, format: string) => {
  return dayjs(date, format);
}

export const getCurrentDateString = (format: string) => {
  return dayjs().format(format);
}

export const checkIsSameMonth = (itemDate: string, monthChange: string) => {
  return dayjs(itemDate, "YYYY/MM/DD").isSame(dayjs(monthChange, "MMM DD, YYYY"), 'month');
}

export const convertDateString = (date: string, fromFormat: string, toFormat: string) => {
  return dayjs(date, fromFormat).format(toFormat);
}

export const convertDateStringStrict = (date: string, fromFormat: string, toFormat: string) => {
  return dayjs(date, fromFormat, true).format(toFormat);
}

export const checkIsAfter = (date1: string, date2: string, format: string) => {
  const d1 = dayjs(date1, format);
  const d2 = dayjs(date2, format);
  return d2.isAfter(d1);
}

export const checkIsBefore = (date1: dayjs.Dayjs, date2: dayjs.Dayjs) => {
  return date1.isBefore(date2);
}

export const dateAddDays = (date: dayjs.Dayjs, dayCount: number) => {
  return date.add(dayCount, 'day');
}

export const checkIsBeforeOrEqual = (date1: dayjs.Dayjs, date2: dayjs.Dayjs) => {
  return date1.isSameOrBefore(date2);
}

export const formatObjectToString = (date: dayjs.Dayjs, format: string) => {
  return dayjs(date).format(format);
}

export const getAge = (dob: string, format: string) => {
  return dayjs().diff(dayjs(dob, format), 'years').toString();
}

export const getYearOfDate = (date: string, format: string) => {
  return dayjs(date, format).year();
}
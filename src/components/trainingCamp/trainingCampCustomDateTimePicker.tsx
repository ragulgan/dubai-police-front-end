import * as React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import DateSvg from "../../../public/svg/calendar.svg"; // Ensure your SVG is imported correctly
import { Controller } from "react-hook-form";
import moment from "moment"; // Import moment for type usage

interface CustomDateTimePickerProps {
  control?: any;
  name: string;
  label?: string;
  required?: boolean;
  minDate: any;
  maxDate: any;
  setErrors?: any;
  rules?: any;
  id?: any;
  icon?: any;
  placeholder?: any;
  module?: any;
  disabled?: any;
}

const TrainingCampCustomDateTimePicker = (props: any) => {
  const {
    control,
    name,
    label,
    required,
    minDate,
    maxDate,
    onChange,
    boxmb,
    hidden,
    defaultValue,
    setErrors,
    rules,
    id,
    icon,
    placeholder,
    errors,
    module,
    disabled,
  } = props;

  const [open, setOpen] = React.useState(false);
  const handleIconClick = () => setOpen(true);

  const parsedDefaultValue =
    defaultValue && defaultValue !== "-" && defaultValue !== ""
      ? moment(defaultValue, "DD/MM/YYYY HH:mm")
      : null;

  return (
    <>
      <Box mb={boxmb} hidden={hidden}>
        <Typography className="typography textfield-label bukra">
          {label}
          {required && (
            <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
          )}
        </Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name={name}
          control={control}
          defaultValue={parsedDefaultValue}
          rules={{
            ...rules,
            validate: (value) => {
              const selectedDate = moment(value, "DD/MM/YYYY HH:mm");
              if (minDate && selectedDate.isBefore(minDate)) {
                return `Date cannot be earlier than ${moment(minDate).format(
                  "DD/MM/YYYY HH:mm"
                )}`;
              }
              if (maxDate && selectedDate.isAfter(maxDate)) {
                return `Date cannot be later than ${moment(maxDate).format(
                  "DD/MM/YYYY HH:mm"
                )}`;
              }
              return true;
            },
          }}
          render={({
            field: { onChange: fieldOnChange, value, ref, ...newField },
            fieldState: { error },
          }) => (
            <DateTimePicker
              format="DD/MM/YYYY hh:mm A"
              className="dubai-med Text-field-customise"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "8px",
                  fontSize: "14px",
                  px: "10px",
                  py: "6px",
                  marginTop: "12px",
                  background: "rgba(177, 228, 227, 0.2)",
                  border: "0.5px solid rgba(88, 88, 91, 0.2)",
                },
              }}
              inputRef={ref}
              minDateTime={minDate}
              maxDateTime={maxDate ? moment(maxDate).endOf("day") : null}
              value={parsedDefaultValue ? parsedDefaultValue : value}
              onChange={(newValue) => {
                fieldOnChange(newValue);
                if (module === "nutrition") {
                  setErrors({ ...errors, [name]: "" });
                }
                if (onChange) {
                  onChange({ name, value: newValue });
                }
              }}
              slots={{
                textField: TextField,
              }}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              disabled={disabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  id: id,
                  sx: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    "& .MuiInputBase-input::placeholder": {
                      color: "#58585B",
                      opacity: 1,
                    },
                  },
                  InputProps: {
                    startAdornment: icon ? null : (
                      <InputAdornment position="start">
                        <DateSvg
                          style={{ width: 20, height: 20, cursor: "pointer" }}
                          onClick={handleIconClick}
                        />
                      </InputAdornment>
                    ),
                  },
                  helperText: error?.message,
                  error: !!error,
                  className: disabled
                    ? "custom-datepicker-disabled"
                    : "custom-datepicker custom-datetimepicker",
                  placeholder: placeholder,
                  onClick: icon ? handleIconClick : undefined,
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </>
  );
};

export default TrainingCampCustomDateTimePicker;

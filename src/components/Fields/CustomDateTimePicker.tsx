import * as React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import DateSvg from "../../../public/svg/calendar.svg";
import { Controller } from "react-hook-form";
import moment from "moment";

const CustomDateTimePicker = (props: any) => {
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
  } = props;
  const [open, setOpen] = React.useState(false);
  const handleIconClick = () => {
    setOpen(true);
  };
  const parsedDefaultValue =
    defaultValue && defaultValue !== "-" && defaultValue !== ""
      ? moment(defaultValue)
      : defaultValue;
  //  const parsedDefaultValue = defaultValue && defaultValue !== '-' && defaultValue !== '' ? moment(defaultValue, 'DD/MM/YYYY hh:mm:ss A') : null;

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
              if (required && (!value || value === "-")) {
                const errorMessage = `${label} is required.`;
                if (setErrors) {
                  setErrors({ [name]: errorMessage });
                }
                return errorMessage;
              }
              const selectedDate = moment(value, "DD/MM/YYYY");
              if (
                setErrors &&
                minDate &&
                selectedDate.isBefore(minDate, "day")
              ) {
                console.error(
                  `Selected date (${selectedDate.format(
                    "DD/MM/YYYY"
                  )}) is earlier than the minimum date (${moment(
                    minDate
                  ).format("DD/MM/YYYY")})`
                );
                setErrors({ [name]: `Invalid Date` });
                return `Date cannot be earlier than ${moment(minDate).format(
                  "DD/MM/YYYY"
                )}`;
              }
              if (
                setErrors &&
                maxDate &&
                selectedDate.isAfter(maxDate, "day")
              ) {
                console.error(
                  `Selected date (${selectedDate.format(
                    "DD/MM/YYYY"
                  )}) is later than the maximum date (${moment(maxDate).format(
                    "DD/MM/YYYY"
                  )})`
                );
                setErrors({ [name]: `Invalid Date` });
                return `Date cannot be great than ${moment(maxDate).format(
                  "DD/MM/YYYY"
                )}`;
              }
              return true;
            },
          }}
          render={({
            field: { onChange: fieldOnChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <DateTimePicker
              format="DD/MM/YYYY hh:mm:ss A"
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
              minDate={minDate}
              maxDate={maxDate}
              value={parsedDefaultValue}
              onChange={(newValue) => {
                fieldOnChange(newValue);
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
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    width: "100%",
                    // height: '100%',
                    display: "flex",
                    alignItems: "center",
                    "& .MuiInputBase-input::placeholder": {
                      color: "#58585B",
                      opacity: 1,
                    },
                  },
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateSvg
                          style={{ width: 20, height: 20, cursor: "pointer" }}
                          onClick={handleIconClick}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: null,
                  },
                  helperText: error?.message,
                  error: !!error,
                  className: "custom-datepicker",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </>
  );
};

export default CustomDateTimePicker;

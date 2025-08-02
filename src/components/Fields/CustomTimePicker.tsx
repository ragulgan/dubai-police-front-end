import * as React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import moment from "moment";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

interface CustomTimePickerProps {
  control: any;
  name: string;
  label?: string;
  required?: boolean;
  minTime?: moment.MomentInput;
  maxTime?: moment.MomentInput;
  onChange?: (data: { name: string; value: moment.Moment | null }) => void;
  boxmb?: number;
  hidden?: boolean;
  defaultValue?: string | moment.Moment;
  setErrors?: (errors: Record<string, string>) => void;
  rules?: any;
  maxwidth?: any;
  id?: any;
  icon?: any;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  control,
  name,
  label,
  required,
  minTime,
  maxTime,
  onChange,
  boxmb,
  hidden,
  defaultValue,
  setErrors,
  rules,
  maxwidth,
  id,
  icon,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleIconClick = () => {
    setOpen(true);
  };
  const parsedDefaultValue =
    defaultValue && defaultValue !== "-" && defaultValue !== ""
      ? moment(defaultValue, "HH:mm")
      : null;
  return (
    <Box hidden={hidden} width={maxwidth}>
      {label ? (
        <Typography mb={boxmb} className="typography textfield-label bukra">
          {label}
          {required && (
            <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
          )}
        </Typography>
      ) : null}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name={name}
          control={control}
          defaultValue={parsedDefaultValue}
          rules={{
            ...rules,
            required: required ? "Time is required" : false,
            validate: (value) => {
              if (!value && required) {
                if (setErrors) setErrors({ [name]: "Time is required" });
                return "Time is required";
              }
              const selectedTime = moment(value, "HH:mm");
              if (minTime && selectedTime.isBefore(moment(minTime, "HH:mm"))) {
                if (setErrors) setErrors({ [name]: "Invalid Time" });
                return `Time cannot be earlier than ${moment(minTime).format(
                  "HH:mm"
                )}`;
              }
              if (maxTime && selectedTime.isAfter(moment(maxTime, "HH:mm"))) {
                if (setErrors) setErrors({ [name]: "Invalid Time" });
                return `Time cannot be later than ${moment(maxTime).format(
                  "HH:mm"
                )}`;
              }
              return true;
            },
          }}
          render={({
            field: { onChange: fieldOnChange, value, onBlur },
            fieldState: { error },
          }) => (
            <TimePicker
              ampm={true}
              format="hh:mm A"
              className="dubai-med Text-field-customise"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "43px",
                  width: maxwidth ? maxwidth : "100%",
                  fontSize: "14px",
                  px: "10px",
                  py: "6px",
                  background: "rgba(177, 228, 227, 0.2)",
                },
              }}
              minTime={minTime ? moment(minTime, "HH:mm") : undefined}
              maxTime={maxTime ? moment(maxTime, "HH:mm") : undefined}
              value={value || parsedDefaultValue}
              onChange={(newValue) => {
                fieldOnChange(newValue);
                onChange?.({ name, value: newValue });
              }}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              slots={{
                textField: TextField,
              }}
              slotProps={{
                textField: {
                  helperText: error?.message,
                  error: !!error,
                  id: id,
                  className: "custom-datepicker dubai-med",
                  sx: {
                    "& .MuiInputBase-input::placeholder": {
                      color: "#58585B",
                      opacity: 1,
                    },
                  },
                  InputProps: {
                    startAdornment: icon ? null : (
                      <InputAdornment position="start">
                        <ScheduleOutlinedIcon
                          data-testid="schedule-icon"
                          style={{ width: 20, height: 20, cursor: "pointer" }}
                          onClick={handleIconClick}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: null,
                  },
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default CustomTimePicker;

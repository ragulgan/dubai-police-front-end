import React from "react";
import {
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface CustomSwitchProps<T extends FieldValues> {
  name: Path<T>; // Accept keys of T for name
  control: Control<T>; // Use Control of type T
  label: string; // Label for the switch
  required?: boolean; // Indicates if the field is required
  disabled?: boolean; // Option to disable the switch
}

const CustomSwitch = <T extends FieldValues>({
  name,
  control,
  label,
  required,
  disabled = false,
}: CustomSwitchProps<T>) => {
  return (
    <FormControl>
      <Typography
        variant="titleStyle"
        sx={{ fontSize: "14px" }}
        className="typography textfield-label bukra"
        mt={1.5}
      >
        {label}
        {required && (
          <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
        )}
      </Typography>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : undefined,
        }}
        render={({ field, fieldState }) => (
          <>
            <FormControlLabel
              className="dubai-med textfield-label"
              control={
                <Switch
                  {...field}
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={disabled}
                  sx={{
                    "& .Mui-checked": {
                      color: fieldState.error ? "#d32f2f" : undefined,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: fieldState.error ? "#d32f2f" : undefined,
                  }}
                  className="dubai-med"
                >
                  {field.value ? "ON" : "OFF"}
                </Typography>
              }
            />
            {fieldState.error && (
              <Typography variant="caption" color="error" className="dubai-med">
                {fieldState.error.message}
              </Typography>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

export default CustomSwitch;

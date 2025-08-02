// components/CustomRadioGroup.tsx
import React from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface CustomRadioGroupProps<T extends FieldValues> {
  name: Path<T>; // Accept keys of T for name
  control: Control<T>; // Use Control of type T
  label: string; // Label for the radio group
  options: { value: string; label: string; disabled?: boolean }[]; // Options array for radio items
  required?: boolean; // Indicates if the field is required
}

const CustomRadioGroup = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
}: CustomRadioGroupProps<T>) => {
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
        render={({ field: { ref, ...newField }, fieldState }) => (
          <>
            <RadioGroup row {...newField}>
              {options.map((option) => (
                <FormControlLabel
                  className="dubai-med textfield-label"
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: fieldState.error ? "#d32f2f" : undefined,
                        "&.Mui-checked": {
                          color: fieldState.error ? "#d32f2f" : undefined,
                        },
                      }}
                    />
                  }
                  // label={option.label}
                  label={
                    <Typography
                      sx={{
                        color: fieldState.error ? "#d32f2f" : undefined,
                      }}
                      className="dubai-med"
                    >
                      {option.label}
                    </Typography>
                  }
                  disabled={option.disabled || false}
                  inputRef={ref}
                />
              ))}
            </RadioGroup>
            {fieldState.error && (
              <Typography
                variant="caption"
                sx={{ color: "#d32f2f" }}
                className="dubai-med"
              >
                {fieldState.error.message}
              </Typography>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

export default CustomRadioGroup;

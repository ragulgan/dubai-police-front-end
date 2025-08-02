// components/CustomRadioGroup.tsx
import React from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface CustomRadioGroupProps<T extends FieldValues> {
  name: Path<T>; // Accept keys of T for name
  control: Control<T>; // Use Control of type T
  label: string; // Label for the radio group
  options: { value: string; label: string; disabled?: boolean }[]; // Options array for radio items
  required?: boolean; // Indicates if the field is required
}

const CustomRadioButtonTeam = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
}: CustomRadioGroupProps<T>) => {
  return (
    <FormControl>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : undefined,
        }}
        render={({ field: { ref, ...newField }, fieldState }) => (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Inline label "as" */}
              {label && (
                <Typography
                  sx={{ fontSize: "14px", mr: 2 }}
                  className="typography textfield-label bukra"
                >
                  {label}
                  {required && (
                    <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
                  )}
                </Typography>
              )}

              {/* Radio buttons */}
              <RadioGroup row {...newField}>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        sx={{
                          color: "#00A859",
                          "&.Mui-checked": {
                            color: "#00A859",
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
                        {option.label}
                      </Typography>
                    }
                    disabled={option.disabled || false}
                    inputRef={ref}
                  />
                ))}
              </RadioGroup>
            </Box>

            {/* Error message */}
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

export default CustomRadioButtonTeam;

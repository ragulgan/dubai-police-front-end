// components/CustomCheckBox.tsx
import React from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface CustomCheckBoxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: string[]; // Assuming an array of strings for simplicity
  required?: boolean;
}

const CustomCheckBox = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
}: CustomCheckBoxProps<T>) => {
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
        render={({ field: { onChange, value, ...newField }, fieldState }) => (
          <>
            <FormGroup sx={{ flexDirection: "row" }}>
              {options.map((option: any) => (
                <FormControlLabel
                  key={option}
                  className="dubai-regular"
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(event) => {
                        const newValue = event.target.checked
                          ? [...(value || []), option]
                          : (value || []).filter(
                              (item: string) => item !== option
                            );
                        onChange(newValue);
                      }}
                      sx={{ borderRadius: "4px" }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
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

export default CustomCheckBox;

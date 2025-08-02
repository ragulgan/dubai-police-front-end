// components/CustomTextField.tsx
import React from "react";
import { TextField, TextFieldProps, Typography } from "@mui/material";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  Path,
} from "react-hook-form";

interface CustomTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name"> {
  name: Path<T>; // Updated to accept keys of T as name
  control: Control<T>; // Use the generic type T
  label: string;
  rules?: RegisterOptions<T, Path<T>>; 
}

const CustomAgeField = <T extends FieldValues>({
  name,
  control,
  label,
   rules,
  ...props
}: CustomTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
       rules={rules}
      render={({ field, fieldState: { error } }) => (
        <>
          <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
          >
            {label}
          </Typography>
          <TextField
            {...field}
            {...props}
            error={!!error}
            helperText={error ? error.message : ""}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                background: "#00875508",
                fontSize: "14px",
                maxHeight: "40px", // Adjust the height here
              },
              "& fieldset": {
                borderColor: "#40a377",
              },
              "&:hover fieldset": {
                borderColor: "#40a377",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#40a377",
              },
              "& input": {
                color: "#000000",
              },
              "& input::placeholder": {
                color: "#58585B",
                opacity: 1,
              },
            }}
            disabled={true}
          />
        </>
      )}
    />
  );
};

export default CustomAgeField;

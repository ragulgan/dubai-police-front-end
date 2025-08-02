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
  control?: Control<T>; // Use the generic type T
  label?: string;
  rules?: RegisterOptions<T, Path<T>>; // Updated to register options for T
  textarea?: boolean;
  placeholder?: string;
  disabled?: any;
  errorDisplay?: any;
}

const CustomTextField = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  textarea,
  placeholder,
  disabled,
  errorDisplay,
  ...props
}: CustomTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      // rules={rules}
      rules={{
        ...rules,
        validate:
          name === "othersCount"
            ? {}
            : name === "quantity"
              ? {
                greaterThanZero: (value) =>
                  value === "" ||
                  Number(value) > 0 ||
                  "Value must be greater than 0.",
              }
              : name !== "foodQuantity"
                ? {
                  noLeadingTrailingSpaces: (value) =>
                    String(value)?.trim() === value ||
                    "No leading or trailing spaces allowed.",
                  ...rules?.validate, // Keep existing validations
                }
                : {
                  multipleOf50: (value) =>
                    (Number(value) > 0 && Number(value) % 50 === 0) ||
                    "Value must be a multiple of 50 and greater than 0.",
                },
      }}
      render={({ field: { ref, ...newField }, fieldState: { error } }) => (
        <>
          <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
            mt={1.5}
            mb={0.5}
          >
            {label}
            {rules?.required && errorDisplay !== "no-wrap" && label && (
              <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
            )}
          </Typography>
          <TextField
            {...newField}
            {...props}
            error={!!error}
            inputRef={ref}
            helperText={error ? error.message : ""}
            variant="outlined"
            fullWidth
            placeholder={placeholder}
            disabled={disabled}
            className="Text-field-customise dubai-med"
            multiline={textarea}
            rows={textarea ? 4 : 1}
            sx={{
              "& .MuiInputBase-root": {
                background: disabled ? 'rgba(241, 235, 156, 0.2)' : "#00875508",
                height: !textarea ? "40px" : "120px",
                fontSize: "14px",
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
              "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  name === "longtermGoals" ||
                    (name === "weight" && disabled) ||
                    (name === "height" && disabled) ||
                    (name === "totalCost" && disabled) ||
                    (name === "raceName" && disabled) ||
                    (name === "campName" && disabled) ||
                    (name === "duration" && disabled) ||
                    (name === "benchmarkName" && disabled)
                    ? "#F1EB9C"
                    : "#40a377",
                backgroundColor:
                  name === "longtermGoals" ||
                    (name === "weight" && disabled) ||
                    (name === "height" && disabled) ||
                    (name === "totalCost" && disabled) ||
                    (name === "raceName" && disabled) ||
                    (name === "campName" && disabled) ||
                    (name === "duration" && disabled) ||
                    (name === "benchmarkName" && disabled) ||
                    (name === "benchmarkName" && disabled) ||
                    (name === "teamAssigned" && disabled) ||
                    (name === "createdBy" && disabled)
                    ? "rgba(241, 235, 156, 0.2)"
                    : "",
              },
              "& input": {
                color: "#000000",
                paddingTop: "0px",
                paddingBottom: !textarea ? "0px" : "68px",
              },
              "& input::placeholder": {
                color: "#58585B",
                opacity: 1,
              },
              "& textarea::placeholder": {
                color: "#58585B",
                opacity: 1,
              },
            }}
          />
        </>
      )}
    />
  );
};

export default CustomTextField;

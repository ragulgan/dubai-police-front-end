import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  Path,
} from "react-hook-form";
import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface CustomPhoneInputProps<T extends FieldValues>
  extends Omit<PhoneInputProps, "value" | "onChange"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  disabled?: boolean;
  defaultDialCode?: string; // Default dial code (e.g., "971" for UAE)
  onChangeFormatted?: (dialCode: string, phone: string) => void;
}

const CustomPhoneInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  disabled,
  defaultDialCode = "971", // UAE is the default
  onChangeFormatted,
  ...props
}: CustomPhoneInputProps<T>) => {
  const [dialCode, setDialCode] = useState<string>(defaultDialCode);

  useEffect(() => {
    // Update dial code state when defaultDialCode changes
    setDialCode(defaultDialCode);
  }, [defaultDialCode]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
            mt={1.5}
            mb={0.5}
          >
            {label}
            {rules?.required && (
              <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
            )}
          </Typography>
          <Box className="Text-field-customise">
            <PhoneInput
              {...props}
              country="ae" // Default country set to UAE
              value={value || ""}
              countryCodeEditable
              onChange={(phoneNumber, country: any) => {
                const dialCode = `+${country.dialCode}`;
                const phoneWithoutDialCode = phoneNumber.startsWith(dialCode)
                  ? phoneNumber.slice(dialCode.length)
                  : phoneNumber;
                setDialCode(dialCode); // Update the state with the new dial code
                onChange(phoneNumber); // Update react-hook-form state
                if (onChangeFormatted) {
                  onChangeFormatted(dialCode, phoneWithoutDialCode); // Pass formatted values to parent
                }
              }}
              disabled={disabled}
              inputStyle={{
                width: "100%",
                height: "40px",
                background: "#00875508",
                borderColor: error ? "red" : "#40a377",
                fontSize: "14px",
              }}
              containerStyle={{
                marginBottom: error ? "8px" : "16px",
              }}
              placeholder="Enter phone number"
              autoFormat={false}
            />
          </Box>
          {error && (
            <Typography
              variant="caption"
              className="error-message"
              color="error"
            >
              {error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
};

export default CustomPhoneInput;

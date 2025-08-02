"use client";
import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface CustomCheckboxGroupProps {
  name: string;
  control: any;
  label: string;
  options: Option[];
  required?: boolean;
}

const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  name,
  control,
  label,
  options,
  required = false,
}) => {
  return (
    <Box>
      <Typography
        variant="titleStyle"
        sx={{ fontSize: "14px" }}
        className="typography textfield-label bukra"
        mt={1.5}
        mb={0.5}
      >
        {label}
        {required && (
          <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
        )}
      </Typography>

      <Controller
        name={name}
        control={control}
        defaultValue={options.reduce((acc, option) => {
          acc[option.value] = false;
          return acc;
        }, {} as Record<string, boolean>)}
        rules={{
          validate: (value) =>
            required
              ? Object.values(value).some((v) => v) ||
                "Please select at least one option."
              : true,
        }}
        render={({ field, fieldState }) => (
          <>
            <Box display="flex" flexWrap="wrap">
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={field.value?.[option.value] || false}
                      onChange={() =>
                        field.onChange({
                          ...field.value,
                          [option.value]: !field.value?.[option.value],
                        })
                      }
                      sx={{
                      
                        // color: "#008755",
                        "&.Mui-disabled": {
                          color: "#008755 !important",
                        },
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </Box>
            {fieldState.error && (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </>
        )}
      />
    </Box>
  );
};

export default CustomCheckboxGroup;

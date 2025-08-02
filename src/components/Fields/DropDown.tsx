import React, { useState } from "react";
import { Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography, Chip, Avatar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";

// Define the option type
interface Option {
  value: any;
  label: any;
  icon?: any;
}

// Define the props for CustomSelect
interface DropDownProps {
  name: string; // Required for use with react-hook-form
  label?: string;
  control: any; // react-hook-form control prop
  options?: any;
  variant?: "standard" | "outlined" | "filled";
  minWidth?: number;
  defaultValue?: string | number | string[] | number[];
  icon?: boolean;
  multiple?: boolean; // New prop for enabling multiple selection
  required?: boolean;
  sx?: any;
  placeholder?: any;
  disabled?: boolean;
  rules?: any;
  module?: any;
  readonly?: any;
  maxChips?: number;
}

// interface Option {
//   value: string | number;
//   label: string;
// }
const DropDown: React.FC<DropDownProps> = ({
  name,
  control,
  options,
  variant = "standard",
  minWidth = 120,
  defaultValue = [],
  icon,
  label,
  multiple = false, // Default is single selection
  required,
  sx,
  placeholder,
  disabled = false,
  rules,
  module,
  readonly,
  maxChips = 2,
}) => {
  return (
    <>
      <Typography
        variant="titleStyle"
        sx={{ fontSize: "14px", mb: 0.5, mt: 1.5 }}
        className="typography textfield-label bukra"
      >
        {label}
        {required && label && (
          <span style={{ color: "red", marginLeft: "4px" }}>*</span>
        )}
      </Typography>
      <FormControl className="selectFieldContainer" fullWidth>
        <Controller
          name={name}
          control={control}
          defaultValue={multiple ? [] : defaultValue} // Ensure defaultValue is an array for multiple
          rules={{
            ...rules,
            required:
              required && !disabled
                ? `${label || "This field"} is required`
                : false, // Add validation rule
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                {...field}
                multiple={multiple}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                IconComponent={() => (
                  <ExpandMoreIcon
                    style={{
                      marginRight: "10px",
                      color: readonly ? "rgb(182, 175, 175)" : "black",
                    }}
                  />
                )}
                disabled={disabled}
                style={{
                  background: disabled
                    ? "rgba(241, 235, 156, 0.2)"
                    : "#00875508",
                }}
                sx={{
                  maxHeight: "40px",
                  color: "#000",
                  background: readonly
                    ? "rgba(0, 0, 0, 0.05)"
                    : "rgba(177, 228, 227, 0.2)",
                  pointerEvents: readonly ? "none" : "auto",
                  ...sx,
                }}
                className={
                  error
                    ? "Text-field-customise custom-datepicker custom-dropdown-error"
                    : "Text-field-customise custom-datepicker"
                }
                value={field.value || (multiple ? [] : "")} // Ensure value is an array for multiple
                renderValue={(selected) => {
                  if (
                    !selected ||
                    (Array.isArray(selected) && selected.length === 0)
                  ) {
                    return (
                      <Typography
                        sx={{
                          color: error ? "#d32f2f" : "#58585B",
                          fontWeight: "500",
                          fontSize: "16px",
                        }}
                      >
                        {placeholder ? placeholder : "Select an option"}
                      </Typography>
                    );
                  }
                  return multiple && Array.isArray(selected) ? (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        width: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {module === "rules" || module === "research"
                        ? selected.slice(0, maxChips).map((value) => {
                            const selectedOption: any = options.find(
                              (option: any) => option.value === value
                            );
                            return (
                              <Chip
                                key={value}
                                icon={
                                  icon &&
                                  selectedOption?.icon &&
                                  (typeof selectedOption.icon === "string" ? (
                                    <img
                                      src={selectedOption.icon}
                                      alt="icon"
                                      style={{
                                        width: 16,
                                        height: 16,
                                        filter:
                                          "invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg)",
                                      }}
                                    />
                                  ) : (
                                    React.cloneElement(selectedOption.icon, {
                                      sx: {
                                        color: "#cbcbcb !important",
                                        fontSize: 20,
                                      },
                                    })
                                  ))
                                }
                                label={
                                  options.find(
                                    (option: Option) => option.value === value
                                  )?.label || value
                                }
                                sx={{
                                  padding: "0px",
                                  fontFamily: "Dubai, sans-serif",
                                  fontWeight: 400,
                                  fontSize: "12px",
                                  backgroundColor: "#05868E",
                                  color: "#fff",
                                  lineHeight: "18px",
                                  height: "24px",
                                  ".MuiChip-label": {
                                    py: "7px",
                                    px: "10px",
                                  },
                                }}
                              />
                            );
                          })
                        : selected.slice(0, maxChips).map((value) => (
                            <Chip
                              key={value}
                              // options.find((option: Option) => option.value === value)?.label || value
                              label={
                                // options.find((option) => option.value === value)
                                options.find(
                                  (option: Option) => option.value === value
                                )?.label || value
                              }
                              sx={{
                                padding: "0px",
                                fontFamily: "Dubai, sans-serif",
                                fontWeight: 400,
                                fontSize: "12px",
                                backgroundColor: "#05868E",
                                color: "#fff",
                                lineHeight: "18px",
                                height: "24px",
                                ".MuiChip-label": {
                                  py: "7px",
                                  px: "10px",
                                },
                              }}
                            />
                          ))}

                      {selected.length > maxChips && (
                        <Avatar
                          sx={{
                            bgcolor: "#e0f7ec",
                            color: "#008755",
                            fontSize: "0.875rem",
                            width: 30,
                            height: 25,
                            fontWeight: "bold",
                          }}
                        >
                          +{selected.length - maxChips}
                        </Avatar>
                      )}
                    </Box>
                  ) : (
                    options.find((option: Option) => option.value === selected)
                      ?.label || selected
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflowY: "auto",
                    },
                  },
                }}
              >
                {options && options?.length > 0 ? (
                  options?.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          paddingTop: "2px",
                          paddingBottom: "2px",
                          paddingLeft: "0px",
                          paddingRight: "0px",
                        }}
                      >
                        {icon && option.icon && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: icon ? "3px" : 0,
                            }}
                          >
                            {module === "rules" || module === "research" ? (
                              typeof option.icon === "string" ? (
                                <img
                                  src={option.icon}
                                  alt="icon"
                                  style={{ width: 24, height: 24 }}
                                />
                              ) : (
                                React.cloneElement(option.icon, {
                                  sx: {
                                    color: "rgba(0, 135, 85, 1) !important",
                                    width: 24,
                                    height: 24,
                                  },
                                })
                              )
                            ) : (
                              option.icon
                            )}
                          </Box>
                        )}
                        <Typography
                          sx={{
                            color: "#000",
                            fontWeight: "500",
                            fontSize: "16px",
                          }}
                          className="dubai-med"
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <Alert className="dubai-med" severity="info">
                    No options available.
                  </Alert>
                )}
              </Select>
              {error && label && (
                <Typography
                  sx={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginTop: "4px !important",
                  }}
                  className="dubai-med"
                >
                  {error.message}
                </Typography>
              )}
            </>
          )}
        />
      </FormControl>
    </>
  );
};

export default DropDown;

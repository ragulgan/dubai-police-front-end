import React from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface SelectInputAdornmentsProps {
  name: string;
  control: Control<any>;
  label: string;
  rules?: any;
  placeholder?: string;
  selectOptions: { value: string; label: string }[];
  maxLength?: number;
  regexPattern?: RegExp;
  sx?: any;
}

const SelectInputAdornments: React.FC<SelectInputAdornmentsProps> = ({
  name,
  control,
  label,
  rules,
  placeholder = "",
  selectOptions,
  maxLength = 6,
  regexPattern,
  sx,
}) => {
  return (
    <Box sx={{ ...sx }}>
      <Typography gutterBottom className="typography textfield-label bukra">
        {label} <span className="asterisk">*</span>
      </Typography>
      <FormControl
        sx={{ ...sx, display: "flex", flexDirection: "column" }}
        // error={!!error}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { ref, ...newField }, fieldState: { error } }) => (
            <>
              <OutlinedInput
                {...newField}
                sx={{
                  flexGrow: 1,
                  height: "40px",
                  backgroundColor: "#00875508",
                  marginBottom: "10px",
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px",
                    "::placeholder": {
                      color: "#58585B",
                      opacity: 1,
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#00875508",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#40a377",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#40a377",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#40a377",
                  },
                }}
                inputRef={ref}
                placeholder={placeholder}
                className="custom-outlined-input Text-field-customise"
                type="text"
                fullWidth
                inputProps={{ maxLength }}
                error={!!error}
                onKeyPress={(e) => {
                  if (regexPattern && !regexPattern.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <Select
                      defaultValue={selectOptions[0].value}
                      className="Text-field-customise"
                      sx={{
                        borderLeft: "1px solid grey",
                        minWidth: "5ch",
                        borderRadius: "0",
                        height: "100%",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "& .MuiSelect-select": {
                          paddingLeft: "5px",
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                      IconComponent={() => (
                        <ExpandMoreIcon
                          style={{
                            marginLeft: "-30px",
                            color: "#58585B",
                          }}
                        />
                      )}
                      disableUnderline
                    >
                      {selectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </InputAdornment>
                }
              />
              {/* Display error message below the text field */}
              {error && (
                <FormHelperText
                  sx={{
                    color: "#E4002B",
                    marginTop: "-10px",
                    marginBottom: "10px",
                    marginLeft: "-3px",
                  }}
                >
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default SelectInputAdornments;

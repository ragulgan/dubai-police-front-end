import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";

// Define the option type
interface Option {
  value: string | number; // Adjust this based on your value type
  label: string;
  icon?: JSX.Element;
}

// Define the props for CustomSelect
interface CustomSelectProps {
  // label: string;
  value: string | number | undefined | null; // Include undefined instead of null
  onChange: (
    event: SelectChangeEvent<string | number>,
    child: React.ReactNode
  ) => void; // Updated type
  options: Option[];
  variant?: "standard" | "outlined" | "filled"; // MUI variant options
  minWidth?: number;
  defaultValue?: string | number; // Adjust based on your use case
  onClick?: any;
  disable?: boolean;
  module?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  variant = "standard",
  minWidth,
  defaultValue,
  onClick,
  disable,
  module
}) => {
  const dynamicWidth = module === "season" ? "155px" : "100px";
  return (
    <FormControl sx={{ m: 1 }}>
      {/* <InputLabel id={`${label}-label`}>{label}</InputLabel> */}
      <Select
        value={value ? value : defaultValue}
        onChange={onChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        IconComponent={() => <ExpandMoreIcon style={{ marginRight: "10px" }} />}
        sx={{
          maxHeight: "40px",
          color: "#008755",
          "&.Mui-disabled": {
            color: "#008755 !important", // Prevents color change
          },
          width: dynamicWidth 
        }}
        MenuProps={{
          style: {
            top: '25px'
          }
        }}
        onClick={onClick}
        disabled={disable}
      >
        {options.map((option) => (
          // <MenuItem key={option.value} value={option.value}>
          //   {option.label}
          // </MenuItem>
          <MenuItem key={option.value} value={option.value} sx={{ mt: 1 }} className="search-menu-list">
            {/* {option.icon && <span style={{ marginRight: 8 }}>{option.icon}</span>}
          {option.label} */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%", // Ensure it takes full width for proper alignment
                paddingTop: "2px",
                paddingBottom: "2px",
                paddingLeft: "0px", // Reduced horizontal padding
                paddingRight: "0px", // Reduced horizontal padding // Add padding for better touch area
              }}
              className="dubai-med"
            >
              <Box
                sx={{
                  // Fixed height for the icon container
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "3px", // Space between icon and label
                }}
              >
                {option?.icon}
              </Box>
              <Typography
                sx={{
                  color: "#008755 !important",
                  fontWeight: "500",
                  fontSize: "16px",
                }}
                className="dubai-med"
              >
                {option.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;

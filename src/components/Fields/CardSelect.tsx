import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Tooltip, Typography } from "@mui/material";

// Define the option type
interface Option {
  value: string | number; // Adjust this based on your value type
  label: string;
  sportProfile: any;
}

// Define the props for CardSelect
interface CustomSelectProps {
  // label: string;
  value: string | number | undefined | null; // Include undefined instead of null
  onChange: (
    event: SelectChangeEvent<string | number>,
    child: React.ReactNode
  ) => void; // Updated type
  options: any;
  variant?: "standard" | "outlined" | "filled"; // MUI variant options
  minWidth?: number;
  defaultValue?: string | number; // Adjust based on your use case
  onClick?: any;
  disable?: boolean;
}

const CardSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  variant = "standard",
  minWidth = 120,
  defaultValue,
  onClick,
  disable,
}) => {
  return (
    <FormControl sx={{ m: 1 }}>
      {/* <InputLabel id={`${label}-label`}>{label}</InputLabel> */}
      <Select
        value={value?.toString()}
        onChange={onChange}
        // displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        IconComponent={() => <ExpandMoreIcon style={{ marginRight: "10px" }} />}
        sx={{
          maxHeight: "40px",
          color: "#008755",
          "&.Mui-disabled": {
            color: "#008755", // Prevents color change
          },
        }}
        MenuProps={{
          style: {
            top: "25px",
          },
        }}
        onClick={onClick}
        disabled={disable}
        className="disabled-all-sports-color"
      >
        {options.map((option: any) => (
          // <MenuItem key={option.value} value={option.value}>
          //   {option.label}
          // </MenuItem>
          <MenuItem
            key={option.sportID}
            value={option.sportID}
            sx={{ mt: 1 }}
            className="search-menu-list"
          >
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
                  marginRight: "10px", // Space between icon and label
                }}
              >
                {option.sportName === "All" ? (
                  <>{option.sportProfile}</>
                ) : (
                  <img
                    src={option.sportProfile}
                    alt={option.sportName || "Team Profile"}
                    // Adjusts size within the avatar
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
              <Tooltip title={option.sportName}>
                <Typography
                  sx={{
                    color: disable ? "#008755" : "#008755",
                    fontWeight: "500",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  className="dubai-med primary-color"
                >
                  {/* {option.sportName.length > 6
                    ? option.sportName.slice(0, 15) + "..."
                    : option.sportName} */}
                  {option.sportName}
                </Typography>
              </Tooltip>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CardSelect;

import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Badge, Box, Chip, Tooltip, Typography } from "@mui/material";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";

// Define the option type
interface Option {
  value: string | number; // Adjust this based on your value type
  label: string;
  sportProfile: any;
}

// Define the props for MultiSelect
interface CustomSelectProps {
  // label: string;
  value: any; // Include undefined instead of null
  onChange: (
    event: SelectChangeEvent<string | number>,
    child: React.ReactNode
  ) => void; // Updated type
  options: any;
  variant?: "standard" | "outlined" | "filled"; // MUI variant options
  minWidth?: any;
  defaultValue?: string | number; // Adjust based on your use case
  onClick?: any;
  disable?: boolean;
}

const MultiSelect: React.FC<any> = ({
  value,
  onChange,
  options,
  variant = "standard",
  minWidth,
  defaultValue,
  onClick,
  disable,
  selectAll
}) => {
  const [open, setOpen] = useState<any>(false);
  const handleDelete = (sportID: any) => {
    const updatedValue = value.filter((id: any) => id !== sportID);
    onChange(
      { target: { value: updatedValue } } as SelectChangeEvent<any>,
      null
    );
  };

  const isDisabled = (sportID: any) => {
    // Disable "All" if any other sport is selected
    if (sportID === 0 && value.length > 0) return true;
    // Disable all other sports if "0" is selected
    if (value.includes(0) && sportID !== 0) return true;
    return false;
  };
  const handleIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent click propagation
    setOpen((prev: any) => !prev); // Toggle dropdown visibility
  };
  return (
<FormControl sx={{ m: selectAll ? 0 : 1, width: selectAll ? "100%" : "auto" }}>
{/* <InputLabel id={`${label}-label`}>{label}</InputLabel> */}
      <Select
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        multiple
        value={value}
        onChange={onChange}
        displayEmpty //for testing purpose we uncommenting displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        className="Text-field-customise"
        IconComponent={() => (
          <Box
            onClick={handleIconClick}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <ExpandMoreIcon />
          </Box>
        )}
        sx={{
          maxHeight: "40px",
          width: "260px",
          color: "#008755",
          "&.Mui-disabled": {
            color: "#008755 !important", // Prevents color change
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 350,
              overflowY: "auto",
            },
          },
        }}
        onClick={onClick}
        disabled={disable}
        renderValue={(selected: any) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {selected.length > 0 ? (
              [selected[0]].map((sportID: any) => {
                const selectedOption = options.find(
                  (option: any) => option.sportID === sportID
                );

                return (
                  <>
                    <Tooltip title={selectedOption?.sportName}>
                      <Chip
                        key={sportID}
                        label={
                          selectedOption?.sportName.length > 8
                            ? `${selectedOption?.sportName.substring(0, 8)}...`
                            : selectedOption?.sportName
                        }
                        avatar={
                          <>
                            {selectedOption?.sportName !== "All" ? (
                              <img
                                src={selectedOption?.sportProfile}
                                alt={selectedOption?.sportName}
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <ScoreboardOutlinedIcon />
                            )}
                          </>
                        }
                        sx={{
                          backgroundColor: "#e0f7ec",
                          color: "#008755",
                          fontWeight: "500",
                        }}
                        {...(selectedOption?.sportName !== "All" && {
                          onDelete: () => handleDelete(sportID),
                          onMouseDown: (event: any) => {
                            event.stopPropagation();
                          },
                        })}
                      />
                    </Tooltip>
                    {selected.length > 1 && (
                      <Avatar
                        sx={{
                          bgcolor: "#e0f7ec",
                          color: "#008755",
                          fontSize: "0.875rem",
                          width: 30,
                          height: 30,
                          fontWeight: "bold",
                        }}
                      >
                        {selected.length - 1} +
                      </Avatar>
                    )}
                  </>
                );
              })
            ) : (
              <Typography sx={{ color: "#008755", fontWeight: "500" }}>
                No Selection
              </Typography>
            )}
          </Box>
        )}
      >
        {options.map((option: any) => (
          <MenuItem
            key={option.value}
            value={option.sportID}
            sx={{ mt: 1 }}
            className="search-menu-list"
            // disabled={isDisabled(option.sportID)}
          >
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

              <Typography
                sx={{
                  color: "#008755",
                  fontWeight: "500",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                className="dubai-med"
              >
                {option.sportName}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;

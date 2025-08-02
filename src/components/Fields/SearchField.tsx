import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "../../../public/svg/searchicon.svg";

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  sx?: object;
}

const SearchField: React.FC<SearchFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  sx,
}) => {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={value}
      className="Text-field-customise dubai-med"
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton size="medium">
              <SearchIcon
                data-testid="SearchIcon"
                sx={{ color: "#58585B", width: "24px", height: "24px" }}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          paddingLeft: "8px",
          maxHeight: "45px",
          borderRadius: "8px",
        },
        ...sx,
      }}
    />
  );
};

export default SearchField;

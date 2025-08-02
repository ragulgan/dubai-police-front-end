import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

const MyCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.secondary.main,
  padding: 2,
  "&.Mui-checked": {
    color: "#26D07C",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 26, // Adjust the size of the icon
  },
  "& .MuiCheckbox-root": {
    borderRadius: "8px", // Add custom border radius
  },
}));

interface CustomCheckboxProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return <MyCheckbox checked={checked} onChange={onChange} />;
};

export default CustomCheckbox;

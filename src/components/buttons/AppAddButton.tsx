"use client";

import { Button, SxProps, Theme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type AppAddButtonProps = {
  label: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
};

const AppAddButton: React.FC<AppAddButtonProps> = ({ sx, label, onClick }) => {
  return (
    <Button
      variant="contained"
      className="dubai-med text-capitalize"
      sx={{
        flexGrow: 0,
        width: "auto",
        minWidth: 0,
        borderRadius: "0",
        borderTopRightRadius: "4px",
        fontSize: "20px",
        height: {xs: "80px", lg: "58px"},
        px: 2,
        whiteSpace: "nowrap",
        ...sx,
      }}
      endIcon={<AddIcon />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default AppAddButton;

"use client";
import { Box, Typography } from "@mui/material";

interface ViewPageChipProps {
  label: string;
  value: string;
}

const ViewPageChip: React.FC<ViewPageChipProps> = ({ label, value }) => {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#19775C",
        borderRadius: 1,
        marginRight: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "15px",
          lineHeight: "22.95px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className="bukra"
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
          lineHeight: "22.95px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className="dubai-med"
      >
        {value}
      </Typography>
    </Box>
  );
};

export default ViewPageChip;

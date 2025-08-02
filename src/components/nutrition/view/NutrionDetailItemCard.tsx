"use client";
import { Box, Typography } from "@mui/material";

interface NutritionDetailItemCardProps {
  label: string;
  value: string;
}

const NutritionDetailItemCard: React.FC<NutritionDetailItemCardProps> = ({
  label,
  value,
}) => {
  return (
    <Box
      height={"72px"}
      borderRadius={"4px"}
      bgcolor={"rgba(0, 135, 85, 0.03)"}
      border={"1px solid #008755"}
      p={1}
    >
      <Typography
        className="bukra"
        sx={{
          color: "#58585B",
          fontSize: "15px",
        }}
      >
        {label}
      </Typography>
      <Typography
        className="dubai-med"
        sx={{
          fontSize: "16px",
          mt: 1,
          color: "#000000",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default NutritionDetailItemCard;

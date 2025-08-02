"use client";
import { Box, Typography } from "@mui/material";

interface NutritionChipProps {
  bgColor: string;
  label: string;
  value: string;
}

const NutritionChip: React.FC<NutritionChipProps> = ({
  bgColor,
  label,
  value,
}) => {
  return (
    <Box
      width={"74px"}
      height={"40px"}
      bgcolor={bgColor}
      borderRadius={"4px"}
      display={"grid"}
      alignContent={"center"}
      textAlign={"center"}
      sx={{ placeContent: "center", paddingTop: 1 }}
    >
      <Typography
        className="bukra-semi-bold"
        sx={{
          color: "#ffffff",
          fontSize: "12px",
        }}
      >
        {value}
      </Typography>
      <Typography
        className="dubai-regular"
        sx={{
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: 400,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default NutritionChip;

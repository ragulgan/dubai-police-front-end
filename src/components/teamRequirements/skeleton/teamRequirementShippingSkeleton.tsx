import React from "react";
import { Box, Grid, Skeleton, Stack } from "@mui/material";

interface FieldSkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: number | string;
  height?: number | string;
  isAvatar?: boolean;
  avatarSize?: number;
  labelWidth?: number | string;
}

const TeamRequirementShippingFieldSkeleton: React.FC<FieldSkeletonProps> = ({
  variant = "text",
  width = "100%",
  height = 50,
  isAvatar = false,
  avatarSize = 80,
  labelWidth = "50%",
}) => {
  return (
    <Stack spacing={1} alignItems="flex-start" width={"100%"} p={3}>
      <Grid container spacing={2} justifyContent={"space-between"}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12}>
            <Skeleton variant="text" width={labelWidth} height={20} />
            <Skeleton variant={variant} width={width} height={height} />
          </Grid>
          
          
        ))}
      </Grid>
      <Grid container spacing={2} justifyContent={"space-between"}>
        {Array.from({ length: 1 }).map((_, index) => (
          <Grid item xs={12}>
            <Skeleton variant="text" width={labelWidth} height={20} />
            <Skeleton variant="rectangular" width={530} height={60} />
            {/* <Skeleton variant={variant} width={width} height={height} /> */}
          </Grid>
          
          
        ))}
      </Grid>
    </Stack>
  );
};

export default TeamRequirementShippingFieldSkeleton;

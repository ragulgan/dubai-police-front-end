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

const EditFieldSkeleton: React.FC<FieldSkeletonProps> = ({
  variant = "text",
  width = "100%",
  height = 50,
  isAvatar = false,
  avatarSize = 80,
  labelWidth = "50%",
}) => {
  return (
    <Stack alignItems="flex-start" width={"100%"}>
      {/* Skeleton for Avatar */}
      {isAvatar && (
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={"200px"}
          sx={{ mb: 2 }}
        />
      )}

      {/* Skeleton for Label */}
      <Grid container spacing={2} justifyContent={"space-between"}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={5.75}>
            <Skeleton variant="text" width={labelWidth} height={20} />
            <Skeleton variant={variant} width={width} height={height} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default EditFieldSkeleton;

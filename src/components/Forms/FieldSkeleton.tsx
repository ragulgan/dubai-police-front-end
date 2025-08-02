import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

interface FieldSkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: number | string;
  height?: number | string;
  isAvatar?: boolean;
  avatarSize?: number;
  labelWidth?: number | string;
}

const FieldSkeleton: React.FC<FieldSkeletonProps> = ({
  variant = "text",
  width = "100%",
  height = 50,
  isAvatar = false,
  avatarSize = 80,
  labelWidth = "50%",
}) => {
  return (
    <Stack spacing={1} alignItems="flex-start" width={width}>
      {/* Skeleton for Avatar */}
      {isAvatar && (
        <Skeleton
          variant="circular"
          width={avatarSize}
          height={avatarSize}
          sx={{ mb: 1 }}
        />
      )}

      {/* Skeleton for Label */}
      {Array.from({ length: 4 }).map((_, index) => (
        <>
          <Skeleton variant="text" width={labelWidth} height={20} />
          <Skeleton variant={variant} width={width} height={height} />
        </>
      ))}
    </Stack>
  );
};

export default FieldSkeleton;

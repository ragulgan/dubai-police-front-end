"use client"
import { Box, Grid, Skeleton } from "@mui/material";

const GridViewSkeleton: React.FC = () => {
  return (
    <Grid container spacing={2} p={2}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item sx={{ minWidth: 279 }} key={index}>
          <Skeleton variant="rectangular" height={200} animation="wave" />
          <Box sx={{ pt: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default GridViewSkeleton;

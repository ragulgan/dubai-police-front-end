"use client";
import { Box, Grid, Skeleton, useMediaQuery } from "@mui/material";

const ResultsGridViewSkeleton: React.FC = () => {
  const is2K = useMediaQuery("(min-width:1535px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  return (
    <Grid container spacing={2} p={2}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item key={index} width={"411px"}>
          <Skeleton variant="rectangular" height={431} animation="wave" />
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

export default ResultsGridViewSkeleton;

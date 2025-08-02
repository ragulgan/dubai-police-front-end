"use client"
import { Box, Grid, Skeleton, SxProps, Theme } from "@mui/material";
type TableSkeletonProps = {
  sx?: SxProps<Theme>;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ sx }) => {
  return (
    <>
      <Box sx={{ ...sx }}>
        {
          Array.from({ length: 5 }).map((_, index) => (
            <Grid container spacing={2} p={2} key={index}>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Skeleton variant="text" width="100%" />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Skeleton variant="text" width="100%" />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Skeleton variant="text" width="100%" />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Skeleton variant="text" width="100%" />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Skeleton variant="text" width="100%" />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Skeleton variant="text" width="100%" />
              </Grid>
            </Grid>
          ))
        }
      </Box>
    </>
  )
};

export default TableSkeleton;
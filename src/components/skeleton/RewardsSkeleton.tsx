import { Box, Grid, Skeleton } from "@mui/material"

const RewardsSkeleton: React.FC = () => {
  return (
    <Box p={3}>
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item key={index}>
            <Box sx={{ width: "345px", height: "349px" }}>
              <Skeleton
                variant="rectangular"
                height={200}
                animation="wave"
              />
              <Box sx={{ pt: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default RewardsSkeleton;
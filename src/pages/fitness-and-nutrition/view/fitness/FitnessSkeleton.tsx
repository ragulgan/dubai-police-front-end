"use client"
import { Box, Grid, Skeleton } from "@mui/material";

const FitnessSkeleton: React.FC = () => {
 return (
  <>
   <Box
    sx={{
     borderRadius: 1,
     padding: 3,
     marginTop: 1,
     backgroundColor: "white",
    }}
   >
    <Grid container>
     <Grid item xs={8}>
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
       <Skeleton variant="rectangular" width={80} height={36} animation="wave" />
      </Box>
     </Grid>
     <Grid item xs={4}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
       <Skeleton variant="rectangular" width={80} height={36} animation="wave" />
      </Box>
     </Grid>
     <Grid item xs={12} mt={2}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
       <Skeleton variant="circular" width={72} height={72} />
       <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
      </Box>
     </Grid>
     <Grid item xs={12} mt={1}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
       <Skeleton variant="rectangular" width={110} height={60} />
       <Skeleton variant="rectangular" width={110} height={60} />
       <Skeleton variant="rectangular" width={110} height={60} />
       <Skeleton variant="rectangular" width={110} height={60} />
      </Box>
     </Grid>
    </Grid>
   </Box>
   <Grid container spacing={2} mt={0.5}>
    <Grid item xs={6}>
     <Box
      sx={{
       borderRadius: 1,
       padding: 3,
       backgroundColor: "white",
       border: "1px solid #ccc",
      }}
     >
      <Grid container spacing={2}>
       <Grid item xs={12}>
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", width: "40%" }} />
       </Grid>
       {[...Array(6)].map((_, index) => (
        <Grid item xs={6} key={index}>
         <Skeleton variant="text" sx={{ fontSize: "1rem", width: "50%" }} />
         <Skeleton variant="text" sx={{ fontSize: "1rem", width: "80%" }} />
        </Grid>
       ))}
       <Grid item xs={12}>
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "60%" }} />
       </Grid>
      </Grid>
     </Box>
    </Grid>
    <Grid item xs={6}>
     <Box
      sx={{
       borderRadius: 1,
       padding: 3,
       backgroundColor: "white",
       border: "1px solid #ccc",
      }}
     >
      <Grid container spacing={2}>
       <Grid item xs={12}>
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", width: "40%" }} />
       </Grid>
       {[...Array(6)].map((_, index) => (
        <Grid item xs={6} key={index}>
         <Skeleton variant="text" sx={{ fontSize: "1rem", width: "50%" }} />
         <Skeleton variant="text" sx={{ fontSize: "1rem", width: "80%" }} />
        </Grid>
       ))}
       <Grid item xs={12}>
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "60%" }} />
       </Grid>
      </Grid>
     </Box>
    </Grid>
   </Grid>
  </>
 )
};

export default FitnessSkeleton;
"use client"
import { Box, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const RolesAndPermissionViewSkeleton: React.FC = () => {
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          {/* Render 3 columns to match the image structure */}
          {[...Array(3)].map((_, colIndex) => (
            <Grid item xs={12} sm={4} key={colIndex}>
              {[...Array(40)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 2,
                    marginLeft: 2,
                    gap: 3, // Adds space between text and switch
                  }}
                >
                  <Skeleton variant="text" width="280px" height={40} />
                  <Skeleton variant="text" width={40} height={40} />
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
};

export default RolesAndPermissionViewSkeleton;
import React from "react";
import { Box, CssBaseline, Grid, useMediaQuery } from "@mui/material";
import CustomCard from "@/components/CustomCard";

const SubMenuLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <Box>
      {" "}
      {/* Full viewport height */}
      <CssBaseline />
      {/* Grid container for layout */}
      <Grid container p={1} pl={0}>
        {/* CustomCard with 20% width */}
        <Grid
          item
          xs={12}
          sm={3}
          md={2}
          xl={1.75}
          sx={{ backgroundColor: "#f5f5f5", borderTopRightRadius: "4px" }}
        >
          {" "}
          {/* Adjust grid size */}
          <CustomCard path={"rewards"} customSelect={"Rewards"} />
        </Grid>
        {/* Main content with 80% width */}
        <Grid item xs={12} sm={9} md={10} xl={10.25}>
          <Box sx={{ paddingLeft: "8px", paddingTop: isMobile ? "8px" : "0px" }}>{children}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubMenuLayout;

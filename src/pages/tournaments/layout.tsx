import React from "react";
import { Box, CssBaseline, Grid } from "@mui/material";

const SubMenuLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12} sm={12} md={12} xl={12}>
          <Box sx={{ padding: "5px" }}>{children}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubMenuLayout;

"use client";
import React from "react";
import { Box, CssBaseline, Grid } from "@mui/material";
import Link from "next/link";
import CustomCard from "@/components/CustomCard";
import { usePathname } from "next/navigation";

const SubMenuLayout = ({ children }: { children: React.ReactNode }) => {
  const currentNav = usePathname();

  return (
    <Box>
      {" "}
      {/* Full viewport height */}
      <CssBaseline />
      {/* Grid container for layout */}
      {currentNav && currentNav.includes("/view") ? (
        <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <Box>{children}</Box>
          </Grid>
        </Grid>
      ) : (
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
            <CustomCard path={"raceCalendar"} customSelect={"Race Calendar"} />
          </Grid>
          {/* Main content with 80% width */}
          <Grid item xs={12} sm={9} md={10} xl={10.25}>
            <Box sx={{ paddingLeft: "8px" }}>{children}</Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SubMenuLayout;

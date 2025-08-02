"use client";
import React from "react";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import SubMenuLayout from "../../layout";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AppAddButton from "@/components/buttons/AppAddButton";
import SeasonCardView from "@/components/tournaments/seasonPlanner/seasonCardView";
import CreateSeasonPlanner from "@/components/tournaments/seasonPlanner/add";

const SeasonAddPage = () => {
  const router = useRouter();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Dashboard",
      route: `/dashboard`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/tournaments`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Commander's Shield",
      route: `/tournaments/commander`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Season Planner",
      route: `/tournaments/commander/seasons/add`,
      currentPage: true,
      disabled: false,
    },
  ];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  
  const getPageContentHeight = () => {
    if (is4K) return "73vh";
    if (isFullHD) return "74vh";
    if (is3K) return "73vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "73vh";
    if (isLaptop) return "73vh";
    if (isTab) return "69vh";
    return "69vh";
  };

  return (
    <>
          <Box p={1.5} className="bg-white" borderRadius={1}>
            <BasicBreadcrumbs routes={breadcrumbRoutes} />
          </Box>
          <Grid container mt={1}>
            <Grid item xs={12}>
              <Box className="bg-white" borderRadius={1}>
                <Box p={2}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        lineHeight: "19.2px",
                        textAlign: "left",
                      }}
                      className="bukra-semi-bold"
                    >
                      Create Season Plan
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </Box>
              <Box
                className="bg-white"
                borderRadius={1}
                sx={{
                  width: "100%",
                  height: getPageContentHeight(),
                  overflowY: "scroll",
                }}
                p={3}
              >
                <CreateSeasonPlanner />
              </Box>
            </Grid>
          </Grid>
        </>
  );
}
SeasonAddPage.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default SeasonAddPage;

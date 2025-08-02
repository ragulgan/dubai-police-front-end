"use client";
import React, { useEffect } from "react";
import SubMenuLayout from "./layout";
import { Box, Grid, useMediaQuery } from "@mui/material";
import CurrentSeason from "@/components/teamOverviewDashboard/currentSeason";
import TopScorerCard from "@/components/dashboard/topScorerCard";
import LatestResultCard from "@/components/dashboard/latestResultCard";
import TopPerformingAthletes from "@/components/dashboard/topPerformingAthletes";
import ActiveCompetitions from "@/components/dashboard/activeCompetitions";
import UpcomingCompetitionCard from "@/components/dashboard/upcomingCompetitions";
import RaceTrends from "@/components/dashboard/raceTrends";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useRouter } from "next/router";
import { getLocalStorage } from "@/utils/helper";

function Page() {
  const router = useRouter();
  const getSportID = getLocalStorage("sport");
  // Current Season
  const phases = [
    { label: "Pre-Season", duration: "(Jan - Mar 2025)" },
    { label: "Off-Season", duration: "(Mar - Jun 2025)" },
    { label: "In-Season", duration: "(Jun - Dec 2025)" },
  ];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "85.25vh";
    if (isFullHD) return "85.25vh";
    if (is3K) return "85.25vh";
    if (is2K) return "82.25vh";
    if (isLaptopL) return "82.25vh";
    if (isLaptop) return "82.25vh";
    if (isTab) return "82.25vh";
    return "78.25vh";
  };

  return (
    <>
      <Box
        sx={{
          height: getPageContentHeight(),
          overflowY: "scroll",
          mt: { xs: 1, sm: 0 },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <CurrentSeason phases={phases} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopScorerCard />
              </Grid>
              <Grid item xs={12}>
                <LatestResultCard />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    maxWidth: "100%",
                    background: "#fff",
                    borderRadius: 2,
                    p: 3,
                    pb: 3,
                  }}
                >
                  <TopPerformingAthletes />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <ActiveCompetitions />
              </Grid>
              <Grid item xs={12}>
                <UpcomingCompetitionCard />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <RaceTrends />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

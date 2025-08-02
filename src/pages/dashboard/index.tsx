// new feature branch
import React from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { DashboardCard } from "@/components/dashboard/dashboardCard";
import TopScorerCard from "@/components/dashboard/topScorerCard";
import LatestResultCard from "@/components/dashboard/latestResultCard";
import ActiveCompetitions from "@/components/dashboard/activeCompetitions";
import UpcomingCompetitionCard from "@/components/dashboard/upcomingCompetitions";
import TotalTrainingAndAttendanceRate from "@/components/dashboard/totalTrainingAndAttendanceRate";
import GlobalDataTrends from "@/components/dashboard/globalDataTrends";
import TopPerformingAthletes from "@/components/dashboard/topPerformingAthletes";
import TopPerformingTeam from "@/components/dashboard/topPerformingTeam";
import CompetitionsAndWinrate from "@/components/dashboard/competitionsAndWinrate";
import RaceTrends from "@/components/dashboard/raceTrends";

export default function Dashboard() {
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
      <Box p={1}>
        <Box
          sx={{
            height: getPageContentHeight(),
            overflowY: "scroll",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <DashboardCard />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TopScorerCard />
                </Grid>
                <Grid item xs={12} md={12}>
                  <LatestResultCard />
                </Grid>
                <Grid item xs={12} md={12}>
                  <ActiveCompetitions />
                </Grid>
                <Grid item xs={12} md={12}>
                  <UpcomingCompetitionCard />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TotalTrainingAndAttendanceRate />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <GlobalDataTrends />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{
                      maxWidth: "100%",
                      background: "#fff",
                      borderRadius: 2,
                      p: 3,
                      pb: 0,
                    }}
                  >
                    <TopPerformingAthletes />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{
                      maxWidth: "100%",
                      background: "#fff",
                      borderRadius: 2,
                      p: 3,
                      pb: 0,
                    }}
                  >
                    <TopPerformingTeam />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <CompetitionsAndWinrate />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <RaceTrends />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

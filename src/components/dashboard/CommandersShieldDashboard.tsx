import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

import HeaderCard from "./components/HeaderCard ";
import TotalWinRateChart from "./components/TotalWinRateChart";
import TopRanking from "./components/TopRanking ";
import TopAthlete from "./components/TopAthlete";
import TopPerforming from "./components/TopPerforming";
import StandingsChart from "./components/StandingsChart";
import TotalShieldScore from "./components/TotalShieldScore";
import PieAnimation from "./components/piaChart";
import BubbleChart from "./components/BubbleChart";
import RoundedBarChartCard from "./components/PhysicalReideness";

export default function CommandersShieldDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Commander's Shield Races & Tournaments 2025
      </Typography>

      <Grid container spacing={2}>
        {/* Top 5 Ranking */}
        {/* <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top 5 Ranking</Typography>
              {["Security of agencies", "Airport Security", "Criminal Investigations", "Community Happiness", "Dubai Police Academy"].map((name, index) => (
                <Typography key={index} variant="body1">
                  {index + 1}. {name}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} md={12}>
          <HeaderCard />
        </Grid>
        {/* Total Win Rate */}

        <Grid item xs={12} md={6}>
          <TopRanking />
        </Grid>
        <Grid item xs={12} md={6}>
          <TotalWinRateChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopAthlete />
        </Grid>

        <Grid item xs={12} md={6}>
          <TopPerforming />
        </Grid>

        <Grid item xs={12} md={12}>
          <StandingsChart />
        </Grid>

      
        <Grid item xs={12} md={7}>
          <TotalShieldScore />
        </Grid>

        {/* Physical Readiness */}
        <Grid item xs={12} md={5}>
          <PieAnimation />
        </Grid>
        <Grid item xs={12} md={6}>
          <BubbleChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <RoundedBarChartCard />
        </Grid>
      </Grid>
    </Box>
  );
}

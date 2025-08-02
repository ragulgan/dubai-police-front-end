"use client";
import { Box, Grid, Typography } from "@mui/material";
import SkillSVG from "../../../public/SkillSVG.svg";
import TacticsSVG from "../../../public/TacticsSVG.svg";
import AgileSVG from "../../../public/AgileSVG.svg";
import KPIChartPNG from "../../../public/KPIChartPNG.png";
import Image from "next/image";
import TinyAreaChart from "../charts/TinyAreaChart";

const KPIs: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        paddingBottom: 2,
        height: 451,
        minHeight: 451,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ padding: 1, fontSize: 15 }}
        className="bukra-semi-bold"
      >
        {"KPIs"}
      </Typography>
      <Box className="kpi-chart-container">
        <TinyAreaChart />
      </Box>
      <Box sx={{ marginTop: 0 }}>
        <Grid container spacing={1}>
          <Grid
            item
            md={8}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                minWidth: 50,
                width: 50,
                height: 50,
                backgroundColor: "#F3F6F9",
                padding: 1,
              }}
            >
              <SkillSVG style={{ width: 29, height: 29 }} />
            </Box>
            <Box sx={{ marginLeft: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: 12, color: "#464E5F" }}
              >
                {"Technical Skills"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: 10, color: "#B5B5C3" }}
                className="bukra-semi-bold"
              >
                {"Dribbling accuracy"}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color: "#80808F",
                backgroundColor: "#F3F6F9",
                padding: 1,
                borderRadius: 1,
              }}
            >
              {"85%"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={1}>
          <Grid
            item
            xs={10}
            md={10}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                minWidth: 50,
                width: 50,
                height: 50,
                backgroundColor: "#F3F6F9",
              }}
            >
              <TacticsSVG style={{ width: 29, height: 29 }} />
            </Box>
            <Box sx={{ marginLeft: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: 12, color: "#464E5F" }}
              >
                {"Tactical"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: 10, color: "#B5B5C3" }}
                className="bukra-semi-bold"
              >
                {"Positioning during counter-attacks"}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={2}
            md={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color: "#80808F",
                backgroundColor: "#F3F6F9",
                padding: 1,
                borderRadius: 1,
              }}
            >
              {"88%"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={1}>
          <Grid
            item
            xs={10}
            md={10}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                width: 50,
                height: 50,
                backgroundColor: "#F3F6F9",
              }}
            >
              <AgileSVG style={{ width: 29, height: 29 }} />
            </Box>
            <Box sx={{ marginLeft: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: 12, color: "#464E5F" }}
              >
                {"Agility"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: 10, color: "#B5B5C3" }}
                className="bukra-semi-bold"
              >
                {"Sprint agility"}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            md={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color: "#80808F",
                backgroundColor: "#F3F6F9",
                padding: 1,
                borderRadius: 1,
              }}
            >
              {"90%"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default KPIs;

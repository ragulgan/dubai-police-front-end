"use client";

import { Box, Grid, Typography } from "@mui/material";
import CircularPieChart from "../charts/CircularPieChart";
import CalendarRedSVG from "../../../public/CalendarRedSVG.svg";
import TimeSVG from "../../../public/TimeSVG.svg";
import TimeTickSVG from "../../../public/TimeTickSVG.svg";
import StretchingExercisesSVG from "../../../public/StretchingExercisesSVG.svg";

const TrainingStatus: React.FC = () => {
  return (
    <Box
      sx={{
        height: 451,
        minHeight: 451,
        borderRadius: 2,
        padding: 1,
        backgroundImage: "url(/TrainingStatusBG.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ padding: 1, fontWeight: 700, fontSize: 17, color: "#464E5F" }}
      >
        {"Weekly Training Stats"}
      </Typography>
      <Typography
        variant="caption"
        sx={{ paddingLeft: 1, fontWeight: 500, fontSize: 12, color: "#80808F" }}
      >
        {"50 Sessions Completed"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <CircularPieChart />
      </Box>
      <Grid container>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              margin: "auto",
              backgroundColor: "#E4002B33",
              padding: 2,
            }}
          >
            <CalendarRedSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 18, color: "#464E5F" }}
              className="bukra-semi-bold"
            >
              {"50"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, fontSize: 10, color: "#B5B5C3" }}
            >
              {"Sessions Conducted"}
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              margin: "auto",
              backgroundColor: "#05868E33",
              padding: 2,
            }}
          >
            <TimeSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 18, color: "#464E5F" }}
              className="bukra-semi-bold"
            >
              {"86hrs"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, fontSize: 10, color: "#B5B5C3" }}
            >
              {"Training Hours"}
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              margin: "auto",
              backgroundColor: "#29ABE233",
              padding: 2,
            }}
          >
            <TimeTickSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 18, color: "#464E5F" }}
              className="bukra-semi-bold"
            >
              {"92%"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, fontSize: 10, color: "#B5B5C3" }}
            >
              {"Training Availability"}
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              margin: "auto",
              backgroundColor: "#26D07C33",
              padding: 2,
            }}
          >
            <StretchingExercisesSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 18, color: "#464E5F" }}
              className="bukra-semi-bold"
            >
              {"10"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, fontSize: 10, color: "#B5B5C3" }}
            >
              {"Player Count"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainingStatus;

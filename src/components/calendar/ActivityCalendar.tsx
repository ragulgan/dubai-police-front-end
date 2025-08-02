"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { ID } from "@/interfaces/AppInterfaces";
import ActivityCalender from "./YearAndMonth";
import moment from "moment";

const rawEventData = [
  { date: "2025-01-15", planName: "Winter Training", location: "Gym A", status: "completed", athleteType: "Male" },
  { date: "2025-03-10", planName: "Trial Match", location: "Field Z", status: "upcoming", athleteType: "Female" },
  { date: "2025-04-20", planName: "Holiday Break", location: "N/A", status: "holiday", athleteType: "Both" },
  { date: "2025-05-01", planName: "May Kickoff", location: "Stadium A", status: "completed", athleteType: "Male" },
];

const seasonPlannerList = Array.from({ length: 12 }, (_, i) => {
  const month = moment().month(i).format("MMMM"); // "January", "February", ...
  const events = rawEventData.filter(
    (e) => moment(e.date).month() === i && moment(e.date).year() === 2025
  );
  return {
    month,
    year: 2025,
    data: events,
  };
});

function Page() {
  const [id, setID] = useState<ID | undefined>(undefined);

  return (
    <>

      <Grid container spacing={0.5} mt={0.1}>
        <Grid item sm={12}>
          <Grid container spacing={0.5} borderTop={"1px solid #DEE2ED"}>

            <Box
              sx={{
                height: "100%",
                overflowY: "auto",
                paddingTop: 2,
                paddingLeft: 2,
                paddingRight: 2,
                paddingBottom: 10,
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                cursor: "pointer",
              }}
              className="bg-white"
              borderRadius={1}
            >
              <ActivityCalender
                seasonPlannerList={seasonPlannerList}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Page;

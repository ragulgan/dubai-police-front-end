import React, { useEffect } from "react";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import LocationIcon from "../../../public/Location.svg";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { getRaceYearlyCalendarAPI } from "@/redux/slices/raceCalendar/getRaceCalendarYearlyListSlice";
import { isEmpty } from "lodash";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/router";

type EventItem = {
  id: number;
  title: string;
  startDate: string;
  description: string;
  year: number;
  month: number; // 1 for Jan, 12 for Dec
};

interface YearGridProps {
  // events: EventItem[];
  onClick: any,
  year: any,
  module?: string
}

export function YearGrid({ onClick, year, module }: YearGridProps) {
  const router = useRouter();
  const { teamID } = router.query;
  // export function YearGrid({ events,onClick }: YearGridProps) {
  const currentYear = new Date().getFullYear();
  const dispatch: AppDispatch = useDispatch();
  // Group events by month (0–11)
  const monthEventsMap: { [key: number]: EventItem[] } = {};
  const events = useSelector((state: any) => {
    console.log({ state });

    return state.GetRaceYearlyCalendar.data;
  });
  console.log({ teamID });

  const url =
    module === "race" && teamID
      ? `/YearView/${teamID}/RaceCalendar/${year}`
      : module === "trainingplan" && teamID
        ? `/YearView/${teamID}/TrainingPlan/${year}`
        : `/YearView/RaceCalendar/${year}`;

  !isEmpty(events) && events.forEach((event: any) => {
    if (event.year === currentYear) {
      const monthIdx = event.month - 1;
      if (!monthEventsMap[monthIdx]) {
        monthEventsMap[monthIdx] = [];
      }
      monthEventsMap[monthIdx].push(event);
    }
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    console.log({ year }, '==============');

    dispatch(getRaceYearlyCalendarAPI(url));
  }, [year])

  return (
    <Grid container
      // rowSpacing={2} 
      // rowSpacing={{ xs: 3, lg: 1 }} // more space on small, less on large
      // columnSpacing={{ xs: 2, sm: 3, lg: 2, xl: 1 }}
      rowSpacing={{ xs: 3, md: 3, lg: 2, xl: 3 }}
      columnSpacing={{ xs: 2, sm: 2, md: 3, lg: 2, xl: -10 }}
      sx={{ marginLeft: '32px !important' }}
      justifyContent="center" marginTop={2}>
      {monthNames.map((monthName, monthIndex) => {
        const eventsInMonth = monthEventsMap[monthIndex] || [];
        const hasManyEvents = eventsInMonth.length > 2;
        const needsScroll = eventsInMonth.length > 5;

        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            key={`month-${monthIndex}`}
          >
            <Box
              sx={{
                // overflowY: needsScroll ? "auto" : "visible",
                overflowX: "hidden",
                // width: "354px",
                width: {
                  xs: '100%',   // full width on small screens
                  sm: '110%',    // 80% of container width on small devices
                  md: '108%',    // 60% on medium screens
                  lg: '100%',    // 50% on large screens
                  xl: '100%',
                },
                borderRadius: "12px",
                // boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                borderWidth: "0px 1px 1px 1px",
                borderStyle: "solid",
                borderColor: "#8BE7B9",
                bgcolor: "white",
                height: "190px",
                // height: hasManyEvents ? "190px" : "auto",
                transition: "height 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                maxHeight: eventsInMonth.length > 2 ? "auto" : "190px",
                alignItems: "center",
                ...(hasManyEvents && {
                  "&:hover": {
                    height: "300px",
                  },
                }),
              }}
            >
              <Box
                sx={{
                  bgcolor: "#8BE7B9",
                  p: 1.5,
                  textAlign: "center",
                  width: "100%",
                  maxHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // gap: 1,
                }}
              >
                <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", justifyContent: 'center', gap: 1 }}>
                  {monthName}
                  {eventsInMonth.length > 2 && (
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "#005844",
                        color: "white",
                        borderRadius: "32px",
                        width: "45px",
                        height: "28px",
                        padding: "3px 8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >
                      +{eventsInMonth.length - 2}
                    </Box>
                  )}
                </Typography>
              </Box>

              {/* Scrollable Events Area */}
              {eventsInMonth.length !== 0 ? <Box
                sx={{
                  overflowX: "hidden",
                  //   overflowY: needsScroll ? "auto" : "visible",
                  maxHeight: needsScroll ? "240px" : "none",
                  //   maxHeight: needsScroll ? "240px" : "none",
                  width: "100%",
                  px: 1,
                  "&:hover": {
                    overflowY: eventsInMonth.length > 2 ? "auto" : "hidden",
                    "&::-webkit-scrollbar": {
                      width: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#ccc",
                      borderRadius: "4px",
                    },
                  },
                  "&::-webkit-scrollbar": {
                    width: "0px",
                  },
                }}
              >
                {eventsInMonth.map((event) => {
                  const eventDate = new Date(event.startDate);
                  const day = eventDate.getDate();
                  const weekday = eventDate.toLocaleString("default", { weekday: "short" });

                  return (
                    <Box
                      key={event.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#F1F3F5",
                        p: 1.5,
                        borderRadius: "8px",
                        width: "95%",
                        outline: "1px solid #F1F4F7",
                        borderLeft: "5px solid orange",
                        gap: 1.5,
                        mx: "auto",
                        my: 1,
                        maxHeight: "60px",
                      }}
                    >
                      {/* Date & Day */}
                      <Box sx={{ textAlign: "center", minWidth: "40px" }}>
                        <Typography variant="h6" fontWeight="bold">
                          {day}
                        </Typography>
                        <Typography fontSize="12px" color="gray">
                          {weekday}
                        </Typography>
                      </Box>

                      {/* Vertical Line */}
                      <Box sx={{ borderLeft: "2px solid #A9A9A9", height: "40px" }} />

                      {/* Event Details */}
                      <Box sx={{ flex: 1, ml: 1 }}>
                        <Typography
                          fontSize="14px"
                          fontWeight={600}
                          noWrap
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexGrow: 1,
                            maxWidth: "150px",
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                            gap: 0.5,
                            maxWidth: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <LocationIcon sx={{ width: 16, height: 16, color: "gray", flexShrink: 0 }} />
                          <Typography
                            fontSize="12px"
                            color="gray"
                            noWrap
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              flexGrow: 1,
                              maxWidth: "140px",
                            }}
                          >
                            {event.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
                }             </Box>
                :
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mx: "auto",
                    my: "auto",
                  }}
                >
                  <IconButton
                    onClick={
                      onClick
                    }
                    sx={{
                      width: "56px",
                      height: "56px",
                      bgcolor: "#F1F4F7",
                      borderRadius: "8px",
                      color: "#000",

                      "&:hover": {
                        bgcolor: "#E6E8EA",
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

              }
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

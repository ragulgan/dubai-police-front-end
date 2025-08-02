import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import BothGender from "../../../public/BothGender.svg"
import Male from "../../../public/Male.svg"
import Female from "../../../public/Female.svg"
import Mappin from "../../../public/mappin.svg";
import { keyframes } from "@mui/system";


interface SeasonProps {
  seasonPlannerList: any;
}

const ActivityCalendar: React.FC<SeasonProps> = ({ seasonPlannerList }) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const getDaysInMonth = (month: number, year: number) => {
    const days = [];
    const start = moment([year, month]); // month is 0-based
    const end = start.clone().endOf("month");

    for (let m = start.clone(); m.isSameOrBefore(end); m.add(1, "day")) {
      days.push(m.clone());
    }
    return days;
  };

  const getEventForDate = (events: any[], date: string) => {
    return events.find((event) => moment(event.date).format("YYYY-MM-DD") === date);
  };

  const getBgColor = (status: string | null, isWeekend: boolean) => {
    if (status === "holiday") return "rgba(173, 216, 230, 1)";
    if (status === "completed") return "rgba(0, 135, 85, 0.1)";
    if (status === "ongoing") return "rgba(141, 144, 147, 0.1)";
    if (status === "cancelled") return "rgba(228, 0, 43, 0.1)";
    if (status === "upcoming") return "rgba(0, 163, 255, 0.1)";
    if (isWeekend) return "#4FB5A1";
    return "#fff"; // default for no data
  };

  const waveAnimation: any = keyframes`
      0% {
        box-shadow: 0 0 0 0 rgba(228, 0, 43, 0.7);
      }
      50% {
        box-shadow: 0 0 10px 10px rgba(228, 0, 43, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(228, 0, 43, 0);
      }
    `;

  return (
    <Box p={{ xs: 3 }} pt={0}>
      <Grid container spacing={2} sx={{ justifyContent: isMobile ? "center" : "flex-start" }}>
        {/* {seasonPlannerList.map((season: any, index: number) => { */}
        {seasonPlannerList.slice(0, 4).map((season: any, index: number) => {

          const monthIndex = moment().month(season.month).month(); // get correct index
          const year = season.year;
          const daysInMonth = getDaysInMonth(monthIndex, year);
          const events = season.data || [];

          return (
            <Grid item key={index} width={258}>
              <Card sx={{ borderRadius: 2, border: "1px solid #8BE7B9", backgroundColor: "transparent" }}>
                <CardHeader
                  title={
                    <Typography fontWeight="bold" fontSize={18} textAlign="center">
                      {season.month.toUpperCase()}
                    </Typography>
                  }
                  sx={{ backgroundColor: "#8BE7B9", p: 1 }}
                />
                <CardContent sx={{ p: 0, backgroundColor: "#fff" }}>
                  {daysInMonth.map((day, idx) => {
                    const dateStr = day.format("YYYY-MM-DD");
                    const event = getEventForDate(events, dateStr);
                    const isWeekend = [6, 0].includes(day.day());
                    const bgColor = getBgColor(event?.status || null, isWeekend);

                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          backgroundColor: bgColor,
                          height: "62px",
                          px: 1,
                        }}
                      >
                        {/* Date */}
                        <Box sx={{ width: "15%", flexShrink: 0 }}>
                          <Typography
                            fontWeight={700}
                            fontSize="14px"
                            lineHeight="130%"
                            letterSpacing="0%"
                            textAlign="center"
                            className="dubai-med"
                            sx={{ verticalAlign: 'middle' }}
                          >
                            {day.format("DD")}
                          </Typography>
                          <Typography
                            className="dubai-med"
                            fontWeight={400}
                            fontSize="12px"
                            lineHeight="130%"
                            letterSpacing="0%"
                            textAlign="center"
                            sx={{ verticalAlign: 'middle' }}
                            color="#000000"
                          >
                            {day.format("ddd")}
                          </Typography>

                        </Box>

                        {/* Divider */}
                        {event?.planName && event?.location && (
                          <Box
                            sx={{
                              borderLeft: "1px solid #7A7A7A",
                              height: "40px",
                              alignSelf: "center",
                              mx: 1,
                            }}
                          />
                        )}

                        {/* Content */}
                        <Box sx={{ flex: 1, overflow: "hidden" }}>
                          {event ? (

                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start !important"
                              spacing={2}
                              my={0}
                              sx={{ flexWrap: "nowrap", marginY: "5px" }} // Prevents wrapping to the next line
                            >

                              <Box
                                sx={{ width: "50%", flexShrink: 0, marginLeft: "5px !important" }}
                              >
                                <Tooltip
                                  title={event?.planName}
                                  className="bukra"
                                >
                                  <Typography
                                    className="dubai-bold season-card-plan"
                                    fontWeight={500}
                                    fontSize="14px"
                                    lineHeight="130%"
                                    letterSpacing="0%"
                                    sx={{ verticalAlign: 'middle' }}
                                  >
                                    {event?.planName}
                                    {event.sportsStatus === "live" &&
                                      <Chip
                                        label={"Live"}
                                        sx={{
                                          backgroundColor: "#E4002B",
                                          color: "#FFFFFF",
                                          height: "20px",
                                          border: "1px solid #E4002B",
                                          borderRadius: "24px",
                                          ".MuiChip-label": {
                                            fontSize: "16px",
                                            lineHeight: "18px",
                                            textAlign: "left",
                                          },
                                          width: "fit-content",
                                          ml: 2,
                                          animation: `${waveAnimation} 2.5s infinite ease-in-out`,
                                        }}
                                        className="dubai-med"
                                      />}
                                  </Typography>
                                </Tooltip>
                                <Tooltip
                                  title={event?.location}
                                  className="bukra"
                                >
                                  <Typography
                                    className="dubai-med"
                                    fontWeight={400}
                                    fontSize="12px"
                                    lineHeight="130%"
                                    letterSpacing="0%"
                                    sx={{ verticalAlign: 'middle', display: 'inline-flex', alignItems: 'center' }}
                                  >
                                    <Mappin width="12px" height="12px" style={{ marginRight: '4px' }} />
                                    {event?.location}
                                  </Typography>

                                </Tooltip>
                              </Box>

                              <Box sx={{ width: "25%", flexShrink: 0 }}>
                                {/* <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#58585B",
                                    whiteSpace: "nowrap",
                                  }}
                                  className="dubai-bold"
                                  textAlign="end"
                                >
                                  {event?.athleteType === "Male" ? <Male width={"18px"} height={"46px"} /> : event?.athleteType === "Female" ? <Female width={"18px"} height={"46px"} /> : event?.athleteType === "Both" ? <BothGender width={"18px"} height={"46px"} /> : null}
                                </Typography> */}
                                <Male width={"18px"} height={"46px"} />
                              </Box>
                            </Stack>
                          ) : (
                            <Typography fontSize="14px" color="#999">
                            </Typography>
                          )}

                        </Box>
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ActivityCalendar;

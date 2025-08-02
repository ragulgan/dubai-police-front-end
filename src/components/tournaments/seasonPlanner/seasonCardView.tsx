import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Popover,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import { keyframes } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import SeasonCustomIconButton from "../../buttons/seasonAddButton";
import Mappin from "../../../../public/mappin.svg";
import BothGender from "../../../../public/BothGender.svg"
import Male from "../../../../public/Male.svg"
import Female from "../../../../public/Female.svg"
import CalendarRace from "../../../../public/CalendarRace.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomCalendar from "@/components/calendar/CustomCalendar";
import CalendarViewSwitchButtons from "@/components/calendar/CalendarViewSwitchButtons";
import { checkIsSameMonth, convertDateString, getCurrentDateString } from "@/utils/datetime";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ID } from "@/interfaces/AppInterfaces";
import { dataCalendarSorting, generateEventID } from "@/utils/helper";
import CircleIcon from "@mui/icons-material/Circle";


interface SeasonProps {
  events?: any;
  setOpen?: any;
  setID?: any;
  seasonPlannerList: any;
  isEdit: (id: string) => void;
  filter?: any;
  setfilter?: any;
  setFilterData?: any;
  monthChange?: any;
  setMonthChange?: any;
  setValue?: any;
  value?: any;
  setDate?: any;
  setCalendarItems?: any;
  calendarItems?: any;
  calendarName?: any;
}

const SeasonCardView: React.FC<SeasonProps> = ({
  events,
  setOpen,
  setID,
  seasonPlannerList,
  isEdit,
  filter,
  setfilter,
  setFilterData,
  monthChange,
  setMonthChange,
  setValue,
  value,
  setDate,
  setCalendarItems,
  calendarItems,
  calendarName
}) => {
  const waveAnimation = keyframes`
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

  const isMobile = useMediaQuery("(max-width:768px)");
  const router = useRouter();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const [selectedTab, setSelectedTab] = useState(2);
  const [todayActive, setTodayActive] = useState(false);
  const [listView, setListView] = useState("calendar");
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectInfo, setSelectInfo] = useState<any>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [title, setTitle] = useState("");
  const [deleteData, setDeleteData] = useState<ID | undefined>(undefined);
  const [sortedData, setSortedData] = useState<any[]>([]);

  const handleTabChange = (event: any, newValue: any) => {
    let view = "dayGridMonth";
    if (newValue == 0) view = "timeGridDay";
    if (newValue == 1) view = "timeGridWeek";
    if (newValue == 2) view = "dayGridMonth";
    if (newValue == 3) view = "yearGrid";
    setCalendarView(view);
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const result: any = Object.values(
      events &&
      events?.reduce((acc: any, item: any) => {
        if (!acc[item.start]) {
          acc[item.start] = { date: item.start, events: [] };
        }
        acc[item.start].events.push({
          sportID: item.sportID,
          title: item.title,
          section: item.section,
          backgroundColor: item.backgroundColor,
          textColor: item.textColor,
          ...(item.tournamentID ? { tournamentID: item.tournamentID } : {}),
          ...(item.trainingID ? { trainingID: item.trainingID } : {}),
          ...(item.eventID ? { eventID: item.eventID } : {}),
          ...(item.meetingID ? { meetingID: item.meetingID } : {}),
          ...(item.reminderID ? { reminderID: item.reminderID } : {}),
        });
        return acc;
      }, {})
    );
    setSortedData(dataCalendarSorting(result));
  }, [monthChange, events]);

  const handleDateSelect = (selectInfo: any) => {
    if (!selectInfo?.start) {
      return;
    }
    if (selectedTab == 2) {
      const selectedMonth = selectInfo.start.getMonth();
      const selectedYear = selectInfo.start.getFullYear();
      if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
        return;
      }
    }
    setSelectInfo(selectInfo);
    setEventTitle("");
    if (calendarName === "master-plan") {
      setOpen(true);
    }
    setDate(selectInfo?.start);
  };

  useEffect(() => {
    if (filter) {
      console.log({ filter });

      setListView("list");
    } else {
      setListView("calendar");
    }
  }, [filter]);

  const handleDatesSet = (info: any) => {
    const visibleStart = info.view.currentStart;
    const visibleEnd = info.view.currentEnd;
    const currentMonth = visibleStart.getMonth();
    const currentYear = visibleStart.getFullYear();
    setCurrentMonth(currentMonth);
    setCurrentYear(currentYear);
  };

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id; // Get the event ID
    const eventTitle = clickInfo.event.title; // Get the event title (optional)
    const eventDate = clickInfo.event.date; // Get the event title (optional)

    if (calendarName === "master-plan") {
      setID(clickInfo.event._def.extendedProps);
    }
    setTitle(eventTitle);
    setDeleteData(clickInfo.event._def.extendedProps);
  };

  const handleListView = (listData: any) => {
    setID({
      section: listData.section,
      [generateEventID(listData.section)]:
        listData[generateEventID(listData.section)],
      sportID: listData.sportID,
    });
    setTitle(listData.title);
    setDeleteData({
      section: listData.section,
      [generateEventID(listData.section)]:
        listData[generateEventID(listData.section)],
      sportID: listData.sportID,
    });
  };

  const handleIconClick = (value: any) => {
    setListView(value);
    setSelectedTab(2);
  };

  useEffect(() => {
    if (calendarRef.current && monthChange) {
      const calendarApi = calendarRef.current.getApi();
      const formattedDate = convertDateString(
        monthChange,
        "MMM DD, YYYY",
        "YYYY-MM-DD"
      );
      if (formattedDate) {
        calendarApi.gotoDate(formattedDate);
      }
      document.querySelectorAll(".fc-day.highlighted-day").forEach((day) => {
        day.classList.remove("highlighted-day");
      });
      const selectedDay = document.querySelector(
        `.fc-day[data-date="${formattedDate}"]`
      );
      if (selectedDay) {
        selectedDay.classList.add("highlighted-day");
      }
      setAnchorEl(null);
      setFilterDialogOpen(false);
    }
  }, [monthChange, calendarView, selectedTab, listView]);

  const handleToday = () => {
    setListView("calendar");
    setMonthChange(getCurrentDateString("MMM DD, YYYY"));
    if (calendarRef.current) {
      const calendarApi = calendarRef?.current?.getApi();
      calendarApi.gotoDate(getCurrentDateString("YYYY-MM-DD"));
    }
    setTimeout(() => {
      // setSelectedTab(0)
      // setCalendarView("timeGridDay");
      setTodayActive(true);
    }, 10);
  };

  const handleCalendarClick = () => {
    setfilter(false);
    handleIconClick("calendar");
    setMonthChange(getCurrentDateString("MMM DD, YYYY"));
    setFilterData({});
    setSelectedTab(2);
    setCalendarView("dayGridMonth");
    setTodayActive(false);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
    // handleChangeMonth()
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  useEffect(() => {
    if (calendarView && calendarView !== 'yearGrid' && calendarRef.current) {
      calendarRef.current.getApi().changeView(calendarView);
      setTimeout(() => {
        const today = document.querySelector(".fc-daygrid-day.fc-day-today");
        if (today) {
          today.classList.add("highlighted-day");
        }
      }, 0);
    }
  }, [calendarView, selectedTab, listView]);

  return (
    <div className="app-calendar-container">
      <Grid
        component={"article"}
        container
        alignContent={"center"}
        justifyContent={"space-between"}
      >
        <Grid item xs={4}>
          <Button
            className="text-capitalize dubai-med race-calendar-header-button"
            variant="text"
            startIcon={<CalendarRace sx={{ width: "25px", height: "27px" }} />}
            endIcon={<ExpandMoreIcon />}
            onClick={handleFilterClick}
          >
            {monthChange}
          </Button>
          <Popover
            open={filterDialogOpen}
            anchorEl={anchorEl}
            onClose={handleCloseFilterDialog}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <CustomCalendar
              setMonthChange={setMonthChange}
              monthChange={monthChange}
              setValue={setValue}
              value={value}
            />
          </Popover>
        </Grid>
        <Grid
          item
          xs={8}
          display={"flex"}
          textAlign={"end"}
          height={"38px"}
          justifyContent={"end"}
        >
          <CalendarViewSwitchButtons
            sx={{ marginRight: 2 }}
            currentTab={selectedTab}
            handleTabChange={handleTabChange}
          />
          <Button
            variant={todayActive ? "contained" : "outlined"}
            className="dubai-med text-capitalize"
            sx={{ mr: 1, ml: 1 }}
            onClick={handleToday}
          // disabled={monthChange === getCurrentDateString("MMM DD, YYYY")}
          >
            Today
          </Button>
          <Box
            sx={{
              border: "1px solid #008755",
              borderRadius: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <Button
              variant={
                listView === "calendar" && !todayActive ? "contained" : "text"
              }
              className="dubai-med text-capitalize"
              onClick={handleCalendarClick}
              sx={{ px: 2 }}
            >
              Calendar
            </Button>
            <Button
              variant={
                listView === "list" && !todayActive ? "contained" : "text"
              }
              className="dubai-med text-capitalize"
              onClick={() => {
                handleIconClick("list");
                setTodayActive(false);
              }}
              sx={{ px: 2 }}
            >
              List View
            </Button>
          </Box>
        </Grid>
      </Grid>


      {listView === "calendar" ? (
        listView === "calendar" && calendarView === "yearGrid" ? (
          <>
            <Grid container spacing={2} sx={{ justifyContent: isMobile ? "center" : "" }}>
              {seasonPlannerList &&
                seasonPlannerList.map((season: any, index: any) => {
                  const isHovered = hoveredCardIndex === index;
                  const visibleItems = isHovered ? season.data : season.data.slice(0, 2);
                  const remainingCount = season.data.length - 2;
                  return (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={index}>
                      <Card
                        onMouseEnter={() => setHoveredCardIndex(index)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                        sx={{
                          width: "100%",
                          height: remainingCount > 0 ? "auto" : "191.75px",
                          // transition: remainingCount > 0 ? "height 0.3s ease" : "",
                          borderRadius: "16px",
                          border: "1px solid rgba(139, 231, 185, 1)",
                          boxShadow: "none",
                          p: 0,
                        }}
                      >
                        <CardHeader
                          className="season-card-header"
                          title={
                            <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                              <Typography className="bukra-semi-bold season-card-month">{season.month}</Typography>
                              {!isHovered && remainingCount > 0 && (
                                <Chip
                                  label={`+${remainingCount}`}
                                  size="small"
                                  className="dubai-bold"
                                  sx={{
                                    ml: 1,
                                    bgcolor: "#005844",
                                    color: "#fff",
                                    width: "48px",
                                    height: "28px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    borderRadius: "32px",
                                  }}
                                />
                              )}
                            </Box>
                          }
                        />
                        <CardContent sx={{ display: season?.data.length === 0 ? "flex" : "grid", justifyContent: "center", alignItems: "center", placeItems: season?.data.length === 0 ? "center" : "end", height: remainingCount > 0 ? "100%" : "150.75px", p: 1 }} className="remove-padding">
                          {season &&
                            season.data.length > 0 ? (
                            visibleItems.map((item: any, idx: number) => (
                              <Card
                                key={idx}
                                sx={{
                                  width: "100%",
                                  height: "62px",
                                  borderRadius: "8px",
                                  bgcolor: "rgba(241, 244, 247, 1)",
                                  borderLeft: item.status === "completed" ? "8px solid rgba(0, 135, 85, 1)" : item.status === "ongoing" ? "8px solid rgba(141, 144, 147, 1)" : item.status === "cancelled" ? "8px solid rgba(228, 0, 43, 1)" : item.status === "upcoming" ? "8px solid rgba(0, 163, 255, 1)" : "8px solid rgba(250, 156, 24, 1)",
                                  p: 0.5,
                                  mb: 1,
                                  cursor: "pointer"
                                }}
                                onClick={() => isEdit(item?.id)}
                              >
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="flex-start !important"
                                  spacing={2}
                                  my={0}
                                  sx={{ flexWrap: "nowrap", marginY: "5px" }} // Prevents wrapping to the next line
                                >
                                  <Box sx={{ width: "15%", flexShrink: 0 }}>
                                    <Typography
                                      className="dubai-bold season-card-date"
                                    >
                                      {item?.date?.slice(0, 2)}
                                    </Typography>
                                    <Typography
                                      className="dubai-bold season-card-day"
                                    >
                                      {item?.date?.split(" ")?.[1] ?? ""}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      borderLeft: "1px solid #7A7A7A", // Customize color as needed
                                      height: "40px", // Adjust height as needed
                                      alignSelf: "center", // Aligns the line vertically in the center
                                      marginLeft: "-5px !important",
                                    }}
                                  />
                                  <Box
                                    sx={{ width: "50%", flexShrink: 0, marginLeft: "5px !important" }}
                                  >
                                    <Tooltip
                                      title={item?.planName}
                                      className="bukra"
                                    >
                                      <Typography
                                        className="dubai-bold season-card-plan"
                                      >
                                        {item?.planName}
                                        {item.sportsStatus === "live" &&
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
                                      title={item?.location}
                                      className="bukra"
                                    >
                                      <Typography
                                        className="dubai-bold season-card-location"
                                      >
                                        <Mappin width={"12px"} height={"12px"} />{" "} {item?.location}
                                      </Typography>
                                    </Tooltip>
                                  </Box>
                                  <Box sx={{ width: "25%", flexShrink: 0 }}>
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        color: "#58585B",
                                        whiteSpace: "nowrap",
                                      }}
                                      className="dubai-bold"
                                      textAlign="end"
                                    >
                                      {item?.athleteType === "Male" ? <Male width={"18px"} height={"46px"} /> : item?.athleteType === "Female" ? <Female width={"18px"} height={"46px"} /> : item?.athleteType === "Both" ? <BothGender width={"18px"} height={"46px"} /> : null}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Card>
                            ))
                          ) : (
                            <SeasonCustomIconButton icon={AddIcon} onClick={() => setOpen(true)} title="Create Season Plan" />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end", alignItems: "center", p: 2, pr: 2 }}>
              <Stack direction="row" spacing={2}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, bgcolor: 'rgba(0, 135, 85, 1)', borderRadius: '4px', mr: 0.5, gap: "6px" }} />
                  <Typography className="dubai-med" fontSize="14px">Completed</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, bgcolor: 'rgba(141, 144, 147, 1)', borderRadius: '4px', mr: 0.5, gap: "6px" }} />
                  <Typography className="dubai-med" fontSize="14px">Ongoing</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, bgcolor: 'rgba(228, 0, 43, 1)', borderRadius: '4px', mr: 0.5, gap: "6px" }} />
                  <Typography className="dubai-med" fontSize="14px">Cancelled</Typography>
                </Box>
              </Stack>
            </Box>
          </>
        ) :
          listView === "calendar" && calendarView !== "yearGrid" &&
          (
            <FullCalendar
              ref={calendarRef}
              events={events}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              headerToolbar={{
                left: "title",
                center: "next",
                right: "today,dayGridMonth,timeGridDay,listMonth,yearView",
              }}
              customButtons={{
                yearView: {
                  text: "Year",
                  click: () => setCalendarView("yearGrid"),
                },
              }}
              buttonText={{
                today: "Today",
                month: "Calendar",
                list: "List View",
              }}
              initialView="dayGridMonth"
              dayHeaderFormat={{
                weekday: "short",
              }}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={false}
              weekends={weekendsVisible}
              select={handleDateSelect}
              datesSet={handleDatesSet}
              eventClick={handleEventClick}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              views={{
                dayGridMonth: {
                  titleFormat: {
                    month: "short",
                    year: "numeric",
                    day: "numeric",
                  },
                  dayMaxEvents: 3,
                  showNonCurrentDates: true,
                  fixedWeekCount: false,
                },
                timeGridWeek: {
                  dayMaxEvents: 5,
                },
                timeGridDay: {
                  dayMaxEvents: 5,
                },
              }}
              listDaySideFormat={false}
            />
          )
      ) :
        listView !== "calendar" && calendarView !== "yearGrid" &&
        (
          <Box
            component={"body"}
            sx={{
              backgroundColor: "rgba(155, 227, 191, 0.1)",
              borderRadius: "4px",
            }}
            pb={5}
          >
            {sortedData && sortedData.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "#58585B", padding: "20px" }}
              >
                No events
              </Typography>
            ) : sortedData &&
              sortedData.filter((item: any) =>
                checkIsSameMonth(item?.date, monthChange)
              ).length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "#58585B", padding: "20px" }}
              >
                No events for this month
              </Typography>
            ) : (
              sortedData
                .filter((item: any) => checkIsSameMonth(item?.date, monthChange))
                .map((item: any, index: any) => (
                  <Box
                    p={2}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"start"}
                    borderBottom={"1px solid #EDF1F6"}
                    key={index}
                  >
                    <Box width={"30%"} display={"flex"} alignItems={"center"}>
                      <Typography
                        className="dubai-med"
                        sx={{
                          backgroundColor: "#008755",
                          height: "30px",
                          width: "30px",
                          borderRadius: "50%",
                          color: "#FFFFFF",
                          display: "grid",
                          alignContent: "center",
                          placeContent: "center",
                          mr: 2,
                        }}
                      >
                        {convertDateString(item?.date, "YYYY/MM/DD", "DD")}
                      </Typography>
                      <Typography className="dubai-med" sx={{ color: "#000000" }}>
                        {convertDateString(
                          item?.date,
                          "YYYY/MM/DD",
                          "MMM, ddd"
                        ).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box width={"70%"} mt={1}>
                      {item?.events.map((eventItem: any, index: any) => (
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          key={index}
                          mt={2}
                          onClick={() => handleListView(eventItem)}
                        >
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            width={{ md: "40%", xl: "30%" }}
                          >
                            <CircleIcon
                              sx={{
                                mr: 1,
                                color: eventItem?.backgroundColor,
                                cursor: "pointer",
                              }}
                              onClick={() => handleListView(eventItem)}
                            />
                            <Typography
                              className="dubai-med"
                              sx={{ color: "#58585B" }}
                            >
                              {eventItem?.time}
                            </Typography>
                          </Box>
                          <Box width={{ md: "60%", xl: "70%" }}>
                            <Typography
                              className="dubai-med"
                              sx={{ color: "#58585B" }}
                            >
                              {eventItem?.title}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))
            )}
          </Box>
        )}
    </div>
  );
};

export default SeasonCardView;

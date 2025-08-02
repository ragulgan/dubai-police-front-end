import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Box,
  Grid,
  Typography,
  Popover,
  SelectChangeEvent,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarRace from "../../../public/CalendarRace.svg";
import CircleIcon from "@mui/icons-material/Circle";
import EventCard from "@/components/calendar/EventCard";
import { dataCalendarSorting, generateEventID } from "@/utils/helper";
import CustomCalendar from "./CustomCalendar";
import { ID } from "@/interfaces/AppInterfaces";
import {
  checkIsSameMonth,
  getCurrentDateString,
  convertDateString,
} from "@/utils/datetime";
import CalendarViewSwitchButtons from "./CalendarViewSwitchButtons";
import MultiSelect from "../Fields/MultiSelect";
import CustomMultiSelect from "../multiSelect/CustomMultiSelect";
import ReactSelect from "../Fields/ReactSelect";
import MenuFilter from "./menuFilters";
import { YearGrid } from "./YearGrid";
import dayjs from "dayjs";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import { getReportByID, reportGetByIDSlice } from "@/redux/slices/reports/reportGetByIDSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

interface CustomFullCalendarProps {
  events: any;
  setOpen?: any;
  setID?: any;
  isEdit?: any;
  filter?: any;
  setfilter?: any;
  setFilterData?: any;
  monthChange?: any;
  setMonthChange?: any;
  setValue?: any;
  value?: any;
  teamID?: any;
  setDate?: any;
  editData?: any;
  isView?: any;
  setView?: any;
  setCalendarItems?: any;
  calendarItems?: any;
  calendarName?: any;
  moduleType?: any;
}

const CustomFullCalendar: React.FC<CustomFullCalendarProps> = ({
  events,
  setOpen,
  setID,
  isEdit,
  filter,
  setfilter,
  setFilterData,
  monthChange,
  setMonthChange,
  setValue,
  value,
  teamID,
  setDate,
  editData,
  isView,
  setView,
  setCalendarItems,
  calendarItems,
  calendarName,
  moduleType
}) => {
  const [title, setTitle] = useState("");
  const [deleteData, setDeleteData] = useState<ID | undefined>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [todayActive, setTodayActive] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarView, setCalendarView] = useState("dayGridMonth"); // dayGridMonth or timeGridWeek or timeGridDay
  const [selectedTab, setSelectedTab] = useState(2);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const handleTabChange = (event: any, newValue: any) => {
    let view = "dayGridMonth";
    if (newValue == 0) view = "timeGridDay";
    if (newValue == 1) view = "timeGridWeek";
    if (newValue == 2) view = "dayGridMonth";
    if (newValue == 3) view = "yearGrid";
    setCalendarView(view);
    setSelectedTab(newValue);
  };
  console.log({ editData, isEdit, title }, '@ race calendar');

  useEffect(() => {
    if (!isEmpty(editData)) {

      const tournamentIDKey = Object.keys(editData).find(
        key => key.toLowerCase() === "tournamentid"
      );
      const tournamentIDValue = tournamentIDKey ? editData[tournamentIDKey] : null;
      console.log({ tournamentIDKey, tournamentIDValue });
      if (typeof tournamentIDKey === 'string' && typeof tournamentIDValue === 'number') {
        // router.push(`/teams/${teamID}/raceCalendar/edit`)
        dispatch(getReportByID({ url: `/Sports/${teamID}/Race/${tournamentIDValue}` }));
      }
    }


    // if(editData && tournamentIDValue)
  }, [editData])

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

  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [eventTitle, setEventTitle] = useState("");
  const [listView, setListView] = useState("calendar");
  const [selectInfo, setSelectInfo] = useState<any>(null);
  const year: number = dayjs(value).year();
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
    // For Future Use
    if (calendarName === "race-calendar" && checkAccess(USER_PERMISSION.RaceCalendarAdd)) {
      setOpen(true);
    }
    if (calendarName === "competition-calendar" && checkAccess(USER_PERMISSION.CompetitionCalendarAdd)) {
      setOpen(true);
    }
    if (moduleType === "staff" && checkAccess(USER_PERMISSION.RaceCalendarAdd)) {
      setOpen(true);
    }
    if (moduleType === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarAdd)) {
      setOpen(true);
    }
    if (calendarName !== "race-calendar" && calendarName !== "competition-calendar" &&
      moduleType !== "staff" && moduleType !== "athlete") {
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
    // For Future Use 
    if (calendarName === "race-calendar" && checkAccess(USER_PERMISSION.RaceCalendarView)) {
      setID(clickInfo.event._def.extendedProps);
      setView(true);
    }
    if (calendarName === "competition-calendar" && checkAccess(USER_PERMISSION.CompetitionCalendarView)) {
      setID(clickInfo.event._def.extendedProps);
      setView(true);
    }
    if (moduleType === "staff" && checkAccess(USER_PERMISSION.RaceCalendarView)) {
      setID(clickInfo.event._def.extendedProps);
      setView(true);
    }
    if (moduleType === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarView)) {
      setID(clickInfo.event._def.extendedProps);
      setView(true);
    }
    if (calendarName !== "race-calendar" && calendarName !== "competition-calendar" &&
      moduleType !== "staff" && moduleType !== "athlete") {
      setID(clickInfo.event._def.extendedProps);
      setView(true);
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
    if (calendarName === "race-calendar" && checkAccess(USER_PERMISSION.RaceCalendarView)) {
      setView(true);
    }
    if (calendarName === "competition-calendar" && checkAccess(USER_PERMISSION.CompetitionCalendarView)) {
      setView(true);
    }
    if (moduleType === "staff" && checkAccess(USER_PERMISSION.RaceCalendarView)) {
      setView(true);
    }
    if (moduleType === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarView)) {
      setView(true);
    }
    if (calendarName !== "race-calendar" && calendarName !== "competition-calendar" &&
      moduleType !== "staff" && moduleType !== "athlete") {
      setView(true);
    }
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

  const handleEdit = () => {
    setView(false);
    console.log({ editData });
    const tournamentIDKey = Object.keys(editData).find(
      key => key.toLowerCase() === "tournamentid"
    );

    if (typeof tournamentIDKey === 'string') {

      router.push(`/teams/${teamID}/raceCalendar/edit`)
    }
    else {
      isEdit(true);
    }

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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mx={2}
          >
            <Typography
              className="text-capitalize bukra primary-color"
              sx={{ mr: 2 }}
            >
              Activity
            </Typography>
            {/* Dropdown at flex-start */}
            <MenuFilter
              calendarItems={calendarItems}
              setCalendarItems={setCalendarItems}
            />
          </Box>
          <CalendarViewSwitchButtons
            sx={{ marginRight: 2 }}
            currentTab={selectedTab}
            handleTabChange={handleTabChange}
          />
          {/* <Button
            variant={todayActive ? "contained" : "outlined"}
            className="dubai-med text-capitalize"
            sx={{ mr: 1, ml: 1 }}
            onClick={handleToday}
          // disabled={monthChange === getCurrentDateString("MMM DD, YYYY")}
          >
            Today
          </Button> */}
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
          <YearGrid onClick={() => setOpen(true)} year={year} module={'race'} />
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
      {editData && (
        <EventCard
          isView={isView}
          setView={setView}
          title={title}
          deleteData={deleteData}
          isEdit={handleEdit}
          teamID={teamID}
          editData={editData}
          calendarName={calendarName}
          moduleType={moduleType}
        />
      )}
    </div>
  );
};

export default CustomFullCalendar;

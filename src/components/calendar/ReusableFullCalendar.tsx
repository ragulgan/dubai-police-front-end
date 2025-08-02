"use client";
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Button, Grid, Popover, Typography } from "@mui/material";
import CustomCalendar from "./CustomCalendar";
import CalendarViewSwitchButtons from "./CalendarViewSwitchButtons";
import CalendarRace from "../../../public/CalendarRace.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { convertDateString, getCurrentDateString } from "@/utils/datetime";
import dayjs, { Dayjs } from "dayjs";

type ReusableFullCalendarProps = {
  events: any[];
  handleDateSelect: (dateInfo: any) => void;
  handleEventClick: (clickInfo: any) => void;
  handleDatesSet: (info: any) => void;
};

const ReusableFullCalendar: React.FC<ReusableFullCalendarProps> = ({
  events,
  handleDateSelect,
  handleEventClick,
  handleDatesSet,
}) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [monthChange, setMonthChange] = useState<any>(
    getCurrentDateString("MMM DD, YYYY")
  );
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const [selectedTab, setSelectedTab] = useState(2);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleTabChange = (event: any, newValue: any) => {
    let view = "dayGridMonth";
    if (newValue == 0) view = "timeGridDay";
    if (newValue == 1) view = "timeGridWeek";
    if (newValue == 2) view = "dayGridMonth";
    setCalendarView(view);
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (calendarView && calendarRef.current) {
      calendarRef.current.getApi().changeView(calendarView);
      setTimeout(() => {
        const today = document.querySelector(".fc-daygrid-day.fc-day-today");
        if (today) {
          today.classList.add("highlighted-day");
        }
      }, 0);
    }
  }, [calendarView, selectedTab]);

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
    }
  }, [selectedTab, monthChange]);

  return (
    <Box className="app-calendar-container" sx={{ padding: 1 }}>
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
              setValue={setDateValue}
              value={dateValue}
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
            currentTab={selectedTab}
            handleTabChange={handleTabChange}
          />
        </Grid>
      </Grid>
      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        headerToolbar={{
          left: "title",
          center: "next",
          right: "today,dayGridMonth,timeGridDay,listMonth",
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
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={false}
        weekends={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }}
        views={{
          dayGridMonth: {
            titleFormat: {
              month: "short",
              year: "numeric",
              day: "numeric",
            },
            dayMaxEvents: 3,
            showNonCurrentDates: false,
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
    </Box>
  );
};

export default ReusableFullCalendar;

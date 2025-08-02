import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Box,
  Grid,
  Typography,
  Popover,
  useMediaQuery,
  Alert,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarRace from "../../../public/CalendarRace.svg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TableViewIcon from "../../../public/svg/TableView.svg";
import CircleIcon from "@mui/icons-material/Circle";
import moment, { months } from "moment";
import EventCard from "@/components/calendar/EventCard";
import { dataCalendarSorting } from "@/utils/helper";
import CustomCalendar from "@/components/calendar/CustomCalendar";
import CustomTabs from "@/components/calendar/CalendarViewSwitchButtons";
import dayjs from "dayjs";
import { checkAccess } from "@/utils/acessscheck";

interface CustomFullCalendarProps {
  events?: any;
  setOpen?: any;
  setID?: any;
  isEdit?: any;
  filter?: any;
  setfilter?: any;
  calendarView?: any;
  setFilterData?: any;
  monthChange?: any;
  setMonthChange?: any;
  setValue?: any;
  value?: any;
  selectedTab?: any;
  setSelectedTab?: any;
  CustomIconButton?: any;
  handleIconClick?: any;
  selectedIcon?: any;
}

const CalendarView: React.FC<CustomFullCalendarProps> = ({
  events,
  setOpen,
  setID,
  isEdit,
  filter,
  setfilter,
  calendarView,
  setFilterData,
  monthChange,
  setMonthChange,
  setValue,
  value,
  selectedTab,
  setSelectedTab,
  CustomIconButton,
  handleIconClick,
  selectedIcon,
}) => {
  const [isView, setView] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [todayActive, setTodayActive] = useState(false);
  const result: any = events;
  const sortedData = dataCalendarSorting(result && result);
  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [listView, setListView] = useState("calendarview");
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return "61vh";
    if (isFullHD) return "61vh";
    if (is3K) return "61vh";
    if (is2K) return "52vh";
    if (isLaptopL) return "61vh";
    if (isLaptop) return "61vh";
    if (isTab) return "61vh";
    return "57vh";
  };
  const handleDateSelect = (selectInfo: any) => {
    // setSelectInfo(selectInfo);
    // setEventTitle("");
    // setOpen(true);
  };

  useEffect(() => {
    if (filter) {
      setListView("gridview");
    } else {
      setListView("calendarview");
    }
  }, [filter]);

  const handleEventClick = (clickInfo: any) => {
    if (checkAccess(1069)) {
      isEdit(clickInfo.event._def.extendedProps.programID);
    } else {
      console.log("Access denied: You do not have the required role to edit.");
    }
  };

  const handleEdit = () => {
    isEdit(true);
    setView(false);
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef?.current?.getApi();
      calendarApi.gotoDate(
        moment(monthChange, "MMM DD, YYYY").format("YYYY-MM-DD")
      );
      setAnchorEl(null);
      setFilterDialogOpen(false);
    }
  }, [monthChange]);

  const handleToday = () => {
    setListView("calendarview");
    setMonthChange(moment().format("MMM DD, YYYY"));
    if (calendarRef.current) {
      const calendarApi = calendarRef?.current?.getApi();
      calendarApi.gotoDate(moment().format("YYYY-MM-DD"));
    }
    setTimeout(() => {
      setSelectedTab(0);
    }, 10);
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
    if (calendarView && calendarRef.current) {
      calendarRef.current.getApi().changeView(calendarView);
    }
  }, [calendarView, selectedTab]);

  return (
    <Grid
      container
      spacing={0.5}
      pr={0.5}
      mt={0.1}
      sx={{
        height: getPageContentHeight(),
        overflowY: "scroll",
      }}
    >
      {/* <Grid
        item
        sm={3.5}
        md={4}
        lg={3.75}
        xl={2.85}
        sx={{ borderRight: "1px solid #E3E3E3" }}
      >
        <Box p={2} className="bg-white" borderRadius={1}>
          <Box
            sx={{
              maxHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "& .MuiDateCalendar-root": {
                width: "100%",
                height: "100%",
              },
            }}
          >
            <CustomCalendar
              monthChange={monthChange}
              setMonthChange={setMonthChange}
              setValue={setValue}
              value={value}
            />
          </Box>
        </Box>
      </Grid> */}
      <Grid item sm={12} md={12} lg={12} xl={12}>
        <div
          className="app-calendar-container-training"
          style={{ margin: "16px" }}
        >
          <Grid
            component={"article"}
            container
            alignContent={"center"}
            justifyContent={"space-between"}
            mb={2}
          >
            <Grid item xs={6}>
              <Button
                className="text-capitalize dubai-med race-calendar-header-button"
                variant="text"
                startIcon={
                  <CalendarRace sx={{ width: "25px", height: "27px" }} />
                }
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
              xs={6}
              display={"flex"}
              textAlign={"end"}
              height={"38px"}
              justifyContent={"end"}
            >
              <CustomTabs
                currentTab={selectedTab}
                handleTabChange={handleTabChange}
                module="trainingPlan"
              />

              {/* <Button
                variant={todayActive ? "contained" : "outlined"}
                className="dubai-med text-capitalize"
                sx={{ mr: 2, ml: 2 }}
                onClick={handleToday}
                // disabled={monthChange === moment().format("MMM DD, YYYY")}
              >
                Today
              </Button> */}
            </Grid>
          </Grid>
          {events?.length === 0 ? (
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          ) : (
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
              weekends={weekendsVisible} // Control weekends visibility
              select={handleDateSelect}
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
          )}
          {/* <EventCard
            open={isView}
            setOpen={setView}
            title={title}
            isEdit={handleEdit}
          /> */}
        </div>
      </Grid>
    </Grid>
  );
};

export default CalendarView;

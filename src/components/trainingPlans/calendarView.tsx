import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Box,
  Grid,
  Typography,
  Popover,
  useMediaQuery,
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
import moment, { months } from "moment";
import { dataCalendarSorting } from "@/utils/helper";
import CustomCalendar from "@/components/calendar/CustomCalendar";
import CustomTabs from "@/components/calendar/CalendarViewSwitchButtons";
import dayjs from "dayjs";
import CustomIconButton from "../buttons/CustomIconButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { YearGrid } from "../calendar/YearGrid";
import { useRouter } from "next/router";

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
  handleIconClick?: any;
  selectedView?: any;
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
  handleIconClick,
  selectedView,
}) => {
  const router = useRouter();
  const { teamID } = router.query;
  const [isView, setView] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [todayActive, setTodayActive] = useState(false);
  const year: number = dayjs(value).year();

  const result: any =
    events && events.length > 0
      ? Object.values(
        events &&
        events?.reduce((acc: any, item: any) => {
          if (!acc[item.start]) {
            acc[item.start] = { date: item.start, events: [] };
          }
          acc[item.start].events.push({
            title: item.title,
            section: item.section,
            backgroundColor: item.backgroundColor,
            textColor: item.textColor,
            ...(item.tournamentID
              ? { tournamentID: item.tournamentID }
              : {}),
            ...(item.trainingID ? { trainingID: item.trainingID } : {}),
          });
          return acc;
        }, {})
      )
      : [];
  const sortedData = dataCalendarSorting(result && result);
  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [listView, setListView] = useState("calendar");
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "71vh";
    if (isFullHD) return "73vh";
    if (is3K) return "71vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "67vh";
    return "71vh";
  };

  const handleDateSelect = (selectInfo: any) => {
    // setSelectInfo(selectInfo);
    // setEventTitle("");
    // setOpen(true);
  };

  useEffect(() => {
    if (filter) {
      setListView("list");
    } else {
      setListView("calendar");
    }
  }, [filter]);

  const handleEventClick = (clickInfo: any) => {
    if (checkAccess(USER_PERMISSION.TrainingPlanEdit)) {
      isEdit(clickInfo.event._def.extendedProps.trainingID);
    }
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
    setListView("calendar");
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
              {checkAccess(USER_PERMISSION.TrainingPlanView) ? <Button
                variant="outlined"
                className="text-capitalize dubai-med"
                sx={{ height: "44px", fontSize: "18px" }}
                onClick={() =>
                  router.push(`/teams/${teamID}/trainingPlans/trainingTemplate`)
                }
              >
                Training Templates
              </Button> : <Box></Box>}
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
                sx={{ marginRight: 1 }}
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

              <CustomIconButton
                icon={CalendarMonthIcon}
                isSelected={selectedView === "calendar"}
                onClick={() => handleIconClick("calendar")}
                title="Calendar view"
              />
              <CustomIconButton
                icon={TableViewIcon}
                isSelected={selectedView === "list"}
                onClick={() => handleIconClick("list")}
                title="Table view"
                margin={0}
              />
            </Grid>
          </Grid>
          {selectedTab === 3 ?
            (
              <YearGrid onClick={() => router.push(`/teams/${teamID}/trainingPlans/add`)} year={year} module="trainingplan" />
            )

            :
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
            )
          }
        </div>
      </Grid>
    </Grid>
  );
};

export default CalendarView;

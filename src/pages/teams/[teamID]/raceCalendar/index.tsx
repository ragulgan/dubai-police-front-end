// New feature branch
"use client";
import React, { useEffect, useState } from "react";
import SubMenuLayout from "./layout";
import Box from "@mui/material/Box";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomFullCalendar from "@/components/calendar/CustomFullCalendar";
import { getRaceCalendarAPI } from "@/redux/slices/raceCalendar/getRaceCalendarListSlice";
import { useDispatch, useSelector } from "react-redux";
import { getRaceCalendarListDispatch, RootState } from "@/redux/store";
import { isEmpty } from "lodash";
import moment from "moment";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import {
  clearGetRaceCalendarByIDState,
  GetRaceCalendarByID,
} from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import FilterDateDialog from "../../../../components/calendar/dateFilters";
import dayjs, { Dayjs } from "dayjs";
import CalendarCreateDialog from "@/components/dialogs/CalendarCreateDialog";
import { BreadcrumbRoutes, EventItem } from "@/interfaces/AppInterfaces";
import { generateEventID, transformCalendarData } from "@/utils/helper";
import SlideRaceCalendar from "@/components/raceCalendar/SlideRaceCalendar";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import AppAddButton from "@/components/buttons/AppAddButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useMediaQuery } from "@mui/material";

type Event = {
  sportID: number;
  sportName: string;
  eventID: number;
  eventName: string;
  eventSport: string;
  eventType: string;
  eventDate: string;
};

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/raceCalendar`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Race Calendar",
      route: `/teams/${teamID}/raceCalendar`,
      currentPage: true,
      disabled: false,
    },
  ];
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "72vh";
    if (isFullHD) return "73vh";
    if (is3K) return "72vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "72vh";
    if (isLaptop) return "72vh";
    if (isTab) return "68vh";
    return "72vh";
  };

  const [id, setID] = useState<any>(undefined);
  const [calendarData, setCalendarData] = useState<EventItem[]>([]);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const dispatch: getRaceCalendarListDispatch = useDispatch();
  const [date, setDate] = useState<any>("");
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setfilter] = useState(false);
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [monthChange, setMonthChange] = useState<any>(
    moment().format("MMM DD, YYYY")
  );
  const [calendarItems, setCalendarItems] = useState([
    "tournaments",
    // "trainings",
    // "events",
    // "reminders",
    // "meetings",
    // "tournaments",
    // "trainings",
    // "events",
    // "reminders",
    // "meetings",
  ]);

  const [isView, setView] = useState(false);

  const getRaceCalendarByID = useSelector((state: RootState) => {
    return state &&
      state.GetRaceCalendarByID &&
      !isEmpty(state?.GetRaceCalendarByID?.data) &&
      !isEmpty(state?.GetRaceCalendarByID?.data)
      ? state.GetRaceCalendarByID.data
      : null;
  });

  const getRaceCalendarList = useSelector((state: any) => {
    return state.getRaceCalendarList;
  });

  const isUpdated = useSelector((state: any) => {
    return state.ui.isUpdated;
  });

  useEffect(() => {
    if (!isEmpty(id) && isView) {
      const array = Object.keys(id);
      setDrawerTitle(id.section);
      const payload: any = {
        section: id.section,
        sportID: Number(teamID),
        [generateEventID(id.section)]: id[generateEventID(id.section)],
      };

      dispatch(GetRaceCalendarByID(payload));
    }
  }, [id, isView]);

  // to format the respose for calendar data
  useEffect(() => {
    if (getRaceCalendarList.data && getRaceCalendarList.data.length) {
      setCalendarData(
        transformCalendarData(
          getRaceCalendarList.data,
          calendarItems[0] === "all"
            ? ["tournaments", "trainings", "events", "reminders", "meetings"]
            : calendarItems,
          searchText
        )
      );
    }
  }, [getRaceCalendarList.data, calendarItems, searchText]);

  useEffect(() => {
    if (teamID) {
      const payload = {
        ...filterData,
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 100,
        sportID: Number(teamID),
        moduleView: "",
        moduleID: "0",
      };
      dispatch(getRaceCalendarAPI(payload));
      setfilter(filter);
    }
  }, [teamID, filter, filterData]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 0,
      paginationCount: 100,
      sportID: Number(teamID),
      moduleView: "",
      moduleID: "0",
    };
    if (isUpdated) {
      dispatch(getRaceCalendarAPI(payload));
      dispatch(isUpdatedFunc(false));
    }
  }, [isUpdated]);

  const handleCreateClick = () => {
    setOpenDialog(true);
  };

  const handleCreateItemSelect = (title: any) => {
    setDrawerTitle(title);
    setDrawerOpen(true);
    setOpenDialog(false);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleEditDrawerClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setDrawerOpen(false);
    setTimeout(() => {
      dispatch(clearGetRaceCalendarByIDState());
    }, 1000);
    setDate(null);
  };

  return (
    <>
      {/* Component for calendar create menu popup */}
      <CalendarCreateDialog
        openDialog={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
        handleMenuSelect={handleCreateItemSelect}
      />
      {/* Component for calendar create/update forms */}
      <SlideRaceCalendar
        open={drawerOpen}
        onClose={handleEditDrawerClose}
        title={drawerTitle}
        editData={getRaceCalendarByID}
        date={date}
        setDate={setDate}
      />
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container mt={1}>
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box display={"flex"}>
              <Typography
                sx={{ flexGrow: 0 }}
                p={2}
                className="table-list-header bukra header-border-right"
              >
                Race Calendar
              </Typography>
              <Typography
                sx={{ flexGrow: 2 }}
                p={2}
                className="table-list-header bukra header-border-right"
              ></Typography>
              <ModuleSearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder={"Search..."}
                flexGrow={{ flexGrow: 0 }}
              />
              <ModuleFilterButton
                handleFilterClick={handleFilterClick}
                text={"Filter races by date"}
              />
              <FilterDateDialog
                anchorEl={anchorEl}
                open={filterDialogOpen}
                onClose={handleCloseFilterDialog}
                setFilterData={setFilterData}
                filterData={filterData}
                setfilter={setfilter}
              />
              {checkAccess(USER_PERMISSION.RaceCalendarAdd) ? <AppAddButton label="Create" onClick={handleCreateClick} /> : null}
            </Box >
          </Box >

          <Box
            sx={{
              height: getPageContentHeight(),
              overflowY: "scroll",
              paddingTop: 2,
              paddingLeft: 2,
              paddingRight: 2,
              paddingBottom: 10,
              cursor: "pointer",
            }}
            className="bg-white"
            borderRadius={1}
          >
            <CustomFullCalendar
              events={calendarData}
              setOpen={setOpenDialog}
              setID={setID}
              isEdit={setDrawerOpen}
              filter={filter}
              setfilter={setfilter}
              setFilterData={setFilterData}
              monthChange={monthChange}
              setMonthChange={setMonthChange}
              setValue={setValue}
              value={value}
              teamID={teamID}
              setDate={setDate}
              editData={getRaceCalendarByID}
              isView={isView}
              setView={setView}
              setCalendarItems={setCalendarItems}
              calendarItems={calendarItems}
              calendarName={"race-calendar"}
            />
          </Box>
        </Grid >
      </Grid >
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

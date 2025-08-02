  // New feature branch
  "use client";
  import React, { useEffect, useMemo, useState } from "react";
  import Box from "@mui/material/Box";
  import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
  import Grid from "@mui/material/Grid";
  import Typography from "@mui/material/Typography";
  import CustomFullCalendar from "@/components/calendar/CustomFullCalendar";
  import Button from "@mui/material/Button";
  import AddIcon from "@mui/icons-material/Add";
  import { SelectChangeEvent, useMediaQuery } from "@mui/material";
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
  import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
  import dayjs, { Dayjs } from "dayjs";
  import CalendarCreateDialog from "@/components/dialogs/CalendarCreateDialog";
  import {
    generateEventID,
    setLocalStorage,
    transformCalendarData,
  } from "@/utils/helper";
  import { BreadcrumbRoutes, EventItem } from "@/interfaces/AppInterfaces";
  import SlideRaceCalendar from "@/components/raceCalendar/SlideRaceCalendar";
  import MultiSelect from "@/components/Fields/MultiSelect";
  import { checkAccess } from "@/utils/acessscheck";
  import { USER_PERMISSION } from "@/utils/constants";

  function Page() {
    const [id, setID] = useState<any>(undefined);
    const [calendarData, setCalendarData] = useState<EventItem[]>([]);
    const getRaceCalendarByID = useSelector((state: RootState) => {
      return state &&
        state.GetRaceCalendarByID &&
        !isEmpty(state?.GetRaceCalendarByID?.data) &&
        !isEmpty(state?.GetRaceCalendarByID?.data)
        ? state.GetRaceCalendarByID.data
        : null;
    });
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const dispatch: getRaceCalendarListDispatch = useDispatch();
    const breadcrumbRoutes: BreadcrumbRoutes[] = [
      {
        title: "Competition Calendar",
        route: `/competition-calendar`,
        disabled: false,
        currentPage: true,
      },
    ];
    const [date, setDate] = useState<any>("");
    const [searchText, setSearchText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [filter, setfilter] = useState(false);
    const [filterData, setFilterData] = useState<any>({
      startDate: "",
      endDate: "",
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [monthChange, setMonthChange] = useState<any>(
      moment().format("MMM DD, YYYY")
    );
    const isTab = useMediaQuery("(min-width:768px)");
    const isLaptop = useMediaQuery("(min-width:1024px)");
    const isLaptopL = useMediaQuery("(min-width:1440px)");
    const is2K = useMediaQuery("(min-width:1535px)");
    const is3K = useMediaQuery("(min-width:1700px)");
    const isFullHD = useMediaQuery("(min-width:1920px)");
    const is4K = useMediaQuery("(min-width:2560px)");
    const is8K = useMediaQuery("(min-width:2500px)");

    const getPageContentHeight = () => {
      if (is4K) return "71vh";
      if (isFullHD) return "73vh";
      if (is3K) return "71vh";
      if (is2K) return "67vh";
      if (isLaptopL) return "67vh";
      if (isLaptop) return "67vh";
      if (isTab) return "67vh";
      return "67vh";
    };

    // to filter calendar items
    const [calendarItems, setCalendarItems] = useState([
      "tournaments",
      "trainings",
      "events",
      "reminders",
      "meetings",
    ]);
    const [selectedSport, setSelectedSport] = React.useState<any>([0]);
    const [isView, setView] = useState(false);

    const getRaceCalendarList = useSelector((state: any) => {
      return state.getRaceCalendarList;
    });

    const isEdit = useSelector((state: any) => {
      return state.ui.isUpdated;
    });

    useEffect(() => {
      if (!isEmpty(id) && isView) {
        const array = Object.keys(id);
        setDrawerTitle(id.section);
        const payload: any = {
          section: id.section,
          sportID: id.sportID,
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

    const handleCreateClick = () => {
      setOpenDialog(true);
    };

    const handleCreateItemSelect = (title: any) => {
      setDrawerTitle(title);
      setDrawerOpen(true);
      setOpenDialog(false);
    };
    const memoizedSelectedSport = useMemo(() => selectedSport, [selectedSport]);

    useEffect(() => {
      if (memoizedSelectedSport.length > 0) {
        const payload = {
          ...filterData,
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 100,
          sportID: memoizedSelectedSport.join(","),

          moduleView: "",
          moduleID: "0",
        };

        dispatch(getRaceCalendarAPI(payload));
      }
    }, [memoizedSelectedSport]);

    useEffect(() => {
      if (selectedSport && filter) {
        const payload = {
          ...filterData,
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 100,
          sportID: memoizedSelectedSport.join(","),

          moduleView: "",
          moduleID: "0",
        };

        dispatch(getRaceCalendarAPI(payload));
      }
    }, [memoizedSelectedSport, filter]);

    useEffect(() => {
      if (isEdit) {
        const payload = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 100,
          sportID: memoizedSelectedSport.join(","),

          moduleView: "",
          moduleID: "0",
        };
        dispatch(getRaceCalendarAPI(payload));
        dispatch(isUpdatedFunc(false));
      }
    }, [isEdit, memoizedSelectedSport]);

    const handleEditDrawerClose = () => {
      setDrawerOpen(false);
      setTimeout(() => {
        dispatch(clearGetRaceCalendarByIDState());
      }, 1000);
      setDate(null);
    };

    const getSportList = useSelector((state: any) => {
      return state.getSportList;
    });

    const handleSportSelect = (event: SelectChangeEvent<any>) => {
      const {
        target: { value },
      } = event;

      const selected = Array.isArray(value) ? value : [];

      const lastElement =
        selected.length > 0 ? selected[selected.length - 1] : null;
      if (lastElement !== 0) {
        const updatedArray = selected.filter((item) => item !== 0);
        setSelectedSport(updatedArray);
      } else if (selected.length > 1 && lastElement === 0) {
        //Keeping only the last element (0) and removing all others
        setSelectedSport([0]);
      } else {
        setSelectedSport(selected);
      }
    };

    useEffect(() => {
      if (isEmpty(selectedSport)) {
        setSelectedSport([0]);
        setLocalStorage("sport", selectedSport);
      }
    }, [selectedSport]);

    const getSportModify = [
      {
        sportID: 0,
        sportName: "All",
        categoryType: "All",
        sportProfile: <ScoreboardOutlinedIcon sx={{ color: "#008755" }} />,
      },
      ...(!isEmpty(getSportList.data) ? getSportList.data : []),
    ];

    return (
      <Box p={1}>
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
          selectedSport={memoizedSelectedSport}
        />
        <Box p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
        <Grid container mt={1}>
          <Grid item sm={12}>
            <Box className="bg-white" borderRadius={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display={"flex"} alignItems={"center"}>
                  <Typography
                    p={2}
                    className="table-list-header bukra-semi-bold"
                    sx={{
                      borderRight: "1px solid #DEE2ED",
                      flexGrow: 0,
                      width: "auto",
                      minWidth: 0,
                    }}
                  >
                    Competition Calendar
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginLeft={2}
                  >
                    <Typography className="text-capitalize bukra-semi-bold table-list-header">
                      Select Sports
                    </Typography>
                    {/* Dropdown at flex-start */}
                    <MultiSelect
                      value={selectedSport}
                      onChange={handleSportSelect}
                      options={getSportModify}
                      disable={false}
                    />
                  </Box>
                </Box>
                {/* Button at flex-end */}
                {checkAccess(USER_PERMISSION.CompetitionCalendarAdd) ? <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  sx={{
                    borderRadius: "0",
                    borderTopRightRadius: "4px",
                    height: "56px",
                    fontSize: "20px",
                    flexGrow: 0,
                    width: "auto",
                    minWidth: 0,
                    px: 2,
                  }}
                  endIcon={<AddIcon />}
                  onClick={handleCreateClick}
                >
                  Create
                </Button> : null}
              </Box >
            </Box >
          </Grid >
          <Grid item sm={12}>
            <Grid container borderTop={"1px solid #DEE2ED"}>
              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  overflowY: "auto",
                  height: getPageContentHeight(),
                }}
                className="padding-card-top"
              >
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
                    setDate={setDate}
                    editData={getRaceCalendarByID}
                    isView={isView}
                    setView={setView}
                    teamID={memoizedSelectedSport.join(",")}
                    setCalendarItems={setCalendarItems}
                    calendarItems={calendarItems}
                    calendarName={"competition-calendar"}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      </Box >
    );
  }

  export default Page;

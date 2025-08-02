"use client";
import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import moment from "moment";
import SubMenuLayout from "../layout";
import CustomButton from "@/components/buttons/CustomButton";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes, EventItem } from "@/interfaces/AppInterfaces";
import AppAddButton from "@/components/buttons/AppAddButton";
import SeasonCardView from "@/components/tournaments/seasonPlanner/seasonCardView";
import SlideSeasonPlanner from "./edit/slideSeason";
import SeasonCreateDialog from "@/components/dialogs/SeasonCreateDialog";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import FilterDateDialog from "@/components/calendar/dateFilters";
import { getRaceCalendarAPI } from "@/redux/slices/raceCalendar/getRaceCalendarListSlice";
import { useDispatch, useSelector } from "react-redux";
import { transformCalendarData } from "@/utils/helper";
import dayjs, { Dayjs } from "dayjs";
import { getRaceCalendarListDispatch } from "@/redux/store";

const SeasonList = () => {
  const router = useRouter();
  const [id, setID] = useState<any>(undefined);
  const [calendarData, setCalendarData] = useState<EventItem[]>([]);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const dispatch: getRaceCalendarListDispatch = useDispatch();
  const [date, setDate] = useState<any>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [module, setModule] = useState("View-season");
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filter, setfilter] = useState(false);
  const [filterData, setFilterData] = useState<any>({
      startDate: "",
      endDate: "",
    });
  const [monthChange, setMonthChange] = useState<any>(
      moment().format("MMM DD, YYYY")
    );
  const getRaceCalendarList = useSelector((state: any) => {
      return state.getRaceCalendarList;
    });

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
    
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Dashboard",
      route: `/dashboard`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/tournaments`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Commander's Shield",
      route: `/tournaments/commander`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Season Planner",
      route: `/tournaments/commander/seasons`,
      currentPage: true,
      disabled: false,
    },
  ];

  const seasonPlannerArray = [
    {
      id: 1,
      month: "January",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      }]
    },
    {
      id: 2,
      month: "February",
      data: [{
        id: 1,
        date: "25-04-2024 Fri",
        planName: "Football Champions",
        sport: "Football",
        athleteType: "Male",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 2,
        date: "29-04-2024 Thu",
        planName: "Karate Courses",
        sport: "Karate",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "cancelled"
      }]
    },
    {
      id: 3,
      month: "March",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Female",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "pending",
      }]
    },
    {
      id: 4,
      month: "April",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Football Champions",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "ongoing",
        sportsStatus: "live",
      }]
    },
    {
      id: 5,
      month: "May",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 2,
        date: "25-04-2024 Fri",
        planName: "Football Champions",
        sport: "Football",
        athleteType: "Male",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 3,
        date: "29-04-2024 Thu",
        planName: "Karate Courses",
        sport: "Karate",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "ongoing",
        sportsStatus: "live",
      },
      {
        id: 4,
        date: "29-04-2024 Thu",
        planName: "Karate Courses",
        sport: "Karate",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "cancelled"
      }]
    },
    {
      id: 6,
      month: "June",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "upcoming"
      }]
    },
    {
      id: 7,
      month: "July",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 2,
        date: "25-04-2024 Fri",
        planName: "Football Champions",
        sport: "Football",
        athleteType: "Male",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 3,
        date: "29-04-2024 Thu",
        planName: "Karate Courses",
        sport: "Karate",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "cancelled"
      },
      {
        id: 4,
        date: "25-04-2024 Fri",
        planName: "Football Champions",
        sport: "Football",
        athleteType: "Male",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 5,
        date: "29-04-2024 Thu",
        planName: "Karate Courses",
        sport: "Karate",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "cancelled"
      },
      {
        id: 6,
        date: "25-04-2024 Fri",
        planName: "Football Champions",
        sport: "Football",
        athleteType: "Male",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      },
      {
        id: 7,
        date: "29-04-2024 Thu",
        planName: "Karate Courses",
        sport: "Karate",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "cancelled"
      }]
    },
    {
      id: 8,
      month: "August",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      }]
    },
    {
      id: 9,
      month: "September",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      }]
    },
    {
      id: 10,
      month: "October",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      }]
    },
    {
      id: 11,
      month: "November",
      data: [{
        id: 1,
        date: "25-04-2024 Wed",
        planName: "Rapid Chess Tournaments",
        sport: "Chess",
        athleteType: "Both",
        location: "Dubai Police Officers Club",
        description: "Test",
        status: "completed"
      }]
    },
    {
      id: 12,
      month: "December",
      data: []
    }
  ]

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
    if (is2K) return "77vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "67vh";
    return "71vh";
  };

  const handleCreateClick = () => {
    // router.push("/tournaments/commander/seasons/add");
    setOpenDialog(true);
  };

  const handleCreateItemSelect = (title: any) => {
    router.push(`/tournaments/commander/seasons/${title}`);
    setOpenDialog(false);
  };
  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    setModule("View-season")
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setFilterDialogOpen(true);
    };
  
  const handleCloseFilterDialog = () => {
      setAnchorEl(null);
      setFilterDialogOpen(false);
    };

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

  return (
    <>
      {/* Component for calendar create menu popup */}
      <SeasonCreateDialog
        openDialog={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
        handleMenuSelect={handleCreateItemSelect}
      />
      {isOpen && isEditData && (
        <SlideSeasonPlanner
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
          module={module}
          setModule={setModule}
        />
      )}
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
            px: 1.5,
            py: 0,
            fontSize: "18px",
            height: "30px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => router.back()}
        />
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
                Activity Calendar
              </Typography>
              <Typography
                sx={{ flexGrow: 2 }}
                p={2}
                className="table-list-header bukra header-border-right"
              ></Typography>
              <ModuleSearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder={"Activity Name, Location"}
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
              <AppAddButton label="Create Activity" onClick={handleCreateClick} />
            </Box>
          </Box>

          <Box
            sx={{
              height: getPageContentHeight(),
              overflow: "scroll",
              paddingTop: 2,
              paddingLeft: 2,
              paddingRight: 2,
              paddingBottom: 10,
              cursor: "pointer",
            }}
            className="bg-white"
            borderRadius={1}
          >
            <SeasonCardView
              events={calendarData}
              setOpen={setOpenDialog}
              setID={setID}
              isEdit={handleEditData}
              filter={filter}
              setfilter={setfilter}
              setFilterData={setFilterData}
              monthChange={monthChange}
              setMonthChange={setMonthChange}
              setValue={setValue}
              value={value}
              setDate={setDate}
              setCalendarItems={setCalendarItems}
              calendarItems={calendarItems}
              calendarName={"master-plan"}
              seasonPlannerList={seasonPlannerArray}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
SeasonList.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default SeasonList;

// New feature branch
"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Alert, Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SlideDialog from "@/pages/teams/[teamID]/trainingPlans/edit/SlideDialog";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import isEmpty from "lodash/isEmpty";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import { useRouter } from "next/router";
import SubMenuLayout from "./layout";
import {
  clearListState,
  viewTrainingPlans,
} from "@/redux/slices/trainingPlans/TrainingPlansListSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm } from "@/utils/helper";
import TeamsTable from "../../../../components/trainingPlans/teamsTable";
import CalendarView from "../../../../components/trainingPlans/calendarView";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import {
  getDateObject,
  checkIsAfter,
  checkIsBeforeOrEqual,
  dateAddDays,
} from "@/utils/datetime";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/trainingPlans`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Training Plans",
      route: `/teams/${teamID}/trainingPlans`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const gettrainingPlansList = useSelector((state: any) => {
    return state.trainingPlansList;
  });
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
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

  const [excel, setExcel] = useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [monthChange, setMonthChange] = useState<any>(
    moment().format("MMM DD, YYYY")
  );
  const [selectedTab, setSelectedTab] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [selectedView, setSelectedView] = useState<"calendar" | "list" | null>(
    "calendar"
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = useState("");
  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };
  const storedFilters = localStorage.getItem(
    "trainingPlansTargetsSelectedFilters"
  );
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  useEffect(() => {
    const { view } = router.query;
    if (view === "calendar") {
      setSelectedView("calendar");
    } else if (view === "list") {
      setSelectedView("list");
    }
  }, [router.query]);

  const handleIconClick = (icon: "calendar" | "list") => {
    router.push({
      pathname: `/teams/${teamID}/trainingPlans`,
      query: { view: icon },
    });
  };

  useEffect(() => {
    if (selectedView === "calendar" && teamID) {
      const payload: any = {
        searchText: "",
        filteredBy:
          !isEmpty(filterData) && filterData.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(viewTrainingPlans({ url: "/GetTrainingPlanList", payload }));
    } else if (teamID) {
      const payload: any = {
        searchText: "",
        filteredBy:
          !isEmpty(filterData) && filterData.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(viewTrainingPlans({ url: "/GetTrainingPlanList", payload }));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [teamID, selectedView, page, rowsPerPage, filterData]);

  useEffect(() => {
    const payload: any = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 1,
      paginationCount: 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(viewTrainingPlans({ url: "/GetTrainingPlanList", payload }));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const transformedData: any[] = [];

  if (
    gettrainingPlansList &&
    gettrainingPlansList.data &&
    gettrainingPlansList.data.length > 0
  ) {
    gettrainingPlansList.data.forEach((item: any) => {
      const startDate = getDateObject(item.trainingStartDate, "DD/MM/YYYY");
      const endDate = getDateObject(item.trainingEndDate, "DD/MM/YYYY");

      if (
        checkIsAfter(item.trainingStartDate, item.trainingEndDate, "DD/MM/YYYY")
      ) {
        for (
          let date = startDate;
          checkIsBeforeOrEqual(date, endDate);
          date = dateAddDays(date, 1)
        ) {
          transformedData.push({
            title: `${moment(item.trainingStartTime, "hh:mm A").format(
              "hh:mm"
            )} ${item.trainingPlan}`,
            start: date.format("YYYY-MM-DD"),
            end: date.format("YYYY-MM-DD"),
            backgroundColor: "#F1EB9C",
            textColor: "#000000",
            trainingID: item.trainingPlanID,
          });
        }
      }
    });
  }

  const downloadtrainingPlansExcel = async () => {
    try {
      setExcel(true);
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportTrainingPlan`,
        {
          sportID: Number(teamID),
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "trainingPlansList.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) {
        link.parentNode.removeChild(link);
        setExcel(false);
      }
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  const filteredList = filterBySearchTerm(
    gettrainingPlansList.data,
    searchText,
    ["trainingPlan", "trainingType", "assignedCoach"]
  );

  function getCalenderView(): string | undefined {
    if (selectedTab == 0) return "timeGridDay";
    if (selectedTab == 1) return "timeGridWeek";
    if (selectedTab == 2) return "dayGridMonth";
    return "";
  }

  return (
    <Box sx={{ mt: { xs: 1, sm: 0 } }}>
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
              whiteSpace: "nowrap",
            }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            Training Plans
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-med header-border-right"
          ></Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Training Plan, Coach, etc..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.TrainingPlanAdd) ? (
            <AppAddButton
              label="Create Training Plans"
              onClick={() => router.push(`/teams/${teamID}/trainingPlans/add`)}
            />
          ) : null}
          {isOpen && isEditData && (
            <SlideDialog
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
              module={"trainingPlan"}
              setisEditData={setisEditData}
            />
          )}
        </Box>

        {selectedView === "list" ? (
          <Box height={getPageContentHeight()} sx={{ overflowY: "scroll" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              p={1}
              py={2}
              pb={2}
              flexDirection={"row"}
              alignItems={"center"}
              ml={0.5}
            >
              {checkAccess(USER_PERMISSION.TrainingPlanView) ? (
                <Button
                  variant="outlined"
                  className="text-capitalize dubai-med"
                  sx={{ height: "44px", fontSize: "18px" }}
                  onClick={() =>
                    router.push(
                      `/teams/${teamID}/trainingPlans/trainingTemplate`
                    )
                  }
                >
                  Training Templates
                </Button>
              ) : (
                <Box></Box>
              )}
              <Box display="flex" alignItems="center">
                {selectedView === "list" ? (
                  <Button
                    variant="outlined"
                    className="text-capitalize dubai-med export-button"
                    sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
                    startIcon={<XlsSVG width="25px" height="25px" />}
                    disabled={
                      (searchText !== "" && selectedView !== "list") || excel
                    }
                    onClick={downloadtrainingPlansExcel}
                  >
                    Export to Excel
                  </Button>
                ) : null}
                <CustomIconButton
                  icon={CalendarMonthIcon}
                  isSelected={selectedView !== "list"}
                  onClick={() => handleIconClick("calendar")}
                  title="Calendar view"
                />
                <CustomIconButton
                  icon={TableViewIcon}
                  isSelected={selectedView === "list"}
                  onClick={() => handleIconClick("list")}
                  title="Table view"
                  margin={1}
                />
              </Box>
            </Box>
            {gettrainingPlansList && gettrainingPlansList.code !== 500 ? (
              <Box p={2} pt={0}>
                {gettrainingPlansList && (
                  <TeamsTable
                    data={filteredList || []}
                    isEdit={handleEditData}
                    teamId={teamID}
                    setPage={setPage}
                    page={page}
                    setRowsPerPage={setRowsPerPage}
                    rowsPerPage={rowsPerPage}
                    TrainingPlanslist={gettrainingPlansList}
                  />
                )}
              </Box>
            ) : gettrainingPlansList && gettrainingPlansList?.code === 500 ? (
              <Alert className="dubai-med" severity="error">
                Something went wrong
              </Alert>
            ) : (
              <Box p={3}>
                <Alert className="dubai-med" severity="info">
                  No record(s) found
                </Alert>
              </Box>
            )}
          </Box>
        ) : (
          <CalendarView
            events={transformedData}
            isEdit={handleEditData}
            calendarView={getCalenderView()}
            monthChange={monthChange}
            setMonthChange={setMonthChange}
            setValue={setValue}
            value={value}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            handleIconClick={handleIconClick}
            selectedView={selectedView}
          />
        )}
      </Box>
    </Box>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

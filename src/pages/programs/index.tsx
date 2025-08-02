//new feature branch
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CardViewIcon from "@mui/icons-material/GridView";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import XlsSVG from "../../../public/XlsSVG.svg";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import ProgramItemCard from "@/components/programs/ProgramItemCard";
import SlideFullDrawer from "./edit/slideFullDrawer";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProgramListState,
  listProgram,
} from "@/redux/slices/program/ProgramListSlice";
import React from "react";
import CalendarView from "@/components/programs/calendarView";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { setLocalStorage, tranformProgramCalendarData } from "@/utils/helper";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import ResultsGridViewSkeleton from "@/components/skeleton/ResultsGridViewSkeleton";
import { USER_PERMISSION } from "@/utils/constants";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { debounce } from "lodash";
import PaginationComponent from "@/components/PaginationComponent";

const debounceTime = 500;

const ProgramListPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedView, setSelectedView] = useState<
    "gridview" | "calendarview" | null
  >("gridview");
  const [selectedChip, setSelectedChip] = useState<string>("ongoing");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedTab, setSelectedTab] = useState(2);
  const [monthChange, setMonthChange] = useState<any>(
    moment().format("MMM DD, YYYY")
  );
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const dispatch: AppDispatch = useDispatch();
  const [calendarData, setCalendarData] = useState<any>([]);

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
    if (isFullHD) return "65vh";
    if (is3K) return "61vh";
    if (is2K) return "59vh";
    if (isLaptopL) return "64vh";
    if (isLaptop) return "64vh";
    if (isTab) return "64vh";
    return "59vh";
  };

  const getChipStyles = (label: string) => ({
    color: selectedChip === label ? "#EFFAF9" : "#008755",
    background: selectedChip === label ? "#008755" : "#FFFFFF",
    "&:hover": {
      background: selectedChip === label ? "#008755" : "#FFFFFF",
    },
    fontWeight: "500",
    fontSize: "16px",
    height: "37px",
    border: "1px solid #008755",
    borderRadius: "33px",
    width: "105px",
  });

  const getlistProgram = useSelector((state: any) => {
    return state.listProgram;
  });

  const handleChipClick = (label: string) => {
    setSelectedChip(label);
    setLocalStorage("chip", label || "ongoing");
  };

  const handleIconClick = useCallback(
    (view: any) => {
      if (selectedView !== view) {
        setSelectedView(view);
      }
    },
    [selectedView]
  );


  const loadPrograms = (payload: any) => {
    dispatch(listProgram({ url: "/GetProgramsList", payload }));
  }

  const debounceLoadPrograms = debounce(
    (payload: any) => loadPrograms(payload),
    debounceTime
  );

  useEffect(() => {
    const selectedMonth = dayjs(monthChange);
    const startDate = dayjs(selectedMonth.startOf("month")).format("DD/MM/YYYY");
    const endDate = dayjs(selectedMonth.endOf("month")).format("DD/MM/YYYY");
    if (selectedView === "gridview") {
      const payload = {
        searchText: searchText,
        filteredBy: selectedChip,
        paginationIndex: page,
        paginationCount: rowsPerPage,
      };
      debounceLoadPrograms(payload);
    } else {
      const payload = {
        searchText: searchText,
        filteredBy: selectedChip,
        paginationIndex: 0,
        paginationCount: 0,
        startDate: startDate,
        endDate: endDate
      };
      debounceLoadPrograms(payload);
    }
    return () => {
      debounceLoadPrograms.cancel();
      dispatch(clearProgramListState());
    };
  }, [selectedView, searchText, page, rowsPerPage, selectedChip, monthChange]);

  useEffect(() => {
    setPage(1);
    setRowsPerPage(10);
  }, [searchText])

  const downloadProgramsExcel = async () => {
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportProgramList`,
        {
          searchText: "",
          filteredBy: selectedChip,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Program.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Programs",
      route: `/programs`,
      currentPage: true,
      disabled: false,
    },
  ];

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleViewData = (isview: any) => {
    router.push(`/programs/view/${isview}`);
  };

  useEffect(() => {
    if (
      getlistProgram &&
      getlistProgram.data &&
      getlistProgram.data.length > 0
    ) {
      setCalendarData(tranformProgramCalendarData(getlistProgram.data));
    } else {
      setCalendarData([]);
    }
  }, [getlistProgram]);

  function getCalenderView(): string | undefined {
    if (selectedTab == 0) return "timeGridDay";
    if (selectedTab == 1) return "timeGridWeek";
    if (selectedTab == 2) return "dayGridMonth";
    return "";
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  return (
    <Box p={1}>
      {isOpen && (
        <SlideFullDrawer
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          module={"trainingCamp"}
          isEditData={isEditData}
        />
      )}
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            Programs
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Program name & objective."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.ProgramsAdd) ? (
            <AppAddButton
              label="Create Program"
              onClick={() => router.push(`/programs/create`)}
            />
          ) : null}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between" // Ensure items are spaced between flex-start and flex-end
          p={1}
          py={2}
          pb={selectedView === "gridview" ? 0 : 2}
          flexDirection="row"
          alignItems="center"
        >
          {/* Chips at Flex-Start */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Select program status">
              <Chip
                className="dubai-med"
                label="Ongoing"
                sx={getChipStyles("ongoing")}
                onClick={() => handleChipClick("ongoing")}
              />
            </Tooltip>
            <Tooltip title="Select program status">
              <Chip
                className="dubai-med"
                label="Upcoming"
                sx={getChipStyles("upcoming")}
                onClick={() => handleChipClick("upcoming")}
              />
            </Tooltip>
            <Tooltip title="Select program status">
              <Chip
                className="dubai-med"
                label={
                  <Box display="flex" alignItems="center">
                    History
                    <HistoryOutlinedIcon
                      sx={{ ml: 0.5, width: "18px", height: "18px" }}
                    />
                  </Box>
                }
                sx={getChipStyles("history")}
                onClick={() => handleChipClick("history")}
              />
            </Tooltip>
          </Stack>

          {/* Spacer for CustomIconButtons at Flex-End */}
          <Box display="flex" alignItems="center">
            <Button
              variant="outlined"
              className="text-capitalize dubai-med export-button"
              sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
              endIcon={<XlsSVG width="25px" height="25px" />}
              disabled={searchText !== "" && selectedView !== "calendarview"}
              onClick={downloadProgramsExcel}
            >
              Export to Excel
            </Button>

            <CustomIconButton
              icon={CardViewIcon}
              isSelected={selectedView === "gridview"}
              onClick={() => handleIconClick("gridview")}
              title="Card view"
            />
            <CustomIconButton
              icon={CalendarMonthIcon}
              isSelected={selectedView === "calendarview"}
              onClick={() => handleIconClick("calendarview")}
              title="Calendar view"
            />
          </Box>
        </Box>

        {getlistProgram && !getlistProgram.loading && getlistProgram.code == 500 ? (
          <Box
            p={3}
            sx={{
              overflowY: "scroll",
              height: getPageContentHeight(),
            }}
          >
            <Alert className="dubai-med" severity="error">
              Something went wrong
            </Alert>
          </Box>
        ) : null}

        {getlistProgram &&
          !getlistProgram.loading &&
          getlistProgram.code !== 500 &&
          getlistProgram?.data?.length === 0 &&
          selectedView === "gridview" ? (
          <Box
            p={3}
            sx={{
              overflowY: "scroll",
              height: getPageContentHeight(),
            }}
          >
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Box>
        ) : null}

        {selectedView === "gridview" &&
          getlistProgram &&
          getlistProgram.loading ? (
          <Box
            p={2}
            pt={2}
            sx={{
              overflowY: "scroll",
              height: getPageContentHeight(),
            }}
          >
            <ResultsGridViewSkeleton />
          </Box>
        ) : null}

        {/* Program grid view */}
        {getlistProgram &&
          getlistProgram.code !== 500 &&
          getlistProgram?.data?.length > 0 &&
          selectedView === "gridview" &&
          !getlistProgram.loading ? (
          <Box pt={2}>
            <ProgramItemCard
              programData={getlistProgram.data || []}
              onViewClicked={handleViewData}
              onEditClicked={handleEditData}
              isLoading={getlistProgram.loading}
            />
          </Box>
        ) : null}

        {/* Program grid view pagination */}
        {getlistProgram &&
          getlistProgram.code === 200 &&
          selectedView === "gridview" &&
          !getlistProgram.loading ? (
          <Box>
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              startIndex={startIndex}
              endIndex={
                endIndex > getlistProgram?.totalRecords
                  ? getlistProgram?.totalRecords
                  : endIndex
              }
              totalItems={getlistProgram?.totalRecords}
            />
          </Box>
        ) : null}

        {/* Program calendar view */}
        {getlistProgram &&
          getlistProgram.code !== 500 &&
          // getlistProgram?.data?.length > 0 &&
          selectedView === "calendarview" ? (
          <Box p={2}>
            <CalendarView
              events={calendarData}
              isEdit={handleEditData}
              calendarView={getCalenderView()}
              monthChange={monthChange}
              setMonthChange={setMonthChange}
              setValue={setValue}
              value={value}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              CustomIconButton={CustomIconButton}
              handleIconClick={handleIconClick}
              selectedIcon={selectedView}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default ProgramListPage;

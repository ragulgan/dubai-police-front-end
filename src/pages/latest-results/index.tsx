// New feature branch
"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import MultiSelect from "@/components/Fields/MultiSelect";
import {
  Alert,
  Box,
  Button,
  Grid,
  InputBase,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../public/svg/TableView.svg";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectChangeEvent } from "@mui/material";
import { isEmpty } from "lodash";
import CardListResults from "@/components/results/CardListResults";
import CardViewResults from "@/components/results/CardViewResults";
import { AppDispatch } from "@/redux/store";
import { viewResults } from "@/redux/slices/results/ResultListSlice";
import { filterBySearchTerm } from "@/utils/helper";
import { useRouter } from "next/router";
import SlideResultDialog from "./edit/SlideDialog";
import React from "react";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AppAlert from "@/components/alert/AppAlert";
import ResultsGridViewSkeleton from "@/components/skeleton/ResultsGridViewSkeleton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import AppAddButton from "@/components/buttons/AppAddButton";
import { usePathname } from "next/navigation";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const router = useRouter();
  const currentNav = usePathname();
  const [selectedView, setSelectedView] = useState<"grid" | "list" | null>(
    "grid"
  );
  const [selectedSport, setSelectedSport] = useState<any>([0]);
  const [searchText, setSearchText] = useState("");
  const storedFilters = localStorage.getItem("athletesTargetsSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [resultSportId, setResultSportId] = useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return currentNav === "/latest-results" ? "66vh" : "71vh";
    if (isFullHD) return currentNav === "/latest-results" ? "69vh" : "71vh";
    if (is3K) return currentNav === "/latest-results" ? "66vh" : "71vh";
    if (is2K) return currentNav === "/latest-results" ? "62vh" : "67vh";
    if (isLaptopL) return currentNav === "/latest-results" ? "66vh" : "72vh";
    if (isLaptop) return currentNav === "/latest-results" ? "66vh" : "72vh";
    if (isTab) return currentNav === "/latest-results" ? "66vh" : "72vh";
    return "64vh";
  };

  const dispatch: AppDispatch = useDispatch();
  const getResultsList = useSelector((state: any) => {
    return state.getResultsList;
  });

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Latest Results",
      route: `/latest-results`,
      currentPage: true,
      disabled: false,
    },
  ];

  const handleToggleView = useCallback(
    (view: "grid" | "list" | null) => {
      if (selectedView !== view) {
        setSelectedView(view);
      }
    },
    [selectedView]
  );

  const filteredList = filterBySearchTerm(getResultsList.data, searchText, [
    "eventName",
    "awayTeamName",
    "awayTeamValue",
    "categoryRanking",
    "discipline",
    "eventLocation",
    "homeTeamValue",
    "resultType",
    "selectWinner",
  ]);

  const memoizedSelectedSport = useMemo(() => selectedSport, [selectedSport]);
  const sportId = Array.isArray(memoizedSelectedSport)
    ? memoizedSelectedSport.join(",")
    : memoizedSelectedSport;

  useEffect(() => {
    if (memoizedSelectedSport.length > 0) {
      const payload = {
        ...filterData,
        searchText: "",
        filteredBy:
          !isEmpty(filterData) && filterData.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex: 0,
        paginationCount: 100,
        sportID: memoizedSelectedSport.join(","),
      };

      dispatch(viewResults({ url: "/GetResultsList", payload }));
    }
  }, [memoizedSelectedSport]);

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

  const handleEditData = (isEdit: any, sportId?: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
    setResultSportId(sportId);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  return (
    <Box p={1} sx={{ display: "flex", flexDirection: "column" }}>
      {isOpen && isEditData && (
        <SlideResultDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={isEditData}
          module={"Result"}
          setisEditData={setisEditData}
          sportId={resultSportId}
        />
      )}
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>

      {/* main content */}
      <Box
        mt={1}
        sx={{
          flexGrow: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: 1,
        }}
      >
        <Grid container spacing={0.5} mb={0.1}>
          <Grid item sm={12}>
            <Box className="bg-white" borderRadius={1} p={0}>
              <Box display={"flex"}>
                <Typography
                  sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
                  p={2}
                  className="table-list-header bukra-semi-bold header-border-right"
                >
                  Results
                </Typography>
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                  }}
                  className="table-count-header dubai-regular header-border-right"
                >
                  <Typography
                    className="text-capitalize bukra table-list-header"
                    sx={{ pr: 2 }}
                  >
                    Select Sports
                  </Typography>
                  <MultiSelect
                    value={selectedSport}
                    onChange={handleSportSelect}
                    options={getSportModify}
                    disable={false}
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  sx={{ flexGrow: 0, width: "auto", minWidth: 0, px: 2 }}
                  flexDirection={"row"}
                  alignItems={"center"}
                  className="table-list-header bukra header-border-right"
                >
                  <CustomIconButton
                    icon={CardViewIcon}
                    isSelected={selectedView === "grid"}
                    onClick={() => handleToggleView("grid")}
                    title={"Card view"}
                  />
                  <CustomIconButton
                    icon={TableViewIcon}
                    isSelected={selectedView === "list"}
                    onClick={() => handleToggleView("list")}
                    margin={0}
                    title={"Single Card view"}
                  />
                </Box>
                <ModuleSearchInput
                  searchText={searchText}
                  setSearchText={setSearchText}
                  placeholder={"Search by Event Name, etc..."}
                  flexGrow={{ flexGrow: 0.25 }}
                />
                {checkAccess(USER_PERMISSION.LatestResultsAdd) ? (
                  <AppAddButton
                    label="Create Result"
                    onClick={() =>
                      router.push(`/latest-results/add?sportId=${sportId}`)
                    }
                  />
                ) : null}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {getResultsList &&
        !getResultsList.loading &&
        getResultsList.code == 500 ? (
          <Box p={2} pt={2}>
            <AppAlert type="error" message="Unable to load latest results." />
          </Box>
        ) : null}

        {getResultsList &&
        !getResultsList.loading &&
        getResultsList.code === 200 &&
        getResultsList.data &&
        getResultsList.data.length < 1 ? (
          <Box p={2} pt={2}>
            <AppAlert type="info" message="Latest results not found." />
          </Box>
        ) : null}

        {selectedView === "list" &&
        getResultsList &&
        !getResultsList.loading &&
        getResultsList.code === 200 &&
        getResultsList.data &&
        getResultsList.data.length > 0 ? (
          <Box p={2} pt={2}>
            <CardListResults
              data={filteredList || []}
              isLoading={getResultsList.loading}
              sportId={memoizedSelectedSport.join(",")}
              isEdit={handleEditData}
              setPage={setPage}
              page={page}
              setRowsPerPage={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              module="latest-result"
            />
          </Box>
        ) : null}

        {selectedView === "grid" && getResultsList && getResultsList.loading ? (
          <Box
            p={2}
            pt={2}
            sx={{
              overflowY: "auto",
              height: getPageContentHeight(),
            }}
          >
            <ResultsGridViewSkeleton />
          </Box>
        ) : null}

        {selectedView === "grid" &&
        getResultsList &&
        !getResultsList.loading &&
        getResultsList.code === 200 &&
        getResultsList.data &&
        getResultsList.data.length > 0 ? (
          <Box p={2} pt={2}>
            <CardViewResults
              data={filteredList || []}
              isLoading={getResultsList.loading}
              sportId={memoizedSelectedSport.join(",")}
              isEdit={handleEditData}
              module="latest-result"
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default Page;

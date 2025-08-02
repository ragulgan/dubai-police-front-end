// new branch
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Box,
  Button,
  InputBase,
  Paper,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AppAddButton from "@/components/buttons/AppAddButton";
import SearchIcon from "@mui/icons-material/Search";
import router from "next/router";
import FitnessTabContent from "@/components/fitness-and-nutrition/FitnessTabContent";
import {
  viewTestAndMedicalChecks,
  clearTestAndMedicalChecksListState,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { debounce, isEmpty } from "lodash";
import FitnessSlideDialog from "./edit/FitnessSlideDialog";
import { clearTestAndMedicalChecksEditState } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { listNutrition } from "@/redux/slices/nutrition/NutritionListSlice";
import NutritionTabContent from "@/components/fitness-and-nutrition/NutritionTabContent";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import FilterDialog from "@/components/FilterDialog";
import FilterDateDialog from "@/components/calendar/dateFilters";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import MultiSelect from "@/components/Fields/MultiSelect";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useRouter } from "next/router";

const debounceTime = 500;

function Page() {
  const router = useRouter();
  const query = router?.query ?? {};
  const module = query.module ?? "fitness";
  const pageView = query.pageView ?? "list";
  const dispatch: AppDispatch = useDispatch();
  const getFitnessListData = useSelector(
    (state: RootState) => state.getTestAndMedicalCheckssList
  );
  const getlistNutrition = useSelector((state: any) => {
    return state.listNutrition;
  });
  const [currentTab, setCurrentTab] = React.useState<"fitness" | "nutrition">(
    "fitness"
  );
  const [searchText, setSearchText] = React.useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const getFitnessData = getFitnessListData?.data;
  const testType: string = "fitness";
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isEditSportId, setIsEditSportId] = useState(null);
  const mobile = useMediaQuery("(max-width:768px)");
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight = () => {
    if (is4K) return "69.5vh";
    if (isFullHD) return "73.5vh";
    if (is3K) return "69.5vh";
    if (is2K) return "66.5vh";
    if (isLaptopL) return "69.5vh";
    if (isLaptop) return "69.5vh";
    if (isTab) return "65.5vh";
    if (mobile) return "100vh";
    return "65.5vh";
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState<any[]>([]);
  const [filter, setfilter] = useState(false);
  const [selectedSport, setSelectedSport] = React.useState<any>([0]);

  const [filterNutritionData, setFilterNutritionData] = useState<any>({
    startDate: "",
    endDate: "",
  });

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Fitness & Nutrition",
      route: `/fitness-and-nutrition`,
      currentPage: true,
      disabled: false,
    },
  ];

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  useEffect(() => {
    if (isEmpty(selectedSport)) {
      setSelectedSport([0]);
    }
  }, [selectedSport]);

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
      setSelectedSport([0]);
    } else {
      setSelectedSport(selected);
    }
  };

  const getSportModify = [
    {
      sportID: 0,
      sportName: "All",
      categoryType: "All",
      sportProfile: <ScoreboardOutlinedIcon sx={{ color: "#008755" }} />,
    },
    ...(!isEmpty(getSportList.data) ? getSportList.data : []),
  ];

  const memoizedSelectedSport = useMemo(() => selectedSport, [selectedSport]);

  useEffect(() => {
    if (module) {
      setCurrentTab(module === "nutrition" ? "nutrition" : "fitness");
      setPage(1);
    }
  }, [module]);

  useEffect(() => {
    if (module === "nutrition") {
      setFilterNutritionData({ startDate: "", endDate: "" });
    }
  }, [module]);

  const handleTabSelect = (value: "fitness" | "nutrition") => {
    if (value === "fitness") {
      router.push(`/fitness-and-nutrition?module=${value}`);
    } else {
      router.push(
        `/fitness-and-nutrition?module=${value}&pageView=${
          pageView ? pageView : "gridview"
        }`
      );
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
  };

  const getFitnessList = () => {
    const fitnessListPayload: any = {
      sportID: memoizedSelectedSport.join(","),
      section: "fitness",
      searchText: debouncedSearchText !== "" ? debouncedSearchText : "",
      filteredBy:
        Array.isArray(filterData) && filterData.length > 0
          ? filterData.join(",")
          : "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
    };

    dispatch(
      viewTestAndMedicalChecks({
        url: "/GetTestAndMedicalCheckstList",
        payload: fitnessListPayload,
      })
    );
  };

  const getNutritionList = () => {
    const nutritionListPayload: any = {
      searchText: debouncedSearchText !== "" ? debouncedSearchText : "",
      filteredBy: "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
      sportID: memoizedSelectedSport.join(","),

      startDate: filterNutritionData.startDate
        ? filterNutritionData.startDate
        : "",
      endDate: filterNutritionData.endDate ? filterNutritionData.endDate : "",
    };
    dispatch(
      listNutrition({ url: "/GetNutritionList", payload: nutritionListPayload })
    );
  };

  const debounceSearch = debounce((value) => {
    setDebouncedSearchText(value);
  }, debounceTime);

  useEffect(() => {
    debounceSearch(searchText);
    return debounceSearch.cancel;
  }, [searchText]);

  useEffect(() => {
    if (currentTab === "fitness") {
      getFitnessList();
    } else {
      getNutritionList();
    }
  }, [
    currentTab,
    page,
    rowsPerPage,
    debouncedSearchText,
    filterData,
    filterNutritionData,
    memoizedSelectedSport,
  ]);

  const handleEditData = (isEdit: any, sportID: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
    setIsEditSportId(sportID);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    dispatch(clearTestAndMedicalChecksEditState());
  };

  return (
    <>
      {isOpen && isEditData && (
        <FitnessSlideDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={isEditData}
          module={"fitness"}
          setisEditData={setisEditData}
          testType={testType}
          isEditSportId={isEditSportId}
        />
      )}
      <Box p={1}>
        <Box p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
        <Box mt={1} className="bg-white" borderRadius={1}>
          <Box display={"flex"}>
            <Button
              sx={{
                flexGrow: 0,
                width: "auto",
                minWidth: 0,
                px: 2,
                border: 0,
                borderRadius: 0,
                boxShadow: "none",
                fontSize: "16px",
                borderTopLeftRadius: "4px",
              }}
              className="bukra header-border-right text-capitalize"
              onClick={() => handleTabSelect("fitness")}
              variant={currentTab === "fitness" ? "contained" : "text"}
            >
              Fitness
            </Button>
            <Button
              sx={{
                flexGrow: 0,
                width: "auto",
                minWidth: 0,
                px: 2,
                border: 0,
                borderRadius: 0,
                boxShadow: "none",
                fontSize: "16px",
              }}
              className="bukra header-border-right text-capitalize"
              onClick={() => handleTabSelect("nutrition")}
              variant={currentTab === "nutrition" ? "contained" : "text"}
            >
              Nutrition
            </Button>
            <Typography
              p={2}
              width="95px"
              className="table-count-header dubai-regular header-border-right"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {currentTab === "fitness"
                ? getFitnessListData?.totalRecords || 0
                : getlistNutrition?.totalRecords || 0}{" "}
              Total
            </Typography>
            <Box
              display="flex"
              flexGrow={{ flexGrow: 1 }}
              className="header-border-right"
              sx={{ alignItems: "center" }}
            >
              <Typography
                className="text-capitalize bukra-semi-bold table-list-header"
                sx={{
                  paddingLeft: "10px",
                  paddingTop: "5px",
                  whiteSpace: "nowrap",
                }}
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
            <ModuleSearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder={"Search by Name..."}
              flexGrow={{ flexGrow: 0.25 }}
            />
            {currentTab === "nutrition" && (
              <>
                <ModuleFilterButton handleFilterClick={handleFilterClick} />
                <FilterDateDialog
                  anchorEl={anchorEl}
                  open={filterDialogOpen}
                  onClose={handleCloseFilterDialog}
                  setFilterData={setFilterNutritionData}
                  filterData={filterNutritionData}
                  setfilter={setfilter}
                />
              </>
            )}
            {currentTab === "fitness" && (
              <>
                <ModuleFilterButton handleFilterClick={handleFilterClick} />
                <FilterDialog
                  anchorEl={anchorEl}
                  options={["fitToPlay", "notFit", "recovering", "injured"]}
                  open={filterDialogOpen}
                  onClose={handleCloseFilterDialog}
                  onApply={handleApplyFilters}
                  localStorageKey="fitnessSelectedFilters"
                  setPage={setPage}
                  setRowsPerPage={setRowsPerPage}
                />
                {checkAccess(USER_PERMISSION.FitnessNutritionAdd) ? (
                  <AppAddButton
                    label="Create Fitness"
                    onClick={() =>
                      router.push("/fitness-and-nutrition/add/fitness")
                    }
                    sx={{
                      px: { xs: "40px", sm: "16px" },
                      py: { xs: "40px", sm: "16px" },
                    }}
                  />
                ) : null}
              </>
            )}
          </Box>
          <Box
            className="bg-white"
            borderRadius={1}
            sx={{
              width: "100%",
              height: getPageContentHeight(),
              overflowY: "scroll",
            }}
          >
            {/*  Fitness Tab*/}
            {currentTab === "fitness" ? (
              <FitnessTabContent
                isEdit={handleEditData}
                tabValue={currentTab}
                data={getFitnessData || []}
                getFitnessListData={getFitnessListData}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                testType={testType}
              />
            ) : null}

            {currentTab === "nutrition" ? (
              <NutritionTabContent
                listNutritionData={getlistNutrition}
                tabValue={currentTab}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                pageView={pageView}
                module={module}
                memoizedSelectedSport={memoizedSelectedSport}
                debouncedSearchText={debouncedSearchText}
                filterNutritionData={filterNutritionData}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Page;

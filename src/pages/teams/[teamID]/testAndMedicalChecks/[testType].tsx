"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import TestAndMedicalsTestList from "@/components/testAndMedicalChecks/ListTestAndMedical";
import {
  clearTestAndMedicalChecksListState,
  viewTestAndMedicalChecks,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksListSlice";
import TestAndMedicalsSlideResultDialog from "./edit/TestAndMedicalsSlideDialog";
import { clearTestAndMedicalChecksEditState } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { filterBySearch, getTestName } from "@/utils/helper";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import { checkAccess } from "@/utils/acessscheck";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import { USER_ERROR, USER_PERMISSION } from "@/utils/constants";
import _ from "lodash";

function Page() {
  const router = useRouter();
  const { teamID, testType } = router.query;
  const getTestPathName = () => {
    return getTestName(String(testType));
  };
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
    if (is2K) return "66.5vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "67vh";
    return "67vh";
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/trainingCamp`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Test & Medical Checks",
      route: `/teams/${teamID}/testAndMedicalChecks`,
      currentPage: false,
      disabled: false,
    },
    {
      title: `${getTestPathName()}`,
      route: `/teams/${teamID}/testAndMedicalChecks/${testType}`,
      currentPage: true,
      disabled: false,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const storedFilters = localStorage.getItem("goals&targetsSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const dispatch: AppDispatch = useDispatch();
  const getTestAndMedicalCheckssListData = useSelector(
    (state: RootState) => state.getTestAndMedicalCheckssList
  );

  useEffect(() => {
    const payload = {
      sportID: Number(teamID),
      section: testType,
      searchText: searchText !== "" ? searchText : "",
      filteredBy: Array.isArray(filterData) ? filterData.join(",") : "",
      paginationIndex: 0,
      paginationCount: 0,
    };
    if (teamID) {
      dispatch(
        viewTestAndMedicalChecks({
          url: "/GetTestAndMedicalCheckstList",
          payload,
        })
      );
    }
    return () => {
      dispatch(clearTestAndMedicalChecksListState());
    };
  }, [teamID, page, rowsPerPage, filterData]);

  useEffect(() => {
    return () => {
      dispatch(clearTestAndMedicalChecksEditState());
    };
  }, []);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    dispatch(clearTestAndMedicalChecksEditState());
  };

  const filteredList = filterBySearch(
    getTestAndMedicalCheckssListData.data,
    searchText,
    ["athleteFirstName", "athleteSurName", "athleteMiddleName", "status"]
  );

  const handleApplyFilters = (selectedFilters: any) => {
    // Here you can apply your filtering logic
    setFilterData(selectedFilters);
  };

  const getTotal = () => {
    if (
      !isEmpty(getTestAndMedicalCheckssListData) &&
      searchText === "" &&
      isEmpty(filterData) &&
      getTestAndMedicalCheckssListData?.data?.length > 0
    )
      return getTestAndMedicalCheckssListData?.data?.length;
    if (!isEmpty(getTestAndMedicalCheckssListData) && !isEmpty(filteredList))
      return filteredList.length;
    return 0;
  };

  return (
    <>
      {isOpen && isEditData && (
        <TestAndMedicalsSlideResultDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={isEditData}
          module={"Result"}
          setisEditData={setisEditData}
          testType={testType}
        />
      )}
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
            px: 1.5,
            py: 0,
            fontSize: "18px",
            fontWeight: 500,
            height: "30px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => {
            router.push(`/teams/${teamID}/testAndMedicalChecks`);
          }}
        />
      </Box>
      <Grid container mt={1}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box display={"flex"}>
              <Typography
                sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
                p={2}
                className="table-list-header bukra-semi-bold header-border-right"
              >
                All Athletes
              </Typography>
              <Typography
                p={2}
                sx={{ flexGrow: 2 }}
                className="table-count-header dubai-med header-border-right"
              >
                {`${getTotal()} Athletes`}
              </Typography>
              <ModuleSearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder={"Search by Name, etc..."}
                flexGrow={{ flexGrow: 0.25 }}
              />
              <ModuleFilterButton
                handleFilterClick={handleFilterClick}
                text={"Filter by test status"}
              />
              <FilterDialog
                anchorEl={anchorEl}
                options={["fitToPlay", "notFit", "recovering", "injured"]}
                open={filterDialogOpen}
                onClose={handleCloseFilterDialog}
                onApply={handleApplyFilters}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                localStorageKey="athletesTargetsSelectedFilters"
              />
              {checkAccess(USER_PERMISSION.TestMedicalChecksAdd) && (
                <AppAddButton
                  label="Create Test"
                  onClick={() =>
                    router.push(
                      `/teams/${teamID}/testAndMedicalChecks/add/${testType}`
                    )
                  }
                />
              )}
            </Box>
            {/* Loader section */}
            {getTestAndMedicalCheckssListData &&
              getTestAndMedicalCheckssListData?.loading ? (
              <Box
                height={getPageContentHeight()}
                p={2}
                display={"grid"}
                sx={{
                  placeContent: "center",
                  alignContent: "center",
                  backgroundColor: "#FFFFFF",
                  overflowY: "scroll",
                }}
              >
                <CircularProgress sx={{ color: "#008755" }} />
              </Box>
            ) : null}

            {/* Records not found section. */}
            {getTestAndMedicalCheckssListData &&
              !getTestAndMedicalCheckssListData?.loading &&
              (!getTestAndMedicalCheckssListData?.data ||
                getTestAndMedicalCheckssListData?.data?.length === 0) ? (
              <Alert className="dubai-med" severity="info">
                {
                  `No ${getTestPathName()} Created for this sport yet.`
                }
                {/* {`Records found.`} */}
              </Alert>
            ) : null}

            {getTestAndMedicalCheckssListData &&
              !getTestAndMedicalCheckssListData?.loading &&
              getTestAndMedicalCheckssListData?.data &&
              getTestAndMedicalCheckssListData?.data?.length > 0 ? (
              <Box
                p={2}
                sx={{
                  height: getPageContentHeight(),
                  overflowY: "scroll",
                }}
              >
                <TestAndMedicalsTestList
                  data={filteredList || []}
                  isEdit={handleEditData}
                  teamId={teamID}
                  setPage={setPage}
                  page={page}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  getTestAndMedicalCheckssListData={
                    getTestAndMedicalCheckssListData
                  }
                  searchText={searchText}
                  setSearchText={setSearchText}
                  handleFilterClick={handleFilterClick}
                  testType={testType}
                  filterByData={filterData}
                />
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

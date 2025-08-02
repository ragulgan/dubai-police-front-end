"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Alert, Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import isEmpty from "lodash/isEmpty";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import { useRouter } from "next/router";
import TeamsTable from "@/components/tables/teamsTable";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import {
  clearGetAthletesListState,
  getAthleteListAPI,
} from "@/redux/slices/athlete/getAthleteListSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAthleteListDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm } from "@/utils/helper";
import Axios, { axiosCallBlob } from "../../../../utils/AxiosInterceptor";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import GridViewSkeleton from "@/components/skeleton/GridViewSkeleton";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import UserCreation from "@/components/UserCreation";
import AthleteSlideDialog from "./edit/AthleteSlideDialog";
import CountAnimation from "@/components/common/CounterAnimation";
import AthletesCardView from "@/components/athlete/AthletesCardView";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/athletes`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Athletes",
      route: `/teams/${teamID}/athletes`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: getAthleteListDispatch = useDispatch();
  const getAthleteList = useSelector((state: any) => {
    return state.getAthleteList;
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
    if (is4K) return "63vh";
    if (isFullHD) return "67vh";
    if (is3K) return "63vh";
    if (is2K) return "59vh";
    if (isLaptopL) return "63vh";
    if (isLaptop) return "63vh";
    if (isTab) return "59vh";
    return "63vh";
  };
  const label: any = ["Age", "Disciple Practiced"];
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [selectedView, setSelectedView] = useState<"grid" | "list" | null>(
    "grid"
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
  const storedFilters = localStorage.getItem("athletesTargetsSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleChangeView = useCallback(
    (icon: any) => {
      if (selectedView !== icon) {
        setSelectedView(icon);
      }
    },
    [selectedView]
  );

  useEffect(() => {
    if (selectedView === "grid" && teamID) {
      const payload = {
        searchText: "",
        filteredBy:
          !isEmpty(filterData) && filterData?.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(getAthleteListAPI(payload));
    } else if (teamID) {
      const payload = {
        searchText: "",
        filteredBy:
          !isEmpty(filterData) && filterData?.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex:
          searchText !== "" || filterData?.length !== 0 ? 0 : page,
        paginationCount:
          searchText !== "" || filterData?.length !== 0 ? 0 : rowsPerPage,
        sportID: Number(teamID),
      };
      dispatch(getAthleteListAPI(payload));
    }
    return () => {
      dispatch(clearGetAthletesListState());
    };
  }, [teamID, selectedView, page, rowsPerPage, filterData]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 1,
      paginationCount: 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(getAthleteListAPI(payload));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const downloadAthletesExcel = async () => {
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportAthletesList`,
        {
          sportID: Number(teamID),
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AthletesList.xlsx");
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  const filteredList = filterBySearchTerm(getAthleteList.data, searchText, [
    "firstName",
    "middleName",
    "performanceLevel",
    "personalEmail",
    "role",
    "rank",
  ]);
  const tableHeaders = [
    "Name",
    "Date of Birth",
    "Email",
    "Performance Level",
    "Actions",
  ];

  const getAthletesCount = () => {
    if (!isEmpty(getAthleteList) && searchText === "" && isEmpty(filterData))
      return getAthleteList.totalRecords;
    if (!isEmpty(filteredList)) return filteredList.length;
    return 0;
  };

  const closeAthelet = () => {
    setDialogOpen(false);
  };

  const AddAthelete = () => {
    setDialogOpen(true);
  };

  return (
    <Box sx={{ mt: { xs: 1, sm: 0 } }}>
      {dialogOpen && (
        <UserCreation
          open={dialogOpen}
          onClose={closeAthelet}
          teamID={teamID}
          module={"athletes"}
        />
      )}
      {/* Athlete page breadcrumb */}
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      {/* Athlete page content */}
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
          >
            All Athlete
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, display: "flex" }}
            className="table-count-header dubai-regular header-border-right"
          >
            <CountAnimation value={Number(getAthletesCount())} />{" "}
            <span style={{ marginLeft: "4px" }}>Athletes</span>
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Name, Role, etc..."}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter by performance"}
          />
          <FilterDialog
            anchorEl={anchorEl}
            options={["Beginner", "Intermediate", "Advanced"]}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            localStorageKey="athletesTargetsSelectedFilters"
          />
          {checkAccess(USER_PERMISSION.AthleteAdd) && (
            <AppAddButton
              label="Add Athlete"
              onClick={() => {
                AddAthelete();
              }}
            />
          )}
          {isOpen && isEditData && (
            <AthleteSlideDialog
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
            />
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          py={2}
          pb={selectedView === "grid" ? 0 : 2}
          flexDirection={"row"}
          alignItems={"center"}
        >
          {checkAccess(USER_PERMISSION.AthleteView) &&
            (selectedView === "list" ? (
              <Button
                variant="outlined"
                className="text-capitalize dubai-med export-button"
                sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
                startIcon={<XlsSVG width="25px" height="25px" />}
                disabled={searchText !== "" && selectedView !== "list"}
                onClick={downloadAthletesExcel}
              >
                Export to Excel
              </Button>
            ) : null)}
          <CustomIconButton
            icon={CardViewIcon}
            isSelected={selectedView === "grid"}
            onClick={() => handleChangeView("grid")}
            title="Card View"
          />
          <CustomIconButton
            icon={TableViewIcon}
            isSelected={selectedView === "list"}
            onClick={() => handleChangeView("list")}
            title="Table View"
          />
        </Box>

        {/* section for api error */}
        {getAthleteList &&
        !getAthleteList.loading &&
        getAthleteList.code === 500 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Unable to retrieve athletes records.
            </Alert>
          </Box>
        ) : null}

        {/* section for no records found */}
        {getAthleteList &&
        !getAthleteList.loading &&
        getAthleteList.code !== 500 &&
        filteredList.length === 0 ? (
          <Alert className="dubai-med" severity="info">
            No athletes records found for this sport yet.
          </Alert>
        ) : null}

        {/* Table view */}
        {getAthleteList &&
        getAthleteList.code !== 500 &&
        filteredList.length > 0 &&
        selectedView === "list" ? (
          <Box p={2} pt={0}>
            <TeamsTable
              data={filteredList || []}
              isEdit={handleEditData}
              module="athlete"
              isLoading={getAthleteList.loading}
              setPage={setPage}
              page={page}
              setRowsPerPage={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              dataList={getAthleteList}
              headers={tableHeaders}
            />
          </Box>
        ) : null}

        {/* Grid view loading */}
        {getAthleteList && getAthleteList.loading && selectedView === "grid" ? (
          <Box
            sx={{
              overflowY: "auto",
              height: getPageContentHeight(),
            }}
          >
            <GridViewSkeleton />
          </Box>
        ) : null}

        {/* Grid view */}
        {getAthleteList &&
        !getAthleteList.loading &&
        getAthleteList.code !== 500 &&
        filteredList.length > 0 &&
        selectedView === "grid" ? (
          <Box>
            <AthletesCardView
              data={filteredList || []}
              isEdit={handleEditData}
              isLoading={getAthleteList.loading}
              label={label}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

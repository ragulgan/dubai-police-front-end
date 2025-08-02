// New feature branch
"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Alert, Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import TeamsTable from "@/components/nutrition/table";
import {
  clearNutritionListState,
  listNutrition,
} from "@/redux/slices/nutrition/NutritionListSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm } from "@/utils/helper";
import SubMenuLayout from "./layout";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import CardView from "@/components/nutrition/card";
import EditNutrition from "@/components/nutrition/form/editNutrition";
import FilterDateDialog from "@/components/calendar/dateFilters";
import { clearEditState } from "@/redux/slices/nutrition/NutritionEditSlice";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const Page = () => {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Nutrition",
      route: `/teams/${teamID}/nutrition`,
      currentPage: true,
      disabled: false,
    },
  ];
  const tableHeaders = [
    "Athlete Name",
    "Plan Name",
    "Start  Date",
    "End Date",
    "BMI Value",
    "Actions",
  ];
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const label: any = ["Age", "Role in Team"];
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "list"
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterData, setFilterData] = useState<any>([]);
  const getlistNutrition = useSelector((state: any) => {
    return state.listNutrition;
  });
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const [filter, setfilter] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    dispatch(clearEditState());
  };

  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedIcon !== icon) {
        setSelectedIcon(icon);
      }
    },
    [selectedIcon]
  );

  useEffect(() => {
    if (selectedIcon === "grid" && teamID) {
      const payload = {
        searchText: searchText !== "" ? searchText : "",
        filteredBy:
          !isEmpty(filterData) && filterData.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),

        startDate: filterData.startDate ? filterData.startDate : "",
        endDate: filterData.endDate ? filterData.endDate : "",
      };
      dispatch(listNutrition({ url: "/GetNutritionList", payload }));
    } else if (teamID) {
      const payload = {
        searchText: "",
        filteredBy:
          !isEmpty(filterData) && filterData.length !== 3
            ? Array.isArray(filterData) && filterData.join(",")
            : "",
        paginationIndex:
          searchText !== "" || filterData.length !== 0 ? 0 : page,
        paginationCount:
          searchText !== "" || filterData.length !== 0 ? 0 : rowsPerPage,
        sportID: Number(teamID),

        startDate: filterData.startDate ? filterData.startDate : "",
        endDate: filterData.endDate ? filterData.endDate : "",
      };
      dispatch(listNutrition({ url: "/GetNutritionList", payload }));
    }
    return () => {
      dispatch(clearNutritionListState());
    };
  }, [teamID, selectedIcon, page, rowsPerPage, filterData]);

  useEffect(() => {
    const payload: any = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 1,
      paginationCount: 100,
      sportID: Number(teamID),

      startDate: filterData.startDate ? filterData.startDate : "",
      endDate: filterData.endDate ? filterData.endDate : "",
    };
    if (isEdit) {
      dispatch(listNutrition({ url: "/GetNutritionList", payload }));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const filteredList = filterBySearchTerm(getlistNutrition?.data, searchText, [
    "athleteFirstName",
    "planName",
  ]);

  return (
    <>
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
            Nutrition
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {!isEmpty(getlistNutrition?.data) &&
              searchText === "" &&
              isEmpty(filterData)
              ? getlistNutrition?.data?.length
              : !isEmpty(filteredList) && filteredList.length}{" "}
            Nutritions
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Name, Plan, etc..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter nutrition by date"}
          />
          <FilterDateDialog
            anchorEl={anchorEl}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            setFilterData={setFilterData}
            filterData={filterData}
            setfilter={setfilter}
          />
          {checkAccess(USER_PERMISSION.NutritionPlanAdd) ? (
            <AppAddButton
              label={"Assign Plan"}
              onClick={() =>
                router.push(`/teams/${teamID}/nutrition/assignPlan`)
              }
            />
          ) : null}
          {isOpen && isEditData && (
            <EditNutrition
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
              module={"nutrition"}
              setIsOpen={setIsOpen}
            />
          )}
        </Box>
        {/* <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          py={2}
          pb={selectedIcon === "grid" ? 0 : 2}
          flexDirection={"row"}
          alignItems={"center"}
        >
          <CustomIconButton
            icon={CardViewIcon}
            isSelected={selectedIcon === "grid"}
            onClick={() => handleIconClick("grid")}
            title="Card view"
          />
          <CustomIconButton
            icon={TableViewIcon}
            isSelected={selectedIcon === "list"}
            onClick={() => handleIconClick("list")}
            title="Table view"
          />
        </Box> */}
        {getlistNutrition && getlistNutrition.code !== 500 ? (
          selectedIcon === "list" ? (
            <Box p={2} pt={1}>
              {getlistNutrition && (
                <TeamsTable
                  teamID={Number(teamID)}
                  data={filteredList || []}
                  isEdit={handleEditData}
                  module="nutrition"
                  isLoading={getlistNutrition.loading}
                  setPage={setPage}
                  page={page}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  isDisable={
                    getlistNutrition.totalRecords < 10 ||
                    isEmpty(getlistNutrition.data) ||
                    searchText !== "" ||
                    filterData.length !== 0
                  }
                  dataList={getlistNutrition}
                  headers={tableHeaders}
                  memoizedSelectedSport={[teamID]}
                  debouncedSearchText={searchText}
                  filterNutritionData={filterData}
                />
              )}
            </Box>
          ) : (
            <Box p={2}>
              <CardView
                data={filteredList || []}
                isEdit={handleEditData}
                isLoading={getlistNutrition.loading}
                label={label}
                module="nutrition"
              />
            </Box>
          )
        ) : getlistNutrition && getlistNutrition?.data?.length === 0 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Box>
        ) : (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Something went wrong
            </Alert>
          </Box>
        )}
      </Box>
    </>
  );
};
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

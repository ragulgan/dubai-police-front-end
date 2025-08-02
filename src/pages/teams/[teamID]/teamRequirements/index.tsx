// New feature branch
import { useRouter } from "next/router";
import SubMenuLayout from "./layout";
import { Alert, Box, Typography } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import TeamRequirementList from "@/components/teamRequirements/teamRequirementTable";
import ProgressBar from "@/components/Progressbar";
import { filterRecordsBySearchTextTeamReq } from "@/utils/helper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  clearGetTeamRequirementsListState,
  getTeamRequirementListAPI,
} from "@/redux/slices/teamRequirement/getTeamRequirementListSlice";
import React from "react";
import FilterDialog from "@/components/FilterDialog";
import SlideTeamRequirementDrawer from "./edit/slideTeamRequirementDrawer";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const statusMapping: { [key: string]: number } = {
  Pending: 0,
  Fulfilled: 1,
  Cancelled: 2,
};

function Page() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/teamRequirements`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Team Requirements",
      route: `/teams/${teamID}/teamRequirements`,
      currentPage: true,
      disabled: false,
    },
  ];
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getTeamRequirementLists = useSelector((state: any) => {
    return state.getTeamRequirementList;
  });

  useEffect(() => {
    if (teamID) {
      const payload = {
        sportID: Number(teamID),
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,

      };

      dispatch(
        getTeamRequirementListAPI({ url: "/GetTeamRequirementsList", payload })
      );
    }
    return () => {
      dispatch(clearGetTeamRequirementsListState());
    };
  }, [filterData, teamID, isUpdated, searchText]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = (selectedFilters: any) => {
    const mappedFilters = selectedFilters.map(
      (filter: any) => statusMapping[filter]
    );
    setFilterData(mappedFilters);
  };

  const filteredList = filterRecordsBySearchTextTeamReq(
    getTeamRequirementLists.data,
    searchText,
    [
      "requirementName",
      "requestedFirstname",
      "requestedRole",
      "priorityLevel",
      "quantityRequired",
      "shipmentStatusText",
      "requiredDate",
    ],
    filterData // status list
  );

  const handleEditData: any = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && isEditData && (
        <SlideTeamRequirementDrawer
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
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
            Team Requirements
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {`${filteredList && filteredList.length ? filteredList.length : 0
              } total `}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Team Requirements, etc..."}
            flexGrow={{ flexGrow: 0.5 }}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter by shipment status"}
          />
          <FilterDialog
            anchorEl={anchorEl}
            options={["Fulfilled", "Pending", "Cancelled"]}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            localStorageKey="goalstargetsSelectedFilters"
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
          {checkAccess(USER_PERMISSION.TeamRequirementsAdd) ? <AppAddButton
            label="Create Requirements"
            onClick={() => router.push(`/teams/${teamID}/teamRequirements/add`)}
          /> : null}
        </Box>
        {getTeamRequirementLists &&
          getTeamRequirementLists?.data?.length !== 0 &&
          filteredList.length > 0 ? (
          <Box>
            <ProgressBar
              total={filteredList.length || 0}
              getTeamRequirementLists={getTeamRequirementLists}
              data={filteredList || []}
            />
          </Box>
        ) : null}

        {getTeamRequirementLists && getTeamRequirementLists?.code === 500 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Unable to load team requirements.
            </Alert>
          </Box>
        ) : null}

        {getTeamRequirementLists &&
          getTeamRequirementLists?.data?.length === 0 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="info">
              No Team Requirement created for this sport yet.
            </Alert>
          </Box>
        ) : null}

        {getTeamRequirementLists &&
          getTeamRequirementLists.code !== 500 &&
          getTeamRequirementLists?.data?.length !== 0 ? (
          <Box p={2} pt={2}>
            <TeamRequirementList
              data={filteredList || []}
              isEdit={handleEditData}
              teamID={teamID}
              setPage={setPage}
              page={page}
              setRowsPerPage={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              isDataLoading={getTeamRequirementLists.loading}
            />
          </Box>
        ) : null}
      </Box>
    </>
  );
}

Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;

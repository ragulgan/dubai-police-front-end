"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Alert, Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SlideDialog from "@/components/SlideDialog";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import TeamsTable from "@/components/tables/teamsTable";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import { viewStaff, clearListState } from "@/redux/slices/staff/staffListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import {
  filterBySearchTerm,
  getLocalStorage,
  groupByData,
  safeJSONParse,
} from "@/utils/helper";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import _, { isEqual } from "lodash";
import axios from "axios";
import GridViewSkeleton from "@/components/skeleton/GridViewSkeleton";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import UserCreation from "@/components/UserCreation";
import StaffSlideDialog from "./edit/StaffSlideDialog";
import { SESSION, USER_PERMISSION } from "@/utils/constants";
import StaffCardView from "@/components/staff/StaffCardView";
import CountAnimation from "@/components/common/CounterAnimation";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { checkAccess } from "@/utils/acessscheck";

function Staffs() {
  const router = useRouter();
  const { teamID } = router.query; // teamID is sportID
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

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/staffs`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Staff",
      route: `/teams/${teamID}/staffs`,
      currentPage: true,
      disabled: false,
    },
  ];

  const tokenData: any = getLocalStorage(SESSION.TOKEN);
  const parsedData = safeJSONParse(tokenData);
  const label: any = ["Contract Start Date", "Contract End Date"];
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [selectedView, setSelectedView] = useState<"grid" | "list" | null>(
    "grid"
  );
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const storedFilters = localStorage.getItem("staffSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const dispatch: AppDispatch = useDispatch();
  const staffList = useSelector((state: RootState) => state.staffList);
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const [page, setPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rolesListData = useSelector((state: RootState) => state.rolesList);
  const filterOptions = _(rolesListData.data)
    .filter({ moduleName: "Staff" })
    .map("roleName")
    .value();

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedView !== icon) {
        setSelectedView(icon);
      }
    },
    [selectedView]
  );

  useEffect(() => {
    if (selectedView === "grid") {
      if (teamID) {
        const payload = {
          searchText: searchText ? searchText : "",
          filteredBy:
            Array.isArray(filterData) && !isEqual(filterData, filterOptions)
              ? filterData.join(",")
              : "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamID),
        };
        dispatch(viewStaff({ url: "/GetStaffsList", payload }));
      }
    } else {
      const payload = {
        searchText: searchText ? searchText : "",
        filteredBy:
          Array.isArray(filterData) && !isEqual(filterData, filterOptions)
            ? filterData.join(",")
            : "",
        paginationIndex: page,
        paginationCount: rowsPerPage,
        sportID: Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [filterData, page, rowsPerPage, selectedView, teamID, searchText]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 0,
      paginationCount: 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

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
  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
  };

  const downloadExcel = async () => {
    try {
      const downloadPayload: any = {
        sportID: Number(teamID),
        searchText: searchText ? searchText : "",
        filteredBy:
          Array.isArray(filterData) && !isEqual(filterData, filterOptions)
            ? filterData.join(",")
            : "",
        paginationIndex: 0,
        paginationCount: 0,
      };
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportStaffList`,
        downloadPayload
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "StaffList.xlsx");
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      alert("Failed to download the file. Please try again later.");
    }
  };

  const filteredList = filterBySearchTerm(staffList.data, searchText, [
    "firstName",
    "middleName",
    "roleText",
    "roleValue",
    "personalEmail",
    "rank",
    "Email",
  ]);

  const tableHeaders = [
    "Name",
    "Role",
    "Email",
    "Contract Start Date",
    "Contract End Date",
    "Actions",
  ];

  // Grouping by roleValue
  const groupByValue = _.groupBy(staffList.data, "roleOrder");

  const getStaffsCount = () => {
    if (!isEmpty(staffList) && searchText === "" && isEmpty(filterData))
      return staffList.totalRecords;
    if (!isEmpty(staffList.data)) return staffList?.data?.length;
    return 0;
  };

  const AddStaff = () => {
    setDialogOpen(true);
  };

  const closeStaff = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ mt: { xs: 1, sm: 0 } }}>
      {dialogOpen && (
        <UserCreation
          open={dialogOpen}
          onClose={closeStaff}
          teamID={teamID}
          module={"staffs"}
        />
      )}
      {/* Page Breadcrump */}
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>

      {/* Page Content */}
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            All Staff
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, display: "flex" }}
            className="table-count-header dubai-regular header-border-right"
          >
            <CountAnimation value={Number(staffList?.totalRecords)} />{" "}
            <span style={{ marginLeft: "4px" }}>Staff</span>
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Name, Role, etc..."}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter by role"}
          />
          {!isEmpty(filterOptions) && (
            <FilterDialog
              anchorEl={anchorEl}
              options={filterOptions}
              open={filterDialogOpen}
              onClose={handleCloseFilterDialog}
              onApply={handleApplyFilters}
              localStorageKey="staffSelectedFilters"
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          )}
          {checkAccess(USER_PERMISSION.StaffAdd) && (
            <AppAddButton
              label="Add Staff"
              onClick={() => {
                AddStaff();
              }}
            />
          )}
          {isOpen && isEditData && (
            <StaffSlideDialog
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
              module="staff"
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
          {checkAccess(USER_PERMISSION.StaffView) &&
            (selectedView === "list" ? (
              <Button
                variant="outlined"
                disabled={!staffList?.data?.length}
                onClick={downloadExcel}
                className="text-capitalize dubai-med export-button"
                sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
                startIcon={<XlsSVG width="26px" height="26px" />}
              >
                {"Export to Excel"}
              </Button>
            ) : null)}
          <CustomIconButton
            icon={CardViewIcon}
            isSelected={selectedView === "grid"}
            onClick={() => handleIconClick("grid")}
            title="Card View"
          />
          <CustomIconButton
            icon={TableViewIcon}
            isSelected={selectedView === "list"}
            onClick={() => handleIconClick("list")}
            title="Table View"
          />
        </Box>

        {/* section for api error */}
        {staffList && !staffList.loading && staffList.code === 500 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Unable to retrieve staff records.
            </Alert>
          </Box>
        ) : null}

        {/* section for no records found */}
        {staffList &&
        !staffList.loading &&
        staffList.code !== 500 &&
        staffList?.data?.length === 0 ? (
          <Alert className="dubai-med" severity="info">
            No staffs records found for this sport yet.
          </Alert>
        ) : null}

        {/* Table view */}
        {staffList &&
        staffList.code !== 500 &&
        staffList?.data?.length > 0 &&
        selectedView === "list" ? (
          <Box p={2} pt={0}>
            <TeamsTable
              data={staffList.data || []}
              isEdit={handleEditData}
              setPage={setPage}
              page={page}
              setRowsPerPage={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              dataList={staffList}
              isLoading={staffList.loading}
              module="staff"
              headers={tableHeaders}
            />
          </Box>
        ) : null}

        {/* Grid view loading */}
        {staffList && staffList.loading && selectedView === "grid" ? (
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
        {staffList &&
        !staffList.loading &&
        staffList.code !== 500 &&
        staffList?.data?.length > 0 &&
        selectedView === "grid" ? (
          <Box
            sx={{
              overflowY: "auto",
              height: getPageContentHeight(),
            }}
          >
            {staffList?.data?.length > 0
              ? Object.entries(groupByValue).map(([roleText, fields]) => (
                  <React.Fragment key={roleText}>
                    <Box
                      mx={2}
                      mt={2}
                      p={1.5}
                      className="bukra"
                      sx={{
                        border: "1px solid #DEE2ED",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {/* roleOrder 9 means other staffs */}
                      {fields && fields.length >= 1
                        ? fields[0]?.roleOrder != 9
                          ? fields[0]?.roleText
                          : "Other Staffs"
                        : "---"}
                    </Box>
                    <StaffCardView
                      data={fields || []}
                      isEdit={handleEditData}
                      isLoading={staffList.loading}
                      label={label}
                      setPage={setPage}
                      page={page}
                      setRowsPerPage={setRowsPerPage}
                      rowsPerPage={rowsPerPage}
                    />
                  </React.Fragment>
                ))
              : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
Staffs.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Staffs;

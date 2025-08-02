import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import FilterDialog from "@/components/FilterDialog";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import SettingsSideMenu from "@/components/settings/SettingsSideMenu";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import XlsSVG from "../../../public/XlsSVG.svg";
// import XlsSVG from "../../../public/XlsSVG.svg";
import axios from "axios";
import PaginationComponent from "@/components/PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import { debounce, isEmpty } from "lodash";
import { getUserList } from "@/redux/slices/users/userListslice";
import StaffRoleChip from "@/components/staff/StaffRoleChip";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import AppAlert from "@/components/alert/AppAlert";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import { RootState } from "@/redux/store";
import CustomCheckbox from "@/components/checkbox/CustomCheckbox";
import {
  clearUpdateUserAsAdminState,
  updateUserAsAdmin,
} from "@/redux/slices/users/updateUserAsAdminSlice";

const debounceTime = 500;

const tableHeaders = [
  { id: 1, headerWidth: "240px", title: "Name" },
  { id: 2, headerWidth: "240px", title: "User Name" },
  { id: 3, headerWidth: "240px", title: "User Type" },
  { id: 4, headerWidth: "240px", title: "Email" },
  { id: 5, headerWidth: "240px", title: "Role" },
  { id: 6, headerWidth: "240px", title: "Make as Admin" },
];

const UserManagementIndexPage = () => {
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Settings",
      route: `/user-management`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "User Management",
      route: `/user-management`,
      currentPage: true,
      disabled: false,
    },
  ];

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState<any[]>([]);

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "69vh";
    if (isFullHD) return "69vh";
    if (is3K) return "58vh";
    if (is2K) return "64vh";
    if (isLaptopL) return "69vh";
    if (isLaptop) return "69vh";
    if (isTab) return "69vh";
    return "58vh";
  };

  const dispatch: any = useDispatch();

  const getRoleList = () => {
    const param: any = {
      moduleName: "",
    };
    dispatch(fetchRoles(param));
  };

  const debounceGetRoleList = debounce(() => getRoleList(), debounceTime);

  // on page load
  useEffect(() => {
    debounceGetRoleList();
    return () => {
      debounceGetRoleList.cancel();
    };
  }, []);

  const rolesListData = useSelector((state: RootState) => state.rolesList);

  const getRoleListForFilter = () => {
    if (rolesListData && rolesListData.data && rolesListData.data.length > 0)
      return rolesListData.data.map((role: any) => role.roleName);

    return [];
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
    if (rolesListData && rolesListData.data && rolesListData.data.length > 0) {
      const selectedRoleIDs = rolesListData.data
        .filter((role: any) => selectedFilters.includes(role.roleName))
        .map((role: any) => role.roleID);
      setFilterData(selectedRoleIDs);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const loadUserList = () => {
    const usersPayload = {
      searchText: searchText,
      filteredBy: !isEmpty(filterData) ? filterData.join(",") : "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
      loggedUserID: 1,
    };
    dispatch(
      getUserList({ url: "/Sports/GetUserList", payload: usersPayload })
    );
  };

  const debounceGetUserList = debounce(() => loadUserList(), debounceTime);

  const userListData = useSelector((state: any) => {
    return state.userList;
  });

  useEffect(() => {
    debounceGetUserList();
    return () => {
      debounceGetUserList.cancel();
    };
  }, [page, rowsPerPage, searchText, filterData]);

  const downloadExcel = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_BASE_URL}/Sports/ExportUserList`,
        {
          searchText: searchText,
          filteredBy: !isEmpty(filterData) ? filterData.join(",") : "",
          paginationIndex: 1,
          paginationCount: 0,
          loggedUserID: 1,
        },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "UsersLst.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
      alert("Failed to download the file. Please try again later.");
    }
  };

  const handleCheckboxChange = (row: any) => {
    const usersPayload = {
      userID: row?.userID,
      isAdmin: row?.isAdmin === 1 ? 0 : 1,
      loggedUserID: "1",
    };
    dispatch(
      updateUserAsAdmin({
        url: "/Sports/UpdateUserByID",
        payload: usersPayload,
      })
    );
  };

  const updateUserAsAdminData = useSelector(
    (state: RootState) => state.updateUserAsAdmin
  );

  useEffect(() => {
    if (
      updateUserAsAdminData &&
      updateUserAsAdminData.code === 200 &&
      updateUserAsAdminData.status === "succeeded"
    ) {
      dispatch(clearUpdateUserAsAdminState());
      loadUserList();
    }
  }, [updateUserAsAdminData]);

  return (
    <Box p={1} pl={0} sx={{ height: "87vh" }}>
      <CssBaseline />
      {/* menu section */}
      <SettingsSideMenu activeMenuID={4} />

      {/* main content */}
      <Box
        sx={{
          marginLeft: "215px", // this width make the space for Settings menu
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "85vh",
        }}
      >
        {/* breadcrump */}
        <Box paddingTop={1.5} p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
        {/* page content */}

        <Box
          mt={1}
          className="bg-white"
          borderRadius={1}
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <Box display={"flex"}>
            <Typography
              sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
              p={2}
              className="table-list-header bukra-semi-bold header-border-right"
            >
              Admin Settings
            </Typography>
            <Typography
              p={2}
              sx={{ flexGrow: 2 }}
              className="table-count-header dubai-regular header-border-right"
            >
              {`${userListData?.totalRecords} total `}
            </Typography>
            <ModuleSearchInput
              setSearchText={setSearchText}
              placeholder={"Search by Name, Role, etc..."}
              flexGrow={{ flexGrow: 0.5 }}
            />
            <ModuleFilterButton handleFilterClick={handleFilterClick} />
            <FilterDialog
              anchorEl={anchorEl}
              options={getRoleListForFilter()}
              open={filterDialogOpen}
              onClose={handleCloseFilterDialog}
              onApply={handleApplyFilters}
              localStorageKey="userManagementSelectedFilters"
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </Box>
          {/* end of header and search section */}
          <Box
            display="flex"
            justifyContent="flex-end"
            p={1}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Button
              variant="outlined"
              disabled={false}
              onClick={downloadExcel}
              className="text-capitalize dubai-med export-button"
              sx={{ borderRadius: "43px", height: "44px" }}
              startIcon={<XlsSVG width="25px" height="25px" />}
              data-testid="export-btn"
            >
              {"Export to Excel"}
            </Button>
          </Box>

          {userListData && userListData.loading ? (
            <TableSkeleton sx={{ height: getPageContentHeight() }} />
          ) : null}

          {userListData &&
          !userListData.loading &&
          userListData.code === 500 ? (
            <Box p={3}>
              <AppAlert type="error" message={"Unable to load users."} />
            </Box>
          ) : null}

          {userListData &&
            !userListData.loading &&
            userListData.code === 200 &&
            userListData.data &&
            userListData.data.length < 1 && (
              <Box p={3}>
                <AppAlert type="info" message={"User(s) not found."} />
              </Box>
            )}

          {userListData &&
          !userListData.loading &&
          userListData.code === 200 &&
          userListData.data &&
          userListData.data.length > 0 ? (
            <TableContainer
              sx={{
                borderRadius: "8px",
                border: "1px solid rgba(88, 88, 91, 0.2)",
                height: getPageContentHeight(),
                overflow: "auto",
              }}
            >
              <Table stickyHeader aria-label="team table">
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header) => (
                      <TableCell
                        key={header.id}
                        align={"left"}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: "bold",
                          color: "#000000",
                          width: header.headerWidth,
                          p: 1.25,
                        }}
                        className="bukra"
                      >
                        {header.title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{}}>
                  {userListData.data.map((row: any, index: any) => (
                    <TableRow
                      key={row?.userID}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                      }}
                    >
                      <TableCell
                        sx={{ display: "flex", alignItems: "center", p: 1.25 }}
                      >
                        <Avatar
                          alt={row.athleteProfileImage}
                          src={row.athleteProfileImage}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Tooltip title={`${row.name}`}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                              ml: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "180px",
                            }}
                            className="dubai-med text-capitalize"
                          >
                            {`${row.name}`}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                          }}
                          className="dubai-med"
                        >
                          {row.userName || "--"}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                          }}
                          className="dubai-med"
                        >
                          {row.userType || "--"}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                          }}
                          className="dubai-med"
                        >
                          {row.email || "--"}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#58585B",
                          p: 1.25,
                        }}
                        className="dubai-med"
                      >
                        <StaffRoleChip roleValue={row.role} />
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        <CustomCheckbox
                          checked={!!row?.isAdmin}
                          onChange={() => {
                            handleCheckboxChange(row);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {userListData &&
              !userListData.loading &&
              userListData.code === 200 &&
              userListData.data ? (
                <PaginationComponent
                  rowsPerPage={rowsPerPage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  page={page}
                  handleChangePage={handleChangePage}
                  startIndex={1}
                  endIndex={10}
                  totalItems={userListData.totalRecords}
                />
              ) : null}
            </TableContainer>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagementIndexPage;

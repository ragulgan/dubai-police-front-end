"use clients";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Fade,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { getPerformanceLevel, USER_PERMISSION } from "@/utils/constants";
import PaginationComponent from "@/components/PaginationComponent";
// import DeleteDialog from "@/components/Fields/DeleteDialog";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  deleteCustomerById,
  clearDeleteState,
} from "@/redux/slices/staff/staffDeleteSlice";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { getLocalStorage } from "@/utils/helper";
import { deleteAthleteById } from "@/redux/slices/athlete/athleteDeleteSlice";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import Speedometer from "../../../public/speedometer.svg";
import DeleteDialog from "../dialogs/DeleteDialog";
import StaffRoleChip from "../staff/StaffRoleChip";
import TableSkeleton from "../skeleton/TableSkeleton";
import AthletePerformanceLevelChip from "../athlete/AthletePerformaceLevelChip";
import { checkAccess } from "@/utils/acessscheck";

interface RowData {
  name: string;
  role: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  email?: string;
  rank?: string;
  staffID: string;
  profileImage: string;
}

// Define props for the TeamsTable component
interface TeamsTableProps {
  data: RowData[]; // Array of RowData objects
  isEdit?: (id: string) => void; // Function type for handling edit action
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  dataList: any;
  isLoading: any;
  module: string;
  headers?: any;
  isHide?: any;
}
const TeamsTable: React.FC<TeamsTableProps> = ({
  data,
  isEdit,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  dataList,
  isLoading,
  module,
  headers,
  isHide,
}) => {
  const staffDelete = useSelector((state: RootState) => state.deleteStaff);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "59vh";
    if (isFullHD) return "63vh";
    if (is3K) return "59vh";
    if (is2K) return "54vh";
    if (isLaptopL) return "59vh";
    if (isLaptop) return "59vh";
    if (isTab) return "55vh";
    return "59vh";
  };
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");
  const athleteDelete = useSelector((state: RootState) => state.deleteAthlete);

  const handleTableViewClick = (row: any) => {
    let viewPagePath = "";
    if (module === "staff") {
      viewPagePath = `/teams/${getCurrentSport}/staffs/view/${row.staffID}`;
    } else if (module === "athlete") {
      viewPagePath = `/teams/${getCurrentSport}/athletes/view/${row.athleteID}`;
    } else if (module === "nutrition") {
      viewPagePath = `/teams/${getCurrentSport}/nutrition/view/${row.nutritionID}`;
    }
    router.push(viewPagePath);
  };

  const viewPermissionKey = module === "staff" ? "StaffView" : "AthleteView";
  const hasViewAccess = checkAccess(USER_PERMISSION[viewPermissionKey]);
  const getPermissionKey = (action: "View" | "Edit" | "Delete" | "Add") =>
    `${module === "staff" ? "Staff" : "Athlete"}${action}` as keyof typeof USER_PERMISSION;
  const canEdit = checkAccess(USER_PERMISSION[getPermissionKey("Edit")]);
  const canDelete = checkAccess(USER_PERMISSION[getPermissionKey("Delete")]);

  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            height: getPageContentHeight(),
            backgroundColor: "#FFFFFF",
          }}
        >
          <TableSkeleton />
        </Box>
      ) : (
        <Fade in={true} timeout={1000}>
          <TableContainer
            sx={{
              height: getPageContentHeight(),
              overflowX: "auto",
              border: "1px solid rgba(88, 88, 91, 0.2)",
              borderRadius: "4px",
            }}
          >
            <Table stickyHeader aria-label="team table">
              <TableHead>
                <TableRow>
                  {headers.map((header: any) => (
                    <TableCell
                      key={header}
                      align={"left"}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "13px",
                        width:
                          header === "Name"
                            ? "240px"
                            : header === "Role"
                              ? "97px"
                              : header === "Actions"
                                ? "60px"
                                : "164px",
                        p: 1.25,
                        color: "#000000",
                        paddingLeft: header === "Name" ? "70px" : "none",
                      }}
                      className="bukra-semi-bold"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((row: any, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                      }}
                    >
                      <TableCell
                        sx={{ display: "flex", alignItems: "center", p: 1.25 }}
                      >
                        <Avatar
                          alt={row.firstName}
                          src={row.profileImage}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Tooltip
                          title={`${row.rank} ${row.firstName} ${row.middleName} ${row.surName}`}
                        >
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
                              width: "200px",
                            }}
                            className="dubai-regular text-capitalize"
                          >
                            {`${row.rank} ${row.firstName} ${row.middleName} ${row.surName}`}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      {module === "staff" ? (
                        <TableCell sx={{ p: 1.25 }}>
                          <StaffRoleChip
                            roleValue={row?.roleValue || ""}
                            roleShortText={row?.roleShortText}
                            otherStaff={row?.otherStaff}
                          />
                        </TableCell>
                      ) : module === "nutrition" ? (
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.dob || "--"}
                          </Typography>
                        </TableCell>
                      ) : (
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.dob || "--"}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell sx={{ p: 1.25 }}>
                        {module === "nutrition" ? (
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.dob || "--"}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.personalEmail || "--"}
                          </Typography>
                        )}
                      </TableCell>
                      {/* Staff row */}
                      {module === "staff" && (
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.contractStartDate || "--"}
                          </Typography>
                        </TableCell>
                      )}
                      {module === "staff" && (
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.contractEndDate || "--"}
                          </Typography>
                        </TableCell>
                      )}
                      {/* athlete row */}
                      {module === "athlete" && (
                        <TableCell sx={{ p: 1.25 }}>
                          <AthletePerformanceLevelChip
                            performanceLevel={row.performanceLevel || ""}
                          />
                        </TableCell>
                      )}
                      {/* Nutrition row */}
                      {module === "nutrition" && (
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.contractStartDate || "--"}
                          </Typography>
                        </TableCell>
                      )}
                      {module === "nutrition" && (
                        <TableCell
                          sx={{ p: 1.25 }}
                          className="speedometer-logo"
                        >
                          <Speedometer />
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#58585B",
                              mt: -0.5,
                              ml: 1.5,
                            }}
                            className="bukra-semi-bold"
                          >
                            30
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        {hasViewAccess && (
                          <Tooltip title={"View"}>
                            <IconButton
                              aria-label="view"
                              sx={{
                                width: "16px",
                                height: "16px",
                                ...(isHide && { marginLeft: 3 }),
                              }}
                            >
                              <VisibilityIcon
                                onClick={() => handleTableViewClick(row)}
                                sx={{ color: "#05868E" }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                        {
                          canEdit
                            ?
                            <Tooltip title={"Edit"}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() =>
                                  isEdit &&
                                  isEdit(
                                    module === "staff"
                                      ? row.staffID
                                      : module === "nutrition"
                                        ? "nutrition"
                                        : row.athleteID
                                  )
                                }
                                sx={{
                                  width: "16px",
                                  height: "16px",
                                  mx: 1,
                                  color: "#05868E",
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            : (
                              <Box sx={{ display: "inline-block", width: "16px" }} />
                            )}
                        {
                          canDelete && (
                            <DeleteDialog
                              data={row}
                              dispatchDelete={
                                module === "staff"
                                  ? deleteCustomerById
                                  : deleteAthleteById
                              }
                              deleteResponse={
                                module === "staff" ? staffDelete : athleteDelete
                              }
                              clearDelete={
                                module === "staff"
                                  ? clearDeleteState
                                  : clearDeleteState
                              }
                              module={
                                module === "staff" ? "staffID" : "athleteID"
                              }
                              dispatchList={
                                module === "staff"
                                  ? viewStaff
                                  : getAthleteListAPI
                              }
                              title={
                                module === "staff"
                                  ? "Staff"
                                  : module === "athlete"
                                    ? "Athlete"
                                    : "Nutrition"
                              }
                              listUrl={module === "staff" && "/GetStaffsList"}
                              getCurrentSport={getCurrentSport}
                            />
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              startIndex={startIndex}
              endIndex={
                endIndex > dataList?.totalRecords
                  ? dataList?.totalRecords
                  : endIndex
              }
              totalItems={dataList?.totalRecords}
            />
          </TableContainer>
        </Fade>
      )}
    </Box>
  );
};

export default TeamsTable;
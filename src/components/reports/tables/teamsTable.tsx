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
import { getPerformanceLevel } from "@/utils/constants";
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
import Speedometer from "../../../../public/speedometer.svg";
// import Speedometer from "../../../public/speedometer.svg";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
// import DeleteDialog from "../dialogs/DeleteDialog";
import StaffRoleChip from "@/components/staff/StaffRoleChip";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import AthletePerformanceLevelChip from "@/components/athlete/AthletePerformaceLevelChip";

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
  isDisable: boolean;
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
  isDisable,
  module,
  headers,
  isHide
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
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");
  const athleteDelete = useSelector((state: RootState) => state.deleteAthlete);

  const handleTableViewClick = (row: any) => {
    let viewPagePath = "";
    if (module === "staff") {
      viewPagePath = `/teams/${getCurrentSport}/staffs/view/${row.staffId}`;
    } else if (module === "athlete") {
      viewPagePath = `/teams/${getCurrentSport}/athletes/view/${row.athleteId}`;
    }
    router.push(viewPagePath);
  };
  const rolesListData = useSelector((state: RootState) => state.rolesList?.data);
  console.log({ rolesListData });

  const getRoleName = (roleID: number): string => {
    console.log({ roleID });

    // const role = rolesListData.find(role => role.roleID === roleID);
    const role = (rolesListData as any[]).find((role: any) => role.roleID === roleID);

    return role ? role.roleName : "Role not found";
  };
  console.log('get roleeeee', getRoleName(Number('1')), { data });

  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            height: {
              xs: "58vh",
              lg: "59vh",
              xl: is3K ? "65vh" : is2K ? "58vh" : "65vh",
            },
            backgroundColor: "#FFFFFF",
          }}
        >
          <TableSkeleton />
        </Box>
      ) : (
        <Fade in={true} timeout={1000}>
          <TableContainer
            sx={{
              height: {
                xs: "58vh",
                lg: "59vh",
                xl: is3K ? "65vh" : is2K ? "58vh" : "65vh",
                border: "1px solid rgba(88, 88, 91, 0.2)",
                borderRadius: "4px",
              },
              overflowX: "auto",
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
                            ? "200px"
                            : header === "Role"
                              ? "97px"
                              : header === "Actions"
                                ? "60px"
                                : "164px",
                        p: 1.25,
                        color: "#000000",
                        ml: header === 'Name' ? 4 : 0
                      }}
                      className="bukra-semi-bold"
                    >
                      <Box sx={{ ml: header === 'Name' ? 7 : 0 }}>
                        {header}
                      </Box>
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
                          title={`${row.currentJobPosition} ${row.firstName} ${row.middleName} ${row.surname}`}
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
                            {`${row.currentJobPosition} ${row.firstName} ${row.middleName} ${row.surname}`}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      {module === "staff" ? (
                        <TableCell sx={{ p: 1.25 }}>
                          <StaffRoleChip
                            roleValue={getRoleName(Number(row.role)).toString()}
                            otherStaff={row.otherStaff}
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
                        <Tooltip title={"View"}>
                          <IconButton
                            aria-label="view"
                            sx={{ width: "16px", height: "16px", ...(isHide && { marginLeft: 3 }) }}

                          >
                            <VisibilityIcon
                              onClick={() => {
                                handleTableViewClick(row);
                              }}

                              sx={{ color: "#05868E" }}
                            />
                          </IconButton>
                        </Tooltip>
                        {!isHide &&
                          <Tooltip title={"Edit"}>
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() =>
                                isEdit && isEdit(
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
                        }
                        {!isHide &&
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
                            module={module === "staff" ? "staffID" : "athleteID"}
                            dispatchList={
                              module === "staff" ? viewStaff : getAthleteListAPI
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
                          />}
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
              isDisable={isDisable}
            />
          </TableContainer>
        </Fade>
      )}
    </Box>
  );
};

export default TeamsTable;

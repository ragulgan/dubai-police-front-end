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

// Define props for the TrainingPlanTableReport component
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
const TestReportTable: React.FC<TeamsTableProps> = ({
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
  console.log({dataList});
  

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
      const route =
        row.section === "fitness"
          ? `/fitness-and-nutrition/view/fitness/${row.checksId}?sportID=${row.sportId}`
          : `/teams/${getCurrentSport}/testAndMedicalChecks/view/${row.section}/${row.checksId}`;

      router.push(route);
  };


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
                        header === "Actions"
                            ? "60px"
                            : "164px",
                        p: 1.25,
                        color: "#000000",
                        ml: header ==='Name' ? 2 : 0
                      }}
                      className="bukra-semi-bold"
                    >
                      {/* {header} */}
                      <Box sx={{ ml: header === 'Name' ? 2 : 0 }}>
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
  {/* Training Plan */}
  <TableCell sx={{ p: 1.25 }}>
    <Tooltip title={`${row.rank} ${row.firstName} ${row.middleName} ${row.surName}`}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          ml: 2 
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            color: "#58585B",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "200px",
          }}
          className="dubai-regular text-capitalize"
        >
         {row.athleteFirstname} {row.athleteMiddlename} {row.athleteSurname}
        </Typography>
      </Box>
    </Tooltip>
  </TableCell>

  {/* Training Type */}
  <TableCell sx={{ p: 1.25 }}>
    <Tooltip title={`${row.rank} ${row.firstName} ${row.middleName} ${row.surName}`}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            color: "#58585B",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "200px",
            
          }}
          className="dubai-regular text-capitalize"
        >
          {row.section
          }
        </Typography>
      </Box>
    </Tooltip>
  </TableCell>

  {/* Training Start Date */}
  <TableCell sx={{ p: 1.25 }}>
    <Tooltip title="View">
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "24px",
          color: "#58585B",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "200px",
        }}
        className="dubai-regular text-capitalize"
      >
        {row.status}
      </Typography>
    </Tooltip>
  </TableCell>

  {/* Athlete Name List */}
  <TableCell sx={{ p: 1.25 }}>
    <Tooltip title="View">
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "24px",
          color: "#58585B",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "200px",
        }}
        className="dubai-regular text-capitalize"
      >
        {row.testDate}
      </Typography>
    </Tooltip>
  </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        <Tooltip title={"View"}>
                          <IconButton
                            aria-label="view"
                            sx={{ width: "16px", height: "16px" , ...(isHide && { marginLeft:   3} ) }}
                      
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

export default TestReportTable;

{/* <TableRow
key={index}
sx={{
  "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
}}
>
<TableCell
  sx={{ display: "flex", alignItems: "center", p: 1.25 }}
>

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
      {`${row.trainingPlan}`}
    </Typography>
  </Tooltip>
</TableCell>
<TableCell
  sx={{ display: "flex", alignItems: "center", p: 1.25 }}
>

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
      {`${row.trainingType}`}
    </Typography>
  </Tooltip>
</TableCell>


<TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
  <Tooltip title={"View"}>
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
      {`${row.trainingStartDate}`}
    </Typography>
  </Tooltip>


</TableCell>
<TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
  <Tooltip title={"View"}>
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
      {`${row.athleteNameList}`}
    </Typography>
  </Tooltip>

</TableCell>

</TableRow> */}

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import PaginationComponent from "@/components/PaginationComponent";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isArray } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteTrainingPlansById,
  clearDeleteState,
} from "@/redux/slices/trainingPlans/TrainingPlansDeleteSlice";
import { viewTrainingPlans } from "@/redux/slices/trainingPlans/TrainingPlansListSlice";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import { getLocalStorage } from "@/utils/helper";
import Image from "next/image";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import TableSkeleton from "../skeleton/TableSkeleton";

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

interface TrainingPlansProps {
  data: RowData[]; // Array of RowData objects
  isEdit: (id: string) => void; // Function type for handling edit action
  teamId?: any;
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  TrainingPlanslist: any;
}
const TrainingPlans: React.FC<TrainingPlansProps> = ({
  data,
  isEdit,
  teamId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  TrainingPlanslist,
}) => {
  const getCurrentSport = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const TrainingPlansDelete = useSelector(
    (state: RootState) => state.deleteTrainingPlans
  );
  const [filterData, setFilterData] = React.useState<any>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  React.useEffect(() => {
    const startIndex = (page - 1) * rowsPerPage + 1;
    const endIndex = startIndex + rowsPerPage - 1;
    if (!_.isEmpty(data) && startIndex && endIndex) {
      setFilterData(data?.slice(startIndex - 1, endIndex));
    }
  }, [data, page, rowsPerPage]);

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();
  return (
    <>
      {TrainingPlanslist.loading ? (
        <Box
          sx={{
            height: {
              xs: "58vh",
              lg: "65.5vh",
              xl: "75vh",
            },
            backgroundColor: "#FFFFFF",
          }}
        >
          <TableSkeleton />
        </Box>
      ) : TrainingPlanslist.data.length > 0 ? (
        <TableContainer
          sx={{
            mt: 2,
            borderRadius: "8px",
            border: "1px solid rgba(88, 88, 91, 0.2)",
          }}
        >
          <Table stickyHeader aria-label="team table">
            <TableHead>
              <TableRow>
                {[
                  "Training Plan",
                  "Training Type",
                  "Start Date",
                  "End Date",
                  "Assigned coach",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align={"left"}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: "bold",
                      color: "#000000",
                      width:
                        header === "Name"
                          ? "240px"
                          : header === "Goal"
                            ? "240px"
                            : header === "Status"
                              ? "97px"
                              : header === "Actions"
                                ? "60px"
                                : "164px",
                    }}
                    className="bukra"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!_.isEmpty(filterData) ? (
                filterData.map((row: any) => (
                  <TableRow
                    key={row?.trainingPlanID}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                    }}
                  >
                    <TableCell>
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
                        className="dubai-regular"
                      >
                        {row.trainingPlan || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
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
                        className="dubai-regular"
                      >
                        {row.trainingType || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#58585B",
                        }}
                        className="dubai-regular"
                      >
                        {row.trainingStartDate || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#58585B",
                        }}
                        className="dubai-regular"
                      >
                        {row.trainingEndDate || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
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
                        className="dubai-regular"
                      >
                        {row?.assignedCoachList &&
                          isArray(row?.assignedCoachList) &&
                          row?.assignedCoachList.length > 0 ?
                          row?.assignedCoachList.map((item: any, i: number) => (
                            <Tooltip key={i} title={`${item.firstName}${item.surname}`}>
                              <React.Fragment>
                                {item.firstName} {item.surname}
                                {i < row.assignedCoachList.length - 1 && ", "}
                              </React.Fragment>
                            </Tooltip>
                          )) : null}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {checkAccess(USER_PERMISSION.TrainingPlanView) ? <Tooltip title={"View"}>
                        <IconButton
                          aria-label="view"
                          size="small"
                          sx={{ width: "16px", height: "16px" }}
                          onClick={() => {
                            router.push(
                              `/teams/${getCurrentSport}/trainingPlans/view/${row.trainingPlanID}`
                            );
                          }}
                        >
                          <VisibilityIcon
                            sx={{ color: "#05868E" }}
                          />
                        </IconButton>
                      </Tooltip> : null}
                      {checkAccess(USER_PERMISSION.TrainingPlanEdit) ? <Tooltip title={"Edit"}>
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => isEdit(row.trainingPlanID)}
                          sx={{
                            width: "16px",
                            height: "16px",
                            mx: 1,
                            color: "#05868E",
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip> : (
                        <Box sx={{ display: "inline-block", width: "16px" }} />
                      )}
                      {checkAccess(USER_PERMISSION.TrainingPlanDelete) ? <ReusableDeleteDialog
                        title={`Training Plan`}
                        confirmationMessage="Are you sure, Do you want to delete?"
                        successMessage="Training Plan Deleted Successfully"
                        name={row.trainingPlan}
                        icon={<DeleteIcon />}
                        revertMessage={`Once the Training Plan is deleted, you cannot not revert.`}
                        deleteAction={(payload: any) =>
                          dispatch(deleteTrainingPlansById(payload))
                        }
                        fetchAfterDelete={() => {
                          const payload: any = {
                            sportID: Number(teamId),
                            searchText: "",
                            filteredBy: "",
                            paginationCount: 0,
                            paginationIndex: 0,

                          };
                          dispatch(
                            viewTrainingPlans({
                              url: "/GetTrainingPlanList",
                              payload,
                            })
                          );
                        }}
                        deleteResponse={TrainingPlansDelete}
                        clearDeleteState={() => dispatch(clearDeleteState())}
                        payload={{
                          trainingPlanID: row.trainingPlanID,

                        }}
                      /> : null}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      No record(s) found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <PaginationComponent
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            startIndex={startIndex}
            endIndex={endIndex > data?.length ? data?.length : endIndex}
            totalItems={data?.length}
          />
        </TableContainer>
      ) : (
        <Box
          bgcolor={"#FFFFFF"}
          height={{ xs: "58vh", lg: "65.5vh", xl: "75vh" }}
          mt={0.5}
        >
          <Alert
            className="dubai-med"
            severity="info"
          >{`No season(s) found.`}</Alert>
        </Box>
      )}
    </>
  );
};

export default TrainingPlans;

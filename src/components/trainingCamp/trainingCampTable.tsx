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
  Box,
  CircularProgress,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PaginationComponent from "@/components/PaginationComponent";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getTraningCampListAPI } from "@/redux/slices/trainingCamp/getTrainingCampListSlice";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import { getLocalStorage } from "@/utils/helper";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  deleteTrainingCamp,
  clearDeleteState,
} from "@/redux/slices/trainingCamp/trainingCampDeleteSlice";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

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

interface TrainingCampsProps {
  data: RowData[]; // Array of RowData objects
  isEdit: (id: string) => void; // Function type for handling edit action
  teamId?: any;
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  TrainingCampslist: any;
  timeline: any;
}
const TrainingCampsList: React.FC<TrainingCampsProps> = ({
  data,
  isEdit,
  teamId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  TrainingCampslist,
  timeline,
}) => {
  const getCurrentSport = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const TrainingCampsDelete = useSelector(
    (state: RootState) => state.deleteTraningCamps
  );
  const [filterData, setFilterData] = React.useState<any>([]);
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "57vh";
    if (isFullHD) return "62vh";
    if (is3K) return "57vh";
    if (is2K) return "52vh";
    if (isLaptopL) return "57vh";
    if (isLaptop) return "57vh";
    if (isTab) return "53vh";
    return "57vh";
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
      {TrainingCampslist.loading ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: getPageContentHeight(),
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} size="40px" />
        </Box>
      ) : TrainingCampslist.data.length > 0 ? (
        <Box
          sx={{
            mt: 2,
            borderRadius: "8px",
            border: "1px solid rgba(88, 88, 91, 0.2)",
          }}
        >
          <TableContainer
            sx={{
              height: getPageContentHeight(),
              overflowY: "scroll",
              border: "1px solid rgba(88, 88, 91, 0.2)",
              borderRadius: "4px",
            }}
          >
            <Table stickyHeader aria-label="team table">
              <TableHead>
                <TableRow>
                  {!checkAccess(USER_PERMISSION.TrainingCampView) &&
                  !checkAccess(USER_PERMISSION.TrainingCampEdit) &&
                  !checkAccess(USER_PERMISSION.TrainingCampDelete)
                    ? [
                        "Camp Name",
                        "Start Date",
                        "End Date",
                        "Duration",
                        "Location",
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
                      ))
                    : [
                        "Camp Name",
                        "Start Date",
                        "End Date",
                        "Duration",
                        "Location",
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
                  filterData.map((row: any, index: any) => (
                    <TableRow
                      key={index}
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
                          {row.campName || "--"}
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
                          {row.campStartDate || "--"}
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
                          {row.campEndDate || "--"}
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
                          {row.campStartDate && row.campEndDate
                            ? `${moment(row.campEndDate, "DD/MM/YYYY").diff(
                                moment(row.campStartDate, "DD/MM/YYYY"),
                                "days"
                              )} days`
                            : "--"}
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
                          {row.campCity || "--"}
                        </Typography>
                      </TableCell>
                      {checkAccess(USER_PERMISSION.TrainingCampView) ||
                      checkAccess(USER_PERMISSION.TrainingCampEdit) ||
                      checkAccess(USER_PERMISSION.TrainingCampDelete) ? (
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {checkAccess(USER_PERMISSION.TrainingCampView) ? (
                            <Tooltip title={"View"}>
                              <IconButton
                                aria-label="view"
                                size="small"
                                sx={{ width: "16px", height: "16px" }}
                              >
                                <VisibilityIcon
                                  onClick={() => {
                                    router.push(
                                      `/teams/${getCurrentSport}/trainingCamp/view/${row.trainingCampID}`
                                    );
                                  }}
                                  sx={{ color: "#05868E" }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                          {checkAccess(USER_PERMISSION.TrainingCampEdit) ? (
                            <Tooltip title={"Edit"}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => isEdit(row.trainingCampID)}
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
                          ) : (
                            <Box
                              sx={{ display: "inline-block", width: "16px" }}
                            />
                          )}
                          {checkAccess(USER_PERMISSION.TrainingCampDelete) ? (
                            <ReusableDeleteDialog
                              title={`Training Camp`}
                              confirmationMessage="Are you sure, Do you want to delete?"
                              successMessage="Training Camp Deleted Successfully"
                              name={row.campName}
                              icon={<DeleteIcon />}
                              revertMessage={`Once the Training Camp is deleted, you cannot not revert.`}
                              deleteAction={(payload: any) =>
                                dispatch(deleteTrainingCamp(payload))
                              }
                              fetchAfterDelete={() => {
                                const payload: any = {
                                  trainingCampType: timeline,
                                  sportID: Number(teamId),
                                  searchText: "",
                                  filteredBy: "",
                                  paginationCount: 10,
                                  paginationIndex: 1,
                                };
                                dispatch(
                                  getTraningCampListAPI({
                                    url: "/GetTrainingCampList",
                                    payload,
                                  })
                                );
                              }}
                              deleteResponse={TrainingCampsDelete}
                              clearDeleteState={() =>
                                dispatch(clearDeleteState())
                              }
                              payload={{
                                trainingCampID: row.trainingCampID,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{ display: "inline-block", width: "16px" }}
                            />
                          )}
                        </TableCell>
                      ) : null}
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
        </Box>
      ) : (
        <Box
          bgcolor={"#FFFFFF"}
          height={{ xs: "58vh", lg: "58vh", xl: "65vh" }}
          mt={0.5}
        >
          <Alert
            className="dubai-med"
            severity="info"
          >{`No Training camp created for this sport yet.`}</Alert>
        </Box>
      )}
    </>
  );
};

export default TrainingCampsList;

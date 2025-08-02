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
  Avatar,
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import PaginationComponent from "@/components/PaginationComponent";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEqual } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import { getLocalStorage, getTestName } from "@/utils/helper";
import { viewTestAndMedicalChecks } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksListSlice";
import {
  clearDeleteestAndMedicalChecksState,
  deleteTestAndMedicalChecksById,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksDeleteSlice";
import TestStatusChip from "./TestStatusChip";
import { useEffect } from "react";
import XlsSVG from "../../../public/XlsSVG.svg";
import Axios from "../../utils/axiosFileInstance";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
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

const TestAndMedicalsTestList: React.FC<any> = ({
  data,
  isEdit,
  teamId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  getTestAndMedicalCheckssListData,
  searchText,
  setSearchText,
  handleFilterClick,
  testType,
  filterByData,
}) => {
  const getCurrentSport = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const deleteTestAndMedicalChecksData = useSelector(
    (state: RootState) => state.deleteTestAndMedicalCheckss
  );
  const [filterData, setFilterData] = React.useState<any>([]);

  const getTestPathName = () => {
    return getTestName(String(testType));
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

  useEffect(() => {
    if (testType === "fitness") {
      if (data && data?.length) {
        setFilterData(data);
      }
    } else {
      const startIndex = (page - 1) * rowsPerPage + 1;
      const endIndex = startIndex + rowsPerPage - 1;
      setFilterData(data?.slice(startIndex - 1, endIndex));
    }
  }, [data, page, rowsPerPage]);

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();

  const downloadExcel = async () => {
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportTestAndMedicals`,
        {
          sportID: testType === "fitness" ? 0 : Number(teamId),
          searchText: "",
          filteredBy: Array.isArray(filterByData) ? filterByData.join(",") : "",
          section: testType,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName =
        testType === "fitness" ? "Fitness.xlsx" : "TestAndMedicalChecks.xlsx";
      link.setAttribute("download", fileName);
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
  return (
    <>
      {(checkAccess(USER_PERMISSION.TestMedicalChecksView) &&
        testType !== "fitness") ||
        (checkAccess(USER_PERMISSION.FitnessNutritionView) &&
          testType === "fitness") ? (<Box
            display="flex"
            justifyContent="flex-end"
            p={1}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Button
              variant="outlined"
              disabled={!filterData?.length}
              onClick={downloadExcel}
              className="text-capitalize dubai-med export-button"
              sx={{ borderRadius: "43px", height: "44px" }}
              startIcon={<XlsSVG width="25px" height="25px" />}
            >
              {"Export to Excel"}
            </Button>
          </Box>) : null}
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
              {["Name", "Last Test Date", "Last Test Status", "Actions"].map(
                (header) => (
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
                      p: 1.25,
                    }}
                    className="bukra"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {getTestAndMedicalCheckssListData.loading ? (
              <Box
                display={"grid"}
                sx={{
                  placeContent: "center",
                  alignContent: "center",
                  height: {
                    xs: "58vh",
                    lg: "65.5vh",
                    xl: "75vh",
                  },
                  backgroundColor: "#FFFFFF",
                }}
              >
                <CircularProgress sx={{ color: "#008755" }} size="40px" />
              </Box>
            ) : !_.isEmpty(filterData) ? (
              filterData.map((row: any, index: any) => (
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
                      alt={row.athleteProfileImage}
                      src={row.athleteProfileImage}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Tooltip
                      title={`${row.athleteMiddleName} ${row.athleteSurName}`}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#58585B",
                          ml: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "180px",
                        }}
                        className="dubai-regular text-capitalize"
                      >
                        {`${row.athleteFirstName} ${row.athleteMiddleName} ${row.athleteSurName}`}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell sx={{ p: 1.25 }}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      {row.testDate || "--"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#58585B",
                      p: 1.25,
                    }}
                    className="dubai-regular"
                  >
                    <TestStatusChip status={row.medicalClearanceStatus} />
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                    {(checkAccess(USER_PERMISSION.TestMedicalChecksView) &&
                      row.section !== "fitness") ||
                      (checkAccess(USER_PERMISSION.FitnessNutritionView) &&
                        row.section === "fitness") ? (
                      <Tooltip title={"View"}>
                        <IconButton
                          aria-label="view"
                          size="small"
                          sx={{ width: "16px", height: "16px" }}
                        >
                          <VisibilityIcon
                            onClick={() => {
                              const route =
                                row.section === "fitness"
                                  ? `/fitness-and-nutrition/view/fitness/${row.testAndMedicalChecksID}?sportID=${row.sportID}`
                                  : `/teams/${getCurrentSport}/testAndMedicalChecks/view/${row.section}/${row.testAndMedicalChecksID}`;

                              router.push(route);
                            }}
                            sx={{ color: "#05868E" }}
                          />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Box sx={{ display: "inline-block", width: "16px" }} />
                    )}

                    {(checkAccess(USER_PERMISSION.TestMedicalChecksEdit) &&
                      row.section !== "fitness") ||
                      (checkAccess(USER_PERMISSION.FitnessNutritionEdit) &&
                        row.section === "fitness") ? (
                      <Tooltip title={"Edit"}>
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() =>
                            isEdit(row.testAndMedicalChecksID, row.sportID)
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
                    ) : (
                      <Box sx={{ display: "inline-block", width: "16px" }} />
                    )}

                    {(checkAccess(USER_PERMISSION.TestMedicalChecksDelete) &&
                      row.section !== "fitness") ||
                      (checkAccess(USER_PERMISSION.FitnessNutritionDelete) &&
                        row.section === "fitness") ? (
                      <ReusableDeleteDialog
                        title={
                          row.section === "fitness"
                            ? row.section
                            : getTestName(String(testType))
                        }
                        confirmationMessage="Are you sure, Do you want to delete?"
                        successMessage={`${row.section === "fitness"
                          ? "Fitness"
                          : getTestName(String(row.section))
                          } Deleted Successfully`}
                        name={`${row.athleteFirstName} ${row.athleteMiddleName} ${row.athleteSurName}`}
                        icon={<DeleteIcon />}
                        revertMessage={`once is deleted, you cannot revert.`}
                        deleteAction={(payload: any) =>
                          dispatch(deleteTestAndMedicalChecksById(payload))
                        }
                        fetchAfterDelete={() =>
                          dispatch(
                            viewTestAndMedicalChecks({
                              url: "/GetTestAndMedicalCheckstList",
                              payload: {
                                sportID: Number(teamId) || 0,
                                searchText: "",
                                filteredBy: "",
                                paginationCount: 10,
                                paginationIndex: page,

                                section: testType,
                              },
                            })
                          )
                        }
                        deleteResponse={deleteTestAndMedicalChecksData}
                        clearDeleteState={(payload: any) =>
                          dispatch(clearDeleteestAndMedicalChecksState())
                        }
                        payload={{
                          testAndMedicalChecksID: row.testAndMedicalChecksID,

                          section: testType,
                        }}
                      />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "rgba(0, 0, 0, 0.6)",
                    }}
                    className="dubai-med"
                  >
                    {
                      `No ${getTestPathName()} record(s) found.`
                    }
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
          endIndex={Math.min(
            endIndex,
            testType === "fitness"
              ? getTestAndMedicalCheckssListData?.totalRecords || 0
              : data?.length || 0
          )}
          totalItems={
            testType === "fitness"
              ? getTestAndMedicalCheckssListData?.totalRecords
              : data?.length
          }
        />
      </TableContainer>
    </>
  );
};

export default TestAndMedicalsTestList;

"use client";
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
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PaginationComponent from "@/components/PaginationComponent";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { getLocalStorage } from "@/utils/helper";
import SpeedometerOverWeight from "../../../public/speedometerOverWeight.svg";
import SpeedometerLowWeight from "../../../public/speedometerLowWeight.svg";
import SpeedometerNormalWeight from "../../../public/speedometerNormalWeight.svg";
import SpeedometerHeavyWeight from "../../../public/speedometerHeavyWeight.svg";
import {
  deleteNutritionById,
  clearDeleteState,
} from "@/redux/slices/nutrition/NutritionDeleteSlice";
import { listNutrition } from "@/redux/slices/nutrition/NutritionListSlice";
import DeleteNutrition from "./deleteNutrition";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import XlsSVG from "../../../public/XlsSVG.svg";

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

interface TeamsTableProps {
  data: RowData[];
  isEdit: (id: string) => void;
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  dataList: any;
  isLoading: any;
  isDisable?: boolean;
  module: string;
  headers?: any;
  memoizedSelectedSport: any,
  debouncedSearchText: any,
  filterNutritionData: any,
  teamID?: number
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
  memoizedSelectedSport,
  debouncedSearchText,
  filterNutritionData,
  teamID
}) => {
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "59vh";
    if (isFullHD) return "63.5vh";
    if (is3K) return "59vh";
    if (is2K) return "54.5vh";
    if (isLaptopL) return "59vh";
    if (isLaptop) return "59vh";
    if (isTab) return "55vh";
    return "55vh";
  };

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
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();
  const { pageView } = router.query;
  const getCurrentSport = getLocalStorage("sport");
  const deleteNutrition = useSelector(
    (state: RootState) => state.deleteNutrition
  );
  const downloadExcel = async () => {
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportNutritionList`,
        {
          sportID: memoizedSelectedSport.join(","),
          searchText: debouncedSearchText !== "" ? debouncedSearchText : "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          startDate: filterNutritionData.startDate
            ? filterNutritionData.startDate
            : "",
          endDate: filterNutritionData.endDate ? filterNutritionData.endDate : "",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = "exportNutritionList.xlsx";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("An error occurred while downloading the Excel file:", error);
      alert("Failed to download the file. Please try again later.");
    }
  };


  const capitalize = (str?: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  }

  const handlePlanTemplate = () => {
    router.push(`/teams/${teamID}/nutrition/planTemplate`);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={1}
        pb={2}
        flexDirection={"row"}
        alignItems={"center"}
      >
        {!!teamID ? <Button
          variant="outlined"
          className="text-capitalize dubai-med"
          sx={{
            mr: 2,
            borderRadius: "4px",
            height: "44px",
            fontSize: "18px",
          }}
          onClick={handlePlanTemplate}
        >
          Manage Plan Template
        </Button> : null}
        <Button
          variant="outlined"
          // disabled={!filterData?.length}
          onClick={downloadExcel}
          className="text-capitalize dubai-med export-button"
          sx={{ borderRadius: "43px", height: "44px" }}
          startIcon={<XlsSVG width="25px" height="25px" />}
        >
          {"Export to Excel"}
        </Button>
      </Box>
      <Box>
        {isLoading ? (
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
        ) : (
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
                  {headers.map((header: any) => (
                    <TableCell
                      key={header}
                      align={header === "Name" ? "center" : "left"}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: "bold",
                        width:
                          header === "Name"
                            ? "240px"
                            : header === "Role"
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
                          alt={row.athlete}
                          src={row.athleteProfileImage}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Tooltip title={`${row?.athleteFirstName} ${capitalize(row?.athleteMiddleName)} ${capitalize(row?.athleteSurName)}`}>
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
                            {`${row?.athleteFirstName}`}{" "}
                            {`${row?.athleteMiddleName}`} {`${row?.athleteSurName}`}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Tooltip title={`${row.planName}`}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#000000",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "180px",
                            }}
                            className="dubai-regular"
                          >
                            {row.planName || "--"}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#000000",
                          }}
                          className="dubai-regular"
                        >
                          {row.startDate || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#000000",
                          }}
                          className="dubai-regular"
                        >
                          {row.endDate || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }} className="speedometer-logo">
                        {Number(row?.bmi < 18.5) ? (
                          <SpeedometerLowWeight />
                        ) : Number(row?.bmi >= 18.5 && row?.bmi <= 25) ? (
                          <SpeedometerNormalWeight />
                        ) : Number(row?.bmi >= 25 && row?.bmi <= 30) ? (
                          <SpeedometerOverWeight />
                        ) : Number(row?.bmi >= 30) ? (
                          <SpeedometerHeavyWeight />
                        ) : (
                          <SpeedometerLowWeight />
                        )}
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#000000",
                            mt: -0.5,
                            ml: 1.5,
                          }}
                          className="bukra-semi-bold"
                        >
                          {row.bmi || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        {(checkAccess(USER_PERMISSION.NutritionPlanView) && module !== "nutrition-table") ||
                          (checkAccess(USER_PERMISSION.FitnessNutritionView) && module === "nutrition-table") ?
                          <Tooltip title={"View"}>
                            <IconButton
                              aria-label="view"
                              sx={{ width: "16px", height: "16px" }}
                            >
                              <VisibilityIcon
                                onClick={() => {
                                  const route =
                                    module == "nutrition-table"
                                      ? `/fitness-and-nutrition/view/nutrition/${row?.nutritionID}?sportID=${row.sportID}&pageView=${pageView}`
                                      : `/teams/${getCurrentSport}/nutrition/view/${row.nutritionID}`;

                                  router.push(route);
                                }}
                                sx={{ color: "#05868E" }}
                              />
                            </IconButton>
                          </Tooltip> : (
                            <Box sx={{ display: "inline-block", width: "16px" }} />
                          )}
                        {module !== "nutrition-table" && (
                          <>
                            {checkAccess(USER_PERMISSION.NutritionPlanEdit) ?
                              <Tooltip title={"Edit"}>
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  onClick={() => isEdit(row.nutritionID)}
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
                            {checkAccess(USER_PERMISSION.NutritionPlanDelete) ?
                              <DeleteNutrition
                                data={row}
                                dispatchDelete={deleteNutritionById}
                                deleteResponse={deleteNutrition}
                                clearDelete={clearDeleteState}
                                module={"nutritionID"}
                                dispatchList={listNutrition}
                                title={"Nutrition Plan"}
                                listUrl={"/GetNutritionList"}
                                getCurrentSport={getCurrentSport}
                                buttonIcon={"table"}
                              /> : null}
                          </>)}
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
        )}
      </Box>
    </>
  );
};

export default TeamsTable;

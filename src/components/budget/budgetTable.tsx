import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import StatusChip from "../statusChip";
import PaginationComponent from "../PaginationComponent";
import XlsSVG from "../../../public/XlsSVG.svg";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import Axios from "../../utils/axiosFileInstance";
import { checkAccess } from "@/utils/acessscheck";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { USER_PERMISSION } from "@/utils/constants";

interface BudgetProps {
  teamID?: any;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
  budgetsList?: any;
  searchText?: any;
}

const BudgetTable: React.FC<BudgetProps> = ({
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  searchText,
  budgetsList,
  teamID,
}) => {
  const router = useRouter();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "58.5vh";
    if (isFullHD) return "63vh";
    if (is3K) return "58.5vh";
    if (is2K) return "54.5vh";
    if (isLaptopL) return "58.5vh";
    if (isLaptop) return "58.5vh";
    if (isTab) return "54.5vh";
    return "58.5vh";
  };
  const [downloading, setDownloading] = useState<boolean>(false);
  const headers = [
    "Budget Name",
    "Created By",
    "Created Date",
    "Budget Type",
    "Approval Status",
    "Total Amount",
    "Actions",
  ];

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const downloadBudgetExcel = async () => {
    setDownloading(true);
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportBudgetList`,
        {
          sportID: Number(teamID),
          searchText: "",
          filteredBy: "",
          paginationIndex: 1,
          paginationCount: 0,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BudgetList.xlsx");
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
      setDownloading(false);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "17px",
            paddingLeft: "20px"
          }}
        >
          <Typography
            gutterBottom
            className="bukra"
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "100%",
              color: "#000000",
              marginBottom: "0px"
            }}
          >
            Approved Grand Total :
            <span
              className="bukra"
              style={{
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "100%",
                color: "#008755",
                paddingLeft: "5px",
                marginBottom: "0px"
              }}>
              {budgetsList?.approvedGrandTotal ? budgetsList?.approvedGrandTotal : ""}
            </span>
          </Typography>
          {checkAccess(USER_PERMISSION.BudgetView) ? <Button
            variant="outlined"
            className="text-capitalize dubai-med export-button"
            sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
            startIcon={<XlsSVG width="25px" height="25px" />}
            disabled={isEmpty(budgetsList.data) || downloading}
            onClick={downloadBudgetExcel}
          >
            {downloading ? "Downloading..." : "Export to Excel"}
          </Button> : null}
        </Box>
        <Box
          sx={{
            paddingX: 2,
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
                  {headers.map((header: any) => (
                    <TableCell
                      key={header}
                      align={"left"}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                        fontSize: "13px",
                        width:
                          header === "Budget Name"
                            ? "223px"
                            : header === "Created By"
                              ? "196px"
                              : header === "Actions"
                                ? "60px"
                                : "164px",
                        p: 1.25,
                        color: "#000000",
                      }}
                      className="bukra"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {budgetsList &&
                  budgetsList?.data &&
                  budgetsList?.data.length > 0 &&
                  budgetsList?.data.map((budget: any, index: any) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#EDFFFC" },
                      }}
                    >
                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                          }}
                          className="dubai-regular"
                        >
                          {budget.budgetName || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Tooltip
                          title={`${budget.createdby} ${budget.createdByFirstName} ${budget.createdByMiddleName} ${budget.createdBySurName}`}
                        >
                          <Typography
                            sx={{
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
                            {`${budget.createdby} ${budget.createdByFirstName} ${budget.createdByMiddleName} ${budget.createdBySurName}`}
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
                          {budget.budgetCreatedDate || "--"}
                        </Typography>
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
                          {budget.budgetType || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "rgba(0, 0, 0, 1)",
                          p: 1.25,
                        }}
                        className="dubai-regular"
                      >
                        <Box display="flex" flexDirection="column" gap={2}>
                          {budget.statusText == "Approved" ? (
                            <StatusChip status="Approved" />
                          ) : budget.statusText == "Pending" ? (
                            <StatusChip status="Pending" />
                          ) : budget.statusText == "Rejected" ? (
                            <StatusChip status="Rejected" />
                          ) : (
                            <Chip
                              className="dubai-regular status-chip text-capitalize"
                              label={"---"}
                            />
                          )}
                        </Box>
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
                          {budget.grandTotal || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        <>
                          {checkAccess(USER_PERMISSION.BudgetView) ? <IconButton
                            aria-label="view"
                            sx={{ width: "16px", height: "16px" }}
                          >
                            <VisibilityIcon
                              onClick={() => {
                                router.push(
                                  `/teams/${teamID}/budget/view/${budget.budgetID}`
                                );
                              }}
                              sx={{ color: "#05868E" }}
                            />
                          </IconButton> : null}
                          {/* 1046 means access to edit budget */}
                          {budget?.statusText !== "Rejected" &&
                            checkAccess(USER_PERMISSION.BudgetEdit) ? (
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() => {
                                router.push(
                                  `/teams/${teamID}/budget/edit/${budget.budgetID}`
                                );
                              }}
                              sx={{
                                width: "16px",
                                height: "16px",
                                mx: 1,
                                color: "#05868E",
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          ) : null
                          }
                        </>
                      </TableCell >
                    </TableRow >
                  ))}
              </TableBody >
            </Table >
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              startIndex={startIndex}
              endIndex={
                !isEmpty(searchText)
                  ? budgetsList &&
                  budgetsList?.data &&
                  budgetsList?.data?.length
                  : endIndex > budgetsList?.totalRecords
                    ? budgetsList?.totalRecords
                    : endIndex
              }
              totalItems={
                !isEmpty(searchText)
                  ? budgetsList &&
                  budgetsList?.data &&
                  budgetsList?.data?.length
                  : Number(budgetsList && budgetsList?.totalRecords)
              }
            />
          </TableContainer >
        </Box >
      </Box >
    </>
  );
};

export default BudgetTable;

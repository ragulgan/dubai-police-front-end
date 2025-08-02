import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import _, { isEmpty } from "lodash";
import { useRouter } from "next/router";
import StatusChip from "../statusChip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLocalStorage } from "@/utils/helper";
import TeamRequirementEditDrawer from "./edit/teamRequirementDrawer";
import PaginationComponent from "../PaginationComponent";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
// import { deleteTeamRequirement } from "@/redux/slices/trainingCamp/teamRequirementDeleteSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTeamRequirementListAPI } from "@/redux/slices/teamRequirement/getTeamRequirementListSlice";
import {
  clearDeleteState,
  deleteTeamRequirement,
} from "@/redux/slices/teamRequirement/teamRequirementDeleteSlice";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import TableSkeleton from "../skeleton/TableSkeleton";

interface TeamRequirementsProps {
  isDataLoading: boolean;
  data: any;
  teamID?: any;
  isEdit: (id: string) => void;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
}

const TeamRequirementList: React.FC<TeamRequirementsProps> = ({
  isDataLoading,
  data,
  teamID,
  isEdit,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
}) => {
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "54vh";
    if (isFullHD) return "59vh";
    if (is3K) return "54vh";
    if (is2K) return "50vh";
    if (isLaptopL) return "54vh";
    if (isLaptop) return "54vh";
    if (isTab) return "50vh";
    return "54vh";
  };
  const [filterData, setFilterData] = React.useState<any>([]);
  const [isSupervisor, setisSupervisor] = React.useState<any>(false);

  const TeamRequirementDelete = useSelector(
    (state: RootState) => state.deleteTeamRequirement
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  React.useEffect(() => {
    const sliceIndexStart = page >= 1 ? (page - 1) * rowsPerPage : 0;
    const sliceIndexEnd = sliceIndexStart + rowsPerPage;
    if (data && data.length) {
      setFilterData(data.slice(sliceIndexStart, sliceIndexEnd));
    }
  }, [data, page, rowsPerPage]);

  return (
    <>
      {isDataLoading ? (
        <Box
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: getPageContentHeight(),
            backgroundColor: "#FFFFFF",
          }}
        >
          <TableSkeleton />
        </Box>
      ) : null}

      {!isDataLoading ? (
        <TableContainer
          sx={{
            height: getPageContentHeight(),
            border: "1px solid rgba(88, 88, 91, 0.2)",
            borderRadius: "4px",
            overflowX: "scroll",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Requirements",
                  "Requested By",
                  "Priority Level",
                  "Quantity",
                  "Shipment Status",
                  "Required Date",
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
                      width: header === "Requested By" ? "200px" : "60px",
                    }}
                    className="bukra"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(!isDataLoading && filterData?.length === 0) ||
                (!isDataLoading && data?.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Alert className="dubai-med" severity="info">
                      No records found
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : null}
              {!_.isEmpty(filterData) &&
                filterData?.length > 0 &&
                data?.length > 0
                ? filterData?.map((row: any, index: any) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                    }}
                  >
                    <TableCell width={"30px"} height={"12px"}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          textAlign: "left",
                          color: "#58585B",
                        }}
                        className="dubai-regular"
                      >
                        {row?.requirementName || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: "bold",
                        color: "#58585B",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "left",
                          gap: "8px",
                        }}
                      >
                        <Avatar
                          src={row.imageUrl}
                          alt={row.requestedBy}
                          sx={{ width: 40, height: 40, radius: "200px" }}
                        />
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="left"
                          width="93px"
                          height="32px"
                          gap="4px"
                          paddingTop={"3px"}
                        >
                          <Typography
                            className="dubai-regular"
                            sx={{
                              color: "#58585B",
                              fontWeight: "500",
                              fontSize: "16px",
                              lineHeight: "16px",
                            }}
                          >
                            {row.requestedFirstname || row.requestedSurname
                              ? `${row?.requestedFirstname || "--"} ${row?.requestedSurname || "--"
                              }`
                              : "--"}
                          </Typography>
                          <Typography
                            className="dubai-regular"
                            sx={{
                              color: "#58585B",
                              fontWeight: "400",
                              fontSize: "12px",
                              lineHeight: "12px",
                            }}
                          >
                            {row?.requestedRole || "--"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "53px", height: "27px" }}>
                      <Typography
                        className="dubai-regular text-capitalize"
                        sx={{
                          color: "#58585B",
                          fontWeight: "400",
                          fontSize: "16px",
                          lineHeight: "27px",
                        }}
                      >
                        {row?.priorityLevel || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "9px", height: "27px" }}>
                      <Typography
                        className="dubai-regular"
                        sx={{
                          fontSize: "16px",
                          lineHeight: "27px",
                          fontWeight: 400,
                          color: "#58585B",
                        }}
                      >
                        {row?.quantityRequired || "--"}
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
                      className="dubai-regular"
                    >
                      <Box display="flex" flexDirection="column" gap={2}>
                        {row?.shipmentStatusText == "Fulfilled" ? (
                          <StatusChip status="Fulfilled" />
                        ) : row?.shipmentStatusText == "Pending" ? (
                          <StatusChip status="Pending" />
                        ) : row?.shipmentStatusText == "Cancelled" ? (
                          <StatusChip status="Cancelled" />
                        ) : (
                          <Chip
                            className="dubai-regular status-chip text-capitalize"
                            label={"---"}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell width={"86px"} height={"27px"}>
                      <Typography
                        className="dubai-regular"
                        sx={{
                          fontSize: "16px",
                          lineHeight: "16px",
                          fontWeight: 400,
                          color: "#58585B",
                        }}
                      >
                        {row?.requiredDate || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                      {checkAccess(USER_PERMISSION.TeamRequirementsView) ? (
                        <IconButton
                          aria-label="view"
                          size="small"
                          sx={{ width: "16px", height: "16px", pr: 2.5 }}
                        >
                          <VisibilityIcon
                            sx={{ color: "#05868E" }}
                            onClick={() => {
                              router.push(
                                `/teams/${getCurrentSport}/teamRequirements/view/${row.teamRequirementID}`
                              );
                            }}
                          />
                        </IconButton>
                      ) : null}
                      {isSupervisor ? (
                        <>
                          <IconButton
                            size="small"
                            sx={{ width: "16px", height: "16px", pr: 3 }}
                          >
                            <CheckIcon sx={{ color: "green" }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ width: "16px", height: "16px", pr: 3 }}
                          >
                            <CloseIcon sx={{ color: "red" }} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {checkAccess(USER_PERMISSION.TeamRequirementsEdit) &&
                            row?.shipmentStatusText !== "Cancelled" &&
                            row?.shipmentStatusText !== "Fulfilled" && (
                              <IconButton
                                aria-label="edit"
                                size="small"
                                sx={{ width: "16px", height: "16px", pr: 2 }}
                                onClick={() => isEdit(row?.teamRequirementID)}
                              >
                                <EditIcon sx={{ color: "#05868E" }} />
                              </IconButton>
                            )}
                          {checkAccess(
                            USER_PERMISSION.TeamRequirementsDelete
                          ) ? (
                            <ReusableDeleteDialog
                              title={`Team Requirement`}
                              confirmationMessage="Are you sure, Do you want to delete?"
                              successMessage="Team Requirement Deleted Successfully"
                              name={row.requirementName}
                              icon={<DeleteIcon />}
                              revertMessage={`Once the Team Requirement is deleted, you cannot not revert.`}
                              deleteAction={(payload: any) =>
                                dispatch(
                                  deleteTeamRequirement({
                                    url: "/DeleteTeamRequirementsByID",
                                    payload,
                                  })
                                )
                              }
                              fetchAfterDelete={() => {
                                const payload = {
                                  sportID: Number(teamID),
                                  searchText: "",
                                  filteredBy: "",
                                  paginationIndex: 0,
                                  paginationCount: 0,
                                };
                                dispatch(
                                  getTeamRequirementListAPI({
                                    url: "/GetTeamRequirementsList",
                                    payload,
                                  })
                                );
                              }}
                              deleteResponse={TeamRequirementDelete}
                              clearDeleteState={() =>
                                dispatch(clearDeleteState())
                              }
                              payload={{
                                teamRequirementID: row?.teamRequirementID,
                              }}
                            />
                          ) : null}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
                : null}
            </TableBody>
          </Table>
          {!_.isEmpty(data) && (
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              startIndex={startIndex}
              endIndex={endIndex > data?.length ? data?.length : endIndex}
              totalItems={data && data.length ? data.length : 0}
            />
          )}
        </TableContainer>
      ) : (
        ""
      )}
    </>
  );
};

export default TeamRequirementList;

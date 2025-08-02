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
import { Avatar, Box, Fade, Tooltip, Typography } from "@mui/material";
import PaginationComponent from "@/components/PaginationComponent";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteGoalsTargetsById,
  clearDeleteState,
} from "@/redux/slices/goalsTargets/goalsTargetsDeleteSlice";
import { listGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsListSlice";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import { getLocalStorage } from "@/utils/helper";
import TournamentImage from "../../../public/teamImage.png";
import Image from "next/image";
import AppAddButton from "../buttons/AppAddButton";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import GoalStatusChip from "./GoalStatusChip";
import ModuleFilterButton from "../buttons/ModuleFilterButton";
import ModuleSearchInput from "../search/ModuleSearchInput";
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

interface GoalsTargetsProps {
  data: RowData[]; // Array of RowData objects
  isEdit: (id: string) => void; // Function type for handling edit action
  teamId?: any;
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  GoalsTargetslist: any;
  seasonID: any;
  searchText?: any;
  setSearchText?: any;
  handleFilterClick?: any;
}
const GoalsTargets: React.FC<GoalsTargetsProps> = ({
  data,
  isEdit,
  teamId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  GoalsTargetslist,
  seasonID,
  searchText,
  setSearchText,
  handleFilterClick,
}) => {
  const getCurrentSport = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsDelete = useSelector(
    (state: RootState) => state.deleteGoalsTargets
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
      <Box
        sx={{
          mt: 2,
          borderRadius: "8px",
          border: "1px solid rgba(88, 88, 91, 0.2)",
        }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          borderBottom={"1px solid rgba(88, 88, 91, 0.2)"}
        >
          <Typography
            className="bukra table-list-header header-border-right"
            p={2}
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
          >
            Individual Goals
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {!isEmpty(GoalsTargetslist) &&
              searchText === "" &&
              isEmpty(filterData)
              ? GoalsTargetslist.totalRecords
              : !isEmpty(data) && data.length}{" "}
            Goals
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Goal, Status.."}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter goals by status"}
          />
          {checkAccess(USER_PERMISSION.GoalsTargetsAdd) ? <AppAddButton
            label=" Create Individual Goals"
            onClick={() =>
              router.push(
                `/teams/${teamId}/goalsTargets/addGoalsTargets?seasonID=${seasonID}`
              )
            }
          /> : null}
        </Box>
        {GoalsTargetslist && GoalsTargetslist.loading ? (
          <Box
            sx={{
              alignContent: "center",
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
        ) : null}
        <Fade in={true} timeout={1000}>
          <TableContainer>
            <Table stickyHeader aria-label="team table">
              <TableHead>
                <TableRow>
                  {[
                    "Name",
                    "Goal",
                    "Start Date",
                    "End Date",
                    "Status",
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
                {!_.isEmpty(filterData)
                  ? filterData.map((row: any, index: any) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                      }}
                    >
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.25,
                        }}
                      >
                        {row.goalType === "team" ? (
                          <Image
                            alt="Profile Image"
                            src={TournamentImage}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <Avatar
                            alt={row.athleteProfileImage}
                            src={row.athleteProfileImage}
                            sx={{ width: 40, height: 40 }}
                          />
                        )}
                        <Tooltip
                          title={`${row.goalType === "team"
                              ? row.sportName
                              : row.athleteFirstName
                            } ${row.goalType === "team"
                              ? ""
                              : row.athleteMiddleName
                            } ${row.goalType === "team" ? "" : row.athleteSurName
                            }`}
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
                              width: "180px",
                            }}
                            className="dubai-med text-capitalize"
                          >
                            {`${row.goalType === "team"
                                ? row.sportName
                                : row.athleteFirstName
                              } ${row.goalType === "team"
                                ? ""
                                : row.athleteMiddleName
                              } ${row.goalType === "team"
                                ? ""
                                : row.athleteSurName
                              }`}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Tooltip title={`${row.goalName}`}>
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
                            {row.goalName || "--"}
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
                            color: "#58585B",
                          }}
                          className="dubai-med"
                        >
                          {row.endDate || "--"}
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
                        <GoalStatusChip status={row?.status} />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        {checkAccess(USER_PERMISSION.GoalsTargetsView) ? <Tooltip title={"View"}>
                          <IconButton
                            aria-label="view"
                            size="small"
                            sx={{ width: "16px", height: "16px" }}
                          >
                            <VisibilityIcon
                              onClick={() => {
                                router.push(
                                  `/teams/${getCurrentSport}/goalsTargets/view/${row.goalsAndTargetsID}?seasonID=${seasonID}`
                                );
                              }}
                              sx={{ color: "#05868E" }}
                            />
                          </IconButton>
                        </Tooltip> : null}
                        {checkAccess(USER_PERMISSION.GoalsTargetsEdit) ? <Tooltip title={"Edit"}>
                          <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => isEdit(row.goalsAndTargetsID)}
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
                        {checkAccess(USER_PERMISSION.GoalsTargetsDelete) ? <ReusableDeleteDialog
                          title={`Goals & Targets`}
                          confirmationMessage="Are you sure, Do you want to delete?"
                          successMessage="Goals Deleted Successfully"
                          name={row.goalName}
                          icon={<DeleteIcon />}
                          revertMessage={`once is deleted, you can not revert.`}
                          deleteAction={(payload: any) =>
                            dispatch(deleteGoalsTargetsById(payload))
                          }
                          fetchAfterDelete={() =>
                            dispatch(
                              listGoalsTargets({
                                url: "/GetGoalsAndTargetsList",
                                payload: {
                                  sportID: Number(teamId),
                                  goalsAndTargetsSection: "",
                                  searchText: "",
                                  filteredBy: "",
                                  paginationCount: 10,
                                  paginationIndex: 1,
                                  seasonID: seasonID,

                                },
                              })
                            )
                          }
                          deleteResponse={goalsTargetsDelete}
                          clearDeleteState={(payload: any) =>
                            dispatch(clearDeleteState())
                          }
                          payload={{
                            goalsAndTargetsID: row.goalsAndTargetsID,

                            seasonID: seasonID,
                          }}
                        /> : null}
                      </TableCell>
                    </TableRow>
                  ))
                  : null}
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
        </Fade>
      </Box>
    </>
  );
};

export default GoalsTargets;

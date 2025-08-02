import React from "react";
import {
  Avatar,
  Box,
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
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  clearFacilitiesUpdateStatusState,
  updateStatusFacilities,
} from "@/redux/slices/researchFacilities/UpdateFacilitiesStatus";
import CustomSnackbar from "../CustomSnackbar";
import FacilityRejectDialogPage from "./rejectFacilitiesDialog";
import {
  clearRejectFacilityState,
  rejectFacility,
} from "@/redux/slices/researchFacilities/rejectFacilitiesByID";
import FacilityStatusChip from "./facilityStatusChip/facilityStatusChip";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

type FacilitiesTableViewProps = {
  listFacilitiesData: any;
  setViewFacilityID: (id: number) => void;
  setEditFacilityID: (id: number) => void;
  reloadFacilities: () => void;
};

const FacilitiesTableView: React.FC<FacilitiesTableViewProps> = ({
  listFacilitiesData,
  setViewFacilityID,
  setEditFacilityID,
  reloadFacilities,
}) => {
  const updateFacilitiesStatus = useSelector((state: RootState) => {
    return state && state.FacilitiesUpdateStatus;
  });

  const rejectFacilitiesStatus = useSelector((state: RootState) => {
    return state && state.RejectFacilityByID;
  });
  const dispatch: any = useDispatch();
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");

  const headers = [
    "Facility Type",
    "Created By",
    "Status",
    "Date",
    "Time",
    "Actions",
  ];

  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    null
  );
  // const [rejectReasonDialogOpen, setRejectReasonDialogOpen] = useState(false);
  const [updatedStatusResponse, setUpdatedStatusResponse] = useState<any>({});
  const [facilityIDToReject, setFacilityIDToReject] = useState<number | null>(
    null
  );

  const updateFacilityStatus = (
    facilityId: any,
    action: "approve" | "reject"
  ) => {
    setActionType(action);
    const payload = {
      facilityID: facilityId,
      status: action === "approve" ? 1 : 2,
    };

    dispatch(
      updateStatusFacilities({
        url: "/UpdateFacilitiesStatus",
        payload,
      })
    );
  };

  useEffect(() => {
    if (updateFacilitiesStatus && updateFacilitiesStatus.code === 200) {
      if (actionType === "approve") {
        setShowBanner(true);
        setSnackbarStatus("success");
        const successMessage = "Facility Approved successfully!";
        setSnackbarMessage(successMessage);
        setTimeout(() => {
          reloadFacilities();
          dispatch(clearFacilitiesUpdateStatusState());
        }, 1000);
      }
      if (actionType === "reject") {
        setShowBanner(true);
        setSnackbarStatus("success");
        const successMessage = "Facility Rejected successfully!";
        setSnackbarMessage(successMessage);
      }
    } else if (updateFacilitiesStatus && updateFacilitiesStatus.code === 500) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearFacilitiesUpdateStatusState());
        setShowBanner(false);
        setActionType(null);
      }, 3000);
    }
  }, [updateFacilitiesStatus, actionType]);

  const handleCloseBanner = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleRejectRequirement = (reason: string) => {
    const payload: any = {
      facilityID: facilityIDToReject,
      rejectByID: "40",
      rejectByModule: "Coach",
      rejectReason: reason,
    };
    dispatch(
      rejectFacility({
        url: "/RejectReasonForFacilities",
        payload,
      })
    );

    updateFacilityStatus(facilityIDToReject, "reject");
  };

  useEffect(() => {
    if (updateFacilitiesStatus && updateFacilitiesStatus.code === 200) {
      if (actionType === "approve") {
        setShowBanner(true);
        setSnackbarStatus("success");
        const successMessage = "Facility Approved successfully!";
        setSnackbarMessage(successMessage);
        setTimeout(() => {
          reloadFacilities();
          dispatch(clearFacilitiesUpdateStatusState());
        }, 1000);
      }
      if (actionType === "reject") {
        setShowBanner(true);
        setSnackbarStatus("success");
        const successMessage = "Facility Rejected successfully!";
        setSnackbarMessage(successMessage);
      }
    } else if (updateFacilitiesStatus && updateFacilitiesStatus.code === 500) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearFacilitiesUpdateStatusState());
        setShowBanner(false);
        setActionType(null);
      }, 3000);
    }
  }, [updateFacilitiesStatus, actionType]);

  useEffect(() => {
    if (rejectFacilitiesStatus && rejectFacilitiesStatus.code === 200) {
      setTimeout(() => {
        reloadFacilities();
        dispatch(clearRejectFacilityState());
      }, 1000);
    } else if (rejectFacilitiesStatus && rejectFacilitiesStatus.code === 500) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearRejectFacilityState());
        setShowBanner(false);
        setActionType(null);
      }, 3000);
    }
  }, [rejectFacilitiesStatus]);

  return (
    <>
      {/* Reject facility popup */}
      {!!facilityIDToReject ? (
        <FacilityRejectDialogPage
          open={!!facilityIDToReject}
          onClose={() => setFacilityIDToReject(null)}
          facilityID={facilityIDToReject}
          setSelectedFacilityId={setSelectedFacilityId}
          onReject={handleRejectRequirement}
        />
      ) : null}
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? snackbarMessage
              : updateFacilitiesStatus && updateFacilitiesStatus?.message
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={showBanner}
          onClose={handleCloseBanner}
        />
      )}
      <Box
        sx={{
          paddingX: 2,
        }}
      >
        <TableContainer
          sx={{
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
                        header === "Facility Type"
                          ? "178px"
                          : header === "Created By"
                            ? "240px"
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
              {listFacilitiesData &&
                listFacilitiesData.data.map((row: any) => (
                  <TableRow
                    key={row?.facilityID}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#EDFFFC" },
                    }}
                  >
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
                        {row.facilityTypeText === "Others" ? row.othersFacility : row.facilityTypeText  || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ display: "flex", alignItems: "center", p: 1.25 }}
                    >
                      <Avatar
                        alt={row.createdFirstname}
                        src={row.createdProfileimage}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Tooltip
                        title={`${row?.createdRoleShortText} ${row?.createdFirstname} ${row?.createdMiddlename} ${row?.createdSurname}`}
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
                          className="dubai-med text-capitalize"
                        >
                          {`${row?.createdRoleShortText} ${row?.createdFirstname} ${row?.createdMiddlename} ${row?.createdSurname}`}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "rgba(0, 0, 0, 1)",
                        p: 1.25,
                      }}
                      className="dubai-med"
                    >
                      <Box display="flex" flexDirection="column" gap={2}>
                        <FacilityStatusChip status={row?.status} />
                      </Box>
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
                        {row.facilityDate || "--"}
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
                        {`${row.startTime} - ${row.endTime}`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                      {/* approve icon button */}
                      {checkAccess(USER_PERMISSION.FacilitiesApproveReject) && row?.status?.toLowerCase() === "pending" ? (
                        <IconButton
                          size="small"
                          sx={{ width: "16px", height: "16px", pr: 3 }}
                          onClick={() =>
                            updateFacilityStatus(row?.facilityID, "approve")
                          }
                        >
                          <CheckIcon sx={{ color: "green" }} />
                        </IconButton>
                      ) : null}

                      {/* reject icon button */}
                      {checkAccess(USER_PERMISSION.FacilitiesApproveReject) && row?.status?.toLowerCase() === "pending" ? (
                        <IconButton
                          size="small"
                          sx={{ width: "16px", height: "16px", pr: 3 }}
                          onClick={() => {
                            setFacilityIDToReject(row?.facilityID);
                          }}
                        >
                          <CloseIcon sx={{ color: "red" }} />
                        </IconButton>
                      ) : null}

                      {/* View icon button */}
                      {checkAccess(USER_PERMISSION.ResearchFacilitiesView) && row?.status?.toLowerCase() !== "pending" ?
                        <IconButton
                          aria-label="view"
                          sx={{ width: "16px", height: "16px" }}
                          onClick={() => setViewFacilityID(row?.facilityID)}
                        >
                          <VisibilityIcon sx={{ color: "#05868E" }} />
                        </IconButton>
                        : null}

                      {/* Edit icon button */}
                      {checkAccess(USER_PERMISSION.ResearchFacilitiesEdit) &&
                        row?.status?.toLowerCase() !== "pending" &&
                        row.status?.toLowerCase() !== "rejected" &&
                        row.status?.toLowerCase() !== "cancelled" ?
                        <IconButton
                          aria-label="edit"
                          size="small"
                          sx={{
                            width: "16px",
                            height: "16px",
                            mx: 1,
                            color: "#05868E",
                          }}
                          onClick={() => setEditFacilityID(row?.facilityID)}
                        >
                          <EditIcon />
                        </IconButton>
                        : null}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default FacilitiesTableView;

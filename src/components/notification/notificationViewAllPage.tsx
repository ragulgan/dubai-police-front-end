import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle"; // For the green dot
import PaginationComponent from "../PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  clearNotificationUpdateState,
  updateNotification,
} from "@/redux/slices/notification/updateNotificationByIdSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CustomSnackbar from "../CustomSnackbar";

interface NotificationViewProps {
  getNotificationList?: any;
  setFlagData?: any;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
  setIsUpdated?: any;
}

const NotificationViewAllPage: React.FC<NotificationViewProps> = ({
  getNotificationList,
  setFlagData,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  setIsUpdated,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const NotificationUpdateData = useSelector(
    (state: any) => state && state.updateNotificationById
  );
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");

  const [alignment, setAlignment] = React.useState("all");
  const [totalItems, setTotalItems] = useState(
    getNotificationList?.totalRecords
  );

  const handleChange = (event: any, newAlignment: any) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      setFlagData && setFlagData(newAlignment);
    }
    setTotalItems(
      newAlignment === "all"
        ? getNotificationList?.totalRecords
        : getNotificationList?.totalUnseenRecords
    );
  };

  const [selected, setSelected] = useState<number[]>([]);
  const isSelected = (id: number) => selected.includes(id);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = (getNotificationList?.data || []).map(
        (item: any) => item.notificationID
      );
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (notificationID: number) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(notificationID)) {
        return prevSelected.filter((id) => id !== notificationID); // Deselect row
      } else {
        return [...prevSelected, notificationID]; // Select row
      }
    });
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

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  const handleMarkAllAsRead = () => {
    const selectedIdsString = selected.length > 0 ? selected.join(",") : "";
    const payload = {
      flag: "",
      notificationID: selectedIdsString,
    };
    dispatch(updateNotification({ url: "/UpdateNotificationByID", payload }));
  };

  useEffect(() => {
    if (NotificationUpdateData && NotificationUpdateData.code === 200) {
      setShowBanner(true);
      setSnackbarStatus("success");
      setIsUpdated(true);
      setSelected([]);
      setTimeout(() => {
        dispatch(clearNotificationUpdateState());
      }, 3000);
    } else if (NotificationUpdateData && NotificationUpdateData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearNotificationUpdateState());
        setShowBanner(false);
      }, 3000);
    }
  }, [NotificationUpdateData]);

  dayjs.extend(relativeTime);
  const calculateTimeFromNow = (dateOfCreation: any) => {
    const creationTime = dayjs(dateOfCreation, "MM/DD/YYYY HH:mm:ss");
    const now = dayjs();

    if (now.diff(creationTime, "day") < 1) {
      return creationTime?.fromNow();
    }

    return creationTime.format("DD MMM YYYY, hh:mm A");
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        {showBanner && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? `Notifications marked as read!`
                : NotificationUpdateData && NotificationUpdateData?.message
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={showBanner}
            onClose={handleClose}
          />
        )}
        <Grid item xs={8}>
          <ToggleButtonGroup
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{ width: "128.03px", height: "32px" }}
          >
            <ToggleButton
              value="all"
              sx={{
                backgroundColor:
                  alignment === "all" ? "#008755" : "transparent", // Active color
                color: alignment === "all" ? "white" : "black", // Text color
                "&:hover": {
                  backgroundColor:
                    alignment === "all" ? "green" : "rgba(25, 118, 210, 0.1)",
                },
                textTransform: "none",
              }}
              className="dubai-med"
            >
              All
            </ToggleButton>
            <ToggleButton
              value="unread"
              sx={{
                backgroundColor:
                  alignment === "unread" ? "#008755" : "transparent", // Active color
                color: alignment === "unread" ? "white" : "black", // Text color
                "&:hover": {
                  backgroundColor:
                    alignment === "unread"
                      ? "green"
                      : "rgba(25, 118, 210, 0.1)",
                },
                textTransform: "none",
              }}
              className="dubai-med"
            >
              Unread
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={4}>
          <Box
            className="dubai-med"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#00205B",
              cursor: "pointer",
              textAlign: "right",
              paddingTop: "10px",
            }}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid #D0D7DE",
                borderRadius: "6px",
                boxShadow: "none",
              }}
            >
              {Array.isArray(getNotificationList?.data) &&
              getNotificationList?.data?.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell
                        padding="checkbox"
                        sx={{
                          paddingLeft: "14px",
                        }}
                      >
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length <
                              (getNotificationList?.data?.length || 0)
                          }
                          checked={
                            selected.length > 0 &&
                            selected.length ===
                              (getNotificationList?.data?.length || 0)
                          }
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      <TableCell
                        className="dubai-med"
                        sx={{
                          fontSize: "16px",
                          fontWeight: 500,
                          lineHeight: "18px",
                        }}
                      >
                        Select all
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(getNotificationList?.data)
                      ? getNotificationList?.data?.map((notification: any) => (
                          <TableRow
                            key={notification?.notificationID}
                            sx={{
                              "&:nth-of-type(even)": {
                                backgroundColor: "#EFFAF9",
                              },
                            }}
                            selected={isSelected(notification?.notificationID)}
                            hover
                          >
                            <TableCell
                              sx={{
                                padding: "0px",
                              }}
                            ></TableCell>
                            <TableCell
                              padding="checkbox"
                              sx={{ verticalAlign: "top", paddingTop: "5px" }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {/* Green Dot or Empty Space */}
                                {notification?.status !== 1 ? (
                                  <CircleIcon
                                    sx={{ fontSize: 10, color: "#008755" }}
                                  />
                                ) : (
                                  <Box sx={{ width: "10px", height: "10px" }} />
                                )}
                                {/* Checkbox */}
                                <Checkbox
                                  checked={isSelected(
                                    notification?.notificationID
                                  )}
                                  onChange={() =>
                                    handleClick(notification?.notificationID)
                                  }
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Grid
                                container
                                alignItems="start"
                                spacing={2}
                                sx={{ flexWrap: "nowrap" }}
                              >
                                <Grid item>
                                  <Avatar
                                    src={notification?.image}
                                    alt="User"
                                    sx={{
                                      width: "24px",
                                      height: "24px",
                                    }}
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography
                                    sx={{
                                      fontSize: "16px",
                                    }}
                                    className="dubai-regular notification-item"
                                    dangerouslySetInnerHTML={{
                                      __html: notification?.message,
                                    }}
                                  ></Typography>
                                </Grid>
                              </Grid>
                            </TableCell>

                            <TableCell
                              sx={{
                                verticalAlign: "top",
                                paddingTop: "17px",
                                fontSize: "14px",
                                color: "#666",
                                whiteSpace: "nowrap",
                                textAlign: "right",
                                pr: 5,
                              }}
                              className="dubai-regular"
                            >
                              {calculateTimeFromNow(
                                notification?.dateOfCreation
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#666",
                  }}
                >
                  <Alert className="dubai-med" severity="info">
                    No records found
                  </Alert>
                </Box>
              )}
            </TableContainer>
            {Array.isArray(getNotificationList?.data) &&
              getNotificationList?.data.length > 0 && (
                <Box>
                  <PaginationComponent
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    handleChangePage={handleChangePage}
                    startIndex={startIndex}
                    endIndex={Math.min(
                      endIndex,
                      getNotificationList?.totalRecords ??
                        getNotificationList?.totalUnseenRecords ??
                        0
                    )}
                    totalItems={
                      alignment === "all"
                        ? getNotificationList?.totalRecords
                        : getNotificationList?.totalUnseenRecords
                    }
                  />
                </Box>
              )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default NotificationViewAllPage;

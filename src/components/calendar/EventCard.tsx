import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Link,
  IconButton,
} from "@mui/material";
import {
  AccessAlarm,
  Edit,
  Delete,
  Place,
  Notifications,
  Close,
} from "@mui/icons-material";
import PeopleSvg from "../../../public/svg/PeopleGrp.svg";
import BellNotificationSvg from "../../../public/svg/BellNotification.svg";
import StarCalendar from "../../../public/svg/StarCalendar.svg";
import LinkSvg from "../../../public/svg/Link.svg";
import MarkerSvg from "../../../public/svg/Marker.svg";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearGetRaceCalendarByIDState } from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import {
  clearDeleteState,
  deleteRaceCalendarById,
} from "@/redux/slices/raceCalendar/deleteRaceCalendarSlice";
import { getRaceCalendarAPI } from "@/redux/slices/raceCalendar/getRaceCalendarListSlice";
import CustomButton from "../buttons/CustomButton";
import Axios from "../../utils/AxiosInterceptor";
import CustomSnackbar from "../CustomSnackbar";
import { formatDate, reformatDate } from "@/utils/helper";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import _, { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface EventDialogProps {
  isEdit: any;
  isView: boolean;
  deleteData?: any;
  setView: any;
  title?: string; // Optional title prop with default value
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"; // Optional maxWidth with possible values
  fullWidth?: boolean; // Optional fullWidth prop, defaulting to true
  teamID?: any;
  editData?: any;
  calendarName?: any;
  moduleType?: any;
}

const EventDialog: React.FC<EventDialogProps> = ({
  isEdit,
  isView,
  setView,
  title = "Event Details",
  maxWidth = "xl", // Customizable width
  fullWidth = true, // Customizable full width,
  deleteData,
  teamID,
  editData,
  calendarName,
  moduleType
}) => {
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [reminderStatus, setReminderStatus] = React.useState<string>("");
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const getAthleteList = useSelector((state: any) => state.getAthleteList);

  const handleClose = () => {
    setView(false);
    dispatch(clearGetRaceCalendarByIDState());
  };
  const athleteDataArray = Array.isArray(getAthleteList?.data)
    ? getAthleteList.data
    : Object.values(getAthleteList?.data || []);

  const firstThreeAthletes = athleteDataArray.slice(0, 3);
  useEffect(() => {
    if (!_.isEmpty(Number(teamID)) || deleteData?.sportID) {
      const payloads = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID) || deleteData?.sportID,
      };
      dispatch(getAthleteListAPI(payloads));
    }
  }, []);

  // const firstThreeAthletes = athleteData ? athleteData.slice(0, 3) : [];

  const handleCloseSnackBar = () => {
    setSnackbarStatus("");
    setSnackbarOpen(false);
  };

  const deleteRaceCalendarByID = useSelector((state: RootState) => {
    return state && state.deleteRaceCalendar;
  });

  const handleSendReminder = async () => {
    const itemIDKey = Object.keys(deleteData).find(
      (key) => key !== "section" && key !== "sportID"
    );
    const itemIDValue = itemIDKey ? deleteData[itemIDKey] : null;
    const payload: any = {
      sportID: Number(teamID) || deleteData?.sportID,
      section: deleteData.section,
      itemID: itemIDValue,
    };

    try {
      const response: any = await Axios.post(
        `${process.env.API_BASE_URL}/Sports/SendReminder`,
        payload
      );
      if (
        response &&
        (response.responseCode === 200 || response.status === 200)
      ) {
        setReminderStatus("success");
      } else {
        setReminderStatus("error");
      }
    } catch (error) {
      setReminderStatus("error");
    }
  };

  useEffect(() => {
    if (reminderStatus === "success") {
      setSnackbarStatus("success");
      setSnackbarOpen(true);
    } else if (reminderStatus === "error") {
      setSnackbarStatus("error");
      setSnackbarOpen(true);
    }
  }, [reminderStatus]);

  const isURL = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const getDateAndTime = () => {
    if (editData?.trainingID) {
      if (editData?.trainingStartDate || editData?.trainingStartTime) {
        return `${reformatDate(editData?.trainingStartDate)} - ${reformatDate(
          editData?.trainingEndDate
        )} - ${editData?.trainingStartTime}`;
      }
    }
    if (editData?.tournamentID && editData?.trainingStartDate) {
      const startDate = reformatDate(editData?.trainingStartDate);
      let endDate = "";
      if (editData?.trainingEndDate !== "") {
        const reformattedDate = reformatDate(editData?.trainingEndDate);
        endDate =
          reformattedDate === "Invalid date" ? "" : ` - ${reformattedDate}`;
      }
      return startDate + endDate;
    }

    if (editData?.eventDate) {
      return `${reformatDate(editData?.eventDate)}`;
    }

    if (editData?.reminderID && editData?.date) {
      return `${reformatDate(editData?.date)} - ${editData?.time}`;
    }

    if (editData?.date) {
      return `${reformatDate(editData?.date)} - ${editData?.time}`;
    }
    return null;
  };

  return (
    <Dialog
      open={isView}
      onClose={handleClose}
      maxWidth={"xs"}
      fullWidth={fullWidth}
      style={{ zIndex: 10000 }}
      aria-labelledby="customized-dialog-event"
    >
      <DialogTitle
        sx={{ m: 0, p: 2, display: "none" }}
        id="customized-dialog-event"
        className="bukra dialogBox-delete-title"
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p={1}
        pb={0}
      >
        <Box>
          {(calendarName === "race-calendar" && checkAccess(USER_PERMISSION.RaceCalendarEdit)) ||
            (calendarName === "competition-calendar" && checkAccess(USER_PERMISSION.CompetitionCalendarEdit)) ||
            (moduleType === "staff" && checkAccess(USER_PERMISSION.RaceCalendarEdit)) ||
            (moduleType === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarEdit)) ||
            (calendarName !== "race-calendar" && calendarName !== "competition-calendar" &&
              moduleType !== "staff" && moduleType !== "athlete") ?
            <IconButton onClick={() => isEdit(true)}>
              <Edit
                sx={{
                  color: "#05868E",
                }}
              />
            </IconButton>
            : null}

          {(calendarName === "race-calendar" && checkAccess(USER_PERMISSION.RaceCalendarDelete)) ||
            (calendarName === "competition-calendar" && checkAccess(USER_PERMISSION.CompetitionCalendarDelete)) ||
            (moduleType === "staff" && checkAccess(USER_PERMISSION.RaceCalendarDelete)) ||
            (moduleType === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarDelete)) ||
            (calendarName !== "race-calendar" && calendarName !== "competition-calendar" &&
              moduleType !== "staff" && moduleType !== "athlete") ?
            <ReusableDeleteDialog
              title={`Event`}
              confirmationMessage="Are you sure, Do you want to delete?"
              successMessage="Event Deleted Successfully"
              name={title}
              icon={<Delete />}
              revertMessage={`Once the Event is deleted, you cannot revert.`}
              deleteAction={(payload: any) =>
                dispatch(deleteRaceCalendarById(payload))
              }
              fetchAfterDelete={() => {
                const payload = {
                  searchText: "",
                  filteredBy: "",
                  paginationIndex: 0,
                  paginationCount: 100,
                  moduleView: "",
                  moduleID: "0",
                  sportID:
                    router.pathname !== "/competition-calendar"
                      ? Number(teamID)
                      : teamID,
                  // sportID: router.pathname !== '/competition-calendar' ? Number(teamID) : teamID === '0' ? 0 : deleteData?.sportID,
                };

                dispatch(getRaceCalendarAPI(payload));
              }}
              deleteResponse={deleteRaceCalendarByID}
              clearDeleteState={(payload: any) => {
                dispatch(clearDeleteState());
                setView(false);
                dispatch(clearGetRaceCalendarByIDState());
              }}
              payload={{
                ...deleteData,
              }}
              setView={setView}
              isView={isView}
            />
            : null}
          <IconButton onClick={handleClose}>
            <Close
              sx={{
                color: "#05868E",
              }}
            />
          </IconButton>
        </Box >
      </Box >
      <Box px={3} py={1} pt={0}>
        {/* Title */}
        <Box display="flex" alignItems="center" mb={1}>
          <Box
            sx={{
              bgcolor: "rgba(0, 135, 85, 0.6)",
              width: 16,
              height: 16,
              borderRadius: "4px",
              mr: 1,
            }}
          />
          <Typography
            sx={{
              fontSize: "18px",
              color: "#008755",
              lineHeight: "30.38px",
            }}
            className="dubai-med text-capitalize"
          >
            {title}
          </Typography>
        </Box>

        {/* Date and Time */}
        <Typography
          mb={2}
          ml={3}
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#58585B",
          }}
          className="dubai-med"
        >
          {/* Monday, 08 October 06:30 – 7:45AM */}
          {getDateAndTime()}
        </Typography>

        {(deleteData?.section === "meeting" ||
          deleteData?.section === "training") &&
          (editData?.trainingLocation?.trim() ||
            editData?.locationLink?.trim()) &&
          !isURL(editData?.locationLink) && (
            <Box display="flex" alignItems="center" mb={1}>
              <MarkerSvg width={16} height={16} />
              <Link
                href="#"
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#00426A",
                  ml: 1,
                }}
                className="dubai-med"
              >
                {editData?.trainingLocation || editData?.locationLink}
              </Link>
            </Box>
          )}
        {/* Team Admin */}
        <Box display="flex" alignItems="center" mb={1}>
          <StarCalendar width={16} height={16} />
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", fontWeight: 400, color: "#00426A", ml: 1 }}
            className="dubai-med"
          >
            Team Admin
          </Typography>
        </Box>
        {athleteDataArray.length > 0 && (
          <Box display="flex" alignItems="center" mb={1}>
            <PeopleSvg width={16} height={16} />

            <AvatarGroup
              max={4}
              sx={{
                justifyContent: "start",
                alignItems: "center",
                ml: 1,
              }}
              className="group-avatar"
              renderSurplus={(surplus) => (
                <span>+{surplus.toString()[0]} more</span>
              )}
            >
              {athleteDataArray.length <= 3
                ? athleteDataArray.map((athlete: any) => (
                  <Avatar
                    key={athlete.athleteID}
                    alt={`${athlete.firstName} ${athlete.surName}`}
                    src={athlete.profileImage || ""}
                    sx={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                    }}
                  />
                ))
                : firstThreeAthletes.map((athlete: any) => (
                  <Avatar
                    key={athlete.athleteID}
                    alt={`${athlete.firstName} ${athlete.surName}`}
                    src={athlete.profileImage || ""}
                    sx={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                    }}
                  />
                ))}

              {athleteDataArray.length > 3 && (
                <Avatar
                  className="surplus-avatar"
                  sx={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: "#00796b",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  +{athleteDataArray.length - 3} more
                </Avatar>
              )}
            </AvatarGroup>
          </Box>
        )}

        {/* Link */}
        <Box display="flex" alignItems="center">
          <LinkSvg width={16} height={16} />
          <Link
            href="https://www.dplfinal2024.com"
            target="_blank"
            underline="hover"
            sx={{ fontSize: "14px", fontWeight: 400, color: "#00426A", ml: 1 }}
            className="dubai-med"
          >
            www.dplfinal2024.com
          </Link>
        </Box>
        <Box display="flex" alignItems="center" m={2}>
          <CustomButton
            label="Send Reminder"
            variant="contained"
            size="small"
            iconPosition="none"
            ButtonIcon={BellNotificationSvg}
            onClick={(e: any) => {
              e.stopPropagation();
              handleSendReminder();
            }}
          />
        </Box>
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Reminder sent successfully!"
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleCloseSnackBar}
          />
        )}
      </Box>
    </Dialog >
  );
};

export default EventDialog;

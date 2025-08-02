import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "../Fields/CustomTextField";
import {
  Button,
  CircularProgress,
  Grid,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../Fields/CustomDatePicker";
import _, { isEmpty } from "lodash";
import CustomTimePicker from "../Fields/CustomTimePicker";
import { useDispatch, useSelector } from "react-redux";
import {
  formatDate,
  formatTime,
  getLocalStorage,
  getSportIDByName,
} from "@/utils/helper";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import {
  addRaceCalendar,
  clearAddRaceCalendarState,
} from "@/redux/slices/raceCalendar/raceCalendarAddSlice";
import CustomSnackbar from "../CustomSnackbar";
import { useRouter } from "next/router";
import {
  clearUpdateRaceCalendarState,
  updateRaceCalendar,
} from "@/redux/slices/raceCalendar/updateRaceCalendarSlice";
import { clearGetRaceCalendarByIDState } from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import moment from "moment";
import { REGEX } from "@/utils/constants";
import DropDown from "../Fields/DropDown";
import ReactSelect from "../Fields/ReactSelect";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";

interface Props {
  onClose: any;
  editData: any;
  date: any;
}

interface FormData {
  meetingSubject: string;
  selectSport: string;
  date: string | null;
  time: any;
  locationLink: string;
  description: string;
  attendeesAthlete: string;
  attendeesStaff: string;
}

type FormErrors = {
  meetingSubject?: string;
  date?: string | null;
  time?: string;
  locationLink?: string;
  description?: string;
};

const MeetingForm: React.FC<Props> = ({ onClose, editData, date }) => {
  const { handleSubmit, control, setValue, watch } = useForm<FormData>({
    defaultValues: {
      meetingSubject: "",
      selectSport: "",
      date: null,
      time: null,
      locationLink: "",
      description: "",
      // attendeesAthlete: "",
      // attendeesStaff: ""
    },
  });
  const AddRaceCalendarResponse = useSelector(
    (state: any) => state.addRaceCalendar
  );
  const UpdateRaceCalendarResponse = useSelector(
    (state: any) => state.updateRaceCalendar
  );
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [error, setDateError] = useState({});
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const staffList = useSelector((state: any) => state.staffList);
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [AthletesOption, setAthletesOption] = useState();
  const [SelectedAthletesOption, setSelectedAthletesOption] =
    useState<any>(null);
  const [AssignedCoachOption, setAssignedCoachOption] = useState();
  const [SelectedAssignedCoachOption, setSelectedAssignedCoachOption] =
    useState<any>(null);
  const [formDatas, setFormDatas] = useState<any>({
    attendeesAthlete: "",
    attendeesStaff: "",
  });
  const [errors, setErrors] = useState<any>({});
  const athleteData = getAthleteList && getAthleteList?.data;

  useEffect(() => {
    if (!_.isEmpty(teamID)) {
      const payloads = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID),
      };
      dispatch(getAthleteListAPI(payloads));
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
  }, [teamID]);

  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    if (!isEmpty(editData) && editData.meetingID) {
      const updateBody: any = {
        ...formData,
        section: "meeting",
        date: moment(formData.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
        time: formatTime(formData.time),
        
        sportID:
          router.pathname === "/competition-calendar"
            ? getSportIDByName(getSportList.data, formData.selectSport)
            : Number(teamID),
        meetingID: editData.meetingID,
        attendeesAthlete: formDatas.attendeesAthlete,
        attendeesStaff: formDatas.attendeesStaff,
      };
      dispatch(updateRaceCalendar(updateBody));
    } else {
      const postBody: any = {
        ...formData,
        section: "meeting",
        date: moment(formData.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
        time: formatTime(formData.time),
        
        sportID:
          router.pathname === "/competition-calendar"
            ? getSportIDByName(getSportList.data, formData.selectSport)
            : Number(teamID),
        attendeesAthlete: formDatas.attendeesAthlete,
        attendeesStaff: formDatas.attendeesStaff,
      };
      dispatch(addRaceCalendar(postBody));
    }
  };

  const dateChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setValue(name, value);
  };

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setValue(name, value);
  };

  useEffect(() => {
    if (
      (AddRaceCalendarResponse &&
        AddRaceCalendarResponse.code === 200 &&
        AddRaceCalendarResponse.status === "succeeded") ||
      (UpdateRaceCalendarResponse &&
        UpdateRaceCalendarResponse.code === 200 &&
        UpdateRaceCalendarResponse.status === "succeeded")
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearAddRaceCalendarState());
      dispatch(clearUpdateRaceCalendarState());
      dispatch(clearGetRaceCalendarByIDState());
    } else if (
      (AddRaceCalendarResponse &&
        AddRaceCalendarResponse.code === 500 &&
        AddRaceCalendarResponse.status === "failed") ||
      (UpdateRaceCalendarResponse &&
        UpdateRaceCalendarResponse.code === 500 &&
        UpdateRaceCalendarResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddRaceCalendarState());
      dispatch(clearUpdateRaceCalendarState());
      dispatch(clearGetRaceCalendarByIDState());
    }
  }, [AddRaceCalendarResponse, UpdateRaceCalendarResponse]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        onClose(false);
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if ((!isEmpty(editData) && editData.meetingID) || date) {
      const parsedTime =
        editData && editData.time !== "" && editData.time !== "-"
          ? moment(editData.time, "hh:mm A").isValid()
            ? moment(editData.time, "hh:mm A").format("hh:mm A")
            : null
          : null;

      setValue("meetingSubject", editData && editData.meetingSubject);
      setValue("selectSport", editData && editData.sportID);
      setValue(
        "date",
        editData && editData.date !== "" && editData.date !== "-"
          ? editData.date
          : moment(date).format("DD/MM/YYYY")
      );
      setValue(
        "time",
        editData && editData.time !== "" && editData.time !== "-"
          ? moment(editData.time, "hh:mm A")
          : null
      );
      setValue("locationLink", editData && editData.locationLink);
      if (editData && editData.description !== "") {
        setValue("description", editData && editData.description);
      }
      if (
        (editData && editData?.attendeesStaff) ||
        (editData && editData?.attendeesAthlete)
      ) {
        const selOption: any = _.filter(
          AssignedCoachOption,
          (x: any) =>
            x.value &&
            _.includes(
              editData && editData?.attendeesStaff.split(","),
              x.value.toString()
            )
        );
        setSelectedAssignedCoachOption(selOption);
        const AthleteslOption: any = _.filter(
          AthletesOption,
          (x: any) =>
            x.value &&
            _.includes(
              editData && editData?.attendeesAthlete.split(","),
              x.value.toString()
            )
        );
        setSelectedAthletesOption(AthleteslOption);
        setValue("attendeesStaff", editData && editData?.attendeesStaff);
        setValue("attendeesAthlete", editData && editData?.attendeesAthlete);
      }
      if (teamID && getSportList?.data?.length) {
        const matchedSport = getSportList.data.find(
          (sport: any) => sport.sportID === Number(teamID)
        );
        if (matchedSport) {
          setValue("selectSport", matchedSport.sportID);
          setIsDisabled(true);
        }
      }
    }
  }, [editData, date, staffList, athleteData]);

  useEffect(() => {
    if (teamID && getSportList?.data?.length) {
      const matchedSport = getSportList.data.find(
        (sport: any) => sport.sportID === Number(teamID)
      );
      if (matchedSport) {
        setValue("selectSport", matchedSport.sportID);
        setIsDisabled(true);
      }
    }
  }, [teamID, getSportList, setValue]);

  const getDefaultOption = (teamsNames: any) => {
    const defaultOptions = [];
    for (const item in teamsNames) {
      defaultOptions.push({
        label: teamsNames[item].sportName,
        value: teamsNames[item].sportID,
      });
    }
    return defaultOptions;
  };

  const sportsOption = getDefaultOption(getSportList.data);

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues: any = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAthletesOption(selectedOption);
      setFormDatas({
        ...formDatas,
        attendeesAthlete: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        attendeesAthlete: "",
      });
    }
  };

  const handleChangeAssigned = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues: any = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAssignedCoachOption(selectedOption);
      setFormDatas({
        ...formDatas,
        attendeesStaff: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        attendeesStaff: "",
      });
    }
  };

  const data = staffList && staffList?.data;
  useEffect(() => {
    const AssignedCoach: any = getStaffDefaultOption(data);
    setAssignedCoachOption(AssignedCoach);
  }, [data]);

  useEffect(() => {
    const athletes: any = getDefaultOptions(athleteData);
    setAthletesOption(athletes);
  }, [athleteData]);

  const getDefaultOptions = (AthleteList: any) => {
    const defaultOptions = [];
    for (const item in AthleteList) {
      defaultOptions.push({
        label: AthleteList[item].firstName,
        value: AthleteList[item].athleteID,
      });
    }
    return defaultOptions;
  };

  const getStaffDefaultOption = (athleteList: any) => {
    const defaultOptions = [];
    for (const item in athleteList) {
      defaultOptions.push({
        label: athleteList[item].firstName,
        value: athleteList[item].staffID,
      });
    }
    return defaultOptions;
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomTextField
        name="meetingSubject"
        placeholder="Enter Meeting Subject"
        control={control}
        label="Meeting Subject"
        onKeyPress={(e) => {
          if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
            e.preventDefault();
          }
        }}
        inputProps={{ maxLength: 50 }}
      />
      <DropDown
        name="selectSport"
        label="Select Sport"
        control={control}
        options={sportsOption}
        variant="outlined"
        required={true}
        disabled={isDisabled}
      />
      <Box mt={1.5}>
        <CustomDatePicker
          control={control}
          name="date"
          label="Date"
          required={true}
          rules={{
            required: "Date is required",
          }}
          defaultValue={(editData && editData.date) || date}
          minDate={moment()}
          maxDate={moment().add(50, "years")}
          setErrors={setDateError}
          boxmb={0.8}
          onChange={dateChange}
        />
      </Box>

      <Box mt={1.5}>
        <CustomTimePicker
          control={control}
          name="time"
          label="Time"
          required={true}
          rules={{
            required: "Time is required",
          }}
          boxmb={0.8}
          onChange={timeChange}
          defaultValue={editData && editData.time}
        />
      </Box>

      <CustomTextField
        name="locationLink"
        placeholder="Enter Location / Link Name"
        control={control}
        label="Location / Link"
        rules={{
          required: "Location / Link is required",
          pattern: {
            value: /^(https?:\/\/[^\s]+|[A-Za-z\s]+)$/,
            message: "Invalid Location / Link",
          },
        }}
      />
      <Grid item xs={12} md={12} mt={2}>
        <Typography gutterBottom className="typography textfield-label bukra">
          Attendees Staff
        </Typography>
        <ReactSelect
          name="AssignedCoach"
          id="AssignedCoach"
          control={control}
          classNamePrefix="select"
          handleChangeReactSelect={handleChangeAssigned}
          options={AssignedCoachOption}
          value={SelectedAssignedCoachOption}
          isDisabled={!AssignedCoachOption}
          placeholder={"Select Assigned Coach"}
          isClearable={true}
          isMulti={true}
        />
      </Grid>

      <Grid item xs={12} md={12} mt={2}>
        <Typography gutterBottom className="typography textfield-label bukra">
          Attendees Athlete
        </Typography>
        <ReactSelect
          name="attendeesAthlete"
          id="attendeesAthlete"
          classNamePrefix="select"
          control={control}
          handleChangeReactSelect={handleChangeAthletes}
          options={AthletesOption}
          value={SelectedAthletesOption}
          isDisabled={!AthletesOption}
          placeholder={"Select Athlete"}
          isClearable={true}
          isMulti={true}
        />
      </Grid>

      <CustomTextField
        name="description"
        control={control}
        label="Description"
        textarea={true}
        onKeyPress={(e) => {
          if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
            e.preventDefault();
          }
        }}
        inputProps={{ maxLength: 400 }}
      />
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? "Meeting  Added Successfully!"
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleClose}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          className="text-capitalize dubai-med"
          sx={{ height: "48px", fontSize: "16px" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="text-capitalize dubai-med"
          disabled={
            (AddRaceCalendarResponse && AddRaceCalendarResponse?.loading) ||
            (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse?.loading)
          }
          sx={{ height: "48px", fontSize: "16px" }}
        >
          {(AddRaceCalendarResponse && AddRaceCalendarResponse.loading) ||
          (UpdateRaceCalendarResponse &&
            UpdateRaceCalendarResponse?.loading) ? (
            <CircularProgress size={24} color="primary" />
          ) : !isEmpty(editData) && editData.meetingID ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </Box>
  );
};
export default MeetingForm;

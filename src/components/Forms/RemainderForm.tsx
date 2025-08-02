import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "../Fields/CustomTextField";
import {
  Button,
  CircularProgress,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../Fields/CustomDatePicker";
import _, { isEmpty } from "lodash";
import CustomTimePicker from "../Fields/CustomTimePicker";
import {
  addRaceCalendar,
  clearAddRaceCalendarState,
} from "@/redux/slices/raceCalendar/raceCalendarAddSlice";
import {
  formatDate,
  formatTime,
  getLocalStorage,
  getSportIDByName,
} from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
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

interface Props {
  onClose: any;
  editData: any;
  date: any;
}

interface FormData {
  reminderName: string;
  selectSport: string;
  date: string | null;
  time: any;
  description: string;
}

type FormErrors = {
  reminderName?: string;
  date?: string | null;
  time?: string;
  description?: string;
};

const RemainderForm: React.FC<Props> = ({ onClose, editData, date }) => {
  const { handleSubmit, control, setValue, watch } = useForm<FormData>({
    defaultValues: {
      reminderName: "",
      selectSport: "",
      date: null,
      time: null,
      description: "",
    },
  });
  const [error, setDateError] = useState({});
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const AddRaceCalendarResponse = useSelector(
    (state: any) => state.addRaceCalendar
  );
  const UpdateRaceCalendarResponse = useSelector(
    (state: any) => state.updateRaceCalendar
  );
  const router = useRouter();
  const { teamID } = router.query;
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    if (!isEmpty(editData) && editData.reminderID) {
      const updateBody: any = {
        reminderName: formData.reminderName,
        description: formData.description,
        section: "reminder",
        // date: moment(formData.date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        date: moment(formData.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
        time: formatTime(formData.time),
        
        // sportID: Number(teamID),
        reminderID: editData.reminderID,
        sportID:
          router.pathname === "/competition-calendar"
            ? getSportIDByName(getSportList.data, formData.selectSport)
            : Number(teamID),
      };
      dispatch(updateRaceCalendar(updateBody));
    } else {
      const postBody: any = {
        reminderName: formData.reminderName,
        description: formData.description,
        section: "reminder",
        date: moment(formData.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
        time: formatTime(formData.time),
        
        sportID:
          router.pathname === "/competition-calendar"
            ? getSportIDByName(getSportList.data, formData.selectSport)
            : Number(teamID),
      };

      dispatch(addRaceCalendar(postBody));
    }
  };

  const dateChange = (data: any) => {
    const value = data.value;
    const name = data.date;
    setValue(name, value);
  };

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.time;
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
    if ((!isEmpty(editData) && editData.reminderID) || date) {
      setValue("reminderName", editData && editData.reminderName);
      setValue("selectSport", editData && editData.sportName);
      setValue(
        "date",
        editData && editData.date !== "" && editData.date !== "-"
          ? moment(editData.date, "DD/MM/YYYY").format("DD/MM/YYYY")
          : moment(date).format("DD/MM/YYYY")
      );
      setValue(
        "time",
        editData && editData.time !== "" && editData.time !== "-"
          ? moment(editData.time, "hh:mm A")
          : null
      );
      if (editData && editData.description !== "") {
        setValue("description", editData && editData.description);
      }
    }
  }, [editData, date]);

  const getDefaultOption = (teamsNames: any) => {
    const defaultOptions = [];
    for (const item in teamsNames) {
      defaultOptions.push({
        label: teamsNames[item].sportName,
        value: teamsNames[item].sportName,
      });
    }
    return defaultOptions;
  };

  const sportsOption = getDefaultOption(getSportList.data);

  useEffect(() => {
    if (teamID && getSportList?.data?.length) {
      const matchedSport = getSportList.data.find(
        (sport: any) => sport.sportID === Number(teamID)
      );
      if (matchedSport) {
        setValue("selectSport", matchedSport.sportName);
        setIsDisabled(true);
      }
    }
  }, [teamID, getSportList, setValue]);

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
        name="reminderName"
        placeholder="Enter Reminder Name"
        control={control}
        label="Reminder Name"
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
          boxmb={0.8}
          onChange={dateChange}
          defaultValue={(editData && editData.date) || date}
          rules={{
            required: "Date is required",
          }}
          minDate={moment()}
          maxDate={moment().add(50, "years")}
          setErrors={setDateError}
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
              ? "Reminder  Added Successfully!"
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
          sx={{ height: "48px", fontSize: "16px" }}
          disabled={
            (AddRaceCalendarResponse && AddRaceCalendarResponse?.loading) ||
            (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse?.loading)
          }
        >
          {(AddRaceCalendarResponse && AddRaceCalendarResponse.loading) ||
          (UpdateRaceCalendarResponse &&
            UpdateRaceCalendarResponse?.loading) ? (
            <CircularProgress size={24} color="primary" />
          ) : !isEmpty(editData) && editData.reminderID ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </Box>
  );
};
export default RemainderForm;

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useEffect, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "../Fields/CustomTextField";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import DropDown from "../Fields/DropDown";
import { RACECALENDER_ERROR, REGEX } from "@/utils/constants";
import {
  Button,
  CircularProgress,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../Fields/CustomDatePicker";
import _, { isEmpty } from "lodash";
import { formatDate, getLocalStorage, getSportIDByName } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  addRaceCalendar,
  clearAddRaceCalendarState,
} from "@/redux/slices/raceCalendar/raceCalendarAddSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import CustomSnackbar from "../CustomSnackbar";
import { useRouter } from "next/router";
import {
  clearUpdateRaceCalendarState,
  updateRaceCalendar,
} from "@/redux/slices/raceCalendar/updateRaceCalendarSlice";
import { clearGetRaceCalendarByIDState } from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import moment from "moment";

interface Props {
  onClose: any;
  editData?: any;
  date?: any;
}

interface FormData {
  eventName: string;
  selectSport: string;
  eventType: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  description: string;
}

type FormErrors = {
  eventName?: string;
  selectSport?: string;
  eventType?: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  description?: string;
};

const EventForm: React.FC<Props> = ({ onClose, editData, date }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;

  const AddRaceCalendarResponse = useSelector(
    (state: any) => state.addRaceCalendar
  );
  const UpdateRaceCalendarResponse = useSelector(
    (state: any) => state.updateRaceCalendar
  );
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [error, setDateError] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      eventName: "",
      selectSport: "",
      eventType: "",
      description: "",
      eventStartDate: "",
      eventEndDate: "",
    },
  });
  const [errors, setErrors] = useState<FormErrors>();

  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    const validationErrors: any = {};
    if (_.isEmpty(formData.eventName)) {
      validationErrors.eventName = "Event Name is required";
    }
    if (_.isEmpty(formData.selectSport)) {
      validationErrors.selectSport = "Select Sport is required";
    }

    if (_.isEmpty(formData.eventType)) {
      validationErrors.eventType = "Event Type is required";
    }

    if (_.isEmpty(formData.eventStartDate)) {
      validationErrors.eventStartDate = "Event Start Date is required";
    }
    if (_.isEmpty(formData.eventEndDate)) {
      validationErrors.eventEndDate = "Event End Date is required";
    }

    const postBody: any = {
      ...formData,
      eventStartDate: moment(formData.eventStartDate, "DD/MM/YYYY").format(
        "DD/MM/YYYY"
      ),
      eventEndDate: moment(formData.eventEndDate, "DD/MM/YYYY").format(
        "DD/MM/YYYY"
      ),
      section: "event",
      
      sportID:
        router.pathname === "/competition-calendar"
          ? getSportIDByName(getSportList.data, formData.selectSport)
          : Number(teamID),
    };
    setErrors(validationErrors);

    if (!isEmpty(editData) && editData.eventID) {
      const updateBody: any = {
        ...formData,
        eventStartDate: moment(formData.eventStartDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        eventEndDate: moment(formData.eventEndDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        section: "event",
        
        sportID:
          router.pathname === "/competition-calendar"
            ? getSportIDByName(getSportList.data, formData.selectSport)
            : Number(teamID),
        eventID: editData.eventID,
      };
      dispatch(updateRaceCalendar(updateBody));
    } else {
      dispatch(addRaceCalendar(postBody));
    }
  };

  const dateChange = (data: any) => {
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
    if ((!isEmpty(editData) && editData.eventID) || date) {
      setValue("eventName", editData && editData.eventName);
      setValue("selectSport", editData && editData.selectSport);
      setValue("eventType", editData && editData.eventType);
      setValue(
        "eventStartDate",
        (editData && editData.eventStartDate) ||
          moment(date).format("DD/MM/YYYY")
      );
      setValue(
        "eventEndDate",
        (editData && editData.eventEndDate) || moment(date).format("DD/MM/YYYY")
      );

      if (editData && editData.description !== "") {
        setValue("description", editData && editData.description);
      }
    }
  }, [editData, date]);

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

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

  const getMinDate = () => {
    const contractStart = moment(watch("eventStartDate"), "DD/MM/YYYY", true);
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(50, "years");
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
        name="eventName"
        placeholder="Enter Event Name"
        control={control}
        label="Event Name"
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
        <CustomRadioGroup
          name="eventType"
          control={control}
          label="Event Type"
          options={[
            { value: "internal", label: "Internal" },
            { value: "local", label: "Local" },
            { value: "international", label: "International" },
          ]}
          required={true}
        />
      </Box>
      <Box mt={1.5}>
        <CustomDatePicker
          control={control}
          name="eventStartDate"
          label="Event Start Date"
          required={true}
          boxmb={0.8}
          defaultValue={(editData && editData.eventStartDate) || date}
          onChange={dateChange}
          minDate={moment()}
          maxDate={moment().add(50, "years")}
          setErrors={setDateError}
          rules={{
            required: "Event Start Date is required",
          }}
        />
      </Box>
      <Box mt={1.5}>
        <CustomDatePicker
          control={control}
          name="eventEndDate"
          label="Event End Date"
          boxmb={0.8}
          required={true}
          minDate={getMinDate()}
          maxDate={moment().add(10, "years")}
          onChange={dateChange}
          defaultValue={(editData && editData.eventEndDate) || date}
          setErrors={setDateError}
          rules={{
            required: "Event End Date is required",
          }}
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
              ? "Event  Added Successfully!"
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
          ) : !isEmpty(editData) && editData.eventID ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </Box>
  );
};
export default EventForm;

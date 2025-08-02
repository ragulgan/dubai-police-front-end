"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  Select,
  SnackbarCloseReason,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { formatTime, getSportIDByName, trimFormData } from "@/utils/helper";
import { REGEX } from "@/utils/constants";
import TextSunEditor from "@/components/SunEditor";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  addRaceCalendar,
  clearAddRaceCalendarState,
} from "@/redux/slices/raceCalendar/raceCalendarAddSlice";
import {
  updateRaceCalendar,
  clearUpdateRaceCalendarState,
} from "@/redux/slices/raceCalendar/updateRaceCalendarSlice";
import { getRaceCalendarAPI } from "@/redux/slices/raceCalendar/getRaceCalendarListSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { usePathname } from "next/navigation";
import { clearGetRaceCalendarByIDState } from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import { useRouter } from "next/router";

const CustomTextField = styled(TextField)(({ theme }) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#00875508",
    "& fieldset": {
      borderColor: "#40a377",
    },
    "&:hover fieldset": {
      borderColor: "#40a377",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#40a377",
    },
  },
  "& input": {
    fontFamily: "Roboto",
    paddingLeft: "10px",
    color: "#000000",
    height: "8px",
  },
  "& input::placeholder": {
    color: "#58585B",
    opacity: 1,
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

const sessionData = [
  { label: "15min", value: "15min" },
  { label: "30min", value: "30min" },
  { label: "45min", value: "45min" },
  { label: "1h", value: "1h" },
  { label: "1h 15min", value: "1h 15min" },
  { label: "1h 30min", value: "1h 30min" },
  { label: "1h 45min", value: "1h 45min" },
  { label: "2h", value: "2h" },
];

const sessionHoursData = [
  { label: "1Hrs", value: "1Hrs" },
  { label: "2Hrs", value: "2Hrs" },
  { label: "3Hrs", value: "3Hrs" },
  { label: "4Hrs", value: "4Hrs" },
  { label: "5Hrs", value: "5Hrs" },
  { label: "6Hrs", value: "6Hrs" },
];

const TrainingInfo = (props: any) => {
  const {
    editData,
    onClose,
    setTabValue,
    trainingId,
    setTrainingId,
    setAllData,
    allData,
    selectedSport,
  } = props;
  const path = usePathname();
  const teamId = path.split("/")[2];
  const router = useRouter();
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const { handleSubmit, control, setValue } = useForm<any>({
    defaultValues: {
      trainingStartTime: null,
    },
  });
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    warmupDuration: "",
    warmupRoutine: "",
    mainTrainingPhase: "",
    cooldownRoutine: "",
    totalTrainingDuration: "",
    trainingStartTime: "",
    trainingLocation: "",
    additionalNotes: "",
  });
  const [error, setErrors] = useState<any>({});
  const UpdateRaceCalendarResponse = useSelector(
    (state: any) => state.updateRaceCalendar
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...error,
      [name]: "",
    });
  };

  const onSubmit = (e: any) => {
    const validationErrors: any = {};
    if (
      !formData.trainingLocation ||
      _.trim(formData.trainingLocation) === ""
    ) {
      validationErrors.trainingLocation = "Training Location is required";
      document.getElementById("trainingLocation")?.focus();
    }
    if (_.isEmpty(formData.trainingStartTime)) {
      validationErrors.trainingStartTime = "Training Start Time is required";
      document.getElementById("trainingStartTime")?.focus();
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      if (!isEmpty(editData) && editData.trainingID) {
        const trimmedRest = trimFormData(formData);
        const data = {
          ...trimmedRest,

          trainingID: editData?.trainingID,
          section: "trainingDetails",
          trainingStartTime: moment(
            formData.trainingStartTime,
            "hh:mm A"
          ).format("hh:mm"),
        };
        dispatch(updateRaceCalendar(data));
      } else if (isEmpty(editData) && trainingId) {
        const trimmedRest = trimFormData(formData);
        const data = {
          ...trimmedRest,

          trainingID: trainingId,
          section: "trainingDetails",
          trainingStartTime: moment(
            formData.trainingStartTime,
            "hh:mm A"
          ).format("hh:mm"),
        };
        dispatch(updateRaceCalendar(data));
      }
    }
  };

  useEffect(() => {
    if (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse.code === 200) {
      setTrainingId("");
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setTimeout(() => {
        onClose();
        setTabValue(0);
        dispatch(clearAddRaceCalendarState());
        dispatch(clearUpdateRaceCalendarState());
        setAllData({});
        const payload = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          moduleView: "",
          moduleID: "0",
          sportID:
            router.pathname === "/competition-calendar"
              ? selectedSport.join(",")
              : Number(teamId),
        };
        dispatch(getRaceCalendarAPI(payload));
      }, 2000);
    } else if (
      UpdateRaceCalendarResponse &&
      UpdateRaceCalendarResponse.code === 500
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddRaceCalendarState());
      dispatch(clearUpdateRaceCalendarState());
    }
  }, [UpdateRaceCalendarResponse]);

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      trainingDetails: formData,
    }));
    setTabValue(0);
  };

  const selectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...error,
      [name]: "",
    });
  };

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...error,
      [name]: "",
    });
  };

  useEffect(() => {
    if (editData) {
      setFormData((formData: any) => ({
        ...formData,
        warmupDuration: editData.warmupDuration || "",
        warmupRoutine: editData.warmupRoutine || "",
        mainTrainingPhase: editData.mainTrainingPhase || "",
        cooldownRoutine: editData.cooldownRoutine || "",
        totalTrainingDuration: editData.totalTrainingDuration || "",
        trainingStartTime: editData.trainingStartTime || "",
        trainingLocation: editData.trainingLocation || "",
        additionalNotes: editData.additionalNotes || "",
      }));
      setValue(
        "trainingStartTime",
        editData &&
          editData.trainingStartTime !== "" &&
          editData.trainingStartTime !== "-"
          ? moment(editData.trainingStartTime, "hh:mm A")
          : null
      );
    }
  }, [editData]);

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
    if (allData.trainingDetails) {
      setFormData((formData: any) => ({
        ...formData,
        warmupDuration: allData.trainingDetails.warmupDuration || "",
        warmupRoutine: allData.trainingDetails.warmupRoutine || "",
        mainTrainingPhase: allData.trainingDetails.mainTrainingPhase || "",
        cooldownRoutine: allData.trainingDetails.cooldownRoutine || "",
        totalTrainingDuration:
          allData.trainingDetails.totalTrainingDuration || "",
        trainingStartTime: allData.trainingDetails.trainingStartTime || "",
        trainingLocation: allData.trainingDetails.trainingLocation || "",
        additionalNotes: allData.trainingDetails.additionalNotes || "",
      }));
    }
  }, [allData]);

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems={{ xs: "top", md: "center" }}
        sx={{
          // padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box width="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container justifyContent={"space-between"} spacing={2}>
              <Grid item xs={12} md={12}>
                <Grid item xs={12} md={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Warm Up Duration
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.warmupDuration}
                      onChange={selectChange}
                      name="warmupDuration"
                      displayEmpty
                      className="Text-field-customise"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            overflowY: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <Typography
                          style={{
                            height: 27,
                            fontSize: "16px",
                            fontWeight: 500,
                            lineHeight: "25.01px",
                            textAlign: "left",
                            marginLeft: 4,
                            color: "#58585B",
                          }}
                          className="dubai-med"
                        >
                          HH:MM
                        </Typography>
                      </MenuItem>
                      {sessionData.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Main Training Phase
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.mainTrainingPhase || ""}
                    name="mainTrainingPhase"
                    minHeight={"150px"}
                  />
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Total Training Duration
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.totalTrainingDuration}
                      onChange={selectChange}
                      name="totalTrainingDuration"
                      displayEmpty
                      className="Text-field-customise"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            overflowY: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <Typography
                          style={{
                            height: 27,
                            fontSize: "16px",
                            fontWeight: 500,
                            lineHeight: "25.01px",
                            textAlign: "left",
                            marginLeft: 4,
                            color: "#58585B",
                          }}
                          className="dubai-med"
                        >
                          HH:MM
                        </Typography>
                      </MenuItem>
                      {sessionHoursData.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <CustomTimePicker
                    control={control}
                    name="trainingStartTime"
                    id="trainingStartTime"
                    label="Training Start Time"
                    required={true}
                    boxmb={0.8}
                    onChange={timeChange}
                    defaultValue={formData.trainingStartTime}
                    maxwidth={"100%"}
                  />
                  {error.trainingStartTime && (
                    <Typography variant="caption" className="error-message">
                      {error.trainingStartTime}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Training Location <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="trainingLocation"
                    id="trainingLocation"
                    placeholder="Enter Training Location"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.trainingLocation}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {error.trainingLocation && (
                    <Typography variant="caption" className="error-message">
                      {error.trainingLocation}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid item xs={12} md={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Warm Up Routine
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.warmupRoutine || ""}
                    name="warmupRoutine"
                    minHeight={"150px"}
                  />
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Cool down Routine
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.cooldownRoutine || ""}
                    name="cooldownRoutine"
                    minHeight={"250px"}
                  />
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Additional Notes
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.additionalNotes || ""}
                    name="additionalNotes"
                    minHeight={"250px"}
                  />
                </Grid>
              </Grid>
            </Grid>
            {snackbarOpen && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Training ${
                        isEmpty(editData) && trainingId ? "Added" : "Updated"
                      } Successfully!`
                    : "Something went wrong"
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleClose}
              />
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => {
                  handleBack();
                }}
                className="text-capitalize dubai-med"
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                loading={UpdateRaceCalendarResponse.loading}
                variant="contained"
                className="save-continue-button text-capitalize dubai-med"
                disabled={UpdateRaceCalendarResponse.loading}
              >
                {UpdateRaceCalendarResponse.loading
                  ? ""
                  : isEmpty(editData)
                  ? "Add"
                  : "Update"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default TrainingInfo;

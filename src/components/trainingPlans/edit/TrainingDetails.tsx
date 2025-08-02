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
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { trimFormData } from "@/utils/helper";
import {
  addTrainingPlans,
  clearAddState,
} from "@/redux/slices/trainingPlans/TrainingPlansAddSlice";
import { REGEX } from "@/utils/constants";
import TextSunEditor from "@/components/SunEditor";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import { clearEditState } from "@/redux/slices/trainingPlans/TrainingPlansEditSlice";
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

const TrainingDetails = (props: any) => {
  const { editTrainingPlansData, teamId, onClose, setTabValue } = props;
  const { handleSubmit, control, setValue } = useForm<any>({
    defaultValues: {
      trainingStartTime: null,
    },
  });
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const pathName = router.pathname.split("/")[4];
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
  const [errors, setErrors] = useState<any>({});
  const TrainingPlansAddData: any = useSelector(
    (state: RootState) => state.TrainingPlansAdd
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
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
    // else {
    //   const timeFormat = "hh:mm";
    //   const parsedTime = moment(formData.trainingStartTime, timeFormat, true);
    //   if (!parsedTime.isValid()) {
    //     validationErrors.trainingStartTime = "Invalid Training Start Time format.";
    //     document.getElementById("trainingStartTime")?.focus()
    //   }
    // }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const trimmedRest = trimFormData(formData);
      const data = {
        ...trimmedRest,
        
        trainingPlanID: editTrainingPlansData.trainingPlanID,
        section: "trainingDetails",
        trainingStartTime: moment(formData.trainingStartTime, "hh:mm A").format(
          "hh:mm A"
        ),
      };
      if (pathName === "trainingTemplate") {
        const trimmedRest = trimFormData(formData);
        const data = {
          ...trimmedRest,
          
          trainingPlanID: editTrainingPlansData.trainingPlanID,
          section: "trainingDetails",
          trainingStartTime: moment(
            formData.trainingStartTime,
            "hh:mm A"
          ).format("hh:mm A"),
          saveForLater: 1,
        };
        dispatch(
          addTrainingPlans({
            url: "/UpdateTrainingPlanDraftByID",
            payload: data,
          })
        );
      } else {
        dispatch(
          addTrainingPlans({ url: "/UpdateTrainingPlanByID", payload: data })
        );
      }
    }
  };

  useEffect(() => {
    if (TrainingPlansAddData && TrainingPlansAddData.code === 200) {
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearEditState());
        onClose();
        setTabValue(0);
      }, 2000);
    } else if (TrainingPlansAddData && TrainingPlansAddData.code === 500) {
      dispatch(clearAddState());
    }
  }, [TrainingPlansAddData]);

  const handleBack = () => {
    setTabValue(0);
  };

  const selectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  useEffect(() => {
    if (editTrainingPlansData) {
      setFormData((formData: any) => ({
        ...formData,
        warmupDuration: editTrainingPlansData.warmupDuration || "",
        warmupRoutine: editTrainingPlansData.warmupRoutine || "",
        mainTrainingPhase: editTrainingPlansData.mainTrainingPhase || "",
        cooldownRoutine: editTrainingPlansData.cooldownRoutine || "",
        totalTrainingDuration:
          editTrainingPlansData.totalTrainingDuration || "",
        trainingStartTime: editTrainingPlansData.trainingStartTime || "",
        trainingLocation: editTrainingPlansData.trainingLocation || "",
        additionalNotes: editTrainingPlansData.additionalNotes || "",
      }));
      setValue(
        "trainingStartTime",
        editTrainingPlansData &&
          editTrainingPlansData.trainingStartTime !== "" &&
          editTrainingPlansData.trainingStartTime !== "-"
          ? moment(editTrainingPlansData.trainingStartTime, "hh:mm A")
          : null
      );
    }
  }, [editTrainingPlansData]);

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
                    contentData={formData.mainTrainingPhase}
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
                  {errors.trainingStartTime && (
                    <Typography variant="caption" className="error-message">
                      {errors.trainingStartTime}
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
                  {errors.trainingLocation && (
                    <Typography variant="caption" className="error-message">
                      {errors.trainingLocation}
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
                    contentData={formData.warmupRoutine}
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
                    contentData={formData.cooldownRoutine}
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
                    contentData={formData.additionalNotes}
                    name="additionalNotes"
                    minHeight={"250px"}
                  />
                </Grid>
              </Grid>
            </Grid>
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
                sx={{ mr: 1, fontSize: "16px" }}
                onClick={() => {
                  handleBack();
                }}
                className="text-capitalize dubai-med"
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                loading={TrainingPlansAddData.loading}
                variant="contained"
                className="save-continue-button text-capitalize dubai-med"
              >
                {TrainingPlansAddData.loading ? "" : "Update"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default TrainingDetails;

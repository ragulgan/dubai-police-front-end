import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Button,
  SnackbarCloseReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import _ from "lodash";
import { usePathname } from "next/navigation";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import ReactSelect from "@/components/Fields/ReactSelect";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import moment from "moment";
import CustomTextField from "@/components/Fields/CustomTextField";
import { REGEX } from "@/utils/constants";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { trimFormData } from "@/utils/helper";
import {
  UpdateTrainingResultsByID,
  clearUpdateTrainingResults,
} from "@/redux/slices/trainingPlans/UpdateResultsSlice";
import { editTrainingPlans } from "@/redux/slices/trainingPlans/TrainingPlansEditSlice";
import CustomSnackbar from "@/components/CustomSnackbar";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  id: any;
  module?: string;
  TrainingPlansEdit?: any;
}

const status = [
  { label: "Not started", value: "notStarted" },
  { label: "In Progress", value: "inprogress" },
  { label: "Completed", value: "completed" },
];

const sessionHoursData = [
  { label: "01:00Hrs", value: "01:00Hrs" },
  { label: "02:00Hrs", value: "02:00Hrs" },
  { label: "03:00Hrs", value: "03:00Hrs" },
  { label: "04:00Hrs", value: "04:00Hrs" },
  { label: "05:00Hrs", value: "05:00Hrs" },
  { label: "06:00Hrs", value: "06:00Hrs" },
];

const UpdateTrainingSlider: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  TrainingPlansEdit,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const { control, setValue } = useForm<any>({
    defaultValues: {
      warmupResultsPlanned: null,
      warmupResultsCompleted: null,
      mainTrainingPhaseResultsPlanned: null,
      mainTrainingPhaseResultsCompleted: null,
      coolDownRoutinePlanned: null,
      cooldownRoutineCompleted: null,
    },
  });
  const [formData, setFormData] = useState<any>({
    trainingStatus: "",
    completedDate: "",
    sessionDuration: "",
    completionFeedback: "",
    warmupResultsPlanned: "",
    warmupResultsCompleted: "",
    warmupActivities: "",
    mainTrainingPhaseResultsPlanned: "",
    mainTrainingPhaseResultsCompleted: "",
    mainTrainingPhaseResultsActivities: "",
    coolDownRoutinePlanned: "",
    cooldownRoutineCompleted: "",
    coolDownRoutineActivities: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [SelectedStatusOption, setSelectedStatusOption] = useState<any>("");
  const [SelectedSessionDurationOption, setSelectedSessionDurationOption] =
    useState<any>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const updateTrainingResult = useSelector(
    (state: any) => state.UpdateTrainingResultByID
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

  const handleSubmit = () => {
    const validationErrors: any = {};
    const timeFormat = "HH:mm";
    const isTimeValid = (time: string): boolean => {
      return moment(time, timeFormat, true).isValid();
    };

    if (
      _.isEmpty(formData.completedDate) ||
      formData.completedDate === "Invalid date"
    ) {
      validationErrors.completedDate =
        "Training Start Date is required or Invalid date.";
      document.getElementById("completedDate")?.focus();
    }

    if (_.isEmpty(formData.trainingStatus)) {
      validationErrors.trainingStatus = "Training Status is required";
      document.getElementById("trainingStatus")?.focus();
    }
    const timeFields = [
      { key: "warmupResultsPlanned", label: "Warm-up Results Planned" },
      { key: "warmupResultsCompleted", label: "Warm-up Results Completed" },
      {
        key: "mainTrainingPhaseResultsPlanned",
        label: "Main Training Phase Results Planned",
      },
      {
        key: "mainTrainingPhaseResultsCompleted",
        label: "Main Training Phase Results Completed",
      },
      { key: "coolDownRoutinePlanned", label: "Cool Down Routine Planned" },
      { key: "cooldownRoutineCompleted", label: "Cool Down Routine Completed" },
    ];
    for (const field of timeFields) {
      const fieldValue = formData[field.key];
      if (!_.isEmpty(fieldValue)) {
        if (!isTimeValid(fieldValue)) {
          validationErrors[field.key] = `Invalid Time Format`;
          document.getElementById(field.key)?.focus();
        }
      }
    }

    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const trimmedRest = trimFormData(formData);
      const data = {
        ...trimmedRest,
        
        trainingPlanID: Number(id),
      };
      dispatch(UpdateTrainingResultsByID(data));
    }
  };

  const handleChangeStatus = (selectedOption: any | null): void => {
    if (selectedOption) {
      setSelectedStatusOption(selectedOption);
      setFormData({
        ...formData,
        trainingStatus: selectedOption.value,
      });
      setErrors({
        ...errors,
        trainingStatus: "",
      });
    }
  };

  const handleChangeSessionDuration = (selectedOption: any | null): void => {
    if (selectedOption) {
      setSelectedSessionDurationOption(selectedOption);
      setFormData({
        ...formData,
        sessionDuration: selectedOption.value,
      });
      setErrors({
        ...errors,
        sessionDuration: "",
      });
    }
  };

  const dateChange = (data: any) => {
    setFormData({
      ...formData,
      [data.name]: moment(data.value).format("DD/MM/YYYY"),
    });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setFormData({ ...formData, [name]: moment(value).format("hh:mm") });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  React.useEffect(() => {
    if (
      updateTrainingResult &&
      updateTrainingResult.code === 200 &&
      updateTrainingResult.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearUpdateTrainingResults());
      setTimeout(() => {
        onClose();
      }, 2000);
      const payload: any = {
        trainingPlanID: id,
        sportID: Number(teamId),
        
      };
      dispatch(editTrainingPlans(payload));
    } else if (
      updateTrainingResult &&
      updateTrainingResult.code === 500 &&
      updateTrainingResult.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearUpdateTrainingResults());
    }
  }, [updateTrainingResult]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (!_.isEmpty(TrainingPlansEdit)) {
      const updatedFormData = Object.fromEntries(
        Object.entries(TrainingPlansEdit || {}).map(([key, value]) => [
          key,
          value === "Invalid date" ? "" : value || "",
        ])
      );
      setFormData({
        ...updatedFormData,
        trainingStatus: TrainingPlansEdit?.trainingStatus || "",
        completedDate: TrainingPlansEdit?.completedDate || "",
        sessionDuration: TrainingPlansEdit?.sessionDuration || "",
        completionFeedback: TrainingPlansEdit?.completionFeedback || "",
      });
      setSelectedStatusOption({
        label:
          TrainingPlansEdit?.trainingStatus === "inprogress"
            ? "In Progress"
            : TrainingPlansEdit?.trainingStatus === "notStarted"
            ? "Not started"
            : TrainingPlansEdit?.trainingStatus === "completed"
            ? "Completed"
            : "",
        value: TrainingPlansEdit?.trainingStatus || "",
      });
      setSelectedSessionDurationOption({
        label: TrainingPlansEdit?.sessionDuration,
        value: TrainingPlansEdit?.sessionDuration,
      });
    }
  }, [TrainingPlansEdit]);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 550,
            py: 2,
          },
        }}
      >
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Updated Training Results successfully!"
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleSnackbarClose}
          />
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
            Update Training Results
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box px={3} py={1.5}>
          <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Training Status<span className="asterisk">*</span>
              </Typography>
              <ReactSelect
                name="trainingStatus"
                id="trainingStatus"
                classNamePrefix="select"
                handleChangeReactSelect={handleChangeStatus}
                options={status}
                value={
                  SelectedStatusOption && SelectedStatusOption.label === ""
                    ? null
                    : SelectedStatusOption
                }
                isDisabled={!status}
                placeholder={"Select Training Status"}
                isClearable={true}
              />
              {errors.trainingStatus && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.trainingStatus}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Completed Date <span className="asterisk">*</span>
              </Typography>
              <CustomDatePicker
                control={control}
                hidden={true}
                name="completedDate"
                id="completedDate"
                label="Completed Date"
                boxmb={0.8}
                minDate={moment().startOf("day")}
                maxDate={moment().add(10, "years")}
                onChange={dateChange}
                defaultValue={formData && formData.completedDate}
                className="Text-field-customise"
              />
              {errors.completedDate && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.completedDate}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Session Duration
              </Typography>
              <ReactSelect
                name="sessionDuration"
                id="sessionDuration"
                classNamePrefix="select"
                handleChangeReactSelect={handleChangeSessionDuration}
                options={sessionHoursData}
                value={
                  SelectedSessionDurationOption &&
                  SelectedSessionDurationOption.label === ""
                    ? null
                    : SelectedSessionDurationOption
                }
                isDisabled={!sessionHoursData}
                placeholder={"Select Session Duration"}
                isClearable={true}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Completion Feedback
              </Typography>
              <CustomTextField
                control={control}
                textarea={true}
                name="completionFeedback"
                placeholder="Enter Completion Feedback"
                type="text"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={formData.completionFeedback}
                onChange={handleChange}
                className="Text-field-customise"
                onKeyPress={(e) => {
                  if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 300 }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Warm Up Results
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Planned
              </Typography>
              <CustomTimePicker
                control={control}
                name="warmupResultsPlanned"
                id="warmupResultsPlanned"
                required={true}
                boxmb={0.8}
                onChange={timeChange}
                defaultValue={formData.warmupResultsPlanned}
                maxwidth={"100%"}
              />
              {errors.warmupResultsPlanned && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.warmupResultsPlanned}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Completed
              </Typography>
              <CustomTimePicker
                control={control}
                name="warmupResultsCompleted"
                id="warmupResultsCompleted"
                required={true}
                boxmb={0.8}
                onChange={timeChange}
                defaultValue={formData.warmupResultsCompleted}
                maxwidth={"100%"}
              />
              {errors.warmupResultsCompleted && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.warmupResultsCompleted}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Warmup Activities
              </Typography>
              <CustomTextField
                control={control}
                textarea={true}
                name="warmupActivities"
                placeholder="Enter Warmup Activities"
                type="text"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={formData.warmupActivities}
                onChange={handleChange}
                className="Text-field-customise"
                onKeyPress={(e) => {
                  if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 300 }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Main Training Phase Results
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Planned
              </Typography>
              <CustomTimePicker
                control={control}
                name="mainTrainingPhaseResultsPlanned"
                id="mainTrainingPhaseResultsPlanned"
                required={true}
                boxmb={0.8}
                onChange={timeChange}
                defaultValue={formData.mainTrainingPhaseResultsPlanned}
                maxwidth={"100%"}
              />
              {errors.mainTrainingPhaseResultsPlanned && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.mainTrainingPhaseResultsPlanned}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Completed
              </Typography>
              <CustomTimePicker
                control={control}
                name="mainTrainingPhaseResultsCompleted"
                id="mainTrainingPhaseResultsCompleted"
                required={true}
                boxmb={0.8}
                onChange={timeChange}
                defaultValue={formData.mainTrainingPhaseResultsCompleted}
                maxwidth={"100%"}
              />
              {errors.mainTrainingPhaseResultsCompleted && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.mainTrainingPhaseResultsCompleted}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Main Training Phase Results
              </Typography>
              <CustomTextField
                control={control}
                textarea={true}
                name="mainTrainingPhaseResultsActivities"
                placeholder="Enter Main Training Phase Results"
                type="text"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={formData.mainTrainingPhaseResultsActivities}
                onChange={handleChange}
                className="Text-field-customise"
                onKeyPress={(e) => {
                  if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 300 }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Cool down Routine
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Planned
              </Typography>
              <CustomTimePicker
                control={control}
                name="coolDownRoutinePlanned"
                id="coolDownRoutinePlanned"
                required={true}
                boxmb={0.8}
                onChange={timeChange}
                defaultValue={formData.coolDownRoutinePlanned}
                maxwidth={"100%"}
              />
              {errors.coolDownRoutinePlanned && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.coolDownRoutinePlanned}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Completed
              </Typography>
              <CustomTimePicker
                control={control}
                name="cooldownRoutineCompleted"
                id="cooldownRoutineCompleted"
                required={true}
                boxmb={0.8}
                onChange={timeChange}
                defaultValue={formData.cooldownRoutineCompleted}
                maxwidth={"100%"}
              />
              {errors.cooldownRoutineCompleted && (
                <Typography variant="caption" className="error-message" mt={2}>
                  {errors.cooldownRoutineCompleted}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Cool down Routine
              </Typography>
              <CustomTextField
                control={control}
                textarea={true}
                name="coolDownRoutineActivities"
                placeholder="Enter Cool down Routine"
                type="text"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={formData.coolDownRoutineActivities}
                onChange={handleChange}
                className="Text-field-customise"
                onKeyPress={(e) => {
                  if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 300 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
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
                  onClose();
                }}
                className="cancel-button text-capitalize dubai-med"
              >
                Cancel
              </Button>
              <LoadingButton
                onClick={handleSubmit}
                loading={updateTrainingResult.loading}
                variant="contained"
                className="save-continue-button text-capitalize dubai-med"
                disabled={updateTrainingResult.loading}
                type="submit"
              >
                Update
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};

export default UpdateTrainingSlider;

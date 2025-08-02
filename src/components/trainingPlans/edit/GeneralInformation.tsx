"use client";
import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  Alert,
  Snackbar,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import { useRouter } from "next/router";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  addTrainingPlans,
  clearAddState,
} from "@/redux/slices/trainingPlans/TrainingPlansAddSlice";
import {
  editTrainingPlans,
  clearEditState,
} from "@/redux/slices/trainingPlans/TrainingPlansEditSlice";
import { REGEX } from "@/utils/constants";
import ReactSelect from "@/components/Fields/ReactSelect";
import LoadingButton from "@mui/lab/LoadingButton";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { GeneralFormValidation } from "@/utils/trainingPlans/validation";
import TextSunEditor from "@/components/SunEditor";

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
  { label: "3 Sessions/Week", value: "3 Sessions/Week" },
  { label: "4 Sessions/Week", value: "4 Sessions/Week" },
  { label: "5 Sessions/Week", value: "5 Sessions/Week" },
  { label: "6 Sessions/Week", value: "6 Sessions/Week" },
  { label: "7 Sessions/Week", value: "7 Sessions/Week" },
  { label: "Custom", value: "Custom" },
];

const GeneralInformation = (props: any) => {
  const { handleSubmit, control } = useForm();
  const { editTrainingPlansData, teamId, onClose, id, setTabValue } = props;
  const router = useRouter();
  const pathName = router.pathname.split("/")[4];
  const dispatch: AppDispatch = useDispatch();
  const TrainingPlansAddData = useSelector(
    (state: RootState) => state.TrainingPlansAdd
  );
  const [formData, setFormData] = useState<any>({
    trainingType: "athlete",
    additionalCoach: "",
    trainingPlan: "",
    assignedCoach: "",
    trainingFrequency: "",
    trainingObjective: "",
    athleteName: "",
    trainingStartDate: "",
    trainingEndDate: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const getSportID = getLocalStorage("sport");
  const [AssignedCoachOption, setAssignedCoachOption] = useState();
  const [SelectedAssignedCoachOption, setSelectedAssignedCoachOption] =
    useState<any>(null);
  const [AdditionalCoachOption, setAdditionalCoachOption] = useState();
  const [SelectedAdditionalCoachOption, setSelectedAdditionalCoachOption] =
    useState<any>(null);
  const [actionType, setActionType] = useState("");
  const staffList = useSelector((state: RootState) => state.staffList);
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [AthletesOption, setAthletesOption] = useState();
  const [SelectedAthletesOption, setSelectedAthletesOption] =
    useState<any>(null);
  const [frequencyData, setFrequencyData] = useState<any>(null);
  const { validate } = GeneralFormValidation(
    formData,
    setErrors,
    frequencyData,
    id
  );
  const athleteData = getAthleteList && getAthleteList?.data;

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
  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const onSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const trimmedRest = trimFormData(formData);
      const data = {
        ...trimmedRest,
        trainingFrequency:
          formData.trainingFrequency === "Custom"
            ? frequencyData
            : formData.trainingFrequency,
        trainingPlanID: id,
        trainingStartDate: moment(
          formData.trainingStartDate,
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY"),
        trainingEndDate: moment(formData.trainingEndDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        
        section: "generalInformation",
      };
      if (pathName === "trainingTemplate") {
        const trimmedRest = trimFormData(formData);
        const data = {
          ...trimmedRest,
          trainingFrequency:
            formData.trainingFrequency === "Custom"
              ? frequencyData
              : formData.trainingFrequency,
          trainingPlanID: id,
          trainingStartDate: moment(
            formData.trainingStartDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          trainingEndDate: moment(
            formData.trainingEndDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          
          section: "generalInformation",
          saveForLater: 0,
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
      setShowBanner(false);
      dispatch(clearAddState());
      setFrequencyData("");
      const payload: any = {
        trainingPlanID: id,
        sportID: Number(teamId),
        
      };
      dispatch(editTrainingPlans(payload));
      setTabValue(1);
    } else if (TrainingPlansAddData && TrainingPlansAddData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    } else if (TrainingPlansAddData && TrainingPlansAddData.code === 409) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
        setFrequencyData("");
      }, 3000);
    }
  }, [TrainingPlansAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  useEffect(() => {
    if (!_.isEmpty(editTrainingPlansData)) {
      if (
        sessionData &&
        sessionData
          .map((item) => item.value)
          .includes(editTrainingPlansData.trainingFrequency)
      ) {
        setFrequencyData("");
      } else {
        setFrequencyData(editTrainingPlansData.trainingFrequency);
      }
      const AssignedCoaches = editTrainingPlansData.assignedCoach || "";
      const AdditionalCoach = editTrainingPlansData.additionalCoach || "";
      const AthleteNames = editTrainingPlansData.athleteName || "";
      const selOption: any = _.filter(
        AssignedCoachOption,
        (x: any) =>
          x.value && _.includes(AssignedCoaches.split(","), x.value.toString())
      );
      setSelectedAssignedCoachOption(selOption);
      const AdditionalselOption: any = _.filter(
        AdditionalCoachOption,
        (x: any) =>
          x.value && _.includes(AdditionalCoach.split(","), x.value.toString())
      );
      setSelectedAdditionalCoachOption(AdditionalselOption);
      const AthleteslOption: any = _.filter(
        AthletesOption,
        (x: any) =>
          x.value && _.includes(AthleteNames.split(","), x.value.toString())
      );
      setSelectedAthletesOption(AthleteslOption);
      setFormData((formData: any) => ({
        ...formData,
        trainingType: editTrainingPlansData.trainingType || "athlete",
        additionalCoach: editTrainingPlansData.additionalCoach || "",
        trainingPlan: editTrainingPlansData.trainingPlan || "",
        assignedCoach: editTrainingPlansData.assignedCoach || "",
        trainingFrequency:
          sessionData &&
          sessionData
            .map((item) => item.value)
            .includes(editTrainingPlansData.trainingFrequency)
            ? editTrainingPlansData.trainingFrequency
            : editTrainingPlansData.trainingFrequency === ""
            ? ""
            : "Custom",
        trainingObjective: editTrainingPlansData.trainingObjective || "",
        athleteName: editTrainingPlansData.athleteName || "",
        trainingStartDate: formatDates(editTrainingPlansData.trainingStartDate),
        trainingEndDate: formatDates(editTrainingPlansData.trainingEndDate),
      }));
    }
  }, [editTrainingPlansData, athleteData]);

  const closeAdd = () => {
    onClose();
    dispatch(clearEditState());
  };

  const data = staffList && staffList?.data;
  useEffect(() => {
    const AssignedCoach: any = getDefaultOption(data);
    setAssignedCoachOption(AssignedCoach);
    setAdditionalCoachOption(AssignedCoach);
  }, [data]);

  const filterOptions = (
    data: any[],
    selectedOption: any,
    otherSelectedOption: any | null
  ): any[] => {
    const selectedLabels = Array.isArray(selectedOption)
      ? selectedOption.map((option: any) => option.label)
      : selectedOption
      ? [selectedOption.label]
      : [];
    const otherSelectedLabels = Array.isArray(otherSelectedOption)
      ? otherSelectedOption.map((option: any) => option.label)
      : otherSelectedOption
      ? [otherSelectedOption.label]
      : [];
    // Exclude all selected labels from the options
    const excludedLabels = new Set([...selectedLabels, ...otherSelectedLabels]);
    return data.filter((option: any) => !excludedLabels.has(option.firstName));
  };

  const handleChangeAssigned = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues: any = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAssignedCoachOption(selectedOption);
      setFormData({
        ...formData,
        assignedCoach: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        assignedCoach: "",
      });

      const updatedAdditionalOptions: any = filterOptions(
        data,
        selectedOption,
        SelectedAdditionalCoachOption
      );
      const filterData: any = getDefaultOption(updatedAdditionalOptions);
      setAdditionalCoachOption(filterData);
    }
  };

  const handleChangeAdditional = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues: any = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAdditionalCoachOption(selectedOption);
      setFormData({
        ...formData,
        additionalCoach: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        additionalCoach: "",
      });
      const updatedAssignedOptions: any = filterOptions(
        data,
        selectedOption,
        SelectedAssignedCoachOption
      );
      const filterData: any = getDefaultOption(updatedAssignedOptions);
      setAssignedCoachOption(filterData);
    }
  };

  const getDefaultOption = (TrainingPlansList: any) => {
    const defaultOptions = [];
    for (const item in TrainingPlansList) {
      defaultOptions.push({
        label: TrainingPlansList[item].firstName,
        value: TrainingPlansList[item].staffID,
      });
    }
    return defaultOptions;
  };

  const timeChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues: any = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAthletesOption(selectedOption);
      setFormData({
        ...formData,
        athleteName: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        athletes: "",
      });
    }
  };

  useEffect(() => {
    if (!_.isEmpty(teamId)) {
      const payloads = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamId),
      };
      dispatch(getAthleteListAPI(payloads));
      const payload = {
        searchText: "",
        filteredBy: "Head Coach,Assistant Coach",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamId),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
  }, [teamId]);

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
            {showBanner &&
              TrainingPlansAddData &&
              !_.isEmpty(TrainingPlansAddData.message) && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    className="dubai-med"
                  >
                    {TrainingPlansAddData && TrainingPlansAddData.message}
                  </Alert>
                </Snackbar>
              )}
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Training Type
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="trainingType"
                    id="trainingType"
                    value={formData.trainingType}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="team"
                      control={<Radio />}
                      label="Team"
                    />
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="athlete"
                      control={<Radio />}
                      label="Athlete"
                      defaultChecked={true}
                    />
                  </RadioGroup>
                  {errors.gender && (
                    <Typography variant="caption" className="error-message">
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Training Plan <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="trainingPlan"
                  id="trainingPlan"
                  placeholder="Enter Training Plan"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.trainingPlan}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.trainingPlan && (
                  <Typography variant="caption" className="error-message">
                    {errors.trainingPlan}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                sx={{ opacity: formData.trainingType === "team" ? 0.5 : null }}
              >
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Athlete Name
                </Typography>
                <ReactSelect
                  name="athletes"
                  id="athletes"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeAthletes}
                  options={AthletesOption}
                  value={
                    SelectedAthletesOption &&
                    SelectedAthletesOption.label === ""
                      ? null
                      : SelectedAthletesOption
                  }
                  isDisabled={
                    !AthletesOption || formData.trainingType === "team"
                  }
                  placeholder={"Select Athlete"}
                  isClearable={true}
                  isMulti={true}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Assigned Coach
                </Typography>
                <ReactSelect
                  name="AssignedCoach"
                  id="AssignedCoach"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeAssigned}
                  options={AssignedCoachOption}
                  value={
                    SelectedAssignedCoachOption &&
                    SelectedAssignedCoachOption.label === ""
                      ? null
                      : SelectedAssignedCoachOption
                  }
                  isDisabled={!AssignedCoachOption}
                  placeholder={"Select Assigned Coach"}
                  isClearable={true}
                  isMulti={true}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Additional coach
                </Typography>
                <ReactSelect
                  name="AdditionalCoach"
                  id="AdditionalCoach"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeAdditional}
                  options={AdditionalCoachOption}
                  value={
                    SelectedAdditionalCoachOption &&
                    SelectedAdditionalCoachOption.label === ""
                      ? null
                      : SelectedAdditionalCoachOption
                  }
                  isDisabled={!AdditionalCoachOption}
                  placeholder={"Select Additional coach"}
                  isClearable={true}
                  isMulti={true}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Training Start Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="trainingStartDate"
                  id="trainingStartDate"
                  label="Training Start Date"
                  boxmb={0.8}
                  minDate={moment().startOf("day")}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.trainingStartDate}
                  className="Text-field-customise"
                />
                {errors.trainingStartDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.trainingStartDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Training End Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="trainingEndDate"
                  id="trainingEndDate"
                  label="Training End Date"
                  boxmb={0.8}
                  minDate={
                    formData.trainingStartDate
                      ? moment(formData.trainingStartDate)
                      : moment().startOf("day")
                  }
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.trainingEndDate}
                  className="Text-field-customise"
                />
                {errors.trainingEndDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.trainingEndDate}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Training Frequency
                </Typography>

                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.trainingFrequency}
                    onChange={timeChange}
                    name="trainingFrequency"
                    displayEmpty
                    className="Text-field-customise"
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
                        Select Training Frequency
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
                {formData && formData.trainingFrequency === "Custom" ? (
                  <>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                      sx={{ mt: 2 }}
                    >
                      Custom Training Frequency{" "}
                      <span className="asterisk">*</span>
                    </Typography>
                    <CustomTextField
                      name="trainingFrequencycustom"
                      placeholder="Enter Custom Training Frequency"
                      type="text"
                      variant="outlined"
                      fullWidth
                      value={frequencyData}
                      onChange={(e) => {
                        setFrequencyData(e.target.value);
                        setErrors({ ...errors, trainingFrequencycustom: "" });
                      }}
                      id="trainingFrequencycustom"
                      className="Text-field-customise"
                      onKeyPress={(e) => {
                        if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{ maxLength: 100 }}
                    />
                    {errors.trainingFrequencycustom && (
                      <Typography
                        variant="caption"
                        className="error-message"
                        mt={2}
                      >
                        {errors.trainingFrequencycustom}
                      </Typography>
                    )}
                  </>
                ) : null}
              </Grid>
              <Grid item xs={12} md={12} mb={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Training Objective
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.trainingObjective}
                  name="trainingObjective"
                  minHeight={"250px"}
                />
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
                sx={{ mr: 1 }}
                onClick={() => {
                  closeAdd();
                }}
                className="cancel-button text-capitalize dubai-med"
              >
                Cancel
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
export default GeneralInformation;

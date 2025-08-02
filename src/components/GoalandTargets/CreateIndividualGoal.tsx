"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  addGoalsTargets,
  clearAddState,
} from "@/redux/slices/goalsTargets/goalsTargetsAddSlice";
import { REGEX } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import ReactSelect from "@/components/Fields/ReactSelect";
import LoadingButton from "@mui/lab/LoadingButton";
import { trimFormData } from "@/utils/helper";
import TextSunEditor from "@/components/SunEditor";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
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

const CreateIndividualGoal = (props: any) => {
  const { selectedValue, seasonId } = props;
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const { teamID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsAddData = useSelector(
    (state: RootState) => state.addGoalsTargets
  );
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [formData, setFormData] = useState<any>({
    goalName: "",
    goalType: "athlete",
    startDate: "",
    endDate: "",
    athletes: "",
    goalStrategy: "",
    challenges: "",
    actionSteps: "",
    description: "",
    note: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [actionType, setActionType] = useState("");
  const [AthletesOption, setAthletesOption] = useState();
  const [SelectedAthletesOption, setSelectedAthletesOption] = useState("");
  const [AssignedCoachOption, setAssignedCoachOption] = useState();
  const [SelectedAssignedCoachOption, setSelectedAssignedCoachOption] =
    useState<any>(null);
  const staffList = useSelector((state: RootState) => state.staffList);

  useEffect(() => {
    const payloads = {
      searchText: "",
      filteredBy: "",
      paginationCount: 0,
      paginationIndex: 0,
      sportID: Number(teamID),
      seasonID: seasonId,
    };
    dispatch(getAthleteListAPI(payloads));
    if (teamID) {
      const payload = {
        searchText: "",
        filteredBy: "Head Coach,Assistant Coach",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
  }, [teamID]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "goalType") {
      setFormData({
        ...formData,
        [name]: value,
        athletes: "",
      });
      setSelectedAthletesOption("");
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    const validationErrors: any = {};
    if (
      !_.isEmpty(formData.startDate) &&
      !_.isEmpty(formData.endDate) &&
      moment(formData.endDate).isBefore(moment(formData.startDate))
    ) {
      validationErrors.endDate = "End Date cannot be earlier than Start Date";
      document.getElementById("endDate")?.focus();
    }
    if (_.isEmpty(formData.endDate)) {
      validationErrors.endDate = "End Date is required";
      document.getElementById("endDate")?.focus();
    }
    if (_.isEmpty(formData.startDate)) {
      validationErrors.startDate = "Start Date is required";
      document.getElementById("startDate")?.focus();
    }
    if (!formData.goalName || _.trim(formData.goalName) === "") {
      validationErrors.goalName = "Goal Name is required";
      document.getElementById("goalName")?.focus();
    }
    if (_.isEmpty(formData.athletes) && formData.goalType === "athlete") {
      validationErrors.athletes = "Athlete is required";
      document.getElementById("athletes")?.focus();
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { athleteName, athletes, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        startDate: moment(formData.startDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        endDate: moment(formData.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        sportID: Number(teamID),

        athlete:
          formData.goalType === "athlete"
            ? formData.athletes.split(",")[0].trim()
            : "team",
        goalsAndTargetsSection: "IndividualGoals",
        seasonID: seasonId,
      };
      dispatch(
        addGoalsTargets({ url: "/InsertGoalsAndTargets", payload: data })
      );
    }
  };

  const clearFormData = () => {
    setFormData({
      goalName: "",
      startDate: "",
      endDate: "",
      athletes: "",
      goalStrategy: "",
      challenges: "",
      actionSteps: "",
      description: "",
      athleteName: "",
      note: "",
    });
    setSelectedAthletesOption("");
  };

  useEffect(() => {
    if (goalsTargetsAddData && goalsTargetsAddData.code === 200) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsAddData.code);
      clearFormData();
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
        if (actionType === "save") {
          router.push(
            `/teams/${teamID}/goalsTargets?currentSeasonID=${seasonId}`
          );
        }
      }, 3000);
    } else if (goalsTargetsAddData && goalsTargetsAddData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsAddData.code);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [goalsTargetsAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleButtonClick = (type: string) => {
    setActionType(type);
  };

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAthletesOption(selectedOption);
      setFormData({
        ...formData,
        athletes: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        athletes: "",
      });
    }
  };

  const data = getAthleteList && getAthleteList?.data;
  useEffect(() => {
    const athletes: any = getDefaultOption(data);
    setAthletesOption(athletes);
  }, [data]);

  const getDefaultOption = (AthleteList: any) => {
    const defaultOptions = [];
    for (const item in AthleteList) {
      defaultOptions.push({
        label: AthleteList[item].firstName,
        value: AthleteList[item].athleteID,
      });
    }
    return defaultOptions;
  };

  const staffData = staffList && staffList?.data;
  useEffect(() => {
    const AssignedCoach: any = getDefaultOptions(staffData);
    setAssignedCoachOption(AssignedCoach);
  }, [staffData]);

  const getDefaultOptions = (TrainingPlansList: any) => {
    const defaultOptions = [];
    for (const item in TrainingPlansList) {
      defaultOptions.push({
        label: TrainingPlansList[item].firstName,
        value: TrainingPlansList[item].staffID,
      });
    }
    return defaultOptions;
  };

  const handleChangeAssigned = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues: any = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAssignedCoachOption(selectedOption);
      setFormData({
        ...formData,
        coachResponsible: selectedValues.join(","),
      });
    }
  };

  return (
    <Grid
      container
      sx={{
        padding: "2rem",
        position: "relative",
        overflow: "auto",
        // maxHeight: "680px",
      }}
    >
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `Individual Goals Added successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === 200 ? "success" : "error"}
          open={showBanner}
          onClose={handleClose}
        />
      )}
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems={{ xs: "top", md: "center" }}
      >
        <Box width="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Type
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="goalType"
                    id="goalType"
                    value={formData.goalType}
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
              <Grid
                item
                xs={12}
                md={5.75}
                sx={{ opacity: formData.goalType === "team" ? 0.5 : null }}
              >
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Athlete{" "}
                  <span
                    className={
                      formData.goalType === "team" ? "note-text" : "asterisk"
                    }
                  >
                    {formData.goalType === "team"
                      ? "(Not required for team goal type)"
                      : "*"}
                  </span>
                </Typography>
                <ReactSelect
                  name="athletes"
                  id="athletes"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeAthletes}
                  options={AthletesOption}
                  value={SelectedAthletesOption}
                  isDisabled={!AthletesOption || formData.goalType === "team"}
                  placeholder={"Select Athlete"}
                  className={
                    formData.goalType === "team" ? "disabled-athlete" : ""
                  }
                />
                {errors.athletes && (
                  <Typography variant="caption" className="error-message">
                    {errors.athletes}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="goalName"
                  id="goalName"
                  placeholder="Enter Goal e.g. (Win the championship league within the season.)"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.goalName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.goalName && (
                  <Typography variant="caption" className="error-message">
                    {errors.goalName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Start Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="startDate"
                  id="startDate"
                  label=" Start Date"
                  boxmb={0.8}
                  required={true}
                  // minDate={moment().subtract(50, 'years')}
                  minDate={moment().startOf("day")}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.startDate}
                  className="Text-field-customise"
                />
                {errors.startDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.startDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  End Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="endDate"
                  id="endDate"
                  label="End Date"
                  boxmb={0.8}
                  required={true}
                  minDate={formData.startDate || moment().subtract(50, "years")}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.endDate}
                  className="Text-field-customise"
                />
                {errors.endDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.endDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Coach Responsible
                </Typography>
                <ReactSelect
                  name="coachResponsible"
                  id="coachResponsible"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeAssigned}
                  options={AssignedCoachOption}
                  value={SelectedAssignedCoachOption}
                  isDisabled={!AssignedCoachOption}
                  placeholder={"Select Coach Responsible"}
                  isClearable={true}
                  isMulti={true}
                />
              </Grid>
              <Grid item xs={12} md={5.75} />

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Strategy
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.goalStrategy}
                  name="goalStrategy"
                  minHeight={"250px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Challenges
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.challenges}
                  name="challenges"
                  minHeight={"250px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Description
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.description}
                  name="description"
                  minHeight={"250px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Action Steps
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.actionSteps}
                  name="actionSteps"
                  minHeight={"250px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Note
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.note}
                  name="note"
                  minHeight={"250px"}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "6rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => {
                  router.back();
                }}
                className="cancel-button text-capitalize dubai-med season-goal-btn"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                onClick={() => handleButtonClick("saveAndNew")}
                loading={
                  goalsTargetsAddData.loading && actionType === "saveAndNew"
                }
                variant="contained"
                className="save-continue-button text-capitalize dubai-med season-goal-btn"
                sx={{
                  mr: 1,
                  color:
                    goalsTargetsAddData.loading && actionType === "saveAndNew"
                      ? "white"
                      : "white",
                }}
              >
                {goalsTargetsAddData.loading && actionType === "saveAndNew"
                  ? ""
                  : "Save & Add New"}
              </LoadingButton>
              <LoadingButton
                type="submit"
                size="small"
                onClick={() => handleButtonClick("save")}
                loading={goalsTargetsAddData.loading && actionType === "save"}
                variant="contained"
                className="save-continue-button text-capitalize save dubai-med season-goal-btn"
              >
                {goalsTargetsAddData.loading && actionType === "save"
                  ? ""
                  : "Save"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default CreateIndividualGoal;

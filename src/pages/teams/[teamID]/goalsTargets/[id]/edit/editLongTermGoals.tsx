"use client";
import { useContext, useEffect, useState } from "react";
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
  MenuItem,
  Select,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { rest } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  UpdateGoalsTargets,
  clearUpdateState,
} from "@/redux/slices/goalsTargets/goalsTargetsUpdateSlice";
import {
  GoalsAndTargets,
  GoalsAndTargetsSection,
  REGEX,
} from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { listGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsListSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import router from "next/router";
import ReactSelect from "@/components/Fields/ReactSelect";
import { formatDates, trimFormData } from "@/utils/helper";
import { editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import TextSunEditor from "@/components/SunEditor";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";

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

const EditLongTermGoals = (props: any) => {
  const { editGoalsTargetsData, id, onClose, seasonID } = props;
  const { handleSubmit, control } = useForm();
  const contextValue: any = "";
  const selectedValue: any = contextValue.selectedValue;
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsUpdateData = useSelector(
    (state: any) => state.updatedGoalsTargets
  );
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [formData, setFormData] = useState<any>({
    goal: "",
    goalType: "",
    startDate: "",
    endDate: "",
    team: "",
    athlete: "",
    goalStrategy: "",
    challenges: "",
    actionSteps: "",
    description: "",
    athleteName: "",
    note: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [AthletesOption, setAthletesOption] = useState();
  const [Athlete, setAthlete] = useState(false);
  const [SelectedAthletesOption, setSelectedAthletesOption] = useState("");
  const editData: any =
    editGoalsTargetsData &&
    editGoalsTargetsData.data &&
    editGoalsTargetsData.data[0];
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const updateCall = currentNav?.split("/")[4];
  const [AssignedCoachOption, setAssignedCoachOption] = useState();
  const [SelectedAssignedCoachOption, setSelectedAssignedCoachOption] =
    useState<any>(null);
  const staffList = useSelector((state: RootState) => state.staffList);

  useEffect(() => {
    const data =
      editGoalsTargetsData &&
      editGoalsTargetsData.data &&
      editGoalsTargetsData.data[0];
    if (!_.isEmpty(data)) {
      const AssignedCoaches = data?.coachResponsible || "";
      const selOption: any = _.filter(
        AssignedCoachOption,
        (x: any) =>
          x.value && _.includes(AssignedCoaches.split(","), x.value.toString())
      );
      setSelectedAssignedCoachOption(selOption);
      setFormData({
        goalName: data.goalName || "",
        goalType: data.goalType.toLowerCase() || "athlete",
        startDate: formatDates(data.startDate) || "",
        endDate: formatDates(data.endDate) || "",
        goalStrategy: data.goalStrategy || "",
        challenges: data.challenges || "",
        actionSteps: data.actionSteps || "",
        description: data.description || "",
        note: data.note || "",
        athlete: data?.athlete || "",
      });
    }
  }, [editGoalsTargetsData, staffList]);

  useEffect(() => {
    if (Athlete) {
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationCount: 100,
        paginationIndex: 1,
        sportID: Number(teamId),
      };
      dispatch(getAthleteListAPI(payload));
      setAthlete(false);
    } else {
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationCount: 100,
        paginationIndex: 1,
        sportID: Number(teamId),
      };
      dispatch(getAthleteListAPI(payload));
    }
    if (teamId) {
      const payload = {
        searchText: "",
        filteredBy: "Head Coach,Assistant Coach",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamId),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
  }, [teamId, Athlete]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "goalType") {
      setErrors({});
      setFormData({
        ...formData,
        [name]: value,
        athlete: "",
      });
      setSelectedAthletesOption("");
      if (value === "athlete") {
        setAthlete(true);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({
      ...errors,
      [name]: "",
      athlete: "",
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
    if (_.isEmpty(formData.athlete) && formData.goalType === "athlete") {
      validationErrors.athlete = "Athlete is required";
    }
    if (!formData.goalName || _.trim(formData.goalName) === "") {
      validationErrors.goalName = "Goal Name is required";
    }
    if (_.isEmpty(formData.startDate)) {
      validationErrors.startDate = "Start Date is required";
    }
    if (_.isEmpty(formData.endDate)) {
      validationErrors.endDate = "End Date is required";
    }
    if (
      !_.isEmpty(formData.startDate) &&
      !_.isEmpty(formData.endDate) &&
      moment(formData.endDate).isBefore(moment(formData.startDate))
    ) {
      validationErrors.endDate = "End Date cannot be earlier than Start Date";
    }

    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { athleteName, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        startDate: moment(formData.startDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        endDate: moment(formData.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        sportID: +teamId,
        
        goalsAndTargetsID: editData?.goalsAndTargetsID,
        athlete:
          formData.goalType === "athlete"
            ? formData.athlete.split(",")[0].trim()
            : "team",
        goalsAndTargetsSection: "IndividualGoals",
      };
      dispatch(UpdateGoalsTargets(data));
      setEditShow(true);
    }
  };

  const tabClose = () => {
    onClose();
  };

  useEffect(() => {
    if (
      goalsTargetsUpdateData &&
      goalsTargetsUpdateData.code === 200 &&
      editShow
    ) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsUpdateData.code);
      dispatch(clearUpdateState());
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
        tabClose();
        if (updateCall === "view") {
          const payload: any = {
            goalsAndTargetsID: id,
            sportID: teamId,
            seasonID: seasonID,
            
          };
          dispatch(editGoalsTargets(payload));
        } else {
          const payload = {
            sportID: +teamId,
            goalsAndTargetsSection: "",
            searchText: "",
            filteredBy: "",
            paginationIndex: 0,
            paginationCount: 0,
            seasonID: seasonID,
            
          };
          dispatch(
            listGoalsTargets({ url: "/GetGoalsAndTargetsList", payload })
          );
        }
      }, 2000);
    } else if (goalsTargetsUpdateData && goalsTargetsUpdateData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsUpdateData.code);
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    }
  }, [goalsTargetsUpdateData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAthletesOption(selectedOption);
      setFormData({
        ...formData,
        athlete: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        athlete: "",
      });
    }
  };

  const data = getAthleteList && getAthleteList?.data;
  useEffect(() => {
    const athlete: any = getDefaultOption(data);
    setAthletesOption(athlete);
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

  useEffect(() => {
    if (editGoalsTargetsData) {
      const data: any = getDefaultOption(getAthleteList?.data);
      const selOption: any = _.filter(data, (x: any) => {
        return (
          x.value &&
          typeof x.value !== "undefined" &&
          _.includes(editData?.athlete, x.value.toString())
        );
      });
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [selOption.value];
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        athlete: selectedValues.join(","),
      }));
      setSelectedAthletesOption(selOption);
    }
  }, [getAthleteList]);

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
    <Grid container spacing={0}>
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `Goals & Targets Updated successfully!`
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
        sx={{
          position: "relative",
          overflow: "hidden",
          mt: 2,
        }}
      >
        <Box width="100%" px={{xs: 5, sm: 5, md: 2, lg: 3, xl: 5 }}>
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
                md={12}
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
                  name="athlete"
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
                {errors.athlete && (
                  <Typography variant="caption" className="error-message">
                    {errors.athlete}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="goalName"
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
              <Grid item xs={12} md={12}>
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
                  label=" Start Date"
                  boxmb={0.8}
                  required={true}
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
              <Grid item xs={12} md={12}>
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
                  label="End Date"
                  boxmb={0.8}
                  required={true}
                  minDate={
                    moment(formData.startDate, "DD/MM/YYYY") ||
                    moment().subtract(50, "years")
                  }
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
              <Grid item xs={12} md={12}>
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
              <Grid item xs={12} md={12}>
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
              <Grid item xs={12} md={12}>
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
              <Grid item xs={12} md={12}>
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
              <Grid item xs={12} md={12}>
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
              <Grid item xs={12} md={12}>
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
                  tabClose();
                }}
                className="cancel-button text-capitalize dubai-med"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                loading={goalsTargetsUpdateData.loading}
                variant="contained"
                className="save-continue-button text-capitalize save dubai-med"
              >
                {goalsTargetsUpdateData.loading ? "" : "Update"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default EditLongTermGoals;

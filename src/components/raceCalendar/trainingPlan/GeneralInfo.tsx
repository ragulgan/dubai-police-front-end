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
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import { useRouter } from "next/router";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { REGEX } from "@/utils/constants";
import ReactSelect from "@/components/Fields/ReactSelect";
import LoadingButton from "@mui/lab/LoadingButton";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import {
  updateRaceCalendar,
  clearUpdateRaceCalendarState,
} from "@/redux/slices/raceCalendar/updateRaceCalendarSlice";
import {
  addRaceCalendar,
  clearAddRaceCalendarState,
} from "@/redux/slices/raceCalendar/raceCalendarAddSlice";
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

const GeneralInfo = (props: any) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      trainingStartDate: "",
    },
  });
  const {
    editData,
    onClose,
    setTabValue,
    setTrainingId,
    date,
    setDate,
    setAllData,
    allData,
    selectedSport,
  } = props;
  const router = useRouter();
  const { teamID } = router.query;
  const team = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const AddRaceCalendarResponse = useSelector(
    (state: any) => state.addRaceCalendar
  );
  const UpdateRaceCalendarResponse = useSelector(
    (state: any) => state.updateRaceCalendar
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
  const [AssignedCoachOption, setAssignedCoachOption] = useState();
  const [SelectedAssignedCoachOption, setSelectedAssignedCoachOption] =
    useState<any>(null);
  const [AdditionalCoachOption, setAdditionalCoachOption] = useState();
  const [SelectedAdditionalCoachOption, setSelectedAdditionalCoachOption] =
    useState<any>(null);
  const staffList = useSelector((state: RootState) => state.staffList);
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [AthletesOption, setAthletesOption] = useState();
  const [SelectedAthletesOption, setSelectedAthletesOption] =
    useState<any>(null);
  const [frequencyData, setFrequencyData] = useState<any>(null);
  const athleteData: any = getAthleteList && getAthleteList?.data;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "trainingType" && value === "team") {
      setSelectedAthletesOption("");
    }
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
    const validationErrors: any = {};
    if (_.isEmpty(frequencyData) && formData.trainingFrequency === "Custom") {
      validationErrors.trainingFrequencycustom =
        "Please select other training frequency or type the custom training frequency";
      document.getElementById("trainingFrequencycustom")?.focus();
    }
    if (
      !_.isEmpty(formData.trainingStartDate) &&
      !_.isEmpty(formData.trainingEndDate) &&
      moment(formData.trainingEndDate, "DD/MM/YYYY").isBefore(
        moment(formData.trainingStartDate, "DD/MM/YYYY")
      )
    ) {
      validationErrors.trainingEndDate =
        "Training End Date cannot be earlier than Start Date";
      document.getElementById("trainingEndDate")?.focus();
    }
    if (_.isEmpty(formData.trainingEndDate)) {
      validationErrors.trainingEndDate = "Training End Date is required";
    }
    if (_.isEmpty(formData.trainingStartDate)) {
      validationErrors.trainingStartDate = "Training Start Date is required";
      document.getElementById("trainingStartDate")?.focus();
    }
    if (!formData.trainingPlan || _.trim(formData.trainingPlan) === "") {
      validationErrors.trainingPlan = "Training Plan is required";
      document.getElementById("trainingPlan")?.focus();
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      if (!isEmpty(editData) && editData.trainingID) {
        const trimmedRest = trimFormData(formData);
        const data = {
          ...trimmedRest,
          trainingFrequency:
            formData.trainingFrequency === "Custom"
              ? frequencyData
              : formData.trainingFrequency,
          trainingStartDate: moment(
            formData.trainingStartDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          trainingEndDate: moment(
            formData.trainingEndDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),

          section: "trainingGeneralDetails",
          trainingID: editData?.trainingID,
          sportID:
            router.pathname === "/competition-calendar"
              ? selectedSport.join(",")
              : Number(teamID),
        };
        dispatch(updateRaceCalendar(data));
      } else {
        const trimmedRest = trimFormData(formData);
        const data = {
          ...trimmedRest,
          trainingFrequency:
            formData.trainingFrequency === "Custom"
              ? frequencyData
              : formData.trainingFrequency,
          trainingStartDate: moment(
            formData.trainingStartDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          trainingEndDate: moment(
            formData.trainingEndDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),

          section: "training",
          trainingID: editData?.trainingID,
          sportID:
            router.pathname === "/competition-calendar"
              ? selectedSport.join(",")
              : Number(teamID),
        };
        dispatch(addRaceCalendar(data));
      }
    }
  };

  useEffect(() => {
    if (
      (AddRaceCalendarResponse && AddRaceCalendarResponse.code === 200) ||
      (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse.code === 200)
    ) {
      setShowBanner(false);
      setTrainingId(
        AddRaceCalendarResponse &&
        AddRaceCalendarResponse.data &&
        AddRaceCalendarResponse.data?.trainingID
      );
      dispatch(clearAddRaceCalendarState());
      dispatch(clearUpdateRaceCalendarState());
      setFrequencyData("");
      setTabValue(1);
      setDate(null);
      const { ...rest } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        PersonalInformation: rest,
        frequencyData: frequencyData,
      }));
    } else if (
      (AddRaceCalendarResponse && AddRaceCalendarResponse.code === 500) ||
      (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse.code === 500)
    ) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddRaceCalendarState());
        dispatch(clearUpdateRaceCalendarState());
        setShowBanner(false);
      }, 3000);
    } else if (
      (AddRaceCalendarResponse && AddRaceCalendarResponse.code === 409) ||
      (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse.code === 409)
    ) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddRaceCalendarState());
        dispatch(clearUpdateRaceCalendarState());
        setShowBanner(false);
        setFrequencyData("");
      }, 3000);
    }
  }, [AddRaceCalendarResponse, UpdateRaceCalendarResponse]);

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
    return () => {
      setFormData({
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
      setSelectedAssignedCoachOption("");
      setSelectedAdditionalCoachOption("");
      setSelectedAthletesOption("");
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(editData) || date !== null) {
      if (
        sessionData &&
        sessionData
          .map((item) => item.value)
          .includes(editData?.trainingFrequency)
      ) {
        setFrequencyData("");
      } else {
        setFrequencyData(editData?.trainingFrequency);
      }
      const AssignedCoaches =
        editData && editData.assignedCoach ? editData.assignedCoach : "";
      const AdditionalCoach =
        editData && editData.additionalCoach ? editData.additionalCoach : "";
      const AthleteNames =
        editData && editData.athleteName ? editData.athleteName : "";
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
        trainingType: editData?.trainingType || "athlete",
        additionalCoach: editData?.additionalCoach || "",
        trainingPlan: editData?.trainingPlan || "",
        assignedCoach: editData?.assignedCoach || "",
        trainingFrequency:
          sessionData &&
            sessionData
              .map((item) => item.value)
              .includes(editData?.trainingFrequency)
            ? editData?.trainingFrequency
            : editData
              ? "Custom"
              : "",
        trainingObjective: editData?.trainingObjective || "",
        athleteName: editData?.athleteName || "",
        trainingStartDate: date
          ? moment(date).format("DD/MM/YYYY")
          : !_.isEmpty(editData)
            ? editData?.trainingStartDate
            : null,
        trainingEndDate:
          editData && editData?.trainingEndDate
            ? formatDates(editData?.trainingEndDate)
            : null,
      }));
      // const athleteIDs = editData?.athleteName
      //   .split(",")
      //   .map((id: any) => id.trim());
        const athleteIDs = editData?.athleteName
  ? editData.athleteName.split(",").map((id: any) => id.trim())
  : [];
      let selectedAthletes = [];
      if (athleteData && athleteData.length) {
        selectedAthletes = athleteData
          ?.filter((athlete: any) =>
            athleteIDs?.includes(athlete.athleteID.toString())
          )
          .map((athlete: any) => ({
            label: `${athlete.firstName}`.trim(),
            value: athlete.athleteID,
          }));
      }
      setSelectedAthletesOption(selectedAthletes);
    }
  }, [editData, date, athleteData]);

  const closeAdd = () => {
    onClose();
    setDate(null);
    setAllData({});
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
    if (!_.isEmpty(teamID) || team) {
      const payloads = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID) || team,
      };
      dispatch(getAthleteListAPI(payloads));
      const payload = {
        searchText: "",
        filteredBy: "Head Coach,Assistant Coach",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID) || team,
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
  }, [teamID, team]);

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

  useEffect(() => {
    if (allData.PersonalInformation) {
      if (
        sessionData &&
        sessionData
          .map((item) => item.value)
          .includes(allData?.trainingFrequency)
      ) {
        setFrequencyData(allData?.trainingFrequency);
      } else {
        setFrequencyData("");
      }
      setFormData((formData: any) => ({
        ...formData,
        trainingType: allData.PersonalInformation.trainingType || "athlete",
        additionalCoach: allData.PersonalInformation.additionalCoach || "",
        trainingPlan: allData.PersonalInformation.trainingPlan || "",
        assignedCoach: allData.PersonalInformation.assignedCoach || "",
        trainingFrequency: allData.PersonalInformation.trainingFrequency || "",
        trainingObjective: allData.PersonalInformation.trainingObjective || "",
        athleteName: allData.PersonalInformation.athleteName || "",
        trainingStartDate: formatDates(
          allData.PersonalInformation.trainingStartDate
        ),
        trainingEndDate: formatDates(
          allData.PersonalInformation.trainingEndDate
        ),
      }));

      const AssignedCoaches =
        allData.PersonalInformation.assignedCoach ? allData.PersonalInformation.assignedCoach : "";
      const AdditionalCoach =
        allData.PersonalInformation.additionalCoach ? allData.PersonalInformation.additionalCoach : "";
      const AthleteNames =
        allData.PersonalInformation.athleteName ? allData.PersonalInformation.athleteName : "";
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
      setFrequencyData(allData.frequencyData);
    }
  }, [allData, athleteData]);

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
            {(showBanner &&
              AddRaceCalendarResponse &&
              !_.isEmpty(AddRaceCalendarResponse.message)) ||
              (showBanner &&
                UpdateRaceCalendarResponse &&
                !_.isEmpty(UpdateRaceCalendarResponse.message) && (
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
                      {(AddRaceCalendarResponse &&
                        AddRaceCalendarResponse.message) ||
                        (UpdateRaceCalendarResponse &&
                          UpdateRaceCalendarResponse.message)}
                    </Alert>
                  </Snackbar>
                ))}
            <Grid container spacing={2} justifyContent={"space-between"} px={1}>
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
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
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
                  defaultValue={
                    (formData && formData.trainingStartDate) || moment(date)
                  }
                  minDate={moment().startOf("day")}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
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
                      ? moment(formData.trainingStartDate, "DD/MM/YYYY")
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
              <Grid item xs={12} md={12} mb={2}>
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
                loading={
                  AddRaceCalendarResponse.loading ||
                  UpdateRaceCalendarResponse.loading
                }
                variant="contained"
                className="save-continue-button text-capitalize dubai-med"
                disabled={
                  AddRaceCalendarResponse.loading ||
                  UpdateRaceCalendarResponse.loading
                }
              >
                {AddRaceCalendarResponse.loading ||
                  UpdateRaceCalendarResponse.loading
                  ? ""
                  : isEmpty(editData)
                    ? "Save & Continue"
                    : "Update"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default GeneralInfo;

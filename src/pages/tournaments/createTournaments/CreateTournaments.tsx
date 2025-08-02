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
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  addGoalsTargets,
  clearAddState,
} from "@/redux/slices/goalsTargets/goalsTargetsAddSlice";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
  USER_ERROR,
} from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import ReactSelect from "@/components/Fields/ReactSelect";
import LoadingButton from "@mui/lab/LoadingButton";
import { trimFormData } from "@/utils/helper";
import FileUpload from "@/utils/dropzone";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import AddIcon from "@mui/icons-material/Add";
import AddMatch from "./AddMatch";

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

const CreateTournaments = (props: any) => {
  const { selectedValue } = props;
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsAddData = useSelector(
    (state: RootState) => state.addGoalsTargets
  );
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [formData, setFormData] = useState<any>({
    tournamentName: "",
    tournamentType: "",
    organizerName: "",
    organizerEmail: "",
    description: "",
    sport: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [open, setOpen] = useState<any>();
  const [actionType, setActionType] = useState("");
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [SportsOption, setSportsOption] = useState();
  const [SelectedSportsOption, setSelectedSportsOption] = useState("");
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
  }, []);

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
    const validationErrors: any = {};
    if (!formData.tournamentName || _.trim(formData.tournamentName) === "") {
      validationErrors.tournamentName = "Tournament Name is required";
    }
    if (_.isEmpty(formData.tournamentType)) {
      validationErrors.tournamentType = "Tournament Type is required";
    }
    if (_.isEmpty(formData.sport)) {
      validationErrors.sport = "Sport is required";
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
    if (
      !_.isEmpty(formData.organizerEmail) &&
      !REGEX.GOVERMENT_EMAIL.test(formData.organizerEmail)
    ) {
      validationErrors.organizerEmail = USER_ERROR.EMAIL_INVALID;
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

        athlete:
          formData.tournamentType === "athlete"
            ? formData.athletes.split(",")[0].trim()
            : formData.athletes,
        goalsAndTargetsSection: "IndividualGoals",
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
      organizerEmail: "",
      challenges: "",
      actionSteps: "",
      description: "",
      athleteName: "",
      note: "",
    });
    setSelectedSportsOption("");
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
          router.push(`/teams/${teamId}/goalsTargets`);
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

  const handleChangeSports = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedSportsOption(selectedOption);
      setFormData({
        ...formData,
        sport: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        sport: "",
      });
    }
  };

  const teamsNames = getSportList && getSportList.data;
  useEffect(() => {
    const teams: any = getDefaultOption(teamsNames);
    setSportsOption(teams);
  }, [teamsNames]);

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

  return (
    <Grid
      container
      sx={{
        padding: "2rem",
        position: "relative",
        overflow: "auto",
        maxHeight: "680px",
      }}
    >
      {open && <AddMatch open={open} setOpen={setOpen} />}
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
        <Box
          width="100%"
          mx={{ sm: 5, md: 1, lg: 1, xl: 5 }}
          px={{ sm: 5, md: 2, lg: 3, xl: 5 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Tournament Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="tournamentName"
                  placeholder="Enter Tournament Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.tournamentName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.tournamentName && (
                  <Typography variant="caption" className="error-message">
                    {errors.tournamentName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Select Sport <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  isMulti={false}
                  name="sport"
                  className="select2"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeSports}
                  options={SportsOption}
                  value={SelectedSportsOption}
                  isDisabled={!SportsOption}
                  placeholder="Select Sport"
                />
                {errors.sport && (
                  <Typography variant="caption" className="error-message">
                    {errors.sport}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Tournament Type <span className="asterisk">*</span>
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="tournamentType"
                    value={formData.tournamentType}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="internal"
                      control={<Radio />}
                      label="Internal"
                    />
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="external"
                      control={<Radio />}
                      label="External"
                    />
                  </RadioGroup>
                  {errors.tournamentType && (
                    <Typography variant="caption" className="error-message">
                      {errors.tournamentType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5.5}>
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
                  minDate={moment()}
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
              <Grid item xs={12} md={5.5}>
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
                  minDate={formData.startDate || moment()}
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
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Organizer Name
                </Typography>
                <CustomTextField
                  name="organizerName"
                  placeholder="Enter Organizer Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.organizerName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.organizerName && (
                  <Typography variant="caption" className="error-message">
                    {errors.organizerName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Organizer Email
                </Typography>
                <CustomTextField
                  name="organizerEmail"
                  placeholder="Enter Organizer Email"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.organizerEmail && (
                  <Typography variant="caption" className="error-message">
                    {errors.organizerEmail}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5} mb={5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Description
                </Typography>
                <CustomTextField
                  name="description"
                  placeholder="Enter Description"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description || ""}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5.5} mb={5} />
              <Grid item xs={12} md={5.5} mt={7}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Match
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="text-capitalize"
                    fullWidth
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Add Match
                  </Button>
                </Box>
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
                color="error"
                sx={{ mr: 1 }}
                onClick={() => {
                  router.back();
                }}
                className="cancel-button text-capitalize"
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
                className="save-continue-button text-capitalize"
                sx={{
                  marginRight: "1rem",
                  color:
                    goalsTargetsAddData.loading && actionType === "saveAndNew"
                      ? "white"
                      : "white",
                }}
              >
                {goalsTargetsAddData.loading && actionType === "saveAndNew"
                  ? ""
                  : "Save & New"}
              </LoadingButton>
              <LoadingButton
                type="submit"
                size="small"
                onClick={() => handleButtonClick("save")}
                loading={goalsTargetsAddData.loading && actionType === "save"}
                variant="contained"
                className="save-continue-button text-capitalize save"
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
export default CreateTournaments;

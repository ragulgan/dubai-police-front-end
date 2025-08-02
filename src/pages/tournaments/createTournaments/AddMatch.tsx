import { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import CustomTextField from "@/components/Fields/CustomTextField";
import { REGEX, USER_ERROR } from "@/utils/constants";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Grid,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import moment from "moment";
import router from "next/router";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { trimFormData } from "@/utils/helper";
import { addGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsAddSlice";
import _ from "lodash";
import { useForm } from "react-hook-form";
import ReactSelect from "@/components/Fields/ReactSelect";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Tournament = [{ label: "Round-Robin", value: "Round-Robin" }];
const TeamA = [{ label: "Dubai Police Sports", value: "Dubai Police Sports" }];

export default function AddMatch(props: any) {
  const { setOpen, open } = props;
  const { handleSubmit, control } = useForm();
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsAddData = useSelector(
    (state: RootState) => state.addGoalsTargets
  );
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [formData, setFormData] = useState<any>({
    tournamentFormat: "",
    competitionType: "",
    teamB: "",
    location: "",
    asHome: "",
    matchTime: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [TournamentFormatOption, setTournamentFormatOption] = useState();
  const [SelectedTournamentFormatOption, setSelectedTournamentFormatOption] =
    useState("");
  const [TeamAOption, setTeamAOption] = useState();
  const [SelectedTeamAOption, setSelectedTeamAOption] = useState("");
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

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

  const onSubmit = () => {
    const validationErrors: any = {};
    if (!formData.location || _.trim(formData.location) === "") {
      validationErrors.location = "Tournament Name is required";
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeTeamA = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedTeamAOption(selectedOption);
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

  const handleChangeTournamentFormat = (selectedOption: any | null): void => {
    if (selectedOption) {
      setSelectedTournamentFormatOption(selectedOption);
      setFormData({
        ...formData,
        sport: selectedOption,
      });
      setErrors({
        ...errors,
        sport: "",
      });
    }
  };

  // const teamsNames = getSportList && getSportList.data
  // useEffect(() => {
  //   const teams: any = getDefaultOption(teamsNames)
  //   setTeamAOption(teams)
  // }, [teamsNames])

  // const getDefaultOption = (teamsNames: any) => {
  //   const defaultOptions = []
  //   for (const item in teamsNames) {
  //     defaultOptions.push({ label: teamsNames[item].sportName, value: teamsNames[item].sportID })
  //   }
  //   return defaultOptions
  // }

  return (
    <Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          sx: {
            width: "1110px",
            height: "1110px",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add Matches
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
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
                  <Grid item xs={12} md={12}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Competition Type <span className="asterisk">*</span>
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name="competitionType"
                        value={formData.competitionType}
                        onChange={handleChange}
                        row
                      >
                        <FormControlLabel
                          className="dubai-med textfield-label"
                          value="Individual"
                          control={<Radio />}
                          label="Individual"
                        />
                        <FormControlLabel
                          className="dubai-med textfield-label"
                          value="Team"
                          control={<Radio />}
                          label="Team"
                        />
                      </RadioGroup>
                      {errors.competitionType && (
                        <Typography variant="caption" className="error-message">
                          {errors.competitionType}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Tournament Format <span className="asterisk">*</span>
                    </Typography>
                    <ReactSelect
                      isMulti={false}
                      name="tournamentFormat"
                      className="select2"
                      classNamePrefix="select"
                      handleChangeReactSelect={handleChangeTournamentFormat}
                      options={Tournament}
                      value={SelectedTournamentFormatOption}
                      isDisabled={!Tournament}
                      placeholder="Tournament Format"
                    />
                    {errors.tournamentFormat && (
                      <Typography variant="caption" className="error-message">
                        {errors.tournamentFormat}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Location
                    </Typography>
                    <CustomTextField
                      name="location"
                      placeholder="Enter Location"
                      type="text"
                      control={control}
                      variant="outlined"
                      fullWidth
                      value={formData.location}
                      onChange={handleChange}
                      className="Text-field-customise"
                      inputProps={{ maxLength: 50 }}
                      onKeyPress={(e) => {
                        if (!REGEX.ALPHA_NUMERIC_SPECIAL_CHARS.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.location && (
                      <Typography variant="caption" className="error-message">
                        {errors.location}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Team A <span className="asterisk">*</span>
                    </Typography>
                    <ReactSelect
                      isMulti={false}
                      name="sport"
                      className="select2"
                      classNamePrefix="select"
                      handleChangeReactSelect={handleChangeTeamA}
                      options={TeamA}
                      value={SelectedTeamAOption}
                      isDisabled={!TeamA}
                      placeholder="Team A"
                    />
                    {errors.sport && (
                      <Typography variant="caption" className="error-message">
                        {errors.sport}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Team B <span className="asterisk">*</span>
                    </Typography>
                    <CustomTextField
                      name="teamB"
                      placeholder="Enter Team B"
                      type="text"
                      control={control}
                      variant="outlined"
                      fullWidth
                      value={formData.teamB}
                      onChange={handleChange}
                      className="Text-field-customise"
                      inputProps={{ maxLength: 50 }}
                      onKeyPress={(e) => {
                        if (!REGEX.ALPHA_NUMERIC_SPECIAL_CHARS.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.teamB && (
                      <Typography variant="caption" className="error-message">
                        {errors.teamB}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name="asHome"
                        value={formData.asHome}
                        onChange={handleChange}
                        row
                      >
                        <FormControlLabel
                          style={{ marginLeft: "3px" }}
                          className="textfield-label"
                          control={<div />}
                          label={<span className="textfield-label">as</span>}
                        />
                        <FormControlLabel
                          className="dubai-med textfield-label"
                          value="Home"
                          control={<Radio />}
                          label="Home"
                        />
                        <FormControlLabel
                          className="dubai-med textfield-label"
                          value="Away"
                          control={<Radio />}
                          label="Away"
                        />
                      </RadioGroup>
                      {errors.asHome && (
                        <Typography variant="caption" className="error-message">
                          {errors.asHome}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={5.5}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name="asHome"
                        value={formData.asHome}
                        onChange={handleChange}
                        row
                      >
                        <FormControlLabel
                          style={{ marginLeft: "3px" }}
                          className="textfield-label"
                          control={<div />}
                          label={<span className="textfield-label">as</span>}
                        />
                        <FormControlLabel
                          className="dubai-med textfield-label"
                          value="Home"
                          // control={<CheckCircleIcon style={{ color: "blue"}}/>}
                          control={<Radio />}
                          label="Home"
                        />
                        <FormControlLabel
                          className="dubai-med textfield-label"
                          value="Away"
                          control={<Radio />}
                          label="Away"
                        />
                      </RadioGroup>
                      {errors.asHome && (
                        <Typography variant="caption" className="error-message">
                          {errors.asHome}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <FormControl>
                      <FormLabel className="typography textfield-label bukra">
                        Match Time
                      </FormLabel>
                      <RadioGroup
                        name="matchTime"
                        value={formData.matchTime}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="Only Once"
                          control={<Radio />}
                          label="Only Once"
                          className="dubai-med textfield-label"
                        />
                        <FormControlLabel
                          value="Every"
                          control={<Radio />}
                          label="Every"
                          className="dubai-med textfield-label"
                        />
                      </RadioGroup>

                      <Button
                        variant="outlined"
                        // startIcon={<AddIcon />}
                        className="text-capitalize"
                        fullWidth
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        + Add time slot
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
                <DialogActions>
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
                        setOpen(false);
                      }}
                      className="cancel-button text-capitalize"
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      size="small"
                      // onClick={() => handleButtonClick()}
                      // loading={goalsTargetsAddData.loading && actionType === "saveAndNew"}
                      variant="contained"
                      className="save-continue-button text-capitalize"
                      sx={{
                        marginRight: "1rem",
                        // color: goalsTargetsAddData.loading && actionType === "saveAndNew" ? "white" : "white",
                      }}
                    >
                      {/* {goalsTargetsAddData.loading && actionType === "saveAndNew" ? "" : "Save & New"} */}
                      Save
                    </LoadingButton>
                  </Box>
                </DialogActions>
              </form>
            </Box>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </Fragment>
  );
}

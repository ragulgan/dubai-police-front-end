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
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { REGEX } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { getLocalStorage, trimFormData } from "@/utils/helper";
import TextSunEditor from "@/components/SunEditor";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import { ResultFormValidation } from "@/utils/results/validation";
import {
  addResults,
  clearResultAddState,
} from "@/redux/slices/results/ResultAddSlice";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import { viewResults } from "@/redux/slices/results/ResultListSlice";
import AppAlertDialog from "@/components/AppAlertDialog";
import { getNotificationModuleByID } from "@/redux/slices/notification/getNotificationModuleByID";
import {
  addNotification,
  clearNotificationAddState,
} from "@/redux/slices/notification/NotificationAddSlice";
import ReactSelect from "@/components/Fields/ReactSelect";

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

const unitOptionsMap: any = {
  Time: [
    { label: "Seconds (s)", value: "s" },
    { label: "Minutes (min)", value: "min" },
    { label: "Hours (hr)", value: "hr" },
  ],
  Distance: [
    { label: "Meters (m)", value: "m" },
    { label: "Kilometers (km)", value: "km" },
    { label: "Yards (yd)", value: "yd" },
    { label: "Miles (mi)", value: "mi" },
  ],
  Score: [
    { label: "Points", value: "points" },
    { label: "Goals", value: "goals" },
    { label: "Hits", value: "hits" },
    { label: "Pins", value: "pins" },
  ],
  Rank: [
    { label: "Position", value: "Position" },
    { label: "Standing", value: "Standing" },
  ],
  Reps: [{ label: "Count (reps)", value: "count" }],
  Weight: [
    { label: "Kilograms (kg)", value: "kg" },
    { label: "Pounds (lb)", value: "lb" },
  ],
  Speed: [
    { label: "Meters per second (m/s)", value: "mps" },
    { label: "Kilometers per hour (km/h)", value: "kmph" },
  ],
  Accuracy: [{ label: "Percentage (%)", value: "percentage" }],
  Others: [{ label: "Custom Unit Entry", value: "custom" }],
};

const resultTypeOptions = [
  { label: "Time", value: "Time" },
  { label: "Distance", value: "Distance" },
  { label: "Score", value: "Score" },
  { label: "Rank", value: "Rank" },
  { label: "Reps", value: "Reps" },
  { label: "Weight", value: "Weight" },
  { label: "Speed", value: "Speed" },
  { label: "Accuracy", value: "Accuracy" },
  { label: "Others", value: "Others" },
];

const AddResults = (props: any) => {
  const { editResultData, id, onClose, sportIdEdit } = props;
  const { control } = useForm();
  const router = useRouter();
  const { sportId } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const resultsAddData = useSelector((state: RootState) => state.addResult);
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const fileTypes = ["JPG", "PNG", "pdf", "doc"];
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    resultCategory: "",
    homeTeamName: "",
    awayTeamName: "",
    resultType: "",
    unit: "",
    homeTeamValue: "",
    awayTeamValue: "",
    eventName: "",
    eventLocation: "",
    eventDate: "",
    eventTime: "",
    sportsCategory: "",
    raceRelevanceAndImportance: "",
    discipline: "",
    categoryRanking: "",
    generalRanking: "",
    achievement: "",
    seasonalLeagueRanking: "",
    selectWinner: "",
    performance: "",
    comments: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [fileName, setFileName] = useState("");
  const currentNav = usePathname();
  const currentPath = currentNav?.split("/")[1];
  const teamId = currentNav?.split("/")[2];
  const teamView = currentNav?.split("/")[4];
  const { validate } = ResultFormValidation(formData, setErrors);
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const sportSearchId = urlParams.get("sportId");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [SelectedSportsOption, setSelectedSportsOption] = useState<any>("");
  const [SportsOption, setSportsOption] = useState<any>();
  const [selectedSport, setSelectedSport] = useState<any>([]);
  const GetNotificationModuleByIDData = useSelector((state: any) => {
    return state.getNotificationModuleByID;
  });
  const getCurrentSport = getLocalStorage("sport");

  useEffect(() => {
    if (process.env.ENABLE_NOTIFICATION === "yes") {
      const payload: any = {
        moduleID: "111",
      };
      dispatch(
        getNotificationModuleByID({
          url: "/GetNotificationModuleByID",
          payload: payload,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (
      GetNotificationModuleByIDData &&
      GetNotificationModuleByIDData.code === 200
    ) {
      setNotificationMessage(GetNotificationModuleByIDData?.data[0]?.message);
    } else if (GetNotificationModuleByIDData?.code !== 200) {
      console.error(
        "Failed to fetch data:",
        GetNotificationModuleByIDData?.message
      );
    }
  }, [GetNotificationModuleByIDData]);

  useEffect(() => {
    if (sportId) {
      setSelectedSportId(sportId as string);
    }
  }, [sportId]);

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
  }, []);

  const teamsNames = getSportList?.data ?? [];

  useEffect(() => {
    setSportsOption(getDefaultOptions(teamsNames, "sportName", "sportID"));
  }, [teamsNames]);

  useEffect(() => {
    if (getSportList?.data && teamId && !editResultData) {
      const data: any = getDefaultOptions(teamsNames, "sportName", "sportID");
      const selOption: any = _.filter(
        data,
        (x: any) => x.value && _.includes(teamId.split(","), x.value.toString())
      );
      setSelectedSportsOption(selOption);
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [];
      const selectedCategory = Array.isArray(selOption)
        ? selOption.map((option: any) => option.label)
        : [];
      setSelectedSport(selectedValues.join(",")); //SportID
      setFormData({
        ...formData,
        sportsCategory: selectedCategory.join(","),
      });
    }
  }, [getSportList?.data, teamId]);

  const handleChange = (e: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { file, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        eventDate: moment(formData.eventDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        eventTime: moment(formData.eventTime, "hh:mm A").format("hh:mm A"),
        sportsCategory: formData.sportsCategory,
        sportID: +teamId || selectedSport || selectedSportId || sportIdEdit,
        resultID: id,
      };
      dispatch(
        addResults({
          url: id ? "/UpdateResultsByID" : "/InsertResults",
          payload: data,
        })
      );
    }
  };

  const clearFormData: any = () => {
    setFormData({
      resultCategory: "",
      homeTeamName: "",
      awayTeamName: "",
      resultType: "",
      unit: "",
      homeTeamValue: "",
      awayTeamValue: "",
      eventName: "",
      eventLocation: "",
      eventDate: "",
      eventTime: "",
      sportsCategory: "",
      raceRelevanceAndImportance: "",
      discipline: "",
      categoryRanking: "",
      generalRanking: "",
      achievement: "",
      seasonalLeagueRanking: "",
      selectWinner: "",
      performance: "",
      comments: "",
      file: "",
    });
    setFileName("");
  };

  useEffect(() => {
    if (id && editResultData) {
      const selectedSportIds = editResultData?.sportID || "";
      setSelectedSport(selectedSportIds);
      const data: any = getDefaultOptions(teamsNames, "sportName", "sportID");
      const selectedIds = teamId || selectedSportIds;
      const selOption: any = _.filter(
        data,
        (x: any) =>
          x.value && _.includes(selectedIds?.split(","), x.value.toString())
      );
      setSelectedSportsOption(selOption);
      setFormData((prevData: any) => ({
        ...prevData,
        resultCategory: editResultData.resultCategory || "",
        homeTeamName: editResultData.homeTeamName || "",
        awayTeamName: editResultData.awayTeamName || "",
        resultType: editResultData.resultType || "",
        unit: editResultData.unit || "",
        homeTeamValue: editResultData.homeTeamValue || "",
        awayTeamValue: editResultData.awayTeamValue || "",
        eventName: editResultData.eventName || "",
        eventLocation: editResultData.eventLocation || "",
        eventDate: editResultData.eventDate || "",
        eventTime: editResultData.eventTime,
        sportsCategory: editResultData.sportsCategory || "",
        raceRelevanceAndImportance:
          editResultData.raceRelevanceAndImportance || "",
        discipline: editResultData.discipline || "",
        categoryRanking: editResultData.categoryRanking || "",
        generalRanking: editResultData.generalRanking || "",
        achievement: editResultData.achievement || "",
        seasonalLeagueRanking: editResultData.seasonalLeagueRanking || "",
        selectWinner: editResultData.selectWinner || "",
        performance: editResultData.performance || "",
        comments: editResultData.comments || "",
        file: editResultData?.fileList[0] || "",
      }));
      setFileName(editResultData?.fileList?.[0]?.fileName || "");
    }
  }, [id, editResultData]);

  const payload: any = {
    searchText: "",
    filteredBy: "",
    paginationIndex: 0,
    paginationCount: 0,
    sportID: Number(teamId) || selectedSportId || sportIdEdit,
  };

  useEffect(() => {
    if (resultsAddData && resultsAddData.code === 200) {
      setShowBanner(true);
      setSnackbarStatus(resultsAddData.code);
      clearFormData();
      if (formData.file) {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("modulename", "Result");
        data.append("moduleid", resultsAddData?.data?.resultID);
        data.append("section", "ResultsRanking");
        dispatch(singleFileUpload(data));
      }

      // notification
      if (process.env.ENABLE_NOTIFICATION === "yes") {
        const resultLink = `${process.env.BASE_DOMAIN}teams/${getCurrentSport}/results/view/${resultsAddData?.data?.resultID}`;
        const updatedMessage = notificationMessage.replace(
          "[Link]",
          `<a href="${resultLink}">click here</a>`
        );

        const NotificationPayload: any = {
          moduleID: 111,
          sportID: Number(teamId) || selectedSportId || sportIdEdit,
          userID: resultsAddData?.data?.resultID,
          name: formData.eventName,
          date: moment(formData.eventDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
          message: updatedMessage,
        };
        if (!id) {
          // send only in add
          dispatch(
            addNotification({
              url: "/InsertNotification",
              payload: NotificationPayload,
            })
          );
        }
      }

      dispatch(viewResults({ url: "/GetResultsList", payload }));
      setTimeout(() => {
        dispatch(clearResultAddState());
        dispatch(clearNotificationAddState());
        setShowBanner(false);
        if (currentPath === "latest-results") {
          router.push(`/latest-results`);
        } else if (teamView !== "view" && sportSearchId !== "sportId") {
          router.push(`/teams/${teamId}/results`);
        }
        if (id) {
          onClose();
        }
        clearState();
      }, 3000);
    } else if (resultsAddData && resultsAddData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(resultsAddData.code);
      setTimeout(() => {
        dispatch(clearResultAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [resultsAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const resultTypeChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
      unit: "",
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const selectWinnerChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleUnitChange = (event: any) => {
    const { name, value } = event.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getDefaultOptions = (
    list: any[],
    labelKey: string,
    valueKey: string
  ) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));
  };

  const handleChangeSports = (selectedOption: any | null): void => {
    if (selectedOption) {
      setSelectedSportsOption(selectedOption);
      setSelectedSport(selectedOption.value);
      setFormData({
        ...formData,
        sportsCategory: selectedOption.label,
      });
      setErrors({
        ...errors,
        sports: "",
        sportsCategory: "",
      });
    }
  };

  const selectedUnits = unitOptionsMap[formData.resultType] || [];
  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const winner = [
    { label: `${formData.homeTeamName}`, value: `${formData.homeTeamName}` },
    { label: `${formData.awayTeamName}`, value: `${formData.awayTeamName}` },
  ];

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleFileChange = (file: any) => {
    if (file) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
          setErrors({ ...errors, file: "" });
          setFileName(file.name);
        } else {
          setSnackbarOpen(true);
          setSnackbarStatus(
            `File size must below ${fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
      }
    }
  };

  const closeAdd = () => {
    if (id) {
      onClose();
    } else {
      setDialogOpen(true);
    }
  };

  const handleDialogDisagree = () => {
    setDialogOpen(false);
  };

  const handleDialogAgree = () => {
    if (id) {
      onClose();
    }
    setDialogOpen(false);
    if (currentPath === "latest-results") {
      router.push(`/latest-results`);
    } else {
      router.push(`/teams/${teamId}/results`);
    }
  };

  return (
    <Grid
      container
      sx={{
        padding: "2rem",
        position: "relative",
      }}
    >
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `Result ${id ? "Updated" : "Added"} successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === 200 ? "success" : "error"}
          open={showBanner}
          onClose={handleClose}
        />
      )}
      {dialogOpen && (
        <AppAlertDialog
          open={dialogOpen}
          onClose={handleDialogDisagree}
          title="Discard Changes"
          description="You have unsaved changes. Do you really want to leave this page?"
          onAgree={handleDialogAgree}
          onDisagree={handleDialogDisagree}
          agreeLabel="Discard"
          disagreeLabel="Cancel"
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              {id ? null : (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    className="text-capitalize dubai-med"
                    color="secondary"
                    sx={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
                    onClick={clearFormData}
                  >
                    Clear form
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Result Category <span className="asterisk">*</span>
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="resultCategory"
                    id="resultCategory"
                    value={formData.resultCategory}
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

                  {errors.resultCategory && (
                    <Typography variant="caption" className="error-message">
                      {errors.resultCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <Box mb={2}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      lineHeight: "19.2px",
                      textAlign: "left",
                    }}
                    className="bukra-semi-bold"
                  >
                    Home Team Details
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={5.75}>
                <Box mb={2}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      lineHeight: "19.2px",
                      textAlign: "left",
                    }}
                    className="bukra-semi-bold"
                  >
                    Away Team Details
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Home Team Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="homeTeamName"
                  id="homeTeamName"
                  placeholder="Enter Home Team Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.homeTeamName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.homeTeamName && (
                  <Typography variant="caption" className="error-message">
                    {errors.homeTeamName}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Away Team Name
                </Typography>
                <CustomTextField
                  name="awayTeamName"
                  id="awayTeamName"
                  placeholder="Enter Away Team Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.awayTeamName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.awayTeamName && (
                  <Typography variant="caption" className="error-message">
                    {errors.awayTeamName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Result Type <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.resultType}
                    onChange={resultTypeChange}
                    name="resultType"
                    displayEmpty
                    className="Text-field-customise"
                    renderValue={(selected) =>
                      selected ? (
                        selected
                      ) : (
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
                          Select Result Type
                        </Typography>
                      )
                    }
                  >
                    {resultTypeOptions.map((option) => (
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
                {errors.resultType && (
                  <Typography variant="caption" className="error-message">
                    {errors.resultType}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Unit <span className="asterisk">*</span>
                </Typography>
                {formData?.resultType === "Others" ? (
                  <CustomTextField
                    name="unit"
                    id="unit"
                    placeholder="Enter Unit"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.unit}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                ) : (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.unit}
                      onChange={handleUnitChange}
                      name="unit"
                      displayEmpty
                      className="Text-field-customise"
                      renderValue={(selected) =>
                        selected ? (
                          selected
                        ) : (
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
                            Select Unit
                          </Typography>
                        )
                      }
                      disabled={formData?.resultType.length === 0}
                      style={{
                        backgroundColor:
                          formData?.resultType.length === 0
                            ? "rgba(241, 235, 156, 0.2)" // color when disabled
                            : "#ffffff", // color when enabled
                      }}
                    >
                      {selectedUnits.map((option: any) => (
                        <MenuItem key={option.label} value={option.label}>
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
                )}
                {errors.unit && (
                  <Typography variant="caption" className="error-message">
                    {errors.unit}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Value
                </Typography>
                <CustomTextField
                  name="homeTeamValue"
                  id="homeTeamValue"
                  placeholder="Enter Value"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.homeTeamValue}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 10 }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.homeTeamValue && (
                  <Typography variant="caption" className="error-message">
                    {errors.homeTeamValue}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Value
                </Typography>
                <CustomTextField
                  name="awayTeamValue"
                  id="awayTeamValue"
                  placeholder="Enter Value"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.awayTeamValue}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 10 }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.awayTeamValue && (
                  <Typography variant="caption" className="error-message">
                    {errors.awayTeamValue}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12} mb={2} mt={2}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Event Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="eventName"
                  id="eventName"
                  placeholder="Enter Event Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.eventName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.eventName && (
                  <Typography variant="caption" className="error-message">
                    {errors.eventName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Event Location <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="eventLocation"
                  id="eventLocation"
                  placeholder="Enter Event Location"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.eventLocation && (
                  <Typography variant="caption" className="error-message">
                    {errors.eventLocation}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Event Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="eventDate"
                  id="eventDate"
                  label=" Event Date"
                  boxmb={0.8}
                  required={true}
                  minDate={moment().subtract(12, "months")}
                  maxDate={moment().add(12, "months")}
                  onChange={dateChange}
                  defaultValue={formData && formData.eventDate}
                  className="Text-field-customise"
                />
                {errors.eventDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.eventDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <CustomTimePicker
                  control={control}
                  name="eventTime"
                  id="eventTime"
                  label="Event Time"
                  required={true}
                  boxmb={0.8}
                  onChange={timeChange}
                  defaultValue={formData.eventTime}
                  maxwidth={"100%"}
                />
                {errors.eventTime && (
                  <Typography variant="caption" className="error-message">
                    {errors.eventTime}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Sports Category <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  isMulti={false}
                  name="sportsCategory"
                  className="select2"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeSports}
                  options={SportsOption}
                  value={SelectedSportsOption}
                  isDisabled={currentPath !== "latest-results" || Boolean(id)}
                  placeholder="Select Sport"
                />
                {errors.sportsCategory && (
                  <Typography variant="caption" className="error-message">
                    {errors.sportsCategory}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Race Relevance & Importance
                </Typography>
                <CustomTextField
                  name="raceRelevanceAndImportance"
                  id="raceRelevanceAndImportance"
                  placeholder="Enter Race Relevance & Importance"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.raceRelevanceAndImportance}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.raceRelevanceAndImportance && (
                  <Typography variant="caption" className="error-message">
                    {errors.raceRelevanceAndImportance}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Discipline
                </Typography>
                <CustomTextField
                  name="discipline"
                  id="discipline"
                  placeholder="Enter Discipline"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.discipline}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.discipline && (
                  <Typography variant="caption" className="error-message">
                    {errors.discipline}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Category Ranking
                </Typography>
                <CustomTextField
                  name="categoryRanking"
                  id="categoryRanking"
                  placeholder="Enter Category Ranking"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.categoryRanking}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.categoryRanking && (
                  <Typography variant="caption" className="error-message">
                    {errors.categoryRanking}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  General Ranking
                </Typography>
                <CustomTextField
                  name="generalRanking"
                  id="generalRanking"
                  placeholder="Enter General Ranking"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.generalRanking}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.generalRanking && (
                  <Typography variant="caption" className="error-message">
                    {errors.generalRanking}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Achievement
                </Typography>
                <CustomTextField
                  name="achievement"
                  id="achievement"
                  placeholder="Enter Achievement"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.achievement}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.achievement && (
                  <Typography variant="caption" className="error-message">
                    {errors.achievement}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Seasonal League Ranking
                </Typography>
                <CustomTextField
                  name="seasonalLeagueRanking"
                  id="seasonalLeagueRanking"
                  placeholder="Enter Seasonal League Ranking"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.seasonalLeagueRanking}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.seasonalLeagueRanking && (
                  <Typography variant="caption" className="error-message">
                    {errors.seasonalLeagueRanking}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Select Winner
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.selectWinner}
                    onChange={selectWinnerChange}
                    name="selectWinner"
                    displayEmpty
                    disabled={!formData.awayTeamName && !formData.homeTeamName}
                    style={{
                      backgroundColor: !formData.awayTeamName && !formData.homeTeamName
                        ? "rgba(241, 235, 156, 0.2)" // color when disabled
                        : "#ffffff", // color when enabled
                    }}
                    className="Text-field-customise"
                    renderValue={(selected) =>
                      selected ? (
                        selected
                      ) : (
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
                          Select Winner
                        </Typography>
                      )
                    }
                  >
                    {winner.map((option) => (
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
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Performance
                </Typography>
                <CustomTextField
                  name="performance"
                  id="performance"
                  placeholder="Enter Performance"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.performance}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                />
                {errors.performance && (
                  <Typography variant="caption" className="error-message">
                    {errors.performance}
                  </Typography>
                )}
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                  mt={2}
                >
                  Comments
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.comments}
                  name="comments"
                  minHeight={"250px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                  mt={1.5}
                  mb={0.5}
                >
                  Official Race Ranking
                </Typography>
                <Box
                  border={"1px solid #008755"}
                  bgcolor={"rgba(0, 135, 85, 0.03)"}
                  className="upload-travel"
                  position={"relative"}
                >
                  <FileUploader
                    handleChange={handleFileChange}
                    name="file"
                    types={fileTypes}
                    className="upload-outline"
                    label={
                      fileName
                        ? "Drag & drop or click here to change a file"
                        : "Drag & drop or click here to select a file"
                    }
                    uploadedLabel={"Drag & drop or click here to change a file"}
                    disabled={singleUploadData.loading}
                  />
                  <Uploadtravel
                    style={{
                      position: "absolute",
                      top: "20%",
                      bottom: 0,
                      left: "45%",
                      right: 0,
                      cursor: "pointer",
                      height: "50px",
                      width: "50px",
                    }}
                     data-testid="upload-travel-icon"
                    onClick={handleFileUpload}
                  />
                  <Box
                    textAlign={"center"}
                    position={"absolute"}
                    bottom={"30%"}
                    // left={"30%"}
                    className="dubai-regular secondary-color"
                    fontWeight={600}
                    fontSize={"14px"}
                    width={"100%"}
                  >
                    {fileName ? (
                      <Typography
                        className={
                          id && fileName
                            ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                            : "dubai-med webkit-line-clamp webkit-1"
                        }
                        sx={{
                          fontSize: "16px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "90%",
                        }}
                      >
                        {fileName}
                      </Typography>
                    ) : (
                      "Supported formats: JPEG, PNG, PDF, Word"
                    )}
                  </Box>
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
                color="secondary"
                sx={{ mr: 1 }}
                onClick={closeAdd}
                className="cancel-button text-capitalize dubai-med season-goal-btn"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                loading={resultsAddData.loading}
                variant="contained"
                className="save-continue-button text-capitalize save dubai-med season-goal-btn"
                sx={{ paddingX: "16px" }}
              >
                {resultsAddData.loading ? "Loading..." : id ? "Update" : "Save"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default AddResults;

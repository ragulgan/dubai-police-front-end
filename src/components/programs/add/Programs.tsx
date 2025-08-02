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
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { clearAddState, addProgram } from "@/redux/slices/program/AddProgram";
import { REGEX } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { getLocalStorage, trimFormData, validateDates } from "@/utils/helper";
import TextSunEditor from "@/components/SunEditor";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import { GetProgramByID } from "@/redux/slices/program/getRaceCalendarIDSlice";
import { listProgram } from "@/redux/slices/program/ProgramListSlice";
import AppAlertDialog from "@/components/AppAlertDialog";
import {
  updateProgram,
  clearProgramUpdateState,
} from "@/redux/slices/program/ProgramUpdateSlice";

const sessionData = [
  { label: "3 Sessions/Week", value: "3 Sessions/Week" },
  { label: "4 Sessions/Week", value: "4 Sessions/Week" },
  { label: "5 Sessions/Week", value: "5 Sessions/Week" },
  { label: "6 Sessions/Week", value: "6 Sessions/Week" },
  { label: "7 Sessions/Week", value: "7 Sessions/Week" },
  { label: "Custom", value: "Custom" },
];

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

const ProgramsAdd = (props: any) => {
  const { GetProgramEditData, id, onClose } = props;
  const { handleSubmit, control, reset } = useForm();
  const fileTypes = ["JPG", "PNG", "JPEG"];
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const ProgramAddData: any = useSelector(
    (state: RootState) => state.addProgram
  );
  const ProgramUpdateData = useSelector(
    (state: RootState) => state.updateProgram
  );
  const [formData, setFormData] = useState<any>({
    programName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    frequency: "",
    programLocation: "",
    contentOutline: "",
    objective: "",
    feedback: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [actionType, setActionType] = useState("");
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>("");
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const [fileName, setFileName] = useState<any>("");
  const [frequencyData, setFrequencyData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const formSubmit = () => {
    const validationErrors: any = {};
    const hasLeadingOrTrailingSpace = (value: string) =>
      /^\s|\s+$/g.test(value);
    const specialCharacters = (value: string) =>
      !REGEX.ALPHA_NUMERIC.test(value);
    const containsNumbers = (value: string) =>
      !REGEX.SPECIALCHARCTERS.test(value);
    if (!formData.programName || _.trim(formData.programName) === "") {
      validationErrors.programName = "Program Name is required.";
      document.getElementById("programName")?.focus();
    } else if (hasLeadingOrTrailingSpace(formData.programName)) {
      validationErrors.programName =
        "Program Name should not have leading or trailing spaces.";
      document.getElementById("programName")?.focus();
    } else if (specialCharacters(formData.programName)) {
      validationErrors.programName =
        "Program Name should not have special characters.";
      document.getElementById("programName")?.focus();
    }
    if (!formData.programLocation || _.trim(formData.programLocation) === "") {
      validationErrors.programLocation = "Program Location is required.";
      document.getElementById("programLocation")?.focus();
    } else if (containsNumbers(formData.programLocation)) {
      validationErrors.programLocation =
        "Program Location should not have special characters.";

      document.getElementById("programLocation")?.focus();
    } else if (hasLeadingOrTrailingSpace(formData.programLocation)) {
      validationErrors.programLocation =
        "Program Location should not have leading or trailing spaces.";
      document.getElementById("programLocation")?.focus();
    }
    const dateErrors = validateDates(
      formData.startDate,
      10,
      formData.endDate,
      "Start Date",
      "End Date"
    );
    Object.assign(validationErrors, dateErrors);
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { file, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      if (id) {
        const data = {
          ...trimmedRest,
          frequency:
            formData.frequency === "Custom"
              ? frequencyData
              : formData.frequency,
          startDate: moment(formData.startDate, "DD/MM/YYYY").format(
            "DD/MM/YYYY"
          ),
          endDate: moment(formData.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
          startTime: formData.startTime
            ? moment(formData.startTime, "hh:mm A").format("hh:mm A")
            : "",
          endTime: formData.startTime
            ? moment(formData.endTime, "hh:mm A").format("hh:mm A")
            : "",

          programID: id,
        };
        dispatch(addProgram({ url: "/UpdateProgramsByID", payload: data }));
      } else {
        const data = {
          ...trimmedRest,
          frequency:
            formData.frequency === "Custom"
              ? frequencyData
              : formData.frequency,
          startDate: moment(formData.startDate, "DD/MM/YYYY").format(
            "DD/MM/YYYY"
          ),
          endDate: moment(formData.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
          startTime: formData.startTime
            ? moment(formData.startTime, "hh:mm A").format("hh:mm A")
            : "",
          endTime: formData.startTime
            ? moment(formData.endTime, "hh:mm A").format("hh:mm A")
            : "",
        };
        dispatch(addProgram({ url: "/InsertPrograms", payload: data }));
      }
    }
  };

  const clearFormData = () => {
    setFormData({
      programName: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      frequency: "",
      programLocation: "",
      contentOutline: "",
      objective: "",
      feedback: "",
    });
    reset({ startTime: null, endTime: null });
    setFileName("");
  };

  useEffect(() => {
    if (ProgramAddData?.code === 200) {
      const chip = getLocalStorage("chip");
      setShowBanner(true);
      setSnackbarStatus(ProgramAddData?.code || ProgramUpdateData?.code);
      if (formData?.file) {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("modulename", "Program");
        data.append(
          "moduleid",
          ProgramAddData?.data?.programID || ProgramUpdateData?.data?.programID
        );
        data.append("section", "ProgramImage");
        dispatch(singleFileUpload(data));
      }
      clearFormData();
      setFrequencyData("");
      const payload = {
        searchText: "",
        filteredBy: chip,
        paginationIndex: 0,
        paginationCount: 0,
      };
      dispatch(listProgram({ url: "/GetProgramsList", payload }));
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearProgramUpdateState());
        setShowBanner(false);
        if (id) {
          onClose();
        }
        if (!id && actionType === "save") {
          router.push(`/programs`);
        }
      }, 500);
    } else if (ProgramAddData?.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(ProgramAddData?.code);
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearProgramUpdateState());
        setShowBanner(false);
      }, 1500);
      setFrequencyData("");
    }
  }, [ProgramAddData, ProgramUpdateData]);

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
    let timeoutId: ReturnType<typeof setTimeout>;
    if (showBanner) {
      timeoutId = setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearProgramUpdateState());
      }, 1500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showBanner]);

  const handleButtonClick = (type: string) => {
    setActionType(type);
  };

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleChanges = (file: any) => {
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
          setFileName(fileName);
          setErrors({ ...errors, file: "" });
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

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setFormData({ ...formData, [name]: moment(value).format("hh:mm A") });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  useEffect(() => {
    if (!_.isEmpty(GetProgramEditData)) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        programName: GetProgramEditData.programName || "",
        startDate: GetProgramEditData.startDate || "",
        endDate: GetProgramEditData.endDate || "",
        startTime: GetProgramEditData.startTime || "",
        endTime: GetProgramEditData.endTime || "",
        frequency: GetProgramEditData.frequency || "",
        programLocation: GetProgramEditData.programLocation || "",
        contentOutline: GetProgramEditData.contentOutline || "",
        objective: GetProgramEditData.objective || "",
        feedback: GetProgramEditData.feedback || "",
      }));
      setFrequencyData(GetProgramEditData?.frequencyData);
      setFileName(GetProgramEditData?.filePath.split("/").pop());
    }
  }, [GetProgramEditData]);

  const getMinDate = () => {
    const satrtDate = moment(formData.startDate, "DD/MM/YYYY", true);
    return satrtDate.isValid() ? satrtDate : moment().subtract(50, "years");
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
    router.push(`/programs`);
  };

  const handleDialogAgree = () => {
    if (id) {
      onClose();
    }
    setDialogOpen(false);
  };

  return (
    <Grid
      container
      sx={{
        padding: "2rem",
        position: "relative",
        overflow: "auto",
      }}
    >
      {dialogOpen && (
        <AppAlertDialog
          open={dialogOpen}
          onClose={handleDialogAgree}
          title="Discard Changes"
          description="You have unsaved changes. Do you really want to leave this page?"
          onAgree={handleDialogDisagree}
          onDisagree={handleDialogAgree}
          agreeLabel="Discard"
          disagreeLabel="Cancel"
        />
      )}
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `Programs ${id ? "Updated" : "Added"}  successfully!`
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
          <form onSubmit={handleSubmit(formSubmit)}>
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
                    disabled={Object.values(formData).every((value) => !value)}
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
                  Program Image
                </Typography>
                <Box
                  className="upload-travel"
                  position={"relative"}
                  sx={{
                    border: "1px dashed  #008755",
                    bgcolor: "rgba(0, 135, 85, 0.03)",
                    borderRadius: "8px 0px 0px 0px",
                    width: "100%", // Make it responsive
                    maxWidth: "458px", // Prevent overflow
                    height: "190px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px", // Reduce excessive padding
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: "20.2px",
                      height: "13.05px",
                      top: "4.95px",
                      left: "1.87px",
                      position: "absolute", // Fix: Use camelCase
                      marginLeft: "219px", // Fix: Use camelCase
                      marginTop: "61px", // Fix: Use camelCase
                    }}
                  >
                    <Uploadtravel onClick={handleFileUpload} />
                  </Box>
                  <FileUploader
                    handleChange={handleChanges}
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
                    {fileName && fileName ? (
                      <Tooltip title={fileName}>
                        <Typography
                          className={
                            id && fileName
                              ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                              : "dubai-med webkit-line-clamp webkit-1"
                          }
                          sx={{ fontSize: "16px", fontWeight: "600", mt: 1 }}
                        >
                          {fileName}
                        </Typography>
                      </Tooltip>
                    ) : null}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Program Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="programName"
                  id="programName"
                  placeholder="Enter Program Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.programName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.programName && (
                  <Typography variant="caption" className="error-message">
                    {errors.programName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75} />
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
                  minDate={
                    id
                      ? moment(formData && formData.startDate, "DD/MM/YYYY")
                      : moment().startOf("day")
                  }
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
                  minDate={getMinDate()}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.endDate}
                  className="Text-field-customise"
                  disabled={isEmpty(formData && formData.startDate)}
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
              <Grid container spacing={2} item xs={12} md={5.75}>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Start Time
                  </Typography>
                  <CustomTimePicker
                    control={control}
                    name="startTime"
                    id="startTime"
                    boxmb={0.8}
                    onChange={timeChange}
                    defaultValue={formData.startTime}
                    maxwidth={"100%"}
                    required={false}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    End Time
                  </Typography>
                  <CustomTimePicker
                    control={control}
                    name="endTime"
                    id="endTime"
                    boxmb={0.8}
                    onChange={timeChange}
                    defaultValue={formData.endTime}
                    maxwidth={"100%"}
                    required={false}
                    minTime={moment(formData.startTime, "hh:mm A").format(
                      "HH:mm"
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Frequency
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.frequency}
                    onChange={handleChange}
                    name="frequency"
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
                          Select Frequency
                        </Typography>
                      )
                    }
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Dubai",
                      fontWeight: 500,
                      color: formData.frequency ? "black" : "#757575", // Placeholder color when empty
                    }}
                  >
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
                {formData && formData.frequency === "Custom" ? (
                  <>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                      sx={{ mt: 2 }}
                    >
                      Custom Training Frequency{" "}
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
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Program Location <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="programLocation"
                  id="programLocation"
                  placeholder="Enter Program Location"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.programLocation}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.programLocation && (
                  <Typography variant="caption" className="error-message">
                    {errors.programLocation}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Content Outline
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="contentOutline"
                    id="contentOutline"
                    value={formData.contentOutline}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="Topics"
                      control={<Radio />}
                      label="Topics"
                    />
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="Activities"
                      control={<Radio />}
                      label="Activities"
                      defaultChecked={true}
                    />

                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="Both"
                      control={<Radio />}
                      label="Both"
                      defaultChecked={true}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Objective
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.objective}
                  name="objective"
                  minHeight={"250px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Feedback
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.feedback}
                  name="feedback"
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
                  closeAdd();
                }}
                className="cancel-button text-capitalize dubai-med season-goal-btn"
              >
                Cancel
              </Button>
              {id ? null : (
                <LoadingButton
                  type="submit"
                  size="small"
                  onClick={() => handleButtonClick("saveAndNew")}
                  loading={
                    ProgramAddData.loading && actionType === "saveAndNew"
                  }
                  variant="contained"
                  className="save-continue-button text-capitalize dubai-med season-goal-btn"
                  sx={{
                    mr: 1,
                    paddingX: "16px",
                    color:
                      ProgramAddData.loading && actionType === "saveAndNew"
                        ? "white"
                        : "white",
                  }}
                >
                  {ProgramAddData.loading && actionType === "saveAndNew"
                    ? ""
                    : "Save & Add New"}
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                size="small"
                onClick={() => handleButtonClick("save")}
                loading={ProgramAddData.loading && actionType === "save"}
                variant="contained"
                className="save-continue-button text-capitalize save dubai-med season-goal-btn"
                sx={{
                  paddingX: "16px"
                }}
              >
                {ProgramAddData.loading && actionType === "save"
                  ? ""
                  : id
                    ? "Update"
                    : "Save"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default ProgramsAdd;

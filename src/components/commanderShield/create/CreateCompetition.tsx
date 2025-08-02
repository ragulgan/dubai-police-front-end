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
  IconButton,
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
import DropDown from "@/components/Fields/DropDown";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import AddMatchDialog from "./AddMatchDialog";

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

const CreateCompetition = (props: any) => {
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
    tournamentImage: "",
    tournamentName: "",
    selectSports: "",
    tournamentType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    organizerName: "",
    organizerEmail: "",
    description: ""
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
  const [dialogMatchOpen, setDialogMatchOpen] = useState(false);

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
  };

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

  const closeAdd = () => {
    if (id) {
      onClose();
    } else {
      setDialogOpen(true);
    }
  };

  const handleDialogDisagree = () => {
    setDialogMatchOpen(false);
    // router.push(`/programs`);
  };

  const handleDialogAgree = () => {
    // if (id) {
    //   onClose();
    // }
    setDialogMatchOpen(false);
  };

  const handleAddMatches = () => {
    setDialogMatchOpen(true);
  };

  return (
    <>
      {dialogMatchOpen && (
        <AddMatchDialog
          open={dialogMatchOpen}
          onClose={handleDialogAgree}
          title="Add Matches"
          description=""
          onAgree={handleDialogDisagree}
          onDisagree={handleDialogAgree}
          agreeLabel="Discard"
          disagreeLabel="Cancel"
        />
      )}
      <Grid
        container
        sx={{
          padding: "2rem",
          position: "relative",
          overflow: "auto",
        }}
      >
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
                <Grid item xs={12} md={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Tournament Image
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
                          ? "Click or drag file to this area to upload"
                          : "Click or drag file to this area to upload"
                      }
                      uploadedLabel={"Click or drag file to this area to upload"}
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
                    Tournament Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="tournmentName"
                    id="tournmentName"
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
                </Grid>
                <Grid item xs={12} md={5.75} >
                  <DropDown
                    name="selectSports"
                    control={control}
                    label="Select Sports"
                    placeholder="Select Sports"
                    // options={
                    //   assignedSportsOption && assignedSportsOption
                    // }
                    multiple={true}
                    variant="outlined"
                    icon={true}
                    module="rules"
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Tournament Type
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="contentOutline"
                      id="contentOutline"
                      value={formData.tournamentType}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="Topics"
                        control={<Radio />}
                        label="Internal"
                      />
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="Activities"
                        control={<Radio />}
                        label="External"
                        defaultChecked={true}
                      />
                    </RadioGroup>
                  </FormControl>
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
                    // minDate={getMinDate()}
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
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Organizer Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="organizerName"
                    id="organizerName"
                    placeholder="Enter Organizer Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.organizerName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Organizer Email <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="organizerEmail"
                    id="organizerEmail"
                    placeholder="Enter Organizer Email"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.organizerEmail}
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
                    Description
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.description}
                    name="description"
                    minHeight={"250px"}
                  />
                </Grid>
                <Grid item xs={12} md={5.75} />
                <Grid item xs={12} md={5.75}>
                  <IconButton
                    sx={{
                      backgroundColor: "#008755",
                      color: "white",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                      width: "100%",
                      padding: "4px 8px",
                      minHeight: "48px",
                    }}
                    onClick={() => handleAddMatches()}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "16px",
                        lineHeight: "100%",
                      }}
                      ml={1}
                      className="dubai-med"
                    >
                      + Add Matches
                    </Typography>
                  </IconButton>
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
                    closeAdd();
                  }}
                  className="cancel-button text-capitalize dubai-med season-goal-btn"
                >
                  Back
                </Button>
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
                    : "Save & Continue"}
                </LoadingButton>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default CreateCompetition;

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
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import {
  formatDate,
  formatDates,
  getLocalStorage,
  removeLocalStorage,
  trimFormData,
} from "@/utils/helper";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
  BLOOD_GROUPS,
  PDF_FORMAT,
  iconMapping,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import {
  addAthlete,
  clearAddAthleteState,
} from "@/redux/slices/athlete/athleteAddSlice";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { PhysicalAndMedicalFormValidation } from "@/utils/athletes/validation";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import TextSunEditor from "../SunEditor";
import DropDown from "../Fields/DropDown";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../Fields/CustomDatePicker";
import moment from "moment";
import { useRouter } from "next/navigation";

const CustomTextField = styled(TextField)(({ theme }) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  // opacity: 0,
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

const PhysicalAndMedical = (props: any) => {
  const {
    activeStep,
    setActiveStep,
    setAllData,
    allData,
    teamId,
    editAthleteData,
    editPayload,
    setLoading,
    setRouteHandel,
    setDisableRouting,
    athleteEditId,
    onClose,
  } = props;
  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const athleteAddeducationData = useSelector(
    (state: RootState) => state.athleteAdd
  );
  const [formData, setFormData] = useState<any>({
    height: "",
    heightUnit: "CM",
    weight: "",
    weightUnit: "KG",
    bloodType: "",
    previousInjuries: "",
    sizeOfShoe: "",
    sizeOfJersey: "",
    sizeOfHelmet: "",
    sizeOfGloves: "",
    sizeOfTrousers: "",
    dietaryRestriction: "",
    testDate: "",
    testExpiryDate: "",
    physicalReadiness: "",
    medicalFitness: "",
  });
  const [showBanner, setShowBanner] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const isRegistrationPage = location.pathname.includes("/registration/");
  const { validate } = PhysicalAndMedicalFormValidation(formData, setErrors);
  const { control, setValue, watch } = useForm({
    defaultValues: {
      sizeOfJersey: "",
      sizeOfTrousers: "",
      physicalReadiness: "",
      medicalFitness: "",
      bloodType: "",
    },
  });
  const sizeOfJerseyValue = watch("sizeOfJersey");
  const sizeOfTrousersValue = watch("sizeOfTrousers");
  const physicalReadinessValue = watch("physicalReadiness");
  const medicalFitnessValue = watch("medicalFitness");
  const bloodTypeValue = watch("bloodType");

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      sizeOfJersey: sizeOfJerseyValue,
      sizeOfTrousers: sizeOfTrousersValue,
      physicalReadiness: physicalReadinessValue,
      medicalFitness: medicalFitnessValue,
      bloodType: bloodTypeValue,
    }));
  }, [
    sizeOfJerseyValue,
    sizeOfTrousersValue,
    physicalReadinessValue,
    medicalFitnessValue,
    bloodTypeValue,
  ]);

  const editParams = {
    ...editPayload,
  };
  useEffect(() => {
    if (editPayload?.athleteID) {
      dispatch(editAthlete(editParams));
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const { uploadCertificate, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        section: "physicalmedicaldetails",
        testDate: formatDate(formData.testDate),
        testExpiryDate: formatDate(formData.testExpiryDate),
        athleteID: parsedData.athleteID || athleteEditId,
      };
      dispatch(addAthlete({ url: "/UpdateAthleteByID", payload: data }));
    }
  };

  useEffect(() => {
    if (athleteAddeducationData && athleteAddeducationData.code === 200) {
      setAlertType("success");
      setAlertMessage("Athlete  member added successfully!");
      dispatch(clearAddAthleteState());
      setShowBanner(true);
      removeLocalStorage("addAthleteData");
      setRouteHandel(false);
      setDisableRouting(false);
      setLoading(true);
      if (isRegistrationPage) {
        setTimeout(() => {
          router.push(`/registration`);
          setLoading(false);
        }, 3000);
      } else {
        if (athleteEditId) {
          onClose();
        } else {
          setTimeout(() => {
            router.push(`/teams/${teamId}/athletes`);
            setLoading(false);
          }, 2000);
        }
      }
    } else if (
      athleteAddeducationData &&
      athleteAddeducationData.code === 500
    ) {
      setAlertType("error");
      setAlertMessage(
        `${athleteAddeducationData && athleteAddeducationData.message}`
      );
      setShowBanner(true);
      dispatch(clearAddAthleteState());
    }
  }, [athleteAddeducationData]);

  function formatDatesWithCheck(date: any): any {
    if (!date || date === "Invalid date format") {
      return "";
    }
    return formatDates(date);
  }

  useEffect(() => {
    if (parsedData.physicalmedicaldetails) {
      setFormData((formData: any) => ({
        ...formData,
        height: parsedData.physicalmedicaldetails.height || "",
        heightUnit: parsedData.physicalmedicaldetails.heightUnit || "",
        weightUnit: parsedData.physicalmedicaldetails.weightUnit || "",
        weight: parsedData.physicalmedicaldetails.weight || "",
        bloodType: parsedData.physicalmedicaldetails.bloodType || "",
        previousInjuries:
          parsedData.physicalmedicaldetails.previousInjuries || "",
        sizeOfShoe: parsedData.physicalmedicaldetails.sizeOfShoe || "",
        sizeOfJersey: parsedData.physicalmedicaldetails.sizeOfJersey || "",
        sizeOfHelmet: parsedData.physicalmedicaldetails.sizeOfHelmet || "",
        sizeOfGloves: parsedData.physicalmedicaldetails.sizeOfGloves || "",
        sizeOfTrousers: parsedData.physicalmedicaldetails.sizeOfTrousers || "",
        dietaryRestriction:
          parsedData.physicalmedicaldetails.dietaryRestriction || "",
        testDate:
          formatDatesWithCheck(parsedData.physicalmedicaldetails.testDate) ||
          "",
        testExpiryDate:
          formatDatesWithCheck(
            parsedData.physicalmedicaldetails.testExpiryDate
          ) || "",
      }));
      setValue(
        "medicalFitness",
        parsedData.physicalmedicaldetails.medicalFitness
      );
      setValue(
        "sizeOfTrousers",
        parsedData.physicalmedicaldetails.sizeOfTrousers
      );
      setValue(
        "physicalReadiness",
        parsedData.physicalmedicaldetails.physicalReadiness
      );
      setValue("sizeOfJersey", parsedData.physicalmedicaldetails.sizeOfJersey);
      setValue("bloodType", parsedData.physicalmedicaldetails.bloodType);
    }
  }, []);

  useEffect(() => {
    if (editAthleteData && athleteEditId) {
      setFormData((formData: any) => ({
        ...formData,
        height: editAthleteData.height || "",
        heightUnit: editAthleteData.heightUnit || "",
        weightUnit: editAthleteData.weightUnit || "",
        weight: editAthleteData.weight || "",
        bloodType: editAthleteData.bloodType || "",
        previousInjuries: editAthleteData.previousInjuries || "",
        sizeOfShoe: editAthleteData.sizeOfShoe || "",
        sizeOfJersey: editAthleteData.sizeOfJersey || "",
        sizeOfHelmet: editAthleteData.sizeOfHelmet || "",
        sizeOfGloves: editAthleteData.sizeOfGloves || "",
        sizeOfTrousers: editAthleteData.sizeOfTrousers || "",
        dietaryRestriction: editAthleteData.dietaryRestriction || "",
        testDate: formatDatesWithCheck(editAthleteData.testDate) || "",
        testExpiryDate:
          formatDatesWithCheck(editAthleteData.testExpiryDate) || "",
      }));
      setValue("medicalFitness", editAthleteData.medicalFitness);
      setValue("sizeOfTrousers", editAthleteData.sizeOfTrousers);
      setValue("physicalReadiness", editAthleteData.physicalReadiness);
      setValue("sizeOfJersey", editAthleteData.sizeOfJersey);
      setValue("bloodType", editAthleteData.bloodType);
    }
  }, [editAthleteData]);

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      physicalmedicaldetails: formData,
    }));
    dispatch(editAthlete(editPayload));
    setActiveStep(3);
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const handleClose = () => {
    setShowBanner(false);
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
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box width="100%">
          {showBanner && (
            <Snackbar
              open={showBanner}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                icon={iconMapping[alertType]}
                onClose={handleClose}
                severity={alertType}
                variant="filled"
                className="dubai-med"
              >
                {alertMessage}
              </Alert>
            </Snackbar>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Height <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      height: "40px",
                      backgroundColor: "#00875508",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                        "::placeholder": {
                          color: "#58585B",
                          opacity: 1,
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Height"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    fullWidth
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        sx={{
                          borderLeft: "1px solid grey",
                          minWidth: "7ch",
                          borderRadius: "0",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "black",
                          paddingLeft: "8px",
                        }}
                      >
                        Cm
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.height && (
                  <Typography variant="caption" className="error-message">
                    {errors.height}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Weight <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      height: "40px",
                      backgroundColor: "#00875508",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                        "::placeholder": {
                          color: "#58585B",
                          opacity: 1,
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Weight"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    name="weight"
                    fullWidth
                    value={formData.weight}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        sx={{
                          borderLeft: "1px solid grey",
                          minWidth: "7ch",
                          borderRadius: "0",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "black",
                          paddingLeft: "8px",
                        }}
                      >
                        Kg
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.weight && (
                  <Typography variant="caption" className="error-message">
                    {errors.weight}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <DropDown
                  name="bloodType"
                  label="Blood Type"
                  placeholder="Select Blood Type"
                  control={control}
                  defaultValue={formData && formData.bloodType}
                  options={[
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                    { value: "ABO", label: "ABO" },
                  ]}
                  variant="outlined"
                  required={true}
                />
                {errors.bloodType && isEmpty(formData.bloodType) && (
                  <Typography variant="caption" className="error-message">
                    {errors.bloodType}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Previous Injuries
                </Typography>
                <CustomTextField
                  name="previousInjuries"
                  placeholder="Enter Previous Injuries"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.previousInjuries}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 300 }}
                />
                {errors.previousInjuries && (
                  <Typography variant="caption" className="error-message">
                    {errors.previousInjuries}
                  </Typography>
                )}
              </Grid>
              <Grid container item xs={12} md={5.75} spacing={2}>
                <Grid item xs={12} md={6}>
                  <DropDown
                    name="physicalReadiness"
                    label="Physical Readiness Results"
                    placeholder="Select Physical Readiness Results"
                    control={control}
                    options={[
                      { value: "Physically Fit", label: "Physically Fit" },
                      {
                        value: "Temp. Physically Unfit",
                        label: "Temp. Physically Unfit",
                      },
                      { label: "Physically Unfit", value: "Physically Unfit" },
                    ]}
                    variant="outlined"
                    // required={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Test Date
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="testDate"
                    label="Test Date"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(10, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.testDate}
                  />
                  {errors.testDate && (
                    <Typography variant="caption" className="error-message">
                      {errors.testDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container item xs={12} md={5.75} spacing={2}>
                <Grid item xs={12} md={6}>
                  <DropDown
                    name="medicalFitness"
                    label="Medical Fitness Results"
                    placeholder="Select Medical Fitness Results"
                    control={control}
                    options={[
                      { value: "Medically Fit", label: "Medically Fit" },
                      {
                        value: "Temp. Medically Unfit",
                        label: "Temp. Medically Unfit",
                      },
                      { label: "Medically Unfit", value: "Medically Unfit" },
                    ]}
                    variant="outlined"
                    // required={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Test Expiry Date
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="testExpiryDate"
                    label="Test Expiry Date"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(10, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.testExpiryDate}
                  />
                  {errors.testExpiryDate && (
                    <Typography variant="caption" className="error-message">
                      {errors.testExpiryDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Dietary Restrictions
                </Typography>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.dietaryRestriction || ""}
                  name="dietaryRestriction"
                  minHeight={"150px"}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Shoe <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      height: "40px",
                      backgroundColor: "#00875508",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                        "::placeholder": {
                          color: "#58585B",
                          opacity: 1,
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Size Of Shoe"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    name="sizeOfShoe"
                    fullWidth
                    value={formData.sizeOfShoe}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        sx={{
                          borderLeft: "1px solid grey",
                          minWidth: "7ch",
                          borderRadius: "0",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "black",
                          paddingLeft: "8px",
                        }}
                      >
                        EU
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.sizeOfShoe && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfShoe}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <DropDown
                  name="sizeOfJersey"
                  label="Size Of Jersey"
                  placeholder="Select Size Of Jersey"
                  control={control}
                  defaultValue={formData && formData.sizeOfJersey}
                  options={[
                    { value: "XS", label: "XS" },
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                    { value: "XL", label: "XL" },
                    { value: "2XL", label: "2XL" },
                    { value: "3XL", label: "3XL" },
                    { value: "4XL", label: "4XL" },
                    { value: "5XL", label: "5XL" },
                  ]}
                  variant="outlined"
                  required={true}
                />
                {errors.sizeOfJersey && isEmpty(formData.sizeOfJersey) && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfJersey}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Helmet
                </Typography>
                <CustomTextField
                  name="sizeOfHelmet"
                  placeholder="Enter Size Of Helmet"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.sizeOfHelmet}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC_DOT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                {errors.sizeOfHelmet && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfHelmet}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Gloves <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="sizeOfGloves"
                  placeholder="Enter Size Of Gloves"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.sizeOfGloves}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                {errors.sizeOfGloves && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfGloves}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <DropDown
                  name="sizeOfTrousers"
                  label="Size Of Trousers"
                  placeholder="Select Size Of Trousers"
                  defaultValue={formData && formData.sizeOfTrousers}
                  control={control}
                  rules={{
                    required: "Size Of Trousers is required",
                  }}
                  options={[
                    { value: "XS", label: "XS" },
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                    { value: "XL", label: "XL" },
                    { value: "2XL", label: "2XL" },
                    { value: "3XL", label: "3XL" },
                    { value: "4XL", label: "4XL" },
                    { value: "5XL", label: "5XL" },
                  ]}
                  variant="outlined"
                  required={true}
                />
                {errors.sizeOfTrousers && isEmpty(formData.sizeOfTrousers) && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfTrousers}
                  </Typography>
                )}
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
                  handleBack();
                }}
                className="text-capitalize dubai-med"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="save-continue-button text-capitalize dubai-med"
                disabled={athleteAddeducationData.loading}
              >
                {athleteAddeducationData.loading
                  ? "Loading..."
                  : athleteEditId
                  ? "Update"
                  : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default PhysicalAndMedical;

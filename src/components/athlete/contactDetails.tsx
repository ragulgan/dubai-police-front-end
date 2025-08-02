"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  Alert,
  Snackbar,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { createUserPayload, getLocalStorage, getUsernameFromEmail, trimFormData } from "@/utils/helper";
import {
  addAthlete,
  clearAddAthleteState,
} from "@/redux/slices/athlete/athleteAddSlice";
import { REGEX, SESSION } from "@/utils/constants";
import { useFormValidation } from "@/utils/athletes/validation";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ReactSelect from "../Fields/ReactSelect";
import { getNationalityListAPI } from "@/redux/slices/nationality/getNationalityListSlice";
import Axios from '../../utils/AxiosInterceptor';

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
  "& input:disabled": {
    backgroundColor: "rgba(241, 235, 156, 0.2)",
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

const ContactDetails = (props: any) => {
  const {
    activeStep,
    setActiveStep,
    setAllData,
    allData,
    teamId,
    editPayload,
    staffAndAthleteIdData,
    athleteEditId,
    editAthleteData
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    personalEmail: "",
    dubaiPoliceEmail: "",
    phoneNo: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    address: "",
    area: "",
    city: "",
    country: "",
    emergencyCountryCode: "",
  });
  const [errors, setErrors] = useState<any>({});
  const { validate } = useFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addAthleteData");
  const userStr: any = getLocalStorage(SESSION.TOKEN);
  const CurrentLoginUser = userStr ? JSON.parse(userStr) : null;
  const parsedData = JSON.parse(savedData);
  const athleteAddContactData = useSelector(
    (state: RootState) => state.athleteAdd
  );
  const [showField, setShowField] = useState<any>(false);
  const getNationality = useSelector((state: any) => state.listNationality);
  const [NationalityOption, setNationalityOption] = useState();
  const [SelectedNationalityOption, setSelectedNationalityOption] = useState<any>(null);

  useEffect(() => {
    dispatch(getNationalityListAPI());
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
      const trimmedRest = trimFormData(formData);
      const data = {
        ...trimmedRest,
        section: "contactdetails",
        athleteID: parsedData.athleteID || athleteEditId,

      };
      dispatch(addAthlete({ url: "/UpdateAthleteByID", payload: data }));
    }
  };

  const createUser = async () => {
    try {
      if (staffAndAthleteIdData && !athleteEditId) {
        const resultPayload = createUserPayload(
          staffAndAthleteIdData,
          17,
          parsedData?.athleteID || athleteEditId,
          CurrentLoginUser?.userType,
          "Athlete",
          parsedData?.athleteID || athleteEditId,
          teamId
        );
        const response = await Axios.post(
          `${process.env.API_BASE_URL}/Sports/InsertUser`,
          resultPayload
        );
      } else if (!athleteEditId) {
        const generateUserPayload = (editAthleteData: any) => {
          return {
            ntLogIn: getUsernameFromEmail(parsedData?.contactdetails?.personalEmail || formData?.personalEmail || ""),
            firstName: editAthleteData?.firstName || "",
            middleName: editAthleteData?.middleName || "",
            lastName: editAthleteData?.surname || "",
            displayName: `${editAthleteData?.firstName || ""} ${editAthleteData?.surname || ""}`,
            email: parsedData?.contactdetails?.personalEmail || formData?.personalEmail || "",
            employeeNumber: `${editAthleteData?.athleteID || ""}`,
            gender: (editAthleteData?.gender || "").charAt(0).toUpperCase() + (editAthleteData?.gender || "").slice(1),
            dob: editAthleteData?.dob || "",
            nationality: editAthleteData?.nationality || "971",
            password: "12345",
            role: 17,//athlete role by default 17
            enteredBy: parsedData?.athleteID || athleteEditId,
            userType: "Collaborator",
            moduleName: "Athlete",
            moduleID: parsedData?.athleteID || athleteEditId,
            sportID: teamId || '',
          };
        };
        const userPayload = generateUserPayload(editAthleteData);
        const response = await Axios.post(
          `${process.env.API_BASE_URL}/Sports/InsertUser`,
          userPayload
        );
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (athleteAddContactData && athleteAddContactData.code === 200) {
      if (!athleteEditId) {
        createUser()
      }
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        contactdetails: formData,
      }));
      dispatch(clearAddAthleteState());

      setActiveStep(2);
    } else if (athleteAddContactData && athleteAddContactData.code === 500) {
      setShowBanner(false);
    }
  }, [athleteAddContactData]);

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
    if (staffAndAthleteIdData && !athleteEditId) {
      setFormData((formData: any) => ({
        ...formData,
        personalEmail: staffAndAthleteIdData.empEmail || "",
        phoneNo: staffAndAthleteIdData.empMobile || "",
        address: staffAndAthleteIdData.address || "",
        countryCode: staffAndAthleteIdData.countryCode || "",
      }));
      setShowField(true)
    }
  }, [staffAndAthleteIdData]);

  useEffect(() => {
    if (parsedData.contactdetails && !athleteEditId) {
      setFormData((formData: any) => ({
        ...formData,
        personalEmail: parsedData.contactdetails.personalEmail || "",
        dubaiPoliceEmail: parsedData.contactdetails.dubaiPoliceEmail || "",
        phoneNo: parsedData.contactdetails.phoneNo
          ? parsedData.contactdetails.phoneNo
          : "",
        emergencyContactName:
          parsedData.contactdetails.emergencyContactName || "",
        emergencyContactNumber:
          parsedData.contactdetails.emergencyContactNumber || "",
        address: parsedData.contactdetails.address || "",
        area: parsedData.contactdetails.area || "",
        city: parsedData.contactdetails.city || "",
        country: parsedData.contactdetails.country || "",
        emergencyCountryCode:
          parsedData.contactdetails.emergencyCountryCode || "",
        countryCode: parsedData.contactdetails.countryCode || "",
      }));
      setSelectedNationalityOption({
        label: editAthleteData?.countryText || parsedData?.countryLabel || "",
        value: parsedData.contactdetails?.country || "",
      });
    }
    dispatch(editAthlete(editPayload))
  }, []);

  useEffect(() => {
    if (editAthleteData && athleteEditId) {
      setFormData((formData: any) => ({
        ...formData,
        personalEmail: editAthleteData.personalEmail || "",
        dubaiPoliceEmail: editAthleteData.dubaiPoliceEmail || "",
        phoneNo: editAthleteData.phoneNo || "",
        emergencyContactName:
          editAthleteData.emergencyContactName || "",
        emergencyContactNumber:
          editAthleteData.emergencyContactNumber || "",
        area: editAthleteData.area || "",
        address: editAthleteData.address || "",
        city: editAthleteData.city || "",
        emergencyCountryCode:
          editAthleteData.emergencyCountryCode || "",
        countryCode: editAthleteData.countryCode || "",
        country: editAthleteData.country ? Number(editAthleteData.country) : "",
      }));
      setSelectedNationalityOption({
        label: editAthleteData?.countryText || "",
        value: editAthleteData.country ? Number(editAthleteData.country) : "",
      });
      setShowField(true)
    }
  }, [editAthleteData]);

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      contactdetails: formData,
      countryLabel: SelectedNationalityOption?.label
    }));
    dispatch(editAthlete(editPayload));
    setActiveStep(0);
  };

  const handlePhoneNoChange = (value: string, country: any, event: any) => {
    const dialCode = country.dialCode;
    const phoneWithoutDialCode = value.slice(dialCode.length);
    setFormData((prevData: any) => ({
      ...prevData,
      phoneNo: phoneWithoutDialCode,
      countryCode: dialCode,
    }));
    setErrors({
      ...errors,
      phoneNo: "",
    });
  };

  const handleEmergencyContactChange = (
    value: string,
    country: any,
    event: any
  ) => {
    const dialCode = country.dialCode;
    const phoneWithoutDialCode = value.slice(dialCode.length);
    setFormData((prevData: any) => ({
      ...prevData,
      emergencyContactNumber: phoneWithoutDialCode,
      emergencyCountryCode: dialCode,
    }));
    setErrors({
      ...errors,
      emergencyContactNumber: "",
    });
  };

  const handleChangeNationality = (selectedOption: any | null): void => {
    setSelectedNationalityOption(selectedOption);
    setFormData({
      ...formData,
      country: selectedOption?.value,
    });
    setErrors({
      ...errors,
      country: "",
    });
  };

  const nationalityData = getNationality && getNationality?.data;
  useEffect(() => {
    const country: any = getDefaultOption(nationalityData);
    setNationalityOption(country);
  }, [nationalityData]);

  const getDefaultOption = (NationalityList: any) => {
    const defaultOptions = [];
    for (const item in NationalityList) {
      defaultOptions.push({
        label: NationalityList[item].countryName,
        value: NationalityList[item].countryId,
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
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box width="100%">
          <form onSubmit={handleSubmit}>
            {showBanner &&
              athleteAddContactData &&
              !_.isEmpty(athleteAddContactData.message) && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="info"
                    variant="filled"
                    className="dubai-med"
                  >
                    {athleteAddContactData && athleteAddContactData.message}
                  </Alert>
                </Snackbar>
              )}
            <Grid container justifyContent={"space-between"} spacing={2}>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Address <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="address"
                  placeholder="Enter Address (Street, Building, Flat/Villa no.)"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.address}
                  disabled={showField && formData.address}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.address && (
                  <Typography variant="caption" className="error-message">
                    {errors.address}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Area <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="area"
                  placeholder="Enter Area"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.area}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.area && (
                  <Typography variant="caption" className="error-message">
                    {errors.area}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  City <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="city"
                  placeholder="Enter City"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.city}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.city && (
                  <Typography variant="caption" className="error-message">
                    {errors.city}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Country <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  name="country"
                  id="country"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeNationality}
                  options={NationalityOption}
                  value={
                    SelectedNationalityOption &&
                      SelectedNationalityOption.label === ""
                      ? null
                      : SelectedNationalityOption
                  }
                  // isDisabled={showField && formData.country}
                  placeholder={"Select Country"}
                  isClearable={true}
                />
                {errors.country && (
                  <Typography variant="caption" className="error-message">
                    {errors.country}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Personal Email <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="personalEmail"
                  placeholder="Enter personal email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.personalEmail}
                  disabled={showField && formData.personalEmail}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                />
                {errors.personalEmail && (
                  <Typography variant="caption" className="error-message">
                    {errors.personalEmail}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Dubai Police Email
                </Typography>
                <CustomTextField
                  name="dubaiPoliceEmail"
                  placeholder="Enter government email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.dubaiPoliceEmail}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                />
                {errors.dubaiPoliceEmail && (
                  <Typography variant="caption" className="error-message">
                    {errors.dubaiPoliceEmail}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Phone Number <span className="asterisk">*</span>
                </Typography>
                <Box className="Text-field-customise">
                  <PhoneInput
                    country={"ae"}
                    value={`${formData.countryCode || ""}${formData.phoneNo || ""
                      }`}
                    onChange={handlePhoneNoChange}
                    searchPlaceholder="Phone Number"
                    autoFormat={false}
                    disabled={showField && formData.phoneNo}
                  />
                  {errors.phoneNo && (
                    <Typography variant="caption" className="error-message">
                      {errors.phoneNo}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Emergency Contact Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="emergencyContactName"
                  placeholder="Enter emergency contact name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.emergencyContactName && (
                  <Typography variant="caption" className="error-message">
                    {errors.emergencyContactName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Emergency Contact Number <span className="asterisk">*</span>
                </Typography>
                <Box className="Text-field-customise">
                  <PhoneInput
                    country={"ae"}
                    value={`${formData.emergencyCountryCode || ""}${formData.emergencyContactNumber || ""
                      }`}
                    onChange={handleEmergencyContactChange}
                    searchPlaceholder="Emergency Contact Number"
                    autoFormat={false}
                  />
                  {errors.emergencyContactNumber && (
                    <Typography variant="caption" className="error-message">
                      {errors.emergencyContactNumber}
                    </Typography>
                  )}
                </Box>
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
                disabled={athleteAddContactData.loading}
              >
                {athleteAddContactData.loading
                  ? "Loading..."
                  : athleteEditId ? "Update" : "Save & Continue"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default ContactDetails;

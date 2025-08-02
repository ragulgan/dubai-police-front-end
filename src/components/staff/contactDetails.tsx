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
  Fade,
} from "@mui/material";
import { REGEX, SESSION } from "@/utils/constants";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { createUserPayload, formatDates, getLocalStorage, getUsernameFromEmail, trimFormData } from "@/utils/helper";
import { useFormValidation } from "@/utils/staffs/validation";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DropDown from "../Fields/DropDown";
import { useForm } from "react-hook-form";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import Axios from '../../utils/AxiosInterceptor';

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
  "& input:disabled": {
    backgroundColor: "rgba(241, 235, 156, 0.2)",
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

const ContactDetails = (props: any) => {
  const { activeStep, setActiveStep, setAllData, allData, editStaffData, staffEditId, staffAndAthleteIdData, regSportID } = props;
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    // residence: "",
    personalEmail: "",
    dubaiPoliceEmail: "",
    phoneNo: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    address: "",
    area: "",
    city: "",
    // country: "",
    emergencyCountryCode: "",
  });
  const { control, watch, setValue } = useForm<any>({
    defaultValues: {
      city: '',
    },
  });
  const cityValue = watch('city');
  const [errors, setErrors] = useState<any>({});
  const { validate } = useFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const staffAddContactData = useSelector((state: RootState) => state.staffAdd);
  const [showField, setShowField] = useState(false);
  const userStr: any = getLocalStorage(SESSION.TOKEN);
  const CurrentLoginUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      city: cityValue,
    }));
    setErrors({
      ...errors,
      city: "",
    });
  }, [
    cityValue,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const validationErrors = validate();
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
        staffID: parsedData.staffID || staffEditId,

      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
    }
  };

  const createUser = async () => {
    try {
      if (staffAndAthleteIdData && !staffEditId) {
        const resultPayload = createUserPayload(
          staffAndAthleteIdData,
          editStaffData?.role,
          parsedData?.staffID || staffEditId,
          CurrentLoginUser?.userType,
          "Staff",
          parsedData.staffID || staffEditId,
          regSportID
        );
        const response = await Axios.post(
          `${process.env.API_BASE_URL}/Sports/InsertUser`,
          resultPayload
        );
      } else if (!staffEditId) {
        const generateUserPayload = (editStaffData: any) => {
          return {
            ntLogIn: getUsernameFromEmail(parsedData?.contactdetails?.personalEmail || formData?.personalEmail || ""),
            firstName: editStaffData?.firstName || "",
            middleName: editStaffData?.middleName || "",
            lastName: editStaffData?.surname || "",
            displayName: `${editStaffData?.firstName || ""} ${editStaffData?.surname || ""}`,
            email: parsedData?.contactdetails?.personalEmail || formData?.personalEmail || "",
            employeeNumber: `${editStaffData?.staffID || ""}`,
            gender: (editStaffData?.gender || "").charAt(0).toUpperCase() + (editStaffData?.gender || "").slice(1),
            dob: editStaffData?.dob || "",
            nationality: editStaffData?.nationality || "971",
            password: "12345",
            role: editStaffData?.role || "",
            enteredBy: parsedData?.staffID || "",
            userType: "Collaborator",
            moduleName: "Staff",
            moduleID: parsedData.staffID || staffEditId,
            sportID: regSportID
          };
        };
        const userPayload = generateUserPayload(editStaffData);
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
    if (staffAddContactData && staffAddContactData.code === 200) {
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        contactdetails: formData,
      }));
      dispatch(clearAddState());
      if (!staffEditId) {
        createUser()
      }
      setActiveStep(2);
    } else if (staffAddContactData && staffAddContactData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 2000);
    }
  }, [staffAddContactData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
    const payload: any = {
      staffID: parsedData.staffID ? parsedData.staffID : staffEditId || editStaffData?.staffID,
      sportID: regSportID,

    };
    dispatch(editStaff(payload));
  };

  useEffect(() => {
    if (parsedData.contactdetails && !staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        // residence: parsedData.contactdetails.residence || "",
        personalEmail: parsedData.contactdetails.personalEmail || "",
        dubaiPoliceEmail: parsedData.contactdetails.dubaiPoliceEmail || "",
        phoneNo: parsedData.contactdetails.phoneNo || "",
        emergencyContactName:
          parsedData.contactdetails.emergencyContactName || "",
        emergencyContactNumber:
          parsedData.contactdetails.emergencyContactNumber || "",
        area: parsedData.contactdetails.area || "",
        address: parsedData.contactdetails.address || "",
        city: parsedData.contactdetails.city || "",
        // country: parsedData.contactdetails.country || "",
        emergencyCountryCode:
          parsedData.contactdetails.emergencyCountryCode || "",
        countryCode: parsedData.contactdetails.countryCode || "",
      }));
      setValue("city", parsedData.contactdetails.city)
    }
  }, []);

  useEffect(() => {
    if (staffAndAthleteIdData && !staffEditId) {
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
    if (editStaffData && staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        personalEmail: editStaffData.personalEmail || "",
        dubaiPoliceEmail: editStaffData.dubaiPoliceEmail || "",
        phoneNo: editStaffData.phoneNo || "",
        emergencyContactName:
          editStaffData.emergencyContactName || "",
        emergencyContactNumber:
          editStaffData.emergencyContactNumber || "",
        area: editStaffData.area || "",
        address: editStaffData.address || "",
        city: editStaffData.city || "",
        emergencyCountryCode:
          editStaffData.emergencyCountryCode || "",
        countryCode: editStaffData.countryCode || "",
      }));
      setShowField(true)
      setValue("city", editStaffData.city)
    }
  }, [editStaffData]);

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      contactdetails: formData,
    }));
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

  return (
    <Fade in={true} timeout={1000}>
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
              {showBanner && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    className="dubai-med"
                  >
                    {staffAddContactData && staffAddContactData.error}
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
                  <DropDown
                    name="city"
                    control={control}
                    label="Emirate"
                    placeholder="Select Emirate"
                    options={[
                      { label: "Abu Dhabi", value: "Abu Dhabi" },
                      { label: "Dubai", value: "Dubai" },
                      { label: "Sharjah", value: "Sharjah" },
                      { label: "Ajman", value: "Ajman" },
                      { label: "Umm Al Quwain", value: "Umm Al Quwain" },
                      { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
                      { label: "Fujairah", value: "Fujairah" },

                    ]}
                    multiple={false}
                    variant="outlined"
                    icon={false}
                    module="rules"
                    required={true}
                  />
                  {errors.city && (
                    <Typography variant="caption" className="error-message">
                      {errors.city}
                    </Typography>
                  )}
                </Grid>

                {/* <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Country <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="country"
                    placeholder="Enter Country"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.country}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 100 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.country && (
                    <Typography variant="caption" className="error-message">
                      {errors.country}
                    </Typography>
                  )}
                </Grid> */}

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
                    type="text"
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
                    placeholder="Enter Dubai police Email"
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
                      inputProps={{
                        disabled: showField && !!formData.phoneNo,
                        style: {
                          backgroundColor: formData.phoneNo ? 'rgba(241, 235, 156, 0.2)' : 'inherit',
                        },
                      }}
                      country={"ae"}
                      value={`${formData.countryCode || ""}${formData.phoneNo || ""
                        }`}
                      onChange={handlePhoneNoChange}
                      searchPlaceholder="Phone Number"
                      autoFormat={false}
                      disabled={showField && !!formData.phoneNo}
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
                  disabled={staffAddContactData.loading}
                >
                  {staffAddContactData.loading
                    ? "Loading..."
                    : staffEditId ? "Update" : "Save & Continue"}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default ContactDetails;

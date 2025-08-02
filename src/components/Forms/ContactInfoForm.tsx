// pages/staff/edit.tsx
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Fade,
  Grid,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import {
  clearUpdateState,
  UpdateStaff,
} from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import {
  clearAthleteUpdateState,
  UpdateAthleteByID,
} from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { isEmpty } from "lodash";
import { getDefaultOptions } from "@/utils/helper";
import DropDown from "../Fields/DropDown";
import CustomPhoneInput from "../Fields/CustomPhoneInput";

interface Props {
  id: number;
  onClose: any;
  editData: any;
  module?: string;
}

const ContactInfoForm: React.FC<Props> = ({
  id,
  onClose,
  editData,
  module,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const athleteUpdateResponse = useSelector(
    (state: any) => state.athleteUpdateByID
  );
  const getNationalityList = useSelector(
    (state: any) => state.getNationalityList
  );
  const getNationalityListOpt: any = !isEmpty(getNationalityList.data)
    ? getDefaultOptions(getNationalityList.data, "countryName", "countryName")
    : [];
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      // residence: "",
      address: "",
      area: "",
      city: "",
      country: "",
      personalEmail: "",
      dubaiPoliceEmail: "",
      phoneNo: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
    },
  });

  useEffect(() => {
    const countryCode =
      editData.countryCode !== "" && editData.countryCode !== "0"
        ? editData.countryCode.replace("+", "")
        : "971";
    const emergencyNumberCode =
      editData.emergencyCountryCode !== "" &&
      editData.emergencyCountryCode !== "0"
        ? editData.emergencyCountryCode.replace("+", "")
        : "971";
    setFormData({
      countryCode: countryCode,
      emergencyCountryCode: emergencyNumberCode,
      phoneNo: editData.phoneNo,
      emergencyContactNumber: editData.emergencyContactNumber,
    });
    // setValue("residence", editData && editData.residence);
    setValue("address", editData && editData.address);
    setValue("area", editData && editData.area);
    setValue("city", editData && editData.city);
    setValue("country", editData && editData.country);
    setValue("personalEmail", editData && editData.personalEmail);
    setValue("dubaiPoliceEmail", editData && editData.dubaiPoliceEmail);
    setValue(
      "phoneNo",
      editData && editData.phoneNo !== "0" ? countryCode + editData.phoneNo : ""
    );
    setValue("emergencyContactName", editData && editData.emergencyContactName);
    setValue(
      "emergencyContactNumber",
      editData && editData.emergencyContactNumber !== "0"
        ? emergencyNumberCode + editData.emergencyContactNumber
        : ""
    );
  }, [editData]);

  const onSubmit: SubmitHandler<FieldValues> = (editStaffContactData) => {
    const updateBody: any = {
      ...editStaffContactData,
      section: "contactdetails",
      [module === "staff" ? "staffID" : "athleteID"]: id,
      
      emergencyCountryCode: formData.emergencyCountryCode,
      countryCode: formData.countryCode,
      phoneNo: formData.phoneNo,
      emergencyContactNumber: formData.emergencyContactNumber,
    };

    if (module === "staff") {
      dispatch(UpdateStaff(updateBody));
    }
    if (module === "athlete") {
      dispatch(UpdateAthleteByID(updateBody));
    }
  };

  useEffect(() => {
    if (
      (staffUpdateData && staffUpdateData.status === "succeeded") ||
      (module === "athlete" &&
        athleteUpdateResponse &&
        athleteUpdateResponse.code === 200 &&
        athleteUpdateResponse.status === "succeeded")
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // onClose(false)
      dispatch(clearAthleteUpdateState());
      dispatch(clearUpdateState());
    } else if (
      (staffUpdateData && staffUpdateData.status === "failed") ||
      (module === "athlete" &&
        athleteUpdateResponse &&
        athleteUpdateResponse.code === 500 &&
        athleteUpdateResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearUpdateState());
      dispatch(clearAthleteUpdateState());
    }
  }, [staffUpdateData, athleteUpdateResponse]);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        onClose(false);
        setSnackbarOpen(false);
      }, 500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);

  const [formData, setFormData] = useState({
    phoneNo: "",
    countryCode: "",
    emergencyCountryCode: "",
    emergencyContactNumber: "",
  });

  const handlePhoneChange = (
    dialCode: string,
    phoneWithoutDialCode: string
  ) => {
    const phoneNumber = phoneWithoutDialCode.slice(dialCode.length - 1);
    setFormData((prev) => ({
      ...prev,
      phoneNo: phoneNumber,
      countryCode: dialCode,
    }));
    // setValue('phoneNo',dialCode + phoneWithoutDialCode)
  };
  const handleEmergencyNumberChange = (
    dialCode: string,
    phoneWithoutDialCode: string
  ) => {
    const EmergencyNumberPhoneNumber = phoneWithoutDialCode.slice(
      dialCode.length - 1
    );
    setFormData((prev) => ({
      ...prev,
      emergencyContactNumber: EmergencyNumberPhoneNumber,
      emergencyCountryCode: dialCode,
    }));
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          // p: 3,
          // maxWidth: 400
        }}
      >
        <CustomTextField
          name="address"
          control={control}
          label="Address"
          placeholder="Enter Address"
          rules={{
            required: "Address is required",
            pattern: {
              value: /^[a-zA-Z0-9/-\s,]*$/,
              message: "Only letters ,spaces ,comma & / are allowed",
            },
            maxLength: {
              value: 100,
              message: "Address cannot exceed 100 characters",
            },
          }}
        />
        <CustomTextField
          name="area"
          control={control}
          label="Area"
          placeholder="Enter Area"
          rules={{
            required: "Area is required",
            pattern: {
              value: /^[a-zA-Z\s,]*$/,
              message: "Only letters ,spaces ,comma & / are allowed",
            },
            maxLength: {
              value: 100,
              message: "Area cannot exceed 100 characters",
            },
          }}
        />
        <CustomTextField
          name="city"
          control={control}
          label="City"
          placeholder="Enter City"
          rules={{
            required: "City is required",
            pattern: {
              value: /^[a-zA-Z\s,]*$/,
              message: "Only letters ,spaces ,comma & / are allowed",
            },
            maxLength: {
              value: 100,
              message: "City cannot exceed 100 characters",
            },
          }}
        />
        {/* <CustomTextField
          name="country"
          control={control}
          label="Country"
          rules={{
            required: "Country is required",
            pattern: {
              value: /^[a-zA-Z\s,]*$/,
              message: "Only letters ,spaces ,comma & / are allowed",
            },
            maxLength: { value: 100, message: "Country cannot exceed 100 characters" },
          }}
        /> */}
        <DropDown
          name="country"
          label="Country"
          placeholder="Select Country"
          control={control}
          // defaultValue={formData && formData.qualification}
          options={getNationalityListOpt}
          variant="outlined"
          required={true}
        />

        <CustomTextField
          name="personalEmail"
          control={control}
          label="Personal Email"
          placeholder="Enter Personal Email"
          rules={{
            required: "Personal Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
            maxLength: {
              value: 100,
              message: "Personal Email cannot exceed 100 characters",
            },
          }}
        />
        <CustomTextField
          name="dubaiPoliceEmail"
          control={control}
          label="Dubai police Email"
          placeholder="Enter Dubai police Email"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9._%+-]+\.)?gov\.ae$/i,
              message: `Enter the Valid Dubai police email id example: "adam@dubaipolice.gov.ae"`,
            },
            maxLength: {
              value: 100,
              message: "Dubai police Email cannot exceed 100 characters",
            },
          }}
        />

        {/* <CustomTextField
          name="phoneNo"
          control={control}
          label="Phone Number"
          rules={{
            required: "Phone Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            maxLength: { value: 15, message: "Phone number must contain only digits (eg: 154450123)." },
            validate: {
              isNumeric: (value) =>
                /^\d+$/.test(value) || "Phone number must contain only digits (eg: 154450123).",
            },
          }}
        /> */}
        <CustomPhoneInput
          name="phoneNo"
          control={control}
          label="Phone Number"
          placeholder="Enter Phone Number"
          // rules={{ required: "Emergency contact number is required" }}
          onChangeFormatted={handlePhoneChange} // Pass the handler
          rules={{
            required: "Phone Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            maxLength: {
              value: 15,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            validate: {
              isNumeric: (value) =>
                /^\d+$/.test(value) ||
                "Phone number must contain only digits (eg: 154450123).",
            },
          }}
        />

        {/* <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Phone Number <span className="asterisk">*</span>
                  </Typography>
                  <PhoneInput
                  country={'ae'}
                  value={formData.businessPhone || ''}
                  onChange={handlePhoneNoChange}
                  searchPlaceholder='Phone Number'
                  />
                  {errors.phoneNo && (
                    <Typography variant="caption" className="error-message">
                      {errors.phoneNo}
                    </Typography>
                  )} */}

        <CustomTextField
          name="emergencyContactName"
          control={control}
          label="Emergency Contact Name"
          placeholder="Enter Emergency Contact Name"
          rules={{
            required: "Emergency Contact is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Emergency Contact cannot exceed 50 characters",
            },
          }}
        />
        <CustomPhoneInput
          name="emergencyContactNumber"
          control={control}
          label="Emergency Contact Number"
          placeholder="Enter Emergency Contact Number"
          // rules={{ required: "Emergency contact number is required" }}
          onChangeFormatted={handleEmergencyNumberChange} // Pass the handler
          rules={{
            required: "Emergency Contact Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            maxLength: {
              value: 15,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            validate: {
              isNumeric: (value) =>
                /^\d+$/.test(value) ||
                "Phone number must contain only digits (eg: 154450123).",
            },
          }}
        />

        {/* <CustomTextField
          name="emergencyContactNumber"
          control={control}
          label="Emergency Contact Number"
          rules={{
            required: "Emergency Contact Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            maxLength: { value: 15, message: "Phone number must contain only digits (eg: 154450123)." },
            validate: {
              isNumeric: (value) =>
                /^\d+$/.test(value) || "Phone number must contain only digits (eg: 154450123).",
            },
          }}
        /> */}
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Staff member updated successfully!"
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleClose}
          />
        )}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}
        >
          <Button
            onClick={() => onClose(false)}
            variant="outlined"
            color="secondary"
            className="text-capitalize dubai-med"
            sx={{ height: "48px", fontSize: "16px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="text-capitalize dubai-med"
            sx={{ height: "48px", fontSize: "16px" }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default ContactInfoForm;

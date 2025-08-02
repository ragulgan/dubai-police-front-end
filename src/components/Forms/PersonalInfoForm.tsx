// pages/staff/edit.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import CustomDatePicker from "../Fields/CustomDatePicker";
import CustomAgeField from "../Fields/CustomAgeField";
import moment from "moment";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import FileUpload from "@/utils/dropzone";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
} from "@/utils/constants";
import {
  UpdateStaff,
  clearUpdateState,
} from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  singleFileUploadDispatch,
  updateStaffDispatch,
} from "@/redux/store";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import _, { isEmpty } from "lodash";
import CustomSnackbar from "../CustomSnackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar"; // Ensure this line exists.
import { formatDate, getDefaultOptions } from "@/utils/helper";
import omit from "lodash/omit";
import {
  clearAthleteUpdateState,
  UpdateAthleteByID,
} from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import DropDown from "../Fields/DropDown";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import SelectInputAdornments from "../Fields/SelectInputAdornments";

interface Props {
  id: any;
  onClose: any;
  editData: any;
  module?: string;
  setCloseConfirmed?: any;
}

interface FormData {
  ProfileImage: string;
  firstName: string;
  middleName: string;
  surname: string;
  gender: string;
  role: string;
  nationality: string;
  dob: string;
  placeOfBirth: string;
  passportNo: string;
  emiratesID: string;
  age: number | null; // Allow `age` to be either a number or null
  iDDocument: string;
  passport: string;
  height: number;
  weight: number;
  passportExpirationDate: string;
  heroImage: string;
  languagesSpoken: string;
}

const PersonalInfoForm: React.FC<Props> = ({
  id,
  onClose,
  editData,
  module,
  setCloseConfirmed,
}) => {
  const dispatch: updateStaffDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const athleteUpdateResponse = useSelector(
    (state: any) => state.athleteUpdateByID
  );
  const singleUpload = useSelector((state: any) => state.singleUpload);
  const getNationalityList = useSelector(
    (state: any) => state.getNationalityList
  );
  const getNationalityListOpt: any = !isEmpty(getNationalityList.data)
    ? getDefaultOptions(getNationalityList.data, "countryName", "countryName")
    : [];
  const [currentSection, setCurrentSection] = useState("");
  const rolesListData = useSelector((state: RootState) => state.rolesList);

  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    ProfileImage: "",
    firstName: "",
    middleName: "",
    surname: "",
    gender: "",
    role: "",
    nationality: "",
    dob: "",
    placeOfBirth: "",
    passportNo: "",
    passportExpirationDate: "",
    passport: "",
    emiratesID: "",
    iDDocument: "",
    age: 0,
    weight: 0,
    height: 0,
    heroImage: "",
    languagesSpoken: "",
  });
  const [imageData, setImageData] = useState<any>(null);
  const filepassRef = useRef<HTMLInputElement>(null);
  const fileIDRef = useRef<HTMLInputElement>(null);

  // Adding defaultValues for form fields
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      surname: "",
      otherStaff: "",
      gender: "male",
      age: "",
      role: "",
      nationality: "",
      dob: null,
      placeOfBirth: "",
      passportNo: "",
      attachmentList: "",
      emiratesID: "",
      height: 0,
      weight: 0,
      passportExpirationDate: null,
      languagesSpoken: "",
    },
  });

  const otherStaff = watch("role");
  // Calculate and set age based on dateOfBirth

  const handleFileChange = (
    file: any,
    flag: any,
    modulename: any,
    moduleId: any
  ) => {
    if (file) {
      setImageData((prevData: any) => ({
        ...prevData,
        [flag]: {
          file,
          modulename,
          moduleId,
          section: flag,
          
        },
      }));
      setCurrentSection(flag === "ProfileImage" ? flag : "");
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          ProfileImage:
            flag === DROPZONE_IMAGE_FLAG.PROFILES
              ? result
              : prevData.ProfileImage,
          heroImage:
            flag === DROPZONE_IMAGE_FLAG.HERO_PROFILE
              ? result
              : prevData.heroImage,
          iDDocument:
            flag === DROPZONE_IMAGE_FLAG.ID_DOCUMENT
              ? file.name
              : prevData.iDDocument,
          passport:
            flag === DROPZONE_IMAGE_FLAG.PASSPORT
              ? file.name
              : prevData.passport,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (singleUpload.code === 200 && currentSection !== "ProfileImage") {
      dispatch(clearState());
      setCurrentSection("");
    }
  }, [singleUpload]);
  useEffect(() => {
    if (
      (staffUpdateData &&
        staffUpdateData.code === 200 &&
        staffUpdateData.status === "succeeded") ||
      (module === "athlete" &&
        athleteUpdateResponse &&
        athleteUpdateResponse.code === 200 &&
        athleteUpdateResponse.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(isUpdatedFunc(true));
      dispatch(clearUpdateState());
      dispatch(clearAthleteUpdateState());
    } else if (
      (staffUpdateData &&
        staffUpdateData.code === 500 &&
        staffUpdateData.status === "failed") ||
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

  useEffect(() => {
    if (editData && !isEmpty(editData.attachmentList)) {
      const ProfileImage =
        editData &&
        editData.attachmentList.filter(
          (item: any) =>
            item.documentSection.toLowerCase() === "ProfileImage".toLowerCase()
        );
      const heroImage =
        editData &&
        editData.attachmentList.filter(
          (item: any) =>
            item.documentSection.toLowerCase() ===
            "ProfileFullImage".toLowerCase()
        );
      const passport =
        editData &&
        editData.attachmentList.filter(
          (item: any) =>
            item.documentSection.toLowerCase() === "Passport".toLowerCase()
        );
      const iDDocument =
        editData &&
        editData.attachmentList.filter(
          (item: any) =>
            item.documentSection.toLowerCase() === "IDDocument".toLowerCase()
        );

      setFormData({
        ...formData,
        ProfileImage: ProfileImage[0]?.filePath || "",
        heroImage: heroImage[0]?.filePath || "",
        passport: passport?.[0]?.fileName || "",
        iDDocument: iDDocument?.[0]?.fileName || "",
      });
    }
    setValue("firstName", editData && editData.firstName);
    setValue("middleName", editData && editData.middleName);
    setValue("surname", editData && editData.surname);
    setValue("gender", editData && editData.gender.toLowerCase());
    setValue("nationality", editData && editData.nationality);
    setValue("weight", editData && Number(editData.weight));
    setValue("height", editData && Number(editData.height));
    setValue("passportNo", editData && editData.passportNo);
    setValue(
      "passportExpirationDate",
      editData && editData.passportExpirationDate
    );
    setValue("placeOfBirth", editData && editData.placeOfBirth);
    setValue("role", editData && editData.role);
    setValue("age", editData && editData.age);
    setValue("emiratesID", editData && editData.emiratesID);
    setValue(
      "languagesSpoken",
      editData && editData.languagesSpoken !== ""
        ? editData.languagesSpoken.split(",")
        : ""
    );
    setValue("dob", editData && editData.dob);
    setValue(
      "otherStaff",
      editData && editData.role === "Other Staff"
        ? editData && editData.otherStaff
        : ""
    );
  }, [editData]);

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    const updatePersonalObj: any = {
      ...formData,
      section: "personaldetails",
      [module === "staff" ? "staffID" : "athleteID"]: id,
      
      ProfileImage: formData.ProfileImage,
      heroImage: formData.heroImage,
      dob: formatDate(formData.dob),
      passportExpirationDate: formatDate(formData.passportExpirationDate),
      passport: formData.passport,
      weight: Number(formData.weight),
      height: Number(formData.height),
      languagesSpoken:
        formData.languagesSpoken && formData.languagesSpoken.length
          ? formData.languagesSpoken.join(",")
          : "",
    };
    const updateBody =
      module !== "athlete"
        ? updatePersonalObj
        : omit(updatePersonalObj, ["role", "height", "weight"]);
    if (module === "staff") {
      dispatch(UpdateStaff(updateBody));
    } else if (module === "athlete") {
      dispatch(UpdateAthleteByID(updateBody));
    }
  };

  const handleSnackBarClose = (
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
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  const handlepassClick = () => {
    if (filepassRef.current) {
      filepassRef.current.click();
    }
  };

  const handleIdClick = () => {
    if (fileIDRef.current) {
      fileIDRef.current.click();
    }
  };

  const handleDeleteFile = async (
    modulename: any,
    moduleId: any,
    fileType: any
  ) => {
    const fileID = editData?.attachmentList?.find(
      (item: any) =>
        item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    if (moduleId) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,
        
        fileID: fileID,
      };
      dispatch(deleteFile(data));
      setFormData((prev) => ({
        ...prev,
        [fileType]: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fileType]: "",
      }));
    }
  };

  const rolesOptions =
    rolesListData?.data
      ?.filter((role: any) => role.moduleName === "Staff") // Filter roles by moduleName
      .map((role: any) => ({
        label: role.roleName,
        value: role.roleName,
      })) || [];

  const calculateAge = (dob: string) => {
    const birthDate = moment(dob);
    const today = moment();
    return today.diff(birthDate, "years");
  };

  const dateChange = (data: any) => {
    const dob = data.value ? moment(data.value).toISOString() : null;
    if (dob) {
      const age = calculateAge(dob);
      setFormData((prevData) => ({
        ...prevData,
        dob: data.value,
        age: age,
      }));
      setValue("age", age.toString());
    }
  };

  const handleClose = () => {
    if (singleUpload.code === 200 && !isEmpty(singleUpload.data)) {
      const data = {
        moduleName: module,
        moduleID: id,
        docSection: "ProfileImage",
        
        fileID: singleUpload.data.fileID,
      };
      dispatch(deleteFile(data));
      dispatch(clearState());
    }
    onClose(false);
  };
  useEffect(() => {
    const firstError = Object.keys(errors).find((field) => {
      return !!errors[field as keyof typeof errors];
    });
    if (!isEmpty(errors)) {
      setFocus((firstError as any) || "firstName"); // Type assertion for type safety
    }
  }, [errors]);

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
        <Grid container spacing={1} justifyContent="start" alignItems="center">
          <Grid item>
            <Stack alignItems="flex-start">
              <div className="avatarContainer">
                {
                  singleUpload.loading && currentSection === "ProfileImage" ? (
                    <CircularProgress
                      size={24}
                      color="primary"
                      className="avatar"
                    />
                  ) : (
                    //   <Avatar
                    //   src={formData.ProfileImage || "/broken-image.jpg"}
                    //   className="avatar"
                    // />
                    <Avatar
                      src={
                        (currentSection === "" && formData.ProfileImage) ||
                        (currentSection === "ProfileImage" &&
                          !singleUpload.error)
                          ? formData.ProfileImage
                          : "/broken-image.jpg"
                      }
                      // src={formData.ProfileImage || currentSection === 'ProfileImage' || !singleUpload.error || "/broken-image.jpg"}
                      className="avatar"
                    />
                  )
                  //    <Skeleton
                  //    variant="circular"
                  //    width={80}
                  //    height={80}
                  //    sx={{ mb: 1,bgcolor: 'primary' }}
                  //  />
                }
                <IconButton
                  className="iconButton"
                  component="label"
                  disabled={singleUpload.loading}
                >
                  <CameraAltIcon className="cameraIcon" />
                  <FileUpload
                    onFileChange={(
                      file: any,
                      flag: any,
                      modulename: any,
                      moduleId: any
                    ) => handleFileChange(file, flag, modulename, moduleId)}
                    formatType={FILE_FORMAT_TYPE}
                    type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                    //
                    flag={DROPZONE_IMAGE_FLAG.PROFILES}
                    modulename={module}
                    moduleId={id}
                    setData={setFormData}
                    formData={formData}
                    // fetchDataApi={() => dispatch(editStaff(payload))}
                  />
                </IconButton>
              </div>
            </Stack>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography
                gutterBottom
                align="center"
                className="typography-profileImage textfield-label bukra"
              >
                Upload Photo
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              {formData.ProfileImage && (
                <>
                  <Typography
                    gutterBottom
                    align="center"
                    className="typography-profileImage"
                    sx={{
                      color: "#ef0a0a",
                      fontWeight: 500,
                      fontSize: "14px",
                      mr: 1,
                    }}
                  >
                    Delete
                  </Typography>
                  <IconButton
                    className="deleteIconButton"
                    onClick={() => {
                      handleDeleteFile(module, id, "ProfileImage");
                    }}
                    aria-label="delete"
                    sx={{
                      color: "#ef0a0a",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                      },
                      p: 1,
                    }}
                    disabled={
                      singleUpload.loading ||
                      (currentSection === "ProfileImage" && singleUpload.error)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Grid>
          <Grid
            container
            spacing={1}
            justifyContent="start"
            alignItems="center"
            marginTop={1}
            marginLeft={0.5}
          >
            <Grid item>
              <Stack alignItems="flex-start">
                <div className="avatarContainer">
                  <Avatar
                    src={formData.heroImage || "/broken-image.jpg"}
                    className="avatar-hero"
                  />
                  {/* <Avatar src={formData.heroImage || HeroPicture} alt="HeroPicture" width={81} height={81} style={{width:'81px', height:'81px'}} /> */}
                  <IconButton className="iconButton" component="label">
                    <CameraAltIcon className="cameraIcon" />
                    <FileUpload
                      onFileChange={(
                        file: any,
                        flag: any,
                        modulename: any,
                        moduleId: any
                      ) => handleFileChange(file, flag, modulename, moduleId)}
                      formatType={FILE_FORMAT_TYPE}
                      type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                      flag={DROPZONE_IMAGE_FLAG.HERO_PROFILE}
                      moduleId={id}
                      modulename={module}
                      setData={setFormData}
                      formData={formData}
                      // fetchDataApi={() => dispatch(editStaff(filepayload))}
                    />
                  </IconButton>
                </div>
              </Stack>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  gutterBottom
                  align="center"
                  className="typography-profileImage textfield-label bukra"
                >
                  Upload Hero Picture
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  gutterBottom
                  align="center"
                  className="bukra"
                  sx={{ fontSize: "11px", color: "#d32f2f" }}
                >
                  Recommended: 363x630 PNG.
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                {formData.heroImage && (
                  <>
                    <Typography
                      gutterBottom
                      align="center"
                      className="typography-profileImage"
                      sx={{
                        color: "#ef0a0a",
                        fontWeight: 500,
                        fontSize: "14px",
                        mr: 1,
                      }}
                    >
                      Delete
                    </Typography>
                    <IconButton
                      className="deleteIconButton"
                      onClick={() => {
                        handleDeleteFile(module, id, "ProfileFullImage");
                      }}
                      aria-label="delete"
                      sx={{
                        color: "#ef0a0a",
                        "&:hover": {
                          backgroundColor: "rgba(255, 0, 0, 0.1)",
                        },
                        p: 1,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <CustomTextField
          name="firstName"
          control={control}
          label="First Name"
          placeholder="Enter First Name"
          rules={{
            required: "First Name is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "First Name cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="middleName"
          control={control}
          label="Middle Name"
          placeholder="Enter Middle Name"
          rules={{
            required: "Middle Name is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Middle Name cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="surname"
          control={control}
          label="Surname"
          placeholder="Enter Surname"
          rules={{
            required: "Surname is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Surname cannot exceed 50 characters",
            },
          }}
        />
        {/* <CustomTextField
        name="personalEmail"
        control={control}
        label="Email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        }}
      /> */}
        <CustomRadioGroup
          name="gender"
          control={control}
          label="Select Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            // { value: "other", label: "Other" },
          ]}
          required={true}
        />
        {module !== "athlete" && (
          <>
            <DropDown
              name="role"
              label="Role"
              control={control}
              options={rolesOptions}
              variant="outlined"
              required={true}
            />
            {otherStaff === "Other Staff" ? (
              <CustomTextField
                name="otherStaff"
                control={control}
                placeholder="Enter Staff Role"
                rules={{
                  required: "Staff Role is required",
                  pattern: {
                    value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                  maxLength: {
                    value: 50,
                    message: "Staff Role cannot exceed 50 characters",
                  },
                }}
              />
            ) : null}
          </>
        )}
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={10} md={10} flexDirection={"column"}>
            <CustomDatePicker
              control={control}
              name="dob"
              label="Date of Birth"
              required={true}
              defaultValue={editData && editData.dob}
              onChange={dateChange}
              minDate={moment().subtract(50, "years")}
              maxDate={moment().subtract(18, "years")}
              rules={{ required: "Date of Birth is required" }}
            />
          </Grid>
          <Grid item xs={2} md={2} marginTop={"-5px"}>
            <CustomAgeField name="age" control={control} label="Age" />
          </Grid>
        </Grid>
        <CustomTextField
          name="placeOfBirth"
          control={control}
          label="Place of Birth"
          placeholder="Enter Place of Birth"
          rules={{
            pattern: {
              value: /^[a-zA-Z\s,]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Place of Birth cannot exceed 50 characters",
            },
          }}
        />
        {module === "staff" && (
          <SelectInputAdornments
            name="height"
            control={control}
            label="Height"
            // rules={{ required: "Height is required" }}
            rules={{
              required: "Height is required",
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message:
                  "Invalid format. Please use the correct format, e.g., 168.45",
              },
              maxLength: { value: 6, message: "Height cannot exceed 6 digits" },
              max: {
                value: 255,
                message: "Height cannot exceed 255 cm",
              },
            }}
            placeholder="Enter Height"
            selectOptions={[
              { value: "CM", label: "CM" },
              { value: "MM", label: "MM" },
            ]}
            sx={{ marginTop: "12px" }}
            // error={watch('residence') ? undefined : "Residence is required"}
          />
        )}

        {module === "staff" && (
          <SelectInputAdornments
            name="weight"
            control={control}
            label="Weight"
            // rules={{ required: "Weight is required" }}
            rules={{
              required: "Weight is required",
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message:
                  "Invalid format. Please use the correct format, e.g., 85.45 or 110.45",
              },
              maxLength: { value: 6, message: "Weight cannot exceed 6 digits" },
              max: {
                value: 640,
                message: "Weight cannot exceed 640 kg",
              },
            }}
            placeholder="Enter Weight"
            selectOptions={[{ value: "kg", label: "KG" }]}
            // error={watch('residence') ? undefined : "Residence is required"}
          />
        )}

        {/* <CustomTextField
          name="nationality"
          control={control}
          label="Nationality"
          rules={{
            required: "Nationality is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Nationality cannot exceed 50 characters",
            },
          }}
        /> */}
        <DropDown
          name="nationality"
          label="Nationality"
          control={control}
          // defaultValue={formData && formData.qualification}
          options={getNationalityListOpt}
          variant="outlined"
          required={true}
          placeholder={"Select Nationality"}
        />

        <CustomTextField
          name="passportNo"
          control={control}
          label="Passport Number"
          placeholder="Enter Passport Number"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9/-]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 20,
              message: "Passport Number cannot exceed 20 characters",
            },
          }}
          // rules={{ required: "Passport Number is required" }}
        />
        <Grid
          container
          spacing={1}
          justifyContent="start"
          alignItems="center"
          mt={1}
          marginBottom={1}
        >
          <Grid alignItems="flex-start" p={0}>
            <IconButton
              className="attachFileButton"
              component="label"
              aria-label="attach-file"
              sx={{
                color: "#00426A",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
                padding: 1,
              }}
            >
              <FileUpload
                onFileChange={(
                  file: any,
                  flag: any,
                  modulename: any,
                  moduleId: any
                ) => handleFileChange(file, flag, modulename, moduleId)}
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.PASSPORT}
                setData={setFormData}
                formData={formData}
                moduleId={id}
                modulename={module}
                fileInputRef={filepassRef}
              />
              <AttachFileSharpIcon />
            </IconButton>
          </Grid>
          <Grid>
            <Box display="flex" alignItems="center">
              <Typography
                align="center"
                color="error"
                className="dubai-med upload-label"
                onClick={handlepassClick}
                style={{
                  cursor: "pointer",
                  color: "#00426A",
                }}
              >
                {formData.passport ? (
                  <>{formData.passport}</>
                ) : (
                  <>Upload Passport (PDF)</>
                )}
              </Typography>
              {formData.passport && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile(module, id, "passport");
                  }}
                  sx={{
                    color: "#ef0a0a",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                    },
                    padding: 1,
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>
        <CustomDatePicker
          control={control}
          name="passportExpirationDate"
          label="Passport Expiry Date"
          required={false}
          defaultValue={editData && editData.passportExpirationDate}
          onChange={dateChange}
          boxmb={0.8}
          minDate={moment().subtract(10, "years")}
          maxDate={moment().add(10, "years")}
        />
        <CustomTextField
          name="emiratesID"
          control={control}
          label="Emirates ID Number"
          placeholder="Enter Emirates ID Number"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9/-]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 20,
              message: "Emirates ID cannot exceed 20 characters",
            },
          }}
        />
        <Grid
          container
          spacing={1}
          justifyContent="start"
          alignItems="center"
          mt={1}
        >
          <Grid alignItems="flex-start" p={0}>
            <IconButton
              className="attachFileButton"
              component="label"
              aria-label="attach-file"
              sx={{
                color: "#00426A",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
                padding: 1,
              }}
            >
              <FileUpload
                onFileChange={(
                  file: any,
                  flag: any,
                  modulename: any,
                  moduleId: any
                ) => handleFileChange(file, flag, modulename, moduleId)}
                formatType={FILE_FORMAT_TYPE}
                type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                flag={DROPZONE_IMAGE_FLAG.ID_DOCUMENT}
                setData={setFormData}
                formData={formData}
                modulename={module}
                moduleId={id}
                fileInputRef={fileIDRef}
              />
              <AttachFileSharpIcon />
            </IconButton>
          </Grid>
          <Grid>
            <Box display="flex" alignItems="center">
              <Typography
                align="center"
                color="error"
                className="dubai-med upload-label"
                onClick={handleIdClick}
                style={{
                  cursor: "pointer",
                  color: "#00426A",
                }}
              >
                {formData.iDDocument ? (
                  <>{formData.iDDocument}</>
                ) : (
                  <>Upload ID Document (JPEG, PNG)</>
                )}
              </Typography>
              {formData.iDDocument && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile(module, id, "iDDocument");
                  }}
                  sx={{
                    color: "#ef0a0a",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                    },
                    padding: 1,
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Grid>

          {snackbarStatus !== "" && (
            <CustomSnackbar
              message={
                snackbarStatus === "success"
                  ? `${
                      module === "staff" ? "Staff" : "Athlete"
                    } member updated successfully!`
                  : "Something went wrong"
              }
              severity={snackbarStatus === "success" ? "success" : "error"}
              open={snackbarOpen}
              onClose={handleSnackBarClose}
            />
          )}
        </Grid>
        <DropDown
          name="languagesSpoken"
          label="Languages Spoken"
          control={control}
          placeholder="Select Languages Spoken"
          // defaultValue={formData && formData.dpEmploymentStatus}
          options={[
            { value: "Arabic", label: "Arabic" },
            { value: "Japanese", label: "Japanese" },
            { label: "English", value: "English" },
            { label: "Spanish", value: "Spanish" },
            { label: "French", value: "French" },
            { label: "German", value: "German" },
            { label: "Chinese", value: "Chinese" },
            { label: "Russian", value: "Russian" },
            { label: "Italian", value: "Italian" },
            { label: "Portuguese", value: "Portuguese" },
          ]}
          multiple={true}
          variant="outlined"
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}
        >
          <Button
            onClick={handleClose}
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
            disabled={singleUpload.loading}
            sx={{ height: "48px", fontSize: "16px" }}
          >
            {singleUpload.loading ? (
              <CircularProgress size={24} color="inherit" /> // Loading spinner
            ) : (
              "Update" // Button text
            )}
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default PersonalInfoForm;

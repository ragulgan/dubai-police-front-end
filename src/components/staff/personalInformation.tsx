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
  IconButton,
  Avatar,
  Stack,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Fade,
  MenuItem,
  Select,
  InputAdornment,
  OutlinedInput,
  Chip,
  Theme,
} from "@mui/material";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_PDF_IMAGE,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
  PDF_FORMAT,
  REGEX,
} from "@/utils/constants";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import {
  formatDate,
  formatDates,
  getLocalStorage,
  trimFormData,
} from "@/utils/helper";
import { PersonalFormValidation } from "@/utils/staffs/validation";
import FileUpload from "@/utils/dropzone";
import { usePathname, useRouter } from "next/navigation";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import {
  clearStaffEditState,
  editStaff,
} from "@/redux/slices/staff/staffEditSlice";
import {
  clearDeletFileState,
  deleteFile,
} from "@/redux/slices/fileupload/deleteFile";
import ReactSelect from "@/components/Fields/ReactSelect";
import { getNationalityListAPI } from "@/redux/slices/nationality/getNationalityListSlice";
import theme from "../../utils/theme";
import CloseIcon from "@mui/icons-material/Close";
import CustomReactDropown from "../Fields/CustomReactDropDown";

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
    fontFamily: "Dubai",
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

interface FormData {
  profileImage: string;
  firstName: string;
  surname: string;
  gender: string;
  role: string;
  nationality: string;
  dob: string;
  placeOfBirth: string;
  passportNo: string;
  emiratesID: string;
  age: number | null;
  iDdocumentImage: string;
  passportPdf: string;
  middleName: string;
  height: string;
  weight: string;
  passportExpirationDate: string;
  heroImage: string;
  languagesSpoken: string;
  otherStaff: string;
}

function getStyles(name: string, personName: string, theme: Theme) {
  const selectedNames = personName.split(",");
  return {
    fontWeight: selectedNames
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const names = [
  "Arabic",
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Russian",
  "Italian",
  "Portuguese",
];

const PersonalInformation = (props: any) => {
  const { handleSubmit, control } = useForm();
  const {
    activeStep,
    setActiveStep,
    setAllData,
    allData,
    editStaffData,
    filepayload,
    teamId,
    setDialogOpen,
    showCancelButton,
    staffAndAthleteIdData,
    staffEditId,
    editPayload,
    onClose,
  } = props;
  const router: any = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const staffAddData = useSelector((state: RootState) => state.staffAdd);
  const rolesListData = useSelector((state: RootState) => state.rolesList);
  const [showField, setShowField] = useState(false);
  const [otherStaffShow, setOtherStaffShow] = useState("");
  const [formData, setFormData] = useState<any>({
    profileImage: "",
    firstName: "",
    surname: "",
    gender: "",
    role: "",
    nationality: "",
    dob: "",
    placeOfBirth: "",
    passportNo: "",
    passportPdf: "",
    emiratesID: "",
    iDdocumentImage: "",
    age: null,
    middleName: "",
    height: "",
    weight: "",
    passportExpirationDate: "",
    heroImage: "",
    languagesSpoken: "",
    otherStaff: "",
    emiratesExpiryDate: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const [birthDate, setBirthDate] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [imageData, setImageData] = useState<any>(null);
  const filepassRef = useRef<HTMLInputElement>(null);
  const fileIDRef = useRef<HTMLInputElement>(null);
  const getSportID = getLocalStorage("sport");
  const getNationality = useSelector((state: any) => state.listNationality);
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const [NationalityOption, setNationalityOption] = useState();
  const [SelectedNationalityOption, setSelectedNationalityOption] =
    useState<any>(null);
  const [SelectedLanguageOption, setSelectedLanguageOption] =
    useState<any>(null);
  const { validate } = PersonalFormValidation(
    formData,
    setErrors,
    otherStaffShow
  );
  const fileDelete = useSelector((state: any) => state && state.fileDelete);

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
    if (name === "gender" && value) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        gender: "",
      }));
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = moment(dob);
    const today = moment();
    return today.diff(birthDate, "years");
  };

  const dateChange = (data: any) => {
    const dob = data.value ? moment(data.value).toISOString() : null;
    if (dob) {
      const age = calculateAge(dob);
      setFormData((prevData: any) => ({
        ...prevData,
        dob: data.value,
        age: age,
      }));
    }
    setBirthDate(data.value);
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
      age: validationErrors[data.age] || "",
    });
  };

  const datePickerChange = (data: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [data.name]: data.value,
    }));
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const formatDate = (date: string | undefined) =>
    date ? moment(date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";

  const onSubmit = async (data: any) => {
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const {
        iDdocumentImage,
        passportPdf,
        profileImage,
        emiratesID,
        heroImage,
        ...rest
      } = formData;
      const trimmedRest = trimFormData(rest);
      if ((parsedData && parsedData.staffID) || staffEditId) {
        const data = {
          ...trimmedRest,
          emiratesID: formData.emiratesID,
          passportExpirationDate: formatDate(formData.passportExpirationDate),
          emiratesExpiryDate: formatDate(formData.emiratesExpiryDate),
          dob: formatDate(formData.dob),
          age: Number(formData.age) || 0,
          height: Number(formData.height),
          weight: Number(formData.weight),

          staffID: parsedData.staffID ? parsedData.staffID : staffEditId,
          section: "personaldetails",
        };
        dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
        const payload: any = {
          staffID: parsedData.staffID ? parsedData.staffID : staffEditId,
          sportID: teamId,
        };
        dispatch(editStaff(payload));
      } else {
        const data = {
          ...trimmedRest,
          emiratesID: formData.emiratesID,
          passportExpirationDate: formatDate(formData.passportExpirationDate),
          emiratesExpiryDate: formatDate(formData.passportExpirationDate),
          dob: formatDate(formData.dob),
          age: Number(formData.age) || 0,
          height: Number(formData.height),
          weight: Number(formData.weight),
          sportID: +getSportID,
        };
        dispatch(addStaff({ url: "/InsertStaff", payload: data }));
      }
    }
  };

  useEffect(() => {
    if (staffAddData && staffAddData.code === 200) {
      setShowBanner(false);
      const { iDdocumentImage, passportPdf, profileImage, heroImage, ...rest } =
        formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        PersonalInformation: rest,
        staffID: staffAddData.data.staffID,
        otherStaffShowValue: otherStaffShow,
      }));
      const payload: any = {
        staffID: staffAddData.data.staffID,
        sportID: teamId,
      };
      dispatch(editStaff(payload));
      if (!_.isEmpty(imageData) && !editStaffData) {
        const fileFlags = [
          "ProfileImage",
          "IDDocument",
          "Passport",
          "ProfileFullImage",
        ];
        fileFlags.forEach((flag) => {
          const fileData = imageData?.[flag as keyof typeof imageData];
          if (fileData && fileData.file) {
            const formData = new FormData();
            formData.append("file", fileData.file);
            formData.append("modulename", fileData.modulename);
            formData.append("moduleid", staffAddData.data.staffID);
            formData.append("section", fileData.section);
            dispatch(singleFileUpload(formData));
          }
        });
      }
      setActiveStep(1);
      dispatch(clearAddState());
    } else if (staffAddData && staffAddData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    } else if (staffAddData && staffAddData.code === 409) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [staffAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleFileChange = (
    file: File | null,
    flag: string,
    modulename: string,
    moduleId: string
  ) => {
    if (!file) return;
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      profileImage:
        flag === DROPZONE_IMAGE_FLAG.PROFILES ? "" : prevErrors.profileImage,
      iDdocumentImage:
        flag === DROPZONE_IMAGE_FLAG.ID_DOCUMENT
          ? ""
          : prevErrors.iDdocumentImage,
      passportPdf:
        flag === DROPZONE_IMAGE_FLAG.PASSPORT ? "" : prevErrors.passportPdf,
      heroImage:
        flag === DROPZONE_IMAGE_FLAG.HERO_PROFILE ? "" : prevErrors.heroImage,
    }));
    setImageData((prevData: any) => ({
      ...prevData,
      [flag]: {
        file,
        modulename,
        moduleId,
        section: flag,
      },
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormData((prevData: any) => ({
        ...prevData,
        profileImage:
          flag === DROPZONE_IMAGE_FLAG.PROFILES
            ? result
            : prevData.profileImage,
        iDdocumentImage:
          flag === DROPZONE_IMAGE_FLAG.ID_DOCUMENT
            ? file.name
            : prevData.iDdocumentImage,
        passportPdf:
          flag === DROPZONE_IMAGE_FLAG.PASSPORT
            ? file.name
            : prevData.passportPdf,
        heroImage:
          flag === DROPZONE_IMAGE_FLAG.HERO_PROFILE
            ? result
            : prevData.heroImage,
      }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (parsedData.PersonalInformation && !staffEditId) {
      // Get attachments from editStaffData
      const heroImageAttachment = _.find(
        editStaffData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "profilefullimage"
      );

      const profileImageAttachment = _.find(
        editStaffData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "profileimage"
      );

      const passportAttachment = _.find(
        editStaffData?.attachmentList,
        (attachment) => attachment.documentSection?.toLowerCase() === "passport"
      );

      const iDDocumentAttachment = _.find(
        editStaffData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "iddocument"
      );

      setFormData((formData: any) => ({
        ...formData,
        profileImage:
          profileImageAttachment?.filePath || parsedData.profileImage || "",
        heroImage: heroImageAttachment?.filePath || parsedData.heroImage || "",
        passportPdf:
          passportAttachment?.fileName || parsedData.passportPdf || "",
        iDdocumentImage:
          iDDocumentAttachment?.fileName || parsedData.iDdocumentImage || "",

        firstName: parsedData.PersonalInformation.firstName || "",
        surname: parsedData.PersonalInformation.surname || "",
        gender: parsedData.PersonalInformation.gender?.toLowerCase() || "",
        role: parsedData.PersonalInformation.role || "",
        nationality: parsedData.PersonalInformation.nationality || "",
        dob: formatDates(parsedData.PersonalInformation.dob),
        placeOfBirth: parsedData.PersonalInformation.placeOfBirth || "",
        passportNo: parsedData.PersonalInformation.passportNo || "",
        emiratesID: parsedData.PersonalInformation.emiratesID || "",
        age: parsedData.PersonalInformation.age || "",
        middleName: parsedData.PersonalInformation.middleName || "",
        height: parsedData.PersonalInformation.height || "",
        weight: parsedData.PersonalInformation.weight || "",
        passportExpirationDate: formatDates(
          parsedData.PersonalInformation.passportExpirationDate
        ),
        emiratesExpiryDate: formatDates(
          parsedData.PersonalInformation.emiratesExpiryDate
        ),
        languagesSpoken: parsedData.PersonalInformation.languagesSpoken || "",
        otherStaff: parsedData.PersonalInformation.otherStaff || "",
      }));
      setSelectedNationalityOption({
        label: editStaffData?.nationalityText || "",
        value: allData?.PersonalInformation?.nationality || "",
      });
      const languagesSpoken = editStaffData.languagesSpoken || "";
      const selOption: any = _.filter(
        languageOptions,
        (x: any) => x.value && _.includes(languagesSpoken.split(","), x.value.toString())
      );
      setSelectedLanguageOption(selOption);
      setOtherStaffShow(parsedData.otherStaffShowValue);
    }
  }, [editStaffData]);

  useEffect(() => {
    if (staffAndAthleteIdData && !staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        firstName: staffAndAthleteIdData.firstName || "",
        middleName: staffAndAthleteIdData.middleName || "",
        surname: staffAndAthleteIdData.lastName || "",
        gender: staffAndAthleteIdData.gender.toLowerCase() || "",
        // nationality: staffAndAthleteIdData.nationalityCode || "",
        dob: formatDates(staffAndAthleteIdData.dob),
        passportNo: staffAndAthleteIdData.passportNumber || "",
        emiratesID: staffAndAthleteIdData.emiratesID || "",
        age: staffAndAthleteIdData.age || "",
        passportExpirationDate: formatDates(
          staffAndAthleteIdData.passportExpDate
        ),
      }));
      // setSelectedNationalityOption({
      //   label: staffAndAthleteIdData?.nationality || "",
      //   value: staffAndAthleteIdData?.nationalityCode || "",
      // });
      setShowField(true);
    }
  }, [staffAndAthleteIdData]);

  useEffect(() => {
    if (editStaffData && staffEditId) {
      const profileImageAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "profileimage"
      );
      const heroImageAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "profilefullimage"
      );
      const passportAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "passport"
      );
      const iDDocumentAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "iddocument"
      );
      setFormData((formData: any) => ({
        ...formData,
        profileImage: profileImageAttachment?.filePath,
        heroImage: heroImageAttachment?.filePath || "",
        firstName: editStaffData.firstName || "",
        middleName: editStaffData.middleName || "",
        passportPdf: passportAttachment?.fileName || "",
        iDdocumentImage: iDDocumentAttachment?.fileName || "",
        surname: editStaffData.surname || "",
        gender: editStaffData.gender || "",
        role: editStaffData.role || "",
        nationality: editStaffData.nationality || "",
        dob: formatDates(editStaffData.dob),
        placeOfBirth: editStaffData.placeOfBirth || "",
        passportNo: editStaffData.passportNo || "",
        emiratesID: editStaffData.emiratesID || "",
        age: editStaffData.age || "",
        height: editStaffData.height || "",
        weight: editStaffData.weight || "",
        passportExpirationDate: formatDates(
          editStaffData.passportExpirationDate
        ),
        emiratesExpiryDate: formatDates(editStaffData.emiratesExpiryDate),
        languagesSpoken: editStaffData.languagesSpoken || "",
        otherStaff: editStaffData.otherStaff || "",
      }));
      setSelectedNationalityOption({
        label: editStaffData?.nationalityText || "",
        value: editStaffData?.nationalityCode || "",
      });
      const languagesSpoken = editStaffData.languagesSpoken || "";
      const selOption: any = _.filter(
        languageOptions,
        (x: any) => x.value && _.includes(languagesSpoken.split(","), x.value.toString())
      );
      setSelectedLanguageOption(selOption);
      setShowField(true);
    }
  }, [editStaffData]);

  console.log("editStaffData", editStaffData)

  useEffect(() => {
    if (singleUploadData && singleUploadData.code === 200) {
      const payload: any = {
        staffID: parsedData.staffID
          ? parsedData.staffID
          : staffEditId || editStaffData?.staffID,
        sportID: teamId,
      };
      dispatch(editStaff(payload));
      dispatch(clearState());
    }
  }, [singleUploadData]);

  useEffect(() => {
    if (fileDelete && fileDelete.code === 200) {
      const payload: any = {
        staffID: parsedData.staffID
          ? parsedData.staffID
          : staffEditId || editStaffData?.staffID,
        sportID: teamId,
      };
      dispatch(editStaff(payload));
      dispatch(clearDeletFileState());
    }
  }, [fileDelete]);

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
    const fieldMap: Record<string, string> = {
      passport: "passportPdf",
      iddocument: "iDdocumentImage",
      profileImage: "profileImage",
      profileFullImage: "heroImage",
    };

    const fileID = editStaffData?.attachmentList?.find(
      (item: any) =>
        item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    if (fileID) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,

        fileID: fileID,
      };
      dispatch(deleteFile(data));
      setFormData((prev: any) => ({
        ...prev,
        [fieldMap[fileType]]: "",
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [fieldMap[fileType]]: "",
      }));
    }
  };

  const langOnchange = (event: any) => {
    const {
      target: { value },
    } = event;
    const selectedLanguages = value as string[];
    setFormData({
      ...formData,
      languagesSpoken: selectedLanguages.join(","),
    });
    setErrors({
      ...errors,
      languagesSpoken: "",
    });
  };

  const handleDelete = (language: string) => {
    const updatedLanguages = formData.languagesSpoken
      .split(",")
      .filter((item: any) => item.trim() !== language.trim())
      .join(",");
    setFormData({
      ...formData,
      languagesSpoken: updatedLanguages,
    });
  };

  const rolesChange = (event: any) => {
    const selectedRoleID = event.target.value as string;
    const selectedRole = rolesListData.data.find(
      (option: any) => option.roleID === selectedRoleID
    );
    if (selectedRole?.roleName === "Other Staff") {
      setFormData({ ...formData, role: event.target.value });
      setErrors({
        ...errors,
        role: "",
      });
      setOtherStaffShow(selectedRole?.roleName);
    } else {
      setFormData({ ...formData, role: event.target.value, otherStaff: "" });
      setErrors({
        ...errors,
        role: "",
        otherStaff: "",
      });
      setOtherStaffShow(selectedRole?.roleName);
    }
  };

  const handleChangeNationality = (selectedOption: any | null): void => {
    setSelectedNationalityOption(selectedOption);
    setFormData({
      ...formData,
      nationality: selectedOption?.value,
    });
    setErrors({
      ...errors,
      nationality: "",
    });
  };

  const [languageOptions, setLanguageOptions] = useState<any>([]);

  useEffect(() => {
    const languageData = getLanguageOptions(names);
    setLanguageOptions(languageData);
  }, []);

  const getLanguageOptions = (languageList: string[]) => {
    const options = languageList.map((lang) => ({
      label: lang,
      value: lang,
    }));
    return options;
  };

  const handleChangeLanguage = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = selectedOption.map((option: any) => option.value).join(",");
      setFormData({ ...formData, languagesSpoken: selectedValues });
      setSelectedLanguageOption(selectedOption);
    } else {
      setFormData({ ...formData, languagesSpoken: "" });
      setSelectedLanguageOption([]);
    }
  };

  const nationalityData = getNationality && getNationality?.data;
  useEffect(() => {
    const nationality: any = getDefaultOption(nationalityData);
    setNationalityOption(nationality);
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

  const closeAdd = () => {
    if (staffEditId) {
      onClose();
      dispatch(clearStaffEditState());
    } else {
      setDialogOpen(true);
    }
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
            <form onSubmit={handleSubmit(onSubmit)}>
              {previewUrl && (
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: "200px", height: "auto" }}
                  />
                  <button>Remove Image</button>
                </div>
              )}
              {showBanner &&
                staffAddData &&
                !_.isEmpty(staffAddData.message) && (
                  <Snackbar
                    open={showBanner}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      variant="filled"
                      className="dubai-med"
                    >
                      {staffAddData && staffAddData.message}
                    </Alert>
                  </Snackbar>
                )}
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={5.75}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="start"
                    alignItems="center"
                  >
                    <Grid item>
                      <Stack alignItems="flex-start">
                        <div className="avatarContainer">
                          <Avatar
                            src={formData.profileImage || "/broken-image.jpg"}
                            className="avatar"
                          />
                          <IconButton className="iconButton" component="label">
                            <CameraAltIcon className="cameraIcon" />
                            <FileUpload
                              onFileChange={(
                                file: any,
                                flag: any,
                                modulename: any,
                                moduleId: any
                              ) =>
                                handleFileChange(
                                  file,
                                  flag,
                                  modulename,
                                  moduleId
                                )
                              }
                              formatType={FILE_FORMAT_TYPE}
                              type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                              flag={DROPZONE_IMAGE_FLAG.PROFILES}
                              moduleId={
                                (parsedData && parsedData.staffID) ||
                                staffEditId
                              }
                              modulename="Staff"
                              setData={setFormData}
                              formData={formData}
                              // fetchDataApi={() => dispatch(editStaff(filepayload))}
                              isNoapicall={true}
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
                        {formData.profileImage && (
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
                                handleDeleteFile(
                                  "Staff",
                                  parsedData.staffID || staffEditId,
                                  "profileImage"
                                );
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
                <Grid item xs={12} md={5.75}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="start"
                    alignItems="center"
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
                              ) =>
                                handleFileChange(
                                  file,
                                  flag,
                                  modulename,
                                  moduleId
                                )
                              }
                              formatType={FILE_FORMAT_TYPE}
                              type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                              flag={DROPZONE_IMAGE_FLAG.HERO_PROFILE}
                              moduleId={
                                (parsedData && parsedData.staffID) ||
                                staffEditId
                              }
                              modulename="Staff"
                              setData={setFormData}
                              formData={formData}
                              isNoapicall={true}
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
                          sx={{ fontSize: "11px", color: "#00426A" }}
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
                                handleDeleteFile(
                                  "Staff",
                                  parsedData.staffID || staffEditId,
                                  "profileFullImage"
                                );
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
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    First Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="firstName"
                    placeholder="Enter First Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={showField && formData.firstName}
                  />
                  {errors.firstName && (
                    <Typography variant="caption" className="error-message">
                      {errors.firstName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Middle Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="middleName"
                    placeholder="Enter Middle name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.middleName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={showField && formData.middleName}
                  />
                  {errors.middleName && (
                    <Typography variant="caption" className="error-message">
                      {errors.middleName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Surname <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="surname"
                    placeholder="Enter surname"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.surname}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={showField && formData.surname}
                  />
                  {errors.surname && (
                    <Typography variant="caption" className="error-message">
                      {errors.surname}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Select Gender <span className="asterisk">*</span>
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="male"
                        control={
                          <Radio
                            disabled={Boolean(showField && formData.gender)}
                          />
                        }
                        label="Male"
                      />
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="female"
                        control={<Radio disabled={Boolean(showField && formData.gender)} />}
                        label="Female"
                      />
                    </RadioGroup>
                    {errors.gender && (
                      <Typography variant="caption" className="error-message">
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Role to be assigned <span className="asterisk">*</span>
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.role}
                      name="role"
                      onChange={rolesChange}
                      displayEmpty
                      className="Text-field-customise"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 5 + 8,
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
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
                          Select Role
                        </Typography>
                      </MenuItem>
                      {rolesListData &&
                        rolesListData.data?.map((option: any) => (
                          <MenuItem key={option.roleID} value={option.roleID}>
                            <Typography
                              variant="body1"
                              color="textPrimary"
                              className="dubai-med"
                            >
                              {option.roleName}
                            </Typography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {errors.role && (
                    <Typography variant="caption" className="error-message">
                      {errors.role}
                    </Typography>
                  )}
                  {otherStaffShow === "Other Team Staff" ? (
                    <Box mt={1}>
                      <CustomTextField
                        name="otherStaff"
                        placeholder="Enter Staff Role"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={formData.otherStaff}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 50 }}
                        onKeyPress={(e) => {
                          if (!REGEX.TEXT.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.otherStaff && (
                        <Typography variant="caption" className="error-message">
                          {errors.otherStaff}
                        </Typography>
                      )}
                    </Box>
                  ) : null}
                </Grid>
                <Grid container item xs={12} md={5.75} spacing={1}>
                  <Grid item xs={9}>
                    <Box>
                      <CustomDatePicker
                        control={control}
                        name="dob"
                        label="Date of Birth"
                        defaultValue={formData && formData.dob}
                        boxmb={0.8}
                        required={true}
                        minDate={moment("1950-01-01")}
                        maxDate={moment().subtract(18, "years")}
                        onChange={dateChange}
                        className="Text-field-customise"
                        disabled={showField && formData.dob}
                      />
                    </Box>
                    {errors.dob && (
                      <Typography variant="caption" className="error-message">
                        {errors.dob}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Age
                    </Typography>
                    <CustomTextField
                      name="age"
                      placeholder="Enter Age"
                      type="text"
                      variant="outlined"
                      fullWidth
                      value={formData.age}
                      disabled
                      className="Text-field-customise"
                    />
                    {errors.age && (
                      <Typography variant="caption" className="error-message">
                        {errors.age}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Place of Birth
                  </Typography>
                  <CustomTextField
                    name="placeOfBirth"
                    placeholder="Enter Place of Birth"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 20 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.placeOfBirth && (
                    <Typography variant="caption" className="error-message">
                      {errors.placeOfBirth}
                    </Typography>
                  )}
                </Grid>
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
                      inputProps={{ maxLength: 6 }}
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
                            "& .MuiInputAdornment-root": {
                              height: "100%",
                            },
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
                      onKeyPress={(e: any) => {
                        if (!REGEX.WEIGHT.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{ maxLength: 6 }}
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
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Nationality <span className="asterisk">*</span>
                  </Typography>
                  <ReactSelect
                    name="nationality"
                    id="nationality"
                    classNamePrefix="select"
                    handleChangeReactSelect={handleChangeNationality}
                    options={NationalityOption}
                    value={
                      SelectedNationalityOption &&
                        SelectedNationalityOption.label === ""
                        ? null
                        : SelectedNationalityOption
                    }
                    // isDisabled={showField && formData.nationality}
                    placeholder={"Select Nationality"}
                    isClearable={true}
                  />
                  {errors.nationality && (
                    <Typography variant="caption" className="error-message">
                      {errors.nationality}
                    </Typography>
                  )}
                </Grid>
                <Grid container item xs={12} md={5.75} spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Passport Number
                    </Typography>
                    <CustomTextField
                      name="passportNo"
                      placeholder="Enter Passport Number"
                      type="tel"
                      variant="outlined"
                      fullWidth
                      value={formData.passportNo}
                      onChange={handleChange}
                      className="Text-field-customise"
                      inputProps={{ maxLength: 20 }}
                      disabled={showField && formData.passportNo}
                      onKeyPress={(e) => {
                        if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomDatePicker
                      control={control}
                      name="passportExpirationDate"
                      label="Passport Expiry Date"
                      defaultValue={formData && formData.passportExpirationDate}
                      disabled={showField && formData.passportExpirationDate}
                      boxmb={0.8}
                      required={false}
                      minDate={moment().subtract(10, "years")}
                      maxDate={moment().add(10, "years")}
                      onChange={datePickerChange}
                      className="Text-field-customise"
                    />
                    {errors.passportExpirationDate && (
                      <Typography
                        variant="caption"
                        className="error-message"
                        ml={2}
                      >
                        {errors.passportExpirationDate}
                      </Typography>
                    )}
                  </Grid>

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
                          ) =>
                            handleFileChange(file, flag, modulename, moduleId)
                          }
                          formatType={PDF_FORMAT}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          flag={DROPZONE_IMAGE_FLAG.PASSPORT}
                          setData={setFormData}
                          formData={formData}
                          modulename="Staff"
                          moduleId={parsedData.staffID || staffEditId}
                          fileInputRef={filepassRef}
                          isNoapicall={true}
                        />
                        <AttachFileSharpIcon />
                      </IconButton>
                    </Grid>
                    <Grid>
                      <Box display="flex" alignItems="center">
                        <Typography
                          align="center"
                          className="dubai-med upload-label"
                          onClick={handlepassClick}
                          style={{
                            cursor: "pointer",
                            color: "#00426A",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "400px",
                          }}
                        >
                          {formData.passportPdf ? (
                            <>{formData.passportPdf}</>
                          ) : (
                            <>
                              Upload Passport (PDF){" "}
                              <span
                                className="asterisk"
                                style={{ color: "#d32f2f", fontSize: "19px" }}
                              >
                                *
                              </span>
                            </>
                          )}
                        </Typography>
                        {formData.passportPdf && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => {
                              handleDeleteFile(
                                "Staff",
                                parsedData.staffID || staffEditId,
                                "passport"
                              );
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
                  {errors.passportPdf && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      ml={2}
                    >
                      {errors.passportPdf}
                    </Typography>
                  )}
                </Grid>
                <Grid container item xs={12} md={5.75} spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Emirates ID Number
                    </Typography>
                    <CustomTextField
                      name="emiratesID"
                      placeholder="Enter Emirates ID Number"
                      type="tel"
                      variant="outlined"
                      fullWidth
                      value={formData.emiratesID}
                      disabled={showField && formData.emiratesID}
                      onChange={handleChange}
                      className="Text-field-customise"
                      inputProps={{ maxLength: 20 }}
                      onKeyPress={(e) => {
                        if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomDatePicker
                      control={control}
                      name="emiratesExpiryDate"
                      label="EID Expiry Date"
                      defaultValue={formData && formData.emiratesExpiryDate}
                      boxmb={0.8}
                      required={false}
                      minDate={moment().subtract(10, "years")}
                      maxDate={moment().add(10, "years")}
                      onChange={datePickerChange}
                      className="Text-field-customise"
                    />
                    {errors.emiratesExpiryDate && (
                      <Typography
                        variant="caption"
                        className="error-message"
                        ml={2}
                      >
                        {errors.emiratesExpiryDate}
                      </Typography>
                    )}
                  </Grid>
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
                          ) =>
                            handleFileChange(file, flag, modulename, moduleId)
                          }
                          formatType={FILE_FORMAT_PDF_IMAGE}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          flag={DROPZONE_IMAGE_FLAG.ID_DOCUMENT}
                          modulename="Staff"
                          moduleId={parsedData.staffID || staffEditId}
                          setData={setFormData}
                          formData={formData}
                          fileInputRef={fileIDRef}
                          isNoapicall={true}
                        />
                        <AttachFileSharpIcon />
                      </IconButton>
                    </Grid>
                    <Grid>
                      <Box display="flex" alignItems="center">
                        <Typography
                          align="center"
                          className="dubai-med upload-label"
                          onClick={handleIdClick}
                          style={{
                            cursor: "pointer",
                            color: "#00426A",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "400px",
                          }}
                        >
                          {formData.iDdocumentImage ? (
                            <>{formData.iDdocumentImage}</>
                          ) : (
                            <>
                              Upload Emirates ID Document (JPEG, PNG, PDF){" "}
                              <span
                                className="asterisk"
                                style={{ color: "#d32f2f", fontSize: "19px" }}
                              >
                                *
                              </span>
                            </>
                          )}
                        </Typography>
                        {formData.iDdocumentImage && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => {
                              handleDeleteFile(
                                "Staff",
                                parsedData.staffID || staffEditId,
                                "iddocument"
                              );
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
                  {errors.iDdocumentImage && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      ml={1}
                    >
                      {errors.iDdocumentImage}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Languages Spoken <span className="asterisk">*</span>
                  </Typography>
                  <CustomReactDropown
                    name="languagesSpoken"
                    id="languagesSpoken"
                    classNamePrefix="select"
                    handleChangeReactSelect={handleChangeLanguage}
                    options={languageOptions}
                    value={
                      SelectedLanguageOption &&
                        SelectedLanguageOption.label === ""
                        ? null
                        : SelectedLanguageOption
                    }
                    placeholder={"Select Languages"}
                    isClearable={true}
                    isMulti={true}
                  />

                  {errors.languagesSpoken && (
                    <Typography variant="caption" className="error-message">
                      {errors.languagesSpoken}
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
                {!showCancelButton && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      mr: 1,
                    }}
                    onClick={() => {
                      closeAdd();
                    }}
                    className="cancel-button text-capitalize dubai-med"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  className="save-continue-button text-capitalize dubai-med"
                  disabled={staffAddData.loading}
                >
                  {staffAddData.loading
                    ? "Loading..."
                    : staffEditId
                      ? "Update"
                      : "Save & Continue"}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default PersonalInformation;

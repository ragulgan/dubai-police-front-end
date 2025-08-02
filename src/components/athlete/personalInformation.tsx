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
  Select,
  Chip,
  MenuItem,
  Theme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import FileUpload from "@/utils/dropzone";
import { useRouter } from "next/navigation";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  addAthlete,
  clearAddAthleteState,
} from "@/redux/slices/athlete/athleteAddSlice";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_PDF_IMAGE,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
} from "@/utils/constants";
import { PersonalFormValidation } from "@/utils/athletes/validation";
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
    editAthleteData,
    teamId,
    editPayload,
    setDialogOpen,
    showCancelButton,
    staffAndAthleteIdData,
    athleteEditId,
    onClose,
  } = props;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const athleteAddData = useSelector((state: RootState) => state.athleteAdd);
  const [formData, setFormData] = useState<any>({
    profileImage: "",
    ProfileFullImage: "",
    firstName: "",
    middleName: "",
    surname: "",
    gender: "",
    nationality: "",
    dob: "",
    placeOfBirth: "",
    passportNo: "",
    passportPdf: "",
    emiratesID: "",
    iDdocumentImage: "",
    passportExpirationDate: "",
    age: 0,
    languagesSpoken: "",
    emiratesExpiryDate: "",
  });
  const [errors, setErrors] = useState<any>({});
  const { validate } = PersonalFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const [birthDate, setBirthDate] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [imageData, setImageData] = useState<any>(null);
  const filepassRef = useRef<HTMLInputElement>(null);
  const fileIDRef = useRef<HTMLInputElement>(null);
  const getSportID = getLocalStorage("sport");
  const getNationality = useSelector((state: any) => state.listNationality);
  const [NationalityOption, setNationalityOption] = useState();
  const [SelectedNationalityOption, setSelectedNationalityOption] =
    useState<any>(null);
  const [showField, setShowField] = useState<any>(false);
  const [SelectedLanguageOption, setSelectedLanguageOption] =
    useState<any>(null);
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const fileDelete = useSelector((state: any) => state && state.fileDelete);

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

  useEffect(() => {
    dispatch(getNationalityListAPI());
  }, []);

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
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
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

  const passportExpireChange = (data: any) => {
    const passportExpirationDate = data.value
      ? moment(data.value).toISOString()
      : "";
    if (passportExpirationDate) {
      setFormData((prevData: any) => ({
        ...prevData,
        passportExpirationDate: data.value,
      }));
    }
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
    });
  };

  const formatDate = (date: string | undefined) =>
    date ? moment(date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";

  const [languageOptions, setLanguageOptions] = useState<any>([]);

  useEffect(() => {
    const languageData = getLanguageOptions(names); // names is your language list
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

  const onSubmit = async () => {
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const {
        iDdocumentImage,
        passportPdf,
        profileImage,
        ProfileFullImage,
        ...rest
      } = formData;
      const trimmedRest = trimFormData(rest);
      if ((parsedData && parsedData.athleteID) || athleteEditId) {
        let data = {
          ...trimmedRest,
          dob: formatDate(formData.dob),
          passportExpirationDate: formatDate(formData.passportExpirationDate),
          age: Number(formData.age) || 0,
          sportID: +getSportID,

          athleteID: parsedData.athleteID || athleteEditId,
          section: "personaldetails",
        };
        data.role = 17;
        dispatch(addAthlete({ url: "/UpdateAthleteByID", payload: data }));
      } else {
        const data = {
          ...trimmedRest,
          dob: formatDate(formData.dob),
          passportExpirationDate: formatDate(formData.passportExpirationDate),
          age: Number(formData.age) || 0,
          sportID: +getSportID,
        };
        dispatch(addAthlete({ url: "/InsertAthlete", payload: data }));
      }
    }
  };

  useEffect(() => {
    if (athleteAddData && athleteAddData.code === 200) {
      setShowBanner(false);
      const {
        iDdocumentImage,
        passportPdf,
        profileImage,
        ProfileFullImage,
        ...rest
      } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        PersonalInformation: rest,
        athleteID: athleteAddData.data.athleteID,
      }));
      if (!_.isEmpty(imageData)) {
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
            formData.append("moduleid", athleteAddData.data.athleteID);
            formData.append("section", fileData.section);
            dispatch(singleFileUpload(formData));
          }
        });
      }
      setActiveStep(1);
      dispatch(clearAddAthleteState());
      dispatch(editAthlete(editPayload));
    } else if (athleteAddData && athleteAddData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddAthleteState());
        setShowBanner(false);
      }, 3000);
    } else if (athleteAddData && athleteAddData.code === 409) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddAthleteState());
        setShowBanner(false);
      }, 3000);
    }
  }, [athleteAddData]);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData((prevData: any) => ({
          ...prevData,
          profileImage:
            flag === DROPZONE_IMAGE_FLAG.PROFILES
              ? result
              : prevData.profileImage,
          ProfileFullImage:
            flag === DROPZONE_IMAGE_FLAG.HEROIMAGE
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
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (staffAndAthleteIdData && !athleteEditId) {
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
    if (parsedData.PersonalInformation && !athleteEditId) {
      const profileImageAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "profileimage"
      );

      const passportAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) => attachment.documentSection?.toLowerCase() === "passport"
      );

      const iDDocumentAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "iddocument"
      );

      const profileFullImageAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "profilefullimage"
      );

      setFormData((formData: any) => ({
        ...formData,

        // Images and files - prefer attachment, fallback to parsedData
        profileImage:
          profileImageAttachment?.filePath || parsedData.profileImage || "",
        ProfileFullImage:
          profileFullImageAttachment?.filePath ||
          parsedData.ProfileFullImage ||
          "",
        passportPdf:
          passportAttachment?.fileName || parsedData.passportPdf || "",
        iDdocumentImage:
          iDDocumentAttachment?.fileName || parsedData.iDdocumentImage || "",

        // Basic fields
        firstName: parsedData.PersonalInformation.firstName || "",
        middleName: parsedData.PersonalInformation.middleName || "",
        surname: parsedData.PersonalInformation.surname || "",
        gender: parsedData.PersonalInformation.gender || "",
        placeOfBirth: parsedData.PersonalInformation.placeOfBirth || "",
        passportNo: parsedData.PersonalInformation.passportNo || "",
        emiratesID: parsedData.PersonalInformation.emiratesID || "",
        age: parsedData.PersonalInformation.age || "",
        nationality: parsedData.PersonalInformation.nationality || "",
        passportExpirationDate: formatDates(
          parsedData.PersonalInformation.passportExpirationDate
        ),
        dob: formatDates(parsedData.PersonalInformation.dob),
        languagesSpoken: parsedData.PersonalInformation.languagesSpoken || "",
        emiratesExpiryDate: formatDates(
          parsedData.PersonalInformation.emiratesExpiryDate
        ),
      }));

      setBirthDate(editAthleteData?.dob || "");
      setSelectedNationalityOption({
        label: editAthleteData?.nationalityText || "",
        value: allData?.PersonalInformation?.nationality || "",
      });
      const languagesSpoken = editAthleteData.languagesSpoken || "";
      const selOption: any = _.filter(
        languageOptions,
        (x: any) => x.value && _.includes(languagesSpoken.split(","), x.value.toString())
      );
      setSelectedLanguageOption(selOption);
    }
  }, [editAthleteData]);

  useEffect(() => {
    if (editAthleteData && athleteEditId) {
      const profileImageAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "profileimage"
      );

      const passportAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) => attachment.documentSection?.toLowerCase() === "passport"
      );

      const iDDocumentAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "iddocument"
      );

      const profileFullImageAttachment = _.find(
        editAthleteData?.attachmentList,
        (attachment) =>
          attachment.documentSection?.toLowerCase() === "profilefullimage"
      );
      setFormData((formData: any) => ({
        ...formData,
        // Images and files - prefer attachment, fallback to parsedData
        profileImage:
          profileImageAttachment?.filePath || parsedData.profileImage || "",
        ProfileFullImage:
          profileFullImageAttachment?.filePath ||
          parsedData.ProfileFullImage ||
          "",
        passportPdf:
          passportAttachment?.fileName || parsedData.passportPdf || "",
        iDdocumentImage:
          iDDocumentAttachment?.fileName || parsedData.iDdocumentImage || "",

        firstName: editAthleteData.firstName || "",
        middleName: editAthleteData.middleName || "",
        surname: editAthleteData.surname || "",
        gender: editAthleteData.gender || "",
        placeOfBirth: editAthleteData.placeOfBirth || "",
        passportNo: editAthleteData.passportNo || "",
        emiratesID: editAthleteData.emiratesID || "",
        age: editAthleteData.age || "",
        nationality: editAthleteData.nationality || "",
        passportExpirationDate: formatDates(
          editAthleteData.passportExpirationDate
        ),
        dob: formatDates(editAthleteData.dob),
        languagesSpoken: editAthleteData.languagesSpoken || "",
        emiratesExpiryDate: formatDates(editAthleteData.emiratesExpiryDate),
      }));
      setBirthDate(editAthleteData?.dob);
      setSelectedNationalityOption({
        label: editAthleteData?.nationalityText || "",
        value: editAthleteData.nationality || "",
      });
      const languagesSpoken = editAthleteData.languagesSpoken || "";
      const selOption: any = _.filter(
        languageOptions,
        (x: any) => x.value && _.includes(languagesSpoken.split(","), x.value.toString())
      );
      setSelectedLanguageOption(selOption);
      setShowField(true);
    }
  }, [editAthleteData]);

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
      ProfileFullImage: "ProfileFullImage",
    };
    const fileID = editAthleteData?.attachmentList?.find(
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

  const closeAdd = () => {
    if (athleteEditId) {
      onClose();
    } else {
      setDialogOpen(true);
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

  useEffect(() => {
    if (singleUploadData && singleUploadData.code === 200) {
      const payload: any = {
        athleteID: parsedData.athleteID
          ? parsedData.athleteID
          : athleteEditId || editAthleteData?.athleteID,
        sportID: teamId,
      };
      dispatch(editAthlete(payload));
      dispatch(clearState());
    }
  }, [singleUploadData]);

  useEffect(() => {
    if (fileDelete && fileDelete.code === 200) {
      const payload: any = {
        athleteID: parsedData.athleteID
          ? parsedData.athleteID
          : athleteEditId || editAthleteData?.athleteID,
        sportID: teamId,
      };
      dispatch(editAthlete(payload));
      dispatch(clearDeletFileState());
    }
  }, [fileDelete]);

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
              athleteAddData &&
              !_.isEmpty(athleteAddData.message) && (
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
                    {athleteAddData && athleteAddData.message}
                  </Alert>
                </Snackbar>
              )}
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid
                container
                spacing={1}
                justifyContent="start"
                alignItems="center"
                item
                xs={12}
                md={5.75}
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
                            handleFileChange(file, flag, modulename, moduleId)
                          }
                          formatType={FILE_FORMAT_TYPE}
                          type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                          flag={DROPZONE_IMAGE_FLAG.PROFILES}
                          moduleId={
                            (parsedData && parsedData.athleteID) ||
                            athleteEditId
                          }
                          modulename="Athlete"
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
                      Upload Profile Picture
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
                              "Athlete",
                              parsedData?.athleteID,
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
              <Grid
                container
                spacing={1}
                justifyContent="start"
                alignItems="center"
                item
                xs={12}
                md={5.75}
                mb={2}
              >
                <Grid item>
                  <Stack alignItems="flex-start">
                    <div className="hero-avatarContainer">
                      <Avatar
                        src={formData.ProfileFullImage || "/broken-image.jpg"}
                        className="avatar"
                      // style={{ borderRadius: '8px'}}
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
                            handleFileChange(file, flag, modulename, moduleId)
                          }
                          formatType={FILE_FORMAT_TYPE}
                          type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                          flag={DROPZONE_IMAGE_FLAG.HEROIMAGE}
                          moduleId={
                            (parsedData && parsedData.athleteID) ||
                            athleteEditId
                          }
                          modulename="Athlete"
                          setData={setFormData}
                          formData={formData}
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
                    {formData.ProfileFullImage && (
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
                              "Athlete",
                              parsedData?.athleteID,
                              "ProfileFullImage"
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
                  inputProps={{ maxLength: 100 }}
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
                  placeholder="Enter First Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.middleName}
                  disabled={showField && formData.middleName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
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
                  disabled={showField && formData.surname}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
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
                      control={
                        <Radio
                          disabled={Boolean(showField && formData.gender)}
                        />
                      }
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
              <Grid container item xs={12} md={5.75} spacing={1}>
                <Grid item xs={10}>
                  <Box>
                    <CustomDatePicker
                      control={control}
                      name="dob"
                      label="Date of Birth"
                      defaultValue={formData.dob}
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(50, "years")}
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
                <Grid item xs={2}>
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
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
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
                        ) => handleFileChange(file, flag, modulename, moduleId)}
                        formatType={FILE_FORMAT_PDF_IMAGE}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.ID_DOCUMENT}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID || athleteEditId}
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
                          <>Upload Emirates ID Document (JPEG, PNG, PDF)</>
                        )}
                      </Typography>
                      {formData.iDdocumentImage && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData.athleteID || athleteEditId,
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
                    disabled={showField && formData.passportNo}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 20 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.passportNo && (
                    <Typography variant="caption" className="error-message">
                      {errors.passportNo}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomDatePicker
                    control={control}
                    name="passportExpirationDate"
                    label="Passport Expiry Date"
                    defaultValue={formData && formData.passportExpirationDate}
                    boxmb={0.8}
                    required={false}
                    minDate={moment().subtract(10, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={passportExpireChange}
                    className="Text-field-customise"
                    disabled={showField && formData.passportExpirationDate}
                  />
                  {errors.passportExpirationDate && (
                    <Typography variant="caption" className="error-message">
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
                        ) => handleFileChange(file, flag, modulename, moduleId)}
                        formatType={FILE_FORMAT_TYPE_DOCUMENT}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.PASSPORT}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID || athleteEditId}
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
                          <>Upload Passport (PDF)</>
                        )}
                      </Typography>
                      {formData.passportPdf && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "Passport"
                            );
                            setFormData((prev: any) => ({
                              ...prev,
                              passportPdf: "",
                            }));
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
                  // isDisabled={showField && formData.languagesSpoken}
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
                  sx={{ mr: 1 }}
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
                disabled={athleteAddData.loading}
              >
                {athleteAddData.loading
                  ? "Loading..."
                  : athleteEditId
                    ? "Update"
                    : "Save & Continue"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default PersonalInformation;

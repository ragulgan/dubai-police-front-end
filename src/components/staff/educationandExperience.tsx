"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
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
  Fade,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { debounce } from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { getLocalStorage, trimFormData } from "@/utils/helper";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { EducationFormValidation } from "@/utils/staffs/validation";
import {
  addAcademicQualification,
  clearAddAcademicState,
} from "@/redux/slices/athlete/athleteAcademicQualification";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import {
  clearAcademicQualificationDeleteState,
  DeleteAcademicQualificationByID,
} from "@/redux/slices/athlete/deleteAcademicQualification";
import {
  academicFileUpload,
  clearAcademicFileUploadState,
} from "@/redux/slices/fileupload/academicFileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileDownload from "@/components/FileDownload ";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DropDown from "../Fields/DropDown";
import { useForm } from "react-hook-form";
import {
  clearStaffAndAthleteFileDeleteState,
  deleteStaffAndAthleteFile,
} from "@/redux/slices/staffAndAthlete/StaffAndAthleteFileDeleteSlice";

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
  "& textarea::placeholder": {
    color: "#58585B",
    opacity: 1,
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

interface FormData {
  fieldOfStudy: string;
  assignedAthletesOrTeams: string;
  coachingExperience: string;
  previousAthleteExperience: string;
  achievementsAsCoach: string;
  organizationalSkills: string;
  leadershipSkills: string;
  punctualityInMeetings: string;
  availabilityOnTraining: string;
  uploadCertificate: string;
  notesAdditionalInfo: string;
  computerSkills: string;
}

const EducationandExperience = (props: any) => {
  const router = useRouter();
  const { teamID } = router.query;
  const {
    activeStep,
    setActiveStep,
    setAllData,
    allData,
    editStaffData,
    filepayload,
    editPayload,
    regSportID,
    staffEditId,
  } = props;
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const staffAddeducationData = useSelector(
    (state: RootState) => state.staffAdd
  );
  const academicQualificationData = useSelector(
    (state: RootState) => state.addAcademicQualification
  );
  const deleteAcademicQualificationData = useSelector(
    (state: RootState) => state.deleteAcademicQualification
  );
  const academicFileUploadData = useSelector(
    (state: RootState) => state.academicFileUpload
  );
  const academicFileUploadDelete = useSelector(
    (state: RootState) => state.staffAndAthleteFile
  );
  const { control, watch, setValue } = useForm<any>({
    defaultValues: {
      previousAthleteExperience: "",
    },
  });
  const prExperience = watch("previousAthleteExperience");
  const uploadCertificateRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>({
    academicQualification: "",
    fieldOfStudy: "",
    coachingExperience: "",
    previousAthleteExperience: prExperience,
    achievementsAsCoach: "",
    organizationalSkills: "",
    leadershipSkills: "",
    computerSkills: "",
    certificationLevel: "",
    universityName: "",
    location: "",
    skills: "",
    coachingExperienceMonths: "",
    coachingExperienceYears: "",
  });
  const formRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [editShowAcadamic, setEditShowAcadamic] = useState(false);
  const [acadamicId, setAcadamicId] = useState("");
  const [fileId, setFileId] = useState("");
  const { validate } = EducationFormValidation(
    formData,
    setErrors,
    editStaffData
  );
  const memoizedPayload = useMemo(() => {
    return editPayload?.staffID ? { ...editPayload } : null;
  }, []);
  const isFirstRender = useRef(true);

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

  const handlepassClick = () => {
    if (uploadCertificateRef.current) {
      uploadCertificateRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { uploadCertificate, certificationLevel, ...rest } = formData;
    const trimmedRest = trimFormData(rest);
    const educationErrors = validate();
    const validationErrors: any = { ...educationErrors };
    if (editStaffData?.academicQualificationList?.length === 0) {
      if (
        !formData.academicQualification ||
        formData.academicQualification.trim() === ""
      ) {
        validationErrors.academicQualification =
          "Academic Qualification is required.";
      } else {
        if (
          !formData.uploadCertificate ||
          formData.uploadCertificate.trim() === ""
        ) {
          validationErrors.uploadCertificate =
            "Upload Certificate is required.";
        }
        if (!formData.fieldOfStudy || formData.fieldOfStudy.trim() === "") {
          validationErrors.fieldOfStudy = "Field of Study is required.";
        }
        if (!formData.universityName || formData.universityName.trim() === "") {
          validationErrors.universityName = "University Name is required.";
        }
        if (!formData.location || formData.location.trim() === "") {
          validationErrors.location = "Location is required.";
        }
      }
      if (prExperience === "yes") {
        if (
          !formData.coachingExperienceMonths ||
          formData.coachingExperienceMonths.trim() === ""
        ) {
          validationErrors.coachingExperienceMonths =
            "Months Experience is required.";
        }
        if (
          !formData.coachingExperienceYears ||
          formData.coachingExperienceYears.trim() === ""
        ) {
          validationErrors.coachingExperienceYears =
            "Years Experience is required.";
        }
      }
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      setErrors(validationErrors);
      if (_.isEmpty(validationErrors)) {
        const data = {
          ...trimmedRest,
          section: "educationdetails",
          staffID: parsedData.staffID || staffEditId,
          previousAthleteExperience: prExperience,
        };
        dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
        const {
          fieldOfStudy,
          academicQualification,
          universityName,
          location,
        } = formData;
        const updateData = {
          fieldOfStudy,
          universityName,
          location,
          academicQualification,
        };
        const trimmedRests = trimFormData(updateData);
        const datas = {
          ...trimmedRests,
          staffID: parsedData.staffID || staffEditId,

          sportID: +sportID || regSportID,
        };
        dispatch(
          addAcademicQualification({
            url: "/InsertAcademicQualification",
            payload: datas,
          })
        );
      }
    } else {
      if (prExperience === "yes") {
        if (
          !formData.coachingExperienceMonths &&
          formData.coachingExperienceMonths !== 0
        ) {
          validationErrors.coachingExperienceMonths =
            "Months Experience is required.";
        }
        if (
          !formData.coachingExperienceYears &&
          formData.coachingExperienceYears !== 0
        ) {
          validationErrors.coachingExperienceYears =
            "Years Experience is required.";
        }
      }
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        const data = {
          ...trimmedRest,
          section: "educationdetails",
          staffID: parsedData.staffID || staffEditId,

          previousAthleteExperience: prExperience,
        };
        dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
        if (!_.isEmpty(formData.academicQualification)) {
          const {
            fieldOfStudy,
            academicQualification,
            universityName,
            location,
          } = formData;
          const trimmedRest = trimFormData({
            fieldOfStudy,
            universityName,
            location,
            academicQualification,
          });
          const datas = {
            ...trimmedRest,
            ...(editShowAcadamic
              ? {}
              : { staffID: parsedData.staffID || staffEditId }),

            sportID: +sportID || regSportID,
            academicQualificationID: acadamicId,
          };
          dispatch(
            addAcademicQualification({
              url: editShowAcadamic
                ? "/UpdateAcademicQualificationByID"
                : "/InsertAcademicQualification",
              payload: datas,
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    if (staffAddeducationData && staffAddeducationData.code === 200) {
      const { uploadCertificate, ...rest } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        educationdetails: {
          ...prevFormData.educationdetails,
          ...rest,
          previousAthleteExperience: prExperience,
        },
      }));
      dispatch(editStaff({ ...editPayload }));
      dispatch(clearAddState());
      setShowBanner(false);
      acadamicClear();
      if (editStaffData?.academicQualificationList?.length === 0) {
        setTimeout(() => {
          setActiveStep(4);
        }, 1000);
      } else {
        setActiveStep(4);
      }
    } else if (staffAddeducationData && staffAddeducationData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        dispatch(clearAddState());
      }, 2000);
    }
  }, [staffAddeducationData]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      uploadCertificate: file?.name,
      certificationLevel:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? file
          : prevData.certificationLevel,
    }));
    setErrors({
      ...errors,
      uploadCertificate: "",
    });
  };

  useEffect(() => {
    if (parsedData.educationdetails && !staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        fieldOfStudy: parsedData.educationdetails.fieldOfStudy || "",
        assignedAthletesOrTeams:
          parsedData.educationdetails.assignedAthletesOrTeams || "",
        coachingExperience:
          parsedData.educationdetails.coachingExperience || "",
        previousAthleteExperience:
          parsedData.educationdetails.previousAthleteExperience || "",
        achievementsAsCoach:
          parsedData.educationdetails.achievementsAsCoach || "",
        organizationalSkills:
          parsedData.educationdetails.organizationalSkills || "",
        leadershipSkills: parsedData.educationdetails.leadershipSkills || "",
        punctualityInMeetings:
          parsedData.educationdetails.punctualityInMeetings || "",
        availabilityOnTraining:
          parsedData.educationdetails.availabilityOnTraining || "",
        notesAdditionalInfo:
          parsedData.educationdetails.notesAdditionalInfo || "test",
        computerSkills: parsedData.educationdetails.computerSkills || "test",
        uploadCertificate: parsedData.uploadCertificate || "",
        employeeCertificate:
          parsedData.educationdetails.employeeCertificate || "",
        skills: parsedData.educationdetails.skills || "",
        coachingExperienceYears:
          parsedData.educationdetails.coachingExperienceYears || "",
        coachingExperienceMonths:
          parsedData.educationdetails.coachingExperienceMonths || "",
      }));
      setValue(
        "previousAthleteExperience",
        parsedData.educationdetails.previousAthleteExperience
      );
    }
  }, [editStaffData]);

  useEffect(() => {
    if (editStaffData && staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        fieldOfStudy: editStaffData.fieldOfStudy || "",
        assignedAthletesOrTeams: editStaffData.assignedAthletesOrTeams || "",
        coachingExperience: editStaffData.coachingExperience || "",
        previousAthleteExperience:
          editStaffData.previousAthleteExperience || "",
        achievementsAsCoach: editStaffData.achievementsAsCoach || "",
        organizationalSkills: editStaffData.organizationalSkills || "",
        leadershipSkills: editStaffData.leadershipSkills || "",
        punctualityInMeetings: editStaffData.punctualityInMeetings || "",
        availabilityOnTraining: editStaffData.availabilityOnTraining || "",
        notesAdditionalInfo: editStaffData.notesAdditionalInfo || "test",
        computerSkills: editStaffData.computerSkills || "test",
        uploadCertificate: parsedData.uploadCertificate || "",
        employeeCertificate: editStaffData.employeeCertificate || "",
        skills: editStaffData.skills || "",
        coachingExperienceYears: editStaffData.coachingExperienceYears || "",
        coachingExperienceMonths: editStaffData.coachingExperienceMonths || "",
      }));
      setValue(
        "previousAthleteExperience",
        editStaffData.previousAthleteExperience
      );
    }
  }, [editStaffData]);

  const handleDeleteFile = async (
    modulename: any,
    moduleId: any,
    fileType: any
  ) => {
    const fileID = editStaffData?.attachmentList?.find(
      (item: any) =>
        item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    if (fileID) {
      const data = {
        section: fileType,
        fileID: fileID,
      };
      dispatch(
        deleteStaffAndAthleteFile({
          url: "/DeleteAcademicCertificate",
          payload: data,
        })
      );
      setFormData((prev: any) => ({
        ...prev,
        uploadCertificate: "",
      }));
    }else{
      setFormData((prev: any) => ({
        ...prev,
        uploadCertificate: "",
      }));
    }
  };
  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      educationdetails: {
        ...prevFormData.educationdetails,
        ...formData,
        previousAthleteExperience: prExperience,
      },
    }));
    setActiveStep(2);
  };
  const qualifyChange = (event: any) => {
    setFormData({ ...formData, academicQualification: event.target.value });
    setErrors({ ...errors, academicQualification: "" });
  };

  const qualificationOptions = [
    { value: "Bachelor’s Degree", label: "Bachelor’s Degree" },
    { value: "Master’s Degree", label: "Master’s Degree" },
    { value: "Ph.D", label: "Ph.D." },
    { value: "Diploma", label: "Diploma" },
    { value: "High School", label: "High School" },
  ];

  const acadamicClear = () => {
    setFormData({
      ...formData,
      academicQualification: "",
      fieldOfStudy: "",
      universityName: "",
      location: "",
      uploadCertificate: "",
    });
  };

  const sportID: any = teamID;

  const handleAcadamicQualification = () => {
    const validationErrors: any = {};
    if (
      !formData.academicQualification ||
      formData.academicQualification.trim() === ""
    ) {
      validationErrors.academicQualification =
        "Academic Qualification is required.";
    } else {
      if (
        !formData.uploadCertificate ||
        formData.uploadCertificate.trim() === ""
      ) {
        validationErrors.uploadCertificate = "Upload Certificate is required.";
      }
      if (!formData.fieldOfStudy || formData.fieldOfStudy.trim() === "") {
        validationErrors.fieldOfStudy = "Field of Study is required.";
      }
      if (!formData.universityName || formData.universityName.trim() === "") {
        validationErrors.universityName =
          "Educational Institution Name is required.";
      }
      if (!formData.location || formData.location.trim() === "") {
        validationErrors.location = "Location is required.";
      }
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const { fieldOfStudy, academicQualification, universityName, location } =
      formData;
    const trimmedRest = trimFormData({
      fieldOfStudy,
      universityName,
      location,
      academicQualification,
    });
    const data = {
      ...trimmedRest,
      ...(editShowAcadamic
        ? {}
        : { staffID: parsedData.staffID || staffEditId }),

      sportID: +sportID || regSportID,
      academicQualificationID: acadamicId,
    };

    dispatch(
      addAcademicQualification({
        url: editShowAcadamic
          ? "/UpdateAcademicQualificationByID"
          : "/InsertAcademicQualification",
        payload: data,
      })
    );
  };

  const tableHeaders = [
    "Academic Qualification",
    "Field of Study",
    "University Name",
    "Location",
    "Actions",
  ];

  useEffect(() => {
    dispatch(editStaff({ ...editPayload }));
  }, []);

  useEffect(() => {
    if (academicQualificationData && academicQualificationData.code === 200) {
      dispatch(editStaff({ ...editPayload }));
      if (formData.certificationLevel) {
        const data = new FormData();
        data.append("sportID", sportID || regSportID);
        data.append(
          "academicQualificationID",
          academicQualificationData?.data?.academicQualificationID
        );
        data.append("file", formData.certificationLevel);
        data.append("moduleID", parsedData.staffID || staffEditId);
        data.append("moduleName", "staff");
        data.append("section", "AcademicQualification");
        if (editShowAcadamic) {
          data.append("fileID", fileId);
          data.append("updateSection", "AcademicQualification");
        }
        dispatch(
          academicFileUpload({
            url: editShowAcadamic
              ? "/UpdateAcademicCertificateFileUpload"
              : "/AcademicQualificationFileUpload",
            payload: data,
          })
        );
      }
      setEditShowAcadamic(false);
      dispatch(clearAddAcademicState());
      acadamicClear();
    } else if (
      (academicQualificationData && academicQualificationData.code === 500) ||
      academicQualificationData.code === 409
    ) {
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        dispatch(clearAddAcademicState());
      }, 2000);
    }
  }, [academicQualificationData]);

  useEffect(() => {
    if (
      deleteAcademicQualificationData &&
      deleteAcademicQualificationData.code === 200
    ) {
      dispatch(editStaff({ ...editPayload }));
      setTimeout(() => {
        dispatch(clearAcademicQualificationDeleteState());
      }, 2000);
    }
  }, [deleteAcademicQualificationData]);

  useEffect(() => {
    if (academicFileUploadData && academicFileUploadData.code === 200) {
      dispatch(editStaff({ ...editPayload }));
      setTimeout(() => {
        dispatch(clearAcademicFileUploadState());
      }, 2000);
    }
  }, [academicFileUploadData]);

  useEffect(() => {
    if (academicFileUploadDelete && academicFileUploadDelete.code === 200) {
      dispatch(editStaff({ ...editPayload }));
      setTimeout(() => {
        dispatch(clearStaffAndAthleteFileDeleteState());
      }, 2000);
    }
  }, [academicFileUploadDelete]);

  const downloadFile = (file: any) => {
    const downloader = FileDownload({
      filePath: file.filePath,
      fileName: file.fileName,
    });
    downloader.trigger();
  };

  const isEdit = (data: any) => {
    setEditShowAcadamic(true);
    setFormData((formData: any) => ({
      ...formData,
      academicQualification: data.academicQualification || "",
      fieldOfStudy: data.fieldOfStudy || "",
      universityName: data.universityName || "",
      location: data.location || "",
      uploadCertificate: data?.fileList?.[0]?.fileName ?? "",
    }));
    setAcadamicId(data.academicQualificationID);
    const academicQualificationData = _.find(
      data.fileList,
      (attachment) =>
        attachment.documentSection.toLowerCase() === "academicqualification"
    );
    setFileId(academicQualificationData?.fileID);
  };

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={0}>
        {editStaffData &&
        editStaffData?.academicQualificationList?.length > 0 ? (
          <Box sx={{ padding: "2rem", width: "100%" }}>
            <TableContainer
              sx={{
                height: {
                  border: "1px solid rgba(88, 88, 91, 0.2)",
                  borderRadius: "4px",
                },
                overflowX: "auto",
              }}
            >
              <Table stickyHeader aria-label="team table">
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => (
                      <TableCell
                        key={header}
                        align={header === "Name" ? "center" : "left"}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: "bold",
                          width:
                            header === "Name"
                              ? "240px"
                              : header === "Role"
                              ? "97px"
                              : header === "Actions"
                              ? "60px"
                              : "164px",
                          p: 1.25,
                        }}
                        className="bukra"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {editStaffData &&
                    editStaffData?.academicQualificationList?.length > 0 &&
                    editStaffData.academicQualificationList.map(
                      (row: any, index: any) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(even)": {
                              backgroundColor: "#EFFAF9",
                            },
                          }}
                          className="border-bottom-0"
                        >
                          <TableCell sx={{ p: 1.25 }}>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                                textTransform: "capitalize",
                              }}
                              className="dubai-regular"
                            >
                              {row.academicQualification || "--"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1.25 }}>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                              }}
                              className="dubai-regular"
                            >
                              {row.fieldOfStudy || "--"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1.25 }}>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                              }}
                              className="dubai-regular"
                            >
                              {row.universityName || "--"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1.25 }}>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                              }}
                              className="dubai-regular"
                            >
                              {row.location || "--"}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              p: 1.25,
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <Tooltip title={"Upload"}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => {
                                  downloadFile(row?.fileList[0]);
                                }}
                                sx={{
                                  width: "16px",
                                  height: "16px",
                                  // mx: 1,
                                  color: "#05868E",
                                }}
                                disabled={
                                  !(
                                    row?.fileList &&
                                    row.fileList.some(
                                      (item: any) => item.filePath
                                    )
                                  )
                                }
                              >
                                <AttachFileIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={"Edit"}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => isEdit(row)}
                                sx={{
                                  width: "16px",
                                  height: "16px",
                                  // mx: 1,
                                  color: "#05868E",
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <DeleteDialog
                              data={row}
                              dispatchDelete={DeleteAcademicQualificationByID}
                              deleteResponse={deleteAcademicQualificationData}
                              clearDelete={
                                clearAcademicQualificationDeleteState
                              }
                              module={"academicQualificationID"}
                              title={"Academic Qualification"}
                              getCurrentSport={teamID}
                              deleteUrl={"/DeleteStaffAcademicQualification"}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
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
                  onClose={() => setShowBanner(false)}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={() => setShowBanner(false)}
                    severity="error"
                    variant="filled"
                    className="dubai-med"
                  >
                    {staffAddeducationData && staffAddeducationData.message
                      ? staffAddeducationData.message
                      : academicQualificationData.message}
                  </Alert>
                </Snackbar>
              )}
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Academic Qualification
                    <span className="asterisk">*</span>
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.academicQualification}
                      onChange={qualifyChange}
                      displayEmpty
                      className="Text-field-customise"
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
                          Select Academic Qualification
                        </Typography>
                      </MenuItem>
                      {qualificationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography variant="body1" color="textPrimary">
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {errors.academicQualification && (
                    <Typography variant="caption" className="error-message">
                      {errors.academicQualification}
                    </Typography>
                  )}

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
                          onFileChange={(file: any, flag: any) =>
                            handleFileChange(file, flag)
                          }
                          formatType={FILE_FORMAT_TYPE_DOCUMENT}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                          modulename="Staff"
                          // moduleId={parsedData.staffID}
                          setData={setFormData}
                          formData={formData}
                          fileInputRef={uploadCertificateRef}
                          // fetchDataApi={() => dispatch(editStaff(filepayload))}
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
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "400px",
                          }}
                        >
                          {formData.uploadCertificate ? (
                            <>{formData.uploadCertificate}</>
                          ) : (
                            <>
                              Upload Certificate: Upload (PDF, DOC, DOCX){" "}
                              {!_.isEmpty(formData.academicQualification) ? (
                                <span
                                  className="asterisk"
                                  style={{ color: "#d32f2f" }}
                                >
                                  *
                                </span>
                              ) : (
                                ""
                              )}
                            </>
                          )}
                        </Typography>
                        {formData.uploadCertificate && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => {
                              handleDeleteFile(
                                "Staff",
                                parsedData.staffID || staffEditId,
                                "AcademicQualification"
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
                  {errors.uploadCertificate && (
                    <Typography variant="caption" className="error-message">
                      {errors.uploadCertificate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Field of Study{" "}
                    {!_.isEmpty(formData.academicQualification) ? (
                      <span className="asterisk">*</span>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <CustomTextField
                    name="fieldOfStudy"
                    placeholder="Enter Field of Study"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.fieldOfStudy && (
                    <Typography variant="caption" className="error-message">
                      {errors.fieldOfStudy}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Educational Institution Name{" "}
                    {!_.isEmpty(formData.academicQualification) ? (
                      <span className="asterisk">*</span>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <CustomTextField
                    name="universityName"
                    placeholder="Enter Educational Institution Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.universityName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.universityName && (
                    <Typography variant="caption" className="error-message">
                      {errors.universityName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Location{" "}
                    {!_.isEmpty(formData.academicQualification) ? (
                      <span className="asterisk">*</span>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <CustomTextField
                    name="location"
                    placeholder="Enter Campus Location"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.location}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.location && (
                    <Typography variant="caption" className="error-message">
                      {errors.location}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      variant="outlined"
                      className="text-capitalize dubai-med"
                      onClick={handleAcadamicQualification}
                      disabled={academicQualificationData.loading}
                      startIcon={<AddBoxOutlinedIcon />}
                      style={{
                        color: "rgba(0, 66, 106, 1)",
                        borderColor: "rgba(0, 66, 106, 1)",
                      }}
                    >
                      {academicQualificationData.loading
                        ? "Loading..."
                        : editShowAcadamic
                        ? "Update"
                        : "Add"}
                    </Button>
                  </Box>
                </Grid>

                <Grid
                  container
                  item
                  xs={12}
                  md={5.75}
                  spacing={1}
                  mt={0}
                  alignItems="center"
                  // sx={{ border: "1px solid #a3c7a3", borderRadius: "5px", overflow: "hidden", height: "67px", display: "flex", alignItems: "center" }}
                  // mt={"10px"}
                >
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Years of Previous Experience in the Assigned Role
                    {prExperience === "yes" ? (
                      <span className="asterisk" style={{ color: "#d32f2f" }}>
                        *
                      </span>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 10px",
                      backgroundColor: "",
                    }}
                  >
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Years
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <CustomTextField
                        name="coachingExperienceYears"
                        placeholder=""
                        variant="outlined"
                        fullWidth
                        value={formData.coachingExperienceYears}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 2 }}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                        sx={{ ml: 1, backgroundColor: "#fff" }}
                      />
                      {errors.coachingExperienceYears && (
                        <Typography
                          variant="caption"
                          className="error-message"
                          ml={1}
                        >
                          {errors.coachingExperienceYears}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 10px",
                    }}
                  >
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Months
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <CustomTextField
                        name="coachingExperienceMonths"
                        placeholder=""
                        variant="outlined"
                        fullWidth
                        value={formData.coachingExperienceMonths}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 2 }}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                        sx={{ ml: 1, backgroundColor: "#fff" }}
                      />
                      {errors.coachingExperienceMonths && (
                        <Typography
                          variant="caption"
                          className="error-message"
                          ml={1}
                        >
                          {errors.coachingExperienceMonths}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <DropDown
                    name="previousAthleteExperience"
                    control={control}
                    label="Enter Previous Experience as Athlete of the same Sport"
                    placeholder="Enter Previous Experience as Athlete of the same Sport"
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    multiple={false}
                    variant="outlined"
                    icon={false}
                    module="rules"
                  />
                  {errors.previousAthleteExperience && (
                    <Typography variant="caption" className="error-message">
                      {errors.previousAthleteExperience}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Main Achievements in the Assigned Role
                  </Typography>
                  <CustomTextField
                    name="achievementsAsCoach"
                    placeholder="Enter Main Achievements in the Assigned Role"
                    variant="outlined"
                    multiline
                    rows={5}
                    fullWidth
                    value={formData.achievementsAsCoach}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    sx={{ marginBottom: "100px" }}
                  />
                  {errors.achievementsAsCoach && (
                    <Typography variant="caption" className="error-message">
                      {errors.achievementsAsCoach}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Skills
                  </Typography>
                  <CustomTextField
                    name="skills"
                    placeholder="Enter Skills"
                    variant="outlined"
                    multiline
                    rows={5}
                    fullWidth
                    value={formData.skills}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    sx={{ marginBottom: "100px" }}
                  />
                  {errors.skills && (
                    <Typography variant="caption" className="error-message">
                      {errors.skills}
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
                  disabled={staffAddeducationData.loading}
                >
                  {staffAddeducationData.loading
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
export default EducationandExperience;

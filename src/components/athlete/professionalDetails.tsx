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
  FormControl,
  MenuItem,
  Select,
  Theme,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  REGEX,
  PDF_FORMAT,
  iconMapping,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import {
  addAthlete,
  clearAddAthleteState,
} from "@/redux/slices/athlete/athleteAddSlice";
import { ProfessionalFormValidation } from "@/utils/athletes/validation";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import {
  addAcademicQualification,
  clearAddAcademicState,
} from "@/redux/slices/athlete/athleteAcademicQualification";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import {
  clearAcademicQualificationDeleteState,
  DeleteAcademicQualificationByID,
} from "@/redux/slices/athlete/deleteAcademicQualification";
import { academicFileUpload } from "@/redux/slices/fileupload/academicFileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileDownload from "@/components/FileDownload ";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EditIcon from "@mui/icons-material/Edit";
import TextSunEditor from "../SunEditor";
import {
  clearStaffAndAthleteFileDeleteState,
  deleteStaffAndAthleteFile,
} from "@/redux/slices/staffAndAthlete/StaffAndAthleteFileDeleteSlice";
import DropDown from "../Fields/DropDown";

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

const qualificationOptions = [
  { value: "Bachelor’s Degree", label: "Bachelor’s Degree" },
  { value: "Master’s Degree", label: "Master’s Degree" },
  { value: "Ph.D", label: "Ph.D." },
  { value: "Diploma", label: "Diploma" },
  { value: "High School", label: "High School" },
];

const Performance = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const ProfessionalDetails = (props: any) => {
  const {
    setActiveStep,
    setAllData,
    teamId,
    editAthleteData,
    editPayload,
    athleteEditId,
  } = props;
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      externalClubs: "",
    },
  });
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    role: "",
    academicQualification: "",
    sportsCategory: "",
    performanceLevel: "",
    disciplinePracticed: "",
    fieldOfStudy: "",
    universityName: "",
    location: "",
    federationLicense: "",
    federationExpiryDate: "",
    nationalTeamMember: "",
    externalClubs: "",
    resultsAndAchievements: "",
    uploadLicense: "",
    uploadDegree: "",
    certificationLevel: "",
    sportClubAssociation: "",
    roleAssignedClub: "",
  });

  const formRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [errors, setErrors] = useState<any>({});
  const { validate } = ProfessionalFormValidation(
    formData,
    setErrors,
    editAthleteData
  );
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const athleteAddEmployementData = useSelector(
    (state: RootState) => state.athleteAdd
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
  const certificateFileUploadDelete = useSelector(
    (state: RootState) => state.staffAndAthleteFile
  );
  const filecertificateRef = useRef<HTMLInputElement>(null);
  const [editShowAcadamic, setEditShowAcadamic] = useState(false);
  const [acadamicId, setAcadamicId] = useState("");
  const [fileId, setFileId] = useState("");
  const filelicenseRef = useRef<HTMLInputElement>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
    if (name === "dateOfLastJobPromotion" && value) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        dateOfLastJobPromotion: "",
      }));
    }
  };

  const externalClubsValue = watch("externalClubs");
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      externalClubs: externalClubsValue,
    }));
  }, [externalClubsValue]);

  const formatDate = (date: string | undefined) =>
    date ? moment(date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";

  const onSubmit = async () => {
    const validationErrors = validate();
    const isAcademicQualificationListEmpty =
      editAthleteData?.academicQualificationList?.length === 0;
    if (isAcademicQualificationListEmpty) {
      setErrors(validationErrors);
      if (_.isEmpty(validationErrors)) {
        const { uploadContract, certificationLevel, ...rest } = formData;
        const trimmedRest = trimFormData(rest);
        const data = {
          ...trimmedRest,
          federationExpiryDate: formatDate(formData.federationExpiryDate),
          section: "professionaldetails",
          athleteID: parsedData.athleteID || athleteEditId,
        };
        dispatch(addAthlete({ url: "/UpdateathleteByID", payload: data }));
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
          athleteID: parsedData.athleteID || athleteEditId,

          sportID: teamId,
        };
        dispatch(
          addAcademicQualification({
            url: "/InsertAthleteAcademicQualification",
            payload: datas,
          })
        );
      }
    } else {
      setErrors(validationErrors);
      if (_.isEmpty(validationErrors)) {
        const { uploadContract, certificationLevel, ...rest } = formData;
        const trimmedRest = trimFormData(rest);
        const data = {
          ...trimmedRest,
          federationExpiryDate: formatDate(formData.federationExpiryDate),
          section: "professionaldetails",
          athleteID: parsedData.athleteID || athleteEditId,
        };

        dispatch(addAthlete({ url: "/UpdateathleteByID", payload: data }));
      }
    }
  };

  useEffect(() => {
    if (athleteAddEmployementData && athleteAddEmployementData.code === 200) {
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        professionaldetails: formData,
      }));
      dispatch(clearAddAthleteState());
      if (editAthleteData?.academicQualificationList?.length === 0) {
        setTimeout(() => {
          setActiveStep(4);
        }, 1000);
      } else {
        setActiveStep(4);
      }
      dispatch(editAthlete(editPayload));
    } else if (
      athleteAddEmployementData &&
      athleteAddEmployementData.code === 500
    ) {
      setShowBanner(true);
      setAlertType("error");
      setAlertMessage(
        `${athleteAddEmployementData && athleteAddEmployementData.message}`
      );
      setTimeout(() => {
        dispatch(clearAddAthleteState());
        setShowBanner(false);
      }, 2000);
    }
  }, [athleteAddEmployementData]);

  function formatDatesWithCheck(date: any): any {
    if (!date || date === "Invalid date format") {
      return "";
    }
    return formatDates(date);
  }

  useEffect(() => {
    if (!_.isEmpty(parsedData?.professionaldetails) && !athleteEditId) {
      const professional = parsedData?.professionaldetails;
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        uploadDegree: parsedData.certificate || "",
        role: professional.role || "",
        academicQualification: professional.academicQualification || "",
        sportsCategory: professional.sportsCategory || "",
        performanceLevel: professional.performanceLevel || "",
        disciplinePracticed: professional.disciplinePracticed || "",
        fieldOfStudy: professional.fieldOfStudy || "",
        universityName: professional.universityName || "",
        location: professional.location || "",
        federationLicense: professional.federationLicense || "",
        federationExpiryDate:
          formatDatesWithCheck(professional.federationExpiryDate) || "",
        nationalTeamMember: professional.nationalTeamMember || "",
        externalClubs: professional.externalClubs || "",
        resultsAndAchievements: professional.resultsAndAchievements || "",
        uploadLicense: parsedData.license || "",
        certificationLevel: parsedData.certificationLevel || "",
        sportClubAssociation: professional.sportClubAssociation || "",
        roleAssignedClub: professional.roleAssignedClub || "",
      }));
      setValue("externalClubs", professional.externalClubs);
    }
  }, [editAthleteData]);

  useEffect(() => {
    if (editAthleteData && athleteEditId) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        uploadDegree: parsedData.certificate || "",
        role: editAthleteData.role || "",
        academicQualification: editAthleteData.academicQualification || "",
        sportsCategory: editAthleteData.sportsCategory || "",
        performanceLevel: editAthleteData.performanceLevel || "",
        disciplinePracticed: editAthleteData.disciplinePracticed || "",
        fieldOfStudy: editAthleteData.fieldOfStudy || "",
        universityName: editAthleteData.universityName || "",
        location: editAthleteData.location || "",
        federationLicense: editAthleteData.federationLicense || "",
        federationExpiryDate:
          formatDatesWithCheck(editAthleteData.federationExpiryDate) || "",
        nationalTeamMember: editAthleteData.nationalTeamMember || "",
        externalClubs: editAthleteData.externalClubs || "",
        resultsAndAchievements: editAthleteData.resultsAndAchievements || "",
        uploadLicense: parsedData.license || "",
        certificationLevel: parsedData.certificationLevel || "",
        sportClubAssociation: editAthleteData.sportClubAssociation || "",
        roleAssignedClub: editAthleteData.roleAssignedClub || "",
      }));
      setValue("externalClubs", editAthleteData.externalClubs);
    }
  }, [editAthleteData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const qualifyChange = (event: any) => {
    setFormData({ ...formData, academicQualification: event.target.value });
    setErrors({
      ...errors,
      academicQualification: "",
    });
  };

  const policyStatusChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      uploadDegree:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? file?.name
          : prevData.uploadDegree,
      certificationLevel:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? file
          : prevData.certificationLevel,
      uploadLicense:
        flag === DROPZONE_IMAGE_FLAG.LICENSE ? file : prevData.uploadLicense,
    }));
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      uploadDegree:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? ""
          : prevErrors.uploadDegree,
    }));
  };

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      professionaldetails: formData,
    }));
    const payload: any = {
      athleteID: parsedData.athleteID || athleteEditId,
      sportID: teamId,
    };
    dispatch(editAthlete(payload));
    setActiveStep(2);
  };

  const handleDeleteFile = async (
    modulename: any,
    moduleId: any,
    fileType: any
  ) => {
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
        [fileType]: "",
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    }
  };

  const handleAcdamicDeleteFile = async (
    modulename: any,
    moduleId: any,
    fileType: any
  ) => {
    const fileID = editAthleteData?.attachmentList?.find(
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
          url: "/DeleteAthleteAcademicCertificateUpload",
          payload: data,
        })
      );
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    }
  };

  const handlecertificateClick = () => {
    if (filecertificateRef.current) {
      filecertificateRef.current.click();
    }
  };

  const acadamicClear = () => {
    setFormData({
      ...formData,
      academicQualification: "",
      fieldOfStudy: "",
      universityName: "",
      location: "",
      uploadDegree: "",
    });
  };

  const handleAcadamicQualification = () => {
    const validationErrors: any = {};
    if (
      !formData.academicQualification ||
      formData.academicQualification.trim() === ""
    ) {
      validationErrors.academicQualification =
        "Academic Qualification is required.";
    } else {
      if (!formData.fieldOfStudy || _.trim(formData.fieldOfStudy) === "") {
        validationErrors.fieldOfStudy = "Field of Study is required.";
      } else if (!REGEX.TEXT.test(formData.fieldOfStudy)) {
        validationErrors.fieldOfStudy = `Field Of Study should not contain special characters & numbers.`;
      }
      if (!formData.universityName || _.trim(formData.universityName) === "") {
        validationErrors.universityName =
          "Educational Institution is required.";
      } else if (!REGEX.TEXT.test(formData.universityName)) {
        validationErrors.universityName = `Educational Institution should not contain special characters & numbers.`;
      }
      if (!formData.location || _.trim(formData.location) === "") {
        validationErrors.location = "Location is required.";
      } else if (!REGEX.TEXT.test(formData.location)) {
        validationErrors.location = `location should not contain special characters & numbers.`;
      }
      if (!formData.uploadDegree || _.trim(formData.uploadDegree) === "") {
        validationErrors.uploadDegree =
          "Upload Degree Certificate is required.";
      }
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { fieldOfStudy, academicQualification, universityName, location } =
        formData;
      const updateData = {
        fieldOfStudy,
        universityName,
        location,
        academicQualification,
      };
      const trimmedRest = trimFormData(updateData);
      const data = {
        ...trimmedRest,
        ...(editShowAcadamic
          ? {}
          : { athleteID: parsedData.athleteID || athleteEditId }),

        sportID: +teamId,
        ...(editShowAcadamic ? { academicQualificationID: acadamicId } : {}),
      };

      dispatch(
        addAcademicQualification({
          url: editShowAcadamic
            ? "/UpdateAthleteAcademicQualificationByID"
            : "/InsertAthleteAcademicQualification",
          payload: data,
        })
      );
    }
  };

  const tableHeaders = [
    "Academic Qualification",
    "Field of Study",
    "University Name",
    "Location",
    "Actions",
  ];

  const editParams = {
    ...editPayload,
  };

  useEffect(() => {
    if (editPayload?.athleteID) {
      dispatch(editAthlete(editParams));
    }
  }, []);

  useEffect(() => {
    if (academicQualificationData && academicQualificationData.code === 200) {
      dispatch(editAthlete(editParams));
      if (formData.certificationLevel) {
        const data = new FormData();
        data.append("sportID", teamId);
        data.append(
          "academicQualificationID",
          academicQualificationData?.data?.academicQualificationID
        );
        data.append("file", formData.certificationLevel);
        data.append("moduleID", parsedData.athleteID || athleteEditId);
        data.append("moduleName", "Athlete");
        data.append("section", "AcademicQualification");
        if (editShowAcadamic) {
          data.append("fileID", fileId);
          data.append("updateSection", "AcademicQualification");
        }
        dispatch(
          academicFileUpload({
            url: editShowAcadamic
              ? "/UpdateAthleteAcademicCertificateFileUpload"
              : "/AthleteAcademicQualificationFileUpload",
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
      setAlertType("error");
      setAlertMessage(
        `${academicQualificationData && academicQualificationData.message}`
      );
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
      dispatch(editAthlete(editParams));
      setEditShowAcadamic(false);
      acadamicClear();
    }
  }, [deleteAcademicQualificationData]);

  useEffect(() => {
    if (academicFileUploadData && academicFileUploadData.code === 200) {
      dispatch(editAthlete(editParams));
    }
  }, [academicFileUploadData]);

  useEffect(() => {
    if (
      certificateFileUploadDelete &&
      certificateFileUploadDelete.code === 200
    ) {
      dispatch(editAthlete(editParams));
      setTimeout(() => {
        dispatch(clearStaffAndAthleteFileDeleteState());
      }, 2000);
    }
  }, [certificateFileUploadDelete]);

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
      uploadDegree: data?.fileList?.[0]?.fileName ?? "",
    }));
    setAcadamicId(data.academicQualificationID);
    const academicQualificationData = _.find(
      data.fileList,
      (attachment) =>
        attachment.documentSection.toLowerCase() === "academicqualification"
    );
    setFileId(academicQualificationData?.fileID);
  };

  const handlicenseClick = () => {
    if (filelicenseRef.current) {
      filelicenseRef.current.click();
    }
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  return (
    <Grid container spacing={0}>
      {editAthleteData &&
      editAthleteData?.academicQualificationList?.length > 0 ? (
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
                {editAthleteData &&
                  editAthleteData?.academicQualificationList?.length > 0 &&
                  editAthleteData.academicQualificationList.map(
                    (row: any, index: any) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
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
                          <Tooltip title={"Edit"}>
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() => {
                                downloadFile(row?.fileList[0]);
                              }}
                              sx={{
                                width: "16px",
                                height: "16px",
                                mx: 1,
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
                            clearDelete={clearAcademicQualificationDeleteState}
                            module={"academicQualificationID"}
                            title={"Academic Qualification"}
                            getCurrentSport={teamId}
                            deleteUrl={"/DeleteAthleteAcademicQualification"}
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Academic Qualification <span className="asterisk">*</span>
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
                    inputRef={(el) =>
                      (formRefs.current.academicQualification = el)
                    }
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
                        Select current job location Qualification
                      </Typography>
                    </MenuItem>
                    {qualificationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Typography
                          variant="body1"
                          color="textPrimary"
                          className="dubai-med"
                        >
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.academicQualification && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={2}
                  >
                    {errors.academicQualification}
                  </Typography>
                )}
                <Grid
                  container
                  spacing={0}
                  justifyContent="start"
                  alignItems="center"
                >
                  <Grid item alignItems="flex-start">
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
                        formatType={PDF_FORMAT}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        fileInputRef={filecertificateRef}
                        // fetchDataApi={() => dispatch(editAthlete(editPayload))}
                      />
                      <AttachFileSharpIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <Typography
                        align="center"
                        color="error"
                        className="dubai-med upload-label"
                        onClick={handlecertificateClick}
                        style={{
                          cursor: "pointer",
                          color: "#00426A",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        }}
                      >
                        {formData.uploadDegree ? (
                          <>{formData.uploadDegree}</>
                        ) : (
                          <>
                            Upload Degree Certificate: PDF format (max size 25
                            MB){" "}
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
                      {formData.uploadDegree && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleAcdamicDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "Academicqualification"
                            );
                            setFormData((prev: any) => ({
                              ...prev,
                              uploadDegree: "",
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
                {errors.uploadDegree && (
                  <Typography variant="caption" className="error-message">
                    {errors.uploadDegree}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Field Of Study{" "}
                  {!_.isEmpty(formData.academicQualification) ? (
                    <span className="asterisk">*</span>
                  ) : (
                    ""
                  )}
                </Typography>
                <CustomTextField
                  name="fieldOfStudy"
                  placeholder="Enter major Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 200 }}
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

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Role on Team
                </Typography>
                <CustomTextField
                  name="role"
                  placeholder="Enter Role"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.role}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.role && (
                  <Typography variant="caption" className="error-message">
                    {errors.role}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Sports Category <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="sportsCategory"
                  placeholder="Enter Sports Category"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.sportsCategory}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.sportsCategory && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={1}
                  >
                    {errors.sportsCategory}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Performance Level <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.performanceLevel}
                    onChange={policyStatusChange}
                    name="performanceLevel"
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
                        Select Performance Level
                      </Typography>
                    </MenuItem>
                    {Performance.map((option) => (
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
                            marginLeft: 4,
                          }}
                          className="dubai-med"
                        >
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.performanceLevel && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={1}
                  >
                    {errors.performanceLevel}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Discipline Practiced <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="disciplinePracticed"
                  placeholder="Enter Discipline Practiced"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.disciplinePracticed}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_CHARS_SPACE.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.disciplinePracticed && (
                  <Typography variant="caption" className="error-message">
                    {errors.disciplinePracticed}
                  </Typography>
                )}
              </Grid>

              <Grid container item xs={12} md={5.75} spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Federation License
                  </Typography>
                  <CustomTextField
                    name="federationLicense"
                    placeholder="Enter Federation License"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.federationLicense}
                    onChange={handleChange}
                    className="Text-field-customise"
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Expiry Date
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="federationExpiryDate"
                    label="Date of Expiry"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(50, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.federationExpiryDate}
                  />

                  {errors.federationExpiryDate && (
                    <Typography variant="caption" className="error-message">
                      {errors.federationExpiryDate}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  xs={12}
                  md={12}
                  container
                  spacing={0}
                  justifyContent="start"
                  alignItems="center"
                  mt={1}
                >
                  <Grid item alignItems="flex-start">
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
                        formatType={PDF_FORMAT}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.LICENSE}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID || athleteEditId}
                        fileInputRef={filelicenseRef}
                        // fetchDataApi={() => dispatch(editAthlete(editPayload))}
                      />
                      <AttachFileSharpIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <Typography
                        align="center"
                        className="dubai-med upload-label"
                        onClick={handlicenseClick}
                        style={{
                          cursor: "pointer",
                          color: "#00426A",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        }}
                      >
                        {formData?.uploadLicense ? (
                          <>
                            {typeof formData.uploadLicense === "object" &&
                            formData.uploadLicense.name
                              ? formData.uploadLicense.name
                              : formData.uploadLicense}
                          </>
                        ) : (
                          <>
                            Upload License Certificate: PDF format (max size 25
                            MB)
                          </>
                        )}
                      </Typography>
                      {formData.uploadLicense && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "License"
                            );
                            setFormData((prev: any) => ({
                              ...prev,
                              uploadLicense: "",
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
                  National Team Member
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="nationalTeamMember"
                    value={formData.nationalTeamMember}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label="Yes"
                      className="dubai-med textfield-label"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label="No"
                      className="dubai-med textfield-label"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5.75}>
                <DropDown
                  name="externalClubs"
                  label="Affiliations (Club/Association)"
                  placeholder="Select Affiliations (Club/Association)"
                  control={control}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                  variant="outlined"
                  // required={true}
                />
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Sport Club/Association Name{" "}
                  {formData.externalClubs === "yes" ? (
                    <span className="asterisk">*</span>
                  ) : null}
                </Typography>
                <CustomTextField
                  name="sportClubAssociation"
                  placeholder="Enter Sport Club/Association Name"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.sportClubAssociation}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.sportClubAssociation && (
                  <Typography variant="caption" className="error-message">
                    {errors.sportClubAssociation}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Role Assigned in Club{" "}
                  {formData.externalClubs === "yes" ? (
                    <span className="asterisk">*</span>
                  ) : null}
                </Typography>
                <CustomTextField
                  name="roleAssignedClub"
                  placeholder="Enter Role Assigned in Club"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.roleAssignedClub}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.roleAssignedClub && (
                  <Typography variant="caption" className="error-message">
                    {errors.roleAssignedClub}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Results And Achievements
                </Typography>

                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.resultsAndAchievements}
                  name="resultsAndAchievements"
                  minHeight={"250px"}
                />
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
                disabled={athleteAddEmployementData.loading}
              >
                {athleteAddEmployementData.loading
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
export default ProfessionalDetails;

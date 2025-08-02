"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import {
  formatDates,
  getLocalStorage,
  removeLocalStorage,
  trimFormData,
  validateNewSingleDates,
} from "@/utils/helper";
import { useRouter } from "next/navigation";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  USER_ERROR,
  FILE_FORMAT_PDF_IMAGE,
  iconMapping,
  REGEX,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import ReactSelect from "@/components/Fields/ReactSelect";
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
import {
  clearStaffAndAthleteFileDeleteState,
  deleteStaffAndAthleteFile,
} from "@/redux/slices/staffAndAthlete/StaffAndAthleteFileDeleteSlice";
import { CertificateAndLicence } from "@/utils/staffs/validation";
import TextSunEditor from "../SunEditor";

const CustomTextField = styled(TextField)(({}) => ({
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

const CertificationsAndLicenses = (props: any) => {
  const {
    setActiveStep,
    setAllData,
    editStaffData,
    filepayload,
    teamId,
    setLoading,
    setRouteHandel,
    setDisableRouting,
    editPayload,
    staffEditId,
    onClose,
  } = props;
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    coachingCertifications: "",
    issuingOrganization: "",
    dateOfCertification: null,
    expiryDate: null,
    expiry: null,
    level: "",
    federationLicence: "",
    sport: "",
    medicalIssues: "",
    previousSportEthicalConduct: "",
    //dout
    detailedTasks: "Manage team training",
    levelCertificate: "",
    certificationLevel: "",
    medicalIssueDetails: "",
  });

  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const staffAddcertificateData = useSelector(
    (state: RootState) => state.staffAdd
  );
  const coachingCertificationsData = useSelector(
    (state: RootState) => state.addAcademicQualification
  );
  const deletecoachingCertificationsData = useSelector(
    (state: RootState) => state.deleteAcademicQualification
  );
  const coachingFileUploadData = useSelector(
    (state: RootState) => state.academicFileUpload
  );
  const certificateFileUploadDelete = useSelector(
    (state: RootState) => state.staffAndAthleteFile
  );
  const [showBanner, setShowBanner] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const [SportsOption, setSportsOption] = useState();
  const [SelectedSportsOption, setSelectedSportsOption] = useState("");
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const memoizedPayload = useMemo(() => {
    return editPayload?.staffID ? { ...editPayload } : null;
  }, []);
  const isFirstRender = useRef(true);
  const [editShowAcadamic, setEditShowAcadamic] = useState(false);
  const [acadamicId, setAcadamicId] = useState("");
  const [fileId, setFileId] = useState("");
  const isRegistrationPage = location.pathname.includes("/registration/");
  const { validate } = CertificateAndLicence(formData, setErrors);

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

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
    dispatch(editStaff({ ...editPayload }));
  }, []);

  const formatDate = (date: string | undefined) =>
    date ? moment(date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";

  const onSubmit = () => {
    const validationErrors = validate();

    const newErrors: any = { ...validationErrors };
    if (_.isEmpty(formData.sport)) {
      newErrors.sport = USER_ERROR.SPORT;
    }
    if (!_.isEmpty(formData.coachingCertifications)) {
      const dateOfCertificationErrors = validateNewSingleDates(
        formData.dateOfCertification,
        0,
        "Date Of Certification",
        true,
        "dateOfCertification",
        10
      );
      const expiryDateErrors = validateNewSingleDates(
        formData.expiryDate,
        10,
        "Expiry Date",
        true,
        "expiryDate",
        10
      );
      Object.assign(newErrors, expiryDateErrors, dateOfCertificationErrors);
      if (
        !formData.issuingOrganization ||
        formData.issuingOrganization.trim() === ""
      ) {
        newErrors.issuingOrganization = "Issuing Organization is required.";
      }
      if (!formData.level || formData.level.trim() === "") {
        newErrors.level = "Level is required.";
      }
      if (
        !formData.levelCertificate ||
        formData.levelCertificate.trim() === ""
      ) {
        newErrors.levelCertificate = "Level Certificate is required.";
      }
    }
    setErrors(newErrors);
    if (_.isEmpty(newErrors)) {
      const { levelCertificate, certificationLevel, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        expiryDate: formatDate(formData.expiryDate),
        dateOfCertification: formatDate(formData.dateOfCertification),
        expiry: formatDate(formData.expiry),
        section: "certificatedetails",
        staffID: parsedData.staffID || staffEditId,
      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
      const {
        coachingCertifications,
        issuingOrganization,
        dateOfCertification,
        expiryDate,
        level,
      } = formData;
      const updateData = {
        coachingCertifications,
        dateOfCertification,
        expiryDate,
        issuingOrganization,
        level,
      };
      const trimmedRests = trimFormData(updateData);
      const datas = {
        ...trimmedRests,
        ...(editShowAcadamic
          ? {}
          : { staffID: parsedData.staffID || staffEditId }),

        sportID: +teamId,
        expiryDate: formatDate(formData.expiryDate),
        dateOfCertification: formatDate(formData.dateOfCertification),
        certificationID: acadamicId,
      };
      if (!_.isEmpty(formData.coachingCertifications)) {
        dispatch(
          addAcademicQualification({
            url: editShowAcadamic
              ? "/UpdateStaffCertification"
              : "/InsertStaffCertification",
            payload: datas,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (staffAddcertificateData && staffAddcertificateData.code === 200) {
      setAlertType("success");
      setAlertMessage(
        `Staff member ${staffEditId ? "updated" : "added"} successfully`
      );
      dispatch(clearAddState());
      setShowBanner(true);
      removeLocalStorage("addStaffData");
      setLoading(true);
      setRouteHandel(false);
      setDisableRouting(false);
      if (formData.certificationLevel) {
        const data = new FormData();
        data.append("sportID", teamId);
        data.append(
          "certificateID",
          coachingCertificationsData?.data?.certificationID
        );
        data.append("file", formData.certificationLevel);
        data.append("moduleID", parsedData.staffID || staffEditId);
        data.append("moduleName", "staff");
        data.append("section", "CoachingCertificate");
        if (editShowAcadamic) {
          data.append("fileID", fileId);
          data.append("updateSection", "AcademicQualification");
        }
        dispatch(
          academicFileUpload({ url: "/CertificationFileUpload", payload: data })
        );
      }

      if (isRegistrationPage) {
        setTimeout(() => {
          router.push(`/registration`);
          setLoading(false);
        }, 3000);
      } else {
        if (staffEditId) {
          onClose();
        } else {
          setTimeout(() => {
            router.push(`/teams/${teamId}/staffs`);
            setLoading(false);
          }, 2000);
        }
      }
    } else if (
      staffAddcertificateData &&
      staffAddcertificateData.code === 500
    ) {
      setAlertType("error");
      setAlertMessage(
        `${staffAddcertificateData && staffAddcertificateData.message}`
      );
      setShowBanner(true);
      dispatch(clearAddState());
    }
  }, [staffAddcertificateData]);

  useEffect(() => {
    if (parsedData.certificatedetails && !staffEditId) {
      const sport = parsedData.certificatedetails.sport || "";
      const selOption: any = _.filter(
        SportsOption,
        (x: any) => x.value && _.includes(sport.split(","), x.value.toString())
      );
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [];
      setSelectedSportsOption(selOption);
      setFormData((formData: any) => ({
        ...formData,
        coachingCertifications:
          parsedData.certificatedetails.coachingCertifications || "",
        issuingOrganization:
          parsedData.certificatedetails.issuingOrganization || "",
        level: parsedData.certificatedetails.level || "",
        federationLicence:
          parsedData.certificatedetails.federationLicence || "",
        languagesSpoken: parsedData.certificatedetails.languagesSpoken || "",
        sport: selectedValues.join(","),
        medicalIssues: parsedData.certificatedetails.medicalIssues || "",
        previousSportEthicalConduct:
          parsedData.certificatedetails.previousSportEthicalConduct || "",
        detailedTasks:
          parsedData.certificatedetails.detailedTasks || "Manage team training",
        levelCertificate: parsedData.certificatedetails.levelCertificate || "",
        expiryDate: moment(
          parsedData.certificatedetails?.expiryDate,
          ["DD/MM/YYYY", moment.ISO_8601],
          true
        ).isValid()
          ? formatDates(parsedData.certificatedetails.expiryDate)
          : "",

        dateOfCertification: moment(
          parsedData.certificatedetails?.dateOfCertification,
          ["DD/MM/YYYY", moment.ISO_8601],
          true
        ).isValid()
          ? formatDates(parsedData.certificatedetails.dateOfCertification)
          : "",
        expiry: moment(
          parsedData.certificatedetails?.expiry,
          ["DD/MM/YYYY", moment.ISO_8601],
          true
        ).isValid()
          ? formatDates(parsedData.certificatedetails.expiry)
          : "",
      }));
    }
  }, [getSportList]);

  useEffect(() => {
    if (editStaffData && staffEditId) {
      const sport = editStaffData.sport || "";
      const selOption: any = _.filter(
        SportsOption,
        (x: any) => x.value && _.includes(sport.split(","), x.value.toString())
      );
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [];
      setSelectedSportsOption(selOption);
      setFormData((formData: any) => ({
        ...formData,
        coachingCertifications: editStaffData.coachingCertifications || "",
        issuingOrganization: editStaffData.issuingOrganization || "",
        level: editStaffData.level || "",
        federationLicence: editStaffData.federationLicence || "",
        languagesSpoken: editStaffData.languagesSpoken || "",
        sport: selectedValues.join(","),
        medicalIssues: editStaffData.medicalIssues || "",
        previousSportEthicalConduct:
          editStaffData.previousSportEthicalConduct || "",
        detailedTasks: editStaffData.detailedTasks || "Manage team training",
        levelCertificate: editStaffData.levelCertificate || "",
        // expiryDate: moment(editStaffData?.expiryDate, ["DD/MM/YYYY", moment.ISO_8601], true).isValid()
        //   ? formatDates(editStaffData.expiryDate)
        //   : "",

        // dateOfCertification: moment(editStaffData?.dateOfCertification, ["DD/MM/YYYY", moment.ISO_8601], true).isValid()
        //   ? formatDates(editStaffData.dateOfCertification)
        //   : "",
        expiry: moment(
          editStaffData?.expiry,
          ["DD/MM/YYYY", moment.ISO_8601],
          true
        ).isValid()
          ? formatDates(editStaffData.expiry)
          : "",
      }));
    }
  }, [editStaffData]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      levelCertificate: file?.name,
      certificationLevel: file,
    }));
    setErrors({
      ...errors,
      levelCertificate: "",
    });
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

  const handleFile = () => {
    if (fileCertificateRef.current) {
      fileCertificateRef.current.click();
    }
  };

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
        // moduleName: modulename,
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
        levelCertificate: "",
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        levelCertificate: "",
      }));
    }
  };

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      certificatedetails: formData,
    }));
    setActiveStep(3);
  };

  const handleChangeSports = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedSportsOption(selectedOption);
      setFormData({
        ...formData,
        sport: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        sport: "",
      });
    }
  };

  const teamsNames = getSportList && getSportList.data;
  useEffect(() => {
    const teams: any = getDefaultOption(teamsNames);
    setSportsOption(teams);
  }, [teamsNames]);

  const getDefaultOption = (teamsNames: any) => {
    const defaultOptions = [];
    for (const item in teamsNames) {
      defaultOptions.push({
        label: teamsNames[item].sportName,
        value: teamsNames[item].sportID,
      });
    }
    return defaultOptions;
  };

  useEffect(() => {
    if (getSportList?.data && teamId) {
      const sport = parsedData?.certificatedetails?.sport || "";
      if (_.isEmpty(sport)) {
        const data: any = getDefaultOption(getSportList.data);
        const selOption: any = _.filter(
          data,
          (x: any) =>
            x.value && _.includes(teamId.split(","), x.value.toString())
        );
        setSelectedSportsOption(selOption);
        const selectedValues = Array.isArray(selOption)
          ? selOption.map((option: any) => option.value)
          : [];
        setFormData({
          ...formData,
          sport: selectedValues.join(","),
        });
      }
    }
  }, [getSportList?.data, teamId]);

  const acadamicClear = () => {
    setFormData({
      ...formData,
      coachingCertifications: "",
      issuingOrganization: "",
      dateOfCertification: "",
      expiryDate: "",
      level: "",
      levelCertificate: "",
      certificationLevel: "",
    });
  };

  const handleAcadamicQualification = () => {
    const validationErrors: any = {};
    if (
      !formData.coachingCertifications ||
      formData.coachingCertifications.trim() === ""
    ) {
      validationErrors.coachingCertifications =
        "Coaching Certifications is required.";
    }
    if (!_.isEmpty(formData.coachingCertifications)) {
      const dateOfCertificationErrors = validateNewSingleDates(
        formData.dateOfCertification,
        0,
        "Date Of Certification",
        true,
        "dateOfCertification",
        10
      );
      const expiryDateErrors = validateNewSingleDates(
        formData.expiryDate,
        10,
        "Expiry Date",
        true,
        "expiryDate",
        10
      );
      Object.assign(
        validationErrors,
        expiryDateErrors,
        dateOfCertificationErrors
      );
      if (
        !formData.issuingOrganization ||
        formData.issuingOrganization.trim() === ""
      ) {
        validationErrors.issuingOrganization =
          "Issuing Organization is required.";
      }
      if (!formData.level || formData.level.trim() === "") {
        validationErrors.level = "Level is required.";
      }
      if (
        !formData.levelCertificate ||
        formData.levelCertificate.trim() === ""
      ) {
        validationErrors.levelCertificate = "Level Certificate is required.";
      }
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const {
        coachingCertifications,
        issuingOrganization,
        dateOfCertification,
        expiryDate,
        level,
      } = formData;
      const updateData = {
        coachingCertifications,
        dateOfCertification,
        expiryDate,
        issuingOrganization,
        level,
      };
      const trimmedRest = trimFormData(updateData);
      const data = {
        ...trimmedRest,
        staffID: parsedData.staffID || staffEditId,
        sportID: +teamId,
        expiryDate: formatDate(formData.expiryDate),
        dateOfCertification: formatDate(formData.dateOfCertification),
        certificationID: acadamicId,
      };
      dispatch(
        addAcademicQualification({
          url: editShowAcadamic
            ? "/UpdateStaffCertification"
            : "/InsertStaffCertification",
          payload: data,
        })
      );
    }
  };

  const isEdit = (data: any) => {
    setEditShowAcadamic(true);
    setFormData((formData: any) => ({
      ...formData,
      coachingCertifications: data.coachingCertifications || "",
      issuingOrganization: data.issuingOrganization || "",
      dateOfCertification: data.dateOfCertification || "",
      expiryDate: data.expiryDate || "",
      level: data.level || "",
      levelCertificate: data?.fileList?.[0]?.fileName ?? "",
    }));
    setAcadamicId(data.certificateID);
    const academicQualificationData = _.find(
      data.fileList,
      (attachment) =>
        attachment.documentSection.toLowerCase() === "academicqualification"
    );
    setFileId(academicQualificationData?.fileID);
  };

  const tableHeaders = [
    "Professional Certifications",
    "Issuing Organization",
    "Date Of Certification",
    "Expiry Date",
    "Level",
    "Actions",
  ];

  useEffect(() => {
    if (coachingCertificationsData && coachingCertificationsData.code === 200) {
      dispatch(editStaff({ ...editPayload }));
      if (formData.certificationLevel) {
        const data = new FormData();
        data.append("sportID", teamId);
        data.append(
          "certificateID",
          coachingCertificationsData?.data?.certificationID
        );
        data.append("file", formData.certificationLevel);
        data.append("moduleID", parsedData.staffID || staffEditId);
        data.append("moduleName", "staff");
        data.append("section", "CoachingCertificate");
        dispatch(
          academicFileUpload({ url: "/CertificationFileUpload", payload: data })
        );
      }
      setEditShowAcadamic(false);
      dispatch(clearAddAcademicState());
      acadamicClear();
    } else if (
      coachingCertificationsData &&
      coachingCertificationsData.code === 500
    ) {
      // setShowBanner(true);
      dispatch(clearAddAcademicState());
    }
  }, [coachingCertificationsData]);

  useEffect(() => {
    if (
      deletecoachingCertificationsData &&
      deletecoachingCertificationsData.code === 200
    ) {
      dispatch(editStaff({ ...editPayload }));
      setTimeout(() => {
        dispatch(clearAcademicQualificationDeleteState());
      }, 2000);
    }
  }, [deletecoachingCertificationsData]);

  useEffect(() => {
    if (coachingFileUploadData && coachingFileUploadData.code === 200) {
      dispatch(editStaff({ ...editPayload }));
      setTimeout(() => {
        dispatch(clearAcademicFileUploadState());
      }, 2000);
    }
  }, [coachingFileUploadData]);

  useEffect(() => {
    if (
      certificateFileUploadDelete &&
      certificateFileUploadDelete.code === 200
    ) {
      dispatch(editStaff({ ...editPayload }));
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

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={1}>
        {editStaffData && editStaffData?.certificationList?.length > 0 ? (
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
                    editStaffData?.certificationList?.length > 0 &&
                    editStaffData.certificationList.map(
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
                              }}
                              className="dubai-regular"
                            >
                              {row.coachingCertifications || "--"}
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
                              {row.issuingOrganization || "--"}
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
                              {row.dateOfCertification || "--"}
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
                              {row.expiryDate || "--"}
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
                              {row.level || "--"}
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
                            <Tooltip title={"Add file"}>
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
                              deleteResponse={deletecoachingCertificationsData}
                              clearDelete={
                                clearAcademicQualificationDeleteState
                              }
                              module={"certificationID"}
                              title={"Delete Staff Certification"}
                              getCurrentSport={teamId}
                              deleteUrl={"/DeleteStaffCertification"}
                              rowData={row.certificateID}
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
          <Box width="100%" pl={"2rem"}>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Professional Certifications
                  </Typography>
                  <CustomTextField
                    name="coachingCertifications"
                    placeholder="Enter Coaching Certifications"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.coachingCertifications}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.coachingCertifications && (
                    <Typography variant="caption" className="error-message">
                      {errors.coachingCertifications}
                    </Typography>
                  )}
                  <Grid
                    container
                    spacing={1}
                    justifyContent="start"
                    alignItems="center"
                    mt={1}
                  >
                    <Grid alignItems="flex-start">
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
                          formatType={FILE_FORMAT_PDF_IMAGE}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          flag={DROPZONE_IMAGE_FLAG.Level}
                          setData={setFormData}
                          formData={formData}
                          modulename="Staff"
                          fileInputRef={fileCertificateRef}
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
                          onClick={handleFile}
                          style={{
                            cursor: "pointer",
                            color: "#00426A",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "400px",
                          }}
                        >
                          {formData.levelCertificate ? (
                            <>{formData.levelCertificate}</>
                          ) : (
                            <>Upload certificates in PDF/JPEG format</>
                          )}
                        </Typography>
                        {formData.levelCertificate && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => {
                              handleDeleteFile(
                                "Staff",
                                parsedData.staffID || staffEditId,
                                "level"
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
                    {!_.isEmpty(formData.coachingCertifications) ? (
                      <span className="asterisk" style={{color: "#e4002b"}}>*</span>
                       ) : (
                      ""
                    )}
                  </Grid>

                  {errors.levelCertificate && (
                    <Typography variant="caption" className="error-message">
                      {errors.levelCertificate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Issuing organization{" "}
                    {!_.isEmpty(formData.coachingCertifications) ? (
                      <span className="asterisk">*</span>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <CustomTextField
                    name="issuingOrganization"
                    placeholder="Enter Issuing organization"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.issuingOrganization}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.issuingOrganization && (
                    <Typography variant="caption" className="error-message">
                      {errors.issuingOrganization}
                    </Typography>
                  )}
                </Grid>
                <Grid container item xs={12} md={5.75} spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Date of Certification{" "}
                      {!_.isEmpty(formData.coachingCertifications) ? (
                        <span className="asterisk">*</span>
                      ) : (
                        ""
                      )}
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="dateOfCertification"
                      label="Date of Certification"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(10, "years")}
                      maxDate={moment()}
                      onChange={dateChange}
                      defaultValue={formData && formData.dateOfCertification}
                    />

                    {errors.dateOfCertification && (
                      <Typography variant="caption" className="error-message">
                        {errors.dateOfCertification}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Expiry Date{" "}
                      {!_.isEmpty(formData.coachingCertifications) ? (
                        <span className="asterisk">*</span>
                      ) : (
                        ""
                      )}
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="expiryDate"
                      label="Date of Expiry Date"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(40, "years")}
                      // minDate={formData.dateOfCertification || moment().subtract(50, "years")}
                      maxDate={moment().add(10, "years")}
                      onChange={dateChange}
                      defaultValue={formData && formData.expiryDate}
                    />

                    {errors.expiryDate && (
                      <Typography variant="caption" className="error-message">
                        {errors.expiryDate}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Level{" "}
                    {!_.isEmpty(formData.coachingCertifications) ? (
                      <span className="asterisk">*</span>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <CustomTextField
                    name="level"
                    placeholder="Enter Level"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.level}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.level && (
                    <Typography variant="caption" className="error-message">
                      {errors.level}
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
                      disabled={coachingCertificationsData.loading}
                      startIcon={<AddBoxOutlinedIcon />}
                      style={{
                        color: "rgba(0, 66, 106, 1)",
                        borderColor: "rgba(0, 66, 106, 1)",
                      }}
                    >
                      {coachingCertificationsData.loading
                        ? "Loading..."
                        : editShowAcadamic
                        ? "Update Certificate"
                        : "Add Certificate"}
                    </Button>
                  </Box>
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
                      name="federationLicence"
                      placeholder="Enter Federation License"
                      type="text"
                      variant="outlined"
                      fullWidth
                      value={formData.federationLicence}
                      onChange={handleChange}
                      className="Text-field-customise"
                      inputProps={{ maxLength: 100 }}
                      onKeyPress={(e) => {
                        if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.federationLicence && (
                      <Typography variant="caption" className="error-message">
                        {errors.federationLicence}
                      </Typography>
                    )}
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
                      name="expiry"
                      label="Date of Expiry"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(50, "years")}
                      maxDate={moment().add(10, "years")}
                      onChange={dateChange}
                      defaultValue={formData && formData.expiry}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Sport <span className="asterisk">*</span>
                  </Typography>
                  <ReactSelect
                    isMulti={true}
                    name="sport"
                    className="select2"
                    classNamePrefix="select"
                    handleChangeReactSelect={handleChangeSports}
                    options={SportsOption}
                    value={SelectedSportsOption}
                    isDisabled={!SportsOption}
                    placeholder="Select Sport"
                  />
                  {errors.sport && (
                    <Typography variant="caption" className="error-message">
                      {errors.sport}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Previous Sport Ethical Conduct
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.previousSportEthicalConduct || ""}
                    name="previousSportEthicalConduct"
                    minHeight={"150px"}
                  />
                  {errors.previousSportEthicalConduct && (
                    <Typography variant="caption" className="error-message">
                      {errors.previousSportEthicalConduct}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "7rem",
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
                  disabled={staffAddcertificateData.loading}
                >
                  {staffAddcertificateData.loading
                    ? "Loading..."
                    : staffEditId
                    ? "Update"
                    : "Save"}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default CertificationsAndLicenses;

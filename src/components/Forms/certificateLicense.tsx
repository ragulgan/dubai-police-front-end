// pages/staff/edit.tsx
import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  SnackbarCloseReason,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import CustomDatePicker from "../Fields/CustomDatePicker";
import CustomAgeField from "../Fields/CustomAgeField";
import moment from "moment";
import CustomSelect from "../Fields/CustomSelect";
import DropDown from "../Fields/DropDown";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_PDF_IMAGE,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
} from "@/utils/constants";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import {
  clearUpdateState,
  UpdateStaff,
} from "@/redux/slices/staff/staffUpdateSlice";
import {
  RootState,
  singleFileUploadDispatch,
  AppDispatch,
} from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { formatDate, isValidField, trimFormData } from "@/utils/helper";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { isEmpty } from "lodash";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import _ from "lodash";
import ReactSelect from "../Fields/ReactSelect";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { usePathname } from "next/navigation";
import { getLanguagesListAPI } from "@/redux/slices/language/getLanguageListSlice";
import DeleteDialog from "../dialogs/DeleteDialog";
import {
  addAcademicQualification,
  clearAddAcademicState,
} from "@/redux/slices/athlete/athleteAcademicQualification";
import { useRouter } from "next/router";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import FileDownload from "./FileDownload ";
import {
  clearAcademicQualificationDeleteState,
  DeleteAcademicQualificationByID,
} from "@/redux/slices/athlete/deleteAcademicQualification";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  academicFileUpload,
  clearAcademicFileUploadState,
} from "@/redux/slices/fileupload/academicFileUpload";
import { formatObjectToString } from "@/utils/datetime";

interface Props {
  id: number;
  onClose: any;
  editStaffData: any;
}

const CertificateLicense: React.FC<Props> = ({
  id,
  onClose,
  editStaffData,
}) => {
  const [formData, setFormData] = useState<any>({});
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const { handleSubmit, control, setValue, watch, setError, clearErrors } =
    useForm({
      defaultValues: {
        coachingCertifications: "",
        medicalIssueDetails: "",
        issuingOrganization: "",
        dateOfCertificate: null,
        expiryDate: null,
        level: "",
        federationLicence: "",
        expiry: "",
        // languagesSpoken: '',
        sport: "",
        medicalIssues: "",
        previousSportEthicalConduct: "",
      },
    });
  const router = useRouter();
  const { teamID } = router.query;
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const dispatch: AppDispatch = useDispatch();
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const [SportsOption, setSportsOption] = useState();
  const [error, setErrors] = useState<any>();
  const [SelectedSportsOption, setSelectedSportsOption] = useState("");
  const [tableData, setTableData] = useState<any>(null);
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const currentNav = usePathname();
  const teamId: any = currentNav?.split("/")[2];
  const getLanguagesList = useSelector((state: any) => {
    return state.getLanguagesList;
  });
  const coachingCertificationsData = useSelector(
    (state: RootState) => state.addAcademicQualification
  );
  const deletecoachingCertificationsData = useSelector(
    (state: RootState) => state.deleteAcademicQualification
  );
  const editStaffUpdatedData = useSelector((state: RootState) => {
    return state &&
      state.staffEdit &&
      !isEmpty(state?.staffEdit?.data) &&
      !isEmpty(state?.staffEdit?.data[0])
      ? state.staffEdit.data[0]
      : null;
  });

  // const deletecoachingCertificationsData = useSelector(
  //   (state: RootState) => state.deleteAcademicQualification
  // );
  const academicQualificationFileUpload = useSelector(
    (state: RootState) => state.academicFileUpload
  );

  const coachingCertificationsValue = watch("coachingCertifications");
  const medicalIssuesValue = watch("medicalIssues");
  const issuingOrganizationValue = watch("issuingOrganization");
  const dateOfCertificationValue = watch("dateOfCertificate");
  const expiryDateValue = watch("expiryDate");
  const levelValue = watch("level");

  const tableHeaders = [
    "Coaching Certifications",
    "Issuing Organization",
    "Date Of Certification",
    "Expiry Date",
    "Level",
    "Actions",
  ];

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
    dispatch(getLanguagesListAPI());
  }, []);
  const singleUpload = useSelector((state: any) => state.singleUpload);

  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    if (editStaffUpdatedData?.certificationList.length <= 1) {
      setValue(
        "coachingCertifications",
        editStaffData && editStaffData.coachingCertifications
      );
      setValue(
        "medicalIssueDetails",
        editStaffData && editStaffData.medicalIssueDetails
      );
      setValue(
        "issuingOrganization",
        editStaffData && editStaffData.issuingOrganization
      );
      setValue(
        "dateOfCertificate",
        editStaffData && editStaffData.dateOfCertificate
      );
      setValue("expiryDate", editStaffData && editStaffData.expiryDate);
      setValue("level", editStaffData && editStaffData.level);
      setValue(
        "federationLicence",
        editStaffData && editStaffData.federationLicence
      );
      setValue("expiry", editStaffData && editStaffData.expiry);
      // if (editStaffData && editStaffData.languagesSpoken) {
      //   const initialLanguages = editStaffData.languagesSpoken
      //     .split(",")
      //     .map((lang: any) => lang.toLowerCase())
      //     .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
      //   setValue("languagesSpoken", initialLanguages);
      // }
      setValue("sport", editStaffData && editStaffData.sport);
      setValue(
        "previousSportEthicalConduct",
        editStaffData && editStaffData.previousSportEthicalConduct
      );
      setValue("medicalIssues", editStaffData && editStaffData.medicalIssues);
      const data: any = getDefaultOption(getSportList?.data);
      const selOption: any = _.filter(data, (x: any) => {
        if (x.value && typeof x.value !== "undefined") {
          return _.includes(
            !_.isEmpty(editStaffData?.sport.trim())
              ? editStaffData?.sport.split(",")
              : teamId.split(","),
            x.value.toString()
          );
        }
      });
      setSelectedSportsOption(selOption);
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [selOption.value];
      setValue("sport", selectedValues.join(","));
      if (editStaffData && !isEmpty(editStaffData.attachmentList)) {
        const Level =
          editStaffData &&
          editStaffData.attachmentList.filter(
            (item: any) =>
              item.documentSection.toLowerCase() === "Level".toLowerCase()
          );
        setFormData({
          ...formData,
          levelCertificate: Level[0]?.fileName || "",
          levelCertificateFile: Level[0] || "",
          sport: selectedValues.join(","),
        });
      }
    }
  }, [editStaffData]);

  useEffect(() => {
    if (singleUpload.code === 200) {
      dispatch(clearState());
      // dispatch(isUpdatedFunc(true));
    }
  }, [singleUpload]);
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (_.isEmpty(SelectedSportsOption)) {
      setErrors({ ...error, sport: "Please select an sport." });
    } else {
      const updateBodyObj: any = {
        ...data,
        section: "certificatedetails",
        staffID: id,

        expiry: isValidField(data, "expiry") ? formatDate(data.expiry) : "",
        dateOfCertificate: isValidField(data, "dateOfCertificate")
          ? formatDate(data.dateOfCertificate)
          : "",
        expiryDate: isValidField(data, "expiryDate")
          ? formatDate(data.expiryDate)
          : "",
        // languagesSpoken: data.languagesSpoken && data.languagesSpoken.join(","),
        medicalIssueDetails:
          medicalIssuesValue === "Yes" ? data.medicalIssueDetails : "",
      };
      dispatch(UpdateStaff(updateBodyObj));
    }
  };
  const handleFileChange = (fileData: any, flag: any) => {
    setFormData((prevData: any) => ({
      levelCertificate:
        flag === DROPZONE_IMAGE_FLAG.LEVEL ? fileData?.name : prevData.Level,
      levelCertificateFile:
        flag === DROPZONE_IMAGE_FLAG.LEVEL ? fileData : prevData.Level,
    }));

    if (fileData && fileData.file) {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("modulename", fileData.modulename);
      formData.append("moduleid", id.toString());
      fileUploadDispatch(singleFileUpload(formData));
    }
  };
  useEffect(() => {
    if (
      staffUpdateData &&
      staffUpdateData.code === 200 &&
      staffUpdateData.status === "succeeded"
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // onClose(false)
      dispatch(clearUpdateState());
    } else if (
      staffUpdateData &&
      staffUpdateData.code === 500 &&
      staffUpdateData.status === "failed"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearUpdateState());
    }
  }, [staffUpdateData]);
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
    const data = {
      moduleName: modulename,
      moduleID: moduleId,
      docSection: fileType,

      fileID: fileID,
    };
    dispatch(deleteFile(data));
    setFormData((prev: any) => ({
      ...prev,
      levelCertificate: "",
    }));
  };

  // useEffect(() => {
  //   if (!_.isEmpty(editStaffData)) {
  //     setFormData({
  //       ...formData,
  //       dateOfCertificate: editStaffData && editStaffData.dateOfCertificate,
  //       expiryDate: editStaffData && editStaffData.expiryDate,
  //       expiry: editStaffData && editStaffData.expiry,
  //     });
  //   }
  // }, [editStaffData])

  const payload: any = {
    staffID: id,
  };

  const dateChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setValue(name, value);
  };

  const getMinDate = () => {
    const contractStart = moment(
      formData.dateOfCertificate,
      "DD/MM/YYYY",
      true
    );
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(40, "years");
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
      setErrors({ ...error, sport: "" });
      setValue("sport", selectedValues.join(","));
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

  // useEffect(() => {
  //   const data: any = getDefaultOption(getSportList?.data);
  //   const selOption: any = _.filter(data, (x: any) => {
  //     if (x.value && typeof x.value !== 'undefined') {
  //       return _.includes(!_.isEmpty(editStaffData?.sport.trim()) ? editStaffData?.sport.split(",") : teamId.split(","), x.value.toString());
  //     }
  //   });
  //   setSelectedSportsOption(selOption);
  //   const selectedValues = Array.isArray(selOption)
  //     ? selOption.map((option: any) => option.value)
  //     : [selOption.value];
  //   setValue(
  //     "sport",
  //     selectedValues.join(",")
  //   );
  //   setFormData({
  //     ...formData,
  //     sport: selectedValues.join(","),
  //   });
  // }, [editStaffData])

  const handleCertification = () => {
    const validationErrors: any = {};

    if (coachingCertificationsValue === "") {
      setError("coachingCertifications", {
        type: "manual",
        message: "Coaching Certifications is required.",
      });
    } else {
      clearErrors("coachingCertifications");
    }

    if (coachingCertificationsValue !== "") {
      const updateData = {
        coachingCertifications: coachingCertificationsValue,
        issuingOrganization: issuingOrganizationValue,
        dateOfCertificate:
          typeof dateOfCertificationValue !== "string"
            ? dateOfCertificationValue &&
              formatObjectToString(dateOfCertificationValue, "DD/MM/YYYY")
            : dateOfCertificationValue,
        expiryDate:
          typeof expiryDateValue !== "string"
            ? expiryDateValue &&
              formatObjectToString(expiryDateValue, "DD/MM/YYYY")
            : expiryDateValue,
        level: levelValue,
      };
      const trimmedRest = trimFormData(updateData);
      const data = {
        ...trimmedRest,
        staffID: id,

        sportID: Number(teamID),
      };
      dispatch(
        addAcademicQualification({
          url: "/InsertStaffCertification",
          payload: data,
        })
      );
    }
  };

  useEffect(() => {
    if (
      deletecoachingCertificationsData &&
      deletecoachingCertificationsData.code === 200
    ) {
      const payload: any = {
        staffID: id,

        sportID: Number(teamID),
      };
      dispatch(editStaff(payload));
    }
  }, [deletecoachingCertificationsData]);

  useEffect(() => {
    if (coachingCertificationsData && coachingCertificationsData.code === 200) {
      const editParams: any = {
        staffID: id,

        sportID: Number(teamID),
      };
      // dispatch(isUpdatedFunc(true));
      if (formData.levelCertificateFile) {
        const data = new FormData();
        data.append("sportID", String(teamID));
        data.append(
          "certificateID",
          coachingCertificationsData?.data?.certificationID
        );
        data.append("file", formData.levelCertificateFile);
        data.append("moduleID", String(id));
        data.append("moduleName", "staff");
        data.append("section", "CoachingCertificate");
        dispatch(
          academicFileUpload({ url: "/CertificationFileUpload", payload: data })
        );
      }
      if (!formData.levelCertificateFile) {
        dispatch(editStaff(editParams));
      }
      dispatch(clearAddAcademicState());
    }
  }, [coachingCertificationsData]);

  useEffect(() => {
    if (!isEmpty(editStaffUpdatedData?.certificationList)) {
      // if(!isEmpty(editStaffUpdatedData.academicQualificationList)){
      setTableData(editStaffUpdatedData?.certificationList);
    }
  }, [editStaffUpdatedData, coachingCertificationsData]);

  const downloadFile = (file: any) => {
    const downloader = FileDownload({
      filePath: file.filePath,
      fileName: file.fileName,
    });
    downloader.trigger();
  };

  useEffect(() => {
    if (academicQualificationFileUpload.code === 200) {
      const editParams: any = {
        staffID: id,

        sportID: Number(teamID),
      };
      dispatch(editStaff(editParams));
      dispatch(clearAcademicFileUploadState());
    }
  }, [academicQualificationFileUpload]);

  return (
    <Fade in={true} timeout={1000}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={12} flexDirection={"column"}>
            {!isEmpty(tableData) ? (
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
                    {!isEmpty(tableData) &&
                      tableData.map((row: any, index: any) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(even)": {
                              backgroundColor: "#EFFAF9",
                            },
                          }}
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
                              {row.dateOfCertificate || "--"}
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
                          <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
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
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Grid>
        </Grid>
        <CustomTextField
          name="coachingCertifications"
          control={control}
          label="Coaching Certifications"
          placeholder="Enter Coaching Certifications"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9\s,./-]*$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Rank cannot exceed 100 characters",
            },
          }}
        />
        <Grid
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
                formatType={FILE_FORMAT_PDF_IMAGE}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.LEVEL}
                setData={setFormData}
                formData={formData}
                modulename="Staff"
                moduleId={id.toString()}
                fileInputRef={fileCertificateRef}
                // fetchDataApi={() => dispatch(editStaff(payload))}
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
                onClick={handleFile}
                style={{
                  cursor: "pointer",
                  color: "#00426A",
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
                    handleDeleteFile("Staff", id, "Level");
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
        <CustomTextField
          name="issuingOrganization"
          control={control}
          label="Issuing organization"
          placeholder="Enter Issuing organization"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9\s,./-]*$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Rank cannot exceed 100 characters",
            },
          }}
        />
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={6} md={6} flexDirection={"column"}>
            <CustomDatePicker
              control={control}
              name="dateOfCertificate"
              label="Date of Certification"
              defaultValue={
                editStaffUpdatedData?.certificationList.length <= 1 &&
                editStaffData &&
                editStaffData.dateOfCertificate
              }
              boxmb={0.8}
              onChange={dateChange}
              minDate={moment().subtract(40, "years")}
              maxDate={moment()}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <CustomDatePicker
              control={control}
              name="expiryDate"
              minDate={getMinDate()}
              label="Expiry Date"
              required={false}
              defaultValue={
                editStaffUpdatedData?.certificationList.length <= 1 &&
                editStaffData &&
                editStaffData.expiryDate
              }
              boxmb={0.8}
              onChange={dateChange}
            />
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              margin: 1,
            }}
          >
            <Button
              variant="outlined"
              className="text-capitalize dubai-med"
              onClick={handleCertification}
              disabled={coachingCertificationsData.loading}
              startIcon={<AddBoxOutlinedIcon />}
              style={{
                color: "rgba(0, 66, 106, 1)",
                borderColor: "rgba(0, 66, 106, 1)",
              }}
            >
              {coachingCertificationsData.loading
                ? "Loading..."
                : "Add Certificate"}
            </Button>
          </Box>
        </Grid>
        <CustomTextField
          name="level"
          control={control}
          label="Level"
          placeholder="Enter Level"
          rules={{
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Rank cannot exceed 20 characters",
            },
          }}
        />
        <CustomTextField
          name="federationLicence"
          control={control}
          label="Federation Licence"
          placeholder="Enter Federation Licence"
          rules={{
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Federation Licence cannot exceed 50 characters",
            },
          }}
        />
        <Box mt={1.5}>
          <CustomDatePicker
            control={control}
            name="expiry"
            label="Expiry"
            // required={true}
            boxmb={0.8}
            defaultValue={editStaffData && editStaffData.expiry}
            onChange={dateChange}
          />
        </Box>
        {/* <DropDown
          name="languagesSpoken"
          label="Languages Spoken"
          control={control}
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
        /> */}
        <Box mt={1.5}>
          <Typography gutterBottom className="typography textfield-label bukra">
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
          {error && error.sport ? (
            <Typography variant="caption" className="error-message">
              {error.sport}
            </Typography>
          ) : null}
        </Box>
        <CustomRadioGroup
          name="medicalIssues"
          control={control}
          label="Medical Issues"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
        />
        {medicalIssuesValue && medicalIssuesValue === "Yes" ? (
          <CustomTextField
            control={control}
            name="medicalIssueDetails"
            placeholder="History of knee surgery (requires lighter exercise intensity)"
            textarea={true}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9\s.-]*$/,
                message: "Invalid Format",
              },
              maxLength: {
                value: 200,
                message: "Medical Issues cannot exceed 250 characters",
              },
            }}
          />
        ) : null}
        <CustomTextField
          name="previousSportEthicalConduct"
          control={control}
          label="Previous Sport Ethical Conduct"
          textarea={true}
          placeholder="Previous Sport Ethical Conduct"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9\s.-]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 200,
              message:
                "Previous Sport Ethical Conduct cannot exceed 250 characters",
            },
          }}
        />
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Staff member added successfully!"
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
            onClick={onClose}
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

export default CertificateLicense;

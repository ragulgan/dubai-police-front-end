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
import { useDispatch, useSelector } from "react-redux";
import {
  clearUpdateState,
  UpdateStaff,
} from "@/redux/slices/staff/staffUpdateSlice";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
  PDF_FORMAT,
} from "@/utils/constants";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import {
  RootState,
  singleFileUploadDispatch,
  AppDispatch,
} from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import {
  formatDate,
  isValidField,
  trimFormData,
  validateString,
} from "@/utils/helper";
import {
  clearAthleteUpdateState,
  UpdateAthleteByID,
} from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import {
  addAcademicQualification,
  clearAddAcademicState,
} from "@/redux/slices/athlete/athleteAcademicQualification";
import FileDownload from "./FileDownload ";
import { isEmpty } from "lodash";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useRouter } from "next/router";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import DeleteDialog from "../dialogs/DeleteDialog";
import {
  clearAcademicQualificationDeleteState,
  DeleteAcademicQualificationByID,
} from "@/redux/slices/athlete/deleteAcademicQualification";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { getAthleteID } from "@/redux/slices/athlete/getAthleteIDSlice";
import {
  academicFileUpload,
  clearAcademicFileUploadState,
} from "@/redux/slices/fileupload/academicFileUpload";

interface Props {
  id: number;
  onClose: any;
  editData: any;
  module: string;
}

const ProfessionalInfo: React.FC<Props> = ({
  id,
  onClose,
  editData,
  module,
}) => {
  const uploadCertificateRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>({});
  const dispatch: AppDispatch = useDispatch();
  const athleteUpdateResponse = useSelector(
    (state: any) => state.athleteUpdateByID
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const [error, setDateError] = useState({});
  const [tableData, setTableData] = useState<any>(null);
  const academicQualificationFileUpload = useSelector(
    (state: RootState) => state.academicFileUpload
  );
  const { handleSubmit, control, setValue, watch, setError, clearErrors } =
    useForm({
      defaultValues: {
        role: "",
        academicQualification: "",
        fieldOfStudy: "",
        universityName: "",
        location: "",
        performanceLevel: "",
        contractType: "",
        currentJobPosition: "",
        currentJobLocation: "",
        dpEmployeeNumber: "",
        rank: "",
        department: "",
        dateOfLastJobPromotion: null,
        dpEmploymentStatus: "",
        disciplinePracticed: "",
        // languagesSpoken: '',
        sportsCategory: "",
        contractEndDate: null,
        contractStartDate: null,
        acknowledgementDate: null,
        pledgeDate: null,
      },
    });

  const [minEndDate, setMinEndDate] = useState(moment());
  const contractStartDate = watch("contractStartDate");
  const router = useRouter();
  const { teamID } = router.query;
  const academicQualificationData = useSelector(
    (state: RootState) => state.addAcademicQualification
  );
  const deleteAcademicQualificationData = useSelector(
    (state: RootState) => state.deleteAcademicQualification
  );
  const getAthleteByIDData = useSelector((state: RootState) => {
    return state &&
      state.getAthleteByID &&
      !isEmpty(state?.getAthleteByID?.data) &&
      !isEmpty(state?.getAthleteByID?.data[0])
      ? state.getAthleteByID.data[0]
      : null;
  });
  const academicQualificationValue = watch("academicQualification");
  const fieldOfStudyValue = watch("fieldOfStudy");
  const locationValue = watch("location");
  const universityNameValue = watch("universityName");
  const tableHeaders = [
    "Academic Qualification",
    "Field of Study",
    "University Name",
    "Location",
    "Actions",
  ];
  const ContractType = [
    { value: "Permanent Contract", label: "Permanent Contract" },
    {
      value: "Collaboration Contract",
      label: "Collaboration Contract",
    },
    { value: "Temporary Contract", label: "Temporary Contract" },
  ];

  const downloadFile = (file: any) => {
    const downloader = FileDownload({
      filePath: file.filePath,
      fileName: file.fileName,
    });
    downloader.trigger();
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
      setFormData({});
    }
  };

  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    const defaultPerformanceLevelValue =
      editData &&
      editData.performanceLevel !== "" &&
      editData.performanceLevel !== "-"
        ? editData.performanceLevel
        : "beginner";
    setValue("role", editData && editData.role);
    setValue(
      "academicQualification",
      editData && validateString(editData.academicQualification)
    );
    setValue("fieldOfStudy", editData && validateString(editData.fieldOfStudy));
    setValue(
      "universityName",
      editData && validateString(editData.universityName)
    );
    setValue("location", editData && validateString(editData.location));
    setValue("location", editData && validateString(editData.location));
    setValue("performanceLevel", defaultPerformanceLevelValue);
    setValue("contractType", editData && editData.contractType);
    setValue("currentJobPosition", editData && editData.currentJobPosition);
    setValue("currentJobLocation", editData && editData.currentJobLocation);
    setValue("dpEmployeeNumber", editData && editData.dpEmployeeNumber);
    setValue("rank", editData && editData.rank);
    setValue("department", editData && editData.department);
    setValue(
      "dateOfLastJobPromotion",
      // editData && editData.dateOfLastJobPromotion
      editData &&
        editData.dateOfLastJobPromotion !== "-" &&
        editData.dateOfLastJobPromotion
        ? editData.dateOfLastJobPromotion
        : null
    );

    setValue("dpEmploymentStatus", editData && editData.dpEmploymentStatus);
    setValue("sportsCategory", editData && editData.sportsCategory);
    setValue("disciplinePracticed", editData && editData.disciplinePracticed);
    setValue(
      "contractEndDate",
      editData && editData.contractEndDate !== "-" && editData.contractEndDate
        ? editData.contractEndDate
        : null
    );
    setValue(
      "pledgeDate",
      editData && editData.pledgeDate !== "-" && editData.pledgeDate
        ? editData.pledgeDate
        : null
    );
    setValue(
      "acknowledgementDate",
      editData &&
        editData.acknowledgementDate !== "-" &&
        editData.acknowledgementDate
        ? editData.acknowledgementDate
        : null
    );
    setValue(
      "contractStartDate",
      editData &&
        editData.contractStartDate &&
        editData.contractStartDate !== "-"
        ? editData.contractStartDate
        : null
    );
    // setValue("languagesSpoken", editData && editData !== '' && editData.languagesSpoken.split(','));
    const contractDoc =
      editData &&
      editData.attachmentList.filter(
        (item: any) =>
          item.documentSection.toLowerCase() ===
          "ContractDocument".toLowerCase()
      );
    const certificateDoc =
      editData &&
      editData.attachmentList.filter(
        (item: any) =>
          item.documentSection.toLowerCase() === "Certificate".toLowerCase()
      );
    setFormData({
      ...formData,
      uploadContract: contractDoc[0]?.fileName || "",
      uploadCertificate: certificateDoc[0]?.fileName || "",
      uploadCertificateFile: certificateDoc[0] || "",
    });
  }, [editData]);

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    const updateBody: any = {
      ...formData,
      dateOfLastJobPromotion: isValidField(formData, "dateOfLastJobPromotion")
        ? formatDate(formData.dateOfLastJobPromotion)
        : "",
      contractStartDate: isValidField(formData, "contractStartDate")
        ? formatDate(formData.contractStartDate)
        : "",
      acknowledgementDate: isValidField(formData, "acknowledgementDate")
        ? formatDate(formData.acknowledgementDate)
        : "",
      pledgeDate: isValidField(formData, "pledgeDate")
        ? formatDate(formData.pledgeDate)
        : "",
      contractEndDate: isValidField(formData, "contractEndDate")
        ? formatDate(formData.contractEndDate)
        : "",
      // languagesSpoken: formData.languagesSpoken.join(","),
      section: "professionaldetails",
      athleteID: id,
    };
    // dispatch(addStaff({ url: "/InsertStaff", payload: data }));
    dispatch(UpdateAthleteByID(updateBody));
  };

  const handleFileChange = (
    fileData: any,
    flag: any,
    modulename: any,
    moduleId: any
  ) => {
    setFormData((prevData: any) => ({
      ...prevData,
      uploadContract:
        flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT
          ? fileData?.name
          : prevData.uploadContract,
      uploadCertificate:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? fileData?.name
          : prevData.uploadCertificate,
      uploadCertificateFile:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? fileData
          : prevData.uploadCertificateFile,
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
      athleteUpdateResponse &&
      athleteUpdateResponse.code === 200 &&
      athleteUpdateResponse.status === "succeeded"
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearAthleteUpdateState());
    } else if (
      athleteUpdateResponse &&
      athleteUpdateResponse.code === 500 &&
      athleteUpdateResponse.status === "failed"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAthleteUpdateState());
    }
  }, [athleteUpdateResponse]);
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
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);
  const fileIDRef = useRef<HTMLInputElement>(null);

  const handleIdClick = () => {
    if (fileIDRef.current) {
      fileIDRef.current.click();
    }
  };

  useEffect(() => {
    const newMinDate = moment(contractStartDate, "YYYY-MM-DD").add(1, "months");

    setMinEndDate(newMinDate);
  }, [contractStartDate]);

  const handlepassClick = () => {
    if (uploadCertificateRef.current) {
      uploadCertificateRef.current.click();
    }
  };

  const handleAcadamicQualification = () => {
    const validationErrors: any = {};

    if (academicQualificationValue === "") {
      setError("academicQualification", {
        type: "manual",
        message: "Academic Qualification is required.",
      });
    } else {
      clearErrors("academicQualification");
    }

    if (academicQualificationValue !== "") {
      // const { fieldOfStudy, academicQualification, universityName, location } = editStaffData;
      const updateData = {
        fieldOfStudy: fieldOfStudyValue,
        universityName: universityNameValue,
        location: locationValue,
        academicQualification: academicQualificationValue,
      };
      const trimmedRest = trimFormData(updateData);
      const data = {
        ...trimmedRest,
        athleteID: id,

        sportID: Number(teamID),
      };
      dispatch(
        addAcademicQualification({
          url: "/InsertAthleteAcademicQualification",
          payload: data,
        })
      );
    }
  };

  useEffect(() => {
    if (academicQualificationData && academicQualificationData.code === 200) {
      const editParams: any = {
        athleteID: id,
        sportID: Number(teamID),
      };
      if (formData.uploadCertificateFile) {
        const data = new FormData();
        data.append("sportID", String(teamID));
        data.append(
          "academicQualificationID",
          academicQualificationData?.data?.academicQualificationID
        );
        data.append("file", formData.uploadCertificateFile);
        data.append("moduleID", String(id));
        data.append("moduleName", "Athlete");
        data.append("section", "Academic Qualification");
        dispatch(
          academicFileUpload({
            url: "/AthleteAcademicQualificationFileUpload",
            payload: data,
          })
        );
      }

      // dispatch(isUpdatedFunc(true));
      if (!formData.uploadCertificateFile) {
        dispatch(getAthleteID(editParams));
      }
      dispatch(clearAddAcademicState());
    }
  }, [academicQualificationData]);

  useEffect(() => {
    if (academicQualificationFileUpload.code === 200) {
      const editParams: any = {
        athleteID: id,
        sportID: Number(teamID),
      };
      dispatch(getAthleteID(editParams));
      dispatch(clearAcademicFileUploadState());
    }
  }, [academicQualificationFileUpload]);

  useEffect(() => {
    if (
      getAthleteByIDData &&
      !isEmpty(getAthleteByIDData.academicQualificationList)
    ) {
      setTableData(getAthleteByIDData.academicQualificationList);
    }
  }, [getAthleteByIDData, academicQualificationData]);

  useEffect(() => {
    if (
      deleteAcademicQualificationData &&
      deleteAcademicQualificationData.code === 200
    ) {
      const payload: any = {
        athleteID: id,
        sportID: Number(teamID),
      };
      dispatch(getAthleteID(payload));
    }
  }, [deleteAcademicQualificationData]);

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
                    {tableData &&
                      !isEmpty(tableData) &&
                      tableData.map((row: any, index: any) => (
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
                              className="dubai-regular text-capitalize"
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
                              deleteResponse={deleteAcademicQualificationData}
                              clearDelete={
                                clearAcademicQualificationDeleteState
                              }
                              module={"academicQualificationID"}
                              title={"Academic Qualification"}
                              getCurrentSport={teamID}
                              deleteUrl={"/DeleteAthleteAcademicQualification"}
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
        <DropDown
          name="academicQualification"
          label="Academic Qualification"
          control={control}
          placeholder={"Select Academic Qualification"}
          // defaultValue={formData && formData.academicQualification}
          options={[
            { value: "bachelor", label: "Bachelor’s Degree" },
            { value: "master", label: "Master’s Degree" },
            { value: "phd", label: "Ph.D." },
            { value: "diploma", label: "Diploma" },
            { value: "highschool", label: "High School" },
          ]}
          variant="outlined"
          required={true}
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
                onFileChange={(file: any, flag: any) =>
                  handleFileChange(file, flag, module, id)
                }
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                modulename="athlete"
                moduleId={id}
                setData={setFormData}
                formData={formData}
                fileInputRef={uploadCertificateRef}
                // fetchDataApi={() => dispatch(editStaff(payload))}
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
                {formData.uploadCertificate ? (
                  <>{formData.uploadCertificate}</>
                ) : (
                  <>Upload Certificate (PDF, DOC, DOCX)</>
                )}
              </Typography>
              {formData.uploadCertificate && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile("athlete", id, "Certificate");
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
          name="fieldOfStudy"
          control={control}
          label="Field of Study"
          placeholder={"Enter Field of Study"}
          rules={{
            // required: "University Name is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Field of Study cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="universityName"
          control={control}
          label="University Name"
          placeholder={"Enter University Name"}
          rules={{
            // required: "University Name is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "University Name cannot exceed 50 characters",
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 1,
          }}
        >
          <Button
            variant="outlined"
            className="text-capitalize"
            onClick={handleAcadamicQualification}
            disabled={academicQualificationData.loading}
            startIcon={<AddBoxOutlinedIcon />}
            style={{
              color: "rgba(0, 66, 106, 1)",
              borderColor: "rgba(0, 66, 106, 1)",
            }}
          >
            {academicQualificationData.loading ? "Loading..." : "Add"}
          </Button>
        </Box>
        <CustomTextField
          name="role"
          control={control}
          label="Role On Team"
          rules={{
            required: "Role On Team is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Role On Team cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="location"
          control={control}
          label="Location"
          placeholder={"Enter Location"}
          rules={{
            // required: "Location is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Location cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="currentJobPosition"
          control={control}
          label="Current Job Position"
          placeholder={"Enter Current Job Position"}
          rules={{
            required: "Current Job Position",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Current Job Position cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="currentJobLocation"
          control={control}
          label="Current Job Location"
          placeholder={"Enter Current Job Location"}
          // rules={{ required: "Current Job Location is required" }}
          rules={{
            required: "Current Job Location",
            pattern: {
              value: /^[a-zA-Z\s,]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 50,
              message: "Current Job Location cannot exceed 100 characters",
            },
          }}
        />

        <CustomTextField
          name="dpEmployeeNumber"
          control={control}
          label="Dubai Police Employee Number"
          placeholder={"Enter Dubai Police Employee Number"}
          rules={{
            // required: "Dubai Police Employee Number",
            pattern: {
              value: /^[a-zA-Z0-9/-\s]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 20,
              message:
                "Dubai Police Employee Number cannot exceed 20 characters",
            },
          }}
        />
        <CustomTextField
          name="rank"
          control={control}
          label="Rank"
          placeholder={"Enter Rank"}
          rules={{
            // required: "Rank is required",
            pattern: {
              value: /^[a-zA-Z0-9\s,./-]*$/,
              message: "Only alphanumeric characters and hyphens are allowed",
            },
            maxLength: {
              value: 50,
              message: "Rank cannot exceed 50 characters",
            },
            // validate: {
            //   containsAlphabet: (value: any) =>
            //     /[a-zA-Z]/.test(value) || "Rank must contain at least one alphabetic character",
            //   notOnlyNumeric: (value: any) =>
            //     !/^\d+$/.test(value) || "Rank cannot be only numeric",
            // },
          }}
        />
        <CustomTextField
          name="department"
          control={control}
          label="Department"
          placeholder={"Enter Department"}
          rules={{
            required: "Department",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 50,
              message: "Department cannot exceed 50 characters",
            },
          }}
        />
        <DropDown
          name="sportsCategory"
          label="Sports Category"
          control={control}
          defaultValue={editData && editData.sportsCategory}
          options={[
            { value: "elite", label: "Elite" },
            { value: "amature", label: "Amature" },
            { value: "junior", label: "Junior" },
          ]}
          variant="outlined"
          required={true}
        />
        <Box mt={1.5}>
          <CustomDatePicker
            control={control}
            name="dateOfLastJobPromotion"
            label="Date of Last Job Promotion"
            // required={true}
            boxmb={0.8}
            defaultValue={editData && editData.dateOfLastJobPromotion}
          />
        </Box>
        {/* <DropDown
          name="dpEmploymentStatus"
          label="Dubai Police Employment Status"
          control={control}
          defaultValue={formData && formData.dpEmploymentStatus}
          placeholder={"Select Dubai Police Employment Status"}
          options={[
            { value: "Permanent Contract", label: "Permanent Contract" },
            {
              value: "Collaboration Contract",
              label: "Collaboration Contract",
            },
            { value: "Temporary Contract", label: "Temporary Contract" },
          ]}
          required={true}
          variant="outlined"
        /> */}
        {/* <DropDown
          name="languagesSpoken"
          label="Languages Spoken"
          control={control}
          placeholder={'Select Languages Spoken'}
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
        <DropDown
          name="performanceLevel"
          label="Performance Level"
          placeholder={"Select Performance Level"}
          control={control}
          // defaultValue={formData && formData.academicQualification}
          options={[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
          variant="outlined"
          required={true}
        />
        <CustomTextField
          name="disciplinePracticed"
          control={control}
          label="Discipline Practiced"
          placeholder={"Enter Discipline Practiced"}
          rules={{
            required: "Discipline Practiced",
            pattern: {
              value: /^[a-zA-Z^-_$.,àâçéèêëîïôûùüÿñæœ +g]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Discipline Practiced cannot exceed 100 characters",
            },
          }}
        />
        <DropDown
          name="contractType"
          label="Contract Type"
          control={control}
          // defaultValue={formData && formData.qualification}
          options={ContractType}
          variant="outlined"
          required={true}
        />
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={6} flexDirection={"column"}>
            <CustomDatePicker
              control={control}
              name="contractStartDate"
              label=" Contract Start Date"
              // required={false}
              defaultValue={editData && editData.contractStartDate}
              boxmb={0.8}
              minDate={moment().subtract(50, "years")}
              maxDate={moment().add(10, "years")}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <CustomDatePicker
              control={control}
              name="contractEndDate"
              label=" Contract End Date"
              // required={false}
              defaultValue={editData && editData.contractEndDate}
              boxmb={0.8}
              minDate={minEndDate}
              maxDate={moment().add(10, "years")}
            />
          </Grid>

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
                  onFileChange={(
                    file: any,
                    flag: any,
                    modulename: any,
                    moduleId: any
                  ) => handleFileChange(file, flag, modulename, moduleId)}
                  formatType={PDF_FORMAT}
                  type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                  flag={DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT}
                  setData={setFormData}
                  formData={formData}
                  modulename="Athlete"
                  moduleId={id}
                  fileInputRef={fileIDRef}
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
                  onClick={handleIdClick}
                  style={{
                    cursor: "pointer",
                    color: "#00426A",
                  }}
                >
                  {formData.uploadContract ? (
                    <>{formData.uploadContract}</>
                  ) : (
                    <>Upload Contract: PDF format (max size 25 MB)</>
                  )}
                </Typography>
                {formData.uploadContract && (
                  <IconButton
                    className="deleteIconButton"
                    aria-label="delete"
                    onClick={() => {
                      handleDeleteFile(
                        "Athlete",
                        id,
                        DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT
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
          {snackbarStatus !== "" && (
            <CustomSnackbar
              message={
                snackbarStatus === "success"
                  ? "Athlete member added successfully!"
                  : "Something went wrong"
              }
              severity={snackbarStatus === "success" ? "success" : "error"}
              open={snackbarOpen}
              onClose={handleClose}
            />
          )}
        </Grid>
        <Grid container spacing={1} mt={1.5}>
          <Grid
            item
            xs={12}
            md={6}
            //  flexDirection={"column"}
          >
            <CustomDatePicker
              control={control}
              name="acknowledgementDate"
              label="Acknowledgement Date"
              defaultValue={editData && editData.acknowledgementDate}
              boxmb={0.8}
              minDate={moment().subtract(60, "years")}
              maxDate={moment()}
              setErrors={setDateError}
              rules={{ required: "Acknowledgement Date is required" }}
              required={true}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <CustomDatePicker
              control={control}
              name="pledgeDate"
              label="Pledge Date"
              minDate={moment().subtract(60, "years")}
              maxDate={moment()}
              defaultValue={editData && editData.pledgeDate}
              boxmb={0.8}
              setErrors={setDateError}
              rules={{ required: "Pledge Date is required" }}
              required={true}
            />
          </Grid>
        </Grid>
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

export default ProfessionalInfo;

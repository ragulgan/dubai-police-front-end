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
import {
  clearUpdateState,
  UpdateStaff,
} from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE_DOCUMENT,
} from "@/utils/constants";
import { isEmpty } from "lodash";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import FileUpload from "@/utils/dropzone";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { clearState } from "@/redux/slices/fileupload/singleFileUpload";
import DropDown from "../Fields/DropDown";
import {
  addAcademicQualification,
  clearAddAcademicState,
} from "@/redux/slices/athlete/athleteAcademicQualification";
import { trimFormData } from "@/utils/helper";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useRouter } from "next/router";
import DeleteDialog from "../dialogs/DeleteDialog";
import FileDownload from "./FileDownload ";
import {
  clearAcademicQualificationDeleteState,
  DeleteAcademicQualificationByID,
} from "@/redux/slices/athlete/deleteAcademicQualification";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { clearAddState } from "@/redux/slices/staff/staffAddSlice";
import {
  academicFileUpload,
  clearAcademicFileUploadState,
} from "@/redux/slices/fileupload/academicFileUpload";

interface Props {
  id: number;
  onClose: any;
  editStaffData: any;
}

const EducationalInfoForm: React.FC<Props> = ({
  id,
  onClose,
  editStaffData,
}) => {
  // Adding defaultValues for form fields
  const { handleSubmit, control, setValue, watch, setError, clearErrors } =
    useForm({
      defaultValues: {
        fieldOfStudy: "",
        universityName: "",
        location: "",
        upload_certificate: "",
        assignedAthletesOrTeams: "",
        coachingExperience: "",
        previousAthleteExperience: "",
        skills: "",
        availabilityOnTraining: "",
        achievementsAsCoach: "",
        academicQualification: "",
      },
    });
  const dispatch: AppDispatch = useDispatch();
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const uploadCertificateRef = useRef<HTMLInputElement>(null);
  const singleUpload = useSelector((state: any) => state.singleUpload);
  const router = useRouter();
  const { teamID } = router.query;
  const academicQualificationData = useSelector(
    (state: RootState) => state.addAcademicQualification
  );
  const academicQualificationFileUpload = useSelector(
    (state: RootState) => state.academicFileUpload
  );
  const deleteAcademicQualificationData = useSelector(
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

  const downloadFile = (file: any) => {
    const downloader = FileDownload({
      filePath: file.filePath,
      fileName: file.fileName,
    });
    downloader.trigger();
  };

  interface FormData {
    uploadCertificate: string;
    uploadCertificateFile: any;
  }
  const [formData, setFormData] = useState<FormData>({
    uploadCertificate: "",
    uploadCertificateFile: null,
  });

  const [tableData, setTableData] = useState<any>(null);
  useEffect(() => {
    setValue("fieldOfStudy", editStaffData && editStaffData.fieldOfStudy);
    setValue("universityName", editStaffData && editStaffData.universityName);
    setValue("location", editStaffData && editStaffData.location);
    setValue(
      "upload_certificate",
      editStaffData && editStaffData.upload_certificate
    );
    setValue(
      "assignedAthletesOrTeams",
      editStaffData && editStaffData.assignedAthletesOrTeams
    );
    setValue(
      "coachingExperience",
      editStaffData && editStaffData.coachingExperience
    );
    setValue(
      "previousAthleteExperience",
      editStaffData && editStaffData.previousAthleteExperience
    );
    setValue("skills", editStaffData && editStaffData.skills);
    setValue(
      "availabilityOnTraining",
      editStaffData && editStaffData.availabilityOnTraining
    );
    setValue(
      "achievementsAsCoach",
      editStaffData && editStaffData.achievementsAsCoach
    );
    setValue(
      "academicQualification",
      editStaffData &&
        editStaffData.academicQualification !== " " &&
        editStaffData.academicQualification
    );
    if (!isEmpty(editStaffData.academicQualificationList)) {
      setTableData(editStaffData.academicQualificationList);
    }

    const document =
      !isEmpty(editStaffData.attachmentList) &&
      editStaffData.attachmentList.find(
        (doc: any) =>
          doc.documentSection.toLowerCase() === "Certificate".toLowerCase()
      );
    if (!isEmpty(document)) {
      setFormData((prevData) => ({
        ...prevData,
        uploadCertificate: document.fileName,
      }));
    }
  }, [editStaffData]);

  const onSubmit: SubmitHandler<FieldValues> = (editStaffEmployeeData) => {
    const updateBodyObj: any = {
      section: "educationdetails",
      staffID: id,
      
      uploadCertificate: formData.uploadCertificate,
      ...editStaffEmployeeData,
    };
    // dispatch(addStaff({ url: "/InsertStaff", payload: data }));

    dispatch(UpdateStaff(updateBodyObj));
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

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData) => ({
      ...prevData,
      uploadCertificate: file?.name,
      uploadCertificateFile: file,
    }));
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
    if (moduleId) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,
        
        fileID: fileID,
      };
      dispatch(deleteFile(data));
      setFormData((prev: any) => ({
        ...prev,
        uploadCertificate: "",
        uploadCertificateFile: null,
      }));
    }
  };

  const handlepassClick = () => {
    if (uploadCertificateRef.current) {
      uploadCertificateRef.current.click();
    }
  };

  const payload: any = {
    staffID: id,
  };

  useEffect(() => {
    if (singleUpload.code === 200) {
      dispatch(clearState());
      // dispatch(isUpdatedFunc(true));
    }
  }, [singleUpload]);

  useEffect(() => {
    if (academicQualificationData && academicQualificationData.code === 200) {
      const editParams: any = {
        staffID: id,
        
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
        data.append("moduleName", "staff");
        data.append("section", "AcademicQualification");
        dispatch(
          academicFileUpload({
            url: "/AcademicQualificationFileUpload",
            payload: data,
          })
        );
      }
      // dispatch(isUpdatedFunc(true));
      if (!formData.uploadCertificateFile) {
        dispatch(editStaff(editParams));
      }
      dispatch(clearAddAcademicState());
    }
  }, [academicQualificationData]);

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

  useEffect(() => {
  if (Array.isArray(editStaffUpdatedData?.academicQualificationList) && !isEmpty(editStaffUpdatedData.academicQualificationList)) {
      setTableData(editStaffUpdatedData.academicQualificationList);
    }
  }, [editStaffUpdatedData, academicQualificationData]);
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
        staffID: id,
        
        sportID: Number(teamID),
      };
      dispatch(
        addAcademicQualification({
          url: "/InsertAcademicQualification",
          payload: data,
        })
      );
    }
  };

  useEffect(() => {
    if (
      deleteAcademicQualificationData &&
      deleteAcademicQualificationData.code === 200
    ) {
      const payload: any = {
        staffID: id,
        
        sportID: Number(teamID),
      };
      dispatch(editStaff(payload));
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
                              deleteUrl={"/DeleteStaffAcademicQualification"}
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
          // defaultValue={formData && formData.qualification}
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
                  handleFileChange(file, flag)
                }
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                modulename="Staff"
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
                    handleDeleteFile("Staff", id, "Certificate");
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
          placeholder="Enter Field of Study"
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
          placeholder="Enter University Name"
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
            className="text-capitalize dubai-med"
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
          name="location"
          control={control}
          label="Location"
          placeholder="Enter Location"
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
          name="coachingExperience"
          control={control}
          label="Coaching Experience"
          placeholder="Enter Coaching Experience"
          rules={{
            // required: "Location is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Coaching Experience cannot exceed 50 characters",
            },
          }}
        />

        <CustomTextField
          name="previousAthleteExperience"
          control={control}
          label="Previous Athlete Experience"
          placeholder="Enter Previous Athlete Experience"
          rules={{
            // required: "Location is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message:
                "Previous Athlete Experience cannot exceed 50 characters",
            },
          }}
        />
        <CustomTextField
          name="achievementsAsCoach"
          control={control}
          label="Achievements as Coach"
          textarea={true}
          rules={{
            // required: "Achievements as Coach is required" ,
            pattern: {
              value: /^[a-zA-Z0-9\s.-]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 200,
              message: "Achievements as Coach cannot exceed 200 characters",
            },
          }}
          placeholder="Enter Achievements as Coach"
        />

        <CustomTextField
          name="skills"
          control={control}
          label="Skills"
          textarea={true}
          rules={{
            // required: "Achievements as Coach is required" ,
            pattern: {
              value: /^[a-zA-Z0-9\s.-]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 200,
              message: "Achievements as Coach cannot exceed 200 characters",
            },
          }}
          placeholder="Enter Skills"
        />

        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Staff member Updated successfully!"
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

export default EducationalInfoForm;

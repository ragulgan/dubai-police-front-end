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
  Typography,
} from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import {
  clearUpdateState,
  UpdateStaff,
} from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  singleFileUploadDispatch,
} from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import DropDown from "../Fields/DropDown";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import {
  clearAthleteUpdateState,
  UpdateAthleteByID,
} from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
} from "@/utils/constants";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import CustomDateTimePicker from "../Fields/CustomDateTimePicker";
import moment from "moment";
import { formatDate, formatDateTime } from "@/utils/helper";
import _ from "lodash";

interface Props {
  id: number;
  onClose: any;
  editData: any;
  module?: string;
}

const AdditionalDetailsInfo: React.FC<Props> = ({
  id,
  onClose,
  editData,
  module,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const athleteUpdateResponse = useSelector(
    (state: any) => state.athleteUpdateByID
  );
  const [errors, setErrors] = useState<any>({});
  // Adding defaultValues for form fields
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      source: "",
      permissionType: "",
      permissionTime: "",
      policeIDNo: "",
      nationalTeamMember: "N",
      externalClubs: "",
      resultsAndAchievements: "",
      individualTrainingPlan: "",
      permissionStartDate: null,
      permissionEndDate: null,
    },
  });

  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    if (editData) setValue("source", editData.source);
    setValue("permissionTime", editData.permissionTime);
    setValue("permissionType", editData.permissionType);
    setValue("policeIDNo", editData.policeIDNo);
    setValue("nationalTeamMember", editData.nationalTeamMember);
    setValue("externalClubs", editData.externalClubs);
    setValue("resultsAndAchievements", editData.resultsAndAchievements);
    setValue(
      "individualTrainingPlan",
      editData.individualTrainingPlan && editData.individualTrainingPlan !== " "
        ? editData.individualTrainingPlan
        : ""
    );
    setValue(
      "permissionStartDate",
      editData.permissionStartDate ? editData.permissionStartDate : null
    );
    setValue(
      "permissionEndDate",
      editData.permissionEndDate ? editData.permissionEndDate : null
    );
    const IndividualDocument =
      editData &&
      editData.attachmentList.filter(
        (item: any) =>
          item.documentSection.toLowerCase() === "IndividaulPlans".toLowerCase()
      );
    const ExternalClubDocument =
      editData &&
      editData.attachmentList.filter(
        (item: any) =>
          item.documentSection.toLowerCase() ===
          "externalClubsContract".toLowerCase()
      );
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      IndividualDocument: IndividualDocument?.[0]?.fileName || "",
      externalClubs: ExternalClubDocument?.[0]?.fileName || "",
      permissionStartDate: editData.permissionStartDate
        ? moment(editData.permissionStartDate, "DD/MM/YYYY hh:mm:ss A")
        : null,
      permissionEndDate: editData.permissionEndDate
        ? moment(editData.permissionEndDate, "DD/MM/YYYY hh:mm:ss A")
        : null,
    }));
  }, [editData]);

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    const newErrors: any = {};
    if (
      !_.isEmpty(formData.permissionStartDate) &&
      !_.isEmpty(formData.permissionEndDate) &&
      moment(formData.permissionEndDate).isBefore(
        moment(formData.permissionStartDate)
      )
    ) {
      newErrors.permissionEndDate =
        "Training End Date cannot be earlier than Start Date";
      document.getElementById("permissionEndDate")?.focus();
    }
    setErrors(newErrors);
    if (_.isEmpty(newErrors)) {
      const updateBody: any = {
        ...formData,
        section: "additionaldetails",
        permissionStartDate:
          formData.permissionStartDate !== null
            ? formatDateTime(formData.permissionStartDate)
            : "",
        permissionEndDate:
          formData.permissionEndDate !== null
            ? formatDateTime(formData.permissionEndDate)
            : "",
        athleteID: id,
      };
      dispatch(UpdateAthleteByID(updateBody));
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
  const [formData, setFormData] = useState<any>({});
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const singleUpload = useSelector((state: any) => state.singleUpload);
  const handleFileChange = (fileData: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      externalClubs:
        flag === DROPZONE_IMAGE_FLAG.EXTERNAL_CLUBS
          ? fileData?.name
          : prevData.externalClubs,
      IndividualDocument:
        flag === DROPZONE_IMAGE_FLAG.INDIVIDUAL_PLANS
          ? fileData?.name
          : prevData.IndividualDocument,
    }));

    if (fileData && fileData.file) {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("modulename", fileData.modulename);
      formData.append("moduleid", id.toString());
      fileUploadDispatch(singleFileUpload(formData));
    }
  };
  const handleIdClick = () => {
    if (fileCertificateRef.current) {
      fileCertificateRef.current.click();
    }
  };
  const handleExternalClubClick = () => {
    if (externalClubCertificateRef.current) {
      externalClubCertificateRef.current.click();
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
  };

  useEffect(() => {
    if (singleUpload.code === 200) {
      dispatch(clearState());
    }
  }, [singleUpload]);

  const PermissionType = [
    { value: "Hours", label: "Hours" },
    { value: "Daily", label: "Daily" },
  ];

  const PermissionHours = [
    { label: "1 hour", value: "1 hour" },
    { label: "2 hours", value: "2 hours" },
    { label: "3 hours", value: "3 hours" },
    { label: "4 hours", value: "4 hours" },
    { label: "5 hours", value: "5 hours" },
    { label: "6 hours", value: "6 hours" },
    { label: "7 hours", value: "7 hours" },
    { label: "8 hours", value: "8 hours" },
  ];

  const dateChange = (data: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [data.name]: data.value ? moment(data.value).toISOString() : null,
    }));
  };
  const permissionTypeValue = watch("permissionType");

  const getMinDate = () => {
    const contractStart = moment(formData.permissionStartDate, true);
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(50, "years");
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
        <DropDown
          name="source"
          label="Source of recruitment"
          placeholder={"Select Source of recruitment"}
          control={control}
          // defaultValue={formData && formData.qualification}
          options={[
            { value: "Dubai Police Employee", label: "Dubai Police Employee" },
            { value: "Dubai police Acadamy", label: "Dubai police Acadamy" },
            { value: "External", label: "External" },
          ]}
          variant="outlined"
          // required={true}
        />
        <CustomTextField
          name="policeIDNo"
          control={control}
          label="Police ID Number"
          placeholder={"Enter Police ID Number"}
          rules={{
            // required: "Police ID Number is required" ,
            pattern: {
              value: /^[a-zA-Z0-9 /]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 20,
              message: "Police ID Number cannot exceed 20 characters",
            },
          }}
        />
        <CustomRadioGroup
          name="nationalTeamMember"
          control={control}
          label="National Team Member"
          options={[
            { value: "Y", label: "Yes" },
            { value: "N", label: "No" },
          ]}
          // required={true}
        />

        <CustomTextField
          name="externalClubs"
          control={control}
          label="External Clubs"
          placeholder={"Enter External Clubs"}
          rules={{
            // required: "External Clubs is required" ,
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 50,
              message: "External Clubs cannot exceed 50 characters",
            },
          }}
        />
        <DropDown
          name="permissionType"
          label="Leave Permission"
          control={control}
          placeholder={"Select Leave Permission"}
          // defaultValue={formData && formData.qualification}
          options={PermissionType}
          variant="outlined"
          // required={true}
        />
        <DropDown
          name="permissionTime"
          label="Permission Time"
          control={control}
          placeholder={"Select Permission Hours"}
          // defaultValue={formData && formData.qualification}
          options={PermissionHours}
          variant="outlined"
          required={permissionTypeValue !== ""}
        />
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} flexDirection={"column"} mt={2.5}>
            <CustomDateTimePicker
              control={control}
              // hidden={true}
              name="permissionStartDate"
              label="Permission Start Date"
              boxmb={0.8}
              required={permissionTypeValue !== ""}
              minDate={moment()}
              maxDate={moment().add(10, "years")}
              onChange={dateChange}
              defaultValue={formData && formData.permissionStartDate}

              // defaultValue={editData && editData.permissionStartDate !== '' ? editData.permissionStartDate : null}
              // defaultValue={editData?.permissionStartDate ? moment(editData.permissionStartDate).format("DD/MM/YYYY hh:mm:ss A") : null}
            />
            {errors.permissionStartDate && (
              <Typography variant="caption" className="error-message" mt={2}>
                {errors.permissionStartDate}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={12} flexDirection={"column"} mt={1}>
            <CustomDateTimePicker
              control={control}
              // hidden={true}
              name="permissionEndDate"
              label="Permission End Date"
              boxmb={0.8}
              required={permissionTypeValue !== ""}
              minDate={getMinDate()}
              maxDate={moment().add(10, "years")}
              onChange={dateChange}
              defaultValue={formData && formData.permissionEndDate}

              // defaultValue={editData && editData.permissionEndDate !== '' ? editData.permissionEndDate : null}
              // defaultValue={editData?.permissionEndDate ? moment(editData.permissionEndDate) : null}
              // defaultValue={editData?.permissionEndDate ? moment(editData.permissionEndDate).format("DD/MM/YYYY hh:mm:ss A") : null}
            />
            {errors.permissionEndDate && (
              <Typography variant="caption" className="error-message" mt={2}>
                {errors.permissionEndDate}
              </Typography>
            )}
          </Grid>
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
                onFileChange={(file: any, flag: any) =>
                  handleFileChange(file, flag)
                }
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.EXTERNAL_CLUBS}
                setData={setFormData}
                formData={formData}
                modulename="Athlete"
                moduleId={id}
                fileInputRef={externalClubCertificateRef}
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
                onClick={handleExternalClubClick}
                style={{
                  cursor: "pointer",
                  color: "#00426A",
                }}
              >
                {formData.externalClubs ? (
                  <>{formData.externalClubs}</>
                ) : (
                  <>Upload Contracts : PDF format(max size 25MB)</>
                )}
              </Typography>
              {formData.externalClubs && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile("Athlete", id, "externalClubs");
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
        {/* <DropDown
        name="permissionType"
        label="Permission Type"
        control={control}
        placeholder={'Select Permission Type'}
        // defaultValue={formData && formData.qualification}
        options={PermissionType}
        variant="outlined"
        // required={true}
      />
      <DropDown
        name="permissionTime"
        label="Permission Time"
        control={control}
        placeholder={'Select Permission Hours'}
        // defaultValue={formData && formData.qualification}
        options={PermissionHours}
        variant="outlined"
        // required={true}
      /> */}
        {/* <CustomDateTimePicker
            control={control}
            name="dateOfLastJobPromotion"
            label="Date of Last Job Promotion"
            // required={true}
            boxmb={0.8}
            defaultValue={editData && editData.dateOfLastJobPromotion}
          /> */}

        <CustomTextField
          name="resultsAndAchievements"
          control={control}
          label="Results and Achievements"
          textarea={true}
          placeholder={"Enter Results and Achievements"}
          rules={{
            // required: "Results and Achievements is required" ,
            pattern: {
              value: /^[a-zA-Z0-9\s.-]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 300,
              message: "Results and Achievements cannot exceed 300 characters",
            },
          }}
        />
        <CustomTextField
          name="individualTrainingPlan"
          control={control}
          label="Individual Training Plan"
          textarea={true}
          placeholder={"Enter Individual Training Plan"}
          // rules={{ required: "Individual Training Plan is required" }}
          rules={{
            required: "Individual Training Plan is required",
            pattern: {
              value: /^[a-zA-Z0-9\s.-]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 300,
              message: "Individual Training Plan cannot exceed 300 characters",
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
                onFileChange={(file: any, flag: any) =>
                  handleFileChange(file, flag)
                }
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.INDIVIDUAL_PLANS}
                setData={setFormData}
                formData={formData}
                modulename="Athlete"
                moduleId={id}
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
                onClick={handleIdClick}
                style={{
                  cursor: "pointer",
                  color: "#00426A",
                }}
              >
                {formData.IndividualDocument ? (
                  <>{formData.IndividualDocument}</>
                ) : (
                  <>
                    Upload Individual Training Plan : PDF format (max size 25
                    MB)
                  </>
                )}
              </Typography>
              {formData.IndividualDocument && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile("Athlete", id, "IndividualDocument");
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
                ? "Athlete member updated successfully!"
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

export default AdditionalDetailsInfo;

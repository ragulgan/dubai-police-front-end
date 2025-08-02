// pages/staff/edit.tsx
import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  IconButton,
  SnackbarCloseReason,
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
  FILE_FORMAT_TYPE_DOCUMENT,
} from "@/utils/constants";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import {
  RootState,
  singleFileUploadDispatch,
  AppDispatch,
} from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { formatDate, isValidField } from "@/utils/helper";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { isEmpty } from "lodash";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import _ from "lodash";
import TextSunEditor from "../SunEditor";

interface Props {
  id: number;
  onClose: any;
  editStaffData: any;
}

const EmploymentInfoForm: React.FC<Props> = ({
  id,
  onClose,
  editStaffData,
}) => {
  const [formData, setFormData] = useState<any>({
    availabilityOnTraining: "",
  });
  const dispatch: AppDispatch = useDispatch();
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const singleUpload = useSelector((state: any) => state.singleUpload);
  const [error, setDateError] = useState({});
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentJobPosition: "",
      currentJobLocation: "",
      dpEmployeeNumber: "",
      rankOrGrade: "",
      department: "",
      dateOfLastJobPromotion: null,
      dpEmploymentStatus: "",
      contractEndDate: null,
      contractStartDate: null,
      acknowledgementDate: null,
      pledgeDate: null,
      punctualityInMeetings: "",
      assignedAthletesSports: "",
      // availabilityOnTraining: '',
    },
  });
  const [minEndDate, setMinEndDate] = useState(moment());
  const contractStartDate = watch("contractStartDate");
  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    setValue(
      "currentJobPosition",
      editStaffData && editStaffData.currentJobPosition
    );
    // setValue(
    //   "availabilityOnTraining",
    //   editStaffData && editStaffData.availabilityOnTraining
    // );
    // setValue(
    //   "availabilityOnTraining",
    //   editStaffData && editStaffData.availabilityOnTraining
    // );
    setValue(
      "assignedAthletesSports",
      editStaffData && editStaffData.assignedAthletesSports
    );
    setValue(
      "currentJobLocation",
      editStaffData && editStaffData.currentJobLocation
    );
    setValue(
      "dpEmployeeNumber",
      editStaffData && editStaffData.dpEmployeeNumber
    );
    setValue("rankOrGrade", editStaffData && editStaffData.rankOrGrade);
    setValue("department", editStaffData && editStaffData.department);
    setValue(
      "dateOfLastJobPromotion",
      // editStaffData && editStaffData.dateOfLastJobPromotion
      editStaffData &&
        editStaffData.dateOfLastJobPromotion !== "-" &&
        editStaffData.dateOfLastJobPromotion
        ? editStaffData.dateOfLastJobPromotion
        : null
    );

    setValue(
      "dpEmploymentStatus",
      editStaffData && editStaffData.dpEmploymentStatus
    );
    setValue(
      "punctualityInMeetings",
      editStaffData && editStaffData.punctualityInMeetings
    );
    setValue(
      "contractEndDate",
      editStaffData &&
        editStaffData.contractEndDate !== "-" &&
        editStaffData.contractEndDate
        ? editStaffData.contractEndDate
        : null
    );
    setValue(
      "acknowledgementDate",
      editStaffData &&
        editStaffData.acknowledgementDate !== "-" &&
        editStaffData.acknowledgementDate
        ? editStaffData.acknowledgementDate
        : null
    );
    setValue(
      "pledgeDate",
      editStaffData &&
        editStaffData.pledgeDate !== "-" &&
        editStaffData.pledgeDate
        ? editStaffData.pledgeDate
        : null
    );
    setValue(
      "contractStartDate",
      editStaffData &&
        editStaffData.contractStartDate &&
        editStaffData.contractStartDate !== "-"
        ? editStaffData.contractStartDate
        : null
    );
    const ContractDocument =
      editStaffData &&
      !isEmpty(editStaffData.attachmentList) &&
      editStaffData.attachmentList.filter(
        (item: any) =>
          item.documentSection.toLowerCase() ===
          "ContractDocument".toLowerCase()
      );
    setFormData({
      ...formData,
      contractDocument:
        (!isEmpty(ContractDocument?.[0]) && ContractDocument?.[0]?.fileName) ||
        "",
      availabilityOnTraining: editStaffData.availabilityOnTraining,
    });

    // setFormData({
    //   ...formData,
    //   availabilityOnTraining:editStaffData.availabilityOnTraining,
    // });
  }, [editStaffData]);

  // useEffect(() => {
  //   if (!_.isEmpty(editStaffData)) {
  //     setFormData({
  //       ...formData,
  //       dateOfLastJobPromotion: editStaffData && editStaffData.dateOfLastJobPromotion,
  //       contractStartDate: editStaffData && editStaffData.contractStartDate,
  //       contractEndDate: editStaffData && editStaffData.contractEndDate,
  //     });
  //   }
  // }, [editStaffData])
  useEffect(() => {
    if (singleUpload.code === 200) {
      dispatch(clearState());
    }
  }, [singleUpload]);
  const onSubmit: SubmitHandler<FieldValues> = (editStaffEmployeeData) => {
    const updateBody: any = {
      ...editStaffEmployeeData,
      availabilityOnTraining: formData.availabilityOnTraining,
      dateOfLastJobPromotion: isValidField(
        editStaffEmployeeData,
        "dateOfLastJobPromotion"
      )
        ? formatDate(editStaffEmployeeData.dateOfLastJobPromotion)
        : "",
      contractStartDate: isValidField(
        editStaffEmployeeData,
        "contractStartDate"
      )
        ? formatDate(editStaffEmployeeData.contractStartDate)
        : "",
      contractEndDate: isValidField(editStaffEmployeeData, "contractEndDate")
        ? formatDate(editStaffEmployeeData.contractEndDate)
        : "",
      acknowledgementDate: isValidField(
        editStaffEmployeeData,
        "acknowledgementDate"
      )
        ? formatDate(editStaffEmployeeData.acknowledgementDate)
        : "",
      pledgeDate: isValidField(editStaffEmployeeData, "pledgeDate")
        ? formatDate(editStaffEmployeeData.pledgeDate)
        : "",
      section: "employeedetails",
      staffID: id,
    };
    dispatch(UpdateStaff(updateBody));
  };

  const handleFileChange = (fileData: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      contractDocument:
        flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT
          ? fileData?.name
          : prevData.contractDocument,
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
      dispatch(clearState());
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
      dispatch(clearState());
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

  const handleIdClick = () => {
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
      [fileType]: "",
    }));
  };

  const payload: any = {
    staffID: id,
  };

  const dateChange = (data: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [data.name]: data.value,
    }));
  };

  useEffect(() => {
    const newMinDate = moment(contractStartDate, "YYYY-MM-DD").add(1, "months");
    setMinEndDate(newMinDate);
  }, [contractStartDate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomTextField
        name="currentJobPosition"
        control={control}
        label="Current Job Position"
        placeholder="Enter Current Job Position"
        rules={{
          required: "Current Job Position is required",
          pattern: {
            value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
            message: "Only letters and spaces are allowed",
          },
          maxLength: {
            value: 50,
            message: "Current Job Position cannot exceed 100 characters",
          },
        }}
      />
      <CustomTextField
        name="currentJobLocation"
        control={control}
        label="Current Job Location"
        placeholder="Enter Current Job Location"
        rules={{
          required: "Current Job Location is required",
          pattern: {
            value: /^[a-zA-Z0-9\s,.]*$/,
            message: "",
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
        placeholder="Enter Dubai Police Employee Number"
        rules={{
          // required: `Enter the Valid Dubai police email id example: "adam@dubaipolice.gov.ae"`,
          pattern: {
            value: /^[a-zA-Z0-9\s,./-]*$/,
            message: "Only Alphanumberic & hypens are allowed",
          },
          maxLength: {
            value: 20,
            message: "Dubai Police Employee Number cannot exceed 20 characters",
          },
        }}
      />
      <CustomTextField
        name="assignedAthletesSports"
        control={control}
        label="Assigned Athletes/Sports"
        placeholder="Enter Assigned Athletes/Sports"
        rules={{
          //  required: "Assigned Athletes/Sports is required",
          pattern: {
            value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
            message: "Only letters and spaces are allowed",
          },
          maxLength: {
            value: 50,
            message: "Assigned Athletes/Sports cannot exceed 50 characters",
          },
        }}
      />
      <CustomTextField
        name="rankOrGrade"
        control={control}
        label="Rank"
        placeholder="Enter Rank"
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
        placeholder="Enter Department"
        rules={{
          required: "Department is required",
          pattern: {
            value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
            message: "Only letters and spaces are allowed",
          },
          maxLength: {
            value: 50,
            message: "Department cannot exceed 50 characters",
          },
        }}
      />
      <Box mt={1.5}>
        <CustomDatePicker
          control={control}
          name="dateOfLastJobPromotion"
          label="Date of Last Job Promotion"
          onChange={dateChange}
          required={true}
          minDate={moment().subtract(50, "years")}
          maxDate={moment()}
          boxmb={0.8}
          defaultValue={editStaffData && editStaffData.dateOfLastJobPromotion}
          rules={{
            required: "Date of Last Job Promotion is required",
          }}
        />
      </Box>
      <DropDown
        name="dpEmploymentStatus"
        label="Dubai Police Employment Status"
        placeholder={"Select Dubai Police Employment Status"}
        control={control}
        defaultValue={formData && formData.dpEmploymentStatus}
        options={[
          { value: "Permanent Contract", label: "Permanent Contract" },
          { value: "Collaboration Contract", label: "Collaboration Contract" },
          { value: "Temporary Contract", label: "Temporary Contract" },
        ]}
        required={true}
        variant="outlined"
      />

      <Grid container spacing={1} mt={1.5}>
        <Grid item xs={12} md={6} flexDirection={"column"}>
          <CustomDatePicker
            control={control}
            name="contractStartDate"
            label="Contract Start Date"
            onChange={dateChange}
            required={true}
            defaultValue={editStaffData && editStaffData.contractStartDate}
            boxmb={0.8}
            minDate={moment().subtract(50, "years")}
            maxDate={moment().add(10, "years")}
            rules={{ required: "Contract Start Date is required" }}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <CustomDatePicker
            control={control}
            name="contractEndDate"
            label="Contract End Date"
            minDate={minEndDate}
            maxDate={moment().add(10, "years")}
            onChange={dateChange}
            required={true}
            defaultValue={editStaffData && editStaffData.contractEndDate}
            boxmb={0.8}
            rules={{ required: "Contract End Date is required" }}
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
                onFileChange={(file: any, flag: any) =>
                  handleFileChange(file, flag)
                }
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                flag={DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT}
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
                onClick={handleIdClick}
                style={{
                  cursor: "pointer",
                  color: "#00426A",
                }}
              >
                {formData.contractDocument ? (
                  <>{formData.contractDocument}</>
                ) : (
                  <>Upload Contract: PDF format (max size 25 MB)</>
                )}
              </Typography>
              {formData.contractDocument && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile("Staff", id, "contractDocument");
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
                ? "Staff member added successfully!"
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleClose}
          />
        )}
      </Grid>
      <CustomRadioGroup
        name="punctualityInMeetings"
        control={control}
        label="Punctuality in Meetings"
        options={[
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ]}
      />
      {/* <CustomTextField
        name="availabilityOnTraining"
        control={control}
        textarea={true}
        label="Availability on Training"
        rules={
          {
            // required: "Availability on Training is required",
            pattern: {
              value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 150, message: "Availability on Training cannot exceed 150 characters" },
          }}
      /> */}
      <Grid container spacing={1} mt={1.5}>
        <Grid item xs={12} md={12} flexDirection={"column"}>
          <Typography gutterBottom className="typography textfield-label bukra">
            Availability on Training
          </Typography>
          <TextSunEditor
            setData={setFormData}
            contentData={formData.availabilityOnTraining || ""}
            name="availabilityOnTraining"
            minHeight={"150px"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} mt={1.5}>
        <Grid item xs={12} md={6} flexDirection={"column"}>
          <CustomDatePicker
            control={control}
            name="acknowledgementDate"
            label="Acknowledgement Date"
            onChange={dateChange}
            required={true}
            defaultValue={editStaffData && editStaffData.acknowledgementDate}
            boxmb={0.8}
            minDate={moment().subtract(60, "years")}
            maxDate={moment()}
            setErrors={setDateError}
            rules={{ required: "Acknowledgement Date is required" }}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <CustomDatePicker
            control={control}
            name="pledgeDate"
            label="Pledge Date"
            minDate={moment().subtract(60, "years")}
            maxDate={moment()}
            onChange={dateChange}
            required={true}
            defaultValue={editStaffData && editStaffData.pledgeDate}
            boxmb={0.8}
            setErrors={setDateError}
            rules={{ required: "Pledge Date is required" }}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          className="text-capitalize dubai-med"
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
  );
};

export default EmploymentInfoForm;

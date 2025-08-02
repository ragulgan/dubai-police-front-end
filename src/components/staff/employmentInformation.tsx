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
  Fade,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { EmploymentFormValidation } from "@/utils/staffs/validation";
import { useRouter } from "next/navigation";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  FILE_FORMAT_TYPE_DOCUMENT,
  PDF_FORMAT,
  REGEX,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import {
  clearDeletFileState,
  deleteFile,
} from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import TextSunEditor from "@/components/SunEditor";
import FileUploader from "../Fields/ReUsableFileUploader";

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
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

const EmploymentInformation = (props: any) => {
  const {
    setActiveStep,
    setAllData,
    allData,
    editStaffData,
    filepayload,
    showField,
    staffEditId,
    regSportID,
    staffAndAthleteIdData,
  } = props;
  const { handleSubmit, control } = useForm();
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    // qualification: '',
    currentJobPosition: "",
    currentJobLocation: "",
    dpEmployeeNumber: "",
    rankOrGrade: "",
    department: "",
    dpEmploymentStatus: "",
    contractStartDate: "",
    contractEndDate: "",
    contractDocument: "",
    availabilityOnTraining: "",
    acknowledgementDate: "",
    pledgeDate: "",
    currentEmployer: "",
    acknowledgementDoc: "",
    pledgeDoc: "",
    certificateOfGoodConduct: "",
    certificateOfGoodConductDoc: "",
    medicalIssueDetails: "",
    medicalIssues: "",
  });
  console.log({ formData });

  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<any>({});
  const { validate } = EmploymentFormValidation(formData, setErrors, showField);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const fileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const fileDelete = useSelector((state: any) => state && state.fileDelete);
  const contractTypeList = useSelector((state: RootState) => state?.getContractTypeList && Number(state?.getContractTypeList?.code) === 200 ? state?.getContractTypeList.data : null);
  const staffAddEmployementData = useSelector(
    (state: RootState) => state.staffAdd
  );

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

  const formatDate = (date: string | undefined) =>
    date ? moment(date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";

  const onSubmit = async () => {
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const {
        contractDocument,
        acknowledgementDoc,
        certificateOfGoodConductDoc,
        pledgeDoc,
        ...rest
      } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        contractStartDate: formatDate(formData.contractStartDate),
        contractEndDate: formatDate(formData.contractEndDate),
        acknowledgementDate: formatDate(formData.acknowledgementDate),
        certificateOfGoodConduct: formatDate(formData.certificateOfGoodConduct),
        pledgeDate: formatDate(formData.pledgeDate),
        section: "employeedetails",
        staffID: parsedData.staffID || staffEditId,
      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
    }
  };

  useEffect(() => {
    if (staffAddEmployementData && staffAddEmployementData.code === 200) {
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        employeedetails: formData,
      }));
      dispatch(clearAddState());
      setActiveStep(3);
    } else if (
      staffAddEmployementData &&
      staffAddEmployementData.code === 500
    ) {
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 1000);
    }
  }, [staffAddEmployementData]);

  useEffect(() => {
    if (parsedData.employeedetails && !staffEditId) {
      const contractDocumentAttachment = _.find(
        editStaffData?.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "contractdocument"
      );

      const acknowledgementDoc = _.find(
        editStaffData?.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "acknowledgement"
      );

      const pledgeDoc = _.find(
        editStaffData?.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "pledge"
      );

      const certificateOfGoodConductDoc = _.find(
        editStaffData?.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() ===
          "certificateofgoodconductdoc"
      );

      // Update the form data
      setFormData((formData: any) => ({
        ...formData,
        qualification: parsedData.employeedetails.qualification || "",
        currentJobPosition: parsedData.employeedetails.currentJobPosition || "",
        currentJobLocation: parsedData.employeedetails.currentJobLocation || "",
        dpEmployeeNumber:
          parsedData.employeedetails.dpEmployeeNumber ||
          staffAndAthleteIdData?.employeeNo,
        rankOrGrade: parsedData.employeedetails.rankOrGrade || "",
        department: parsedData.employeedetails.department || "",
        dpEmploymentStatus: parsedData.employeedetails.dpEmploymentStatus || "",
        contractStartDate: formatDates(
          parsedData.employeedetails.contractStartDate
        ),
        contractEndDate: formatDates(
          parsedData.employeedetails.contractEndDate
        ),
        pledgeDate: formatDates(parsedData.employeedetails.pledgeDate),
        acknowledgementDate: formatDates(
          parsedData.employeedetails.acknowledgementDate
        ),
        certificateOfGoodConduct: formatDates(
          parsedData.employeedetails.certificateOfGoodConduct
        ),
        availabilityOnTraining:
          parsedData.employeedetails.availabilityOnTraining || "",
        currentEmployer: parsedData.employeedetails.currentEmployer || "",
        medicalIssues: parsedData.employeedetails.medicalIssues || "",
        medicalIssueDetails:
          parsedData.employeedetails.medicalIssueDetails || "",
        source: parsedData.employeedetails.source || "",

        // Attachments from attachmentList
        contractDocument: contractDocumentAttachment?.fileName || "",
        acknowledgementDoc: acknowledgementDoc?.fileName || "",
        pledgeDoc: pledgeDoc?.fileName || "",
        certificateOfGoodConductDoc:
          certificateOfGoodConductDoc?.fileName || "",
      }));
    }
  }, [editStaffData]);

  useEffect(() => {
    if (staffAndAthleteIdData?.employeeNo && !staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        dpEmployeeNumber:
          staffAndAthleteIdData?.employeeNo || editStaffData.dpEmployeeNumber,
      }));
    }
  }, []);

  useEffect(() => {
    if (editStaffData && staffEditId) {
      setFormData((formData: any) => ({
        ...formData,
        qualification: editStaffData.qualification || "",
        currentJobPosition: editStaffData.currentJobPosition || "",
        currentJobLocation: editStaffData.currentJobLocation || "",
        dpEmployeeNumber:
          editStaffData.dpEmployeeNumber || staffAndAthleteIdData?.employeeNo,
        rankOrGrade: editStaffData.rankOrGrade || "",
        department: editStaffData.department || "",
        dpEmploymentStatus: editStaffData.dpEmploymentStatus || "",
        contractStartDate: formatDates(editStaffData.contractStartDate),
        contractEndDate: formatDates(editStaffData.contractEndDate),
        pledgeDate: formatDates(editStaffData.pledgeDate),
        acknowledgementDate: formatDates(editStaffData.acknowledgementDate),
        certificateOfGoodConduct: formatDates(
          editStaffData.certificateOfGoodConduct
        ),
        contractDocument: parsedData.contract || "",
        acknowledgementDoc: parsedData.acknowledgementDoc || "",
        pledgeDoc: parsedData.pledgeDoc || "",
        certificateOfGoodConductDoc:
          parsedData.certificateOfGoodConductDoc || "",
        availabilityOnTraining: editStaffData.availabilityOnTraining || "",
        currentEmployer: editStaffData.currentEmployer || "",
        medicalIssues: editStaffData.medicalIssues || "",
        medicalIssueDetails: editStaffData.medicalIssueDetails || "",
      }));
    }
  }, [editStaffData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const policyStatusChange = (event: any) => {
    console.log({ event });

    setFormData({ ...formData, dpEmploymentStatus: event.target.value });
    setErrors({
      ...errors,
      dpEmploymentStatus: "",
    });
  };

  const handleFileChange = (file: File | null, flag: string) => {
    if (!file) return;
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      contractDocument:
        flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT
          ? ""
          : prevErrors.contractDocument,
      acknowledgementDoc:
        flag === DROPZONE_IMAGE_FLAG.ACKNOWLEDGEMENT
          ? ""
          : prevErrors.acknowledgementDoc,
      pledgeDoc:
        flag === DROPZONE_IMAGE_FLAG.PLEDGE ? "" : prevErrors.pledgeDoc,
      certificateOfGoodConductDoc:
        flag === DROPZONE_IMAGE_FLAG.COD
          ? ""
          : prevErrors.certificateOfGoodConductDoc,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormData((prevData: any) => ({
        ...prevData,
        contractDocument:
          flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT
            ? file.name
            : prevData.contractDocument,
        acknowledgementDoc:
          flag === DROPZONE_IMAGE_FLAG.ACKNOWLEDGEMENT
            ? file.name
            : prevData.acknowledgementDoc,
        pledgeDoc:
          flag === DROPZONE_IMAGE_FLAG.PLEDGE ? file.name : prevData.pledgeDoc,
        certificateOfGoodConductDoc:
          flag === DROPZONE_IMAGE_FLAG.COD
            ? file.name
            : prevData.certificateOfGoodConductDoc,
      }));
    };
    reader.readAsDataURL(file);
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
    });
  };

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

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      employeedetails: formData,
    }));
    setActiveStep(1);
  };

  const getMinDate = () => {
    const contractStart = moment(
      formData.contractStartDate,
      "DD/MM/YYYY",
      true
    );
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(50, "years");
  };

  const handleFileClick = (fileKey: string) => {
    const fileInput = fileRefs.current[fileKey];
    if (fileInput) {
      fileInput.click();
    } else {
      console.warn(`No input ref found for ${fileKey}`);
    }
  };

  useEffect(() => {
    const payload: any = {
      staffID: parsedData.staffID
        ? parsedData.staffID
        : staffEditId || editStaffData?.staffID,
      sportID: +regSportID,
    };
    dispatch(editStaff(payload));
  }, []);

  useEffect(() => {
    if (fileDelete && fileDelete.code === 200) {
      const payload: any = {
        staffID: parsedData.staffID
          ? parsedData.staffID
          : staffEditId || editStaffData?.staffID,
        sportID: +regSportID,
      };
      dispatch(editStaff(payload));
      dispatch(clearDeletFileState());
    }
  }, [fileDelete]);

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
              {showBanner &&
                staffAddEmployementData &&
                !_.isEmpty(staffAddEmployementData.message) && (
                  <Snackbar
                    open={showBanner}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      variant="filled"
                      className="dubai-med"
                    >
                      {staffAddEmployementData &&
                        staffAddEmployementData.message}
                    </Alert>
                  </Snackbar>
                )}
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Current Job Position <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="currentJobPosition"
                    placeholder="Enter Current Job Position"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.currentJobPosition}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.currentJobPosition && (
                    <Typography variant="caption" className="error-message">
                      {errors.currentJobPosition}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Current Employer Name
                  </Typography>
                  <CustomTextField
                    name="currentEmployer"
                    placeholder="Enter Current Employer Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.currentEmployer}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.currentEmployer && (
                    <Typography variant="caption" className="error-message">
                      {errors.currentEmployer}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Current Job Location <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="currentJobLocation"
                    placeholder="Enter Current Job Location"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.currentJobLocation}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.currentJobLocation && (
                    <Typography variant="caption" className="error-message">
                      {errors.currentJobLocation}
                    </Typography>
                  )}
                </Grid>
                {showField && (
                  <>
                    <Grid item xs={12} md={5.75}>
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Dubai Police Employee Number
                      </Typography>
                      <CustomTextField
                        name="dpEmployeeNumber"
                        placeholder="Enter Dubai Police Employee Number"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={formData.dpEmployeeNumber}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 20 }}
                        onKeyPress={(e) => {
                          if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        disabled={staffAndAthleteIdData?.employeeNo || editStaffData?.dpEmployeeNumber}
                      />
                      {/* {errors.dpEmployeeNumber && (
                    <Typography variant="caption" className="error-message">
                      {errors.dpEmployeeNumber}
                    </Typography>
                  )} */}
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Rank  {showField && <span className="asterisk">*</span>}
                      </Typography>
                      <CustomTextField
                        name="rankOrGrade"
                        placeholder="Enter Rank"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={formData.rankOrGrade}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 50 }}
                        onKeyPress={(e) => {
                          if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.rankOrGrade && (
                        <Typography variant="caption" className="error-message">
                          {errors.rankOrGrade}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Department <span className="asterisk">*</span>
                      </Typography>
                      <CustomTextField
                        name="department"
                        placeholder="Enter Department"
                        type="tel"
                        variant="outlined"
                        fullWidth
                        value={formData.department}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 50 }}
                        onKeyPress={(e) => {
                          if (!REGEX.SPECIALCHARCTERS.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.department && (
                        <Typography variant="caption" className="error-message">
                          {errors.department}
                        </Typography>
                      )}
                    </Grid>
                  </>
                )}
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Contract Type <span className="asterisk">*</span>
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.dpEmploymentStatus}
                      onChange={policyStatusChange}
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
                          Select Contract Type
                        </Typography>
                      </MenuItem>
                      {!isEmpty(contractTypeList) &&
                        contractTypeList
                          .filter((option: any) => {
                            if (showField) {
                              return option.name === "Permanent Contract" || option.name === "Temporary Contract";
                            } else {
                              return option.name === "Collaboration Contract" || option.name === "Temporary Contract";
                            }
                          })
                          .map((option: any) => (
                            <MenuItem key={option.id} value={option.name}>
                              <Typography variant="body1" color="textPrimary">
                                {option.name}
                              </Typography>
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>

                  {errors.dpEmploymentStatus && (
                    <Typography variant="caption" className="error-message">
                      {errors.dpEmploymentStatus}
                    </Typography>
                  )}
                </Grid>
                {formData.dpEmploymentStatus === "Permanent Contract" ? null : (
                  <Grid container item xs={12} md={5.75} spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Contract Start Date <span className="asterisk">*</span>
                      </Typography>
                      <CustomDatePicker
                        control={control}
                        hidden={true}
                        name="contractStartDate"
                        label="Contract Start Date"
                        boxmb={0.8}
                        required={false}
                        minDate={moment().subtract(10, "years")}
                        maxDate={moment().add(10, "years")}
                        onChange={dateChange}
                        defaultValue={formData && formData.contractStartDate}
                      // setErrors={setErrors}
                      // rules={{ required: "Contract Start Date is required" }}
                      />
                      {errors.contractStartDate && (
                        <Typography
                          variant="caption"
                          className="error-message"
                          mt={2}
                        >
                          {errors.contractStartDate}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Contract End Date <span className="asterisk">*</span>
                      </Typography>
                      <CustomDatePicker
                        control={control}
                        hidden={true}
                        name="contractEndDate"
                        label="Contract End Date"
                        boxmb={0.8}
                        required={false}
                        minDate={getMinDate()}
                        maxDate={moment().add(10, "years")}
                        onChange={dateChange}
                        defaultValue={formData && formData.contractEndDate}
                      // setErrors={setErrors}
                      // rules={{ required: "Contract Start Date is required" }}
                      />
                      {errors.contractEndDate && (
                        <Typography
                          variant="caption"
                          className="error-message"
                          mt={2}
                        >
                          {errors.contractEndDate}
                        </Typography>
                      )}
                    </Grid>
                    <Box sx={{ ml: 2 }}>
                      <FileUploader
                        key="contractDocument"
                        fileKey="contractDocument"
                        fileLabel="Upload Contract: PDF format (max size 25 MB)"
                        formatType={PDF_FORMAT}
                        fileType={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT}
                        moduleName="Staff"
                        moduleId={parsedData.staffID || staffEditId}
                        fileInputRef={(el: any) => {
                          if (el) fileRefs.current["contractDocument"] = el;
                        }}
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        handleFileChange={handleFileChange}
                        handleDeleteFile={handleDeleteFile}
                        handleFileClick={() =>
                          handleFileClick("contractDocument")
                        }
                        required={false}
                      />
                    </Box>
                  </Grid>
                )}
                {[
                  "Head Coach",
                  "Strength And Conditioning Coach",
                  "Assistant Coach",
                ].includes(editStaffData?.roleText) ? (
                  <Grid item xs={12} md={5.75}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Availability on Training
                    </Typography>
                    <TextSunEditor
                      setData={setFormData}
                      contentData={formData.availabilityOnTraining || ""}
                      name="availabilityOnTraining"
                      minHeight={"150px"}
                    />
                  </Grid>
                ) : null}
                <Grid container item xs={12} md={5.75} spacing={1}>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Acknowledgement Date <span className="asterisk">*</span>
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="acknowledgementDate"
                      label="Acknowledgement Date"
                      boxmb={0.8}
                      required={false}
                      minDate={moment().subtract(60, "years")}
                      maxDate={moment()}
                      onChange={dateChange}
                      defaultValue={formData && formData.acknowledgementDate}
                    // setErrors={setErrors}
                    // rules={{ required: "Acknowledgement Date is required" }}
                    />
                    {errors.acknowledgementDate && (
                      <Typography
                        variant="caption"
                        className="error-message"
                        mt={2}
                      >
                        {errors.acknowledgementDate}
                      </Typography>
                    )}
                    <FileUploader
                      key="acknowledgementDoc"
                      fileKey="acknowledgementDoc"
                      fileLabel="Upload the signed document (PDF)"
                      formatType={PDF_FORMAT}
                      fileType={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                      flag={DROPZONE_IMAGE_FLAG.ACKNOWLEDGEMENT}
                      moduleName="Staff"
                      moduleId={parsedData.staffID || staffEditId}
                      fileInputRef={(el: any) => {
                        if (el) fileRefs.current["acknowledgementDoc"] = el;
                      }}
                      formData={formData}
                      setFormData={setFormData}
                      errors={errors}
                      handleFileChange={handleFileChange}
                      handleDeleteFile={handleDeleteFile}
                      handleFileClick={() =>
                        handleFileClick("acknowledgementDoc")
                      }
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Pledge Date <span className="asterisk">*</span>
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="pledgeDate"
                      label="Pledge Date"
                      boxmb={0.8}
                      required={false}
                      minDate={moment().subtract(60, "years")}
                      maxDate={moment()}
                      onChange={dateChange}
                      defaultValue={formData && formData.pledgeDate}
                    // setErrors={setErrors}
                    // rules={{ required: "Pledge Date is required" }}
                    />
                    {errors.pledgeDate && (
                      <Typography
                        variant="caption"
                        className="error-message"
                        mt={2}
                      >
                        {errors.pledgeDate}
                      </Typography>
                    )}
                    <FileUploader
                      key="pledgeDoc"
                      fileKey="pledgeDoc"
                      fileLabel="Upload the signed document (PDF)"
                      formatType={PDF_FORMAT}
                      fileType={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                      flag={DROPZONE_IMAGE_FLAG.PLEDGE}
                      moduleName="Staff"
                      moduleId={parsedData.staffID || staffEditId}
                      fileInputRef={(el: any) => {
                        if (el) fileRefs.current["pledgeDoc"] = el;
                      }}
                      formData={formData}
                      required={true}
                      setFormData={setFormData}
                      errors={errors}
                      handleFileChange={handleFileChange}
                      handleDeleteFile={handleDeleteFile}
                      handleFileClick={() => handleFileClick("pledgeDoc")}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Certificate of Good Conduct{" "}
                    <span className="asterisk">*</span>
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="certificateOfGoodConduct"
                    label="Certificate of Good Conduct"
                    boxmb={0.8}
                    required={false}
                    minDate={moment().subtract(10, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.certificateOfGoodConduct}
                  // setErrors={setErrors}
                  // rules={{ required: "Certificate of Good Conduct is required" }}
                  />
                  {errors.certificateOfGoodConduct && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      mt={2}
                    >
                      {errors.certificateOfGoodConduct}
                    </Typography>
                  )}
                  <FileUploader
                    key="certificateOfGoodConductDoc"
                    fileKey="certificateOfGoodConductDoc"
                    fileLabel="Upload the signed document (PDF)"
                    formatType={PDF_FORMAT}
                    fileType={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                    flag={DROPZONE_IMAGE_FLAG.COD}
                    moduleName="Staff"
                    moduleId={parsedData.staffID || staffEditId}
                    fileInputRef={(el: any) => {
                      if (el)
                        fileRefs.current["certificateOfGoodConductDoc"] = el;
                    }}
                    formData={formData}
                    required={true}
                    setFormData={setFormData}
                    errors={errors}
                    handleFileChange={handleFileChange}
                    handleDeleteFile={handleDeleteFile}
                    handleFileClick={() =>
                      handleFileClick("certificateOfGoodConductDoc")
                    }
                  />
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Medical Issues
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="medicalIssues"
                      value={formData.medicalIssues}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                        className="dubai-med textfield-label"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                        className="dubai-med textfield-label"
                      />
                    </RadioGroup>
                  </FormControl>
                  {formData && formData.medicalIssues === "Yes" ? (
                    <TextSunEditor
                      setData={setFormData}
                      contentData={formData.medicalIssueDetails || ""}
                      name="medicalIssueDetails"
                      minHeight={"150px"}
                    />
                  ) : null}
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
                  disabled={staffAddEmployementData.loading}
                >
                  {staffAddEmployementData.loading
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
export default EmploymentInformation;

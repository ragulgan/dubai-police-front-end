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
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SnackbarCloseReason,
  Fade,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
  AppDispatch,
  RootState,
  singleFileUploadDispatch,
} from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
  BLOOD_GROUPS,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import {
  clearAthleteUpdateState,
  UpdateAthleteByID,
} from "@/redux/slices/athlete/athleteUpdateSlice";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { PhysicalAndMedicalFormValidation } from "@/utils/athletes/validation";
import CustomSnackbar from "../CustomSnackbar";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectInputAdornments from "../Fields/SelectInputAdornments";
import DropDown from "../Fields/DropDown";
import CustomTextField from "../Fields/CustomTextField";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import TextSunEditor from "../SunEditor";

const PhysicalAndMedicalInfoForm = (props: any) => {
  const [formData, setFormData] = useState<any>({
    bodyComposition: "",
    healthIssues: "",
    dietaryRestrictions: "",
  });
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const athleteUpdateResponse = useSelector(
    (state: any) => state.athleteUpdateByID
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  // const staffUpdateData = useSelector((state: any) => state.);
  const dispatch: AppDispatch = useDispatch();
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const singleUpload = useSelector((state: any) => state.singleUpload);
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      height: 0,
      weight: 0,
      bloodType: "",
      previousInjuries: "",
      federationLicense: "",
      sizeOfShoe: "",
      sizeOfJersey: "",
      sizeOfHelmet: "",
      sizeOfGloves: "",
      sizeOfTrousers: "",
      uploadLicense: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (formdata) => {
    // const validationErrors = validate();
    // if (_.isEmpty(validationErrors)) {
    const data: any = {
      ...formdata,
      bodyComposition: formData.bodyComposition,
      healthIssues: formData.healthIssues,
      dietaryRestrictions: formData.dietaryRestrictions,
      weight: Number(formdata.weight),
      height: Number(formdata.height),
      section: "physicalmedicaldetails",
      athleteID: props.id,
    };
    dispatch(UpdateAthleteByID(data));
    // }
  };
  useEffect(() => {
    if (props.editData) {
      const FederalLicenseDocument =
        props.editData &&
        props.editData.attachmentList.filter(
          (item: any) => item.documentSection.toLowerCase() === "license"
        );

      setValue(
        "height",
        props.editData.height && Number(props.editData.height)
      );
      setValue(
        "weight",
        props.editData.weight && Number(props.editData.weight)
      );
      setValue(
        "bloodType",
        props.editData.bloodType && props.editData.bloodType !== " "
          ? props.editData.bloodType
          : ""
      );
      setValue(
        "previousInjuries",
        props.editData.bloodType && props.editData.previousInjuries
      );
      setValue(
        "federationLicense",
        props.editData.federationLicense && props.editData.federationLicense
      );
      setValue(
        "sizeOfShoe",
        props.editData.sizeOfShoe && props.editData.sizeOfShoe !== " "
          ? props.editData.sizeOfShoe
          : ""
      );
      setValue(
        "sizeOfJersey",
        props.editData.sizeOfJersey && props.editData.sizeOfJersey !== " "
          ? props.editData.sizeOfJersey
          : ""
      );
      setValue(
        "sizeOfHelmet",
        props.editData.sizeOfHelmet && props.editData.sizeOfHelmet !== " "
          ? props.editData.sizeOfHelmet
          : ""
      );
      setValue(
        "sizeOfGloves",
        props.editData.sizeOfGloves && props.editData.sizeOfGloves !== " "
          ? props.editData.sizeOfGloves
          : ""
      );
      setValue(
        "sizeOfTrousers",
        props.editData.sizeOfTrousers && props.editData.sizeOfTrousers !== " "
          ? props.editData.sizeOfTrousers
          : ""
      );
      setFormData({
        // ...formData,
        bodyComposition: props.editData.bodyComposition,
        healthIssues: props.editData.healthIssues,
        dietaryRestrictions: props.editData.dietaryRestrictions,
        license: FederalLicenseDocument?.[0]?.fileName || "",
      });
    }
  }, [props.editData]);

  useEffect(() => {
    if (
      athleteUpdateResponse &&
      athleteUpdateResponse.code === 200 &&
      athleteUpdateResponse.status === "succeeded"
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // props.onClose(false)
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
        props.onClose(false);
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);

  const handleFileChange = (fileData: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      license:
        flag === DROPZONE_IMAGE_FLAG.LICENSE
          ? fileData?.name
          : prevData.license,
    }));

    if (fileData && fileData.file) {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("modulename", fileData.modulename);
      formData.append("moduleid", props.id.toString());
      fileUploadDispatch(singleFileUpload(formData));
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
    const fileID = props.editData?.attachmentList?.find(
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
        <SelectInputAdornments
          name="height"
          control={control}
          label="Height"
          // rules={{ required: "Height is required" }}
          rules={{
            required: "Height is required",
            pattern: {
              value: /^[0-9]+(\.[0-9]+)?$/,
              message:
                "Invalid format. Please use the correct format, e.g.,168.21",
            },
            maxLength: { value: 6, message: "Height cannot exceed 6 digits" },
            max: {
              value: 255,
              message: "Height cannot exceed 255 cm",
            },
          }}
          placeholder="Enter Height"
          selectOptions={[
            { value: "CM", label: "CM" },
            { value: "MM", label: "MM" },
          ]}

          // error={watch('residence') ? undefined : "Residence is required"}
        />

        <SelectInputAdornments
          name="weight"
          control={control}
          label="Weight"
          // rules={{ required: "Weight is required" }}
          rules={{
            required: "Weight is required",
            pattern: {
              value: /^[0-9]+(\.[0-9]+)?$/,
              message:
                "Invalid format. Please use the correct format, e.g., 85.45 or 110.45",
            },
            maxLength: { value: 6, message: "Weight cannot exceed 6 digits" },
            max: {
              value: 640,
              message: "Weight cannot exceed 640 kg",
            },
          }}
          placeholder="Enter Weight"
          selectOptions={[{ value: "kg", label: "KG" }]}
          // error={watch('residence') ? undefined : "Residence is required"}
        />

        <DropDown
          name="bloodType"
          label="Blood Type"
          control={control}
          placeholder={"Select Blood Type"}
          // defaultValue={formData && formData.qualification}
          options={[
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
            { value: "ABO", label: "ABO" },
          ]}
          variant="outlined"
          required={true}
          sx={{
            mt: 0.5,
            mb: 0,
          }}
        />
        <CustomTextField
          name="previousInjuries"
          control={control}
          label="Previous Injuries"
          placeholder={"Enter Previous Injuries"}
          rules={{
            //  required: "Previous Injuries is required",
            pattern: {
              value: /^[a-zA-Z0-9\s,.-]*$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 50,
              message: "Previous Injuries cannot exceed 50 characters",
            },
          }}
          // sx={{
          //   marginBottom:'15px',
          //   marginTop:'15px',
          // }}
        />
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={12} flexDirection={"column"}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Body Composition
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.bodyComposition || ""}
              name="bodyComposition"
              minHeight={"150px"}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={12} flexDirection={"column"}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Health Issues
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.healthIssues || ""}
              name="healthIssues"
              minHeight={"150px"}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={12} flexDirection={"column"}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Dietary Restrictions
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.dietaryRestrictions || ""}
              name="dietaryRestrictions"
              minHeight={"150px"}
            />
          </Grid>
        </Grid>

        <CustomTextField
          name="federationLicense"
          control={control}
          label="Federation License"
          placeholder="Enter Federation License"
          rules={{
            // required: "Federation License is required",
            pattern: {
              value: /^[a-zA-Z0-9\s,.-]*$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: {
              value: 100,
              message: "Federation License cannot exceed 50 characters",
            },
          }}
          sx={{
            marginBottom: "15px",
            marginTop: "15px",
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
                flag={DROPZONE_IMAGE_FLAG.LICENSE}
                setData={setFormData}
                formData={formData}
                modulename="Athlete"
                moduleId={props.id}
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
                {formData.license ? (
                  <>{formData.license}</>
                ) : (
                  <>Upload License Certificate : PDF format(max size 25MB)</>
                )}
              </Typography>
              {formData.license && (
                <IconButton
                  className="deleteIconButton"
                   data-testid="delete-license-btn"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteFile("Athlete", props.id, "license");
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
        <SelectInputAdornments
          name="sizeOfShoe"
          control={control}
          label="Size of Shoe"
          // rules={{ required: "Size of Shoe is required" }}
          placeholder="Enter Size of Shoe"
          selectOptions={[{ value: "eu", label: "EU" }]}
          rules={{
            required: "Size of Shoe is required",
            pattern: {
              value: /^[a-zA-Z0-9 /.]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Size of Shoe cannot exceed 100 digits",
            },
          }}
          sx={{
            marginTop: "7px",
            marginBottom: "-5px",
          }}
          // error={watch('residence') ? undefined : "Residence is required"}
        />
        <CustomTextField
          name="sizeOfJersey"
          control={control}
          label="Size Of Jersey"
          placeholder="Enter Size Of Jersey"
          rules={{
            required: "Size Of Jersey is required",
            pattern: {
              value: /^[a-zA-Z0-9 /.]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Size of Jersey cannot exceed 100 digits",
            },
          }}
        />
        <CustomTextField
          name="sizeOfHelmet"
          control={control}
          label="Size Of Helmet"
          placeholder="Enter Size Of Helmet"
          rules={{
            // required: "Size Of Helmet is required",
            pattern: {
              value: /^[a-zA-Z0-9 /.]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Size of Helmet cannot exceed 100 digits",
            },
          }}
        />
        <CustomTextField
          name="sizeOfGloves"
          control={control}
          label="Size Of Gloves"
          placeholder="Enter Size Of Gloves"
          rules={{
            required: "Size Of Gloves is required",
            pattern: {
              value: /^[a-zA-Z0-9 /.]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Size of Gloves cannot exceed 100 digits",
            },
          }}
        />
        <CustomTextField
          name="sizeOfTrousers"
          control={control}
          label="Size Of Trousers"
          placeholder="Enter Size Of Trousers"
          rules={{
            required: "Size Of Trousers is required",
            pattern: {
              value: /^[a-zA-Z0-9 /.]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Size of Trousers cannot exceed 100 digits",
            },
          }}
        />
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Staff member updated successfully!"
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
            onClick={() => props.onClose(false)}
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
export default PhysicalAndMedicalInfoForm;

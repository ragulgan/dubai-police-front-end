"use client";
import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  CircularProgress,
  SnackbarCloseReason,
  Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { useRouter } from "next/router";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { usePathname } from "next/navigation";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import AddMore from "@/components/trainingCamp/add/addMore/strategyAddMore";
import {
  addTrainingCamp,
  clearAddState,
} from "@/redux/slices/trainingCamp/trainingCampAddSlice";
import { addTrainingCampCompetition } from "@/redux/slices/trainingCamp/trainingCampCompetition";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
} from "@/utils/constants";
import {
  trainingCampFileUpload,
  clearState,
} from "@/redux/slices/fileupload/trainingCampFileUpload";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import UploadFileSvg from "../../../../public/UploadIcon.svg";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import CustomTagInput from "@/components/trainingCamp/customTagInput";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import CustomPhoneInput from "@/components/Fields/CustomPhoneInput";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";


const UpdateOverallTrainingCamp = (props: any) => {
  const {
    setActiveStep,
    setAllData,
    setDialogOpen,
    showCancelButton,
    edit,
    onClose,
    trainingCampEditData,
    id,
    setIsUpdated,
    setResetForm,
    resetForm,
    reportID,
    selectedData
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  const reportAddResponse = useSelector((state: RootState) => state.addReport);
  const router = useRouter();
  const [minEndDate, setMinEndDate] = useState(moment());
  const [staffDataOption, setStaffDataOption] = useState<any>("");
  const [NationalityOption, setNationalityOption] = useState<any>("");
  const [athleteDataOption, setAthleteDataOption] = useState<any>("");
  const [competitionData, setCompetitionData] = useState<any>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>("");
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        resultAchieved: '',
        problemEncountered: '',
        positiveAspects: '',
        improvementArea: '',
        resultLink: '',
        uploadDocuments: ''
      },
    });

  const savedData: any = getLocalStorage("addTrainingCampData");
  const parsedData = JSON.parse(savedData);
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];

  const trainindAddData = useSelector(
    (state: RootState) => state.addTrainingCamp
  );





  const onSubmit = (data: any) => {
    console.log({ data }, '3rd steps');
    //  setActiveStep(3)
    const getReportID = selectedData?.finalReport?.reportId
    if (getReportID) {
      //  if(!isEmpty(reportUpdateResponse?.data)){
      dispatch(updateReport({ url: `/Reports/${teamID}/TrainingCamp/${reportID}/${getReportID}/Overall`, payload: data }));
      dispatch(clearReportAddDataState());
    }
  };

  const handleSnackBarClose = (
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
        if (snackbarStatus !== 'error') {
          setActiveStep((prevStep: number) => prevStep + 1)
        }
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);







  const closeAdd = () => {
    setDialogOpen(false);
    if (!isEmpty(parsedData.StrategyDetails)) {
      setDialogOpen(true);
    } else {
      router.push(`/teams/${teamID}/reports`);
    }
  };

  useEffect(() => {
    if (
      (reportUpdateResponse &&
        reportUpdateResponse.code === 200 &&
        reportUpdateResponse.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // setActiveStep(1)
      dispatch(clearReportAddState());
      dispatch(clearReportAddDataState());
      dispatch(clearReportUpdateState());

    } else if (

      (reportUpdateResponse &&
        reportUpdateResponse.code === 500 &&
        reportUpdateResponse.status === "failed") ||
      (reportUpdateResponse &&
        reportUpdateResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearReportAddState());
      dispatch(clearReportAddDataState());
      dispatch(clearReportUpdateState());
    }
  }, [reportUpdateResponse]);

  useEffect(() => {
    console.log({ reportAddResponse });


    if (!isEmpty(reportUpdateResponse?.data?.overall)) {
      setValue("resultAchieved", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.resultAchieved);

      setValue("problemEncountered", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.problemEncountered);
      setValue("positiveAspects", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.positiveAspects);
      setValue("improvementArea", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.improvementArea);
      setValue("resultLink", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.resultLink);
      console.log(reportUpdateResponse.data?.overall?.nutritionPlan, '========');

    }

  }, [reportUpdateResponse])




  return (
    <>
      {trainingCampEditData && trainingCampEditData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Training Camp ${trainingCampID ? "Update" : "Added"
                    } successfully!`
                    : "Something went wrong"
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleSnackBarClose}
              />
            )}
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
                paddingX: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box width="100%">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} justifyContent={"space-between"}>
                    {/* <Grid item xs={12} md={12} marginTop={2}>
                    <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
            // mt={0.5}
            // mb={0.5}
          >
           INDIVIDUAL RESULTS OF THE ATHLETES PARTICIPATING IN THE COMPETITION
          </Typography>
                    </Grid> */}

                    {/* <Grid item xs={12} md={12} 
                    marginBottom={2}
                    >
                    <Divider/>
                    </Grid> */}
                    <Grid item xs={12} md={5.75}>
                      {/* <CustomTextField
          name="resultAchieved"
          control={control}
          label="Result Achieved"
          textarea={true}
          placeholder={"Enter Result Achieved in Training Camp"}
          rules={{
            // required: "Problems Encountered (Cons) is required",
            pattern: {
              value: /^[a-zA-Z0-9\s.-]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 300,
              message: "Result Achieved cannot exceed 300 characters",
            },
          }}
        /> */}
                      <FormWithSunEditor
                        name="resultAchieved"
                        control={control}
                        minHeight={"200px"}
                        label="Result Achieved"
                        rules={{
                          required:
                            "Result Achieved is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      {/* <CustomTextField
                        name="problemEncountered"
                        control={control}
                        label="Problems Encountered (Cons)"
                        textarea={true}
                        placeholder={"Describe the Problems Encountered you have encountered in Training Camp"}
                        rules={{
                          // required: "Problems Encountered (Cons) is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Problems Encountered cannot exceed 300 characters",
                          },
                        }}
                      /> */}
                      <FormWithSunEditor
                        name="problemEncountered"
                        control={control}
                        minHeight={"200px"}
                        label="Problems Encountered (Cons)"
                        rules={{
                          required:
                            "Problems Encountered (Cons) is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      {/* <CustomTextField
                        name="positiveAspects"
                        control={control}
                        label="Positive Aspects"
                        textarea={true}
                        placeholder={"Describe the Positive Aspects you have encountered in Training Camp"}
                        rules={{
                          // required: "Areas For Improvement is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Positive Aspects cannot exceed 300 characters",
                          },
                        }}
                      /> */}
                      <FormWithSunEditor
                        name="positiveAspects"
                        control={control}
                        minHeight={"200px"}
                        label="Positive Aspects"
                        rules={{
                          required:
                            "Positive Aspects is required",
                        }}
                      />

                    </Grid>

                    <Grid item xs={12} md={5.75}>
                      {/* <CustomTextField
                        name="improvementArea"
                        control={control}
                        label="Areas For Improvement"
                        textarea={true}
                        placeholder={"Describe the Areas For Improvement you have encountered in Training Camp"}
                        rules={{
                          // required: "Areas For Improvement is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Areas For Improvement cannot exceed 300 characters",
                          },
                        }}
                      /> */}
                      <FormWithSunEditor
                        name="improvementArea"
                        control={control}
                        minHeight={"200px"}
                        label="Areas For Improvement"
                        rules={{
                          required:
                            "Areas For Improvement is required",
                        }}
                      />

                    </Grid>
                    <Grid item xs={12} md={5.75}>

                      {/* <CustomTextField
                        name="resultLink"
                        label="Link of the Official Result"
                        placeholder="Enter New Link of the Official Result"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9() /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Link of the Official Result cannot exceed 100 characters",
                          },
                          // required: "Link of the Official Result is required",
                        }}
                      /> */}
                      <FormWithSunEditor
                        name="resultLink"
                        control={control}
                        minHeight={"200px"}
                        label="Link of the Official Result"
                        rules={{
                          required:
                            "Link of the Official Result is required",
                        }}
                      />
                      <Grid item xs={12} md={12}>
                        <Divider sx={{ position: "relative", marginY: 2 }}>
                          <Box
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "50%",
                              border: "1px solid #ccc",
                              width: "30px",
                              height: "30px",
                              fontWeight: "bold",
                              display: "flex", // Center the content
                              alignItems: "center", // Vertically center
                              justifyContent: "center", // Horizontally center
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "12px", fontWeight: "bold" }} // Ensure text is bold if needed
                              className="typography textfield-label bukra"
                            >
                              (or)
                            </Typography>
                          </Box>
                        </Divider>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5.75} >
                    </Grid>
                    <Grid item xs={12} md={5.75} >
                      {/* <Grid
                            item
                            xs={12}
                            md={12}
                            borderTop={"1px solid #008755"}
                            sx={{ mt: 5, ml: 2 }}
                          /> */}
                      <Grid item xs={12} md={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontSize: "14px" }}
                          className="typography textfield-label bukra"
                          mt={1.5}
                          mb={0.5}
                        >
                          Upload of the Official Result Provided By the Event
                          Organizer
                        </Typography>
                        <Box
                          border={"1px dashed #008755"}
                          bgcolor={"rgba(0, 135, 85, 0.03)"}
                          className="upload-travel"
                          position={"relative"}
                          borderRadius={"8px"}
                        >
                          <FileUploader
                            // handleChange={handleChange}
                            name="file"
                            types={["pdf"]}
                            className="upload-outline"
                            label={"Click or drag file to this area to upload"}
                            uploadedLabel={
                              // isEmpty(formData) true
                              true
                                ? "Click or drag file to this area to upload"
                                : formData && formData.file === ""
                                  ? "Upload failed! Please try again"
                                  : null
                            }
                          // disabled={singleUploadData.loading}
                          />
                          <Uploadtravel
                            style={{
                              position: "absolute",
                              top: "49%",
                              left: "10%",
                              cursor: "pointer",
                              height: "50px",
                              width: "50px",
                            }}
                          // onClick={handleFileUpload}
                          />
                          {/* {(formData &&
                          formData.file &&
                          formData.file.name) ||
                          (uploadDocuments && uploadDocuments) ? (
                          <DeleteOutlinedIcon
                            style={{
                              position: "absolute",
                              top: "49%",
                              right: "30%",
                              cursor: "pointer",
                              height: "20px",
                              width: "20px",
                            }} */}
                          {/* onClick={handleDeleteFile} */}
                          {/* />
                        ) : null} */}
                          <Box
                            textAlign={"center"}
                            position={"absolute"}
                            bottom={"30%"}
                            right={

                              (formData &&
                                formData?.file &&
                                formData?.file?.name)
                                ? "25%"
                                :
                                "30%"
                            }
                            className="dubai-light-med secondary-color webkit-line-clamp webkit-1"
                            fontWeight={600}
                            fontSize={"14px"}
                            width={"40%"}
                          >
                            {
                              (formData &&
                                formData?.file &&
                                formData?.file?.name) ? (
                                <Typography
                                  className="dubai-med primary-color"
                                  sx={{ fontSize: "16px", fontWeight: "600" }}
                                >
                                  {
                                    // {uploadDocuments.split("/").pop() ||
                                    formData?.file?.name}
                                </Typography>
                              ) : (
                                "Supported formats: PDF, DOC"
                              )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>


                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                      gap: 1,
                    }}
                  >
                    {!showCancelButton && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        // sx={{ mr: 1 }}
                        onClick={() => setActiveStep(1)}
                        // onClick={() => {
                        //   if (edit) {
                        //     onClose();
                        //   } else {
                        //     closeAdd();
                        //   }
                        // }}
                        className="cancel-button text-capitalize dubai-med"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med"
                      // disabled={
                      //   trainindAddData.loading ||
                      //   trainingUpdateData.loading ||
                      //   trainingCampEditData?.loading
                      // }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500 }}
                    >
                      Update
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med"
                      // disabled={
                      //   trainindAddData.loading ||
                      //   trainingUpdateData.loading ||
                      //   trainingCampEditData?.loading
                      // }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500 }}
                    >
                      {trainindAddData.loading ||
                        // trainingUpdateData.loading ||
                        trainingCampEditData?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Update & Continue"
                      )}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default UpdateOverallTrainingCamp;

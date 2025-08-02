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
import { clearReportAddState } from "@/redux/slices/reports/reportAddSlice";


const UpdateOverallCompetitionReport = (props: any) => {
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
    data
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");

  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  const reportAddResponse = useSelector((state: RootState) => state.addReport);
  const RaceID = useSelector((state: RootState) => !state?.addReport?.error ? state?.addReport?.data?.reportId : null);

  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        problemEncountered: '',
        positiveAspects: '',
        improvementArea: '',
      },
    });

  const savedData: any = getLocalStorage("addTrainingCampData");
  const parsedData = JSON.parse(savedData);
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];

  const trainindAddData = useSelector(
    (state: RootState) => state.addTrainingCamp
  );
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );

  const onSubmit = (formData: any) => {
    // const getReportID = data?.finalReport?.reportId
    const getRaceID = data?.planning?.reportId ? data?.planning?.reportId && data?.planning?.reportId : data?.finalReport?.reportId ? data?.finalReport?.reportId : reportAddResponse?.data.reportId ? reportAddResponse?.data.reportId : reportUpdateResponse?.data.reportId
    console.log({ data }, '3rd steps');
    //  setActiveStep(3)
    dispatch(updateReport({ url: `/Reports/${teamID}/Race/${reportID}/${getRaceID}/Overall`, payload: formData }));
    // dispatch(updateReport({ url: `/Reports/1/Race/21/${getReportID}/Overall`, payload: data }));
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
        setSnackbarOpen(false);
        if (snackbarStatus !== 'error') {
          setActiveStep(3)
        }
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (!isEmpty(reportUpdateResponse?.data?.overall)
    ) {
      setValue("improvementArea", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.improvementArea);
      setValue("positiveAspects", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.positiveAspects);
      setValue("problemEncountered", reportUpdateResponse.data && reportUpdateResponse.data?.overall?.problemEncountered);

    }
  }
    , [reportUpdateResponse])

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
      dispatch(clearReportUpdateState());
    }
  }, [reportUpdateResponse]);


  const closeAdd = () => {
    setDialogOpen(false);
    if (!isEmpty(parsedData.StrategyDetails)) {
      setDialogOpen(true);
    } else {
      router.push(`/teams/${teamID}/reports`);
    }
  };








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
                    ? `Overall Details ${"Update"
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
                      <CustomTextField
                        name="problemEncountered"
                        control={control}
                        label="Problems Encountered (Cons)"
                        textarea={true}
                        placeholder={"Describe the Problems you have encountered in Training Camp"}
                        rules={{
                          // required: "Problems Encountered (Cons) is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Problems Encountered (Cons) cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="positiveAspects"
                        control={control}
                        label="Positive Aspects"
                        textarea={true}
                        placeholder={"Describe the Positive Aspects you have encountered in Training Camp"}
                        rules={{
                          // required: "Positive Aspects is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Positive Aspects cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
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
                            message: "Performance aspects Comment cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>

                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                      gap: 1
                    }}
                  >
                    {!showCancelButton && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        // sx={{ mr: 1 }}
                        onClick={
                          () => setActiveStep(1)

                        }
                        sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
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
                      disabled={
                        trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading
                      }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
                    >
                      Update
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med"
                      disabled={
                        trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading
                      }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
                    >
                      {trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : 'Update & Continue'}
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
export default UpdateOverallCompetitionReport;

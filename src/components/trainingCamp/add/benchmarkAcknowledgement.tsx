"use client";
import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  SnackbarCloseReason,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { usePathname } from "next/navigation";
import CustomFormControlLabel from "@/components/Forms/CustomFormControlLabel";
import CustomCheckbox from "@/components/checkbox/CustomCheckbox";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import { clearState } from "@/redux/slices/fileupload/singleFileUpload";
import { useRouter } from "next/router";
import moment from "moment";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  FILE_FORMAT_TYPE,
} from "@/utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawIcon from "@mui/icons-material/Draw";
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { getNotificationModuleByID } from "@/redux/slices/notification/getNotificationModuleByID";
import { addNotification } from "@/redux/slices/notification/NotificationAddSlice";

const BenchmarkAcknowledgment = (props: any) => {
  const {
    activeStep,
    setActiveStep,
    setDisableRouting,
    setRouteHandel,
    showCancelButton,
    edit,
    trainingCampEditData,
    id,
    onClose,
    setResetForm,
    resetForm,
    payload,
    setAllData,
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { handleSubmit, control, setValue, reset, watch, getValues } =
    useForm<any>({
      defaultValues: {
        entityToBeBenchmarked: null,
        benchmarkTopic: null,
        benchmarkNotesAndComments: null,
        benchmarkDate: dayjs().format("DD/MM/YYYY"),
        benchmarkName: "Dubai Police",
        signature: "",
      },
    });
  const [acknowledgement, setAcknowledgement] = useState<any>(
    edit ? true : false
  );
  const [days, setDays] = useState<any>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const savedData: any = getLocalStorage("addTrainingCampData");
  const parsedData = JSON.parse(savedData);
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const filelicenseRef = useRef<HTMLInputElement>(null);

  const [notificationMessage, setNotificationMessage] = useState("");
  const GetNotificationModuleByIDData = useSelector((state: any) => {
    return state.getNotificationModuleByID;
  });
  const getCurrentSport = getLocalStorage("sport");

  useEffect(() => {
    if (process.env.ENABLE_NOTIFICATION === "yes") {
      const payload: any = {
        moduleID: "124",
      }
      dispatch(
        getNotificationModuleByID({ url: "/GetNotificationModuleByID", payload: payload })
      );
    }
  }, []);

  useEffect(() => {
    if (GetNotificationModuleByIDData && GetNotificationModuleByIDData.code === 200) {
      setNotificationMessage(GetNotificationModuleByIDData?.data[0]?.message)

    } else if (GetNotificationModuleByIDData?.code !== 200) {
      console.error("Failed to fetch data:", GetNotificationModuleByIDData?.message);
    }
  }, [GetNotificationModuleByIDData]);

  const onSubmit = (data: any) => {
    if (trainingCampID) {
      const payload = {
        section: "benchMark",
        trainingCampID: Number(trainingCampID && trainingCampID),
        entityToBeBenchmarked: data?.entityToBeBenchmarked,
        benchmarkTopic: data?.benchmarkTopic,
        benchmarkNotesAndComments: data?.benchmarkNotesAndComments,
        benchmarkDate: data?.benchmarkDate,
        benchmarkName: data?.benchmarkName,

        sportID: Number(teamID),
      };
      dispatch(
        updateTrainingCamp({
          url: "/UpdateTrainingCampByID",
          payload: payload,
        })
      );
    } else {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
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
    if (resetForm) {
      reset({
        entityToBeBenchmarked: null,
        benchmarkTopic: null,
        benchmarkNotesAndComments: null,
        benchmarkDate: dayjs().format("DD/MM/YYYY"),
        benchmarkName: "Dubai Police",
      });
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
      setAcknowledgement(false);
    }
  }, [resetForm]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (trainingUpdateData && trainingUpdateData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");

      if (!edit) {
        setRouteHandel(false);
        setDisableRouting(false);
      }

      // notification
      if (process.env.ENABLE_NOTIFICATION === "yes") {
        const trainingPlanLink = `${process.env.BASE_DOMAIN}teams/${getCurrentSport}/trainingCamp/view/${trainingUpdateData?.data?.trainingCampID}`;
        const updatedMessage = notificationMessage.replace(
          "[Link]",
          `<a href="${trainingPlanLink}">click here</a>`
        );

        const NotificationPayload: any = {
          moduleID: 124,
          sportID: Number(teamID),
          userID: trainingCampEditData?.data[0]?.athletes || "",
          name: trainingCampEditData?.data[0]?.campName,
          date: moment(trainingCampEditData?.data[0]?.campStartDate, "DD/MM/YYYY").format(
            "DD-MM-YYYY"
          ),
          message: updatedMessage,
        }
        if (!edit) {
          dispatch(addNotification({ url: "/InsertNotification", payload: NotificationPayload }));
        }
      }

      setTimeout(() => {
        if (edit) {
          onClose();
        } else {
          router.push(`/teams/${teamID}/trainingCamp`);
        }
      }, 1000);
      dispatch(clearUpdateState());
    } else if (trainingUpdateData && trainingUpdateData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearUpdateState());
    } else if (trainingUpdateData && trainingUpdateData.code === 409) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearUpdateState());
    }
  }, [trainingUpdateData]);

  useEffect(() => {
    if (trainingCampEditData && trainingCampEditData.code === 200) {
      const date1: any = moment(
        trainingCampEditData.data && trainingCampEditData.data[0]?.campEndDate,
        "DD/MM/YYYY"
      );
      const date2: any = moment(
        trainingCampEditData.data &&
        trainingCampEditData.data[0]?.campStartDate,
        "DD/MM/YYYY"
      );
      const diffInMs = date1 - date2;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      setDays(diffInDays);
      setTrainingCampID(
        trainingCampEditData.data &&
        trainingCampEditData.data[0]?.trainingCampID
      );
    } else if (parsedData.StrategyDetails) {
      const date1: any = new Date(parsedData.StrategyDetails.campEndDate);
      const date2: any = new Date(parsedData.StrategyDetails.campStartDate);
      const diffInMs = date1 - date2;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      setDays(diffInDays);
      setTrainingCampID(parsedData.trainingCampID);
    }
  }, [trainingCampEditData, parsedData]);

  useEffect(() => {
    if (singleUploadData?.code === 200) {
      dispatch(clearState());
    }
  }, [singleUploadData]);

  const closeAdd = () => {
    const value = getValues();
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      Benchmark: value,
    }));
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (trainingCampEditData && trainingCampEditData.code === 200) {
      setValue(
        "entityToBeBenchmarked",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].entityToBeBenchmarked
      );
      setValue(
        "benchmarkTopic",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].benchmarkTopic
      );
      setValue(
        "benchmarkNotesAndComments",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].benchmarkNotesAndComments
      );
      setValue(
        "signature",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].signatureFilePath
      );
    }
  }, []);

  const handleFileChange = (file: any, flag: any) => {
    setValue("signature", file?.name);
  };

  const handlicenseClick = () => {
    if (filelicenseRef.current) {
      filelicenseRef.current.click();
    }
  };

  const handleDeleteFile = async (
    modulename: any,
    moduleId: any,
    fileType: any
  ) => {
    const fileID =
      trainingCampEditData &&
      trainingCampEditData?.data[0] &&
      trainingCampEditData?.data[0].signatureFileID;
    if (moduleId) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,

        fileID: fileID,
      };
      dispatch(deleteFile(data));
      setValue("signature", "");
    }
  };
  const signatureValue = watch("signature");

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={0}>
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? `Training Camp ${currentNav?.split("/")[4] === "add" ? "Added" : "Updated"
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
                {edit ? null : (
                  <Grid item xs={12} md={12}>
                    <Typography
                      className="dubai-med"
                      sx={{
                        fontSize: "14px",
                        p: 2,
                        bgcolor: "rgba(0, 32, 91, 0.03)",
                        border: "1px dashed rgba(0, 32, 91, 1)",
                        borderRadius: "8px",
                      }}
                    >
                      In case the stay outside the country exceeds 10 days, the
                      team is required to conduct a benchmark with a leading
                      sports or police-related entity, and submit the final
                      benchmark report within 8 working days after returning to
                      the country.
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={5.75}>
                  <FormWithSunEditor
                    name="entityToBeBenchmarked"
                    control={control}
                    minHeight={"200px"}
                    label="Entity to be Benchmarked"
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <FormWithSunEditor
                    name="benchmarkTopic"
                    control={control}
                    minHeight={"200px"}
                    label="Benchmark Topic/Subject"
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <FormWithSunEditor
                    name="benchmarkNotesAndComments"
                    control={control}
                    minHeight={"200px"}
                    label="Notes & Comments"
                  />
                </Grid>
                {edit ? null : (
                  <>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      borderTop={"1px solid #D8D8D8"}
                      mt={2}
                      mx={2}
                      className="padding-left-0"
                    >
                      <Typography className="typography textfield-label bukra">
                        Acknowledgement
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <CustomFormControlLabel
                        control={
                          <CustomCheckbox
                            checked={acknowledgement}
                            onChange={() => {
                              if (acknowledgement) {
                                setAcknowledgement(false);
                              } else {
                                setAcknowledgement(true);
                              }
                            }}
                          />
                        }
                        label="I hereby acknowledge that I have reviewed and fully understand all the regulations pertaining to Dubai Police, including those related to sports competitions and training camps. I confirm my compliance with these regulations and agree to adhere to the guidelines set forth therein."
                        className="dubai-med"
                      />
                    </Grid>
                    <Grid container item xs={12} md={5.75} spacing={2}>
                      <Grid item xs={6}>
                        <CustomDatePicker
                          control={control}
                          name="benchmarkDate"
                          label="Date"
                          boxmb={0.8}
                          className="Text-field-customise"
                          defaultValue={dayjs().format("DD/MM/YYYY")}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomTextField
                          name="benchmarkName"
                          label="Name"
                          placeholder="Enter New City"
                          control={control}
                          disabled={true}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                {edit ? null : (
                  <Grid
                    xs={12}
                    md={12}
                    container
                    spacing={0}
                    justifyContent="start"
                    direction="column"
                    // alignItems="center"
                    mt={1}
                  >
                    <Typography
                      className="typography textfield-label bukra"
                      mb={2}
                      mt={2}
                      sx={{ ml: 2 }}
                    >
                      By ,
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        border: "1px dashed rgba(0, 135, 85, 1)",
                        borderRadius: "5px",
                        padding: "8px 16px",
                        width: "fit-content",
                        backgroundColor: "#fff",
                        ml: 2,
                      }}
                    >
                      <Grid item alignItems="flex-start">
                        <IconButton
                          className="attachFileButton"
                          component="label"
                          aria-label="attach-file"
                          sx={{
                            color: "rgba(0, 135, 85, 1)",
                            "&:hover": {
                              backgroundColor: "rgba(38, 208, 124, 0.3)",
                            },
                            padding: 1,
                          }}
                        >
                          <FileUpload
                            onFileChange={(file: any, flag: any) =>
                              handleFileChange(file, flag)
                            }
                            formatType={FILE_FORMAT_TYPE}
                            type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                            flag={DROPZONE_IMAGE_FLAG.SIGNATURE}
                            modulename="TrainingCamp"
                            moduleId={+trainingCampID}
                            fileInputRef={filelicenseRef}
                            fetchDataApi={() =>
                              dispatch(
                                editTrainingCamp({
                                  url: "/GetTrainingCampByID",
                                  payload: payload,
                                })
                              )
                            }
                          />
                          <DrawIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Box display="flex" alignItems="center">
                          <Typography
                            align="center"
                            className="dubai-med upload-label"
                            onClick={handlicenseClick}
                            style={{
                              cursor: "pointer",
                              color: "rgba(0, 135, 85, 1)",
                            }}
                          >
                            {signatureValue ? (
                              <>{signatureValue}</>
                            ) : (
                              <>Signature</>
                            )}
                          </Typography>
                          {signatureValue && (
                            <IconButton
                              className="deleteIconButton"
                              aria-label="delete"
                              onClick={() => {
                                handleDeleteFile(
                                  "TrainingCamp",
                                  parsedData?.trainingCampID,
                                  "Signature"
                                );
                                setValue("signature", "");
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
                    </Box>
                  </Grid>
                )}
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginY: "1.5rem",
                }}
              >
                {!showCancelButton && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      closeAdd();
                    }}
                    className="cancel-button text-capitalize dubai-med"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  className="text-capitalize dubai-med cancel-button"
                  disabled={
                    trainingUpdateData.loading ||
                    !acknowledgement ||
                    trainingCampEditData?.loading
                  }
                  onClick={handleSubmit(onSubmit)}
                  sx={{ fontSize: "16px", weight: 500 }}
                >
                  {trainingUpdateData.loading ||
                    trainingCampEditData?.loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : edit ? (
                    "Update"
                  ) : (
                    "Submit For Approval"
                  )}
                </Button>
              </Box>
              {!acknowledgement && !edit && (
                <Box textAlign={"end"}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#d32f2f" }}
                    className="dubai-med"
                  >
                    Please Select the Acknowledgement.
                  </Typography>
                </Box>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default BenchmarkAcknowledgment;

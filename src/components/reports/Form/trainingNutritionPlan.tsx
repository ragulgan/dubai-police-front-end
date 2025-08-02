"use client";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomTextField from "@/components/Fields/CustomTextField";
import TrainingDayAddMore from "@/components/reports/trainingDayAddMore";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";
import { clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid,
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
import { Dayjs } from "dayjs";
import { isEmpty } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";


const TrainingNutritionPlan = (props: any) => {
  const {
    activeStep,
    setActiveStep,
    setAllData,
    showCancelButton,
    edit,
    trainingCampEditData,
    id,
    setIsUpdated,
    setResetForm,
    resetForm,
    reportID,
    selectedData
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [days, setDays] = useState<any>("");
  const [trainingPlanData, setTrainingPlanData] = useState<any>([]);
  console.log({ trainingPlanData });

  const [trainingPlanSelectedData, setTrainingPlanSelectedData] = useState<any>(
    {}
  );

  const [applyDaysForTraining, setApplyDaysForTraining] = useState<any>(false);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  const reportAddResponse = useSelector((state: RootState) => state.addReport);
  console.log({ reportAddResponse });
  const campDefaultStartDate = !isEmpty(reportAddResponse?.data) ? moment(reportAddResponse.data?.trainingCamp?.startDate) : !isEmpty(reportUpdateResponse?.data) ? moment(reportUpdateResponse?.data?.trainingCamp.startDate) : null;
  const campDefaultEndDate = !isEmpty(reportAddResponse?.data) ? moment(reportAddResponse.data?.trainingCamp?.endDate) : !isEmpty(reportUpdateResponse?.data) ? moment(reportUpdateResponse?.data?.trainingCamp.endDate) : null;
  // const diffDays = Math.abs(campDefaultStartDate && campDefaultStartDate.diff(campDefaultEndDate && campDefaultEndDate, "days"));
  const diffDays = Math.abs(
    (campDefaultStartDate as Dayjs).diff(campDefaultEndDate as Dayjs, "days")
  );

  const { handleSubmit, control, setValue, getValues, reset } = useForm<any>({
    defaultValues: {
      nutritionPlan: [
        {
          dayNo: null,
          morning: null,
          afternoon: null,
        },
      ],
      tacticalPreparation: null,
      performanceMonitoring: null,
      recoveryStrategy: null,
    },
  });

  const tableTrainingHeaders = [
    "Day",
    "Morning Training Plan",
    "Afternoon Training Plan",
    "Actions",
  ];
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];

  const onSubmit = (data: any) => {
    // if (trainingCampID) {
    const payload: any = {
      ...data,
      nutritionPlan: trainingPlanData
    };
    //   dispatch(
    //     updateTrainingCamp({ url: "/UpdateTrainingCampByID", payload: payload })
    //   );
    // } else {
    //   setSnackbarOpen(true);
    //   setSnackbarStatus("error");
    // }
    console.log({ selectedData });


    const getReportID = selectedData?.finalReport?.reportId
    if (getReportID) {
      //  if(!isEmpty(reportUpdateResponse?.data)){
      dispatch(updateReport({ url: `/Reports/${teamID}/TrainingCamp/${reportID}/${getReportID}/TrainingNutritionPlan`, payload: payload }));
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

  const handleDeleteTraining = (item: any) => {
    setTrainingPlanData(
      trainingPlanData &&
      trainingPlanData.filter(
        (plan: any) => plan.dayNo !== item?.dayNo
      )
    );
    setTrainingPlanSelectedData(
      trainingPlanData &&
      trainingPlanData.filter(
        (plan: any) => plan.dayNo === item?.dayNo
      )
    );
  };



  useEffect(() => {
    if (resetForm) {
      setTrainingPlanData([]);
      reset({
        nutritionPlan: [
          {
            dayNo: "",
            morning: "",
            afternoon: "",
          },
        ],
        tacticalPreparation: null,
        performanceMonitoring: null,
        recoveryStrategy: null,
      });
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
    }
  }, [resetForm]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
        if (snackbarStatus !== 'error') {
          setActiveStep((prevStep: number) => prevStep + 1)
        }
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);





  console.log({ applyDaysForTraining, trainingPlanData, days });
  console.log({ diffDays });

  useEffect(() => {
    console.log({ days, applyDaysForTraining });

    if (applyDaysForTraining && typeof diffDays === 'number') {
      setTrainingPlanSelectedData([]);
      const trainingCampTrainingPlan = Array.from(
        { length: diffDays },
        (_, index) => ({
          dayNo: index + 1,
          // dayNo: `Day ${index + 1}`,
          morning: trainingPlanData[0]?.morning,
          afternoon: trainingPlanData[0]?.afternoon,
        })
      );
      console.log({ trainingCampTrainingPlan });
      setTrainingPlanData(
        (trainingCampTrainingPlan || []).map((comp: any) => ({
          dayNo: comp.dayNo,
          morning: comp.morning,
          afternoon: comp.afternoon,
        }))
      );
    }

  }, [days, applyDaysForTraining]);


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


    if (!isEmpty(reportUpdateResponse?.data?.nutritionPlan)) {
      setValue("performanceMonitoring", reportUpdateResponse.data && reportUpdateResponse.data?.nutritionPlan?.performanceMonitoring);

      setValue("recoveryStrategy", reportUpdateResponse.data && reportUpdateResponse.data?.nutritionPlan?.recoveryStrategy);
      setValue("tacticalPreparation", reportUpdateResponse.data && reportUpdateResponse.data?.nutritionPlan?.tacticalPreparation);
      console.log(reportUpdateResponse.data?.nutritionPlan?.nutritionPlan, '========');
      setTrainingPlanData(reportUpdateResponse.data?.nutritionPlan.nutritionPlan)
      // setValue("nutritionPlan", reportUpdateResponse.data && reportUpdateResponse.data?.nutritionPlan);

    }

  }, [reportUpdateResponse])

  const closeAdd = () => {
    setActiveStep((prevStep: number) => prevStep - 1);
  };

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

                <Grid item xs={12} md={12}>
                  <Box
                    sx={{ border: "1px solid #E0E0E0", borderRadius: "8px" }}
                  >
                    <Box p={2} borderBottom={"1px solid #E0E0E0"}>
                      <Typography className="typography textfield-label bukra">
                        Training Plan
                      </Typography>
                    </Box>

                    {true && <Box p={2}>
                      <TableContainer
                        sx={{
                          border: "1px solid rgba(88, 88, 91, 0.2)",
                          borderRadius: "4px",
                        }}
                      >
                        {trainingPlanData.length !== 0 && <Table stickyHeader aria-label="team table">
                          <TableHead>
                            <TableRow>
                              {tableTrainingHeaders.map((header: any) => (
                                <TableCell
                                  key={header}
                                  align={"left"}
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontWeight: "bold",
                                    color: "#58585B",
                                    width:
                                      header === "Afternoon Training Plan"
                                        ? "50%"
                                        : "auto",
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
                            {trainingPlanData &&
                              trainingPlanData.length > 0 &&
                              [...trainingPlanData]
                                .sort((a: any, b: any) => {
                                  const dayA = parseInt(
                                    a.dayNo,
                                    // a.dayNo?.replace("Day ", ""),
                                    10
                                  );
                                  const dayB = parseInt(
                                    b.dayNo,
                                    10
                                  );
                                  return dayA - dayB;
                                })
                                .map((item: any, index: any) => (
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
                                          textTransform: "capitalize",
                                        }}
                                        className="dubai-regular"
                                      >
                                        Day {item?.dayNo}
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
                                        {item?.morning}
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
                                        {item?.afternoon}
                                      </Typography>
                                    </TableCell>
                                    <TableCell
                                      sx={{ whiteSpace: "nowrap", p: 1.25 }}
                                    >
                                      <Tooltip title={"Delete"}>
                                        <Button
                                          variant="text"
                                          sx={{
                                            minWidth: "0",
                                            width: "30px",
                                            height: "30px",
                                            color: "#05868E",
                                          }}
                                          onClick={() =>
                                            handleDeleteTraining(item)
                                          }
                                          disabled={
                                            trainingPlanSelectedData &&
                                            trainingPlanSelectedData.length ===
                                            1
                                          }
                                        >
                                          <DeleteOutlinedIcon />
                                        </Button>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))}
                          </TableBody>
                        </Table>
                        }
                      </TableContainer>
                      <Grid
                        container
                        item
                        xs={12}
                        md={12}
                        spacing={2}
                        mt={1}
                        justifyContent={"space-between"}
                      >
                        {(
                          <>
                            <TrainingDayAddMore
                              applyDaysForTraining={applyDaysForTraining}
                              setApplyDaysForTraining={setApplyDaysForTraining}
                              getTrainingCampTrainingPlanData={trainingPlanData}
                              setTrainingPlanData={setTrainingPlanData}
                              trainingPlanData={trainingPlanData}
                              trainingPlanSelectedData={
                                trainingPlanSelectedData
                              }
                              setTrainingPlanSelectedData={
                                setTrainingPlanSelectedData
                              }
                              resetForm={resetForm}
                              setResetForm={setResetForm}
                            />
                          </>
                        )}
                        {/* {trainingPlanData &&
                        trainingPlanData.length >= days ? null : (
                          <>
                            <TrainingDayAddMore
                              applyDaysForTraining={applyDaysForTraining}
                              setApplyDaysForTraining={setApplyDaysForTraining}
                              getTrainingCampTrainingPlanData={trainingPlanData}
                              setTrainingPlanData={setTrainingPlanData}
                              trainingPlanData={trainingPlanData}
                              trainingPlanSelectedData={
                                trainingPlanSelectedData
                              }
                              setTrainingPlanSelectedData={
                                setTrainingPlanSelectedData
                              }
                              resetForm={resetForm}
                              setResetForm={setResetForm}
                            />
                          </>
                        )} */}

                      </Grid>
                    </Box>}
                  </Box>

                </Grid>
                <Grid item xs={12} md={5.75}>
                  {/* <CustomTextField
                    name="tacticalPreparation"
                    control={control}
                    label="Technical / Tactical Preparation"
                    textarea={true}
                    placeholder={"Focus on skill development and specific strategies for competition, including drills and game plans."}
                    rules={{
                      required: "technical / Tactical Preparation is required",
                      pattern: {
                        value: /^[a-zA-Z0-9\s.-]+$/,
                        message: "Invalid Format",
                      },
                      maxLength: {
                        value: 300,
                        message: "technical / Tactical Preparation cannot exceed 300 characters",
                      },
                    }}
                  /> */}

                  <FormWithSunEditor
                    name="tacticalPreparation"
                    control={control}
                    minHeight={"200px"}
                    label="Technical / Tactical Preparation"
                    rules={{
                      required:
                        "Technical / Tactical Preparation is required",
                    }}
                  />

                </Grid>
                <Grid item xs={12} md={5.75}>
                  {/* <CustomTextField
                    name="performanceMonitoring"
                    control={control}
                    label="Performance Monitoring System"
                    textarea={true}
                    placeholder={"Use wearables, GPS devices, and apps to track metrics like heart rate, distance, and overall progress."}
                    rules={{
                      required: "performance Monitoring System is required",
                      pattern: {
                        value: /^[a-zA-Z0-9\s.-]+$/,
                        message: "Invalid Format",
                      },
                      maxLength: {
                        value: 300,
                        message: "performance Monitoring System cannot exceed 300 characters",
                      },
                    }}
                  /> */}
                  <FormWithSunEditor
                    name="performanceMonitoring"
                    control={control}
                    minHeight={"200px"}
                    label="Performance Monitoring System"
                    rules={{
                      required:
                        "Performance Monitoring System is required",
                    }}
                  />

                </Grid>
                <Grid item xs={12} md={5.75}>
                  {/* <CustomTextField
                    name="recoveryStrategy"
                    control={control}
                    label="Recovery Strategies"
                    textarea={true}
                    placeholder={"Prioritize rest, active recovery, hydration, stretching, proper nutrition, and therapies like cold treatments for muscle repair."}
                    rules={{
                      required: "Recovery Strategies is required",
                      pattern: {
                        value: /^[a-zA-Z0-9\s.-]+$/,
                        message: "Invalid Format",
                      },
                      maxLength: {
                        value: 300,
                        message: "Recovery Strategies cannot exceed 300 characters",
                      },
                    }}
                  /> */}
                  <FormWithSunEditor
                    name="recoveryStrategy"
                    control={control}
                    minHeight={"200px"}
                    label="Recovery Strategies"
                    rules={{
                      required:
                        "Recovery Strategies is required",
                    }}
                  />

                </Grid>
              </Grid>
              {/* <Box
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
                    onClick={()=>setActiveStep(0)}
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
                  //   trainingUpdateData.loading ||
                  //   (trainingPlanData && trainingPlanData.length !== days) ||
                  //   (nutritionPlanData && nutritionPlanData.length !== days) ||
                  //   trainingCampEditData?.loading
                  // }
                  onClick={handleSubmit(onSubmit)}
                  sx={{ fontSize: "16px", weight: 500 }}
                >
                  {trainingUpdateData.loading ||
                  trainingCampEditData?.loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : edit ? (
                    "Update"
                  ) : (
                    "Update & Continue"
                  )}
                </Button>
              </Box> */}
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
                      closeAdd

                    }
                    // onClick={() => {
                    //   if (edit) {
                    //     onClose();
                    //   } else {
                    //     closeAdd();
                    //   }
                    // }}
                    sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
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
                  //   reportUpdateResponse.loading ||
                  //   trainingUpdateData.loading ||
                  //   trainingCampEditData?.loading
                  // }
                  onClick={handleSubmit(onSubmit)}
                  sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
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
                  sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
                >
                  {reportUpdateResponse.loading
                    ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : 'Update & Continue'}
                </Button>
              </Box>
              {(trainingPlanData && trainingPlanData.length !== days)
                ? (
                  <Box textAlign={"end"}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#d32f2f" }}
                      className="dubai-med"
                      mt={1}
                    >
                      Please fill the Nutrition and Training plan for all days.
                    </Typography>
                  </Box>
                ) : null}
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default TrainingNutritionPlan;

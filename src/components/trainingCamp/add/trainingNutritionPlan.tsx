"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  SnackbarCloseReason,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import _ from "lodash";
import { getLocalStorage } from "@/utils/helper";
import { useForm } from "react-hook-form";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { usePathname } from "next/navigation";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TrainingDayAddMore from "./addMore/trainingDayAddMore";
import NutritionDayAddMore from "./addMore/nutritionAddMore";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import { addTrainingCampTrainingPlan } from "@/redux/slices/trainingCamp/trainingCampTrainingPlan";
import { addTrainingCampNutritionPlan } from "@/redux/slices/trainingCamp/trainingCampNutritionPlan";
import moment from "moment";

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
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [days, setDays] = useState<any>("");
  const [trainingPlanData, setTrainingPlanData] = useState<any>([]);
  const [trainingPlanSelectedData, setTrainingPlanSelectedData] = useState<any>(
    {}
  );
  const [nutritionPlanData, setNutritionPlanData] = useState<any>([]);
  const [nutritionPlanSelectedData, setNutritionPlanSelectedData] =
    useState<any>({});
  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const [applyDaysForTraining, setApplyDaysForTraining] = useState<any>(false);
  const [applyDaysForNutrition, setApplyDaysForNutrition] =
    useState<any>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );

  const { handleSubmit, control, setValue, getValues, reset } = useForm<any>({
    defaultValues: {
      trainingCampTrainingPlan: [
        {
          dayTrainingPlan: null,
          morningTrainingPlan: null,
          afternoonTrainingPlan: null,
        },
      ],
      technicalPreparation: null,
      performanceMonitoring: null,
      recoveryStrategies: null,
      trainingCampNutritionPlan: [
        {
          dayNutritionPlan: null,
          morningNutritionPlan: null,
          afternoonNutritionPlan: null,
          dinnerNutritionPlan: null,
        },
      ],
    },
  });

  const tableTrainingHeaders = [
    "Day",
    "Morning Training Plan",
    "Afternoon Training Plan",
    "Actions",
  ];
  const tableNutritionHeaders = [
    "Day",
    "Morning Nutrition Plan",
    "Afternoon Nutrition Plan",
    "Dinner Nutrition  Plan",
    "Actions",
  ];
  const savedData: any = getLocalStorage("addTrainingCampData");
  const parsedData = JSON.parse(savedData);
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];

  const onSubmit = (data: any) => {
    if (trainingCampID) {
      const payload: any = {
        sportID: Number(teamID),
        
        trainingCampID: Number(trainingCampID && trainingCampID),
        section: "trainingPlan",
        technicalPreparation: data?.technicalPreparation,
        performanceMonitoring: data?.performanceMonitoring,
        recoveryStrategies: data?.recoveryStrategies,
      };
      dispatch(
        updateTrainingCamp({ url: "/UpdateTrainingCampByID", payload: payload })
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

  const handleDeleteTraining = (item: any) => {
    setTrainingPlanData(
      trainingPlanData &&
        trainingPlanData.filter(
          (plan: any) => plan.dayTrainingPlan !== item?.dayTrainingPlan
        )
    );
    setTrainingPlanSelectedData(
      trainingPlanData &&
        trainingPlanData.filter(
          (plan: any) => plan.dayTrainingPlan === item?.dayTrainingPlan
        )
    );
  };

  const handleDeleteNutrition = (item: any) => {
    setNutritionPlanData(
      nutritionPlanData &&
        nutritionPlanData.filter(
          (plan: any) => plan.dayNutritionPlan !== item?.dayNutritionPlan
        )
    );
    setNutritionPlanSelectedData(
      nutritionPlanData &&
        nutritionPlanData.filter(
          (plan: any) => plan.dayNutritionPlan === item?.dayNutritionPlan
        )
    );
  };

  useEffect(() => {
    if (resetForm) {
      setTrainingPlanData([]);
      setNutritionPlanData([]);
      reset({
        trainingCampTrainingPlan: [
          {
            dayTrainingPlan: "",
            morningTrainingPlan: "",
            afternoonTrainingPlan: "",
          },
        ],
        technicalPreparation: null,
        performanceMonitoring: null,
        recoveryStrategies: null,
        trainingCampNutritionPlan: [
          {
            dayNutritionPlan: "",
            morningNutritionPlan: "",
            afternoonNutritionPlan: "",
            dinnerNutritionPlan: "",
          },
        ],
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
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (trainingCampEditData && trainingCampEditData.code === 200) {
      const date1: any = moment(
        trainingCampEditData.data && trainingCampEditData.data[0].campEndDate,
        "DD/MM/YYYY"
      );
      const date2: any = moment(
        trainingCampEditData.data && trainingCampEditData.data[0].campStartDate,
        "DD/MM/YYYY"
      );
      const diffInMs = date1 - date2;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24) + 1;
      setDays(diffInDays);
      setTrainingCampID(
        trainingCampEditData.data && trainingCampEditData.data[0].trainingCampID
      );
    } else if (parsedData.StrategyDetails) {
      const date1: any = new Date(parsedData.StrategyDetails.campEndDate);
      const date2: any = new Date(parsedData.StrategyDetails.campStartDate);
      const diffInMs = date1 - date2;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24) + 1;
      setDays(diffInDays);
      setTrainingCampID(parsedData.trainingCampID);
    }
  }, [trainingCampEditData, parsedData]);

  useEffect(() => {
    if (trainingUpdateData && trainingUpdateData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      if (id) {
        setIsUpdated(true);
      }
      setTimeout(() => {
        setActiveStep(2);
        if (id) {
          setIsUpdated(false);
        }
      }, 1000);
      dispatch(clearUpdateState());
      const payload: any = {
        trainingCampID:
          trainingUpdateData.data.trainingCampID || trainingCampID,
        sportID: Number(teamID),
        
        trainingCampTrainingPlan: trainingPlanData && trainingPlanData,
      };
      dispatch(
        addTrainingCampTrainingPlan({
          url:
            trainingCampID && trainingCampID
              ? "/UpdateTrainingCampTrainingPlanByID"
              : "/InsertTrainingCampTrainingPlan",
          payload: payload,
        })
      );
      const data: any = {
        trainingCampID:
          trainingUpdateData.data.trainingCampID || trainingCampID,
        sportID: Number(teamID),
        
        trainingCampNutritionPlan: nutritionPlanData && nutritionPlanData,
      };
      dispatch(
        addTrainingCampNutritionPlan({
          url:
            trainingCampID && trainingCampID
              ? "/UpdateTrainingCampNutritionPlanByID"
              : "/InsertTrainingCampNutritionPlan",
          payload: data,
        })
      );
      const value = getValues();
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        TrainingNutritionPlan: {
          ...value,
          trainingCampNutritionPlan: nutritionPlanData,
          trainingCampTrainingPlan: trainingPlanData,
        },
      }));
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
      setValue(
        "technicalPreparation",
        trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].technicalPreparation
      );
      setValue(
        "performanceMonitoring",
        trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].performanceMonitoring
      );
      setValue(
        "recoveryStrategies",
        trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].recoveryStrategies
      );
      setNutritionPlanData(
        trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].nutritionPlanList
      );
      setTrainingPlanData(
        trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].trainingPlanList
      );
    } else if (parsedData.TrainingNutritionPlan) {
      const formData: any = parsedData.TrainingNutritionPlan;
      setValue("technicalPreparation", formData.technicalPreparation);
      setValue("performanceMonitoring", formData.performanceMonitoring);
      setValue("recoveryStrategies", formData.recoveryStrategies);
      setNutritionPlanData(formData.trainingCampNutritionPlan);
      setTrainingPlanData(formData.trainingCampTrainingPlan);
    }
  }, [trainingCampEditData]);

  useEffect(() => {
    if (days > 0 && applyDaysForTraining) {
      setTrainingPlanSelectedData([]);
      const trainingCampTrainingPlan = Array.from(
        { length: days },
        (_, index) => ({
          dayTrainingPlan: `Day ${index + 1}`,
          morningTrainingPlan: trainingPlanData[0].morningTrainingPlan,
          afternoonTrainingPlan: trainingPlanData[0].afternoonTrainingPlan,
        })
      );
      setTrainingPlanData(
        (trainingCampTrainingPlan || []).map((comp: any) => ({
          dayTrainingPlan: comp.dayTrainingPlan,
          morningTrainingPlan: comp.morningTrainingPlan,
          afternoonTrainingPlan: comp.afternoonTrainingPlan,
        }))
      );
    }
    if (days > 0 && applyDaysForNutrition) {
      setNutritionPlanSelectedData([]);
      const trainingCampNutritionPlan = Array.from(
        { length: days },
        (_, index) => ({
          dayNutritionPlan: `Day ${index + 1}`,
          morningNutritionPlan: nutritionPlanData[0].morningNutritionPlan,
          afternoonNutritionPlan: nutritionPlanData[0].afternoonNutritionPlan,
          dinnerNutritionPlan: nutritionPlanData[0].dinnerNutritionPlan,
        })
      );
      setNutritionPlanData(
        (trainingCampNutritionPlan || []).map((comp: any) => ({
          dayNutritionPlan: comp.dayNutritionPlan,
          morningNutritionPlan: comp.morningNutritionPlan,
          afternoonNutritionPlan: comp.afternoonNutritionPlan,
          dinnerNutritionPlan: comp.dinnerNutritionPlan,
        }))
      );
    }
  }, [days, applyDaysForTraining, applyDaysForNutrition]);

  const closeAdd = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={0}>
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? `Training Camp ${
                    currentNav?.split("/")[4] === "add" ? "Added" : "Updated"
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
                  <Typography className="typography textfield-label bukra">
                    Total Training Camp Duration: {days} days
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{ border: "1px solid #E0E0E0", borderRadius: "8px" }}
                  >
                    <Box p={2} borderBottom={"1px solid #E0E0E0"}>
                      <Typography className="typography textfield-label bukra">
                        Events Plan
                      </Typography>
                    </Box>

                    <Box p={2}>
                      <TableContainer
                        sx={{
                          border: "1px solid rgba(88, 88, 91, 0.2)",
                          borderRadius: "4px",
                        }}
                      >
                        <Table stickyHeader aria-label="team table">
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
                                    a.dayTrainingPlan?.replace("Day ", ""),
                                    10
                                  );
                                  const dayB = parseInt(
                                    b.dayTrainingPlan?.replace("Day ", ""),
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
                                        {item?.dayTrainingPlan}
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
                                        {item?.morningTrainingPlan}
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
                                        {item?.afternoonTrainingPlan}
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
                        {trainingPlanData &&
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
                        )}
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="technicalPreparation"
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
                          <FormWithSunEditor
                            name="recoveryStrategies"
                            control={control}
                            minHeight={"200px"}
                            label="Recovery Strategies"
                            rules={{
                              required: "Recovery Strategies is required",
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  <Box
                    sx={{ border: "1px solid #E0E0E0", borderRadius: "8px" }}
                    mt={1}
                  >
                    <Box p={2} borderBottom={"1px solid #E0E0E0"}>
                      <Typography className="typography textfield-label bukra">
                        Meal Schedule
                      </Typography>
                    </Box>
                    <Box p={2}>
                      <TableContainer
                        sx={{
                          border: "1px solid rgba(88, 88, 91, 0.2)",
                          borderRadius: "4px",
                        }}
                      >
                        <Table stickyHeader aria-label="team table">
                          <TableHead>
                            <TableRow>
                              {tableNutritionHeaders.map((header: any) => (
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
                            {nutritionPlanData &&
                              nutritionPlanData.length > 0 &&
                              [...nutritionPlanData]
                                .sort((a: any, b: any) => {
                                  const dayA = parseInt(
                                    a.dayNutritionPlan?.replace("Day ", ""),
                                    10
                                  );
                                  const dayB = parseInt(
                                    b.dayNutritionPlan?.replace("Day ", ""),
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
                                        {item?.dayNutritionPlan}
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
                                        {item?.morningNutritionPlan}
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
                                        {item?.afternoonNutritionPlan}
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
                                        {item?.dinnerNutritionPlan}
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
                                            handleDeleteNutrition(item)
                                          }
                                          disabled={
                                            nutritionPlanSelectedData &&
                                            nutritionPlanSelectedData.length ===
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
                      </TableContainer>
                      <Grid container item xs={12} md={12} spacing={2} mt={1}>
                        {nutritionPlanData &&
                        nutritionPlanData.length >= days ? null : (
                          <>
                            <NutritionDayAddMore
                              setApplyDaysForNutrition={
                                setApplyDaysForNutrition
                              }
                              applyDaysForNutrition={applyDaysForNutrition}
                              getTrainingCampNutritionPlanData={
                                nutritionPlanData
                              }
                              nutritionPlanData={nutritionPlanData}
                              setNutritionPlanData={setNutritionPlanData}
                              nutritionPlanSelectedData={
                                nutritionPlanSelectedData
                              }
                              setNutritionPlanSelectedData={
                                setNutritionPlanSelectedData
                              }
                              resetForm={resetForm}
                              setResetForm={setResetForm}
                            />
                          </>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
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
                    (trainingPlanData && trainingPlanData.length !== days) ||
                    (nutritionPlanData && nutritionPlanData.length !== days) ||
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
                    "Save & Continue"
                  )}
                </Button>
              </Box>
              {(trainingPlanData && trainingPlanData.length !== days) ||
              (nutritionPlanData && nutritionPlanData.length !== days) ? (
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

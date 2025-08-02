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
import _, { isEmpty } from "lodash";
import { getLocalStorage } from "@/utils/helper";
import { useForm } from "react-hook-form";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { usePathname } from "next/navigation";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TrainingDayAddMore from "@/components/reports/trainingDayAddMore";
import NutritionDayAddMore from "@/components/trainingCamp/add/addMore/nutritionAddMore";
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
import CustomTextField from "@/components/Fields/CustomTextField";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { clearReportAddDataState } from "@/redux/slices/reports/reportAddSlice";


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
    reportID
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [days, setDays] = useState<any>("");
  const [trainingPlanData, setTrainingPlanData] = useState<any>([]);
  console.log({trainingPlanData});
  
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
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
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
    // if (trainingCampID) {
      const payload: any = {
        ...data,
        nutritionPlan : trainingPlanData
      };
    //   dispatch(
    //     updateTrainingCamp({ url: "/UpdateTrainingCampByID", payload: payload })
    //   );
    // } else {
    //   setSnackbarOpen(true);
    //   setSnackbarStatus("error");
    // }
    console.log({data});
    

       if(true){
      //  if(!isEmpty(reportUpdateResponse?.data)){
         const getRaceID = !isEmpty(reportUpdateResponse?.data) && reportUpdateResponse?.data.reportId 
         dispatch(updateReport({ url: `/Reports/${teamID}/TrainingCamp/${reportID}/40/TrainingNutritionPlan`, payload :payload }));
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
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);




  // useEffect(() => {
  //   if (trainingCampEditData && trainingCampEditData.code === 200) {
  //     setValue(
  //       "tacticalPreparation",
  //       trainingCampEditData &&
  //         trainingCampEditData?.data[0] &&
  //         trainingCampEditData?.data[0].tacticalPreparation
  //     );
  //     setValue(
  //       "performanceMonitoring",
  //       trainingCampEditData &&
  //         trainingCampEditData?.data[0] &&
  //         trainingCampEditData?.data[0].performanceMonitoring
  //     );
  //     setValue(
  //       "recoveryStrategy",
  //       trainingCampEditData &&
  //         trainingCampEditData?.data[0] &&
  //         trainingCampEditData?.data[0].recoveryStrategy
  //     );
  //     setNutritionPlanData(
  //       trainingCampEditData &&
  //         trainingCampEditData?.data[0] &&
  //         trainingCampEditData?.data[0].nutritionPlanList
  //     );
  //     setTrainingPlanData(
  //       trainingCampEditData &&
  //         trainingCampEditData?.data[0] &&
  //         trainingCampEditData?.data[0].trainingPlanList
  //     );
  //   } else if (parsedData.TrainingNutritionPlan) {
  //     const formData: any = parsedData.TrainingNutritionPlan;
  //     setValue("tacticalPreparation", formData.tacticalPreparation);
  //     setValue("performanceMonitoring", formData.performanceMonitoring);
  //     setValue("recoveryStrategy", formData.recoveryStrategy);
  //     setNutritionPlanData(formData.trainingCampNutritionPlan);
  //     setTrainingPlanData(formData.trainingCampTrainingPlan);
  //   }
  // }, [trainingCampEditData]);
console.log({applyDaysForTraining,trainingPlanData,days});
const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

  // useEffect(() => {
  //   if (days > 0 && applyDaysForTraining) {
  //     setTrainingPlanSelectedData([]);
  //     const trainingCampTrainingPlan = Array.from(
  //       { length: days },
  //       (_, index) => ({
  //         dayNo: `Day ${index + 1}`,
  //         // dayNo: `Day ${index + 1}`,
  //         morning: trainingPlanData[0].morning,
  //         afternoon: trainingPlanData[0].afternoon,
  //       })
  //     );
  //     console.log({trainingCampTrainingPlan});      
  //     setTrainingPlanData(
  //       (trainingCampTrainingPlan || []).map((comp: any) => ({
  //         dayNo: comp.dayNo,
  //         morning: comp.morning,
  //         afternoon: comp.afternoon,
  //       }))
  //     );
  //   }
  //   if (days > 0 && applyDaysForNutrition) {
  //     setNutritionPlanSelectedData([]);
  //     const trainingCampNutritionPlan = Array.from(
  //       { length: days },
  //       (_, index) => ({
  //         dayNutritionPlan: `Day ${index + 1}`,
  //         morningNutritionPlan: nutritionPlanData[0].morningNutritionPlan,
  //         afternoonNutritionPlan: nutritionPlanData[0].afternoonNutritionPlan,
  //         dinnerNutritionPlan: nutritionPlanData[0].dinnerNutritionPlan,
  //       })
  //     );
  //     setNutritionPlanData(
  //       (trainingCampNutritionPlan || []).map((comp: any) => ({
  //         dayNutritionPlan: comp.dayNutritionPlan,
  //         morningNutritionPlan: comp.morningNutritionPlan,
  //         afternoonNutritionPlan: comp.afternoonNutritionPlan,
  //         dinnerNutritionPlan: comp.dinnerNutritionPlan,
  //       }))
  //     );
  // }
  // }, [days, applyDaysForTraining, applyDaysForNutrition]);

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
                  <Box
                    sx={{ border: "1px solid #E0E0E0", borderRadius: "8px" }}
                  >
                    <Box p={2} borderBottom={"1px solid #E0E0E0"}>
                      <Typography className="typography textfield-label bukra">
                      Training Plan
                      </Typography>
                    </Box>

                 {true &&   <Box p={2}>
                      <TableContainer
                        sx={{
                          border: "1px solid rgba(88, 88, 91, 0.2)",
                          borderRadius: "4px",
                        }}
                      >
                        {trainingPlanData.length !== 0 &&   <Table stickyHeader aria-label="team table">
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
                                    a.dayNo?.replace("Day ", ""),
                                    10
                                  );
                                  const dayB = parseInt(
                                    b.dayNo?.replace("Day ", ""),
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
                                        {item?.dayNo}
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
                        { (
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
                    <CustomTextField
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
        />
        
                    </Grid>
                <Grid item xs={12} md={5.75}>
                    <CustomTextField
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
        />
        
                    </Grid>
                <Grid item xs={12} md={5.75}>
                    <CustomTextField
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
        />
        
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

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
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import moment from "moment";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { usePathname } from "next/navigation";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../../public/travelUpload.svg";
// import Uploadtravel from "../../../../public/travelUpload.svg";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
// import TrainingCampCustomDatePicker from "../trainingCampCustomDatePicker";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import { clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { clearReportAddState } from "@/redux/slices/reports/reportAddSlice";

const TravelCost = (props: any) => {
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
    module
  } = props;
  const fileTypes = ["JPG", "PNG", "pdf", "doc"];
  const dispatch: AppDispatch = useDispatch();
  const [days, setDays] = useState<any>("");
  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [formData, setFormData] = useState<any>({
    file: "",
    modulename: "Staff",
    moduleid: "1",
    section: "",
    loggedUserID: 1,
    description: "",
  });
  const [errors, setErrors] = useState<any>({});
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  console.log({ reportUpdateResponse });
  const raceID = useSelector((state: RootState) => !state?.updateReport?.error ? state?.updateReport?.data?.raceId : null);
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        departureDate: null,
        departureTime: null,
        returnDate: null,
        returnTime: null,
        city: null,
        hotelName: null,
        location: null,
        notes: null,
        totalCost: null,
        ticketsCost: null,
        accommodationCost: null,
        transportationCost: null,
        registrationFee: null,
        shippingFee: null,
        otherExpenses: null,
        costNotes: null,
        budgetDetails: null,
        duration: 'Auto Calculated',
        staffCount: 0,
        athleteCount: 0,
        otherCount: 0,
      },
    });
  const ticketsCost = watch("ticketsCost");
  const accommodationCost = watch("accommodationCost");
  const transportationCost = watch("transportationCost");
  const registrationFee = watch("registrationFee");
  const shippingFee = watch("shippingFee");
  const otherExpenses = watch("otherExpenses");
  const budgetDetails = watch("budgetDetails");
  const savedData: any = getLocalStorage("addTrainingCampData");
  const parsedData = JSON.parse(savedData);
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );
  const singleUploadData = useSelector((state: any) => state.singleUpload);

  const onSubmit = (data: any) => {
    console.log({ data });
    const getRaceID = reportUpdateResponse.data.raceId
    // const getCampID = !isEmpty(reportUpdateResponse?.data) ? reportUpdateResponse?.data.reportId : !isEmpty(reportAddResponse?.data) && reportAddResponse?.data.reportId
    if (formData && !formData.file) {
      const newErrors: any = {};
      newErrors.file = "Budget Details is required";
      setErrors(newErrors);
    } else {
      const payload: any = {
        departureDate: dayjs(data?.departureDate).isValid() ? dayjs(data?.departureDate).format("YYYY-MM-DD") : dayjs(data?.departureDate),
        departureTime: dayjs(data.departureTime).format("HH:mm:ss"),
        // departureTime: dayjs(data?.departureTime).format("hh:mm A"),
        returnDate: dayjs(data?.returnDate).isValid() ? dayjs(data?.returnDate).format("YYYY-MM-DD") : dayjs(data?.returnDate),
        // returnDate: dayjs(data?.returnDate).format("YYYY-MM-DD"),
        returnTime: dayjs(data.returnTime).format("HH:mm:ss"),
        city: data?.city,
        hotelName: data?.hotelName,
        location: data?.location,
        notes: data?.notes,
        totalCost: Number(data?.totalCost),
        ticketsCost: Number(data?.ticketsCost),
        accommodationCost: Number(data?.accommodationCost),
        transportationCost: Number(data?.transportationCost),
        registrationFee: Number(data?.registrationFee),
        shippingFee: Number(data?.shippingFee),
        otherExpenses: Number(data?.otherExpenses),
        costNotes: data?.costNotes,
      };
      dispatch(updateReport({ url: `/Sports/${teamID}/Race/${getRaceID}/Travel`, payload: payload }));
      // dispatch(updateReport({ url: `/Sports/${teamID}/Race/${getRaceID}/AthleteStaff`, payload: payload }));

    }
  };

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleChange = (file: any) => {
    if (file) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
          setErrors({ ...errors, file: "" });
          setValue("budgetDetails", "");
        } else {
          setSnackbarOpen(true);
          setSnackbarStatus(
            `File size must below ${fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
      }
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
        departureDate: null,
        departureTime: null,
        returnDate: null,
        returnTime: null,
        city: "",
        hotelName: "",
        location: "",
        notes: null,
        totalCost: "",
        ticketsCost: "",
        accommodationCost: "",
        transportationCost: "",
        registrationFee: "",
        shippingFee: "",
        otherExpenses: "",
        costNotes: null,
        budgetDetails: "",
      });
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
      setFormData({});
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

  useEffect(() => {
    const costs = [
      ticketsCost,
      accommodationCost,
      transportationCost,
      registrationFee,
      shippingFee,
      otherExpenses,
    ];
    if (costs.some((cost) => !isEmpty(cost))) {
      const totalCost = costs.reduce(
        (sum, cost) => sum + (Number(cost) || 0),
        0
      );
      setValue("totalCost", String(totalCost));
    }
  }, [
    ticketsCost,
    accommodationCost,
    transportationCost,
    registrationFee,
    shippingFee,
    otherExpenses,
  ]);



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

  // useEffect(() => {
  //   if (trainingUpdateData && trainingUpdateData.code === 200) {
  //     setSnackbarOpen(true);
  //     setSnackbarStatus("success");
  //     if (id) {
  //       setIsUpdated(true);
  //     }
  //     setTimeout(() => {
  //       setActiveStep(3);
  //       if (id) {
  //         setIsUpdated(false);
  //       }
  //     }, 1000);
  //     const data = new FormData();
  //     data.append("file", formData.file);
  //     data.append("modulename", "TrainingCamp");
  //     data.append("moduleid", trainingCampID && trainingCampID);
  //     data.append("section", "Budget");
  //     data.append("loggedUserID", "1");
  //     dispatch(singleFileUpload(data));
  //     dispatch(clearUpdateState());
  //     const value = getValues();
  //     setAllData((prevFormData: any) => ({
  //       ...prevFormData,
  //       TravelCost: value,
  //       budgetDetails: formData && formData,
  //     }));
  //   } else if (trainingUpdateData && trainingUpdateData.code === 500) {
  //     setSnackbarOpen(true);
  //     setSnackbarStatus("error");
  //     dispatch(clearUpdateState());
  //   } else if (trainingUpdateData && trainingUpdateData.code === 409) {
  //     setSnackbarOpen(true);
  //     setSnackbarStatus("error");
  //     dispatch(clearUpdateState());
  //   }
  // }, [trainingUpdateData]);

  useEffect(() => {
    if (reportUpdateResponse && !isEmpty(reportUpdateResponse.data.travel)) {
      const travelResponseData = reportUpdateResponse.data.travel
      console.log({ travelResponseData });

      setValue(
        "city",
        travelResponseData?.city.trim()
      );
      setValue(
        "departureDate",
        travelResponseData?.departureDate === "-"
          ? null
          : moment(travelResponseData?.departureDate)
      );
      setValue(
        "departureTime",
        moment(
          travelResponseData?.departureTime,
          "hh:mm A"
        )
      );
      setValue(
        "returnDate",
        travelResponseData.returnDate === "-"
          ? null
          : moment(travelResponseData?.returnDate)
      );
      setValue(
        "returnTime",
        moment(
          travelResponseData.returnTime,
          "hh:mm A"
        )
      );
      setValue(
        "hotelName",
        travelResponseData?.hotelName.trim()
      );
      setValue(
        "location",
        travelResponseData?.location.trim()
      );
      setValue(
        "notes",
        travelResponseData?.notes
      );
      setValue(
        "totalCost",
        travelResponseData.totalCost === "0"
          ? ""
          : travelResponseData?.totalCost
      );
      setValue(
        "ticketsCost",
        travelResponseData?.ticketsCost === "0"
          ? ""
          : travelResponseData?.ticketsCost
      );
      setValue(
        "accommodationCost",
        travelResponseData.accommodationCost === "0"
          ? ""
          : travelResponseData.accommodationCost
      );
      setValue(
        "transportationCost",
        travelResponseData.transportationCost === "0"
          ? ""
          : travelResponseData.transportationCost
      );
      setValue(
        "registrationFee",
        travelResponseData.registrationFee === "0"
          ? ""
          : travelResponseData.registrationFee
      );
      setValue(
        "shippingFee",
        travelResponseData.shippingFee === "0"
          ? ""
          : travelResponseData.shippingFee
      );
      setValue(
        "otherExpenses",
        travelResponseData.otherExpenses === "0"
          ? ""
          : travelResponseData.otherExpenses
      );
      setValue(
        "costNotes",
        travelResponseData?.costNotes
      );
      setValue(
        "budgetDetails",
        travelResponseData?.budgetFilePath
      );
      setValue(
        "staffCount",
        travelResponseData?.staffCount
      );
      setValue(
        "athleteCount",
        travelResponseData?.athleteCount
      );
      setValue(
        "otherCount",
        travelResponseData?.otherCount
      );
      setFormData({
        ...formData,
        file:
          travelResponseData?.budgetFilePath,
      });
    }
    else if (parsedData.TravelCost) {
      const formData: any = parsedData.TravelCost;
      setValue("city", formData.city);
      setValue("departureDate", moment(formData.departureDate));
      setValue("departureTime", moment(formData.departureTime));
      setValue("returnDate", moment(formData.returnDate));
      setValue("returnTime", moment(formData.returnTime));
      setValue("hotelName", formData.hotelName);
      setValue("location", formData.location);
      setValue("notes", formData.notes);
      setValue("totalCost", formData.totalCost);
      setValue("ticketsCost", formData.ticketsCost);
      setValue("accommodationCost", formData.accommodationCost);
      setValue("transportationCost", formData.transportationCost);
      setValue("registrationFee", formData.registrationFee);
      setValue("shippingFee", formData.shippingFee);
      setValue("otherExpenses", formData.otherExpenses);
      setValue("costNotes", formData.costNotes);
      setValue(
        "budgetDetails",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].budgetFilePath
      );
      setFormData(parsedData && parsedData?.budgetDetails);
    }
  }, [reportUpdateResponse]);

  useEffect(() => {
    if (singleUploadData?.code === 200) {
      dispatch(clearState());
    }
  }, [singleUploadData]);

  const closeAdd = () => {
    setActiveStep((prev: number) => prev - 1);
  };

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={0}>
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? `Travel Cost Updated Successfully!`
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
                        Travel Details
                      </Typography>
                    </Box>
                    <Box p={2}>
                      <Grid
                        container
                        item
                        xs={12}
                        md={12}
                        spacing={2}
                        mt={1}
                        justifyContent={"space-between"}
                      >
                        <Grid container item xs={12} md={5.75} spacing={2}>
                          <Grid item xs={6}>
                            <TrainingCampCustomDatePicker
                              control={control}
                              name="departureDate"
                              label="Departure Date"
                              boxmb={0.8}
                              required={true}
                              minDate={moment()}
                              maxDate={moment().add(10, "years")}
                              className="Text-field-customise"
                              rules={{
                                required: "Departure Date is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <CustomTimePicker
                              control={control}
                              name="departureTime"
                              label="Departure Time"
                              boxmb={0.7}
                              required={true}
                              rules={{
                                required: "Departure Time is required",
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid container item xs={12} md={5.75} spacing={2}>
                          <Grid item xs={6}>
                            <TrainingCampCustomDatePicker
                              control={control}
                              name="returnDate"
                              label="Return Date"
                              boxmb={0.8}
                              required={true}
                              minDate={moment()}
                              maxDate={moment().add(10, "years")}
                              className="Text-field-customise"
                              rules={{
                                required: "Return Date is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <CustomTimePicker
                              control={control}
                              name="returnTime"
                              label="Return Time"
                              boxmb={0.7}
                              required={true}
                              rules={{
                                required: "Return Time is required",
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="duration"
                            label="Duration (in days)"
                            placeholder="Auto Calculated"
                            control={control}
                            // required={true}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 100,
                                message:
                                  "City Name cannot exceed 100 characters",
                              },
                              // required: "City is required",
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>

                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="city"
                            label="City"
                            placeholder="Enter New City"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 100,
                                message:
                                  "City Name cannot exceed 100 characters",
                              },
                              required: "City is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="hotelName"
                            label="Hotel Name"
                            placeholder="Enter New Hotel Name"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z0-9() /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 100,
                                message:
                                  "Hotel Name cannot exceed 100 characters",
                              },
                              required: "Hotel Name is required",
                            }}
                          />
                        </Grid>
                        {/* <Grid item xs={12} md={5.75}>
                        
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                        
                        </Grid> */}
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="location"
                            label="Location"
                            placeholder="Enter New Location"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z0-9() /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 100,
                                message:
                                  "Location Name cannot exceed 100 characters",
                              },
                              required: "Location is required",
                            }}
                          />
                        </Grid>
                        <Grid container item xs={12} md={5.75} spacing={0.5} alignItems="center">
                          <Grid item xs={12}>
                            <Typography
                              variant="titleStyle"
                              sx={{ fontSize: "14px" }}
                              className="typography textfield-label bukra"
                              mt={1.5}
                              mb={0.5}
                              display="inline"
                            >
                              No. of Mission Delegation
                            </Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <CustomTextField
                              name="staffCount"
                              placeholder="Team's Staff"
                              control={control}
                              required={true}
                              rules={{
                                pattern: {
                                  value: /^[a-zA-Z0-9() /]*$/,
                                  message: "Invalid Format",
                                },
                                maxLength: {
                                  value: 100,
                                  message: "Input cannot exceed 100 characters",
                                },
                                required: "This field is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={3.5}>
                            <CustomTextField
                              name="athleteCount"
                              placeholder="Athletes"
                              control={control}
                              rules={{
                                pattern: {
                                  value: /^[a-zA-Z0-9() /]*$/,
                                  message: "Invalid Format",
                                },
                                maxLength: {
                                  value: 100,
                                  message: "Input cannot exceed 100 characters",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={3.5}>
                            <CustomTextField
                              name="otherCount"
                              placeholder="Others"
                              control={control}
                              required={true}
                              rules={{
                                pattern: {
                                  value: /^[a-zA-Z0-9() /]*$/,
                                  message: "Invalid Format",
                                },
                                maxLength: {
                                  value: 100,
                                  message: "Input cannot exceed 100 characters",
                                },
                                required: "This field is required",
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          {/* <FormWithSunEditor
                            name="notes"
                            control={control}
                            minHeight={"200px"}
                            label="Notes"
                          /> */}
                          <CustomTextField
                            name="notes"
                            control={control}
                            label="Notes"
                            textarea={true}
                            placeholder={"Enter Notes"}
                            rules={{
                              // required: "Notes is required",
                              pattern: {
                                value: /^[a-zA-Z0-9\s.-]+$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 300,
                                message: "Notes cannot exceed 300 characters",
                              },
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
                        Estimated Costs
                      </Typography>
                    </Box>
                    <Box p={2}>
                      <Grid
                        container
                        item
                        xs={12}
                        md={12}
                        spacing={2}
                        mt={1}
                        justifyContent={"space-between"}
                      >
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="totalCost"
                            label="Total Cost (AED)"
                            placeholder="0"
                            control={control}
                            // required={true}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75} />
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="ticketsCost"
                            label="Tickets Cost"
                            placeholder="Enter Tickets Cost"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[0-9 /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Tickets Cost cannot exceed 9 characters",
                              },
                              required: "Tickets Cost is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="accommodationCost"
                            label="Accommodation Cost"
                            placeholder="Enter Accommodation Cost"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[0-9 /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Accommodation Cost cannot exceed 9 characters",
                              },
                              required: "Accommodation Cost is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="transportationCost"
                            label="Transportation Cost"
                            placeholder="Enter Transportation Cost"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[0-9 /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Transportation Cost cannot exceed 9 characters",
                              },
                              required: "Transportation Cost is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="registrationFee"
                            label="Registration Fees"
                            placeholder="Enter Registration Fees"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[0-9 /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Registration Fees cannot exceed 9 characters",
                              },
                              required: "Registration Fees is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="shippingFee"
                            label="Shipping Fees"
                            placeholder="Enter Shipping Fees"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[0-9 /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Shipping Fees cannot exceed 9 characters",
                              },
                              required: "Shipping Fees is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="otherExpenses"
                            label="Other Expenses"
                            placeholder="Enter Other Expenses"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[0-9 /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Other Expenses cannot exceed 9 characters",
                              },
                              required: "Other Expenses is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontSize: "14px" }}
                            className="typography textfield-label bukra"
                            mt={1.5}
                            mb={0.5}
                          >
                            Budget Details
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          </Typography>
                          <Box
                            border={"1px solid #008755"}
                            bgcolor={"rgba(0, 135, 85, 0.03)"}
                            className="upload-travel"
                            position={"relative"}
                          >
                            <FileUploader
                              handleChange={handleChange}
                              name="file"
                              types={fileTypes}
                              className="upload-outline"
                              label={"Drag & drop files or Browse"}
                              uploadedLabel={
                                formData && formData.file === ""
                                  ? "Please try again"
                                  : formData?.file?.name
                              }
                              disabled={singleUploadData.loading}
                            />
                            <Uploadtravel
                              style={{
                                position: "absolute",
                                top: "20%",
                                bottom: 0,
                                left: "45%",
                                right: 0,
                                cursor: "pointer",
                                height: "50px",
                                width: "50px",
                              }}
                              onClick={handleFileUpload}
                            />
                            <Box
                              textAlign={"center"}
                              position={"absolute"}
                              bottom={"30%"}
                              // left={"30%"}
                              className="dubai-light-med secondary-color"
                              fontWeight={600}
                              fontSize={"14px"}
                              width={"100%"}
                            >
                              {budgetDetails && budgetDetails ? (
                                <Typography
                                  className="dubai-med primary-color"
                                  sx={{ fontSize: "16px", fontWeight: "600" }}
                                >
                                  {budgetDetails.split("/").pop()}
                                </Typography>
                              ) : (
                                "Supported formats: JPEG, PNG, PDF, Word"
                              )}
                            </Box>
                          </Box>
                          {errors.file && (
                            <Typography
                              variant="caption"
                              sx={{ color: "#d32f2f" }}
                              className="dubai-med"
                              mb={2}
                            >
                              {errors.file}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          {/* <FormWithSunEditor
                            name="costNotes"
                            control={control}
                            minHeight={"200px"}
                            label="Notes"
                          /> */}
                          <CustomTextField
                            name="costNotes"
                            control={control}
                            label="Notes"
                            textarea={true}
                            placeholder={"Enter Notes"}
                            rules={{
                              // required: "Notes is required",
                              pattern: {
                                value: /^[a-zA-Z0-9\s.-]+$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 300,
                                message: "Notes cannot exceed 300 characters",
                              },
                            }}
                          />
                        </Grid>
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
                  className="text-capitalize dubai-med"
                  disabled={
                    trainingUpdateData.loading || trainingCampEditData?.loading
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
              </Box> */}
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default TravelCost;

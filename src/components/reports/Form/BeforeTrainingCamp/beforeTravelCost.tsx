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
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";

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

    description: "",
  });
  const [errors, setErrors] = useState<any>({});

  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        departureDate: null,
        departureTime: null,
        returnDate: null,
        returnTime: null,
        travelCity: null,
        hotelName: null,
        travelLocation: null,
        travelNotes: null,
        totalCost: null,
        ticketsCost: null,
        accommodationCost: null,
        transportationCost: null,
        registrationFees: null,
        shippingFees: null,
        otherExpenses: null,
        costNotes: null,
        budgetDetails: null,
      },
    });
  const ticketsCost = watch("ticketsCost");
  const accommodationCost = watch("accommodationCost");
  const transportationCost = watch("transportationCost");
  const registrationFees = watch("registrationFees");
  const shippingFees = watch("shippingFees");
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
    if (formData && !formData.file) {
      const newErrors: any = {};
      newErrors.file = "Budget Details is required";
      setErrors(newErrors);
    } else {
      const payload: any = {
        sportID: Number(teamID),

        section: "travelAndCosts",
        trainingCampID: Number(trainingCampID && trainingCampID),
        departureDate: dayjs(data?.departureDate).format("DD/MM/YYYY"),
        departureTime: dayjs(data?.departureTime).format("hh:mm A"),
        returnDate: dayjs(data?.returnDate).format("DD/MM/YYYY"),
        returnTime: dayjs(data?.returnTime).format("hh:mm A"),
        travelCity: data?.travelCity,
        hotelName: data?.hotelName,
        travelLocation: data?.travelLocation,
        travelNotes: data?.travelNotes,
        totalCost: Number(data?.totalCost),
        ticketsCost: Number(data?.ticketsCost),
        accommodationCost: Number(data?.accommodationCost),
        transportationCost: Number(data?.transportationCost),
        registrationFees: Number(data?.registrationFees),
        shippingFees: Number(data?.shippingFees),
        otherExpenses: Number(data?.otherExpenses),
        costNotes: data?.costNotes,
      };
      if (trainingCampID) {
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
        travelCity: "",
        hotelName: "",
        travelLocation: "",
        travelNotes: null,
        totalCost: "",
        ticketsCost: "",
        accommodationCost: "",
        transportationCost: "",
        registrationFees: "",
        shippingFees: "",
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
      registrationFees,
      shippingFees,
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
    registrationFees,
    shippingFees,
    otherExpenses,
  ]);

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
      setIsUpdated(true);
      setTimeout(() => {
        setActiveStep((prevStep: number) => prevStep + 1);
        setIsUpdated(false);
      }, 1000);
      const data = new FormData();
      data.append("file", formData.file);
      data.append("modulename", "TrainingCamp");
      data.append("moduleid", trainingCampID && trainingCampID);
      data.append("section", "Budget");
      dispatch(singleFileUpload(data));
      dispatch(clearUpdateState());
      const value = getValues();
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        TravelCost: value,
        budgetDetails: formData && formData,
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
        "travelCity",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].travelCity.trim()
      );
      setValue(
        "departureDate",
        trainingCampEditData?.data[0]?.departureDate === "-"
          ? null
          : moment(trainingCampEditData?.data[0]?.departureDate, "DD/MM/YYYY")
      );
      setValue(
        "departureTime",
        moment(
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].departureTime,
          "hh:mm A"
        )
      );
      setValue(
        "returnDate",
        trainingCampEditData?.data[0]?.returnDate === "-"
          ? null
          : moment(trainingCampEditData?.data[0]?.returnDate, "DD/MM/YYYY")
      );
      setValue(
        "returnTime",
        moment(
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].returnTime,
          "hh:mm A"
        )
      );
      setValue(
        "hotelName",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].hotelName.trim()
      );
      setValue(
        "travelLocation",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].travelLocation.trim()
      );
      setValue(
        "travelNotes",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].travelNotes
      );
      setValue(
        "totalCost",
        trainingCampEditData?.data[0]?.totalCost === "0"
          ? ""
          : trainingCampEditData?.data[0]?.totalCost
      );
      setValue(
        "ticketsCost",
        trainingCampEditData?.data[0]?.ticketsCost === "0"
          ? ""
          : trainingCampEditData?.data[0]?.ticketsCost
      );
      setValue(
        "accommodationCost",
        trainingCampEditData?.data[0]?.accommodationCost === "0"
          ? ""
          : trainingCampEditData?.data[0]?.accommodationCost
      );
      setValue(
        "transportationCost",
        trainingCampEditData?.data[0]?.transportationCost === "0"
          ? ""
          : trainingCampEditData?.data[0]?.transportationCost
      );
      setValue(
        "registrationFees",
        trainingCampEditData?.data[0]?.registrationFees === "0"
          ? ""
          : trainingCampEditData?.data[0]?.registrationFees
      );
      setValue(
        "shippingFees",
        trainingCampEditData?.data[0]?.shippingFees === "0"
          ? ""
          : trainingCampEditData?.data[0]?.shippingFees
      );
      setValue(
        "otherExpenses",
        trainingCampEditData?.data[0]?.otherExpenses === "0"
          ? ""
          : trainingCampEditData?.data[0]?.otherExpenses
      );
      setValue(
        "costNotes",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].costNotes
      );
      setValue(
        "budgetDetails",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].budgetFilePath
      );
      setFormData({
        ...formData,
        file:
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].budgetFilePath,
      });
    } else if (parsedData.TravelCost) {
      const formData: any = parsedData.TravelCost;
      setValue("travelCity", formData.travelCity);
      setValue("departureDate", moment(formData.departureDate));
      setValue("departureTime", moment(formData.departureTime));
      setValue("returnDate", moment(formData.returnDate));
      setValue("returnTime", moment(formData.returnTime));
      setValue("hotelName", formData.hotelName);
      setValue("travelLocation", formData.travelLocation);
      setValue("travelNotes", formData.travelNotes);
      setValue("totalCost", formData.totalCost);
      setValue("ticketsCost", formData.ticketsCost);
      setValue("accommodationCost", formData.accommodationCost);
      setValue("transportationCost", formData.transportationCost);
      setValue("registrationFees", formData.registrationFees);
      setValue("shippingFees", formData.shippingFees);
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
  }, [trainingCampEditData]);

  useEffect(() => {
    if (singleUploadData?.code === 200) {
      dispatch(clearState());
    }
  }, [singleUploadData]);

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
                            name="travelCity"
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
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="travelLocation"
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
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="travelNotes"
                            control={control}
                            minHeight={"200px"}
                            label="Notes"
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
                            name="registrationFees"
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
                            name="shippingFees"
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
                            <span
                              style={{ color: "#E4002B", marginLeft: "4px" }}
                            >
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
                              className="dubai-regular secondary-color"
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
                          <FormWithSunEditor
                            name="costNotes"
                            control={control}
                            minHeight={"200px"}
                            label="Notes"
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
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default TravelCost;

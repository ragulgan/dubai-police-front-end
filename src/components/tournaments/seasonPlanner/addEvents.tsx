"use client";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment, { Moment } from "moment";
import dayjs from "dayjs";

import CustomCheckboxGroup from "@/components/Fields/CustomCheckboxGroup";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
const AddEvents: React.FC<any> = ({ edit, onClose }) => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const rulesAddData = useSelector((state: RootState) => state.rulesAdd);
  const [assignedSportsOption, setAssignedSportsOption] = useState<any>("");
  const [minEndDate, setMinEndDate] = useState<Moment | null>(moment());

  const startDate = null;
  const endDate = null;

  const getSportList = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });
  const getDefaultOption = (AssignedSports: any) => {
    const defaultOptions = [];
    for (const item in AssignedSports) {
      defaultOptions.push({
        label: AssignedSports[item].sportName,
        value: AssignedSports[item].sportID,
        icon: AssignedSports[item].sportProfile,
      });
    }
    return defaultOptions;
  };
  useEffect(() => {
    const assignedSports: any = getDefaultOption(getSportList);
    setAssignedSportsOption(assignedSports);
  }, [getSportList]);

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

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      planName: "",
      classification: "National Sports Event",
      startDate: null,
      endDate: null,

      location: "",

      gender: "Female",

      employeeType: {
        Military: false,
        Civilians: false,
        "Academy Cadets": false,
        All: false,
      },
    },
  });
  const campStartDate = watch("startDate");

  useEffect(() => {
    if (campStartDate) {
      const minimumEndDate = moment(campStartDate).add(1, "day");
      setMinEndDate(minimumEndDate);
    } else {
      setMinEndDate(null);
    }
  }, [campStartDate]);

  const onSubmit = (data: any) => {
    const payload: any = {
      planName: data?.planName,
      classification: data?.classification,
      startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),
      endDate: dayjs(data?.endDate).format("DD-MM-YYYY"),
      location: data?.location,
      gender: data?.gender,
      employeeType: data?.employeeType,
    };

    console.log("payload==========>", payload);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Fade in={true} timeout={1000}>
        <Grid container spacing={0}>
          {snackbarStatus !== "" && (
            <CustomSnackbar
              message={
                snackbarStatus === "success"
                  ? `Season Planner Added successfully!`
                  : rulesAddData && rulesAddData?.message
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
              position: "relative",
              overflow: "hidden",
            }}
            px={edit ? 4 : 0}
          >
            <Box width="100%">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} justifyContent={"space-between"}>
                  <Grid item xs={12} md={12}>
                    <Grid
                      container
                      item
                      xs={12}
                      padding={"20px"}
                      md={12}
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomTextField
                          name="planName"
                          label="Activity Name"
                          placeholder="Enter Activity Name"
                          control={control}
                          required={true}
                          disabled={false}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Activity Name cannot exceed 100 characters",
                            },
                            required: "Activity Name is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomTextField
                          name="classification"
                          label="Activity Classification (MOI)"
                          placeholder="Awareness "
                          control={control}
                          required={true}
                          disabled={true}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Activity Name cannot exceed 100 characters",
                            },
                            required: "Activity is required",
                          }}
                        />
                      </Grid>

                      <Grid container item xs={12} md={5.75} spacing={2}>
                        <Grid item xs={6}>
                          <TrainingCampCustomDatePicker
                            control={control}
                            name="startDate"
                            label="Start Date"
                            boxmb={0.8}
                            required={true}
                            defaultValue={startDate}
                            minDate={moment()}
                            className="Text-field-customise"
                            rules={{
                              required: "Start Date is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TrainingCampCustomDatePicker
                            control={control}
                            name="endDate"
                            label="End Date"
                            boxmb={0.8}
                            required={true}
                            minDate={minEndDate}
                            defaultValue={endDate}
                            className="Text-field-customise"
                            rules={{ required: "End Date is required" }}
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomTextField
                          name="location"
                          label="Event Location"
                          placeholder="Enter Location"
                          control={control}
                          required={true}
                          disabled={false}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 100,
                              message: "Location cannot exceed 100 characters",
                            },
                            required: "Location is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} marginTop={2}>
                        <Typography
                          variant="titleStyle"
                          sx={{ fontSize: "14px" }}
                          className="typography textfield-label bukra"
                          gutterBottom
                        >
                          Target Audience
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12} marginBottom={2}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomRadioGroup
                          name="gender"
                          control={control}
                          label="Gender"
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                          ]}
                          required={true}
                        />
                      </Grid>

                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomCheckboxGroup
                          name="employeeType"
                          control={control}
                          label="Employee Type"
                          required={true}
                          options={[
                            { value: "Military", label: "Military" },
                            { value: "Civilians", label: "Civilians" },
                            {
                              value: "Academy Cadets",
                              label: "Academy Cadets",
                            },
                            { value: "All", label: "All" },
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginY: "1.5rem",
                  }}
                >
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mr: 1 }}
                      onClick={handleCancel}
                      className="cancel-button text-capitalize dubai-med"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mr: 1 }}
                      className="text-capitalize dubai-med cancel-button"
                      disabled={rulesAddData.loading}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {rulesAddData.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Save & Add New"
                      )}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med cancel-button"
                      disabled={rulesAddData.loading}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {rulesAddData.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </>
  );
};
export default AddEvents;

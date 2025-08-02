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
interface ActivityProps {
  edit: string;

  type: string;
}
const AddActivity: React.FC<ActivityProps> = ({ edit, type }) => {
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

  const [assignedCoreSegment, setAssignedCoreSegment] = useState<any>("");
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

  const getCoreSegment = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });
  useEffect(() => {
    const assignCoreSegment: any = getDefaultOption(getCoreSegment);
    setAssignedCoreSegment(assignCoreSegment);
  }, [getCoreSegment]);

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
  const getDefaultFormValues = () => {
    if (type === "competition") {
      return {
        planName: "",
        classification: null,
        startDate: null,
        endDate: null,
        location: "",
        gender: "Male",
        proficiencyLevel: {
          Professionals: true,
          "Amateurs/beginners": false,
          Open: false,
        },
        employeeType: {
          Military: true,
          Civilians: true,
          "Academy Cadets": false,
          All: false,
        },
      };
    } else if (type === "events") {
      return {
        planName: "",
        classification: "National Sports Event",
        startDate: null,
        endDate: null,

        location: "",

        gender: "Male",

        employeeType: {
          Military: false,
          Civilians: false,
          "Academy Cadets": false,
          All: false,
        },
      };
    } else if (type === "fitness") {
      return {
        planName: "",
        classification: null,
        startDate: null,
        endDate: null,
        location: "",
        other: "",
        gender: "Male",

        employeeType: {
          Military: true,
          Civilians: true,
          "Academy Cadets": false,
          All: false,
        },
        coreSegment: {
          "BMI(<18.5)": true,
          "BMI(18.5-24.9)": false,
          "BMI(25.0-29.9)": false,
          "BMI(>=30.0)": false,
        },
      };
    } else if (type === "training") {
      return {
        planName: "",
        classification: null,
        startDate: null,
        endDate: null,
        location: "",
        coreSegment: null,
        gender: "Male",
        employeeType: {
          Military: true,
          Civilians: true,
          "Academy Cadets": false,
          All: false,
        },
      };
    } else if (type === "awareness") {
      return {
        planName: "",
        classification: "Awareness Activities",
        startDate: null,
        activity_format: null,
        endDate: null,
        athleteType: null,
        location: "",
        platform: "",

        vPlatform: null,
        coreSegText: "",

        gender: "Male",
        employeeType: {
          Military: true,
          Civilians: true,
          "Academy Cadets": false,
          All: false,
        },
        coreSegment: "Yes",
      };
    }
  };
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: getDefaultFormValues(),
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
    let payload: any;
    if ((type = "competition")) {
      payload = {
        planName: data?.planName,
        classification: String(data?.classification),
        startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(data?.endDate).format("DD-MM-YYYY"),
        location: data?.location,
        gender: data?.gender,
        proficiency: data?.proficiencyLevel,
        employeeType: data?.employeeType,
      };
    } else if ((type = "events")) {
      payload = {
        planName: data?.planName,
        classification: data?.classification,
        startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(data?.endDate).format("DD-MM-YYYY"),
        location: data?.location,
        gender: data?.gender,
        employeeType: data?.employeeType,
      };
    } else if (type === "fitness") {
      payload = {
        planName: data?.planName,
        classification: String(data?.classification),
        startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(data?.endDate).format("DD-MM-YYYY"),
        location: data?.location,
        gender: data?.gender,
        employeeType: data?.employeeType,
        coreSegment: data?.coreSegment,
        other: data?.other,
      };
    } else if (type === "awareness") {
      payload = {
        planName: data?.planName,
        classification: data?.classification,
        activity_format: String(data?.activity_format),
        platform: String(data?.platform),
        startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(data?.endDate).format("DD-MM-YYYY"),
        vPlatform: String(data?.vplatform),

        coreSegment: data?.coreSegment,
        employeeType: data?.employeeType,
        gender: data?.gender,
        coreSegText: data?.coreSegText,
      };
    } else if (type === "training") {
      payload = {
        planName: data?.planName,
        classification: String(data?.classification),
        startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(data?.endDate).format("DD-MM-YYYY"),
        location: data?.location,
        coreSegment: String(data?.coreSegment),
        gender: data?.gender,
        employeeType: data?.employeeType,
      };
    }

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
                      {type === "competition" ||
                      type === "fitness" ||
                      type === "training" ? (
                        <Grid item xs={12} md={edit ? 12 : 5.75}>
                          <DropDown
                            name="classification"
                            control={control}
                            label="Activity Classification (MOI)"
                            placeholder="Select Activity Classification"
                            options={
                              assignedSportsOption && assignedSportsOption
                            }
                            multiple={false}
                            variant="outlined"
                            icon={true}
                            required={true}
                            disabled={false}
                          />
                        </Grid>
                      ) : (
                        (type === "events" || type === "awareness") && (
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
                        )
                      )}
                      {type === "awareness" && (
                        <>
                          <Grid item xs={12} md={edit ? 12 : 5.75}>
                            <DropDown
                              name="activity_format"
                              control={control}
                              label="Activity Format"
                              placeholder="Select Activity Format"
                              options={
                                assignedSportsOption && assignedSportsOption
                              }
                              multiple={false}
                              variant="outlined"
                              icon={true}
                              required={true}
                              disabled={false}
                            />
                          </Grid>
                          <Grid item xs={12} md={edit ? 12 : 5.75}>
                            <DropDown
                              name="platform"
                              control={control}
                              label="Medium/Platform"
                              placeholder="Select Platform"
                              options={
                                assignedSportsOption && assignedSportsOption
                              }
                              multiple={false}
                              variant="outlined"
                              icon={true}
                              required={true}
                              disabled={false}
                            />
                          </Grid>
                        </>
                      )}
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
                            // maxDate={
                            //   campEndDate
                            //     ? moment(campEndDate).add(1, "day")
                            //     : moment().add(10, "years")
                            // }
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
                            // disabled={!minEndDate.isValid()}
                            defaultValue={endDate}
                            // maxDate={moment().add(10, "years")}
                            className="Text-field-customise"
                            rules={
                              // isMinEndDateValid ?
                              { required: "End Date is required" }
                              //   : { required: "" }
                            }
                          />
                        </Grid>
                      </Grid>
                      {type === "awareness" && (
                        <Grid item xs={12} md={edit ? 12 : 5.75}>
                          <DropDown
                            name="vPlatform"
                            control={control}
                            label="Virtual Platform"
                            placeholder="Select Virtual Platform"
                            options={
                              assignedSportsOption && assignedSportsOption
                            }
                            multiple={false}
                            variant="outlined"
                            icon={true}
                            required={true}
                            disabled={false}
                          />
                        </Grid>
                      )}
                      {type != "awareness" && (
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
                                message:
                                  "Location cannot exceed 100 characters",
                              },
                              required: "Location is required",
                            }}
                          />
                        </Grid>
                      )}
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
                      {(type === "competition" ||
                        type === "events" ||
                        type === "fitness" ||
                        type === "training" ||
                        type === "awareness") && (
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
                      )}
                      {type === "competition" && (
                        <Grid item xs={12} md={edit ? 12 : 5.75}>
                          <CustomCheckboxGroup
                            name="proficiencyLevel"
                            control={control}
                            label="Proficiency Level"
                            required={true}
                            options={[
                              {
                                value: "Professionals",
                                label: "Professionals",
                              },
                              {
                                value: "Amateurs/beginners",
                                label: "Amateurs/beginners",
                              },
                              { value: "Open", label: "Open" },
                            ]}
                          />
                        </Grid>
                      )}
                      {(type === "competition" ||
                        type === "events" ||
                        type === "fitness" ||
                        type === "training" ||
                        type === "awareness") && (
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
                      )}
                      {type === "fitness" && (
                        <>
                          <Grid item xs={12} md={edit ? 12 : 5.75}>
                            <CustomCheckboxGroup
                              name="coreSegment"
                              control={control}
                              label="Core Segment"
                              required={true}
                              options={[
                                { value: "BMI(<18.5)", label: "BMI(<18.5)" },
                                {
                                  value: "BMI(18.5-24.9)",
                                  label: "BMI(18.5-24.9)",
                                },
                                {
                                  value: "BMI(25.0-29.9)",
                                  label: "BMI(25.0-29.9)",
                                },
                                { value: "BMI(>=30.0)", label: "BMI(>=30.0)" },
                              ]}
                            />
                          </Grid>
                          <Grid item xs={12} md={edit ? 12 : 5.75}></Grid>

                          <Grid item xs={12} md={edit ? 12 : 5.75}>
                            <CustomTextField
                              name="other"
                              label="Other"
                              control={control}
                              required={false}
                              disabled={false}
                            />
                          </Grid>
                        </>
                      )}
                      {type === "training" && (
                        <Grid item xs={12} md={edit ? 12 : 5.75}>
                          <DropDown
                            name="coreSegment"
                            control={control}
                            label="Core Segment"
                            placeholder="Select Core Segment"
                            options={assignedCoreSegment && assignedCoreSegment}
                            multiple={false}
                            variant="outlined"
                            icon={true}
                            required={true}
                            disabled={false}
                          />
                        </Grid>
                      )}
                      {type === "awareness" && (
                        <>
                          <Grid item xs={12} md={edit ? 12 : 5.75}>
                            <CustomRadioGroup
                              name="coreSegment"
                              control={control}
                              label="Core Segment"
                              options={[
                                { value: "Yes", label: "Yes" },
                                { value: "No", label: "No" },
                              ]}
                              required={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={edit ? 12 : 5.75}></Grid>
                          <Grid item xs={12} md={edit ? 12 : 5.75}>
                            <CustomTextField
                              name="coreSegText"
                              placeholder="Enter Core Segment"
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
                                    "Core Segment cannot exceed 100 characters",
                                },
                                required: "Core Segment is required",
                              }}
                            />
                          </Grid>
                        </>
                      )}
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
export default AddActivity;

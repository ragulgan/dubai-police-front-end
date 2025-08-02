import CustomSnackbar from "@/components/CustomSnackbar";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import {
  Grid,
  Button,
  Box,
  SnackbarCloseReason,
  CircularProgress,
  Chip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import FacilitiesTimePicker from "./FacilitiesTimePicker";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import _, { isEmpty, isNull } from "lodash";
import {
  addResearchAndFacilities,
  clearResearchAndFacilitiesAddState,
} from "@/redux/slices/researchFacilities/researchFacilitiesAddSlice";
import { useRouter } from "next/router";
import { listFacilitiesTypes } from "@/redux/slices/researchFacilities/GetFacilitiesTypesList";
import {
  clearResearchAndFacilitiesUpdateState,
  updateResearchAndFacilities,
} from "@/redux/slices/researchFacilities/researchFacilitiesUpdateSlice";
import {
  checkFacilitiesAvailablility,
  clearCheckFacilitiesAvailablilityState,
} from "@/redux/slices/researchFacilities/CheckFacilitiesAvailablility";

const CreateFacilitiesForm = (props: any) => {
  const dispatch: AppDispatch = useDispatch();
  const GetFacilitiesTypesList = useSelector(
    (state: any) =>
      state.getFacilitiesTypesList && state.getFacilitiesTypesList?.data
  );
  const facilitiesAddData = useSelector(
    (state: RootState) => state.addResearchAndFacilities
  );
  const facilitiesUpdateData = useSelector(
    (state: RootState) => state.updateResearchAndFacilities
  );
  const CheckFacilitiesAvailablility = useSelector(
    (state: any) =>
      state.CheckFacilitiesAvailablility &&
      state.CheckFacilitiesAvailablility?.data
  );
  const CheckFacilities = useSelector(
    (state: any) => state.CheckFacilitiesAvailablility
  );
  const router = useRouter();
  const { date } = router.query;
  const {
    edit,
    editResearchFacilitiesData,
    id,
    onClose,
    setIsUpdated,
    pageView,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [facilityTypeOption, setfacilityTypeOption] = useState<any>("");
  const [otherData, setOtherData] = useState<any>("");
  const facilityTypeList = useSelector((state: RootState) => state?.getFacilityTypeList && Number(state?.getFacilityTypeList?.code) === 200 ? state?.getFacilityTypeList.data : null);
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      facilityType: "",
      facilityDate: null,
      startTime: "",
      endTime: "",
      purposeOfFacility: "",
      othersFacility: ""
    },
  });
  const othersFacilityType = watch("facilityType");
  useEffect(() => {
    if (othersFacilityType) {
      const match = facilityTypeOption.find(
        (item: any) => item.value === othersFacilityType
      );
      setOtherData(match ? match.label : "");
    }
  }, [othersFacilityType, facilityTypeOption]);

  useEffect(() => {
    const payload = {};
    dispatch(listFacilitiesTypes({ url: "/GetFacilitiesTypesList", payload }));
  }, []);

  useEffect(() => {
    if (!isEmpty(facilityTypeList)) {
      const facilitiesTypes: any = getDefaultOption(facilityTypeList);
      setfacilityTypeOption(facilitiesTypes);
    }
  }, [facilityTypeList]);

  const getDefaultOption = (FacilitiesTypesList: any) => {
    const defaultOptions = [];
    for (const item in FacilitiesTypesList) {
      defaultOptions.push({
        label: FacilitiesTypesList[item].name,
        value: FacilitiesTypesList[item].id,
      });
    }
    return defaultOptions;
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

  const handleReset = () => {
    reset({
      facilityType: "",
      facilityDate: null,
      startTime: "",
      endTime: "",
      purposeOfFacility: "",
      othersFacility: ""
    });
    setAvailability("");
  };
  const [availability, setAvailability] = useState<any>("");
  const facilityType = useWatch({ control, name: "facilityType" });
  const facilityDate = useWatch({ control, name: "facilityDate" });
  const startTime = useWatch({ control, name: "startTime" });
  const endTime = useWatch({ control, name: "endTime" });

  const checkAvailability = async () => {
    if (!facilityType || !facilityDate || !startTime || !endTime) return;

    const Payload: any = {
      facilityID: edit ? Number(id) : 0,
      facilityType: facilityType,
      facilityDate: dayjs(facilityDate).format("DD-MM-YYYY"),
      startTime: isNull(startTime) ? "" : dayjs(startTime).format("hh:mm A"),
      endTime: isNull(endTime) ? "" : dayjs(endTime).format("hh:mm A"),
    };
    dispatch(
      checkFacilitiesAvailablility({
        url: "/CheckFacilitieAvailablility",
        payload: Payload,
      })
    );
  };

  useEffect(() => {
    if (date) {
      setValue("facilityDate", moment(String(date), "YYYY-MM-DD"));
    }
  }, [date]);

  useEffect(() => {
    if (edit) {
      setAvailability("Available");
      // following condition is to check
      // if formdata and edit data are equal
      //  and not to call availability api unneccaryly
      const facilityTypeEqual =
        String(facilityType) ===
        editResearchFacilitiesData?.data[0]?.facilityType;
      const facilityDateEqual =
        !!facilityDate &&
        !!editResearchFacilitiesData?.data[0]?.facilityDate &&
        dayjs(facilityDate).format("DD/MM/YYYY") ===
        editResearchFacilitiesData?.data[0]?.facilityDate;
      const startTimeEqual =
        !!startTime &&
        !!editResearchFacilitiesData?.data[0]?.startTime &&
        dayjs(startTime).format("hh:mm A") ===
        editResearchFacilitiesData?.data[0]?.startTime;
      const endTimeEqual =
        !!endTime &&
        !!editResearchFacilitiesData?.data[0]?.endTime &&
        dayjs(endTime).format("hh:mm A") ===
        editResearchFacilitiesData?.data[0]?.endTime;
      if (
        !(
          facilityTypeEqual &&
          facilityDateEqual &&
          startTimeEqual &&
          endTimeEqual
        )
      ) {
        checkAvailability();
      }
    } else {
      checkAvailability();
    }
  }, [facilityType, facilityDate, startTime, endTime]);

  useEffect(() => {
    if (CheckFacilities?.data?.availability) {
      setAvailability(
        CheckFacilities.data.availability === "Yes"
          ? "Available"
          : "Not Available"
      );
    }
  }, [CheckFacilities]);

  const onSubmit = (data: any) => {
    if (edit) {
      const updatePayload: any = {
        facilityID: Number(id),
        facilityType: String(data?.facilityType),
        othersFacility: String(data?.othersFacility),
        facilityDate: dayjs(data?.facilityDate).format("DD-MM-YYYY"),
        startTime: isNull(data?.startTime)
          ? ""
          : dayjs(data?.startTime).format("hh:mm A"),
        endTime: isNull(data?.endTime)
          ? ""
          : dayjs(data?.endTime).format("hh:mm A"),
        purposeOfFacility: data?.purposeOfFacility,
        createdByModule: "Coach",
      };

      dispatch(
        updateResearchAndFacilities({
          url: "/UpdateFacilitiesByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        facilityType: String(data?.facilityType),
        othersFacility: String(data?.othersFacility),
        facilityDate: dayjs(data?.facilityDate).format("DD-MM-YYYY"),
        startTime: isNull(data?.startTime)
          ? ""
          : dayjs(data?.startTime).format("hh:mm A"),
        endTime: isNull(data?.endTime)
          ? ""
          : dayjs(data?.endTime).format("hh:mm A"),
        purposeOfFacility: data?.purposeOfFacility,
        createdByModule: "Coach", //after login implementation need to update
        //after login implementation need to update
      };
      dispatch(
        addResearchAndFacilities({
          url: "/InsertFacilities",
          payload: payload,
        })
      );
    }
  };

  useEffect(() => {
    if (
      (facilitiesAddData && facilitiesAddData.code === 200) ||
      (facilitiesUpdateData && facilitiesUpdateData.code === 200)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearResearchAndFacilitiesUpdateState());
      dispatch(clearResearchAndFacilitiesAddState());
      dispatch(clearCheckFacilitiesAvailablilityState());
      setAvailability("");
      setTimeout(() => {
        if (edit) {
          setIsUpdated(true);
          onClose();
          setTimeout(() => {
            setIsUpdated(false);
          }, 1000);
        } else {
          router.push(
            `/researchAndFacilities?module=facilities&pageView=${pageView}`
          );
        }
      }, 1000);
    } else if (
      (facilitiesAddData && facilitiesAddData.code === 500) ||
      (facilitiesUpdateData && facilitiesUpdateData.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearResearchAndFacilitiesUpdateState());
      dispatch(clearResearchAndFacilitiesAddState());
      dispatch(clearCheckFacilitiesAvailablilityState());
    } else if (
      (facilitiesAddData && facilitiesAddData.code === 409) ||
      (facilitiesUpdateData && facilitiesUpdateData.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearResearchAndFacilitiesUpdateState());
        dispatch(clearResearchAndFacilitiesAddState());
        dispatch(clearCheckFacilitiesAvailablilityState());
      }, 2000);
    }
  }, [facilitiesAddData, facilitiesUpdateData]);

  useEffect(() => {
    if (editResearchFacilitiesData && editResearchFacilitiesData.code === 200) {
      const facilityType =
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0]?.facilityType &&
        Number(editResearchFacilitiesData?.data[0]?.facilityType);
      const othersFacilityType =
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0]?.othersFacility
      setValue("facilityType", facilityType);
      setValue("othersFacility", othersFacilityType);
      setValue(
        "facilityDate",
        editResearchFacilitiesData?.data[0]?.facilityDate === "-"
          ? null
          : moment(
            editResearchFacilitiesData?.data[0]?.facilityDate,
            "DD/MM/YYYY"
          )
      );
      setValue(
        "startTime",
        editResearchFacilitiesData &&
          editResearchFacilitiesData?.data[0]?.startTime !== "" &&
          editResearchFacilitiesData?.data[0]?.startTime !== "-"
          ? moment(editResearchFacilitiesData?.data[0]?.startTime, "hh:mm A")
          : null
      );
      setValue(
        "endTime",
        editResearchFacilitiesData &&
          editResearchFacilitiesData?.data[0]?.endTime !== "" &&
          editResearchFacilitiesData?.data[0]?.endTime !== "-"
          ? moment(editResearchFacilitiesData?.data[0]?.endTime, "hh:mm A")
          : null
      );
      setValue(
        "purposeOfFacility",
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0]?.purposeOfFacility
      );
    }
  }, [editResearchFacilitiesData]);

  const handleCancel = () => {
    if (edit) {
      onClose();
    } else {
      router.push(
        `/researchAndFacilities?module=facilities&pageView=${pageView}`
      );
    }
  };

  useEffect(() => {
    if (!edit) {
      setAvailability("---");
    }
  }, [edit]);

  return (
    <>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Facilities ${edit ? "Updated" : "Added"} successfully!`
              : (facilitiesAddData && facilitiesAddData?.message) ||
              (facilitiesUpdateData && facilitiesUpdateData?.message)
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Grid container spacing={0}>
        {edit ? null : (
          <Grid
            item
            xs={12}
            sx={{
              textAlign: "end",
            }}
          >
            <Button
              variant="outlined"
              className="text-capitalize dubai-med"
              color="secondary"
              sx={{ height: "45px" }}
              onClick={handleReset}
            >
              Clear form
            </Button>
          </Grid>
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
        >
          <Box width="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={12}>
                  <Grid
                    container
                    item
                    xs={12}
                    md={12}
                    spacing={2}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={12} md={5.75} mb={1}>
                      <DropDown
                        name="facilityType"
                        control={control}
                        label="Facility Type"
                        placeholder="Select Facility Type"
                        options={facilityTypeOption && facilityTypeOption}
                        multiple={false}
                        variant="outlined"
                        required={true}
                        rules={{
                          required: "Facility Type is required",
                        }}
                      />
                      {
                        otherData === "Others" ? (
                          <Grid mt={2}>
                            <CustomTextField
                              name="othersFacility"
                              label=""
                              placeholder="Enter Others Facility"
                              control={control}
                              rules={{
                                required: otherData === "Others" ? "Other Facility Type is required" : false,
                                pattern: {
                                  value: /^[a-zA-Z0-9\s,.()/:-]*$/,
                                  message: "Only alphanumeric characters & hyphens are allowed",
                                },
                                maxLength: {
                                  value: 100,
                                  message: "Others Facility cannot exceed 100 characters",
                                },
                              }}
                            />
                          </Grid>
                        ) : null
                      }
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <TrainingCampCustomDatePicker
                        control={control}
                        name="facilityDate"
                        label="Date"
                        boxmb={0.8}
                        required={true}
                        minDate={moment().startOf("day").add(1, "day")}
                        maxDate={moment().add(10, "years")}
                        className="Text-field-customise"
                        rules={{
                          required: "Date is required",
                        }}
                      />
                    </Grid>
                    <Grid container spacing={2} item xs={12} md={5.75}>
                      <Grid item xs={12} md={6}>
                        <FacilitiesTimePicker
                          control={control}
                          name="startTime"
                          label="Start Time"
                          boxmb={0.7}
                          required={true}
                          rules={{
                            required: "Start Time is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FacilitiesTimePicker
                          control={control}
                          name="endTime"
                          label="End Time"
                          boxmb={0.7}
                          required={true}
                          startTime={
                            watch("startTime")
                              ? moment(watch("startTime")).add(1, "hour")
                              : null
                          }
                          rules={{
                            required: "End Time is required",
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="purposeOfFacility"
                        label="Purpose Of Facility"
                        placeholder="Enter Purpose Of Facility"
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9\s,.()/:-]*$/,
                            message: "Only Alphanumberic & hypens are allowed",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Purpose Of Facility cannot exceed 100 characters",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography
                          className="bukra"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#58585B",
                          }}
                        >
                          Availability:
                        </Typography>
                        <Chip
                          label={
                            CheckFacilities.loading ? (
                              <CircularProgress
                                size={15}
                                sx={{ color: "#FFFFFF" }}
                              />
                            ) : availability === "Available" ? (
                              "Available"
                            ) : availability === "Not Available" ? (
                              "Not Available"
                            ) : (
                              "---"
                            )
                          }
                          sx={{
                            backgroundColor:
                              availability === "Not Available"
                                ? "#E4002B"
                                : "#008755",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
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
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1, paddingX: "16px" }}
                  onClick={handleCancel}
                  className="cancel-button text-capitalize dubai-med"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="text-capitalize dubai-med cancel-button"
                  sx={{ paddingX: "16px" }}
                  disabled={
                    facilitiesAddData.loading ||
                    facilitiesUpdateData?.loading ||
                    CheckFacilities?.data?.availability === "No"
                  }
                  onClick={handleSubmit(onSubmit)}
                >
                  {facilitiesAddData.loading ||
                    facilitiesUpdateData?.loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : edit ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default CreateFacilitiesForm;

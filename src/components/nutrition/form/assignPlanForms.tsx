"use client";
import { Button, Grid, SnackbarCloseReason, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import { usePathname } from "next/navigation";
import _ from "lodash";
import CustomTextField from "../../Fields/CustomTextField";
import CustomDatePicker from "../../Fields/CustomDatePicker";
import { useRouter } from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment";
import ReactSelect from "../../Fields/CustomReactSelect";
import { getPlanListAPI } from "@/redux/slices/planMenu/getPlanListSlice";
import {
  addNutrition,
  clearNutritionAddState,
} from "@/redux/slices/nutrition/NutritionAddSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import { listNutrition } from "@/redux/slices/nutrition/NutritionListSlice";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import { getLocalStorage } from "@/utils/helper";
import { getNotificationModuleByID } from "@/redux/slices/notification/getNotificationModuleByID";
import { addNotification } from "@/redux/slices/notification/NotificationAddSlice";

const AssignPlanForms: React.FC<any> = () => {
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const [AthletesOption, setAthletesOption] = useState();
  const [SelectedAthletesOption, setSelectedAthletesOption] =
    useState<any>(null);
  const [SelectedPlanNameOption, setSelectedPlanNameOption] =
    useState<any>(null);
  const [minEndDate, setMinEndDate] = useState(moment());
  const [errors, setErrors] = useState<any>({});
  const [heightUnit, setHeightUnit] = useState<any>(null);
  const [weightUnit, setWeightUnit] = useState<any>(null);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const athleteData = getAthleteList && getAthleteList?.data;
  const athleteEditData = useSelector((state: any) => state?.athleteEdit?.data);
  const getPlanList = useSelector((state: any) => {
    return state.getPlanList;
  });
  const AddNutrition = useSelector((state: any) => state.addNutrition);

  const [notificationMessage, setNotificationMessage] = useState("");
  const GetNotificationModuleByIDData = useSelector((state: any) => {
    return state.getNotificationModuleByID;
  });
  const getCurrentSport = getLocalStorage("sport");

  useEffect(() => {
    if (process.env.ENABLE_NOTIFICATION === "yes") {
      const payload: any = {
        moduleID: "122",
      };
      dispatch(
        getNotificationModuleByID({
          url: "/GetNotificationModuleByID",
          payload: payload,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (
      GetNotificationModuleByIDData &&
      GetNotificationModuleByIDData.code === 200
    ) {
      setNotificationMessage(GetNotificationModuleByIDData?.data[0]?.message);
    } else if (GetNotificationModuleByIDData?.code !== 200) {
      console.error(
        "Failed to fetch data:",
        GetNotificationModuleByIDData?.message
      );
    }
  }, [GetNotificationModuleByIDData]);

  const getDefaultOption = (planNames: any) => {
    const defaultOptions = [];
    for (const item in planNames) {
      defaultOptions.push({
        label: planNames[item].nutritionplanName,
        value: planNames[item].nutritionplanID,
      });
    }
    return defaultOptions;
  };

  const planOption = getDefaultOption(getPlanList.data);

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (
      selectedOption &&
      selectedOption.label === SelectedAthletesOption?.label
    ) {
      setSelectedAthletesOption("");
    } else {
      setSelectedAthletesOption(selectedOption);
      setErrors({ ...errors, athletes: "" });
      const payload: any = {
        athleteID: selectedOption && selectedOption.value,
        sportID: Number(teamId),
      };
      dispatch(editAthlete(payload));
    }
  };

  const handleChangePlanName = (selectedOption: any | null): void => {
    if (
      selectedOption &&
      selectedOption.label === SelectedPlanNameOption?.label
    ) {
      setSelectedPlanNameOption("");
    } else {
      setSelectedPlanNameOption(selectedOption);
      setErrors({ ...errors, plan: "" });
    }
  };

  const { handleSubmit, control, setValue, watch, reset } = useForm<any>({
    defaultValues: {
      athletes: null,
      plan: null,
      weight: "",
      height: "",
      startDate: null,
      endDate: null,
      nutritionistComment: "",
    },
  });
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const athletes = watch("athletes");
  const plan = watch("plan");

  const getDefaultOptions = (AthleteList: any) => {
    const defaultOptions = [];
    for (const item in AthleteList) {
      defaultOptions.push({
        label: AthleteList[item].firstName,
        value: AthleteList[item].athleteID,
      });
    }
    return defaultOptions;
  };

  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    const validationErrors: any = {};
    if (_.isEmpty(formData.endDate)) {
      validationErrors.endDate = "Please select an end date.";
      document.getElementById("endDate")?.focus();
    }
    if (_.isEmpty(formData.startDate)) {
      validationErrors.startDate = "Please select an start date.";
      document.getElementById("startDate")?.focus();
    }
    if (_.isEmpty(formData.plan)) {
      validationErrors.plan = "Please select an plan name.";
      document.getElementById("plan")?.focus();
    }
    if (_.isEmpty(formData.athletes)) {
      validationErrors.athletes = "Please select an athlete.";
      document.getElementById("athletes")?.focus();
    }

    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const payload = {
        sportID: Number(teamId),
        athleteID: formData?.athletes?.value,
        planID: formData?.plan?.value,
        weight: formData?.weight,
        height: formData?.height,
        startDate: moment(formData?.startDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        endDate: moment(formData?.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        nutritionistComment: formData?.nutritionistComment,
      };
      dispatch(addNutrition({ url: "/InsertNutrition", payload }));
    }
  };

  useEffect(() => {
    if (
      AddNutrition &&
      AddNutrition.code === 200 &&
      AddNutrition.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");

      // notification
      if (process.env.ENABLE_NOTIFICATION === "yes") {
        const assignPlanLink = `${process.env.BASE_DOMAIN}teams/${getCurrentSport}/nutrition/view/${AddNutrition?.data?.nutritionID}`;
        const updatedMessage = notificationMessage.replace(
          "[Link]",
          `<a href="${assignPlanLink}">click here</a>`
        );

        const NotificationPayload: any = {
          moduleID: 122,
          sportID: Number(teamId),
          userID: String(athletes.value) || "",
          name: plan?.label,
          date: moment(startDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
          message: updatedMessage,
        };
        dispatch(
          addNotification({
            url: "/InsertNotification",
            payload: NotificationPayload,
          })
        );
      }

      dispatch(clearNutritionAddState());
      setTimeout(() => {
        router.push(`/teams/${teamId}/nutrition`);
      }, 2000);
    } else if (
      AddNutrition &&
      AddNutrition.code === 500 &&
      AddNutrition.status === "failed"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearNutritionAddState());
    }
  }, [AddNutrition]);

  useEffect(() => {
    const athletes: any = getDefaultOptions(athleteData);
    setAthletesOption(athletes);
  }, [athleteData]);

  useEffect(() => {
    if (!_.isEmpty(teamId)) {
      const payloads = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamId),
      };
      dispatch(getAthleteListAPI(payloads));
    }
  }, [teamId]);

  useEffect(() => {
    if (!_.isEmpty(teamId)) {
      const payloads = {
        sportID: Number(teamId),
      };
      dispatch(getPlanListAPI(payloads));
    }
  }, [teamId]);

  useEffect(() => {
    setMinEndDate(moment(startDate, "DD/MM/YYYY"));
  }, [startDate]);

  useEffect(() => {
    if (!_.isEmpty(athleteEditData)) {
      setValue("weight", athleteEditData && athleteEditData[0]?.weight);
      setValue("height", athleteEditData && athleteEditData[0]?.height);
      setWeightUnit(athleteEditData && athleteEditData[0]?.weightUnit);
      setHeightUnit(athleteEditData && athleteEditData[0]?.heightUnit);
    }
  }, [athleteEditData]);

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
        reset({
          athletes: null,
          plan: null,
          weight: "",
          height: "",
          startDate: null,
          endDate: null,
          nutritionistComment: "",
        });
        setSnackbarOpen(false);
        dispatch(clearNutritionAddState());
        const payload = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamId),
        };
        dispatch(listNutrition({ url: "/GetNutritionList", payload }));
      }, 1500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  return (
    <Grid container columnSpacing={5} rowSpacing={3} component={"form"} mt={2}>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Nutrition Plan ${"Added"} successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Grid item sm={12} lg={6}>
        <Typography gutterBottom className="typography textfield-label bukra">
          Athlete Name
          <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
        </Typography>
        <ReactSelect
          control={control}
          name="athletes"
          id="athletes"
          classNamePrefix="select"
          handleChangeReactSelect={handleChangeAthletes}
          options={AthletesOption}
          value={
            SelectedAthletesOption && SelectedAthletesOption.label === ""
              ? null
              : SelectedAthletesOption
          }
          isDisabled={!AthletesOption}
          placeholder={"Select Athlete Name"}
          isClearable={true}
        />
        {errors.athletes && (
          <Typography variant="caption" color="error">
            {errors.athletes}
          </Typography>
        )}
      </Grid>
      <Grid item sm={12} lg={6}>
        <Typography gutterBottom className="typography textfield-label bukra">
          Plan Name
          <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
        </Typography>
        <ReactSelect
          control={control}
          name="plan"
          id="plan"
          classNamePrefix="select"
          handleChangeReactSelect={handleChangePlanName}
          options={planOption}
          value={
            SelectedPlanNameOption && SelectedPlanNameOption.label === ""
              ? null
              : SelectedPlanNameOption
          }
          isDisabled={!AthletesOption}
          placeholder={"Select Plan Name"}
          isClearable={true}
        />
        {errors.plan && (
          <Typography variant="caption" color="error">
            {errors.plan}
          </Typography>
        )}
      </Grid>
      <Grid item sm={12} lg={6}>
        <CustomTextField
          name="weight"
          label={`Weight (${weightUnit ? weightUnit : "KG"})`}
          placeholder="Weight is auto-filled"
          control={control}
          disabled={true}
        />
      </Grid>
      <Grid item sm={12} lg={6}>
        <CustomTextField
          control={control}
          name="height"
          label={`Height (${heightUnit ? heightUnit : "CM"})`}
          placeholder="Height is auto-filled"
          disabled={true}
        />
      </Grid>
      <Grid item sm={12} lg={6}>
        <CustomDatePicker
          control={control}
          label="Start Date"
          name="startDate"
          required={true}
          minDate={moment()}
          maxDate={moment().add(10, "years")}
          setErrors={setErrors}
          errors={errors}
          module={"nutrition"}
        />
        {errors.startDate && (
          <Typography variant="caption" color="error">
            {errors.startDate}
          </Typography>
        )}
      </Grid>
      <Grid item sm={12} lg={6}>
        <CustomDatePicker
          control={control}
          label="End Date"
          name="endDate"
          required={true}
          minDate={minEndDate}
          maxDate={moment().add(10, "years")}
          setErrors={setErrors}
          errors={errors}
          module={"nutrition"}
        />
        {errors.endDate && (
          <Typography variant="caption" color="error">
            {errors.endDate}
          </Typography>
        )}
      </Grid>
      <Grid item sm={12} lg={6}>
        <CustomTextField
          name="nutritionistComment"
          label="Nutritionist Comment"
          placeholder="Enter Nutritionist Comment"
          control={control}
          textarea={true}
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 %.,/'"()-:;!?&\n]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 2000,
              message: "Nutritionist Comment cannot exceed 2000 characters",
            },
            required: false,
          }}
        />
      </Grid>
      <Grid item sm={12} lg={12} textAlign={"end"} mt={5}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mr: 1 }}
          onClick={() => {
            router.back();
          }}
          className="cancel-button text-capitalize dubai-med"
        >
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          onClick={handleSubmit(onSubmit)}
          loading={AddNutrition.loading}
          variant="contained"
          className="cancel-button text-capitalize dubai-med"
          disabled={AddNutrition && AddNutrition?.loading}
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default AssignPlanForms;
